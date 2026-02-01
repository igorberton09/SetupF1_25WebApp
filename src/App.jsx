import { useState, useMemo, useEffect } from "react";

// ─── FONT LOADER ──────────────────────────────────────────────────
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

// ─── SETUP DATA ───────────────────────────────────────────────────
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
const CONTINENT_EMOJI = { Europa: "🇪🇺", Asia: "🌏", America: "🌎", Oceania: "🌏" };

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

// ─── LEADERBOARD DATA (2024 season) ──────────────────────────────
const RACE_RESULTS = [
  { race: "Bahrain",    results: ["Verstappen","Perez","Sainz","Alonso","Norris","Albon","Gasly","Ocon","Hulkenberg","Tsunoda"] },
  { race: "Saudi Arabia", results: ["Verstappen","Perez","Sainz","Alonso","Norris","Albon","Gasly","Ocon","Hulkenberg","Tsunoda"] },
  { race: "Australia",  results: ["Sainz","Norris","Alonso","Perez","Gasly","Albon","Tsunoda","Hulkenberg","Magnussen","Zhou"] },
  { race: "Japan",      results: ["Verstappen","Perez","Sainz","Alonso","Norris","Albon","Gasly","Ocon","Hulkenberg","Tsunoda"] },
  { race: "China",      results: ["Verstappen","Norris","Perez","Sainz","Alonso","Gasly","Albon","Tsunoda","Hulkenberg","Magnussen"] },
  { race: "Miami",      results: ["Norris","Verstappen","Sainz","Perez","Alonso","Gasly","Albon","Tsunoda","Hulkenberg","Magnussen"] },
  { race: "Emilia Romagna", results: ["Verstappen","Norris","Sainz","Perez","Alonso","Gasly","Albon","Tsunoda","Hulkenberg","Magnussen"] },
  { race: "Monaco",     results: ["Sainz","Norris","Alonso","Perez","Verstappen","Gasly","Albon","Tsunoda","Hulkenberg","Magnussen"] },
  { race: "Spain",      results: ["Verstappen","Norris","Hamilton","Sainz","Perez","Alonso","Gasly","Albon","Tsunoda","Hulkenberg"] },
  { race: "Canada",     results: ["Verstappen","Norris","Russell","Sainz","Perez","Alonso","Gasly","Albon","Tsunoda","Hulkenberg"] },
  { race: "Austria",    results: ["Verstappen","Piastri","Sainz","Norris","Perez","Alonso","Gasly","Albon","Tsunoda","Hulkenberg"] },
  { race: "Britain",    results: ["Hamilton","Verstappen","Norris","Sainz","Perez","Alonso","Gasly","Albon","Tsunoda","Hulkenberg"] },
  { race: "Hungary",    results: ["Piastri","Norris","Sainz","Verstappen","Perez","Alonso","Gasly","Albon","Tsunoda","Hulkenberg"] },
  { race: "Belgium",    results: ["Piastri","Sainz","Verstappen","Norris","Perez","Alonso","Gasly","Albon","Tsunoda","Hulkenberg"] },
  { race: "Netherlands",results: ["Verstappen","Norris","Sainz","Perez","Alonso","Gasly","Albon","Tsunoda","Hulkenberg","Magnussen"] },
  { race: "Monza",      results: ["Sainz","Norris","Verstappen","Perez","Alonso","Gasly","Albon","Tsunoda","Hulkenberg","Magnussen"] },
  { race: "Singapore",  results: ["Norris","Verstappen","Sainz","Perez","Alonso","Gasly","Albon","Tsunoda","Hulkenberg","Magnussen"] },
  { race: "USA",        results: ["Verstappen","Norris","Sainz","Perez","Alonso","Gasly","Albon","Tsunoda","Hulkenberg","Magnussen"] },
  { race: "Mexico",     results: ["Sainz","Norris","Verstappen","Perez","Alonso","Gasly","Albon","Tsunoda","Hulkenberg","Magnussen"] },
  { race: "Brazil",     results: ["Verstappen","Ocon","Gasly","Sainz","Norris","Perez","Alonso","Albon","Tsunoda","Hulkenberg"] },
  { race: "Las Vegas",  results: ["Russell","Hamilton","Sainz","Verstappen","Norris","Perez","Alonso","Gasly","Albon","Tsunoda"] },
  { race: "Qatar",      results: ["Verstappen","Sainz","Norris","Perez","Alonso","Russell","Hamilton","Gasly","Albon","Tsunoda"] },
  { race: "Abu Dhabi",  results: ["Norris","Sainz","Verstappen","Perez","Alonso","Russell","Hamilton","Gasly","Albon","Tsunoda"] },
];

const POINTS_TABLE = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

const DRIVER_TEAMS = {
  Verstappen: { team: "Red Bull", num: 1, flag: "🇳🇱" },
  Perez:      { team: "Red Bull", num: 11, flag: "🇲🇽" },
  Norris:     { team: "McLaren", num: 4, flag: "🇬🇧" },
  Sainz:      { team: "Ferrari", num: 55, flag: "🇪🇸" },
  Alonso:     { team: "Aston Martin", num: 14, flag: "🇪🇸" },
  Hamilton:   { team: "Mercedes", num: 44, flag: "🇬🇧" },
  Russell:    { team: "Mercedes", num: 63, flag: "🇬🇧" },
  Piastri:    { team: "McLaren", num: 81, flag: "🇦🇺" },
  Gasly:      { team: "Alpine", num: 10, flag: "🇫🇷" },
  Ocon:       { team: "Alpine", num: 31, flag: "🇫🇷" },
  Albon:      { team: "Williams", num: 23, flag: "🇹🇭" },
  Tsunoda:    { team: "RB", num: 22, flag: "🇯🇵" },
  Hulkenberg: { team: "Haas", num: 27, flag: "🇩🇪" },
  Magnussen:  { team: "Haas", num: 20, flag: "🇩🇰" },
  Zhou:       { team: "Sauber", num: 24, flag: "🇨🇳" },
};

