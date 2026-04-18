import { useState } from 'react'
import { motion } from 'framer-motion'
import { FloralDecor } from '../ui/FloralDecor'
import { PrimaryButton } from '../ui/PrimaryButton'

const ADMIN_SESSION_KEY = 'engagement_admin_access'

export function hasAdminSession() {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'granted'
}

export function clearAdminSession() {
  sessionStorage.removeItem(ADMIN_SESSION_KEY)
}

export function AdminLoginGate({ onUnlock }) {
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    const configuredPasscode = import.meta.env.VITE_ADMIN_ACCESS_CODE

    if (!configuredPasscode) {
      setError('Admin passcode is not configured. Add VITE_ADMIN_ACCESS_CODE in your .env.')
      return
    }

    if (passcode.trim() !== configuredPasscode.trim()) {
      setError('Invalid access code.')
      return
    }

    sessionStorage.setItem(ADMIN_SESSION_KEY, 'granted')
    onUnlock()
  }

  return (
    <main className="relative min-h-screen bg-hero-gradient py-12">
      <FloralDecor />
      <div className="section-shell relative z-10">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          onSubmit={handleSubmit}
          className="romance-card mx-auto max-w-md space-y-5 p-7 sm:p-9"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-romance-700">
            Protected Area
          </p>
          <h1 className="font-serif text-4xl font-semibold text-romance-900">Admin Access</h1>
          <p className="text-sm text-romance-700">
            Enter your access code to view and export the RSVP guest list.
          </p>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-romance-800">Access code</span>
            <input
              type="password"
              value={passcode}
              onChange={(event) => {
                setPasscode(event.target.value)
                setError('')
              }}
              className="w-full rounded-2xl border border-romance-300 bg-white px-4 py-3 text-sm text-romance-900 outline-none transition focus:border-romance-500"
              placeholder="Enter code"
            />
          </label>
          {error ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          ) : null}
          <div className="flex items-center gap-3">
            <PrimaryButton type="submit">Unlock Admin Panel</PrimaryButton>
            <a href="/" className="text-sm font-semibold text-romance-700 hover:underline">
              Back to invite
            </a>
          </div>
        </motion.form>
      </div>
    </main>
  )
}
