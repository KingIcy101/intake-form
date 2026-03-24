# Intake Form — CLAUDE.md

## Stack
- Next.js 14 App Router
- Tailwind CSS
- Framer Motion (REQUIRED — step transitions must use Framer Motion, not CSS)
- Inter font via next/font/google
- TypeScript
- NO external form libraries

## Design Tokens (exact — do not deviate)
```
--bg:             #0A0A0F
--bg-card:        #111118
--bg-input:       #0D0D14
--bg-input-focus: #13131C
--border:         rgba(255, 255, 255, 0.08)
--border-focus:   rgba(108, 71, 255, 0.6)
--border-error:   rgba(239, 68, 68, 0.7)
--text:           #F0EFF8
--text-secondary: #8B8AA0
--text-muted:     #55546A
--accent:         #6C47FF
--accent-hover:   #7D5BFF
--success:        #10B981
--error:          #EF4444
--divider:        rgba(255, 255, 255, 0.05)
```

## Key Components
- `<ProgressBar step={n} total={totalSteps} sectionName="..." />`
- `<StepTransition direction={1|-1}>` — Framer Motion AnimatePresence wrapper
- `<FormInput>` — controlled, focus/error states
- `<FormTextarea>` — resize:vertical, min 96px
- `<FormSelect>` — custom chevron, dark option bg
- `<RadioGroup>` — custom pill UI with dot animation
- `<CheckboxGroup>` — custom box UI with checkmark
- `<ScheduleBuilder>` — Mon–Sun rows, toggle + time selects
- `<DynamicList>` — add/remove rows with AnimatePresence
- `<TogglePill>` — 40×22px toggle for schedule builder days

## Form State Shape
Single useReducer at root, all 8 steps in one object:
```ts
{
  businessName, ownerName, industry, websiteUrl, transferPhone,
  servicesDescription, topQuestions: string[],
  neverDiscuss, schedule: { [day]: { open: boolean, start: string, end: string } },
  timezone, afterHoursBehavior, hasHolidayClosures, holidayDetails,
  transferTriggers: string[], customTransferTrigger, transferPhone2,
  noAnswerBehavior, booksAppointments, calendarTool, customCalendarTool,
  appointmentTypes: string[], bookingRules,
  personality, agentName, phrasesToUse, phrasesToAvoid,
  faqs: { question: string, answer: string }[],
  hasEmergencies, emergencyHandling, clientDistinction, newClientHandling, otherCompliance
}
```

## Conditional Steps
- Total steps = 7 base
- booksAppointments === 'yes' → insert Step 5 (Booking), total = 8
- industry in ['Medical','Dental','Legal','Mental Health'] → append Step 8 (Special Scenarios), total = 8 or 9
- Progress bar reflects dynamic total

## Mobile Rules (MANDATORY)
- All inputs, textareas, selects: font-size 16px at max-width 768px
- Continue button: min-height 52px on mobile
- Radio/checkbox tap targets: min 48px height
- Back link: 44px min touch target
- No horizontal scroll at 390px

## Animations — Framer Motion
```js
const stepVariants = {
  enter: (dir) => ({ x: dir > 0 ? 24 : -24, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.28, ease: [0.16,1,0.3,1] } },
  exit: (dir) => ({ x: dir > 0 ? -24 : 24, opacity: 0, transition: { duration: 0.22, ease: [0.4,0,1,1] } })
};
```
- AnimatePresence mode="wait" wraps each step
- Conditional field reveals: AnimatePresence + height/opacity animation

## Validation
- On blur: validate touched fields only
- On submit: validate all required fields, focus first error
- Error messages animate in: opacity 0→1, y -4→0, 150ms ease-out

## File Structure
```
app/
  intake/
    page.tsx          (main multi-step form — all logic here)
  layout.tsx
  globals.css
components/
  FormInput.tsx
  FormSelect.tsx
  FormTextarea.tsx
  RadioGroup.tsx
  CheckboxGroup.tsx
  ScheduleBuilder.tsx
  DynamicList.tsx
  TogglePill.tsx
  ProgressBar.tsx
```

## Deploy
npx vercel --yes --token $VERCEL_TOKEN

## Rejection Criteria (10 — all must pass)
1. Page bg not #0A0A0F → reject
2. Input font-size < 16px on mobile → reject
3. No visible focus ring → reject
4. Step transitions not Framer Motion → reject
5. Conditional steps (Booking, Special Scenarios) broken → reject
6. Dynamic rows not add/removable → reject
7. Schedule builder days not toggleable → reject
8. CTA button not #6C47FF → reject
9. Font not Inter → reject
10. Confirmation screen has redirect or CTA → reject
