import { motion } from 'framer-motion'
import { PrimaryButton } from '../ui/PrimaryButton'

export function HeroSection({ eventData }) {
  const MotionButton = motion.button
  const MotionDot = motion.span
  const [leftName = '', rightName = ''] = eventData.coupleNames.split('&').map((name) => name.trim())

  return (
    <section className="relative flex min-h-svh items-center overflow-hidden py-8 sm:py-14">
      {/* Mobile background */}
      <div className="absolute inset-0 block sm:hidden">
        <img
          src="/landing-hero-mobile-bg.png"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Desktop background */}
      <div className="absolute inset-0 hidden sm:block">
        <img
          src="/landing-hero-bg.png"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-fill object-center"
        />
      </div>

      {/* Overlay — lighter on mobile so the celestial image shows */}
      <div className="absolute inset-0 bg-white/30 sm:bg-white/58" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.28)_55%,rgba(255,255,255,0.45)_100%)] sm:bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.46)_55%,rgba(255,255,255,0.58)_100%)]" />

      <div className="section-shell relative z-10">
        <div className="mx-auto max-w-4xl py-4 text-center sm:py-10">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="mt-4 font-serif text-[20px] tracking-[0.15em] uppercase text-romance-700 sm:text-[20px]"
          >
            Join us to Celebrate our Engagement
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="mt-4 font-script font-medium leading-none text-romance-800 text-[80px] sm:text-[80px]"
          >
            {leftName} &amp; {rightName}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.1 }}
            className="mt-6 font-serif text-[35px] font-semibold italic text-romance-800 sm:text-[42px]"
          >
            {eventData.eventDate}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.6 }}
            className="mt-8 font-script text-2xl text-romance-700 sm:text-4xl"
          >
            Can&apos;t wait to celebrate with you!
          </motion.p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
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
