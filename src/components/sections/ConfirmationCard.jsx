import { motion } from 'framer-motion'
import { PrimaryButton } from '../ui/PrimaryButton'

export function ConfirmationCard({ fullName, onAddAnother }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="romance-card p-8 text-center"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-romance-700">
        RSVP Confirmed
      </p>
      <h3 className="mt-3 font-serif text-4xl font-semibold text-romance-900">Thank You!</h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-romance-700 sm:text-base">
        {fullName}, your RSVP has been received. We are truly excited to celebrate our engagement
        with you.
      </p>
      <PrimaryButton className="mt-6" onClick={onAddAnother}>
        Submit Another RSVP
      </PrimaryButton>
    </motion.div>
  )
}
