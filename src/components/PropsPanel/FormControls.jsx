export function SelectField({ id, label, value, onChange, options }) {
  return (
    <div className="props-field">
      <label htmlFor={id} className="props-field-label">
        {label}
      </label>
      <select id={id} className="props-select" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function SegmentedField({ id, label, value, onChange, options }) {
  const labelId = `${id}-label`;
  return (
    <div className="props-field">
      <span className="props-field-label" id={labelId}>
        {label}
      </span>
      <div className="segmented-control" role="radiogroup" aria-labelledby={labelId}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={value === option.value}
            className={`segmented-option${value === option.value ? ' is-active' : ''}`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ToggleRow({ id, label, description, checked, onChange }) {
  return (
    <div className="props-toggle-row">
      <div className="props-toggle-copy">
        <label htmlFor={id} className="props-toggle-label">
          {label}
        </label>
        {description && <p className="props-toggle-desc">{description}</p>}
      </div>
      <span className="toggle-switch">
        <input
          type="checkbox"
          id={id}
          className="toggle-switch-input"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
        />
        <label htmlFor={id} className="toggle-switch-track">
          <span className="toggle-switch-thumb" />
        </label>
      </span>
    </div>
  );
}
