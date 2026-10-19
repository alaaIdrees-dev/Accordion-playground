import { RotateCcw } from 'lucide-react';
import { SegmentedField, SelectField, ToggleRow } from './FormControls.jsx';
import './PropsPanel.css';

const VARIANT_OPTIONS = [
  { value: 'bordered', label: 'Bordered' },
  { value: 'separated', label: 'Separated' },
  { value: 'minimal', label: 'Minimal' },
];

const ICON_TYPE_OPTIONS = [
  { value: 'chevron', label: 'Chevron' },
  { value: 'plus', label: 'Plus / Cross' },
  { value: 'arrow', label: 'Arrow' },
];

const ICON_POSITION_OPTIONS = [
  { value: 'start', label: 'Start' },
  { value: 'end', label: 'End' },
];

export default function PropsPanel({ config, items, onChange, onReset }) {
  const defaultOpenOptions = [
    { value: '', label: 'None' },
    ...items.map((item) => ({ value: item.id, label: item.label })),
  ];

  return (
    <section className="props-panel" aria-label="Component properties">
      <div className="props-panel-head">
        <h2>Props</h2>
        <button type="button" className="reset-button" onClick={onReset}>
          <RotateCcw size={14} aria-hidden="true" />
          Reset to defaults
        </button>
      </div>

      <div className="props-group">
        <SelectField
          id="prop-default-open"
          label="Default open item"
          value={config.defaultOpenId ?? ''}
          onChange={(value) => onChange({ defaultOpenId: value || null })}
          options={defaultOpenOptions}
        />
        <SelectField
          id="prop-variant"
          label="Variant"
          value={config.variant}
          onChange={(value) => onChange({ variant: value })}
          options={VARIANT_OPTIONS}
        />
        <SelectField
          id="prop-icon-type"
          label="Icon type"
          value={config.iconType}
          onChange={(value) => onChange({ iconType: value })}
          options={ICON_TYPE_OPTIONS}
        />
        <SegmentedField
          id="prop-icon-position"
          label="Icon position"
          value={config.iconPosition}
          onChange={(value) => onChange({ iconPosition: value })}
          options={ICON_POSITION_OPTIONS}
        />
      </div>

      <div className="props-divider" role="separator" />

      <div className="props-group">
        <ToggleRow
          id="prop-multiple"
          label="Multiple open"
          description="Allow more than one item expanded at once."
          checked={config.multiple}
          onChange={(value) => onChange({ multiple: value })}
        />
        <ToggleRow
          id="prop-collapsible"
          label="Collapsible"
          description="Let an expanded item close again on repeat click."
          checked={config.collapsible}
          onChange={(value) => onChange({ collapsible: value })}
        />
        <ToggleRow
          id="prop-loading"
          label="Loading state"
          description="Show skeleton placeholders instead of real content."
          checked={config.loadingState}
          onChange={(value) => onChange({ loadingState: value })}
        />
        <ToggleRow
          id="prop-disabled"
          label="Disable demo item"
          description='Toggle interactivity of the "Why is this item greyed out?" item.'
          checked={config.disabledDemo}
          onChange={(value) => onChange({ disabledDemo: value })}
        />
      </div>
    </section>
  );
}
