import type { GenerateResponse } from '@/lib/api';

export function OutputPanel({ result }: { result: GenerateResponse | null }) {
  return (
    <div className="rightPanel">
      <div className="resultsHeader">Output: relevant scripture, sermon, and prayer</div>
      <div className="outputs">
        <div className="rightPanelCard">
          <div className="cardTitle">Holy Scripture</div>
          {!result ? (
            <div className="muted">Relevant scripture passages will appear here after generation.</div>
          ) : (
            <div>
              {result.scripture.map((item, index) => (
                <div key={`${item.reference}-${index}`} className="scriptureItem">
                  <div className="scriptureRef">{item.reference}</div>
                  <div className="contentBox">{item.text}</div>
                  <div className="muted" style={{ marginTop: 8 }}>{item.relevance_note}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rightPanelCard">
          <div className="cardTitle">Generated Sermon</div>
          <div className="contentBox">
            {result ? result.sermon : 'A sermon inspired by the selected pastor style will appear here after generation.'}
          </div>
        </div>

        <div className="rightPanelCard">
          <div className="cardTitle">Generated Prayer</div>
          <div className="contentBox">
            {result ? result.prayer : 'A prayer based on your situation and selected style will appear here after generation.'}
          </div>
        </div>
      </div>
    </div>
  );
}
