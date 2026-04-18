import { motion } from 'framer-motion'

export function FloralDecor({ className = '' }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <motion.svg
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 0.32, y: [6, -4, 6], rotate: [0, 2, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        viewBox="0 0 220 220"
        className="absolute -left-8 -top-8 h-52 w-52 text-romance-400"
        fill="none"
      >
        <motion.path
          d="M26 196C42 161 57 132 77 106C97 80 117 58 145 40C167 26 188 17 208 14"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0.2 }}
          animate={{ pathLength: 1, opacity: 0.9 }}
          transition={{ duration: 2.4, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
        />
        <path d="M126 74C133 60 145 52 160 49" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M88 116C95 102 107 94 121 91" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="161" cy="49" rx="12" ry="7" fill="currentColor" opacity="0.2" />
        <ellipse cx="121" cy="92" rx="11" ry="7" fill="currentColor" opacity="0.2" />
      </motion.svg>

      <motion.svg
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 0.26, y: [-6, 4, -6], rotate: [0, -2, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        viewBox="0 0 220 220"
        className="absolute -bottom-10 -right-8 h-52 w-52 text-romance-500"
        fill="none"
      >
        <motion.path
          d="M194 32C168 52 148 73 131 100C114 126 103 153 92 194"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0.2 }}
          animate={{ pathLength: 1, opacity: 0.85 }}
          transition={{ duration: 2.8, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
        />
        <path d="M128 110C114 111 101 117 91 127" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M151 76C136 77 122 83 111 93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="91" cy="127" rx="11" ry="7" fill="currentColor" opacity="0.22" />
        <ellipse cx="111" cy="93" rx="10" ry="6.5" fill="currentColor" opacity="0.2" />
      </motion.svg>

      <motion.svg
        initial={{ opacity: 0, x: -4 }}
        animate={{ opacity: 0.2, x: [-4, 4, -4], rotate: [0, 1, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        viewBox="0 0 180 180"
        className="absolute -bottom-10 -left-8 h-40 w-40 text-romance-400"
        fill="none"
      >
        <path d="M18 164C44 144 62 123 78 98C93 74 104 49 114 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M65 111C77 112 88 118 96 127" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </motion.svg>

      <motion.svg
        initial={{ opacity: 0, x: 4 }}
        animate={{ opacity: 0.2, x: [4, -4, 4], rotate: [0, -1, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        viewBox="0 0 180 180"
        className="absolute -right-6 -top-8 h-36 w-36 text-romance-400"
        fill="none"
      >
        <path d="M162 164C137 147 119 125 103 99C86 72 75 44 65 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M115 109C102 109 89 114 79 124" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </motion.svg>
    </div>
  )
}
