import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { PrimaryButton } from '../ui/PrimaryButton'
import { FloralDecor } from '../ui/FloralDecor'
import { clearAdminSession } from './AdminLoginGate'

function toCsv(rows) {
  const headers = ['created_at', 'full_name', 'phone_number', 'notes']
  const escapeCell = (value) => {
    const text = String(value ?? '')
    if (/[",\n]/.test(text)) {
      return `"${text.replace(/"/g, '""')}"`
    }
    return text
  }

  const lines = [headers.join(',')]
  rows.forEach((row) => {
    lines.push(headers.map((key) => escapeCell(row[key])).join(','))
  })
  return lines.join('\n')
}

export function AdminPanel() {
  const [guests, setGuests] = useState([])
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [lastFetchedAt, setLastFetchedAt] = useState('')

  const rowCount = useMemo(() => guests.length, [guests])

  const loadGuests = async () => {
    setStatus('loading')
    setError('')

    const { data, error: fetchError } = await supabase
      .from('rsvps')
      .select('created_at, full_name, phone_number, notes')
      .order('created_at', { ascending: false })

    if (fetchError) {
      setStatus('error')
      const rlsHint =
        fetchError.code === '42501'
          ? ' RLS policy likely blocks select. Run supabase/schema.sql again in SQL editor.'
          : ''
      setError((fetchError.message || 'Could not load guests.') + rlsHint)
      return
    }

    setGuests(data ?? [])
    setStatus('ready')
    setLastFetchedAt(new Date().toLocaleString())
  }

  useEffect(() => {
    loadGuests()
  }, [])

  const exportCsv = () => {
    if (!guests.length) return
    const blob = new Blob([toCsv(guests)], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `guest-list-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="relative min-h-screen bg-hero-gradient py-10">
      <FloralDecor />
      <div className="section-shell relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="romance-card p-6 sm:p-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-romance-700">
                Admin Panel
              </p>
              <h1 className="mt-2 font-serif text-4xl font-semibold text-romance-900">
                Guest List
              </h1>
              <p className="mt-2 text-sm text-romance-700">Total RSVP responses: {rowCount}</p>
              {lastFetchedAt ? (
                <p className="mt-1 text-xs text-romance-600">Last synced: {lastFetchedAt}</p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              <PrimaryButton onClick={loadGuests} disabled={status === 'loading'}>
                {status === 'loading' ? 'Loading...' : 'Refresh List'}
              </PrimaryButton>
              <PrimaryButton onClick={exportCsv} disabled={!guests.length}>
                Export CSV
              </PrimaryButton>
              <a
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-romance-300 px-5 py-3 text-sm font-semibold text-romance-800 transition hover:bg-romance-100"
              >
                Back to Invite
              </a>
              <button
                type="button"
                onClick={() => {
                  clearAdminSession()
                  window.location.reload()
                }}
                className="inline-flex items-center justify-center rounded-full border border-romance-300 px-5 py-3 text-sm font-semibold text-romance-800 transition hover:bg-romance-100"
              >
                Lock
              </button>
            </div>
          </div>

          {error ? (
            <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <div className="mt-6 overflow-hidden rounded-2xl border border-romance-200">
            <div className="max-h-[68vh] overflow-auto">
              <table className="min-w-full divide-y divide-romance-200 text-left">
                <thead className="bg-romance-100">
                  <tr>
                    <th className="px-4 py-3 text-xs uppercase tracking-[0.2em] text-romance-700">
                      Submitted
                    </th>
                    <th className="px-4 py-3 text-xs uppercase tracking-[0.2em] text-romance-700">
                      Full Name
                    </th>
                    <th className="px-4 py-3 text-xs uppercase tracking-[0.2em] text-romance-700">
                      Phone
                    </th>
                    <th className="px-4 py-3 text-xs uppercase tracking-[0.2em] text-romance-700">
                      Message
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-romance-100 bg-white">
                  {!guests.length ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-sm text-romance-600">
                        Click &quot;Refresh List&quot; to load RSVPs.
                      </td>
                    </tr>
                  ) : (
                    guests.map((guest) => (
                      <tr key={`${guest.created_at}-${guest.phone_number}`}>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-romance-700">
                          {new Date(guest.created_at).toLocaleString()}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-romance-900">
                          {guest.full_name}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-romance-800">
                          {guest.phone_number}
                        </td>
                        <td className="max-w-xs px-4 py-3 text-sm text-romance-700">
                          {guest.notes || '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
