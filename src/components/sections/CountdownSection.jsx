import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { SectionHeading } from '../ui/SectionHeading'

function getTimeLeft(targetDateString) {
  const totalMs = new Date(targetDateString).getTime() - Date.now()
  if (totalMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  return {
    days: Math.floor(totalMs / (1000 * 60 * 60 * 24)),
    hours: Math.floor((totalMs / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((totalMs / (1000 * 60)) % 60),
    seconds: Math.floor((totalMs / 1000) % 60),
  }
}

export function CountdownSection({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetDate))
  const isLive = useMemo(
    () => Object.values(timeLeft).some((value) => value > 0),
    [timeLeft],
  )

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate))
    }, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <section className="py-16 sm:py-20">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Countdown"
          title="Counting Every Moment"
          description="The celebration begins soon. We cannot wait to make memories together."
        />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="romance-card mx-auto grid max-w-3xl grid-cols-2 gap-4 p-6 text-center sm:grid-cols-4"
        >
          {['days', 'hours', 'minutes', 'seconds'].map((unit) => (
            <div key={unit} className="rounded-2xl bg-romance-50 p-4">
              <p className="font-serif text-4xl font-semibold text-romance-900">
                {String(timeLeft[unit]).padStart(2, '0')}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.25em] text-romance-600">{unit}</p>
            </div>
          ))}
        </motion.div>
        {!isLive ? (
          <p className="mt-4 text-center font-medium text-romance-700">
            The celebration has started. See you there.
          </p>
        ) : null}
      </div>
    </section>
  )
}
