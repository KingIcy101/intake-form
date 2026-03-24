interface Option {
  value: string
  label: string
}

interface Props {
  options: Option[]
  value: string[]
  onChange: (value: string[]) => void
}

export function CheckboxGroup({ options, value, onChange }: Props) {
  const toggle = (v: string) => {
    if (value.includes(v)) {
      onChange(value.filter((x) => x !== v))
    } else {
      onChange([...value, v])
    }
  }

  return (
    <div className="checkbox-group">
      {options.map((opt) => (
        <div
          key={opt.value}
          className={`checkbox-option${value.includes(opt.value) ? ' selected' : ''}`}
          onClick={() => toggle(opt.value)}
          role="checkbox"
          aria-checked={value.includes(opt.value)}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault()
              toggle(opt.value)
            }
          }}
        >
          <div className="checkbox-box">
            {value.includes(opt.value) && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path
                  d="M1 4l3 3 5-6"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
          <div className="radio-label">{opt.label}</div>
        </div>
      ))}
    </div>
  )
}
