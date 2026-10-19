import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Accordion } from './components/Accordion/index.js';
import PropsPanel from './components/PropsPanel/PropsPanel.jsx';
import CodePreview from './components/CodePreview/CodePreview.jsx';
import { FAQ_ITEMS } from './data/faqData.js';
import { useAccordionState } from './hooks/useAccordionState.js';
import { CONFIG_DEFAULTS, applyDisabledState } from './utils/generateCode.js';
import './App.css';

export default function App() {
  const [config, setConfig] = useState(CONFIG_DEFAULTS);
  const [searchTerm, setSearchTerm] = useState('');

  const items = useMemo(() => applyDisabledState(FAQ_ITEMS, config.disabledDemo), [config.disabledDemo]);

  const filteredItems = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return items;
    return items.filter(
      (item) => item.question.toLowerCase().includes(term) || item.answer.toLowerCase().includes(term)
    );
  }, [items, searchTerm]);

  const { openIds, toggleItem } = useAccordionState({
    multiple: config.multiple,
    collapsible: config.collapsible,
    defaultOpenId: config.defaultOpenId,
  });

  const handleConfigChange = (patch) => setConfig((prev) => ({ ...prev, ...patch }));
  const handleReset = () => {
    setConfig(CONFIG_DEFAULTS);
    setSearchTerm('');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Accordion Playground</h1>
        <p>Preview an interactive FAQ accordion, tune its behavior, and copy the matching React code.</p>
      </header>
      <hr className="app-header-divider" />

      <main className="app-main">
        <section className="preview-pane" aria-label="Live preview">
          <div className="preview-pane-head">
            <h2>Live Preview</h2>
            <div className="search-field">
              <Search size={16} className="search-field-icon" aria-hidden="true" />
              <label htmlFor="faq-search" className="sr-only">
                Search FAQs
              </label>
              <input
                id="faq-search"
                type="search"
                className="search-field-input"
                placeholder="Search questions…"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                disabled={config.loadingState}
              />
            </div>
          </div>

          <Accordion
            items={filteredItems}
            variant={config.variant}
            iconType={config.iconType}
            iconPosition={config.iconPosition}
            loading={config.loadingState}
            openIds={openIds}
            onToggle={toggleItem}
            emptyMessage={`No questions match "${searchTerm}".`}
          />
        </section>

        <PropsPanel config={config} items={items} onChange={handleConfigChange} onReset={handleReset} />

        <CodePreview config={config} items={items} />
      </main>
    </div>
  );
}
