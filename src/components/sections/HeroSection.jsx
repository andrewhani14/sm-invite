import { motion } from 'framer-motion'
import { PrimaryButton } from '../ui/PrimaryButton'

export function HeroSection({ eventData }) {
  const MotionButton = motion.button
  const MotionDot = motion.span
  const [leftName = '', rightName = ''] = eventData.coupleNames.split('&').map((name) => name.trim())
  const leftInitial = leftName[0] ?? ''
  const rightInitial = rightName[0] ?? ''

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden py-10 sm:py-14">
      <div className="absolute inset-0">
        <img
          src="/landing-hero-bg.png"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-fill object-center"
        />
      </div>
      <div className="absolute inset-0 bg-white/58 sm:bg-white/52" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.46)_55%,rgba(255,255,255,0.58)_100%)]" />
      <div className="section-shell relative z-10">
        <div className="mx-auto max-w-4xl py-6 text-center sm:py-10">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="font-script text-3xl text-romance-700 sm:text-4xl"
          >
            Join us to Celebrate our Engagement
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="mt-10 flex items-center justify-center gap-5 sm:gap-8"
          >
            <span className="font-serif text-[4.5rem] font-medium leading-none text-romance-900 sm:text-[6.3rem]">
              {leftInitial}
            </span>
            <span className="font-serif text-[4.5rem] font-medium leading-none text-romance-900 sm:text-[6.3rem]">
              {rightInitial}
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.1 }}
            className="mt-16 font-serif text-4xl font-semibold italic text-romance-800 sm:text-5xl"
          >
            {eventData.eventDate}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.6 }}
            className="mt-16 font-script text-3xl text-romance-700 sm:text-4xl"
          >
            Can&apos;t wait to celebrate with you!
          </motion.p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <PrimaryButton
              onClick={() =>
                document.getElementById('rsvp-form')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              RSVP Now
            </PrimaryButton>
          </div>

          <MotionButton
            type="button"
            onClick={() =>
              document.getElementById('event-details')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="mx-auto mt-10 flex flex-col items-center text-xs uppercase tracking-[0.22em] text-romance-700"
            animate={{ y: [0, 8, 0], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            aria-label="Scroll to event details"
          >
            <span>Scroll</span>
            <span className="mt-2 inline-flex h-10 w-6 items-start justify-center rounded-full border border-romance-500/60 p-1">
              <MotionDot
                className="h-2 w-2 rounded-full bg-romance-600"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              />
            </span>
          </MotionButton>
        </div>
      </div>
    </section>
  )
}
