import { useState, useMemo, useEffect } from "react";

// ─── GOOGLE FONTS LOADER ──────────────────────────────────────────
const FONT_LINK = document.createElement("link");
FONT_LINK.href = "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Share+Tech+Mono&display=swap";
FONT_LINK.rel = "stylesheet";
document.head.appendChild(FONT_LINK);

// ─── DATI ─────────────────────────────────────────────────────────
const TRACKS = {
  australia:   { nome:"Melbourne",   aero:[23,10], trasmissione:41, sosp:[1,12,17,20,44], continente:"Oceania" },
  cina:        { nome:"Shanghai",    aero:[24,21], trasmissione:41, sosp:[1, 4, 8,21,48], continente:"Asia"    },
  suzuka:      { nome:"Suzuka",      aero:[31,21], trasmissione:41, sosp:[1, 6,21,22,42], continente:"Asia"    },
  bahrain:     { nome:"Sakhir",      aero:[34,29], trasmissione:41, sosp:[10,9,10,20,40], continente:"Asia"    },
  jeddah:      { nome:"Jeddah",      aero:[15, 1], trasmissione:41, sosp:[6, 1, 7,18,40], continente:"Asia"    },
  miami:       { nome:"Miami",       aero:[12, 4], trasmissione:30, sosp:[1, 1,17,22,40], continente:"America" },
  imola:       { nome:"Imola",       aero:[43,37], trasmissione:41, sosp:[1, 9,21,23,52], continente:"Europa"  },
  monaco:      { nome:"Monaco",      aero:[50,50], trasmissione:41, sosp:[22,3,21,19,49], continente:"Europa"  },
  spagna:      { nome:"Barcellona",  aero:[41,32], trasmissione:38, sosp:[2, 6,21,20,43], continente:"Europa"  },
  canada:      { nome:"Montreal",    aero:[35,28], trasmissione:41, sosp:[1, 1,18,19,40], continente:"America" },
  austria:     { nome:"Spielberg",   aero:[37,30], trasmissione:41, sosp:[5, 3,20,20,46], continente:"Europa"  },
  silverstone: { nome:"Silverstone", aero:[12, 0], trasmissione:41, sosp:[1, 5,18,21,40], continente:"Europa"  },
  spa:         { nome:"Spa",         aero:[8,  8], trasmissione:41, sosp:[1, 6,12,20,40], continente:"Europa"  },
  ungheria:    { nome:"Budapest",    aero:[50,50], trasmissione:41, sosp:[1,10,21,19,40], continente:"Europa"  },
  olanda:      { nome:"Zandvoort",   aero:[50,48], trasmissione:41, sosp:[1, 9,21,22,40], continente:"Europa"  },
  monza:       { nome:"Monza",       aero:[0,  3], trasmissione:41, sosp:[1, 1,21,21,40], continente:"Europa"  },
  baku:        { nome:"Baku",        aero:[4,  1], trasmissione:41, sosp:[1, 1,19,21,40], continente:"Asia"    },
  singapore:   { nome:"Singapore",   aero:[50,47], trasmissione:41, sosp:[1,16,21,20,40], continente:"Asia"    },
  austin:      { nome:"Austin",      aero:[41,34], trasmissione:41, sosp:[3, 1,21,20,40], continente:"America" },
  messico:     { nome:"Mexico City", aero:[40,36], trasmissione:32, sosp:[3, 5,21,23,45], continente:"America" },
  brasile:     { nome:"Sao Paolo",   aero:[27,14], trasmissione:41, sosp:[5, 2,21,22,41], continente:"America" },
  lasvegas:    { nome:"Las Vegas",   aero:[1,  0], trasmissione:41, sosp:[6, 5,21,23,48], continente:"America" },
  qatar:       { nome:"Lusail",      aero:[42,30], trasmissione:41, sosp:[3, 1,16,19,45], continente:"Asia"    },
  abudhabi:    { nome:"Yas Marina",  aero:[29,18], trasmissione:41, sosp:[1, 1,17,17,40], continente:"Asia"    },
};

const SHARED = {
  trasmissione: "100 - 20",
  geometria:    "-3,50° · -2,00° · 0,00° · 0,10°",
  freni:        "55% - 100%",
  gomme:        "29,5 - 29,5 - 26,5 - 26,5",
};

