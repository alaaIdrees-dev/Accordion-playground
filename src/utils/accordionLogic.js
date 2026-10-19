/**
 * Pure state-transition logic for the accordion's open/closed items.
 * Kept free of React so the rules can be reasoned about (and tested) in isolation.
 *
 * Rules:
 *  - Disabled items never change state.
 *  - Clicking a closed item always opens it.
 *      - In single mode, opening an item closes whichever item was open before it.
 *      - In multiple mode, opening an item leaves every other open item untouched.
 *  - Clicking an already-open item closes it only when `collapsible` is true.
 *    When `collapsible` is false, clicking an open item is a no-op, in both modes.
 *
 * @param {Set<string>} prevOpenIds
 * @param {string} id
 * @param {{ multiple: boolean, collapsible: boolean }} options
 * @returns {Set<string>} a new Set when state changes, or the same Set reference when it does not
 */
export function computeNextOpenIds(prevOpenIds, id, { multiple, collapsible }) {
  const isOpen = prevOpenIds.has(id);

  if (isOpen) {
    if (!collapsible) return prevOpenIds;
    const next = new Set(prevOpenIds);
    next.delete(id);
    return next;
  }

  if (multiple) {
    const next = new Set(prevOpenIds);
    next.add(id);
    return next;
  }

  return new Set([id]);
}

/**
 * Builds the initial (or reset) open-items Set from a single `defaultOpenId`.
 * @param {string | null} defaultOpenId
 * @returns {Set<string>}
 */
export function initialOpenIds(defaultOpenId) {
  return new Set(defaultOpenId ? [defaultOpenId] : []);
}
