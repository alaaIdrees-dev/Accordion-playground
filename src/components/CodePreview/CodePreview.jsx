import { useMemo, useRef, useState } from 'react';
import { Check, ClipboardCopy } from 'lucide-react';
import { generateCodeSegments } from '../../utils/generateCode.js';
import './CodePreview.css';

/** Copies text to the clipboard, falling back to a hidden textarea when the Clipboard API is unavailable. */
async function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.top = '-1000px';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  const succeeded = document.execCommand('copy');
  document.body.removeChild(textarea);
  if (!succeeded) throw new Error('Clipboard copy command was rejected');
}

export default function CodePreview({ config, items }) {
  const [copyState, setCopyState] = useState('idle'); // 'idle' | 'success' | 'error'
  const resetTimer = useRef(null);

  const segments = useMemo(() => generateCodeSegments(config, items), [config, items]);
  const plainCode = useMemo(() => segments.map((segment) => segment.text).join(''), [segments]);

  const handleCopy = async () => {
    try {
      await copyToClipboard(plainCode);
      setCopyState('success');
    } catch {
      setCopyState('error');
    } finally {
      clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopyState('idle'), 2200);
    }
  };

  return (
    <section className="code-preview" aria-label="Generated React code">
      <div className="code-preview-header">
        <div className="code-preview-title">
          <span className="code-preview-dot" aria-hidden="true" />
          <span>Generated Code</span>
          <span className="code-preview-badge">JSX</span>
        </div>
        <button type="button" className="code-copy-button" onClick={handleCopy}>
          {copyState === 'success' ? <Check size={15} aria-hidden="true" /> : <ClipboardCopy size={15} aria-hidden="true" />}
          {copyState === 'success' ? 'Copied' : copyState === 'error' ? 'Copy failed' : 'Copy code'}
        </button>
      </div>

      <pre className="code-preview-body">
        <code>
          {segments.map((segment, index) =>
            segment.cls === 'plain' ? (
              segment.text
            ) : (
              <span key={index} className={`tok-${segment.cls}`}>
                {segment.text}
              </span>
            )
          )}
        </code>
      </pre>

      <p className="code-copy-status" role="status" aria-live="polite">
        {copyState === 'success' && 'Code copied to clipboard.'}
        {copyState === 'error' && 'Could not copy automatically — select the code and copy it manually.'}
      </p>
    </section>
  );
}