const CONTINENTI = ["Tutti","Europa","Asia","America","Oceania"];

function buildDiscordMessage(key, track) {
  return (
    `📍 **${track.nome}**\n`+
    `🔧 AERODINAMICA: ${track.aero[0]} - ${track.aero[1]}\n`+
    `⚙️ TRASMISSIONE: ${SHARED.trasmissione}\n`+
    `📐 GEOMETRIA: ${SHARED.geometria}\n`+
    `🔩 SOSPENSIONI: ${track.sosp.join(" - ")}\n`+
    `🛞 FRENI: ${SHARED.freni}\n`+
    `🏎️ GOMME: ${SHARED.gomme}`
  );
}

// ─── STYLES ───────────────────────────────────────────────────────
const css = `
  @keyframes pulse-dot {
    0%, 100% { opacity: 1; box-shadow: 0 0 4px #e8001d; }
    50%      { opacity: 0.6; box-shadow: 0 0 10px #e8001d, 0 0 20px rgba(232,0,29,0.3); }
  }
  @keyframes card-in {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  @keyframes panel-in {
    from { opacity: 0; transform: translateX(18px); }
    to   { opacity: 1; transform: translateX(0);    }
  }
  @keyframes value-flash {
    0%   { color: #00d4ff; text-shadow: 0 0 8px rgba(0,212,255,0.6); }
    100% { color: #e2e8f0; text-shadow: none; }
  }
  .track-card {
    background: linear-gradient(160deg, #0e1420 0%, #111a2a 100%);
    border: 1px solid #1c2736;
    border-radius: 10px;
    padding: 14px 16px 16px;
    cursor: pointer;
    text-align: left;
    position: relative;
    overflow: hidden;
    transition: border-color 0.22s ease, box-shadow 0.22s ease, transform 0.22s ease;
    animation: card-in 0.38s cubic-bezier(.4,0,.2,1) both;
  }
  .track-card::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, #e8001d, transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .track-card:hover {
    border-color: #2a3a55;
    box-shadow: 0 4px 24px rgba(0,0,0,0.35);
    transform: translateY(-2px);
  }
  .track-card:hover::after { opacity: 1; }
  .track-card.selected {
    border-color: #e8001d;
    box-shadow: 0 0 0 1px #e8001d, 0 4px 28px rgba(232,0,29,0.22);
    background: linear-gradient(160deg, #1a1215 0%, #161e2e 100%);
  }
  .track-card.selected::after { opacity: 1; background: #e8001d; }
  .track-card .card-index {
    position: absolute;
    top: 6px; right: 10px;
    font-family: 'Orbitron', sans-serif;
    font-size: 38px;
    font-weight: 900;
    color: rgba(255,255,255,0.035);
    line-height: 1;
    pointer-events: none;
    user-select: none;
  }
  .track-card .card-name {
    font-family: 'Orbitron', sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: #e8edf2;
    letter-spacing: 0.4px;
    margin-bottom: 2px;
    position: relative;
  }
  .track-card .card-cmd {
    font-family: 'Share Tech Mono', monospace;
    font-size: 10.5px;
    color: #3a5068;
    letter-spacing: 0.8px;
    margin-bottom: 10px;
  }
  .track-card.selected .card-cmd { color: #e8001d; }

  /* Aero bar */
  .aero-row { display: flex; align-items: center; gap: 8px; margin-bottom: 5px; }
  .aero-label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 9px;
    color: #3a5068;
    text-transform: uppercase;
    letter-spacing: 1px;
    width: 36px;
    flex-shrink: 0;
  }
  .aero-track {
    flex: 1;
    height: 5px;
    background: #0d1520;
    border-radius: 2.5px;
    overflow: hidden;
  }
  .aero-fill {
    height: 100%;
    border-radius: 2.5px;
    transition: width 0.5s cubic-bezier(.4,0,.2,1);
  }
  .aero-val {
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px;
    color: #6b8299;
    width: 22px;
    text-align: right;
    flex-shrink: 0;
  }

  /* Search input */
  .search-input {
    width: 100%;
    box-sizing: border-box;
    padding: 10px 14px 10px 38px;
    background: #0c1219;
    border: 1px solid #1c2736;
    border-radius: 7px;
    color: #c8d6e0;
    font-family: 'Share Tech Mono', monospace;
    font-size: 12.5px;
    outline: none;
    transition: border-color 0.2s;
  }
  .search-input::placeholder { color: #2e4050; }
  .search-input:focus { border-color: #e8001d; }

  /* Filter pills */
  .pill {
    padding: 6px 13px;
    border-radius: 5px;
    background: transparent;
    border: 1px solid #1c2736;
    color: #4a6278;
    font-family: 'Share Tech Mono', monospace;
    font-size: 10.5px;
    text-transform: uppercase;
    letter-spacing: 1.2px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .pill:hover { border-color: #3a5068; color: #8aa5b8; }
  .pill.active {
    background: rgba(232,0,29,0.1);
    border-color: rgba(232,0,29,0.45);
    color: #e8001d;
  }

  /* Panel */
  .panel {
    flex: 0 0 320px;
    background: #080d16;
    border: 1px solid #1c2736;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 40px rgba(0,0,0,0.5);
    position: relative;
    animation: panel-in 0.35s cubic-bezier(.4,0,.2,1) both;
  }
  /* Scanlines overlay */
  .panel::before {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent 0px,
      transparent 3px,
      rgba(255,255,255,0.018) 3px,
      rgba(255,255,255,0.018) 4px
    );
    pointer-events: none;
    z-index: 2;
    border-radius: 12px;
  }
  .panel-header {
    position: relative;
    padding: 24px 22px 18px;
    border-bottom: 1px solid #1c2736;
    background: linear-gradient(180deg, #110f18 0%, #080d16 100%);
    overflow: hidden;
  }
  .panel-header-glow {
    position: absolute;
    top: -30px; right: -30px;
    width: 140px; height: 140px;
    border-radius: 50%;
    pointer-events: none;
  }
  .panel-suptitle {
    font-family: 'Share Tech Mono', monospace;
    font-size: 9px;
    color: #3a5068;
    text-transform: uppercase;
    letter-spacing: 2.5px;
    margin-bottom: 6px;
    position: relative;
  }
  .panel-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 21px;
    font-weight: 700;
    color: #f0f4f8;
    letter-spacing: -0.3px;
    position: relative;
  }
  .panel-cmd-badge {
    position: absolute;
    top: 22px; right: 22px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px;
    color: #e8001d;
    background: rgba(232,0,29,0.1);
    border: 1px solid rgba(232,0,29,0.3);
    border-radius: 5px;
    padding: "3px 10px";
  }
  /* Panel rows */
  .panel-body { padding: 6px 22px 4px; position: relative; z-index: 1; }
  .panel-row {
    display: flex;
    align-items: center;
    padding: 11px 0;
    border-bottom: 1px solid #111c2a;
    gap: 10px;
  }
  .panel-row:last-child { border-bottom: none; }
  .panel-row-icon {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    background: #0c1420;
    border: 1px solid #162232;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    flex-shrink: 0;
  }
  .panel-row-label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 9.5px;
    color: #3a5068;
    text-transform: uppercase;
    letter-spacing: 1.6px;
    flex-shrink: 0;
    min-width: 95px;
  }
  .panel-row-value {
    font-family: 'Share Tech Mono', monospace;
    font-size: 12.5px;
    color: #e2e8f0;
    margin-left: auto;
    text-align: right;
    letter-spacing: 0.3px;
  }
  .panel-row-value.flash {
    animation: value-flash 0.7s ease forwards;
  }

  /* Copy button */
  .copy-btn {
    margin: 10px 22px 18px;
    width: calc(100% - 44px);
    padding: 12px 0;
    border: none;
    border-radius: 7px;
    cursor: pointer;
    font-family: 'Orbitron', sans-serif;
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #fff;
    background: linear-gradient(135deg, #c9001a, #e8001d);
    box-shadow: 0 4px 18px rgba(232,0,29,0.3);
    transition: filter 0.2s, box-shadow 0.2s, background 0.25s;
    position: relative;
    z-index: 1;
  }
  .copy-btn:hover {
    filter: brightness(1.12);
    box-shadow: 0 6px 24px rgba(232,0,29,0.4);
  }
  .copy-btn.copied {
    background: linear-gradient(135deg, #15803d, #22c55e);
    box-shadow: 0 4px 18px rgba(34,197,94,0.3);
  }

  /* Empty panel */
  .panel-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    padding: 56px 24px;
    position: relative;
    z-index: 1;
  }
  .panel-empty-icon {
    width: 56px; height: 56px;
    border-radius: 50%;
    border: 1px solid #1c2736;
    display: flex; align-items: center; justify-content: center;
    font-size: 24px;
    opacity: 0.25;
  }
  .panel-empty-text {
    font-family: 'Share Tech Mono', monospace;
    font-size: 11.5px;
    color: #2e4050;
    text-align: center;
    line-height: 1.8;
  }

  /* No results */
  .no-results {
    grid-column: 1 / -1;
    text-align: center;
    padding: 52px 20px;
  }
  .no-results-icon { font-size: 28px; opacity: 0.18; margin-bottom: 10px; }
  .no-results-text {
    font-family: 'Share Tech Mono', monospace;
    font-size: 12px;
    color: #2e4050;
  }

  /* Responsive */
  @media (max-width: 780px) {
    .main-layout { flex-direction: column !important; }
    .panel { flex: none !important; width: 100% !important; }
  }
`;

