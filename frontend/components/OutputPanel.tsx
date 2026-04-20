import { BookOpen, Church, HandHeart, Info } from 'lucide-react';
import type { GenerateResponse } from '@/lib/api';

function Spinner({ label = 'Generating...' }: { label?: string }) {
  return (
    <div className="spinnerWrapper">
      <div className="spinner" />
      <div className="muted" style={{ marginTop: 10 }}>{label}</div>
    </div>
  );
}

export function OutputPanel({ result, loading }: { result: GenerateResponse | null; loading: boolean }) {
  return (
    <div className="rightPanel">
      <div className="resultsHeader">
        <Info size={16} />
        <span>Output generation may take about 10-20 seconds due to RAG and LLM API invocation.</span>
      </div>
      <div className="outputs">
        <div className="rightPanelCard">
          <div className="cardTitle"><BookOpen size={16} /> Holy Scripture Semantically Related</div>
          {loading ? (
            <Spinner label="Semantically Searching..." />
          ) : !result ? (
            <div className="muted">Relevant scripture passages will appear here after generation.</div>
          ) : (
            <div className="contentBox">
              {result.scripture.map((item, index) => (
                <div key={`${item.reference}-${index}`} className="scriptureItem">
                  <div className="scriptureRef">{item.reference}</div>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{item.text}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rightPanelCard">
          <div className="cardTitle"><Church size={16} /> Generated Sermon</div>
          {loading ? (
            <Spinner />
          ) : (
            <div className="contentBox">
              {result ? result.sermon : 'A sermon inspired by the selected pastor style will appear here after generation.'}
            </div>
          )}
        </div>

        <div className="rightPanelCard">
          <div className="cardTitle"><HandHeart size={16} /> Generated Prayer</div>
          {loading ? (
            <Spinner />
          ) : (
            <div className="contentBox">
              {result ? result.prayer : 'A prayer based on your situation and selected style will appear here after generation.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
