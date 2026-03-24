'use client'

import { TogglePill } from './TogglePill'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function generateTimes(): string[] {
  const times: string[] = []
  for (let hour = 6; hour <= 22; hour++) {
    for (const min of [0, 30]) {
      if (hour === 22 && min === 30) break
      const h = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
      const ampm = hour < 12 ? 'AM' : 'PM'
      const m = min === 0 ? '00' : '30'
      times.push(`${h}:${m} ${ampm}`)
    }
  }
  times.push('Midnight')
  return times
}

const TIMES = generateTimes()

export interface DaySchedule {
  open: boolean
  start: string
  end: string
}

interface Props {
  value: Record<string, DaySchedule>
  onChange: (value: Record<string, DaySchedule>) => void
}

export function ScheduleBuilder({ value, onChange }: Props) {
  const update = (day: string, patch: Partial<DaySchedule>) =>
    onChange({ ...value, [day]: { ...value[day], ...patch } })

  return (
    <div>
      {DAYS.map((day) => (
        <div key={day} className="schedule-row">
          <span className="day-name">{day}</span>
          <TogglePill
            active={value[day]?.open ?? false}
            onChange={(v) => update(day, { open: v })}
          />
          {value[day]?.open && (
            <div className="schedule-times">
              <select
                className="select"
                value={value[day].start}
                onChange={(e) => update(day, { start: e.target.value })}
              >
                {TIMES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <span className="time-separator">to</span>
              <select
                className="select"
                value={value[day].end}
                onChange={(e) => update(day, { end: e.target.value })}
              >
                {TIMES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