const TEAM_COLORS = {
  "Red Bull": "#3671C6",
  "McLaren": "#FF8000",
  "Ferrari": "#E8002D",
  "Aston Martin": "#358C75",
  "Mercedes": "#27C7B7",
  "Alpine": "#FF5733",
  "Williams": "#2ECC71",
  "RB": "#5E5B73",
  "Haas": "#B8B8B8",
  "Sauber": "#A6A6A6",
};

function computeDriverStandings() {
  const pts = {};
  const wins = {};
  const podiums = {};
  RACE_RESULTS.forEach(({ results }) => {
    results.forEach((d, i) => {
      pts[d] = (pts[d] || 0) + POINTS_TABLE[i];
      if (i === 0) wins[d] = (wins[d] || 0) + 1;
      if (i < 3) podiums[d] = (podiums[d] || 0) + 1;
    });
  });
  return Object.keys(pts)
    .map((name) => ({
      name,
      points: pts[name],
      wins: wins[name] || 0,
      podiums: podiums[name] || 0,
      ...DRIVER_TEAMS[name],
    }))
    .sort((a, b) => b.points - a.points || b.wins - a.wins);
}

function computeTeamStandings() {
  const teams = {};
  RACE_RESULTS.forEach(({ results }) => {
    results.forEach((d, i) => {
      const info = DRIVER_TEAMS[d];
      if (!info) return;
      if (!teams[info.team]) teams[info.team] = { points: 0, wins: 0 };
      teams[info.team].points += POINTS_TABLE[i];
      if (i === 0) teams[info.team].wins += 1;
    });
  });
  return Object.entries(teams)
    .map(([team, data]) => ({ team, ...data }))
    .sort((a, b) => b.points - a.points);
}

const DRIVER_STANDINGS = computeDriverStandings();
const TEAM_STANDINGS   = computeTeamStandings();

// ─── CALENDAR DATA ────────────────────────────────────────────────
const CALENDAR = [
  { round: 1,  race: "Bahrain GP",           city: "Sakhir",      date: "01 Mar", status: "done",    winner: "Verstappen" },
  { round: 2,  race: "Saudi Arabian GP",     city: "Jeddah",      date: "09 Mar", status: "done",    winner: "Verstappen" },
  { round: 3,  race: "Australian GP",        city: "Melbourne",   date: "24 Mar", status: "done",    winner: "Sainz" },
  { round: 4,  race: "Japanese GP",          city: "Suzuka",      date: "07 Apr", status: "done",    winner: "Verstappen" },
  { round: 5,  race: "Chinese GP",           city: "Shanghai",    date: "21 Apr", status: "done",    winner: "Verstappen" },
  { round: 6,  race: "Miami GP",             city: "Miami",       date: "05 May", status: "done",    winner: "Norris" },
  { round: 7,  race: "Emilia Romagna GP",    city: "Imola",       date: "19 May", status: "done",    winner: "Verstappen" },
  { round: 8,  race: "Monaco GP",            city: "Monaco",      date: "26 May", status: "done",    winner: "Sainz" },
  { round: 9,  race: "Spanish GP",           city: "Barcelona",   date: "23 Jun", status: "done",    winner: "Verstappen" },
  { round: 10, race: "Canadian GP",          city: "Montreal",    date: "09 Jun", status: "done",    winner: "Verstappen" },
  { round: 11, race: "Austrian GP",          city: "Spielberg",   date: "30 Jun", status: "done",    winner: "Verstappen" },
  { round: 12, race: "British GP",           city: "Silverstone", date: "07 Jul", status: "done",    winner: "Hamilton" },
  { round: 13, race: "Hungarian GP",         city: "Budapest",    date: "21 Jul", status: "done",    winner: "Piastri" },
  { round: 14, race: "Belgian GP",           city: "Spa",         date: "28 Jul", status: "done",    winner: "Piastri" },
  { round: 15, race: "Dutch GP",             city: "Zandvoort",   date: "25 Aug", status: "done",    winner: "Verstappen" },
  { round: 16, race: "Italian GP",           city: "Monza",       date: "01 Sep", status: "done",    winner: "Sainz" },
  { round: 17, race: "Singapore GP",         city: "Singapore",   date: "22 Sep", status: "done",    winner: "Norris" },
  { round: 18, race: "United States GP",     city: "Austin",      date: "20 Oct", status: "done",    winner: "Verstappen" },
  { round: 19, race: "Mexico City GP",       city: "Mexico City", date: "27 Oct", status: "done",    winner: "Sainz" },
  { round: 20, race: "São Paulo GP",         city: "São Paulo",   date: "03 Nov", status: "done",    winner: "Verstappen" },
  { round: 21, race: "Las Vegas GP",         city: "Las Vegas",   date: "23 Nov", status: "done",    winner: "Russell" },
  { round: 22, race: "Qatar GP",             city: "Lusail",      date: "01 Dec", status: "done",    winner: "Verstappen" },
  { round: 23, race: "Abu Dhabi GP",         city: "Yas Marina",  date: "08 Dec", status: "done",    winner: "Norris" },
];

// ─── DRIVERS PAGE DATA (poles added manually for realism) ─────────
const DRIVER_POLES = {
  Verstappen: 8, Norris: 5, Sainz: 4, Hamilton: 2, Russell: 2, Perez: 1, Piastri: 1, Alonso: 0, Gasly: 0, Ocon: 0, Albon: 0, Tsunoda: 0, Hulkenberg: 0, Magnussen: 0, Zhou: 0
};

