'use client'

import { useReducer, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ProgressBar } from '@/components/ProgressBar'
import { FormInput } from '@/components/FormInput'
import { FormTextarea } from '@/components/FormTextarea'
import { FormSelect } from '@/components/FormSelect'
import { RadioGroup } from '@/components/RadioGroup'
import { CheckboxGroup } from '@/components/CheckboxGroup'
import { ScheduleBuilder, type DaySchedule } from '@/components/ScheduleBuilder'
import { DynamicList } from '@/components/DynamicList'

// ── Step transition variants ─────────────────────────────────────────────

const stepVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 24 : -24, opacity: 0 }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -24 : 24,
    opacity: 0,
    transition: { duration: 0.22, ease: [0.4, 0, 1, 1] as [number, number, number, number] },
  }),
}

const revealVariants = {
  hidden: { opacity: 0, height: 0, overflow: 'hidden' },
  visible: {
    opacity: 1,
    height: 'auto',
    overflow: 'hidden',
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    height: 0,
    overflow: 'hidden',
    transition: { duration: 0.15, ease: 'easeIn' },
  },
}

// ── State ────────────────────────────────────────────────────────────────

const defaultSchedule: Record<string, DaySchedule> = {
  Mon: { open: true, start: '9:00 AM', end: '5:00 PM' },
  Tue: { open: true, start: '9:00 AM', end: '5:00 PM' },
  Wed: { open: true, start: '9:00 AM', end: '5:00 PM' },
  Thu: { open: true, start: '9:00 AM', end: '5:00 PM' },
  Fri: { open: true, start: '9:00 AM', end: '5:00 PM' },
  Sat: { open: false, start: '9:00 AM', end: '5:00 PM' },
  Sun: { open: false, start: '9:00 AM', end: '5:00 PM' },
}

const initialState = {
  // Step 1
  businessName: '',
  ownerName: '',
  industry: '',
  websiteUrl: '',
  transferPhone: '',
  // Step 2
  servicesDescription: '',
  topQuestions: [''],
  neverDiscuss: '',
  // Step 3
  schedule: defaultSchedule,
  timezone: '',
  afterHoursBehavior: '',
  hasHolidayClosures: '',
  holidayDetails: '',
  // Step 4
  transferTriggers: [] as string[],
  customTransferTrigger: '',
  transferPhone2: '',
  noAnswerBehavior: '',
  booksAppointments: '',
  // Step 5 (conditional)
  calendarTool: '',
  customCalendarTool: '',
  appointmentTypes: [''],
  bookingRules: '',
  // Step 6
  personality: '',
  agentName: '',
  phrasesToUse: '',
  phrasesToAvoid: '',
  // Step 7
  faqs: [] as { question: string; answer: string }[],
  // Step 8 (conditional)
  hasEmergencies: '',
  emergencyHandling: '',
  clientDistinction: '',
  newClientHandling: '',
  otherCompliance: '',
}

type FormState = typeof initialState
type Action = { type: 'SET'; field: keyof FormState; value: FormState[keyof FormState] }

function reducer(state: FormState, action: Action): FormState {
  return { ...state, [action.field]: action.value }
}

// ── Step logic ───────────────────────────────────────────────────────────

const SPECIAL_INDUSTRIES = ['Medical', 'Dental', 'Legal', 'Mental Health']

function computeSteps(state: FormState): string[] {
  const steps = ['Business Basics', 'Services', 'Hours & After-Hours', 'Call Handling']
  if (state.booksAppointments === 'yes') steps.push('Booking')
  steps.push('Voice & Tone', 'FAQs')
  if (SPECIAL_INDUSTRIES.includes(state.industry)) steps.push('Special Scenarios')
  steps.push('Confirmation')
  return steps
}

// ── Validation ───────────────────────────────────────────────────────────

