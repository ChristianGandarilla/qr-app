import { useEffect, useMemo, useState } from 'react';

function useDebounced(value, ms = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

export default function App() {
  const [url, setUrl] = useState('');
  const [fg, setFg] = useState('#14202b');
  const [bg, setBg] = useState('#ffffff');
  const [ec, setEc] = useState('M');
  const [size, setSize] = useState(512);
  const [error, setError] = useState('');

  const debouncedUrl = useDebounced(url.trim());
  const hasUrl = Boolean(debouncedUrl);
  const disabled = !hasUrl || !!error;

  // Parámetros compartidos por la vista previa y las descargas
  const query = useMemo(
    () => new URLSearchParams({ url: debouncedUrl, fg, bg, ec, size }).toString(),
    [debouncedUrl, fg, bg, ec, size]
  );

  useEffect(() => setError(''), [query]);

  // La vista previa siempre se pide a 320 px; el tamaño elegido solo afecta la descarga
  const previewSrc = `/api/qr?${query.replace(/size=\d+/, 'size=320')}`;

  return (
    <main>
      <h1>Turn a link into a QR code</h1>
      <p className="lead">Paste a URL, adjust the look, and download the code as PNG or SVG.</p>

      <div className="grid">
        <section className="panel">
          <div className="field">
            <label htmlFor="url">URL</label>
            <input
              id="url"
              type="text"
              inputMode="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <p className="err" role="alert">{error}</p>
          </div>

          <div className="row">
            <div className="field">
              <label htmlFor="fg">Code color</label>
              <input id="fg" type="color" value={fg} onChange={(e) => setFg(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="bg">Background</label>
              <input id="bg" type="color" value={bg} onChange={(e) => setBg(e.target.value)} />
            </div>
          </div>

          <div className="row">
            <div className="field">
              <label htmlFor="ec">Error correction</label>
              <select id="ec" value={ec} onChange={(e) => setEc(e.target.value)}>
                <option value="L">Low (7%)</option>
                <option value="M">Medium (15%)</option>
                <option value="Q">Quartile (25%)</option>
                <option value="H">High (30%)</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="size">Download size: {size} px</label>
              <input
                id="size"
                type="range"
                min="256"
                max="2048"
                step="64"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
              />
            </div>
          </div>
        </section>

        <section className="panel preview" aria-live="polite">
          {hasUrl && !error && (
            <div className="qr">
              <img
                key={previewSrc}
                src={previewSrc}
                alt={`QR code for ${debouncedUrl}`}
                onError={() => setError('That doesn’t look like a valid URL. Try something like example.com.')}
              />
            </div>
          )}
          {!hasUrl && <p className="empty">Enter a URL to see your QR code here.</p>}

          <div className="actions">
            <a
              className={`btn ${disabled ? 'disabled' : ''}`}
              href={`/api/qr?${query}&format=png&download=1`}
              aria-disabled={disabled}
            >
              Download PNG
            </a>
            <a
              className={`btn alt ${disabled ? 'disabled' : ''}`}
              href={`/api/qr?${query}&format=svg&download=1`}
              aria-disabled={disabled}
            >
              Download SVG
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}