import { computeNextOpenIds, initialOpenIds } from '../src/utils/accordionLogic.js';
import { FAQ_ITEMS, DEMO_ITEM_ID } from '../src/data/faqData.js';
import { CONFIG_DEFAULTS, generateAccordionCode, generateCodeSegments, applyDisabledState } from '../src/utils/generateCode.js';

function assert(cond, msg) {
  if (!cond) { console.error('FAIL:', msg); process.exitCode = 1; }
  else console.log('ok  -', msg);
}

// --- accordionLogic tests ---

// single mode, collapsible: open a -> {a}; open b -> {b} (a closes); click b again -> {} (collapsible closes it)
let s = initialOpenIds(null);
assert(s.size === 0, 'initialOpenIds(null) is empty');
s = computeNextOpenIds(s, 'a', { multiple: false, collapsible: true });
assert(s.has('a') && s.size === 1, 'single mode: opening a opens only a');
s = computeNextOpenIds(s, 'b', { multiple: false, collapsible: true });
assert(s.has('b') && !s.has('a') && s.size === 1, 'single mode: opening b closes a, opens b');
s = computeNextOpenIds(s, 'b', { multiple: false, collapsible: true });
assert(s.size === 0, 'single mode + collapsible: clicking open b closes it');

// single mode, NOT collapsible: clicking open item is a no-op
s = initialOpenIds('a');
let before = s;
s = computeNextOpenIds(s, 'a', { multiple: false, collapsible: false });
assert(s === before && s.has('a'), 'single mode, not collapsible: clicking open item is a no-op (same ref, still open)');
s = computeNextOpenIds(s, 'b', { multiple: false, collapsible: false });
assert(s.has('b') && !s.has('a'), 'single mode, not collapsible: clicking a DIFFERENT item still switches');

// multiple mode: items accumulate independently
s = initialOpenIds(null);
s = computeNextOpenIds(s, 'a', { multiple: true, collapsible: true });
s = computeNextOpenIds(s, 'b', { multiple: true, collapsible: true });
assert(s.has('a') && s.has('b') && s.size === 2, 'multiple mode: a and b both stay open');
s = computeNextOpenIds(s, 'a', { multiple: true, collapsible: true });
assert(!s.has('a') && s.has('b') && s.size === 1, 'multiple mode + collapsible: closing a leaves b open');

// multiple mode, not collapsible: cannot close an open item
s = initialOpenIds(null);
s = computeNextOpenIds(s, 'a', { multiple: true, collapsible: false });
before = s;
s = computeNextOpenIds(s, 'a', { multiple: true, collapsible: false });
assert(s === before && s.has('a'), 'multiple mode, not collapsible: clicking open item a is a no-op');

// --- faqData sanity ---
assert(FAQ_ITEMS.length === 5, 'FAQ_ITEMS has exactly 5 items');
assert(FAQ_ITEMS.filter(i => i.id === DEMO_ITEM_ID).length === 1, 'exactly one item matches DEMO_ITEM_ID');
assert(new Set(FAQ_ITEMS.map(i => i.id)).size === 5, 'all item ids are unique');

// --- applyDisabledState ---
let items = applyDisabledState(FAQ_ITEMS, true);
assert(items.find(i => i.id === DEMO_ITEM_ID).disabled === true, 'disabledDemo=true disables the demo item');
assert(items.filter(i => i.disabled).length === 1, 'only the demo item is ever disabled');
items = applyDisabledState(FAQ_ITEMS, false);
assert(items.every(i => !i.disabled), 'disabledDemo=false leaves every item enabled');

// --- code generation reflects config, not hardcoded ---
let code = generateAccordionCode(CONFIG_DEFAULTS, applyDisabledState(FAQ_ITEMS, CONFIG_DEFAULTS.disabledDemo));
assert(code.includes('variant="bordered"'), 'generated code reflects default variant');
assert(code.includes('collapsible') && !code.includes('multiple'), 'default config: collapsible prop present, multiple prop absent');
assert(code.includes('disabled'), 'generated code includes disabled on the demo item by default');
assert((code.match(/<AccordionItem/g) || []).length === 5, 'generated code has exactly 5 AccordionItem tags');

let altConfig = { ...CONFIG_DEFAULTS, variant: 'separated', multiple: true, collapsible: false, loadingState: true, disabledDemo: false, defaultOpenId: null };
let altCode = generateAccordionCode(altConfig, applyDisabledState(FAQ_ITEMS, altConfig.disabledDemo));
assert(altCode.includes('variant="separated"'), 'changed config reflects new variant');
assert(altCode.includes('multiple') && !altCode.includes('collapsible'), 'multiple on + collapsible off reflected as boolean props');
assert(altCode.includes('loading'), 'loadingState reflected as loading prop');
assert(!altCode.includes('defaultOpen='), 'defaultOpenId=null omits the defaultOpen prop entirely');
assert(!/\n\s+disabled\n/.test(altCode), 'disabledDemo=false: no AccordionItem has a standalone disabled attribute (the word still legitimately appears in FAQ prose)');

// segments join back into exactly the plain code string
let segs = generateCodeSegments(CONFIG_DEFAULTS, applyDisabledState(FAQ_ITEMS, CONFIG_DEFAULTS.disabledDemo));
let rejoined = segs.map(s => s.text).join('');
assert(rejoined === code, 'highlighted segments concatenate back to the exact plain code string');

// escaping: a quote inside content should not break the generated string
let weirdItems = [{ id: 'x', question: 'Say "hi"', answer: 'ok', disabled: false }];
let weirdCode = generateAccordionCode(CONFIG_DEFAULTS, weirdItems);
assert(weirdCode.includes('Say \\"hi\\"'), 'double quotes inside content are escaped in generated JSX');

console.log('\nAll logic tests completed.');