function validateStep(
  stepName: string,
  state: FormState
): Record<string, string> {
  const errs: Record<string, string> = {}

  if (stepName === 'Business Basics') {
    if (!state.businessName.trim() || state.businessName.trim().length < 2)
      errs.businessName = 'This field is required.'
    if (!state.ownerName.trim() || state.ownerName.trim().length < 2)
      errs.ownerName = 'This field is required.'
    if (!state.industry) errs.industry = 'Please select your industry.'
    if (state.websiteUrl && !/^https?:\/\/.+/.test(state.websiteUrl))
      errs.websiteUrl = 'Enter a valid URL starting with http:// or https://'
    if (!state.transferPhone.trim()) errs.transferPhone = 'This field is required.'
  }

  if (stepName === 'Services') {
    if (!state.servicesDescription.trim())
      errs.servicesDescription = 'This field is required.'
    if (!state.topQuestions.some((q) => q.trim()))
      errs.topQuestions = 'Add at least one question.'
  }

  if (stepName === 'Hours & After-Hours') {
    if (!state.timezone) errs.timezone = 'Please select your timezone.'
    if (!state.afterHoursBehavior) errs.afterHoursBehavior = 'Please select an option.'
  }

  if (stepName === 'Call Handling') {
    const phone = state.transferPhone2.trim() || state.transferPhone.trim()
    if (!phone) errs.transferPhone2 = 'This field is required.'
    if (!state.noAnswerBehavior) errs.noAnswerBehavior = 'Please select an option.'
    if (!state.booksAppointments) errs.booksAppointments = 'Please select an option.'
  }

  if (stepName === 'Booking') {
    if (!state.calendarTool) errs.calendarTool = 'Please select your calendar tool.'
    if (!state.appointmentTypes.some((t) => t.trim()))
      errs.appointmentTypes = 'Add at least one appointment type.'
  }

  if (stepName === 'Voice & Tone') {
    if (!state.personality) errs.personality = 'Please select a personality style.'
  }

  if (stepName === 'Special Scenarios') {
    if (!state.hasEmergencies) errs.hasEmergencies = 'Please select an option.'
    if (!state.clientDistinction) errs.clientDistinction = 'Please select an option.'
  }

  return errs
}

// ── Options ──────────────────────────────────────────────────────────────

const INDUSTRY_OPTIONS = [
  { value: 'Dental', label: 'Dental' },
  { value: 'Chiropractic', label: 'Chiropractic' },
  { value: 'Auto Repair', label: 'Auto Repair' },
  { value: 'Construction', label: 'Construction' },
  { value: 'Real Estate', label: 'Real Estate' },
  { value: 'Legal', label: 'Legal' },
  { value: 'Medical', label: 'Medical' },
  { value: 'Mental Health', label: 'Mental Health' },
  { value: 'Other', label: 'Other' },
]

const TIMEZONE_OPTIONS = [
  { value: 'ET', label: 'Eastern Time (ET)' },
  { value: 'CT', label: 'Central Time (CT)' },
  { value: 'MT', label: 'Mountain Time (MT)' },
  { value: 'PT', label: 'Pacific Time (PT)' },
  { value: 'AKT', label: 'Alaska Time (AKT)' },
  { value: 'HT', label: 'Hawaii Time (HT)' },
  { value: 'AT', label: 'Atlantic Time (AT)' },
]

const AFTER_HOURS_OPTIONS = [
  {
    value: 'callback',
    label: 'Take a message and promise a callback during business hours',
  },
  { value: 'voicemail', label: 'Route to voicemail' },
  {
    value: 'state-hours',
    label: 'State your hours and end the call politely',
  },
]

const TRANSFER_TRIGGER_OPTIONS = [
  { value: 'billing', label: 'Billing dispute or payment issue' },
  { value: 'upset', label: 'Upset or frustrated caller' },
  { value: 'high-value', label: 'Large new client or high-value opportunity' },
  { value: 'human-request', label: 'Caller specifically requests a human' },
  { value: 'other', label: 'Other' },
]

const NO_ANSWER_OPTIONS = [
  { value: 'voicemail', label: 'Let the caller leave a voicemail' },
  {
    value: 'take-info',
    label: "Take the caller's info and have us call them back",
  },
  { value: 'end-call', label: 'End the call politely' },
]

const CALENDAR_TOOL_OPTIONS = [
  { value: 'google', label: 'Google Calendar' },
  { value: 'calendly', label: 'Calendly' },
  { value: 'gohighlevel', label: 'GoHighLevel' },
  { value: 'other', label: 'Other' },
]

const PERSONALITY_OPTIONS = [
  { value: 'warm', label: 'Warm and friendly' },
  { value: 'professional', label: 'Professional and formal' },
  { value: 'casual', label: 'Casual and conversational' },
  { value: 'authoritative', label: 'Authoritative and direct' },
]

const QUESTION_PLACEHOLDERS = [
  'e.g. Do you accept walk-ins?',
  'e.g. What are your hours?',
  'e.g. Do you accept insurance?',
  'e.g. How much does a visit cost?',
  'e.g. Do you offer free consultations?',
]

