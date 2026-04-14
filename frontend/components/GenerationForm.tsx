'use client';

import { useState } from 'react';

import { generateContent, type GenerateResponse, type StyleOption } from '@/lib/api';
import { OutputPanel } from './OutputPanel';
import { TagSelector } from './TagSelector';

export function GenerationForm({ styles }: { styles: StyleOption[] }) {
  const [userInput, setUserInput] = useState('I have been feeling anxious lately and my prayers feel powerless. I need help with trusting God, waiting on Him, and remaining obedient under pressure.');
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['spurgeon']);
  const [tone, setTone] = useState('reverent');
  const [length, setLength] = useState('medium');
  const [language, setLanguage] = useState<'zh' | 'en'>('en');
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await generateContent({
        user_input: userInput,
        selected_styles: selectedStyles,
        tone,
        length,
        language,
      });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <form className="leftPanel" onSubmit={onSubmit}>
        <div className="topBar">
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Pastor Studio AI</div>
            <div className="muted">Input + Style Tags = Triple Output</div>
          </div>
        </div>

        <div className="sectionCard">
          <div className="sectionTitle">Describe your situation, struggles, questions, or thoughts</div>
          <textarea
            className="textarea"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="e.g. I need a message for anxious Christians, emphasizing trust, repentance, hope, and obedience."
          />
        </div>

        <div className="sectionCard">
          <div className="sectionTitle">Pastor preaching style</div>
          <TagSelector options={styles} value={selectedStyles} onChange={setSelectedStyles} />
        </div>

        <div className="sectionCard">
          <div className="sectionTitle">Generation settings</div>
          <div className="row2" style={{ marginBottom: 12 }}>
            <div>
              <div className="sectionTitle">Tone</div>
              <select className="select" value={tone} onChange={(e) => setTone(e.target.value)}>
                <option value="reverent">reverent</option>
                <option value="tender">tender</option>
                <option value="solemn">solemn</option>
                <option value="hopeful">hopeful</option>
                <option value="urgent">urgent</option>
              </select>
            </div>
            <div>
              <div className="sectionTitle">Length</div>
              <select className="select" value={length} onChange={(e) => setLength(e.target.value)}>
                <option value="short">short</option>
                <option value="medium">medium</option>
                <option value="long">long</option>
              </select>
            </div>
          </div>

          <div>
            <div className="sectionTitle">Output language</div>
            <select className="select" value={language} onChange={(e) => setLanguage(e.target.value as 'zh' | 'en')}>
              <option value="zh">中文</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        <button type="submit" className="primaryButton" disabled={loading}>
          {loading ? 'Generating…' : 'Generate Scripture / Sermon / Prayer'}
        </button>

        <a
          href="https://buymeacoffee.com/yangzhong"
          target="_blank"
          rel="noopener noreferrer"
          className="bmcButton"
        >
          <img src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg" alt="" width="15" height="21" />
          <span>Buy me a coffee</span>
        </a>

        {error && (
          <div className="sectionCard" style={{ color: '#fca5a5' }}>
            {error}
          </div>
        )}
      </form>

      <OutputPanel result={result} loading={loading} />
    </div>
  );
}
