import { memo, useId } from 'react';

/* ============ DRINK SKETCH ============ */
/**
 * DrinkSketch — hand-drawn ink-line cup with Claude warm color blocking
 * Renders a sketchy SVG cup that responds to: base, temp, milk, sugar, intensity
 */

const COFFEE_COLOR = '#3F2A1D';   // deep coffee ink
const TEA_COLOR    = '#B8804A';   // amber tea
const CONDENSED    = '#F4E5B8';   // condensed milk yellow-cream
const EVAP         = '#FBF6E9';   // evaporated milk near-white
const ICE_COLOR    = '#A6C8D9';   // dusty blue ice
const WATER        = '#DCE9EE';   // pale water tint
const INK          = '#1A1815';   // sketch ink

// Hand-drawn hatching (diagonal lines) for shading
function Hatch({ x, y, w, h, color, density = 6, opacity = 0.18, angle = -30, seed = 0 }) {
  const lines = [];
  const spacing = h / density;
  for (let i = 0; i < density + 2; i++) {
    const yy = y - h + i * spacing + (Math.sin(seed + i) * 1.2);
    lines.push(
      <line
        key={i}
        x1={x - 4}
        y1={yy}
        x2={x + w + 4}
        y2={yy + w * Math.tan((angle * Math.PI) / 180)}
        stroke={color}
        strokeWidth={0.8}
        opacity={opacity}
        strokeLinecap="round"
      />
    );
  }
  return <g style={{ clipPath: `inset(0)` }}>{lines}</g>;
}