// ─── NAV ITEMS ────────────────────────────────────────────────────
const NAV = [
  { id: "leaderboard", label: "Leaderboard", icon: "🏆" },
  { id: "calendar",    label: "Calendario",  icon: "📅" },
  { id: "drivers",     label: "Piloti",      icon: "🏎️" },
  { id: "setup",       label: "Setup",       icon: "⚙️" },
];

// ─── MASTER CSS ───────────────────────────────────────────────────
const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes pulse-dot {
    0%, 100% { opacity: 1; box-shadow: 0 0 4px #e8001d; }
    50%      { opacity: 0.55; box-shadow: 0 0 12px #e8001d, 0 0 24px rgba(232,0,29,0.25); }
  }
  @keyframes card-in {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes value-pop {
    0%   { color: #00d4ff; text-shadow: 0 0 10px rgba(0,212,255,0.5); }
    100% { color: #e2e8f0; text-shadow: none; }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Root ──────────────────────────────────────────────────── */
  .f1-root {
    min-height: 100vh;
    background: #050810;
    color: #c8d6e0;
    font-family: 'Share Tech Mono', monospace;
    position: relative;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
  }
  .f1-grid-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(0,212,255,0.028) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,212,255,0.028) 1px, transparent 1px);
    background-size: 48px 48px;
  }
  .f1-vignette {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background: radial-gradient(ellipse 80% 70% at 50% 40%, transparent 40%, rgba(5,8,16,0.55) 100%);
  }

  /* ── Header + Nav ──────────────────────────────────────────── */
  .f1-header {
    position: relative; z-index: 10;
    background: linear-gradient(180deg, #0b0f1a 0%, #050810 100%);
    border-bottom: 1px solid #1a2332;
  }
  .f1-header-top {
    padding: 18px 28px 0;
    max-width: 1200px; margin: 0 auto;
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 8px;
  }
  .f1-status { display: flex; align-items: center; gap: 8px; }
  .f1-status-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #e8001d;
    animation: pulse-dot 2s ease-in-out infinite;
  }
  .f1-status-label {
    font-size: 9px; color: #e8001d;
    text-transform: uppercase; letter-spacing: 2.8px; font-weight: 600;
  }
  .f1-title-row { display: flex; align-items: baseline; gap: 14px; }
  .f1-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 20px; font-weight: 700; color: #f0f4f8; letter-spacing: -0.3px;
  }
  .f1-subtitle { font-size: 9.5px; color: #2a3f52; }

  /* ── Nav tabs ──────────────────────────────────────────────── */
  .f1-nav {
    display: flex; gap: 2px;
    padding: 12px 28px 0;
    max-width: 1200px; margin: 0 auto;
  }
  .f1-nav-btn {
    padding: 8px 18px;
    background: transparent;
    border: none; border-bottom: 2px solid transparent;
    color: #3d5a6e;
    font-family: 'Share Tech Mono', monospace;
    font-size: 10.5px; letter-spacing: 1.2px;
    text-transform: uppercase; cursor: pointer;
    transition: color 0.2s, border-color 0.2s, background 0.2s;
    border-radius: 6px 6px 0 0;
  }
  .f1-nav-btn:hover { color: #8aacbe; background: rgba(58,80,104,0.06); }
  .f1-nav-btn.active {
    color: #e8001d;
    border-bottom-color: #e8001d;
    background: rgba(232,0,29,0.06);
  }
  .f1-nav-btn .nav-icon { margin-right: 5px; }

  /* ── Page content ──────────────────────────────────────────── */
  .f1-page {
    position: relative; z-index: 1;
    padding: 24px 28px 48px;
    max-width: 1200px; margin: 0 auto; width: 100%;
    flex: 1;
    animation: fadeIn 0.35s ease;
  }

  /* ── Page header ───────────────────────────────────────────── */
  .page-header {
    margin-bottom: 22px;
  }
  .page-header h2 {
    font-family: 'Orbitron', sans-serif;
    font-size: 16px; font-weight: 600;
    color: #dde4eb; letter-spacing: 0.2px; margin-bottom: 4px;
  }
  .page-header p {
    font-size: 10.5px; color: #2a3f52; letter-spacing: 0.3px;
  }

  /* ═══════════════════════════════════════════════════════════════
     LEADERBOARD
     ══════════════════════════════════════════════════════════════ */
  .lb-tabs {
    display: flex; gap: 6px; margin-bottom: 18px;
  }
  .lb-tab {
    padding: 7px 18px; border-radius: 6px;
    background: transparent; border: 1px solid #1a2332;
    color: #3d5a6e; font-family: 'Share Tech Mono', monospace;
    font-size: 10px; text-transform: uppercase;
    letter-spacing: 1.2px; cursor: pointer;
    transition: all 0.18s ease;
  }
  .lb-tab:hover { border-color: #3a5068; color: #8aacbe; }
  .lb-tab.active { background: rgba(232,0,29,0.1); border-color: rgba(232,0,29,0.4); color: #e8001d; }

  .lb-table {
    width: 100%;
    border-collapse: collapse;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid #1a2332;
  }
  .lb-table thead {
    background: #0a1018;
  }
  .lb-table th {
    padding: 10px 14px;
    text-align: left;
    font-size: 8.5px; color: #2e4455;
    text-transform: uppercase; letter-spacing: 1.4px;
    font-weight: 600; border-bottom: 1px solid #1a2332;
  }
  .lb-table th:last-child { text-align: right; }
  .lb-table td {
    padding: 11px 14px;
    font-size: 12px; color: #c8d6e0;
    border-bottom: 1px solid rgba(26,35,50,0.6);
    background: linear-gradient(155deg, #0e1522 0%, #0b1018 100%);
    transition: background 0.15s;
  }
  .lb-table tr:last-child td { border-bottom: none; }
  .lb-table tr:hover td { background: rgba(58,80,104,0.08); }

  .lb-pos {
    font-family: 'Orbitron', sans-serif;
    font-size: 13px; font-weight: 700;
    width: 30px; text-align: center;
  }
  .lb-pos.p1 { color: #FFD700; }
  .lb-pos.p2 { color: #C0C0C0; }
  .lb-pos.p3 { color: #CD7F32; }

  .lb-driver-cell { display: flex; align-items: center; gap: 10px; }
  .lb-team-dot {
    width: 10px; height: 10px; border-radius: 50%;
    flex-shrink: 0;
  }
  .lb-driver-name {
    font-family: 'Orbitron', sans-serif;
    font-size: 11px; font-weight: 600; color: #dde4eb;
  }
  .lb-driver-sub { font-size: 9px; color: #2e4455; }
  .lb-pts {
    font-family: 'Orbitron', sans-serif;
    font-size: 14px; font-weight: 700;
    color: #e8001d; text-align: right;
  }
  .lb-stat { color: #5a7a8f; text-align: center; font-size: 11.5px; }

  /* Race results expandable */
  .lb-race-toggle {
    font-size: 9.5px; color: #2e4455; cursor: pointer;
    background: none; border: none; font-family: 'Share Tech Mono', monospace;
    letter-spacing: 0.5px; padding: 0;
    transition: color 0.2s;
  }
  .lb-race-toggle:hover { color: #e8001d; }
  .lb-race-list {
    overflow: hidden;
    max-height: 0; opacity: 0;
    transition: max-height 0.35s cubic-bezier(.4,0,.2,1), opacity 0.25s;
  }
  .lb-race-list.open { max-height: 600px; opacity: 1; }
  .lb-race-item {
    display: flex; align-items: center; justify-content: space-between;
    padding: 5px 0;
    border-bottom: 1px solid rgba(26,35,50,0.4);
    font-size: 10.5px;
  }
  .lb-race-item:last-child { border-bottom: none; }
  .lb-race-item-name { color: #5a7a8f; }
  .lb-race-item-pos { color: #c8d6e0; font-size: 10px; }

  /* ═══════════════════════════════════════════════════════════════
     CALENDAR
     ══════════════════════════════════════════════════════════════ */
  .cal-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 10px;
  }
  .cal-card {
    background: linear-gradient(155deg, #0e1522 0%, #0b1018 100%);
    border: 1px solid #162232;
    border-radius: 10px;
    padding: 14px 16px;
    position: relative;
    overflow: hidden;
    animation: card-in 0.4s cubic-bezier(.4,0,.2,1) both;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .cal-card:hover {
    border-color: #243848;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  }
  .cal-card.done { border-left: 3px solid #e8001d; }
  .cal-card.upcoming { border-left: 3px solid #00d4ff; }

  .cal-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
  .cal-round {
    font-family: 'Orbitron', sans-serif;
    font-size: 9px; font-weight: 700;
    color: #2e4455; letter-spacing: 1px;
  }
  .cal-date { font-size: 10px; color: #5a7a8f; }
  .cal-status {
    font-size: 8px; text-transform: uppercase;
    letter-spacing: 1.2px; font-weight: 600;
    padding: 2px 7px; border-radius: 3px;
  }
  .cal-status.done { background: rgba(232,0,29,0.12); color: #e8001d; }
  .cal-status.upcoming { background: rgba(0,212,255,0.1); color: #00d4ff; }

  .cal-race-name {
    font-family: 'Orbitron', sans-serif;
    font-size: 12px; font-weight: 600;
    color: #dde4eb; margin-bottom: 3px;
  }
  .cal-city { font-size: 10px; color: #2e4455; margin-bottom: 8px; }
  .cal-winner {
    display: flex; align-items: center; gap: 6px;
    font-size: 10px; color: #5a7a8f;
  }
  .cal-winner-flag { font-size: 11px; }
  .cal-winner span { color: #c8d6e0; font-weight: 600; }

  /* ═══════════════════════════════════════════════════════════════
     DRIVERS
     ══════════════════════════════════════════════════════════════ */
  .drv-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
    gap: 10px;
  }
  .drv-card {
    background: linear-gradient(155deg, #0e1522 0%, #0b1018 100%);
    border: 1px solid #162232;
    border-radius: 10px;
    padding: 18px 16px 16px;
    position: relative;
    overflow: hidden;
    animation: card-in 0.4s cubic-bezier(.4,0,.2,1) both;
    transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
    cursor: default;
  }
  .drv-card:hover {
    border-color: #243848;
    box-shadow: 0 4px 20px rgba(0,0,0,0.35);
    transform: translateY(-2px);
  }
  .drv-card-num {
    position: absolute; top: 8px; right: 12px;
    font-family: 'Orbitron', sans-serif;
    font-size: 38px; font-weight: 900;
    color: rgba(255,255,255,0.05);
    line-height: 1; pointer-events: none; user-select: none;
  }
  .drv-top { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .drv-flag { font-size: 20px; }
  .drv-name {
    font-family: 'Orbitron', sans-serif;
    font-size: 12.5px; font-weight: 600; color: #dde4eb;
  }
  .drv-team { font-size: 9.5px; color: #2e4455; display: flex; align-items: center; gap: 5px; margin-top: 2px; }
  .drv-team-dot { width: 7px; height: 7px; border-radius: 50%; }

  .drv-stats {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .drv-stat-box {
    background: #0a1018;
    border: 1px solid #152230;
    border-radius: 7px;
    padding: 8px 10px;
    text-align: center;
  }
  .drv-stat-label {
    font-size: 7.5px; color: #2e4455;
    text-transform: uppercase; letter-spacing: 1.2px;
    margin-bottom: 3px;
  }
  .drv-stat-val {
    font-family: 'Orbitron', sans-serif;
    font-size: 18px; font-weight: 700; color: #dde4eb;
  }
  .drv-stat-val.pts { color: #e8001d; }
  .drv-stat-val.wins { color: #FFD700; }
  .drv-stat-val.pods { color: #C0C0C0; }
  .drv-stat-val.poles { color: #00d4ff; }

  /* ═══════════════════════════════════════════════════════════════
     SETUP PAGE (original)
     ══════════════════════════════════════════════════════════════ */
  .f1-toolbar {
    display: flex; gap: 10px; margin-bottom: 20px;
    flex-wrap: wrap; align-items: center;
  }
  .f1-search-wrap { position: relative; flex: 1 1 220px; min-width: 180px; }
  .f1-search-icon {
    position: absolute; left: 12px; top: 50%;
    transform: translateY(-50%); color: #2a3f52;
    font-size: 13px; pointer-events: none;
  }
  .f1-search {
    width: 100%; padding: 10px 14px 10px 36px;
    background: #0a1018; border: 1px solid #1a2332; border-radius: 7px;
    color: #c8d6e0; font-family: 'Share Tech Mono', monospace;
    font-size: 12px; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .f1-search::placeholder { color: #2a3f52; }
  .f1-search:focus { border-color: #e8001d; box-shadow: 0 0 0 2px rgba(232,0,29,0.12); }

  .f1-pills { display: flex; gap: 5px; flex-wrap: wrap; }
  .f1-pill {
    padding: 6px 14px; border-radius: 5px;
    background: transparent; border: 1px solid #1a2332;
    color: #3d5a6e; font-family: 'Share Tech Mono', monospace;
    font-size: 10px; text-transform: uppercase;
    letter-spacing: 1.2px; cursor: pointer;
    transition: all 0.18s ease;
  }
  .f1-pill:hover { border-color: #3a5068; color: #8aacbe; background: rgba(58,80,104,0.08); }
  .f1-pill.active { background: rgba(232,0,29,0.1); border-color: rgba(232,0,29,0.4); color: #e8001d; }
  .f1-pill.active:hover { background: rgba(232,0,29,0.16); border-color: rgba(232,0,29,0.55); }
  .f1-count { font-size: 10px; color: #2a3f52; margin-left: auto; letter-spacing: 0.4px; }

  .f1-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 10px;
    align-content: start;
  }

  .track-card {
    background: linear-gradient(155deg, #0e1522 0%, #0b1018 100%);
    border: 1px solid #162232;
    border-radius: 10px;
    padding: 14px 15px 15px;
    cursor: pointer;
    text-align: left;
    position: relative;
    overflow: hidden;
    transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
    animation: card-in 0.4s cubic-bezier(.4,0,.2,1) both;
  }
  .track-card::after {
    content: '';
    position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent 10%, #e8001d 50%, transparent 90%);
    opacity: 0; transition: opacity 0.25s;
  }
  .track-card:hover {
    border-color: #243848;
    box-shadow: 0 6px 28px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.2);
    transform: translateY(-2px);
  }
  .track-card:hover::after { opacity: 0.7; }
  .track-card.open {
    grid-column: span 2;
    border-color: #e8001d;
    background: linear-gradient(155deg, #12101a 0%, #0b1018 100%);
    box-shadow:
      0 0 0 1px rgba(232,0,29,0.4),
      0 8px 36px rgba(232,0,29,0.15),
      0 4px 12px rgba(0,0,0,0.3);
    transform: none;
    cursor: default;
  }
  .track-card.open::after { opacity: 1; background: #e8001d; }
  .track-card.open:hover {
    transform: none;
    box-shadow:
      0 0 0 1px rgba(232,0,29,0.4),
      0 8px 36px rgba(232,0,29,0.15),
      0 4px 12px rgba(0,0,0,0.3);
  }

  .card-index {
    position: absolute; top: 4px; right: 8px;
    font-family: 'Orbitron', sans-serif;
    font-size: 36px; font-weight: 900;
    color: rgba(255,255,255,0.04);
    line-height: 1; pointer-events: none; user-select: none;
  }
  .card-top {
    display: flex; align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 3px; position: relative;
  }
  .card-name {
    font-family: 'Orbitron', sans-serif;
    font-size: 12.5px; font-weight: 600;
    color: #dde4eb; letter-spacing: 0.3px;
  }
  .card-continent { font-size: 11px; opacity: 0.5; flex-shrink: 0; }
  .card-cmd {
    font-size: 10px; color: #2e4455;
    letter-spacing: 0.6px; margin-bottom: 10px;
    transition: color 0.2s;
  }
  .track-card.open .card-cmd { color: rgba(232,0,29,0.6); }

  .card-arrow-btn {
    position: absolute; top: 12px; right: 12px;
    width: 28px; height: 28px; border-radius: 7px;
    background: rgba(255,255,255,0.03);
    border: 1px solid #1e2d3d;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; z-index: 2;
    transition: background 0.2s, border-color 0.2s, transform 0.2s;
  }
  .card-arrow-btn:hover {
    background: rgba(232,0,29,0.1);
    border-color: rgba(232,0,29,0.4);
  }
  .card-arrow-btn svg {
    width: 13px; height: 13px;
    stroke: #3d5a6e; fill: none;
    stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round;
    transition: stroke 0.2s, transform 0.35s cubic-bezier(.4,0,.2,1);
  }
  .card-arrow-btn:hover svg { stroke: #e8001d; }
  .track-card.open .card-arrow-btn svg { transform: rotate(180deg); stroke: #e8001d; }
  .track-card.open .card-arrow-btn { border-color: rgba(232,0,29,0.4); background: rgba(232,0,29,0.08); }

  .aero-row { display: flex; align-items: center; gap: 7px; margin-bottom: 4px; }
  .aero-row:last-child { margin-bottom: 0; }
  .aero-label {
    font-size: 8.5px; color: #2e4455;
    text-transform: uppercase; letter-spacing: 1px;
    width: 34px; flex-shrink: 0;
  }
  .aero-track { flex: 1; height: 4px; background: #0d1520; border-radius: 2px; overflow: hidden; }
  .aero-fill { height: 100%; border-radius: 2px; transition: width 0.45s cubic-bezier(.4,0,.2,1); }
  .aero-val { font-size: 10.5px; color: #5a7a8f; width: 20px; text-align: right; flex-shrink: 0; }

  .setup-body {
    overflow: hidden;
    max-height: 0; opacity: 0;
    transition: max-height 0.42s cubic-bezier(.4,0,.2,1), opacity 0.3s 0.05s ease;
  }
  .track-card.open .setup-body {
    max-height: 500px; opacity: 1;
    transition: max-height 0.42s cubic-bezier(.4,0,.2,1), opacity 0.28s ease;
  }
  .setup-divider { height: 1px; background: #1a2332; margin: 12px 0 14px; }
  .setup-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 18px; }
  .setup-item { display: flex; flex-direction: column; gap: 3px; }
  .setup-item-label {
    font-size: 8px; color: #2e4455;
    text-transform: uppercase; letter-spacing: 1.4px;
  }
  .setup-item-value {
    font-size: 11.5px; color: #dde4eb; letter-spacing: 0.2px;
    animation: value-pop 0.5s ease forwards;
  }
  .setup-item.sosp-full { grid-column: 1 / -1; }
  .sosp-row { display: flex; gap: 6px; flex-wrap: wrap; }
  .sosp-val {
    flex: 1 1 auto; min-width: 36px; text-align: center;
    padding: 5px 8px;
    background: #0b1420; border: 1px solid #152230; border-radius: 6px;
    font-size: 11.5px; color: #dde4eb; letter-spacing: 0.3px;
    animation: value-pop 0.5s ease forwards;
  }
  .setup-aero-row { display: flex; align-items: center; gap: 8px; margin-bottom: 5px; }
  .setup-aero-row:last-child { margin-bottom: 0; }
  .setup-aero-label {
    font-size: 8.5px; color: #2e4455;
    text-transform: uppercase; letter-spacing: 1px;
    width: 38px; flex-shrink: 0;
  }
  .setup-aero-track { flex: 1; height: 5px; background: #0d1520; border-radius: 3px; overflow: hidden; }
  .setup-aero-fill { height: 100%; border-radius: 3px; transition: width 0.5s cubic-bezier(.4,0,.2,1); }
  .setup-aero-val { font-size: 11px; color: #5a7a8f; width: 22px; text-align: right; flex-shrink: 0; }

  .setup-copy-btn {
    margin-top: 16px; width: 100%; padding: 10px 0;
    border: none; border-radius: 7px; cursor: pointer;
    font-family: 'Orbitron', sans-serif;
    font-size: 9px; font-weight: 600;
    letter-spacing: 2px; text-transform: uppercase;
    color: #fff;
    background: linear-gradient(135deg, #c40018, #e8001d);
    box-shadow: 0 4px 16px rgba(232,0,29,0.28);
    transition: filter 0.2s, box-shadow 0.2s, background 0.25s, transform 0.1s;
  }
  .setup-copy-btn:hover { filter: brightness(1.1); box-shadow: 0 6px 22px rgba(232,0,29,0.38); transform: translateY(-1px); }
  .setup-copy-btn:active { transform: translateY(0); }
  .setup-copy-btn.copied {
    background: linear-gradient(135deg, #15803d, #22c55e);
    box-shadow: 0 4px 16px rgba(34,197,94,0.28);
  }

  .no-results { grid-column: 1 / -1; text-align: center; padding: 56px 20px; }
  .no-results-icon { font-size: 26px; opacity: 0.15; margin-bottom: 12px; }
  .no-results-text { font-size: 11.5px; color: #2a3f52; letter-spacing: 0.3px; }

  /* ── Responsive ──────────────────────────────────────────────── */
  @media (max-width: 600px) {
    .f1-header-top { padding: 16px 16px 0; }
    .f1-nav { padding: 10px 16px 0; overflow-x: auto; }
    .f1-nav-btn { padding: 7px 12px; font-size: 9.5px; white-space: nowrap; }
    .f1-page { padding: 18px 16px 36px; }
    .track-card.open { grid-column: 1 / -1; }
    .setup-grid { grid-template-columns: 1fr; }
    .cal-grid { grid-template-columns: 1fr; }
    .drv-grid { grid-template-columns: 1fr 1fr; }
    .lb-table th, .lb-table td { padding: 8px 8px; font-size: 10.5px; }
    .lb-driver-name { font-size: 10px; }
  }
`;

// ─── COMPONENTS ───────────────────────────────────────────────────

// Setup sub-components
function AeroBar({ value, label, max = 50 }) {
  const pct = (value / max) * 100;
  const hue = 120 - (pct / 100) * 110;
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
function SetupAeroBar({ value, label, max = 50 }) {
  const pct = (value / max) * 100;
  const hue = 120 - (pct / 100) * 110;
  const color = `hsl(${hue}, 75%, 42%)`;
  return (
    <div className="setup-aero-row">
      <span className="setup-aero-label">{label}</span>
      <div className="setup-aero-track">
        <div className="setup-aero-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="setup-aero-val">{value}</span>
    </div>
  );
}
const ChevronDown = () => (
  <svg viewBox="0 0 24 24">
    <polyline points="6,9 12,15 18,9" />
  </svg>
);

function TrackCard({ id, track, isOpen, onToggle, onCopy, copied, index }) {
  return (
    <button
      className={`track-card${isOpen ? " open" : ""}`}
      style={{ animationDelay: `${index * 0.035}s` }}
      onClick={() => !isOpen && onToggle()}
    >
      <span className="card-index">{String(index + 1).padStart(2, "0")}</span>
      <div className="card-top">
        <div>
          <div className="card-name">{track.nome}</div>
          <div className="card-cmd">.{id}</div>
        </div>
        <span className="card-continent" style={{ marginRight: isOpen ? 32 : 0 }}>
          {CONTINENT_EMOJI[track.continente]}
        </span>
      </div>
      <button className="card-arrow-btn" onClick={(e) => { e.stopPropagation(); onToggle(); }}>
        <ChevronDown />
      </button>
      <AeroBar value={track.aero[0]} label="Front" />
      <AeroBar value={track.aero[1]} label="Rear" />
      <div className="setup-body">
        <div className="setup-divider" />
        <div className="setup-item" style={{ marginBottom: 14 }}>
          <span className="setup-item-label">Aerodinamica</span>
          <SetupAeroBar value={track.aero[0]} label="Front" />
          <SetupAeroBar value={track.aero[1]} label="Rear" />
        </div>
        <div className="setup-grid">
          <div className="setup-item">
            <span className="setup-item-label">Trasmissione</span>
            <span className="setup-item-value">{SHARED.trasmissione}</span>
          </div>
          <div className="setup-item">
            <span className="setup-item-label">Freni</span>
            <span className="setup-item-value">{SHARED.freni}</span>
          </div>
          <div className="setup-item">
            <span className="setup-item-label">Geometria</span>
            <span className="setup-item-value">{SHARED.geometria}</span>
          </div>
          <div className="setup-item">
            <span className="setup-item-label">Gomme</span>
            <span className="setup-item-value">{SHARED.gomme}</span>
          </div>
          <div className="setup-item sosp-full">
            <span className="setup-item-label">Sospensioni</span>
            <div className="sosp-row">
              {track.sosp.map((v, i) => (
                <div className="sosp-val" key={i} style={{ animationDelay: `${i * 0.06}s` }}>{v}</div>
              ))}
            </div>
          </div>
        </div>
        <button
          className={`setup-copy-btn${copied ? " copied" : ""}`}
          onClick={(e) => { e.stopPropagation(); onCopy(); }}
        >
          {copied ? "✓ Copiato" : "⎘ Copia Discord"}
        </button>
      </div>
    </button>
  );
}

// ─── LEADERBOARD PAGE ─────────────────────────────────────────────
function LeaderboardPage() {
  const [tab, setTab] = useState("drivers");
  const [expandedDriver, setExpandedDriver] = useState(null);

  function getDriverRaces(driverName) {
    return RACE_RESULTS.map(({ race, results }) => {
      const pos = results.indexOf(driverName);
      return { race, pos: pos >= 0 ? pos + 1 : null, pts: pos >= 0 ? POINTS_TABLE[pos] : 0 };
    }).filter(r => r.pos !== null);
  }

  return (
    <div className="f1-page">
      <div className="page-header">
        <h2>Classifica Generale</h2>
        <p>Stagione 2024 · ordinata per punti</p>
      </div>
      <div className="lb-tabs">
        <button className={`lb-tab${tab === "drivers" ? " active" : ""}`} onClick={() => setTab("drivers")}>Piloti</button>
        <button className={`lb-tab${tab === "teams" ? " active" : ""}`} onClick={() => setTab("teams")}>Costruttori</button>
      </div>

      {tab === "drivers" && (
        <table className="lb-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}>#</th>
              <th>Pilota</th>
              <th style={{ textAlign: "center" }}>Vittorie</th>
              <th style={{ textAlign: "center" }}>Podi</th>
              <th style={{ textAlign: "right" }}>Punti</th>
            </tr>
          </thead>
          <tbody>
            {DRIVER_STANDINGS.map((d, i) => {
              const isExp = expandedDriver === d.name;
              const races = isExp ? getDriverRaces(d.name) : [];
              return (
                <tr key={d.name}>
                  <td>
                    <div className={`lb-pos${i === 0 ? " p1" : i === 1 ? " p2" : i === 2 ? " p3" : ""}`}>
                      {i + 1}
                    </div>
                  </td>
                  <td>
                    <div className="lb-driver-cell">
                      <div className="lb-team-dot" style={{ background: TEAM_COLORS[d.team] || "#555" }} />
                      <div>
                        <div className="lb-driver-name">{d.flag} {d.name}</div>
                        <div className="lb-driver-sub">{d.team} · #{d.num}</div>
                        <button className="lb-race-toggle" onClick={() => setExpandedDriver(isExp ? null : d.name)}>
                          {isExp ? "▲ chiudi risultati" : "▼ risultati gara"}
                        </button>
                        <div className={`lb-race-list${isExp ? " open" : ""}`}>
                          {races.map((r) => (
                            <div className="lb-race-item" key={r.race}>
                              <span className="lb-race-item-name">{r.race}</span>
                              <span className="lb-race-item-pos">P{r.pos} · {r.pts} pts</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="lb-stat">{d.wins}</td>
                  <td className="lb-stat">{d.podiums}</td>
                  <td><div className="lb-pts">{d.points}</div></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {tab === "teams" && (
        <table className="lb-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}>#</th>
              <th>Costruttore</th>
              <th style={{ textAlign: "center" }}>Vittorie</th>
              <th style={{ textAlign: "right" }}>Punti</th>
            </tr>
          </thead>
          <tbody>
            {TEAM_STANDINGS.map((t, i) => (
              <tr key={t.team}>
                <td>
                  <div className={`lb-pos${i === 0 ? " p1" : i === 1 ? " p2" : i === 2 ? " p3" : ""}`}>
                    {i + 1}
                  </div>
                </td>
                <td>
                  <div className="lb-driver-cell">
                    <div className="lb-team-dot" style={{ background: TEAM_COLORS[t.team] || "#555", width: 12, height: 12 }} />
                    <div>
                      <div className="lb-driver-name">{t.team}</div>
                    </div>
                  </div>
                </td>
                <td className="lb-stat">{t.wins}</td>
                <td><div className="lb-pts">{t.points}</div></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ─── CALENDAR PAGE ────────────────────────────────────────────────
function CalendarPage() {
  return (
    <div className="f1-page">
      <div className="page-header">
        <h2>Calendario 2024</h2>
        <p>{CALENDAR.length} gare · stagione completata</p>
      </div>
      <div className="cal-grid">
        {CALENDAR.map((race, i) => (
          <div
            key={race.round}
            className={`cal-card ${race.status}`}
            style={{ animationDelay: `${i * 0.04}s` }}
          >
            <div className="cal-card-header">
              <span className="cal-round">Round {race.round}</span>
              <span className={`cal-status ${race.status}`}>
                {race.status === "done" ? "Completata" : "In arrivo"}
              </span>
            </div>
            <div className="cal-race-name">{race.race}</div>
            <div className="cal-city">{race.city} · {race.date}</div>
            {race.winner && (
              <div className="cal-winner">
                <span className="cal-winner-flag">🏆</span>
                <span>{race.winner}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── DRIVERS PAGE ─────────────────────────────────────────────────
function DriversPage() {
  const drivers = useMemo(() => {
    return DRIVER_STANDINGS.map((d) => ({
      ...d,
      poles: DRIVER_POLES[d.name] || 0,
    }));
  }, []);

  return (
    <div className="f1-page">
      <div className="page-header">
        <h2>Piloti</h2>
        <p>Statistiche complete · stagione 2024</p>
      </div>
      <div className="drv-grid">
        {drivers.map((d, i) => (
          <div className="drv-card" key={d.name} style={{ animationDelay: `${i * 0.045}s` }}>
            <div className="drv-card-num">{d.num}</div>
            <div className="drv-top">
              <span className="drv-flag">{d.flag}</span>
              <div>
                <div className="drv-name">{d.name}</div>
                <div className="drv-team">
                  <span className="drv-team-dot" style={{ background: TEAM_COLORS[d.team] || "#555" }} />
                  {d.team}
                </div>
              </div>
            </div>
            <div className="drv-stats">
              <div className="drv-stat-box">
                <div className="drv-stat-label">Punti</div>
                <div className="drv-stat-val pts">{d.points}</div>
              </div>
              <div className="drv-stat-box">
                <div className="drv-stat-label">Vittorie</div>
                <div className="drv-stat-val wins">{d.wins}</div>
              </div>
              <div className="drv-stat-box">
                <div className="drv-stat-label">Podi</div>
                <div className="drv-stat-val pods">{d.podiums}</div>
              </div>
              <div className="drv-stat-box">
                <div className="drv-stat-label">Pole</div>
                <div className="drv-stat-val poles">{d.poles}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SETUP PAGE ───────────────────────────────────────────────────
function SetupPage() {
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState("Tutti");
  const [openCard, setOpenCard] = useState(null);
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

  const handleToggle = (key) => {
    setOpenCard((prev) => (prev === key ? null : key));
    setCopied(false);
  };

  const handleCopy = () => {
    if (!openCard) return;
    navigator.clipboard
      .writeText(buildDiscordMessage(openCard, TRACKS[openCard]))
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      });
  };

  return (
    <div className="f1-page">
      <div className="page-header">
        <h2>Setup Dashboard</h2>
        <p>{Object.keys(TRACKS).length} circuiti · simulatore</p>
      </div>
      <div className="f1-toolbar">
        <div className="f1-search-wrap">
          <span className="f1-search-icon">⌕</span>
          <input
            className="f1-search" type="text"
            placeholder="Cerca pista o comando..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="f1-pills">
          {CONTINENTI.map((c) => (
            <button key={c} className={`f1-pill${filter === c ? " active" : ""}`} onClick={() => setFilter(c)}>{c}</button>
          ))}
        </div>
        <span className="f1-count">{filtered.length} risultati</span>
      </div>
      <div className="f1-grid">
        {filtered.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <div className="no-results-text">Nessuna pista trovata</div>
          </div>
        ) : (
          filtered.map(([key, track], i) => (
            <TrackCard
              key={key} id={key} track={track}
              isOpen={openCard === key} index={i}
              onToggle={() => handleToggle(key)}
              onCopy={handleCopy}
              copied={copied && openCard === key}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────
export default function App() {
  useFonts();
  const [page, setPage] = useState("leaderboard");

  return (
    <>
      <style>{css}</style>
      <div className="f1-root">
        <div className="f1-grid-bg" />
        <div className="f1-vignette" />

        <header className="f1-header">
          <div className="f1-header-top">
            <div>
              <div className="f1-status">
                <div className="f1-status-dot" />
                <span className="f1-status-label">F1 Setup System · Online</span>
              </div>
              <div className="f1-title-row">
                <h1 className="f1-title">F1 Dashboard</h1>
                <span className="f1-subtitle">2024 Season</span>
              </div>
            </div>
          </div>
          <nav className="f1-nav">
            {NAV.map((n) => (
              <button
                key={n.id}
                className={`f1-nav-btn${page === n.id ? " active" : ""}`}
                onClick={() => setPage(n.id)}
              >
                <span className="nav-icon">{n.icon}</span>
                {n.label}
              </button>
            ))}
          </nav>
        </header>

        {page === "leaderboard" && <LeaderboardPage />}
        {page === "calendar"    && <CalendarPage />}
        {page === "drivers"     && <DriversPage />}
        {page === "setup"       && <SetupPage />}
      </div>
    </>
  );
}