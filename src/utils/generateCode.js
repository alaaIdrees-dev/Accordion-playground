import { DEMO_ITEM_ID } from '../data/faqData.js';

/** Default control-panel configuration, also used by the Reset action. */
export const CONFIG_DEFAULTS = {
  defaultOpenId: 'tech-stack',
  variant: 'bordered',
  iconType: 'chevron',
  iconPosition: 'end',
  multiple: false,
  collapsible: true,
  loadingState: false,
  disabledDemo: true,
};

function escapeAttrValue(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

/**
 * Builds the generated FAQSection JSX as a flat list of `{ text, cls }` segments.
 * This is the single source of truth: the plain copyable string and the
 * syntax-highlighted preview are both derived from the same segments, so they
 * can never drift out of sync with each other or with the live preview's config.
 *
 * @param {typeof CONFIG_DEFAULTS} config
 * @param {Array<{id:string, question:string, answer:string, disabled?:boolean}>} items
 * @returns {Array<{text: string, cls: string}>}
 */
export function generateCodeSegments(config, items) {
  const segments = [];
  const add = (text, cls = 'plain') => segments.push({ text, cls });

  add('import', 'kw');
  add(' { ');
  add('Accordion', 'tag');
  add(', ');
  add('AccordionItem', 'tag');
  add(' } ');
  add('from', 'kw');
  add(' ');
  add("'./components/Accordion'", 'str');
  add(';\n\n');

  add('function', 'kw');
  add(' ');
  add('FAQSection', 'fn');
  add('() {\n');
  add('  ');
  add('return', 'kw');
  add(' (\n');
  add('    <');
  add('Accordion', 'tag');

  const stringProps = [
    ['variant', config.variant],
    ['iconType', config.iconType],
    ['iconPosition', config.iconPosition],
  ];
  if (config.defaultOpenId) stringProps.push(['defaultOpen', config.defaultOpenId]);

  stringProps.forEach(([name, value]) => {
    add('\n      ');
    add(name, 'attr');
    add('=');
    add(`"${escapeAttrValue(value)}"`, 'str');
  });

  const boolProps = [];
  if (config.multiple) boolProps.push('multiple');
  if (config.collapsible) boolProps.push('collapsible');
  if (config.loadingState) boolProps.push('loading');
  boolProps.forEach((name) => {
    add('\n      ');
    add(name, 'attr');
  });

  add('\n    >\n');

  items.forEach((item, index) => {
    add('      <');
    add('AccordionItem', 'tag');
    add('\n        ');
    add('id', 'attr');
    add('=');
    add(`"${escapeAttrValue(item.id)}"`, 'str');
    add('\n        ');
    add('question', 'attr');
    add('=');
    add(`"${escapeAttrValue(item.question)}"`, 'str');
    add('\n        ');
    add('answer', 'attr');
    add('=');
    add(`"${escapeAttrValue(item.answer)}"`, 'str');
    if (item.disabled) {
      add('\n        ');
      add('disabled', 'attr');
    }
    add('\n      />');
    if (index < items.length - 1) add('\n');
  });

  add('\n    </');
  add('Accordion', 'tag');
  add('>\n');
  add('  );\n');
  add('}\n\n');
  add('export', 'kw');
  add(' ');
  add('default', 'kw');
  add(' ');
  add('FAQSection', 'fn');
  add(';\n');

  return segments;
}

/** Plain, copy-pasteable JSX string derived from the same segments shown in the preview. */
export function generateAccordionCode(config, items) {
  return generateCodeSegments(config, items)
    .map((segment) => segment.text)
    .join('');
}

/** Applies the Disabled-demo toggle to the one item it controls; every other item is always enabled. */
export function applyDisabledState(items, disabledDemo) {
  return items.map((item) =>
    item.id === DEMO_ITEM_ID ? { ...item, disabled: disabledDemo } : { ...item, disabled: false }
  );
}
