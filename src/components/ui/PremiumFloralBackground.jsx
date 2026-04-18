import { motion } from 'framer-motion'

const MotionPath = motion.path
const MotionGroup = motion.g
const MotionDiv = motion.div

const palette = {
  line: 'rgba(132, 156, 125, 0.58)',
  lineSoft: 'rgba(153, 175, 146, 0.52)',
  leaf: 'rgba(92, 126, 99, 0.62)',
  leafVein: 'rgba(143, 171, 137, 0.54)',
  leafFill: 'rgba(182, 206, 176, 0.14)',
}

function LeafMark() {
  return (
    <>
      <path
        d="M0 0 C 8 -19, 20 -30, 37 -32 C 36 -13, 23 3, 0 0 Z"
        fill={palette.leafFill}
        stroke={palette.leaf}
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 -1 C 11 -10, 21 -18, 31 -26"
        fill="none"
        stroke={palette.leafVein}
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 -6 C 15 -7, 19 -9, 23 -13"
        fill="none"
        stroke={palette.leafVein}
        strokeWidth="0.85"
        strokeLinecap="round"
      />
      <path
        d="M8 -11 C 12 -13, 16 -16, 20 -20"
        fill="none"
        stroke={palette.leafVein}
        strokeWidth="0.8"
        strokeLinecap="round"
      />
    </>
  )
}

function StemPath({ d, delay = 0 }) {
  return (
    <MotionPath
      d={d}
      fill="none"
      stroke={palette.line}
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0.4 }}
      animate={{ pathLength: 1, opacity: [0.45, 1, 0.88] }}
      transition={{
        duration: 2.8,
        ease: 'easeInOut',
        delay,
      }}
    />
  )
}

function FloatingLeaf({ transform, delay = 0 }) {
  return (
    <g transform={transform}>
      <path
        d="M-7 4 C -4 2, -1 1, 2 -1"
        fill="none"
        stroke={palette.lineSoft}
        strokeWidth="1.15"
        strokeLinecap="round"
      />
      <MotionGroup
        initial={{ opacity: 0, scale: 0.35, rotate: -7 }}
        animate={{
          opacity: 1,
          scale: 1,
          rotate: 0,
        }}
        transition={{
          duration: 0.85,
          ease: 'easeInOut',
          delay,
        }}
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
      >
        <MotionGroup
          animate={{
            y: [0, -1.8, 0],
            rotate: [0, 1.2, 0],
            opacity: [0.78, 0.62, 0.78],
          }}
          transition={{
            duration: 6.8,
            ease: 'easeInOut',
            repeat: Infinity,
            delay: delay + 0.25,
          }}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        >
          <LeafMark />
        </MotionGroup>
      </MotionGroup>
    </g>
  )
}

function CenterSprig() {
  return (
    <svg viewBox="0 0 60 120" className="h-full w-full" fill="none" aria-hidden="true">
      <StemPath d="M28 116 C 26 92, 30 74, 34 56 C 38 38, 40 22, 38 8" delay={1} />
      <FloatingLeaf transform="translate(16 71) rotate(-25) scale(0.65)" delay={1.7} />
      <FloatingLeaf transform="translate(34 49) rotate(22) scale(0.6)" delay={1.95} />
      <FloatingLeaf transform="translate(18 31) rotate(-20) scale(0.58)" delay={2.2} />
    </svg>
  )
}

function BotanicalCorner({ className = '', viewBox = '0 0 220 180', stems = [], leaves = [] }) {
  return (
    <svg
      viewBox={viewBox}
      className={className}
      fill="none"
      aria-hidden="true"
    >
      {stems.map((stem, index) => (
        <StemPath key={`stem-${stem.d}`} d={stem.d} delay={0.15 + index * 0.28} />
      ))}
      {leaves.map((leaf, index) => (
        <FloatingLeaf key={`leaf-${leaf.transform}`} transform={leaf.transform} delay={0.9 + index * 0.27} />
      ))}
    </svg>
  )
}

/**
 * Premium floral background layer for hero sections.
 * - Keep your text/content in a sibling with a higher z-index.
 * - Edit config arrays above to control positions, scale, and motion intensity.
 */
export function PremiumFloralBackground({ className = '' }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.72),transparent_30%),linear-gradient(180deg,rgba(251,250,248,1)_0%,rgba(248,247,243,1)_100%)]" />

      <div className="absolute inset-0 z-10">
        <div className="absolute inset-0 opacity-[0.58]">
        <BotanicalCorner
          className="absolute -left-1 -top-2 w-[140px] sm:w-[180px] md:w-[220px]"
          viewBox="0 0 220 180"
          stems={[{ d: 'M20 110 C 55 92, 82 70, 102 34' }]}
          leaves={[
            { transform: 'translate(52 84) rotate(-28) scale(0.82)' },
            { transform: 'translate(68 70) rotate(-21) scale(0.84)' },
            { transform: 'translate(84 56) rotate(-18) scale(0.82)' },
          ]}
        />

        <BotanicalCorner
          className="absolute -right-2 -top-1 w-[155px] sm:w-[210px] md:w-[260px]"
          viewBox="0 0 260 240"
          stems={[
            { d: 'M232 0 C 228 40, 212 66, 184 96 C 164 118, 156 140, 152 178' },
            { d: 'M186 94 C 170 86, 155 74, 142 56' },
          ]}
          leaves={[
            { transform: 'translate(162 70) rotate(196) scale(0.82)' },
            { transform: 'translate(176 95) rotate(192) scale(0.84)' },
            { transform: 'translate(150 136) rotate(188) scale(0.82)' },
            { transform: 'translate(144 162) rotate(186) scale(0.8)' },
          ]}
        />

        <BotanicalCorner
          className="absolute -bottom-2 -left-2 w-[170px] sm:w-[220px] md:w-[270px]"
          viewBox="0 0 280 300"
          stems={[
            { d: 'M36 300 C 38 250, 44 214, 63 181 C 84 144, 114 118, 156 100' },
            { d: 'M60 188 C 45 170, 30 160, 10 154' },
            { d: 'M94 144 C 110 132, 122 116, 129 96' },
          ]}
          leaves={[
            { transform: 'translate(18 156) rotate(-28) scale(0.86)' },
            { transform: 'translate(52 210) rotate(-18) scale(0.9)' },
            { transform: 'translate(106 131) rotate(11) scale(0.82)' },
            { transform: 'translate(22 249) rotate(-20) scale(0.93)' },
          ]}
        />

        <BotanicalCorner
          className="absolute -bottom-2 -right-2 w-[160px] sm:w-[200px] md:w-[240px]"
          viewBox="0 0 250 270"
          stems={[
            { d: 'M215 270 C 208 232, 194 206, 169 178 C 144 151, 131 120, 126 82' },
            { d: 'M174 185 C 188 171, 200 154, 206 136' },
          ]}
          leaves={[
            { transform: 'translate(164 181) rotate(188) scale(0.85)' },
            { transform: 'translate(138 131) rotate(183) scale(0.8)' },
            { transform: 'translate(188 226) rotate(196) scale(0.9)' },
          ]}
        />
        </div>
      </div>

      <div
        className="absolute inset-0 z-30 opacity-[0.045]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220' viewBox='0 0 220 220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: '220px 220px',
        }}
      />

      <div className="absolute inset-0 z-20" aria-hidden="true">
        <MotionDiv
          className="absolute inset-0"
          animate={{ opacity: [0.22, 0.32, 0.22] }}
          transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="mx-auto mt-[18vh] h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 opacity-65">
            <CenterSprig />
          </div>
        </MotionDiv>
      </div>
    </div>
  )
}
