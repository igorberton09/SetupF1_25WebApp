import { useState, useMemo, useEffect, useRef } from "react";

// ─── FONT LOADER (React-safe, esegue una sola volta) ─────────────
function useFonts() {
  useEffect(() => {
    if (document.getElementById("f1-fonts")) return;
    const link = document.createElement("link");
    link.id = "f1-fonts";
    link.href =
      "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Share+Tech+Mono&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);
}

// ─── DATI ─────────────────────────────────────────────────────────
const TRACKS = {
  australia:   { nome: "Melbourne",   aero: [23, 10], trasmissione: 41, sosp: [1, 12, 17, 20, 44], continente: "Oceania" },
  cina:        { nome: "Shanghai",    aero: [24, 21], trasmissione: 41, sosp: [1,  4,  8, 21, 48], continente: "Asia"    },
  suzuka:      { nome: "Suzuka",      aero: [31, 21], trasmissione: 41, sosp: [1,  6, 21, 22, 42], continente: "Asia"    },
  bahrain:     { nome: "Sakhir",      aero: [34, 29], trasmissione: 41, sosp: [10, 9, 10, 20, 40], continente: "Asia"    },
  jeddah:      { nome: "Jeddah",      aero: [15,  1], trasmissione: 41, sosp: [6,  1,  7, 18, 40], continente: "Asia"    },
  miami:       { nome: "Miami",       aero: [12,  4], trasmissione: 30, sosp: [1,  1, 17, 22, 40], continente: "America" },
  imola:       { nome: "Imola",       aero: [43, 37], trasmissione: 41, sosp: [1,  9, 21, 23, 52], continente: "Europa"  },
  monaco:      { nome: "Monaco",      aero: [50, 50], trasmissione: 41, sosp: [22, 3, 21, 19, 49], continente: "Europa"  },
  spagna:      { nome: "Barcellona",  aero: [41, 32], trasmissione: 38, sosp: [2,  6, 21, 20, 43], continente: "Europa"  },
  canada:      { nome: "Montreal",    aero: [35, 28], trasmissione: 41, sosp: [1,  1, 18, 19, 40], continente: "America" },
  austria:     { nome: "Spielberg",   aero: [37, 30], trasmissione: 41, sosp: [5,  3, 20, 20, 46], continente: "Europa"  },
  silverstone: { nome: "Silverstone", aero: [12,  0], trasmissione: 41, sosp: [1,  5, 18, 21, 40], continente: "Europa"  },
  spa:         { nome: "Spa",         aero: [8,   8], trasmissione: 41, sosp: [1,  6, 12, 20, 40], continente: "Europa"  },
  ungheria:    { nome: "Budapest",    aero: [50, 50], trasmissione: 41, sosp: [1, 10, 21, 19, 40], continente: "Europa"  },
  olanda:      { nome: "Zandvoort",   aero: [50, 48], trasmissione: 41, sosp: [1,  9, 21, 22, 40], continente: "Europa"  },
  monza:       { nome: "Monza",       aero: [0,   3], trasmissione: 41, sosp: [1,  1, 21, 21, 40], continente: "Europa"  },
  baku:        { nome: "Baku",        aero: [4,   1], trasmissione: 41, sosp: [1,  1, 19, 21, 40], continente: "Asia"    },
  singapore:   { nome: "Singapore",   aero: [50, 47], trasmissione: 41, sosp: [1, 16, 21, 20, 40], continente: "Asia"    },
  austin:      { nome: "Austin",      aero: [41, 34], trasmissione: 41, sosp: [3,  1, 21, 20, 40], continente: "America" },
  messico:     { nome: "Mexico City", aero: [40, 36], trasmissione: 32, sosp: [3,  5, 21, 23, 45], continente: "America" },
  brasile:     { nome: "Sao Paolo",   aero: [27, 14], trasmissione: 41, sosp: [5,  2, 21, 22, 41], continente: "America" },
  lasvegas:    { nome: "Las Vegas",   aero: [1,   0], trasmissione: 41, sosp: [6,  5, 21, 23, 48], continente: "America" },
  qatar:       { nome: "Lusail",      aero: [42, 30], trasmissione: 41, sosp: [3,  1, 16, 19, 45], continente: "Asia"    },
  abudhabi:    { nome: "Yas Marina",  aero: [29, 18], trasmissione: 41, sosp: [1,  1, 17, 17, 40], continente: "Asia"    },
};

const SHARED = {
  trasmissione: "100 - 20",
  geometria:    "-3,50° · -2,00° · 0,00° · 0,10°",
  freni:        "55% - 100%",
  gomme:        "29,5 - 29,5 - 26,5 - 26,5",
};

const CONTINENTI = ["Tutti", "Europa", "Asia", "America", "Oceania"];

const CONTINENT_EMOJI = {
  Europa: "🇪🇺",
  Asia: "🌏",
  America: "🌎",
  Oceania: "🌏",
};

// ─── DISCORD MESSAGE ──────────────────────────────────────────────
function buildDiscordMessage(key, track) {
  return (
    `📍 **${track.nome}**\n` +
    `🔧 AERODINAMICA: ${track.aero[0]} - ${track.aero[1]}\n` +
    `⚙️ TRASMISSIONE: ${SHARED.trasmissione}\n` +
    `📐 GEOMETRIA: ${SHARED.geometria}\n` +
    `🔩 SOSPENSIONI: ${track.sosp.join(" - ")}\n` +
    `🛞 FRENI: ${SHARED.freni}\n` +
    `🏎️ GOMME: ${SHARED.gomme}`
  );
}

// ─── CSS ──────────────────────────────────────────────────────────
const css = `
  *, *::before, *::after { box-sizing: border-box; }

  /* ── Keyframes ─────────────────────────────────────────────── */
  @keyframes pulse-dot {
    0%, 100% { opacity: 1; box-shadow: 0 0 4px #e8001d; }
    50%      { opacity: 0.55; box-shadow: 0 0 12px #e8001d, 0 0 24px rgba(232,0,29,0.25); }
  }
  @keyframes card-in {
    from { opacity: 0; transform: translateY(12px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0)    scale(1);    }
  }
  @keyframes panel-in {
    from { opacity: 0; transform: translateX(20px); }
    to   { opacity: 1; transform: translateX(0);    }
  }
  @keyframes value-pop {
    0%   { color: #00d4ff; text-shadow: 0 0 10px rgba(0,212,255,0.5); transform: scale(1.05); }
    60%  { transform: scale(1); }
    100% { color: #e2e8f0; text-shadow: none; transform: scale(1); }
  }
  @keyframes glow-pulse {
    0%, 100% { opacity: 0.6; }
    50%      { opacity: 1; }
  }

  /* ── Root / Layout ─────────────────────────────────────────── */
  .f1-root {
    min-height: 100vh;
    background: #050810;
    color: #c8d6e0;
    font-family: 'Share Tech Mono', monospace;
    position: relative;
    overflow-x: hidden;
  }
  .f1-grid-bg {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background-image:
      linear-gradient(rgba(0,212,255,0.028) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,212,255,0.028) 1px, transparent 1px);
    background-size: 48px 48px;
  }
  /* Subtle radial vignette */
  .f1-vignette {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background: radial-gradient(ellipse 80% 70% at 50% 40%, transparent 40%, rgba(5,8,16,0.55) 100%);
  }

  /* ── Header ────────────────────────────────────────────────── */
  .f1-header {
    position: relative;
    z-index: 1;
    padding: 26px 32px 20px;
    border-bottom: 1px solid #1a2332;
    background: linear-gradient(180deg, #0b0f1a 0%, #050810 100%);
  }
  .f1-header-inner { max-width: 1120px; margin: 0 auto; }
  .f1-status {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
  }
  .f1-status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #e8001d;
    animation: pulse-dot 2s ease-in-out infinite;
  }
  .f1-status-label {
    font-size: 9px;
    color: #e8001d;
    text-transform: uppercase;
    letter-spacing: 2.8px;
    font-weight: 600;
  }
  .f1-title-row {
    display: flex;
    align-items: baseline;
    gap: 18px;
    flex-wrap: wrap;
  }
  .f1-title {
    margin: 0;
    font-family: 'Orbitron', sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: #f0f4f8;
    letter-spacing: -0.3px;
  }
  .f1-subtitle {
    font-size: 10.5px;
    color: #2a3f52;
    letter-spacing: 0.3px;
  }

  /* ── Main ──────────────────────────────────────────────────── */
  .f1-main {
    position: relative;
    z-index: 1;
    padding: 22px 32px 48px;
    max-width: 1120px;
    margin: 0 auto;
  }

  /* ── Toolbar ───────────────────────────────────────────────── */
  .f1-toolbar {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    flex-wrap: wrap;
    align-items: center;
  }
  .f1-search-wrap {
    position: relative;
    flex: 1 1 220px;
    min-width: 180px;
  }
  .f1-search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #2a3f52;
    font-size: 13px;
    pointer-events: none;
  }
  .f1-search {
    width: 100%;
    padding: 10px 14px 10px 36px;
    background: #0a1018;
    border: 1px solid #1a2332;
    border-radius: 7px;
    color: #c8d6e0;
    font-family: 'Share Tech Mono', monospace;
    font-size: 12px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .f1-search::placeholder { color: #2a3f52; }
  .f1-search:focus {
    border-color: #e8001d;
    box-shadow: 0 0 0 2px rgba(232,0,29,0.12);
  }

  /* ── Pills ─────────────────────────────────────────────────── */
  .f1-pills { display: flex; gap: 5px; flex-wrap: wrap; }
  .f1-pill {
    padding: 6px 14px;
    border-radius: 5px;
    background: transparent;
    border: 1px solid #1a2332;
    color: #3d5a6e;
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 1.2px;
    cursor: pointer;
    transition: all 0.18s ease;
  }
  .f1-pill:hover {
    border-color: #3a5068;
    color: #8aacbe;
    background: rgba(58,80,104,0.08);
  }
  .f1-pill.active {
    background: rgba(232,0,29,0.1);
    border-color: rgba(232,0,29,0.4);
    color: #e8001d;
  }
  .f1-pill.active:hover {
    background: rgba(232,0,29,0.16);
    border-color: rgba(232,0,29,0.55);
  }

  .f1-count {
    font-size: 10px;
    color: #2a3f52;
    margin-left: auto;
    letter-spacing: 0.4px;
  }

  /* ── Main Layout ───────────────────────────────────────────── */
  .f1-layout {
    display: flex;
    gap: 22px;
    align-items: flex-start;
  }

  /* ── Track Grid ────────────────────────────────────────────── */
  .f1-grid {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 10px;
    align-content: start;
  }

  /* ── Track Card ────────────────────────────────────────────── */
  .track-card {
    background: linear-gradient(155deg, #0e1522 0%, #0b1018 100%);
    border: 1px solid #162232;
    border-radius: 10px;
    padding: 14px 15px 15px;
    cursor: pointer;
    text-align: left;
    position: relative;
    overflow: hidden;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
    animation: card-in 0.4s cubic-bezier(.4,0,.2,1) both;
  }
  /* Bottom accent line */
  .track-card::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent 10%, #e8001d 50%, transparent 90%);
    opacity: 0;
    transition: opacity 0.25s ease;
  }
  .track-card:hover {
    border-color: #243848;
    box-shadow: 0 6px 28px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.2);
    transform: translateY(-2px);
  }
  .track-card:hover::after { opacity: 0.7; }

  /* Selected state */
  .track-card.selected {
    border-color: #e8001d;
    box-shadow:
      0 0 0 1px rgba(232,0,29,0.5),
      0 6px 32px rgba(232,0,29,0.18),
      inset 0 1px 0 rgba(232,0,29,0.08);
    background: linear-gradient(155deg, #1a1215 0%, #0e1220 100%);
  }
  .track-card.selected::after {
    opacity: 1;
    background: #e8001d;
  }

  /* Card watermark number */
  .card-index {
    position: absolute;
    top: 4px; right: 8px;
    font-family: 'Orbitron', sans-serif;
    font-size: 36px;
    font-weight: 900;
    color: rgba(255,255,255,0.04);
    line-height: 1;
    pointer-events: none;
    user-select: none;
  }

  /* Card header */
  .card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 3px;
    position: relative;
  }
  .card-name {
    font-family: 'Orbitron', sans-serif;
    font-size: 12.5px;
    font-weight: 600;
    color: #dde4eb;
    letter-spacing: 0.3px;
  }
  .card-continent {
    font-size: 11px;
    opacity: 0.5;
    flex-shrink: 0;
  }
  .card-cmd {
    font-size: 10px;
    color: #2e4455;
    letter-spacing: 0.6px;
    margin-bottom: 10px;
    transition: color 0.2s;
  }
  .track-card.selected .card-cmd { color: rgba(232,0,29,0.7); }

  /* ── Aero Bars ─────────────────────────────────────────────── */
  .aero-row { display: flex; align-items: center; gap: 7px; margin-bottom: 4px; }
  .aero-row:last-child { margin-bottom: 0; }
  .aero-label {
    font-size: 8.5px;
    color: #2e4455;
    text-transform: uppercase;
    letter-spacing: 1px;
    width: 34px;
    flex-shrink: 0;
  }
  .aero-track {
    flex: 1;
    height: 4px;
    background: #0d1520;
    border-radius: 2px;
    overflow: hidden;
  }
  .aero-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 0.45s cubic-bezier(.4,0,.2,1);
  }
  .aero-val {
    font-size: 10.5px;
    color: #5a7a8f;
    width: 20px;
    text-align: right;
    flex-shrink: 0;
  }

  /* ── Panel ─────────────────────────────────────────────────── */
  .f1-panel {
    flex: 0 0 310px;
    background: #070c15;
    border: 1px solid #162232;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 12px 48px rgba(0,0,0,0.5);
    position: relative;
    animation: panel-in 0.38s cubic-bezier(.4,0,.2,1) both;
  }
  /* Scanlines */
  .f1-panel::before {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent 0px, transparent 3px,
      rgba(255,255,255,0.015) 3px, rgba(255,255,255,0.015) 4px
    );
    pointer-events: none;
    z-index: 3;
    border-radius: 12px;
  }

  /* Panel Header */
  .panel-header {
    position: relative;
    padding: 22px 22px 18px;
    border-bottom: 1px solid #162232;
    background: linear-gradient(180deg, #0f0e18 0%, #070c15 100%);
    overflow: hidden;
  }
  .panel-header-glow {
    position: absolute;
    top: -40px; right: -40px;
    width: 160px; height: 160px;
    border-radius: 50%;
    pointer-events: none;
    animation: glow-pulse 3s ease-in-out infinite;
  }
  .panel-suptitle {
    font-size: 8.5px;
    color: #2e4455;
    text-transform: uppercase;
    letter-spacing: 2.8px;
    margin-bottom: 6px;
    position: relative;
  }
  .panel-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: #f0f4f8;
    letter-spacing: -0.3px;
    position: relative;
  }
  .panel-cmd-badge {
    position: absolute;
    top: 22px; right: 22px;
    font-size: 10.5px;
    color: #e8001d;
    background: rgba(232,0,29,0.1);
    border: 1px solid rgba(232,0,29,0.25);
    border-radius: 5px;
    padding: 3px 10px;
  }

  /* Panel Body */
  .panel-body { padding: 4px 22px 2px; position: relative; z-index: 1; }
  .panel-row {
    display: flex;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #0f1a26;
    gap: 10px;
  }
  .panel-row:last-child { border-bottom: none; }
  .panel-row-icon {
    width: 28px; height: 28px;
    border-radius: 6px;
    background: #0b1420;
    border: 1px solid #152230;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px;
    flex-shrink: 0;
  }
  .panel-row-label {
    font-size: 9px;
    color: #2e4455;
    text-transform: uppercase;
    letter-spacing: 1.6px;
    flex-shrink: 0;
    min-width: 95px;
  }
  .panel-row-value {
    font-size: 12px;
    color: #dde4eb;
    margin-left: auto;
    text-align: right;
    letter-spacing: 0.3px;
  }
  .panel-row-value.pop {
    animation: value-pop 0.6s cubic-bezier(.4,0,.2,1) forwards;
  }

  /* Copy Button */
  .copy-btn {
    margin: 12px 22px 18px;
    width: calc(100% - 44px);
    padding: 11px 0;
    border: none;
    border-radius: 7px;
    cursor: pointer;
    font-family: 'Orbitron', sans-serif;
    font-size: 9.5px;
    font-weight: 600;
    letter-spacing: 2.2px;
    text-transform: uppercase;
    color: #fff;
    background: linear-gradient(135deg, #c40018, #e8001d);
    box-shadow: 0 4px 18px rgba(232,0,29,0.28);
    transition: filter 0.2s, box-shadow 0.2s, background 0.25s, transform 0.1s;
    position: relative;
    z-index: 1;
  }
  .copy-btn:hover {
    filter: brightness(1.1);
    box-shadow: 0 6px 24px rgba(232,0,29,0.38);
    transform: translateY(-1px);
  }
  .copy-btn:active { transform: translateY(0); }
  .copy-btn.copied {
    background: linear-gradient(135deg, #15803d, #22c55e);
    box-shadow: 0 4px 18px rgba(34,197,94,0.28);
  }

  /* Panel Empty State */
  .panel-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 60px 24px;
    position: relative;
    z-index: 1;
  }
  .panel-empty-ring {
    width: 64px; height: 64px;
    border-radius: 50%;
    border: 1px solid #162232;
    display: flex; align-items: center; justify-content: center;
    position: relative;
  }
  .panel-empty-ring::before {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: 50%;
    background: conic-gradient(from 0deg, transparent 0%, transparent 70%, #e8001d 85%, transparent 100%);
    opacity: 0.3;
    animation: spin 4s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .panel-empty-icon { font-size: 22px; position: relative; z-index: 1; }
  .panel-empty-text {
    font-size: 11px;
    color: #2a3f52;
    text-align: center;
    line-height: 2;
    letter-spacing: 0.2px;
  }
  .panel-empty-text strong {
    color: #3d5a6e;
    font-weight: 600;
  }

  /* ── No Results ─────────────────────────────────────────────── */
  .no-results {
    grid-column: 1 / -1;
    text-align: center;
    padding: 56px 20px;
  }
  .no-results-icon { font-size: 26px; opacity: 0.15; margin-bottom: 12px; }
  .no-results-text {
    font-size: 11.5px;
    color: #2a3f52;
    letter-spacing: 0.3px;
  }

  /* ── Responsive ─────────────────────────────────────────────── */
  @media (max-width: 820px) {
    .f1-layout { flex-direction: column; }
    .f1-panel { flex: none; width: 100%; }
  }
  @media (max-width: 560px) {
    .f1-header { padding: 20px 18px 16px; }
    .f1-main  { padding: 18px 18px 36px; }
    .f1-title { font-size: 20px; }
  }
`;

// ─── COMPONENTI ───────────────────────────────────────────────────

function AeroBar({ value, label, max = 50 }) {
  const pct = (value / max) * 100;
  const hue = 120 - (pct / 100) * 110; // verde → rosso
  const color = `hsl(${hue}, 75%, 42%)`;
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
      style={{ animationDelay: `${index * 0.035}s` }}
      onClick={onClick}
    >
      <span className="card-index">{String(index + 1).padStart(2, "0")}</span>
      <div className="card-top">
        <div className="card-name">{track.nome}</div>
        <span className="card-continent">{CONTINENT_EMOJI[track.continente]}</span>
      </div>
      <div className="card-cmd">.{id}</div>
      <AeroBar value={track.aero[0]} label="Front" />
      <AeroBar value={track.aero[1]} label="Rear" />
    </button>
  );
}

function SetupPanel({ id, track, onCopy, copied }) {
  const prevTrackRef = useRef(null);
  const [popTick, setPopTick] = useState(0);

  // Attiva l'animazione pop solo quando cambia pista
  useEffect(() => {
    if (track && prevTrackRef.current !== id) {
      prevTrackRef.current = id;
      setPopTick((t) => t + 1);
    }
  }, [id, track]);

  // ── Empty state ──
  if (!track) {
    return (
      <div className="f1-panel">
        <div className="panel-empty">
          <div className="panel-empty-ring">
            <span className="panel-empty-icon">🏎️</span>
          </div>
          <div className="panel-empty-text">
            Seleziona una <strong>pista</strong><br />
            per visualizzare il setup
          </div>
        </div>
      </div>
    );
  }

  // ── Glow intensità basata sull'aero medio ──
  const aeroAvg = (track.aero[0] + track.aero[1]) / 2;
  const glowOpacity = 0.12 + (aeroAvg / 50) * 0.25;

  const rows = [
    { icon: "🔧", label: "Aerodinamica", value: `${track.aero[0]} · ${track.aero[1]}` },
    { icon: "⚙️", label: "Trasmissione", value: SHARED.trasmissione },
    { icon: "📐", label: "Geometria",    value: SHARED.geometria },
    { icon: "🔩", label: "Sospensioni",  value: track.sosp.join(" · ") },
    { icon: "🛞", label: "Freni",        value: SHARED.freni },
    { icon: "🏎️", label: "Gomme",        value: SHARED.gomme },
  ];

  return (
    <div className="f1-panel" key={id}>
      {/* Header */}
      <div className="panel-header">
        <div
          className="panel-header-glow"
          style={{
            background: `radial-gradient(circle, rgba(232,0,29,${glowOpacity}) 0%, transparent 70%)`,
          }}
        />
        <div className="panel-suptitle">Setup · Telemetria</div>
        <div className="panel-title">{track.nome}</div>
        <div className="panel-cmd-badge">.{id}</div>
      </div>

      {/* Rows */}
      <div className="panel-body">
        {rows.map((row, i) => (
          <div className="panel-row" key={row.label}>
            <div className="panel-row-icon">{row.icon}</div>
            <span className="panel-row-label">{row.label}</span>
            <span
              className="panel-row-value pop"
              key={`${popTick}-${i}`}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {/* Copy */}
      <button className={`copy-btn${copied ? " copied" : ""}`} onClick={onCopy}>
        {copied ? "✓ Copiato" : "⎘ Copia Discord"}
      </button>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────
export default function App() {
  useFonts();

  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState("Tutti");
  const [selected, setSelected] = useState(null);
  const [copied, setCopied]     = useState(false);

  const filtered = useMemo(() =>
    Object.entries(TRACKS).filter(([key, t]) => {
      const q = search.toLowerCase();
      const matchSearch = t.nome.toLowerCase().includes(q) || key.includes(q);
      const matchFilter = filter === "Tutti" || t.continente === filter;
      return matchSearch && matchFilter;
    }),
    [search, filter]
  );

  const handleCopy = () => {
    if (!selected) return;
    navigator.clipboard
      .writeText(buildDiscordMessage(selected, TRACKS[selected]))
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      });
  };

  return (
    <>
      <style>{css}</style>

      <div className="f1-root">
        {/* Background layers */}
        <div className="f1-grid-bg" />
        <div className="f1-vignette" />

        {/* Header */}
        <header className="f1-header">
          <div className="f1-header-inner">
            <div className="f1-status">
              <div className="f1-status-dot" />
              <span className="f1-status-label">F1 Setup System · Online</span>
            </div>
            <div className="f1-title-row">
              <h1 className="f1-title">Setup Dashboard</h1>
              <span className="f1-subtitle">
                {Object.keys(TRACKS).length} circuiti · simulatore
              </span>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="f1-main">
          {/* Toolbar */}
          <div className="f1-toolbar">
            <div className="f1-search-wrap">
              <span className="f1-search-icon">⌕</span>
              <input
                className="f1-search"
                type="text"
                placeholder="Cerca pista o comando..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="f1-pills">
              {CONTINENTI.map((c) => (
                <button
                  key={c}
                  className={`f1-pill${filter === c ? " active" : ""}`}
                  onClick={() => setFilter(c)}
                >
                  {c}
                </button>
              ))}
            </div>
            <span className="f1-count">{filtered.length} risultati</span>
          </div>

          {/* Grid + Panel */}
          <div className="f1-layout">
            <div className="f1-grid">
              {filtered.length === 0 ? (
                <div className="no-results">
                  <div className="no-results-icon">🔍</div>
                  <div className="no-results-text">Nessuna pista trovata</div>
                </div>
              ) : (
                filtered.map(([key, track], i) => (
                  <TrackCard
                    key={key}
                    id={key}
                    track={track}
                    isSelected={selected === key}
                    index={i}
                    onClick={() => {
                      setSelected(key);
                      setCopied(false);
                    }}
                  />
                ))
              )}
            </div>

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