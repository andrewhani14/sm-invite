import { motion } from 'framer-motion'

export function SectionHeading({ eyebrow, title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
      className="mx-auto mb-10 max-w-2xl text-center"
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-romance-700">
        {eyebrow}
      </p>
      <h2 className="mb-4 font-serif text-4xl font-semibold text-romance-900 sm:text-5xl">
        {title}
      </h2>
      <p className="text-sm leading-relaxed text-romance-700 sm:text-base">
        {description}
      </p>
    </motion.div>
  )
}
