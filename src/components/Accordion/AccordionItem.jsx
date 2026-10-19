import { ArrowRight, ChevronDown, Plus } from 'lucide-react';

const ICONS_BY_TYPE = {
  chevron: ChevronDown,
  plus: Plus,
  arrow: ArrowRight,
};

export default function AccordionItem({ item, isOpen, onToggle, iconType, iconPosition }) {
  const { id, question, answer, disabled } = item;
  const headerId = `accordion-header-${id}`;
  const panelId = `accordion-panel-${id}`;
  const Icon = ICONS_BY_TYPE[iconType] ?? ChevronDown;

  const icon = (
    <span className={`accordion-icon accordion-icon--${iconType}`} aria-hidden="true">
      <Icon size={18} strokeWidth={2.25} />
    </span>
  );

  return (
    <div className={`accordion-item${isOpen ? ' is-open' : ''}${disabled ? ' is-disabled' : ''}`}>
      <h3 className="accordion-item-heading">
        <button
          type="button"
          id={headerId}
          className={`accordion-trigger accordion-trigger--icon-${iconPosition}`}
          aria-expanded={isOpen}
          aria-controls={panelId}
          disabled={disabled}
          onClick={() => onToggle(id, disabled)}
        >
          {iconPosition === 'start' && icon}
          <span className="accordion-trigger-text">{question}</span>
          {iconPosition === 'end' && icon}
        </button>
      </h3>
      <div
        className="accordion-panel-wrapper"
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        aria-hidden={!isOpen}
      >
        <div className="accordion-panel-inner">
          <p className="accordion-panel-content">{answer}</p>
        </div>
      </div>
    </div>
  );
}
