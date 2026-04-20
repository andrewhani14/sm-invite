import { useEffect, useMemo, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { HeroSection } from './components/sections/HeroSection'
import { EventDetailsSection } from './components/sections/EventDetailsSection'
import { CountdownSection } from './components/sections/CountdownSection'
import { RSVPSection } from './components/sections/RSVPSection'
import { GallerySection } from './components/sections/GallerySection'
import { FAQSection } from './components/sections/FAQSection'
import { AdminPanel } from './components/sections/AdminPanel'
import { AdminLoginGate, hasAdminSession } from './components/sections/AdminLoginGate'
import { defaultEventData } from './config/eventData'
import { fetchEventSettings } from './lib/eventSettings'

function App() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() =>
    hasAdminSession(),
  )
  const [eventData, setEventData] = useState(defaultEventData)
  const isAdminView = useMemo(
    () => window.location.pathname.replace(/\/$/, '') === '/admin',
    [],
  )
  const hasGalleryImages = Array.isArray(eventData.galleryImages) && eventData.galleryImages.length > 0
  const hasFaqItems = Array.isArray(eventData.faq) && eventData.faq.length > 0

  useEffect(() => {
    const loadEventSettings = async () => {
      try {
        const settings = await fetchEventSettings()
        setEventData(settings)
      } catch (error) {
        console.warn('Could not load event settings from Supabase. Using local defaults.', error)
      }
    }

    loadEventSettings()
  }, [])

  if (isAdminView) {
    if (!isAdminAuthenticated) {
      return (
        <>
          <AdminLoginGate onUnlock={() => setIsAdminAuthenticated(true)} />
          <Analytics />
        </>
      )
    }

    return (
      <>
        <AdminPanel />
        <Analytics />
      </>
    )
  }

  return (
    <div className="min-h-screen">
      <HeroSection eventData={eventData} />
      <EventDetailsSection eventData={eventData} />
      <CountdownSection targetDate={eventData.countdownTarget} />
      <RSVPSection />
      {hasGalleryImages ? <GallerySection images={eventData.galleryImages} /> : null}
      {hasFaqItems ? <FAQSection faq={eventData.faq} /> : null}
      <Analytics />
    </div>
  )
}

export default App
