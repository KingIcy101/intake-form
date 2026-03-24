interface Props {
  active: boolean
  onChange: (value: boolean) => void
}

export function TogglePill({ active, onChange }: Props) {
  return (
    <div
      className={`toggle-pill${active ? ' active' : ''}`}
      onClick={() => onChange(!active)}
      role="switch"
      aria-checked={active}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault()
          onChange(!active)
        }
      }}
    >
      <div className="toggle-knob" />
    </div>
  )
}
