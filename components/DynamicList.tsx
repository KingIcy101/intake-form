'use client'

import { AnimatePresence, motion } from 'framer-motion'

interface Props {
  values: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  max?: number
  addLabel?: string
}

export function DynamicList({
  values,
  onChange,
  placeholder,
  max = 5,
  addLabel = 'Add another',
}: Props) {
  const update = (i: number, v: string) =>
    onChange(values.map((x, j) => (j === i ? v : x)))
  const remove = (i: number) => onChange(values.filter((_, j) => j !== i))
  const add = () => onChange([...values, ''])

  return (
    <div className="dynamic-list">
      <AnimatePresence initial={false}>
        {values.map((v, i) => (
          <motion.div
            key={i}
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="dynamic-row"
          >
            <input
              className="input"
              value={v}
              onChange={(e) => update(i, e.target.value)}
              placeholder={placeholder}
              type="text"
            />
            {values.length > 1 && (
              <button
                className="btn-remove-row"
                onClick={() => remove(i)}
                type="button"
                aria-label="Remove"
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
            )}
          </motion.div>
        ))}
      </AnimatePresence>
      {values.length < max && (
        <button className="btn-add-row" onClick={add} type="button">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M6 1v10M1 6h10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          + {addLabel}
        </button>
      )}
    </div>
  )
}