const DrinkSketch = ({ drink, size = 'lg' }) => {
  // Unique per instance: the same drink can be on screen twice (order + menu).
  const clipId = `cup-clip-${useId().replace(/[^\w-]/g, '')}`;
  const isLg = size === 'lg';
  const W = isLg ? 240 : 110;
  const H = isLg ? 320 : 150;

  // Cup geometry within viewBox (use viewBox so we can scale freely)
  const VB_W = 240;
  const VB_H = 320;

  // proportions
  const intensityFill = drink.intensity === 'more' ? 1 : drink.intensity === 'less' ? 0.32 : 0.62;
  const sugarPx = drink.sugar === 'no_sugar' ? 0 :
                  drink.sugar === 'less_less' ? 6 :
                  drink.sugar === 'less' ? 12 :
                  drink.sugar === 'normal' ? 18 : 28;

  // cup dimensions in viewBox
  const cupTop = 70;
  const cupBottom = 280;
  const cupTopX = drink.temp === 'iced' ? 36 : 50;
  const cupTopW = drink.temp === 'iced' ? 168 : 140;
  // tapered glass for iced, mug for hot
  const cupBotX = drink.temp === 'iced' ? 60 : 56;
  const cupBotW = drink.temp === 'iced' ? 120 : 132;

  // Liquid layout — fill from bottom up
  const liquidTop = cupTop + 10; // a bit of headroom
  const liquidBot = cupBottom - 4;
  const liquidHeight = liquidBot - liquidTop;

  // Layer heights
  const sugarH = sugarPx * 0.7;
  const milkBottomH = drink.milk === 'condensed' ? liquidHeight * 0.18 : 0;
  const milkTopH = drink.milk === 'evaporated' ? liquidHeight * 0.16 : 0;
  const drinkH = liquidHeight - sugarH - milkBottomH - milkTopH;
  const concentrateH = drinkH * intensityFill;
  const waterH = drinkH - concentrateH;

  // y coordinates (top of each layer)
  let cursor = liquidBot;
  const sugarY = cursor - sugarH; cursor = sugarY;
  const milkBotY = cursor - milkBottomH; cursor = milkBotY;
  const concentrateY = cursor - concentrateH; cursor = concentrateY;
  const waterY = cursor - waterH; cursor = waterY;
  const milkTopY = cursor - milkTopH;

  // Trapezoid x at a given y (linear interp between top & bottom)
  const xAt = (y) => {
    const t = (y - cupTop) / (cupBottom - cupTop);
    const lx = cupTopX + (cupBotX - cupTopX) * t;
    const rx = (cupTopX + cupTopW) + ((cupBotX + cupBotW) - (cupTopX + cupTopW)) * t;
    return [lx + 6, rx - 6]; // small inset so liquid sits inside the wobbly outline
  };

  // Build a slightly wobbly trapezoid clip for liquid layers
  const layerPath = (yTop, yBot, seed) => {
    const [lt, rt] = xAt(yTop);
    const [lb, rb] = xAt(yBot);
    const w = (i) => Math.sin(seed * 3.1 + i * 1.7) * 1.2;
    return `M ${lt + w(0)} ${yTop + w(1)} 
            C ${lt + (rt - lt) * 0.3 + w(2)} ${yTop - 1 + w(3)}, ${lt + (rt - lt) * 0.7 + w(4)} ${yTop + 1 + w(5)}, ${rt + w(6)} ${yTop + w(7)}
            L ${rb + w(8)} ${yBot + w(9)}
            L ${lb + w(10)} ${yBot + w(11)} Z`;
  };

  // Cup outline (wobbly)
  const cupOutline = () => {
    const w = (i) => Math.sin(i * 1.7) * 1.4;
    const lipL = cupTopX, lipR = cupTopX + cupTopW;
    const botL = cupBotX, botR = cupBotX + cupBotW;
    // top rim ellipse-ish
    return `
      M ${lipL + w(0)} ${cupTop + w(1)}
      C ${lipL + (lipR - lipL) * 0.3 + w(2)} ${cupTop + 8 + w(3)},
        ${lipL + (lipR - lipL) * 0.7 + w(4)} ${cupTop + 8 + w(5)},
        ${lipR + w(6)} ${cupTop + w(7)}
      C ${lipL + (lipR - lipL) * 0.7 + w(8)} ${cupTop - 6 + w(9)},
        ${lipL + (lipR - lipL) * 0.3 + w(10)} ${cupTop - 6 + w(11)},
        ${lipL + w(12)} ${cupTop + w(13)}
      Z
    `;
  };

  const cupBody = () => {
    const w = (i) => Math.sin(i * 1.3 + 5) * 1.5;
    return `
      M ${cupTopX + w(0)} ${cupTop + w(1)}
      L ${cupBotX + w(2)} ${cupBottom + w(3)}
      C ${cupBotX + cupBotW * 0.3 + w(4)} ${cupBottom + 6 + w(5)},
        ${cupBotX + cupBotW * 0.7 + w(6)} ${cupBottom + 6 + w(7)},
        ${cupBotX + cupBotW + w(8)} ${cupBottom + w(9)}
      L ${cupTopX + cupTopW + w(10)} ${cupTop + w(11)}
    `;
  };

  // Steam squiggles for hot
  const steamPath = (offset, seed) => {
    const x = cupTopX + cupTopW * (0.3 + offset * 0.2);
    const baseY = cupTop - 4;
    const w = (i) => Math.sin(seed + i * 1.7) * 4;
    return `M ${x} ${baseY}
            C ${x - 8 + w(0)} ${baseY - 14}, ${x + 8 + w(1)} ${baseY - 28}, ${x + w(2)} ${baseY - 42}
            C ${x - 8 + w(3)} ${baseY - 56}, ${x + 8 + w(4)} ${baseY - 70}, ${x + w(5)} ${baseY - 84}`;
  };

  // Ice cubes — hand-drawn squares
  const iceCubes = drink.temp === 'iced' ? [
    { x: 80, y: liquidTop + 14, r: -8 },
    { x: 130, y: liquidTop + 22, r: 12 },
    { x: 100, y: liquidTop + 50, r: 5 },
    { x: 145, y: liquidTop + 60, r: -14 },
    { x: 78, y: liquidTop + 80, r: 18 },
  ] : [];

  // Sugar dots — stippling at bottom
  const sugarDots = [];
  if (sugarH > 0) {
    const count = drink.sugar === 'less_less' ? 3 :
                  drink.sugar === 'less' ? 6 :
                  drink.sugar === 'normal' ? 10 : 16;
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const [lx, rx] = xAt(sugarY + sugarH * 0.5);
      sugarDots.push({
        x: lx + (rx - lx) * (0.1 + t * 0.85) + Math.sin(i * 3.1) * 3,
        y: sugarY + sugarH * 0.4 + Math.cos(i * 2.7) * (sugarH * 0.3),
      });
    }
  }

  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H + 20}`} width={W} height={H} style={{ overflow: 'visible' }}>
      <defs>
        <clipPath id={clipId}>
          <path d={`
            M ${cupTopX} ${cupTop}
            L ${cupBotX} ${cupBottom}
            L ${cupBotX + cupBotW} ${cupBottom}
            L ${cupTopX + cupTopW} ${cupTop}
            Z
          `} />
        </clipPath>
      </defs>

      {/* Saucer / shadow under hot cup */}
      {drink.temp === 'hot' && (
        <ellipse
          cx={VB_W / 2}
          cy={cupBottom + 16}
          rx={cupBotW * 0.85}
          ry={9}
          fill="none"
          stroke={INK}
          strokeWidth="1.2"
          opacity="0.6"
          strokeDasharray="2 3"
        />
      )}

      {/* Steam */}
      {drink.temp === 'hot' && isLg && (
        <g opacity="0.45">
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={steamPath(i, i * 11)}
              stroke={INK}
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="3 4"
            >
              <animate
                attributeName="opacity"
                values="0.1;0.55;0.1"
                dur={`${2.4 + i * 0.4}s`}
                repeatCount="indefinite"
                begin={`${i * 0.5}s`}
              />
            </path>
          ))}
        </g>
      )}

      {/* Cup interior background (paper showing through) */}
      <path
        d={`
          M ${cupTopX} ${cupTop}
          L ${cupBotX} ${cupBottom}
          L ${cupBotX + cupBotW} ${cupBottom}
          L ${cupTopX + cupTopW} ${cupTop}
          Z
        `}
        fill={drink.temp === 'iced' ? '#FBF8F2' : '#FFFEFA'}
      />

      {/* Liquid layers, clipped to cup interior */}
      <g clipPath={`url(#${clipId})`}>
        {/* Sugar layer */}
        {sugarH > 0 && (
          <path d={layerPath(sugarY, liquidBot, 1)} fill="#FFFCF0" opacity="0.9" />
        )}
        {/* Condensed milk (bottom) */}
        {drink.milk === 'condensed' && (
          <>
            <path d={layerPath(milkBotY, sugarY, 2)} fill={CONDENSED} />
            {isLg && <Hatch x={cupBotX} y={sugarY} w={cupBotW} h={milkBottomH} color="#C9A85A" density={3} opacity={0.25} angle={-25} seed={2} />}
          </>
        )}
        {/* Concentrate (coffee/tea/yuanyang) */}
        {drinkH > 0 && (
          <>
            {drink.base === 'Coffee' && (
              <path d={layerPath(concentrateY, milkBotY, 3)} fill={COFFEE_COLOR} />
            )}
            {drink.base === 'Tea' && (
              <path d={layerPath(concentrateY, milkBotY, 3)} fill={TEA_COLOR} />
            )}
            {drink.base === 'Coffee + Tea' && (() => {
              const yTop = concentrateY;
              const yBot = milkBotY;
              const [ltL, ltR] = xAt(yTop);
              const [lbL, lbR] = xAt(yBot);
              const midTop = (ltL + ltR) / 2;
              const midBot = (lbL + lbR) / 2;
              const w = (i) => Math.sin(7.3 + i * 1.7) * 1.2;
              return (
                <>
                  {/* Tea on left half of the concentrate band */}
                  <path
                    d={`M ${ltL + w(0)} ${yTop + w(1)}
                        L ${midTop + w(2)} ${yTop + w(3)}
                        L ${midBot + w(4)} ${yBot + w(5)}
                        L ${lbL + w(6)} ${yBot + w(7)} Z`}
                    fill={TEA_COLOR}
                  />
                  {/* Coffee on right half of the concentrate band */}
                  <path
                    d={`M ${midTop + w(8)} ${yTop + w(9)}
                        L ${ltR + w(10)} ${yTop + w(11)}
                        L ${lbR + w(12)} ${yBot + w(13)}
                        L ${midBot + w(14)} ${yBot + w(15)} Z`}
                    fill={COFFEE_COLOR}
                  />
                </>
              );
            })()}
            {/* Hatching for richness */}
            {isLg && drinkH > 20 && (
              <Hatch
                x={cupBotX}
                y={milkBotY}
                w={cupBotW}
                h={concentrateH}
                color={drink.base === 'Tea' ? '#7A4E1F' : '#000'}
                density={Math.max(3, Math.floor(concentrateH / 18))}
                opacity={0.18}
                angle={-32}
                seed={4}
              />
            )}
          </>
        )}
        {/* Water dilution */}
        {waterH > 4 && (
          <path d={layerPath(waterY, concentrateY, 5)} fill={WATER} opacity="0.8" />
        )}
        {/* Evaporated milk (top) */}
        {drink.milk === 'evaporated' && (
          <path d={layerPath(milkTopY, waterY, 6)} fill={EVAP} />
        )}

        {/* Ice cubes */}
        {iceCubes.map((c, i) => {
          const sz = 22;
          return (
            <g key={i} transform={`translate(${c.x} ${c.y}) rotate(${c.r})`}>
              <rect
                x={-sz / 2}
                y={-sz / 2}
                width={sz}
                height={sz}
                fill={ICE_COLOR}
                opacity="0.55"
                stroke={INK}
                strokeWidth="1.2"
                rx="2"
              />
              <line x1={-sz / 2 + 3} y1={-sz / 2 + 3} x2={-sz / 2 + 8} y2={-sz / 2 + 3} stroke="#fff" strokeWidth="1.4" opacity="0.9" />
              <line x1={-sz / 2 + 3} y1={-sz / 2 + 3} x2={-sz / 2 + 3} y2={-sz / 2 + 8} stroke="#fff" strokeWidth="1.4" opacity="0.9" />
            </g>
          );
        })}

        {/* Sugar dots stippling */}
        {sugarDots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r="1.4" fill={INK} opacity="0.55" />
        ))}
      </g>

      {/* Cup outline — drawn on TOP so it caps everything */}
      {/* Top rim ellipse */}
      <path
        d={cupOutline()}
        fill="none"
        stroke={INK}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Front rim line (visible part) */}
      <path
        d={`M ${cupTopX} ${cupTop}
            C ${cupTopX + cupTopW * 0.3} ${cupTop + 8},
              ${cupTopX + cupTopW * 0.7} ${cupTop + 8},
              ${cupTopX + cupTopW} ${cupTop}`}
        fill="none"
        stroke={INK}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Body sides + bottom */}
      <path
        d={cupBody()}
        fill="none"
        stroke={INK}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Handle for hot cup */}
      {drink.temp === 'hot' && (
        <path
          d={`M ${cupTopX + cupTopW - 2} ${cupTop + 30}
              C ${cupTopX + cupTopW + 38} ${cupTop + 35},
                ${cupTopX + cupTopW + 38} ${cupTop + 90},
                ${cupTopX + cupTopW - 8} ${cupTop + 100}`}
          fill="none"
          stroke={INK}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      )}

      {/* Straw for iced */}
      {drink.temp === 'iced' && (
        <g>
          <path
            d={`M ${cupTopX + cupTopW * 0.62} ${cupTop - 30}
                L ${cupTopX + cupTopW * 0.55} ${cupBottom - 20}`}
            stroke="#D97757"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d={`M ${cupTopX + cupTopW * 0.62} ${cupTop - 30}
                L ${cupTopX + cupTopW * 0.55} ${cupBottom - 20}`}
            stroke={INK}
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
          />
          {/* candy stripes */}
          {[0, 1, 2, 3, 4].map(i => (
            <line
              key={i}
              x1={cupTopX + cupTopW * 0.62 - 3 + Math.sin(i) * 0.5}
              y1={cupTop - 30 + (cupBottom - cupTop) * 0.15 * (i + 1)}
              x2={cupTopX + cupTopW * 0.62 + 3 + Math.sin(i) * 0.5}
              y2={cupTop - 30 + (cupBottom - cupTop) * 0.15 * (i + 1) + 4}
              stroke="#FBF6E9"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          ))}
        </g>
      )}
    </svg>
  );
};

export default memo(DrinkSketch);
