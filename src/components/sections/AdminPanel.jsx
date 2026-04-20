import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { PrimaryButton } from '../ui/PrimaryButton'
import { FloralDecor } from '../ui/FloralDecor'
import { clearAdminSession } from './AdminLoginGate'
import { defaultEventData } from '../../config/eventData'
import { eventDataToPayload, fetchEventSettings } from '../../lib/eventSettings'

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

function formatGalleryLinks(images) {
  if (!Array.isArray(images) || !images.length) return ''
  return images.map((image) => image?.src).filter(Boolean).join('\n')
}

function parseGalleryLinks(input) {
  return input
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((url, index) => ({
      src: url,
      alt: `Gallery image ${index + 1}`,
    }))
}

function formatFaqLines(faqItems) {
  if (!Array.isArray(faqItems) || !faqItems.length) return ''
  return faqItems
    .map((item) => `${item?.question ?? ''} | ${item?.answer ?? ''}`.trim())
    .join('\n')
}

function parseFaqLines(input) {
  return input
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [question, ...answerParts] = line.split('|')
      return {
        question: (question ?? '').trim(),
        answer: answerParts.join('|').trim(),
      }
    })
    .filter((item) => item.question && item.answer)
}

export function AdminPanel() {
  const [guests, setGuests] = useState([])
  const [activeTab, setActiveTab] = useState('guests')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [lastFetchedAt, setLastFetchedAt] = useState('')
  const [settings, setSettings] = useState(defaultEventData)
  const [settingsStatus, setSettingsStatus] = useState('idle')
  const [settingsMessage, setSettingsMessage] = useState('')
  const [galleryLinksInput, setGalleryLinksInput] = useState('')
  const [faqInput, setFaqInput] = useState('')

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

  const loadSettings = async () => {
    setSettingsStatus('loading')
    setSettingsMessage('')
    try {
      const nextSettings = await fetchEventSettings()
      setSettings(nextSettings)
      setGalleryLinksInput(formatGalleryLinks(nextSettings.galleryImages))
      setFaqInput(formatFaqLines(nextSettings.faq))
      setSettingsStatus('ready')
    } catch (error) {
      setSettingsStatus('error')
      setSettingsMessage(error?.message || 'Could not load event settings.')
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const saveSettings = async () => {
    setSettingsStatus('saving')
    setSettingsMessage('')

    try {
      const payloadSettings = {
        ...settings,
        galleryImages: parseGalleryLinks(galleryLinksInput),
        faq: parseFaqLines(faqInput),
      }

      const { error: saveError } = await supabase
        .from('event_settings')
        .upsert(eventDataToPayload(payloadSettings), { onConflict: 'id' })

      if (saveError) throw saveError

      setSettings(payloadSettings)
      setSettingsStatus('ready')
      setSettingsMessage('Event settings saved successfully.')
    } catch (error) {
      setSettingsStatus('error')
      setSettingsMessage(error?.message || 'Could not save event settings.')
    }
  }

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
                {activeTab === 'guests' ? 'Guest List' : 'Landing Page Settings'}
              </h1>
              {activeTab === 'guests' ? (
                <>
                  <p className="mt-2 text-sm text-romance-700">Total RSVP responses: {rowCount}</p>
                  {lastFetchedAt ? (
                    <p className="mt-1 text-xs text-romance-600">Last synced: {lastFetchedAt}</p>
                  ) : null}
                </>
              ) : (
                <p className="mt-2 text-sm text-romance-700">
                  Update landing page content from database.
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {activeTab === 'guests' ? (
                <>
                  <PrimaryButton onClick={loadGuests} disabled={status === 'loading'}>
                    {status === 'loading' ? 'Loading...' : 'Refresh List'}
                  </PrimaryButton>
                  <PrimaryButton onClick={exportCsv} disabled={!guests.length}>
                    Export CSV
                  </PrimaryButton>
                </>
              ) : (
                <>
                  <PrimaryButton onClick={loadSettings} disabled={settingsStatus === 'loading'}>
                    {settingsStatus === 'loading' ? 'Loading...' : 'Reload Settings'}
                  </PrimaryButton>
                  <PrimaryButton onClick={saveSettings} disabled={settingsStatus === 'saving'}>
                    {settingsStatus === 'saving' ? 'Saving...' : 'Save Settings'}
                  </PrimaryButton>
                </>
              )}
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

          <div className="mt-5 inline-flex rounded-full border border-romance-300 bg-romance-50 p-1">
            <button
              type="button"
              onClick={() => setActiveTab('guests')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab === 'guests'
                  ? 'bg-white text-romance-900 shadow-sm'
                  : 'text-romance-700 hover:text-romance-900'
              }`}
            >
              Guest List
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab === 'settings'
                  ? 'bg-white text-romance-900 shadow-sm'
                  : 'text-romance-700 hover:text-romance-900'
              }`}
            >
              Landing Settings
            </button>
          </div>

          {activeTab === 'guests' && error ? (
            <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          {activeTab === 'guests' ? (
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
          ) : null}

          {activeTab === 'settings' ? (
            <div className="mt-8 rounded-2xl border border-romance-200 bg-white p-5 sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-romance-900">
                  Landing Page Settings
                </h2>
                <p className="text-sm text-romance-700">
                  Update event details used on the website homepage.
                </p>
              </div>
              <div className="flex gap-2">
                <PrimaryButton onClick={loadSettings} disabled={settingsStatus === 'loading'}>
                  {settingsStatus === 'loading' ? 'Loading...' : 'Reload Settings'}
                </PrimaryButton>
                <PrimaryButton onClick={saveSettings} disabled={settingsStatus === 'saving'}>
                  {settingsStatus === 'saving' ? 'Saving...' : 'Save Settings'}
                </PrimaryButton>
              </div>
            </div>

            {settingsMessage ? (
              <p
                className={`mb-4 rounded-xl px-4 py-3 text-sm ${
                  settingsStatus === 'error'
                    ? 'border border-red-200 bg-red-50 text-red-700'
                    : 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                }`}
              >
                {settingsMessage}
              </p>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1">
                <span className="text-sm font-medium text-romance-800">Couple names</span>
                <input
                  className="w-full rounded-xl border border-romance-300 px-3 py-2 text-sm"
                  value={settings.coupleNames}
                  onChange={(event) =>
                    setSettings((current) => ({ ...current, coupleNames: event.target.value }))
                  }
                />
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-romance-800">Engagement title</span>
                <input
                  className="w-full rounded-xl border border-romance-300 px-3 py-2 text-sm"
                  value={settings.engagementTitle}
                  onChange={(event) =>
                    setSettings((current) => ({
                      ...current,
                      engagementTitle: event.target.value,
                    }))
                  }
                />
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-romance-800">Event date</span>
                <input
                  className="w-full rounded-xl border border-romance-300 px-3 py-2 text-sm"
                  value={settings.eventDate}
                  onChange={(event) =>
                    setSettings((current) => ({ ...current, eventDate: event.target.value }))
                  }
                />
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-romance-800">Event time</span>
                <input
                  className="w-full rounded-xl border border-romance-300 px-3 py-2 text-sm"
                  value={settings.eventTime}
                  onChange={(event) =>
                    setSettings((current) => ({ ...current, eventTime: event.target.value }))
                  }
                />
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-romance-800">Venue name</span>
                <input
                  className="w-full rounded-xl border border-romance-300 px-3 py-2 text-sm"
                  value={settings.venueName}
                  onChange={(event) =>
                    setSettings((current) => ({ ...current, venueName: event.target.value }))
                  }
                />
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-romance-800">Dress code</span>
                <input
                  className="w-full rounded-xl border border-romance-300 px-3 py-2 text-sm"
                  value={settings.dressCode}
                  onChange={(event) =>
                    setSettings((current) => ({ ...current, dressCode: event.target.value }))
                  }
                />
              </label>

              <label className="space-y-1 sm:col-span-2">
                <span className="text-sm font-medium text-romance-800">Address</span>
                <input
                  className="w-full rounded-xl border border-romance-300 px-3 py-2 text-sm"
                  value={settings.address}
                  onChange={(event) =>
                    setSettings((current) => ({ ...current, address: event.target.value }))
                  }
                />
              </label>

              <label className="space-y-1 sm:col-span-2">
                <span className="text-sm font-medium text-romance-800">Google Maps link</span>
                <input
                  className="w-full rounded-xl border border-romance-300 px-3 py-2 text-sm"
                  value={settings.mapLink}
                  onChange={(event) =>
                    setSettings((current) => ({ ...current, mapLink: event.target.value }))
                  }
                />
              </label>

              <label className="space-y-1 sm:col-span-2">
                <span className="text-sm font-medium text-romance-800">Hero tagline</span>
                <textarea
                  rows={3}
                  className="w-full rounded-xl border border-romance-300 px-3 py-2 text-sm"
                  value={settings.heroTagline}
                  onChange={(event) =>
                    setSettings((current) => ({ ...current, heroTagline: event.target.value }))
                  }
                />
              </label>

              <label className="space-y-1 sm:col-span-2">
                <span className="text-sm font-medium text-romance-800">Countdown target</span>
                <input
                  className="w-full rounded-xl border border-romance-300 px-3 py-2 text-sm"
                  value={settings.countdownTarget}
                  onChange={(event) =>
                    setSettings((current) => ({
                      ...current,
                      countdownTarget: event.target.value,
                    }))
                  }
                  placeholder="2026-05-23T16:00:00"
                />
              </label>

              <label className="space-y-1 sm:col-span-2">
                <span className="text-sm font-medium text-romance-800">
                  Gallery image links (one URL per line)
                </span>
                <textarea
                  rows={5}
                  className="w-full rounded-xl border border-romance-300 px-3 py-2 text-sm"
                  value={galleryLinksInput}
                  onChange={(event) => setGalleryLinksInput(event.target.value)}
                  placeholder={'https://example.com/image-1.jpg\nhttps://example.com/image-2.jpg'}
                />
              </label>

              <label className="space-y-1 sm:col-span-2">
                <span className="text-sm font-medium text-romance-800">
                  FAQs (one per line: Question | Answer)
                </span>
                <textarea
                  rows={5}
                  className="w-full rounded-xl border border-romance-300 px-3 py-2 text-sm"
                  value={faqInput}
                  onChange={(event) => setFaqInput(event.target.value)}
                  placeholder={
                    'Is parking available? | Yes, valet parking is available.\nWhat should I wear? | Elegant semi-formal attire is recommended.'
                  }
                />
              </label>
            </div>
            </div>
          ) : null}
        </motion.div>
      </div>
    </main>
  )
}