// ── Step renderers ───────────────────────────────────────────────────────

function StepBusinessBasics({
  state,
  set,
  errors,
}: {
  state: FormState
  set: (f: keyof FormState) => (v: FormState[keyof FormState]) => void
  errors: Record<string, string>
}) {
  return (
    <>
      <h1 className="section-title">{"Let's start with the basics."}</h1>
      <p className="section-subtitle">
        Tell us about your business so we can configure your AI receptionist correctly.
      </p>

      <FormInput
        id="businessName"
        label="Business Name"
        value={state.businessName}
        onChange={set('businessName') as (v: string) => void}
        placeholder="Sunrise Dental Group"
        error={errors.businessName}
      />

      <FormInput
        id="ownerName"
        label="Owner Name"
        value={state.ownerName}
        onChange={set('ownerName') as (v: string) => void}
        placeholder="Dr. Sarah Chen"
        error={errors.ownerName}
      />

      <FormSelect
        id="industry"
        label="Industry"
        value={state.industry}
        onChange={set('industry') as (v: string) => void}
        placeholder="Select your industry"
        options={INDUSTRY_OPTIONS}
        error={errors.industry}
      />

      <FormInput
        id="websiteUrl"
        label="Website URL"
        optional
        value={state.websiteUrl}
        onChange={set('websiteUrl') as (v: string) => void}
        placeholder="https://yourbusiness.com"
        hint="We'll use this to understand your services better."
        error={errors.websiteUrl}
      />

      <FormInput
        id="transferPhone"
        label="Transfer Phone Number"
        value={state.transferPhone}
        onChange={set('transferPhone') as (v: string) => void}
        placeholder="(555) 234-5678"
        hint="The number we route calls to when a live agent is needed."
        error={errors.transferPhone}
      />
    </>
  )
}

function StepServices({
  state,
  set,
  errors,
}: {
  state: FormState
  set: (f: keyof FormState) => (v: FormState[keyof FormState]) => void
  errors: Record<string, string>
}) {
  return (
    <>
      <h1 className="section-title">What does your business do?</h1>
      <p className="section-subtitle">
        Be specific — this becomes the foundation of your AI&apos;s knowledge.
      </p>

      <FormTextarea
        id="servicesDescription"
        label="What You Offer"
        value={state.servicesDescription}
        onChange={set('servicesDescription') as (v: string) => void}
        placeholder="We provide dental cleanings, fillings, crowns, root canals, and cosmetic dentistry for patients of all ages."
        maxLength={300}
        error={errors.servicesDescription}
      />

      <div className="field">
        <label className="field-label">What do callers ask most often?</label>
        <div className="field-hint" style={{ marginBottom: '10px' }}>
          Add the questions your phone rings off the hook with.
        </div>
        <DynamicList
          values={state.topQuestions}
          onChange={set('topQuestions') as (v: string[]) => void}
          max={5}
          addLabel="Add another question"
          placeholder={
            QUESTION_PLACEHOLDERS[
              Math.min(state.topQuestions.length - 1, QUESTION_PLACEHOLDERS.length - 1)
            ]
          }
        />
        {errors.topQuestions && (
          <motion.div
            className="field-error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
          >
            {errors.topQuestions}
          </motion.div>
        )}
      </div>

      <FormTextarea
        id="neverDiscuss"
        label="Never Discuss"
        optional
        value={state.neverDiscuss}
        onChange={set('neverDiscuss') as (v: string) => void}
        placeholder="e.g. Competitor pricing, specific staff schedules, pending litigation"
        hint="Topics your AI should never address or discuss."
      />
    </>
  )
}

