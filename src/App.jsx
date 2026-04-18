import { useMemo, useState } from 'react'
import { HeroSection } from './components/sections/HeroSection'
import { EventDetailsSection } from './components/sections/EventDetailsSection'
import { CountdownSection } from './components/sections/CountdownSection'
import { RSVPSection } from './components/sections/RSVPSection'
import { GallerySection } from './components/sections/GallerySection'
import { FAQSection } from './components/sections/FAQSection'
import { AdminPanel } from './components/sections/AdminPanel'
import { AdminLoginGate, hasAdminSession } from './components/sections/AdminLoginGate'
import { eventData } from './config/eventData'

function App() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() =>
    hasAdminSession(),
  )
  const isAdminView = useMemo(
    () => window.location.pathname.replace(/\/$/, '') === '/admin',
    [],
  )

  if (isAdminView) {
    if (!isAdminAuthenticated) {
      return <AdminLoginGate onUnlock={() => setIsAdminAuthenticated(true)} />
    }

    return <AdminPanel />
  }

  return (
    <div className="min-h-screen">
      <HeroSection eventData={eventData} />
      <EventDetailsSection eventData={eventData} />
      <CountdownSection targetDate={eventData.countdownTarget} />
      <RSVPSection />
      <GallerySection images={eventData.galleryImages} />
      <FAQSection faq={eventData.faq} />
    </div>
  )
}

export default App
