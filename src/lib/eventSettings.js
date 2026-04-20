import { supabase } from './supabase'
import { defaultEventData } from '../config/eventData'

function isArray(value) {
  return Array.isArray(value)
}

function asText(value, fallback = '') {
  return typeof value === 'string' && value.trim() ? value : fallback
}

export function normalizeEventSettingsRow(row) {
  if (!row) return defaultEventData

  return {
    coupleNames: asText(row.couple_names, defaultEventData.coupleNames),
    engagementTitle: asText(row.engagement_title, defaultEventData.engagementTitle),
    eventDate: asText(row.event_date, defaultEventData.eventDate),
    eventTime: asText(row.event_time, defaultEventData.eventTime),
    venueName: asText(row.venue_name, defaultEventData.venueName),
    address: asText(row.address, defaultEventData.address),
    mapLink: asText(row.map_link, defaultEventData.mapLink),
    dressCode: asText(row.dress_code, defaultEventData.dressCode),
    heroTagline: asText(row.hero_tagline, defaultEventData.heroTagline),
    countdownTarget: asText(row.countdown_target, defaultEventData.countdownTarget),
    galleryImages: isArray(row.gallery_images) ? row.gallery_images : defaultEventData.galleryImages,
    faq: isArray(row.faq) ? row.faq : defaultEventData.faq,
  }
}

export function eventDataToPayload(eventData) {
  return {
    id: 1,
    couple_names: eventData.coupleNames,
    engagement_title: eventData.engagementTitle,
    event_date: eventData.eventDate,
    event_time: eventData.eventTime,
    venue_name: eventData.venueName,
    address: eventData.address,
    map_link: eventData.mapLink,
    dress_code: eventData.dressCode,
    hero_tagline: eventData.heroTagline,
    countdown_target: eventData.countdownTarget,
    gallery_images: eventData.galleryImages,
    faq: eventData.faq,
  }
}

export async function fetchEventSettings() {
  const { data, error } = await supabase
    .from('event_settings')
    .select('*')
    .eq('id', 1)
    .maybeSingle()

  if (error) throw error
  return normalizeEventSettingsRow(data)
}
