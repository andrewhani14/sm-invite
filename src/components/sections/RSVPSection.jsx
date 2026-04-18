import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { FormField } from '../ui/FormField'
import { PrimaryButton } from '../ui/PrimaryButton'
import { SectionHeading } from '../ui/SectionHeading'
import { ConfirmationCard } from './ConfirmationCard'
import { FloralDecor } from '../ui/FloralDecor'

export function RSVPSection() {
  const submissionLock = useRef(false)
  const [submitError, setSubmitError] = useState('')
  const [confirmedName, setConfirmedName] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      notes: '',
    },
  })

  const onSubmit = async (values) => {
    if (submissionLock.current) return

    submissionLock.current = true
    setSubmitError('')

    try {
      const payload = {
        full_name: values.fullName.trim(),
        phone_number: values.phoneNumber.trim(),
        notes: values.notes.trim() || null,
      }

      const { error } = await supabase.from('rsvps').insert(payload)
      if (error) throw error

      setConfirmedName(payload.full_name)
      reset()
    } catch (error) {
      const rlsHint =
        error?.code === '42501'
          ? ' Database policy is blocking inserts. Re-run supabase/schema.sql in Supabase SQL Editor.'
          : ''
      setSubmitError(
        (error?.message || 'Unable to submit RSVP right now. Please try again.') + rlsHint,
      )
    } finally {
      setTimeout(() => {
        submissionLock.current = false
      }, 700)
    }
  }

  return (
    <section id="rsvp-form" className="relative overflow-hidden py-16 sm:py-20">
      <FloralDecor className="opacity-70" />
      <div className="section-shell relative z-10">
        <SectionHeading
          eyebrow="RSVP"
          title="Reserve Your Place"
          description="Kindly confirm your attendance. We appreciate your response and look forward to seeing you."
        />
        <div className="mx-auto max-w-3xl">
          {confirmedName ? (
            <ConfirmationCard fullName={confirmedName} onAddAnother={() => setConfirmedName('')} />
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              onSubmit={handleSubmit(onSubmit)}
              className="romance-card space-y-5 p-6 sm:p-8"
              noValidate
            >
              <FormField label="Full Name" error={errors.fullName?.message}>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full rounded-2xl border border-romance-300 bg-white px-4 py-3 text-sm text-romance-900 outline-none transition focus:border-romance-500"
                  {...register('fullName', {
                    required: 'Full name is required.',
                    minLength: {
                      value: 2,
                      message: 'Please enter at least 2 characters.',
                    },
                  })}
                />
              </FormField>

              <FormField label="Phone Number" error={errors.phoneNumber?.message}>
                <input
                  type="tel"
                  inputMode="tel"
                  placeholder="+201234567890"
                  className="w-full rounded-2xl border border-romance-300 bg-white px-4 py-3 text-sm text-romance-900 outline-none transition focus:border-romance-500"
                  {...register('phoneNumber', {
                    required: 'Phone number is required.',
                    pattern: {
                      value: /^[+\d]?(?:[\d\s().-]{7,20})$/,
                      message: 'Please enter a valid phone number.',
                    },
                  })}
                />
              </FormField>

              <FormField label="Message" optional error={errors.notes?.message}>
                <textarea
                  rows={4}
                  placeholder="Share a sweet note..."
                  className="w-full rounded-2xl border border-romance-300 bg-white px-4 py-3 text-sm text-romance-900 outline-none transition focus:border-romance-500"
                  {...register('notes', {
                    maxLength: {
                      value: 400,
                      message: 'Message must be under 400 characters.',
                    },
                  })}
                />
              </FormField>

              {submitError ? (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {submitError}
                </p>
              ) : null}

              <PrimaryButton type="submit" disabled={isSubmitting || submissionLock.current}>
                {isSubmitting ? 'Submitting...' : 'Submit RSVP'}
              </PrimaryButton>
            </motion.form>
          )}
        </div>
      </div>
    </section>
  )
}
