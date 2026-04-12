'use client';

import { useState } from 'react';

import { API_BASE_URL } from '@/lib/api';

export function MaterialManager() {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [rawText, setRawText] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  async function ingestText() {
    setStatus('Processing…');
    const res = await fetch(`${API_BASE_URL}/api/materials/ingest-text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        source_type: 'scripture',
        tags: tags.split(',').map((s) => s.trim()).filter(Boolean),
        raw_text: rawText,
      }),
    });

    if (!res.ok) {
      setStatus(await res.text());
      return;
    }

    setStatus('Successfully ingested and indexed');
  }

  return (
    <div className="page" style={{ gridTemplateColumns: '1fr' }}>
      <div className="leftPanel">
        <div className="topBar">
          <div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>Scripture Manager</div>
            <div className="muted">Ingest scripture materials into the RAG index</div>
          </div>
        </div>

        <div className="sectionCard">
          <div className="sectionTitle">Title</div>
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Psalms, Romans 8, Gospel of John" />
        </div>

        <div className="sectionCard">
          <div className="sectionTitle">Tags</div>
          <input className="input" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g. comfort, faith, hope" />
        </div>

        <div className="sectionCard">
          <div className="sectionTitle">Scripture text</div>
          <textarea className="textarea" value={rawText} onChange={(e) => setRawText(e.target.value)} placeholder="Paste scripture passages here…" />
        </div>

        <button className="primaryButton" type="button" onClick={ingestText}>Ingest &amp; Index</button>

        {status && <div className="sectionCard">{status}</div>}
      </div>
    </div>
  );
}
