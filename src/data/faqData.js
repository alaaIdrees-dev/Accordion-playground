/**
 * Sample content for the Live Preview accordion.
 * `label` is a short form used in compact UI (the "Default open" select); `question`
 * and `answer` are the real FAQ copy rendered in the accordion itself.
 */
export const DEMO_ITEM_ID = 'demo-locked';

export const FAQ_ITEMS = [
  {
    id: 'tech-stack',
    label: 'Tech stack',
    question: 'What technologies power this playground?',
    answer:
      'Built with React and Vite for fast development, styled with plain CSS using custom properties, and icons from Lucide React — no UI framework or CSS library required.',
  },
  {
    id: 'animation',
    label: 'Animation',
    question: 'Can I adjust how the accordion animates?',
    answer:
      'Expand and collapse transitions are driven by a CSS grid-row trick, so panels animate smoothly without any JavaScript measuring heights. Timing and easing live in shared CSS variables you can override.',
  },
  {
    id: 'keyboard',
    label: 'Keyboard support',
    question: 'Does the accordion support keyboard navigation?',
    answer:
      'Every trigger is a native button element, so Tab, Enter and Space work automatically. Focus is always visible, and disabled items are skipped entirely by the browser.',
  },
  {
    id: 'accessibility',
    label: 'Accessibility',
    question: 'Is this accessible to screen reader users?',
    answer:
      'Each trigger exposes aria-expanded and is linked to its panel through aria-controls, and panels carry an accessible name, so assistive technology always announces the current state correctly.',
  },
  {
    id: DEMO_ITEM_ID,
    label: 'Disabled demo',
    question: 'Why is this item greyed out?',
    answer:
      'This item is wired to the "Disable demo item" control in the panel on the right — turn it off to interact with this item like any other one.',
  },
];
