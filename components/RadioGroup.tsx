interface Option {
  value: string
  label: string
  sublabel?: string
}

interface Props {
  options: Option[]
  value: string
  onChange: (value: string) => void
}

export function RadioGroup({ options, value, onChange }: Props) {
  return (
    <div className="radio-group">
      {options.map((opt) => (
        <div
          key={opt.value}
          className={`radio-option${value === opt.value ? ' selected' : ''}`}
          onClick={() => onChange(opt.value)}
          role="radio"
          aria-checked={value === opt.value}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault()
              onChange(opt.value)
            }
          }}
        >
          <div className="radio-dot">
            <div className="radio-dot-inner" />
          </div>
          <div>
            <div className="radio-label">{opt.label}</div>
            {opt.sublabel && (
              <div style={{ fontSize: '12px', color: '#8B8AA0', marginTop: '2px' }}>
                {opt.sublabel}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
