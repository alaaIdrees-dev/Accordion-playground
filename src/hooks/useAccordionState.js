import { useCallback, useEffect, useRef, useState } from 'react';
import { computeNextOpenIds, initialOpenIds } from '../utils/accordionLogic.js';

/**
 * Manages which accordion items are open.
 *
 * Only a genuine change to `defaultOpenId` re-initializes the open items — toggling
 * unrelated props (variant, icon, multiple, etc.) never resets what the user has
 * expanded or collapsed by hand.
 *
 * @param {{ multiple: boolean, collapsible: boolean, defaultOpenId: string | null }} options
 */
export function useAccordionState({ multiple, collapsible, defaultOpenId }) {
  const [openIds, setOpenIds] = useState(() => initialOpenIds(defaultOpenId));
  const lastDefaultOpenId = useRef(defaultOpenId);

  useEffect(() => {
    if (lastDefaultOpenId.current !== defaultOpenId) {
      lastDefaultOpenId.current = defaultOpenId;
      setOpenIds(initialOpenIds(defaultOpenId));
    }
  }, [defaultOpenId]);

  const toggleItem = useCallback(
    (id, isDisabled) => {
      if (isDisabled) return;
      setOpenIds((prev) => computeNextOpenIds(prev, id, { multiple, collapsible }));
    },
    [multiple, collapsible]
  );

  return { openIds, toggleItem };
}