function StepHours({
  state,
  set,
  errors,
}: {
  state: FormState
  set: (f: keyof FormState) => (v: FormState[keyof FormState]) => void
  errors: Record<string, string>
}) {
  return (
    <>
      <h1 className="section-title">When are you open?</h1>
      <p className="section-subtitle">
        Your AI will quote these hours to callers and handle after-hours calls accordingly.
      </p>

      <div className="field">
        <label className="field-label">Business Hours</label>
        <ScheduleBuilder
          value={state.schedule}
          onChange={set('schedule') as (v: Record<string, DaySchedule>) => void}
        />
      </div>

      <FormSelect
        id="timezone"
        label="Timezone"
        value={state.timezone}
        onChange={set('timezone') as (v: string) => void}
        placeholder="Select timezone"
        options={TIMEZONE_OPTIONS}
        error={errors.timezone}
      />

      <div className="field">
        <label className="field-label">After-Hours Behavior</label>
        <RadioGroup
          options={AFTER_HOURS_OPTIONS}
          value={state.afterHoursBehavior}
          onChange={set('afterHoursBehavior') as (v: string) => void}
        />
        {errors.afterHoursBehavior && (
          <motion.div
            className="field-error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            style={{ marginTop: '8px' }}
          >
            {errors.afterHoursBehavior}
          </motion.div>
        )}
      </div>

      <div className="field">
        <label className="field-label">Holiday Closures</label>
        <RadioGroup
          options={[
            { value: 'yes', label: 'Yes — we close for holidays' },
            { value: 'no', label: 'No — we stay open on holidays' },
          ]}
          value={state.hasHolidayClosures}
          onChange={set('hasHolidayClosures') as (v: string) => void}
        />
        <AnimatePresence>
          {state.hasHolidayClosures === 'yes' && (
            <motion.div
              variants={revealVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ marginTop: '12px' }}
            >
              <label className="field-label" htmlFor="holidayDetails">
                Which holidays are you closed?
              </label>
              <textarea
                id="holidayDetails"
                className="input"
                value={state.holidayDetails}
                onChange={(e) =>
                  (set('holidayDetails') as (v: string) => void)(e.target.value)
                }
                placeholder="e.g. Christmas Day, Thanksgiving, New Year's Day"
                rows={3}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

function StepCallHandling({
  state,
  set,
  errors,
}: {
  state: FormState
  set: (f: keyof FormState) => (v: FormState[keyof FormState]) => void
  errors: Record<string, string>
}) {
  return (
    <>
      <h1 className="section-title">How should your AI handle calls?</h1>
      <p className="section-subtitle">
        Define exactly when to transfer to a live agent and what happens when no one answers.
      </p>

      <div className="field">
        <label className="field-label">Transfer to a live agent when...</label>
        <CheckboxGroup
          options={TRANSFER_TRIGGER_OPTIONS}
          value={state.transferTriggers}
          onChange={set('transferTriggers') as (v: string[]) => void}
        />
        <AnimatePresence>
          {state.transferTriggers.includes('other') && (
            <motion.div
              variants={revealVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ marginTop: '12px' }}
            >
              <label className="field-label" htmlFor="customTransferTrigger">
                Describe the scenario
              </label>
              <input
                id="customTransferTrigger"
                className="input"
                type="text"
                value={state.customTransferTrigger}
                onChange={(e) =>
                  (set('customTransferTrigger') as (v: string) => void)(e.target.value)
                }
                placeholder="e.g. Caller mentions they were referred by a partner clinic"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="field">
        <label className="field-label" htmlFor="transferPhone2">
          Transfer Phone Number
        </label>
        <input
          id="transferPhone2"
          className={`input${errors.transferPhone2 ? ' error' : ''}`}
          type="text"
          value={state.transferPhone2 || state.transferPhone}
          onChange={(e) =>
            (set('transferPhone2') as (v: string) => void)(e.target.value)
          }
          placeholder="(555) 234-5678"
        />
        <div className="field-hint">The number we call when a transfer is triggered.</div>
        {errors.transferPhone2 && (
          <motion.div
            className="field-error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
          >
            {errors.transferPhone2}
          </motion.div>
        )}
      </div>

      <div className="field">
        <label className="field-label">If No One Answers the Transfer</label>
        <RadioGroup
          options={NO_ANSWER_OPTIONS}
          value={state.noAnswerBehavior}
          onChange={set('noAnswerBehavior') as (v: string) => void}
        />
        {errors.noAnswerBehavior && (
          <motion.div
            className="field-error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            style={{ marginTop: '8px' }}
          >
            {errors.noAnswerBehavior}
          </motion.div>
        )}
      </div>

      <div className="divider" />

      <div className="field">
        <label className="field-label">Does your business book appointments?</label>
        <RadioGroup
          options={[
            { value: 'yes', label: 'Yes — we book appointments' },
            { value: 'no', label: 'No — we do not book appointments' },
          ]}
          value={state.booksAppointments}
          onChange={set('booksAppointments') as (v: string) => void}
        />
        {errors.booksAppointments && (
          <motion.div
            className="field-error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            style={{ marginTop: '8px' }}
          >
            {errors.booksAppointments}
          </motion.div>
        )}
      </div>
    </>
  )
}

function StepBooking({
  state,
  set,
  errors,
}: {
  state: FormState
  set: (f: keyof FormState) => (v: FormState[keyof FormState]) => void
  errors: Record<string, string>
}) {
  return (
    <>
      <h1 className="section-title">Set up your booking system.</h1>
      <p className="section-subtitle">
        Tell us how you schedule appointments so your AI can do it seamlessly.
      </p>

      <div className="field">
        <label className="field-label">Calendar Tool</label>
        <RadioGroup
          options={CALENDAR_TOOL_OPTIONS}
          value={state.calendarTool}
          onChange={set('calendarTool') as (v: string) => void}
        />
        <AnimatePresence>
          {state.calendarTool === 'other' && (
            <motion.div
              variants={revealVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ marginTop: '12px' }}
            >
              <label className="field-label" htmlFor="customCalendarTool">
                Which tool?
              </label>
              <input
                id="customCalendarTool"
                className="input"
                type="text"
                value={state.customCalendarTool}
                onChange={(e) =>
                  (set('customCalendarTool') as (v: string) => void)(e.target.value)
                }
                placeholder="e.g. Acuity Scheduling, SimplyBook.me"
              />
            </motion.div>
          )}
        </AnimatePresence>
        {errors.calendarTool && (
          <motion.div
            className="field-error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            style={{ marginTop: '8px' }}
          >
            {errors.calendarTool}
          </motion.div>
        )}
      </div>

      <div className="field">
        <label className="field-label">What types of appointments do you offer?</label>
        <DynamicList
          values={state.appointmentTypes}
          onChange={set('appointmentTypes') as (v: string[]) => void}
          max={5}
          addLabel="Add appointment type"
          placeholder="e.g. New Patient Consultation — 60 min"
        />
        {errors.appointmentTypes && (
          <motion.div
            className="field-error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
          >
            {errors.appointmentTypes}
          </motion.div>
        )}
      </div>

      <FormTextarea
        id="bookingRules"
        label="Booking Rules"
        optional
        value={state.bookingRules}
        onChange={set('bookingRules') as (v: string) => void}
        placeholder="e.g. New patients must bring insurance card. No same-day appointments for procedures."
        hint="Any rules callers need to know before booking?"
      />
    </>
  )
}

function StepVoiceTone({
  state,
  set,
  errors,
}: {
  state: FormState
  set: (f: keyof FormState) => (v: FormState[keyof FormState]) => void
  errors: Record<string, string>
}) {
  return (
    <>
      <h1 className="section-title">How should your AI sound?</h1>
      <p className="section-subtitle">
        {"We'll train your receptionist to match your brand's voice exactly."}
      </p>

      <div className="field">
        <label className="field-label">Personality</label>
        <RadioGroup
          options={PERSONALITY_OPTIONS}
          value={state.personality}
          onChange={set('personality') as (v: string) => void}
        />
        {errors.personality && (
          <motion.div
            className="field-error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            style={{ marginTop: '8px' }}
          >
            {errors.personality}
          </motion.div>
        )}
      </div>

      <FormInput
        id="agentName"
        label="Preferred Agent Name"
        optional
        value={state.agentName}
        onChange={set('agentName') as (v: string) => void}
        placeholder="e.g. Alex, Jordan, Sam"
        hint="What should callers hear when the AI introduces itself? Leave blank to use a default."
      />

      <FormTextarea
        id="phrasesToUse"
        label="Phrases to Always Use"
        optional
        value={state.phrasesToUse}
        onChange={set('phrasesToUse') as (v: string) => void}
        placeholder="e.g. 'Happy to help!', 'We appreciate your patience', 'Of course, absolutely'"
        hint="Phrases that sound like you. Your AI will weave these in naturally."
      />

      <FormTextarea
        id="phrasesToAvoid"
        label="Phrases to Never Say"
        optional
        value={state.phrasesToAvoid}
        onChange={set('phrasesToAvoid') as (v: string) => void}
        placeholder="e.g. 'No problem', 'Honestly', 'Basically', 'Yeah'"
        hint="Phrases that feel off-brand."
      />
    </>
  )
}

function StepFAQs({
  state,
  set,
}: {
  state: FormState
  set: (f: keyof FormState) => (v: FormState[keyof FormState]) => void
}) {
  const faqs = state.faqs
  const setFaqs = set('faqs') as (v: { question: string; answer: string }[]) => void

  const addFaq = () => {
    if (faqs.length < 5) setFaqs([...faqs, { question: '', answer: '' }])
  }

  const removeFaq = (i: number) => {
    setFaqs(faqs.filter((_, j) => j !== i))
  }

  const updateFaq = (i: number, field: 'question' | 'answer', value: string) => {
    setFaqs(faqs.map((faq, j) => (j === i ? { ...faq, [field]: value } : faq)))
  }

  return (
    <>
      <h1 className="section-title">Teach your AI the answers.</h1>
      <p className="section-subtitle">
        Add common questions and your preferred answers. Your AI will use these word-for-word.
      </p>

      <div className="field-hint" style={{ marginBottom: '20px' }}>
        Leave this blank if you&apos;d prefer we draft an FAQ list from your website and services
        description.
      </div>

      <AnimatePresence initial={false}>
        {faqs.map((faq, i) => (
          <motion.div
            key={i}
            className="faq-pair"
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <div className="faq-pair-header">
              <button
                className="btn-remove-row"
                onClick={() => removeFaq(i)}
                type="button"
                aria-label="Remove FAQ"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2 2l10 10M12 2L2 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <div className="field">
              <label className="field-label" htmlFor={`faq-q-${i}`}>
                Question
              </label>
              <input
                id={`faq-q-${i}`}
                className="input"
                type="text"
                value={faq.question}
                onChange={(e) => updateFaq(i, 'question', e.target.value)}
                placeholder="e.g. Do you accept insurance?"
              />
            </div>
            <div className="field">
              <label className="field-label" htmlFor={`faq-a-${i}`}>
                Answer
              </label>
              <textarea
                id={`faq-a-${i}`}
                className="input"
                value={faq.answer}
                onChange={(e) => updateFaq(i, 'answer', e.target.value)}
                placeholder="e.g. Yes — we accept most major PPO plans. We'll confirm yours at your first visit."
                rows={3}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {faqs.length < 5 && (
        <button className="btn-add-row" onClick={addFaq} type="button">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M6 1v10M1 6h10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          + Add a question
        </button>
      )}
    </>
  )
}

function StepSpecialScenarios({
  state,
  set,
  errors,
}: {
  state: FormState
  set: (f: keyof FormState) => (v: FormState[keyof FormState]) => void
  errors: Record<string, string>
}) {
  return (
    <>
      <h1 className="section-title">A few more things.</h1>
      <p className="section-subtitle">
        These industries require specific handling. Answer these so your AI is compliant and
        careful.
      </p>

      <div className="field">
        <label className="field-label">Emergency Situations</label>
        <RadioGroup
          options={[
            { value: 'yes', label: 'Yes — callers may have emergencies' },
            { value: 'no', label: 'No — not applicable to my business' },
          ]}
          value={state.hasEmergencies}
          onChange={set('hasEmergencies') as (v: string) => void}
        />
        <AnimatePresence>
          {state.hasEmergencies === 'yes' && (
            <motion.div
              variants={revealVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ marginTop: '12px' }}
            >
              <label className="field-label" htmlFor="emergencyHandling">
                How should emergencies be handled?
              </label>
              <textarea
                id="emergencyHandling"
                className="input"
                value={state.emergencyHandling}
                onChange={(e) =>
                  (set('emergencyHandling') as (v: string) => void)(e.target.value)
                }
                placeholder="e.g. Immediately direct them to call 911. Do not place them on hold."
                rows={3}
              />
            </motion.div>
          )}
        </AnimatePresence>
        {errors.hasEmergencies && (
          <motion.div
            className="field-error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            style={{ marginTop: '8px' }}
          >
            {errors.hasEmergencies}
          </motion.div>
        )}
      </div>

      <div className="field">
        <label className="field-label">New vs. Existing Clients</label>
        <RadioGroup
          options={[
            { value: 'same', label: 'Treat all callers the same' },
            { value: 'different', label: 'Handle new and existing clients differently' },
          ]}
          value={state.clientDistinction}
          onChange={set('clientDistinction') as (v: string) => void}
        />
        <AnimatePresence>
          {state.clientDistinction === 'different' && (
            <motion.div
              variants={revealVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ marginTop: '12px' }}
            >
              <label className="field-label" htmlFor="newClientHandling">
                How should new callers be handled differently?
              </label>
              <textarea
                id="newClientHandling"
                className="input"
                value={state.newClientHandling}
                onChange={(e) =>
                  (set('newClientHandling') as (v: string) => void)(e.target.value)
                }
                placeholder="e.g. New patients should be told to visit the website to complete intake forms before calling."
                rows={3}
              />
            </motion.div>
          )}
        </AnimatePresence>
        {errors.clientDistinction && (
          <motion.div
            className="field-error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            style={{ marginTop: '8px' }}
          >
            {errors.clientDistinction}
          </motion.div>
        )}
      </div>

      <FormTextarea
        id="otherCompliance"
        label="Anything Else"
        optional
        value={state.otherCompliance}
        onChange={set('otherCompliance') as (v: string) => void}
        placeholder="Any other compliance requirements, sensitive topics, or special handling we should know about?"
      />
    </>
  )
}

function ConfirmationScreen() {
  return (
    <div className="confirmation-screen">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.3,
          ease: [0.34, 1.56, 0.64, 1],
        }}
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          style={{ color: '#10B981' }}
        >
          <circle cx="12" cy="12" r="11" stroke="#10B981" strokeWidth="1.5" />
          <path
            d="M7 12.5l3.5 3.5 6.5-7"
            stroke="#10B981"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
      <h1 className="confirmation-title">{"You're all set."}</h1>
      <p className="confirmation-body">
        We have everything we need. Your AI receptionist build starts now. Expect a message from
        our team within 24 hours.
      </p>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────

export default function IntakePage() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const set =
    (field: keyof FormState) =>
    (value: FormState[keyof FormState]) =>
      dispatch({ type: 'SET', field, value })

  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const steps = computeSteps(state)
  const totalSteps = steps.length
  const sectionName = steps[currentStep] ?? ''
  const isConfirmation = sectionName === 'Confirmation'

  const goNext = async () => {
    const errs = validateStep(sectionName, state)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    if (isConfirmation) return

    if (currentStep === steps.length - 2) {
      // Submit to Supabase before showing confirmation
      setSubmitting(true)
      try {
        const res = await fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(state),
        })
        const data = await res.json()
        if (!res.ok) console.error('Submit failed:', data.error)
        else console.log('Submitted, client id:', data.id)
      } catch (e) {
        console.error('Submit error:', e)
      } finally {
        setSubmitting(false)
      }
    }

    setDirection(1)
    setCurrentStep((s) => Math.min(s + 1, totalSteps - 1))
  }

  const goBack = () => {
    setErrors({})
    setDirection(-1)
    setCurrentStep((s) => Math.max(s - 1, 0))
  }

  function renderStep(name: string) {
    if (name === 'Business Basics')
      return <StepBusinessBasics state={state} set={set} errors={errors} />
    if (name === 'Services')
      return <StepServices state={state} set={set} errors={errors} />
    if (name === 'Hours & After-Hours')
      return <StepHours state={state} set={set} errors={errors} />
    if (name === 'Call Handling')
      return <StepCallHandling state={state} set={set} errors={errors} />
    if (name === 'Booking')
      return <StepBooking state={state} set={set} errors={errors} />
    if (name === 'Voice & Tone')
      return <StepVoiceTone state={state} set={set} errors={errors} />
    if (name === 'FAQs')
      return <StepFAQs state={state} set={set} />
    if (name === 'Special Scenarios')
      return <StepSpecialScenarios state={state} set={set} errors={errors} />
    if (name === 'Confirmation')
      return <ConfirmationScreen />
    return null
  }

  return (
    <div className="form-container">
      {/* Logo */}
      <div
        style={{
          fontSize: '13px',
          fontWeight: 600,
          color: '#F0EFF8',
          marginBottom: '48px',
          letterSpacing: '0',
        }}
      >
        In The Past AI
      </div>

      {/* Progress bar */}
      {!isConfirmation && (
        <ProgressBar
          step={currentStep + 1}
          total={totalSteps}
          sectionName={sectionName}
        />
      )}

      {/* Step content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentStep}
          custom={direction}
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
        >
          {renderStep(sectionName)}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      {!isConfirmation && (
        <div>
          <button className="btn-continue" onClick={goNext} type="button">
            Continue &rarr;
          </button>
          {currentStep > 0 && (
            <div>
              <button className="btn-back" onClick={goBack} type="button">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M8 2L4 6l4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Back
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
