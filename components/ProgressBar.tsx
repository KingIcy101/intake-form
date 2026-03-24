interface Props {
  step: number
  total: number
  sectionName: string
}

export function ProgressBar({ step, total, sectionName }: Props) {
  const pct = ((step - 1) / Math.max(total - 1, 1)) * 100

  return (
    <div className="progress-wrapper">
      <div className="progress-meta">
        <span className="progress-step-label">Step {step} of {total}</span>
        <span className="progress-section-name">{sectionName}</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
