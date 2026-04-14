import type { GenerateResponse } from '@/lib/api';

function Spinner() {
  return (
    <div className="spinnerWrapper">
      <div className="spinner" />
      <div className="muted" style={{ marginTop: 10 }}>Generating...</div>
    </div>
  );
}

export function OutputPanel({ result, loading }: { result: GenerateResponse | null; loading: boolean }) {
  return (
    <div className="rightPanel">
      <div className="resultsHeader">Output generation may take about 10-20 seconds due to RAG and LLM API invocation.</div>
      <div className="outputs">
        <div className="rightPanelCard">
          <div className="cardTitle">Holy Scripture</div>
          {loading ? (
            <Spinner />
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
          <div className="cardTitle">Generated Sermon</div>
          {loading ? (
            <Spinner />
          ) : (
            <div className="contentBox">
              {result ? result.sermon : 'A sermon inspired by the selected pastor style will appear here after generation.'}
            </div>
          )}
        </div>

        <div className="rightPanelCard">
          <div className="cardTitle">Generated Prayer</div>
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
