'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  label: string
  optional?: boolean
  hint?: string
  error?: string
  id: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  placeholder?: string
  type?: string
}

export function FormInput({
  label,
  optional,
  hint,
  error,
  id,
  value,
  onChange,
  onBlur,
  placeholder,
  type = 'text',
}: Props) {
  return (
    <div className="field">
      <label className="field-label" htmlFor={id}>
        {label}
        {optional && <span className="optional">Optional</span>}
      </label>
      <input
        id={id}
        type={type}
        className={`input${error ? ' error' : ''}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
      />
      <AnimatePresence initial={false}>
        {error && (
          <motion.div
            className="field-error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="5.5" stroke="#EF4444" />
              <path d="M6 3.5V6.5" stroke="#EF4444" strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="6" cy="8.5" r="0.6" fill="#EF4444" />
            </svg>
            {error}
          </motion.div>
        )}
        {!error && hint && (
          <div className="field-hint">{hint}</div>
        )}
      </AnimatePresence>
    </div>
  )
}