// ─── COMPONENTI ───────────────────────────────────────────────────

function AeroBar({ value, label, max = 50 }) {
  const pct = (value / max) * 100;
  // Gradiente dinamico: verde (basso downforce) → rosso (alto downforce)
  const hue = 120 - (pct / 100) * 110; // 120=verde → 10=rosso
  const color = `hsl(${hue}, 80%, 45%)`;
  return (
    <div className="aero-row">
      <span className="aero-label">{label}</span>
      <div className="aero-track">
        <div className="aero-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="aero-val">{value}</span>
    </div>
  );
}

function TrackCard({ id, track, isSelected, onClick, index }) {
  return (
    <button
      className={`track-card${isSelected ? " selected" : ""}`}
      style={{ animationDelay: `${index * 0.04}s` }}
      onClick={onClick}
    >
      <span className="card-index">{String(index + 1).padStart(2, "0")}</span>
      <div className="card-name">{track.nome}</div>
      <div className="card-cmd">.{id}</div>
      <AeroBar value={track.aero[0]} label="Front" />
      <AeroBar value={track.aero[1]} label="Rear" />
    </button>
  );
}

function SetupPanel({ id, track, onCopy, copied }) {
  const [flashKey, setFlashKey] = useState(null);

  useEffect(() => {
    if (track) {
      setFlashKey(Date.now());
    }
  }, [track]);

  if (!track) {
    return (
      <div className="panel">
        <div className="panel-empty">
          <div className="panel-empty-icon">🏎️</div>
          <div className="panel-empty-text">Seleziona una pista<br />per visualizzare il setup</div>
        </div>
      </div>
    );
  }

  const aeroAvg = (track.aero[0] + track.aero[1]) / 2;
  const glowOpacity = (aeroAvg / 50) * 0.3;

  const rows = [
    { icon: "🔧", label: "Aerodinamica",  value: `${track.aero[0]} · ${track.aero[1]}` },
    { icon: "⚙️", label: "Trasmissione",  value: SHARED.trasmissione },
    { icon: "📐", label: "Geometria",     value: SHARED.geometria },
    { icon: "🔩", label: "Sospensioni",   value: track.sosp.join(" · ") },
    { icon: "🛞", label: "Freni",         value: SHARED.freni },
    { icon: "🏎️", label: "Gomme",         value: SHARED.gomme },
  ];

  return (
    <div className="panel" key={id}>
      <div className="panel-header">
        <div className="panel-header-glow" style={{
          background: `radial-gradient(circle, rgba(232,0,29,${glowOpacity}) 0%, transparent 70%)`
        }} />
        <div className="panel-suptitle">Setup · Telemetria</div>
        <div className="panel-title">{track.nome}</div>
        <div className="panel-cmd-badge" style={{ position:"absolute", top:22, right:22, fontFamily:"'Share Tech Mono', monospace", fontSize:11, color:"#e8001d", background:"rgba(232,0,29,0.1)", border:"1px solid rgba(232,0,29,0.3)", borderRadius:5, padding:"3px 10px" }}>
          .{id}
        </div>
      </div>

      <div className="panel-body">
        {rows.map((row, i) => (
          <div className="panel-row" key={row.label}>
            <div className="panel-row-icon">{row.icon}</div>
            <span className="panel-row-label">{row.label}</span>
            <span
              className={`panel-row-value${flashKey ? " flash" : ""}`}
              key={`${flashKey}-${i}`}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>

      <button className={`copy-btn${copied ? " copied" : ""}`} onClick={onCopy}>
        {copied ? "✓ Copiato" : "⎘ Copia Discord"}
      </button>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────
export default function App() {
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState("Tutti");
  const [selected, setSelected] = useState(null);
  const [copied, setCopied]     = useState(false);

  const filtered = useMemo(() =>
    Object.entries(TRACKS).filter(([key, t]) => {
      const q = search.toLowerCase();
      const matchS = t.nome.toLowerCase().includes(q) || key.includes(q);
      const matchF = filter === "Tutti" || t.continente === filter;
      return matchS && matchF;
    }),
  [search, filter]);

  const handleCopy = () => {
    if (!selected) return;
    navigator.clipboard.writeText(buildDiscordMessage(selected, TRACKS[selected])).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <>
      <style>{css}</style>
      <div style={{
        minHeight: "100vh",
        background: "#050810",
        color: "#c8d6e0",
        fontFamily: "'Share Tech Mono', monospace",
        position: "relative",
      }}>
        {/* Grid bg */}
        <div style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
          backgroundImage: `
            linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "44px 44px",
        }} />

        {/* Header */}
        <header style={{
          position: "relative", zIndex: 1,
          padding: "28px 32px 22px",
          borderBottom: "1px solid #1c2736",
          background: "linear-gradient(180deg, #0a0e18 0%, #050810 100%)",
        }}>
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>
            {/* Status row */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{
                width: 7, height: 7, borderRadius: "50%",
                background: "#e8001d",
                animation: "pulse-dot 2s ease-in-out infinite",
              }} />
              <span style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: 9.5, color: "#e8001d",
                textTransform: "uppercase", letterSpacing: 2.8, fontWeight: 600,
              }}>
                F1 Setup System · Online
              </span>
            </div>
            {/* Title row */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
              <h1 style={{
                margin: 0, fontFamily: "'Orbitron', sans-serif",
                fontSize: 26, fontWeight: 700, color: "#f0f4f8", letterSpacing: -0.3,
              }}>
                Setup Dashboard
              </h1>
              <span style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: 11, color: "#2e4050",
              }}>
                {Object.keys(TRACKS).length} circuiti · simulatore
              </span>
            </div>
          </div>
        </header>

        {/* Main */}
        <main style={{
          position: "relative", zIndex: 1,
          padding: "24px 32px 40px",
          maxWidth: 1080, margin: "0 auto",
        }}>
          {/* Toolbar */}
          <div style={{ display: "flex", gap: 10, marginBottom: 22, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ position: "relative", flex: "1 1 200px", minWidth: 180 }}>
              <span style={{
                position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                color: "#2e4050", fontSize: 13, pointerEvents: "none",
              }}>⌕</span>
              <input
                className="search-input"
                type="text"
                placeholder="Cerca pista o comando..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {CONTINENTI.map(c => (
                <button
                  key={c}
                  className={`pill${filter === c ? " active" : ""}`}
                  onClick={() => setFilter(c)}
                >
                  {c}
                </button>
              ))}
            </div>
            {/* Contatore risultati */}
            <span style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: 10, color: "#2e4050",
              marginLeft: "auto", letterSpacing: 0.5,
            }}>
              {filtered.length} risultati
            </span>
          </div>

          {/* Layout: grid + panel */}
          <div className="main-layout" style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
            {/* Grid */}
            <div style={{
              flex: 1,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(195px, 1fr))",
              gap: 9,
              alignContent: "start",
            }}>
              {filtered.length === 0 ? (
                <div className="no-results">
                  <div className="no-results-icon">🔍</div>
                  <div className="no-results-text">Nessuna pista trovata</div>
                </div>
              ) : filtered.map(([key, track], i) => (
                <TrackCard
                  key={key}
                  id={key}
                  track={track}
                  isSelected={selected === key}
                  index={i}
                  onClick={() => { setSelected(key); setCopied(false); }}
                />
              ))}
            </div>

            {/* Panel */}
            <SetupPanel
              id={selected}
              track={selected ? TRACKS[selected] : null}
              onCopy={handleCopy}
              copied={copied}
            />
          </div>
        </main>
      </div>
    </>
  );
}
