import { motion } from 'framer-motion'
import { SectionHeading } from '../ui/SectionHeading'
import { PrimaryButton } from '../ui/PrimaryButton'

function DetailCard({ label, value }) {
  return (
    <div className="romance-card p-5">
      <p className="text-xs uppercase tracking-[0.28em] text-romance-600">{label}</p>
      <p className="mt-2 text-base font-semibold text-romance-900">{value}</p>
    </div>
  )
}

export function EventDetailsSection({ eventData }) {
  return (
    <section id="event-details" className="py-16 sm:py-20">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Event Details"
          title="A Night To Remember"
          description="We are excited to celebrate this special milestone with the people who matter most to us."
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <DetailCard label="Date" value={eventData.eventDate} />
          <DetailCard label="Time" value={eventData.eventTime} />
          <DetailCard label="Venue" value={eventData.venueName} />
          <DetailCard label="Address" value={eventData.address} />
          <DetailCard label="Dress Code" value={eventData.dressCode} />
          <div className="romance-card flex items-center justify-center p-5">
            <PrimaryButton
              className="w-full sm:w-auto"
              onClick={() => window.open(eventData.mapLink, '_blank', 'noopener,noreferrer')}
            >
              Open Google Maps
            </PrimaryButton>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
