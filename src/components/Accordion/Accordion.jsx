import AccordionItem from './AccordionItem.jsx';
import './Accordion.css';

const SKELETON_ROWS = 5;

export default function Accordion({
  items,
  variant,
  iconType,
  iconPosition,
  loading,
  openIds,
  onToggle,
  emptyMessage,
}) {
  if (loading) {
    return (
      <div
        className={`accordion accordion--${variant} accordion--loading`}
        aria-busy="true"
        aria-live="polite"
      >
        <span className="sr-only">Loading FAQ content…</span>
        {Array.from({ length: SKELETON_ROWS }).map((_, index) => (
          <div className="accordion-skeleton-row" key={index}>
            <span className="accordion-skeleton-bar accordion-skeleton-bar--icon" />
            <span
              className="accordion-skeleton-bar accordion-skeleton-bar--text"
              style={{ maxWidth: `${62 - index * 4}%` }}
            />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={`accordion accordion--${variant} accordion--empty`}>
        <p className="accordion-empty-message">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`accordion accordion--${variant}`}>
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          item={item}
          isOpen={openIds.has(item.id)}
          onToggle={onToggle}
          iconType={iconType}
          iconPosition={iconPosition}
        />
      ))}
    </div>
  );
}
