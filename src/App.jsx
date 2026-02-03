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
  australia:   { nome: "Melbourne",   aero: [23, 10], trasmissione: 41, sosp: [41, 1, 12, 17, 20, 44], continente: "Oceania" },
  cina:        { nome: "Shanghai",    aero: [24, 21], trasmissione: 41, sosp: [41, 1,  4,  8, 21, 48], continente: "Asia"    },
  suzuka:      { nome: "Suzuka",      aero: [31, 21], trasmissione: 41, sosp: [41, 1,  6, 21, 22, 42], continente: "Asia"    },
  bahrain:     { nome: "Sakhir",      aero: [34, 29], trasmissione: 41, sosp: [41, 10, 9, 10, 20, 40], continente: "Asia"    },
  jeddah:      { nome: "Jeddah",      aero: [15,  1], trasmissione: 41, sosp: [41, 6,  1,  7, 18, 40], continente: "Asia"    },
  miami:       { nome: "Miami",       aero: [12,  4], trasmissione: 30, sosp: [30, 1,  1, 17, 22, 40], continente: "America" },
  imola:       { nome: "Imola",       aero: [43, 37], trasmissione: 41, sosp: [41, 1,  9, 21, 23, 52], continente: "Europa"  },
  monaco:      { nome: "Monaco",      aero: [50, 50], trasmissione: 41, sosp: [41, 22, 3, 21, 19, 49], continente: "Europa"  },
  spagna:      { nome: "Barcellona",  aero: [41, 32], trasmissione: 38, sosp: [38, 2,  6, 21, 20, 43], continente: "Europa"  },
  canada:      { nome: "Montreal",    aero: [35, 28], trasmissione: 41, sosp: [41, 1,  1, 18, 19, 40], continente: "America" },
  austria:     { nome: "Spielberg",   aero: [37, 30], trasmissione: 41, sosp: [41, 5,  3, 20, 20, 46], continente: "Europa"  },
  silverstone: { nome: "Silverstone", aero: [12,  0], trasmissione: 41, sosp: [41, 1,  5, 18, 21, 40], continente: "Europa"  },
  spa:         { nome: "Spa",         aero: [8,   8], trasmissione: 41, sosp: [41, 1,  6, 12, 20, 40], continente: "Europa"  },
  ungheria:    { nome: "Budapest",    aero: [50, 50], trasmissione: 41, sosp: [41, 1, 10, 21, 19, 40], continente: "Europa"  },
  olanda:      { nome: "Zandvoort",   aero: [50, 48], trasmissione: 41, sosp: [41, 1,  9, 21, 22, 40], continente: "Europa"  },
  monza:       { nome: "Monza",       aero: [0,   3], trasmissione: 41, sosp: [41, 1,  1, 21, 21, 40], continente: "Europa"  },
  baku:        { nome: "Baku",        aero: [4,   1], trasmissione: 41, sosp: [41, 1,  1, 19, 21, 40], continente: "Asia"    },
  singapore:   { nome: "Singapore",   aero: [50, 47], trasmissione: 41, sosp: [41, 1, 16, 21, 20, 40], continente: "Asia"    },
  austin:      { nome: "Austin",      aero: [41, 34], trasmissione: 41, sosp: [41, 3,  1, 21, 20, 40], continente: "America" },
  messico:     { nome: "Mexico City", aero: [40, 36], trasmissione: 32, sosp: [32, 3,  5, 21, 23, 45], continente: "America" },
  brasile:     { nome: "Sao Paolo",   aero: [27, 14], trasmissione: 41, sosp: [41, 5,  2, 21, 22, 41], continente: "America" },
  lasvegas:    { nome: "Las Vegas",   aero: [1,   0], trasmissione: 41, sosp: [41, 6,  5, 21, 23, 48], continente: "America" },
  qatar:       { nome: "Lusail",      aero: [42, 30], trasmissione: 41, sosp: [41, 3,  1, 16, 19, 45], continente: "Asia"    },
  abudhabi:    { nome: "Yas Marina",  aero: [29, 18], trasmissione: 41, sosp: [41, 1,  1, 17, 17, 40], continente: "Asia"    },
};
const SHARED = {
  trasmissione: "100 - 20",
  geometria:    "-3,50° · -2,00° · 0,00° · 0,10°",
  freni:        "55% - 100%",
  gomme:        "29,5 - 29,5 - 26,5 - 26,5",
};
const CONTINENTI = ["Tutti", "Europa", "Asia", "America", "Oceania"];
const CONTINENT_EMOJI = { Europa: "🇪🇺", Asia: "🌏", America: "🌎", Oceania: "🌏" };

// ─── LEADERBOARD DATA PER STAGIONE ──────────────────────────────────
const SEASON_DATA = {
  "Stagione 1": {
    races: [
      { race: "Australia",  results: ["Alex","Igor","Hamilton","Norris","Russell","Verstappen","Tsunoda","Antonelli","Alonso","Leclerc","Bortoleto","Albon","Hulkenberg","Gasly","Sainz","Bearman","Lawson","Piastri","Manuel","Stroll"] },
      { race: "Olanda",     results: ["Igor","Verstappen","Norris","Piastri","Hamilton","Russell","Leclerc","Antonelli","Lawson","Stroll","Bearman","Alonso","Gasly","Tsunoda","Manuel","Alex","Hulkenberg","Bortoleto","Sainz","Albon"] },
      { race: "Messico",    results: ["Alex","Verstappen","Antonelli","Norris","Alonso","Russell","Igor","Bortoleto","Hamilton","Gasly","Tsunoda","Leclerc","Bearman","Albon","Stroll","Hulkenberg","Lawson","Sainz","Piastri","Manuel"] },
      { race: "Brasile",    results: ["Alex","Manuel","Norris","Alonso","Leclerc","Piastri","Verstappen","Antonelli","Russell","Hamilton","Gasly","Hulkenberg","Bearman","Albon","Lawson","Bortoleto","Lawson","Sainz","Igor","Stroll" ] },
      { race: "Qatar",      results: ["Norris","Piastri","Bortoleto","Albon","Sainz","Hamilton","Alonso","Antonelli","Manuel","Leclerc","Hulkenberg","Lawson","Gasly","Russell","Igor","Tsunoda","Verstappen","Stroll","Bearman","Alex"] },
      { race: "Singapore",  results: ["Antonelli","Verstappen","Hamilton","Piastri","Leclerc","Alonso","Bortoleto","Igor","Sainz","Stroll","Tsunoda","Russell","Norris","Alex","Lawson","Bearman","Albon","Hulkenberg","Manuel","Gasly"] },
      { race: "Monaco",     results: ["Sainz","Norris","Bortoleto","Tsunoda","Leclerc","Piastri","Albon","Hulkenberg","Manuel","Igor","Gasly","Hamilton","Verstappen","Alex","Lawson","Stroll","Russell","Antonelli","Alonso","Bearman"] },
    ],
    calendar: [
      { round: 1, race: "Australian GP", city: "Melbourne", status: "done", winner: "Alex", raceKey: "Australia" },
      { round: 2, race: "Dutch GP", city: "Zandvoort", status: "done", winner: "Igor", raceKey: "Olanda" },
      { round: 3, race: "Mexico City GP", city: "Mexico City", status: "done", winner: "Alex", raceKey: "Messico" },
      { round: 4, race: "São Paulo GP", city: "São Paulo", status: "done", winner: "Alex", raceKey: "Brasile" },
      { round: 5, race: "Qatar GP", city: "Lusail", status: "done", winner: "Norris", raceKey: "Qatar" },
      { round: 6, race: "Singapore GP", city: "Singapore", status: "done", winner: "Antonelli", raceKey: "Singapore" },
      { round: 7, race: "Monaco GP", city: "Monaco", status: "done", winner: "Sainz", raceKey: "Monaco" },
    ],
    driverPoles: {
      Alex: 3, Igor: 3, Norris: 1, Verstappen: 0, Hamilton: 0, Russell: 0,
      Piastri: 0, Antonelli: 0, Leclerc: 0, Alonso: 0, Albon: 0, Sainz: 0,
      Stroll: 0, Lawson: 0, Tsunoda: 0, Bearman: 0, Manuel: 0, Gasly: 0,
      Hulkenberg: 0, Bortoleto: 0
    }
  },
  "Stagione 2": {
    races: [
      { race: "Austria",   results: []},
      { race: "Ungheria",  results: []},
      { race: "Australia", results: []},
      { race: "Abu Dhabi", results: []},
      { race: "Olanda",    results: []},
      { race: "Jeddah",    results: []},
      { race: "Qatar",     results: []},
    ],
    calendar: [
      { round: 1, race: "Austrian GP",      city: "Red Bull Ring", status: "upcoming", winner: "...", raceKey: null },
      { round: 2, race: "Hungary GP",       city: "Hungaroring",   status: "upcoming", winner: "...", raceKey: null },
      { round: 3, race: "Australian GP",    city: "Melbourne",     status: "upcoming", winner: "...", raceKey: null },
      { round: 4, race: "Abu Dhabi GP",     city: "Yas Marina",    status: "upcoming", winner: "...", raceKey: null },
      { round: 5, race: "Dutch GP",         city: "Zandvoort",     status: "upcoming", winner: "...", raceKey: null },
      { round: 6, race: "Saudi Arabian GP", city: "Jeddah",        status: "upcoming", winner: "...", raceKey: null },
      { round: 7, race: "Qatar GP",         city: "Lusail",        status: "upcoming", winner: "...", raceKey: null },
    ],
    driverPoles: {
      Alex: 0, Igor: 0, Norris: 0, Verstappen: 0, Hamilton: 0, Russell: 0,
      Ocon: 0, Antonelli: 0, Leclerc: 0, Alonso: 0, Albon: 0, Sainz: 0,
      Colapinto: 0, Lawson: 0, Hadjar: 0, Bearman: 0, Manuel: 0, Gasly: 0,
      Hulkenberg: 0, Bortoleto: 0
    }
  },
  "Stagione 3": {
    races: [],
    calendar: [
      { round: 1, race: "Saudi Arabian GP", city: "Jeddah", status: "upcoming", winner: "...", raceKey: null },
      { round: 2, race: "Saudi Arabian GP", city: "Jeddah", status: "upcoming", winner: "...", raceKey: null },
      { round: 3, race: "Saudi Arabian GP", city: "Jeddah", status: "upcoming", winner: "...", raceKey: null },
      { round: 4, race: "Saudi Arabian GP", city: "Jeddah", status: "upcoming", winner: "...", raceKey: null },
      { round: 5, race: "Saudi Arabian GP", city: "Jeddah", status: "upcoming", winner: "...", raceKey: null },
      { round: 6, race: "Saudi Arabian GP", city: "Jeddah", status: "upcoming", winner: "...", raceKey: null },
      { round: 7, race: "Saudi Arabian GP", city: "Jeddah", status: "upcoming", winner: "...", raceKey: null },
    ],
    driverPoles: {
      Alex: 0, Igor: 0, Norris: 0, Verstappen: 0, Hamilton: 0, Russell: 0,
      Piastri: 0, Antonelli: 0, Leclerc: 0, Alonso: 0, Albon: 0, Sainz: 0,
      Stroll: 0, Lawson: 0, Tsunoda: 0, Bearman: 0, Manuel: 0, Gasly: 0,
      Hulkenberg: 0, Bortoleto: 0
    }
  }
};

const POINTS_TABLE = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

// ─── DRIVER TEAMS BASE (Stagione 1) ────────────────────────────────
const DRIVER_TEAMS_BASE = {
  Piastri:    { team: "McLaren", num: 81, flag: "🇦🇺" },
  Norris:     { team: "McLaren", num: 4, flag: "🇬🇧" },
  Verstappen: { team: "Red Bull", num: 1, flag: "🇳🇱" },
  Tsunoda:    { team: "Red Bull", num: 22, flag: "🇯🇵" },
  Russell:    { team: "Mercedes", num: 63, flag: "🇬🇧" },
  Antonelli:  { team: "Mercedes", num: 12, flag: "🇮🇹" },
  Leclerc:    { team: "Ferrari", num: 16, flag: "🇲🇨" },
  Hamilton:   { team: "Ferrari", num: 44, flag: "🇬🇧" },
  Albon:      { team: "Williams", num: 23, flag: "🇹🇭" },
  Sainz:      { team: "Williams", num: 55, flag: "🇪🇸" },
  Alonso:     { team: "Aston Martin", num: 14, flag: "🇪🇸" },
  Stroll:     { team: "Aston Martin", num: 18, flag: "🇨🇦" },
  Lawson:     { team: "Visa Cash App RB", num: 40, flag: "🇳🇿" },
  Igor:       { team: "Visa Cash App RB", num: 92, flag: "🇮🇹" },
  Bearman:    { team: "Haas", num: 87, flag: "🇬🇧" },
  Manuel:     { team: "Haas", num: 95, flag: "🇮🇹" },
  Gasly:      { team: "Alpine", num: 10, flag: "🇫🇷" },
  Alex:       { team: "Alpine", num: 99, flag: "🇮🇹" },
  Hulkenberg: { team: "Sauber", num: 27, flag: "🇩🇪" },
  Bortoleto:  { team: "Sauber", num: 5, flag: "🇧🇷" },
  Ocon:       { team: "No Seat", num: 31, flag: "🇫🇷" },
  Colapinto:  { team: "No Seat", num: 43, flag: "🇦🇷" },
  Hadjar:     { team: "No Seat", num: 6, flag: "🇫🇷" },
};

// ─── TEAM CHANGES PER STAGIONE ─────────────────────────────────────
const TEAM_CHANGES = {
  "Stagione 2": {
    Alex: { team: "McLaren", num: 99 },
    Igor: { team: "Red Bull", num: 92 },
    Piastri: { team: "No Seat", num: 81 },
    Manuel: { team: "Aston Martin", num: 95 },
    Stroll: { team: "No Seat", num: 18 },
    Tsunoda: { team: "No Seat", num: 22 },
    Ocon: { team: "Haas", num: 31},
    Colapinto: { team: "Alpine", num:  43},
    Hadjar: { team: "Visa Cash Up RB", num: 6},
    Norris: { num: 1 },
    Verstappen: { num: 3 },
  },
  "Stagione 3": {
  }
};

// Funzione per ottenere i team dei piloti per una specifica stagione
function getDriverTeamsForSeason(season) {
  const changes = TEAM_CHANGES[season] || {};
  return Object.keys(DRIVER_TEAMS_BASE).reduce((acc, driver) => {
    acc[driver] = {
      ...DRIVER_TEAMS_BASE[driver],
      ...(changes[driver] || {})
    };
    return acc;
  }, {});
}

const TEAM_COLORS = {
  "McLaren": "#FF8000",
  "Red Bull": "#3070ca",
  "Mercedes": "#a1a1a1",
  "Ferrari": "#f10030",
  "Williams": "#171bff",
  "Aston Martin": "#228b6f",
  "Visa Cash App RB": "#4460ff",
  "Haas": "#999999",
  "Alpine": "#3de2ff",
  "Sauber": "#31ff31",
};

function computeDriverStandings(raceResults, season) {
  const DRIVER_TEAMS = getDriverTeamsForSeason(season);
  const pts = {};
  const wins = {};
  const podiums = {};
  
  raceResults.forEach(({ results }) => {
    results.forEach((d, i) => {
      if (i >= POINTS_TABLE.length) return;
      pts[d] = (pts[d] || 0) + POINTS_TABLE[i];
      if (i === 0) wins[d] = (wins[d] || 0) + 1;
      if (i < 3) podiums[d] = (podiums[d] || 0) + 1;
    });
  });
  
  return Object.keys(DRIVER_TEAMS)
    .map((name) => ({
      name,
      points: pts[name] || 0,
      wins: wins[name] || 0,
      podiums: podiums[name] || 0,
      wdc: 0,
      ...DRIVER_TEAMS[name],
    }))
    .sort((a, b) => b.points - a.points || b.wins - a.wins);
}

function computeTeamStandings(raceResults, season) {
  const DRIVER_TEAMS = getDriverTeamsForSeason(season);
  
  // Inizializza tutti i team con 0 punti
  const teams = {};
  Object.values(DRIVER_TEAMS).forEach(driver => {
    if (!teams[driver.team]) {
      teams[driver.team] = { points: 0, wins: 0, poles: 0, wcc: 0 };
    }
  });
  
  // Aggiungi i punti dalle gare
  raceResults.forEach(({ results }) => {
    results.forEach((d, i) => {
      if (i >= POINTS_TABLE.length) return;
      const info = DRIVER_TEAMS[d];
      if (!info) return;
      teams[info.team].points += POINTS_TABLE[i];
      if (i === 0) teams[info.team].wins += 1;
    });
  });
  
  return Object.entries(teams)
    .map(([team, data]) => ({ team, ...data }))
    .sort((a, b) => b.points - a.points);
}

const SEASONS = ["Stagione 1", "Stagione 2", "Stagione 3"];

// ─── CAREER STATS ──────────────────
const CAREER_STATS = {
  Piastri:    { totalPoints: 58, totalWins: 0, totalPoles: 0, totalPodiums: 1, championships: 0 },
  Norris:     { totalPoints: 97, totalWins: 1, totalPoles: 1, totalPodiums: 4, championships: 1 },
  Verstappen: { totalPoints: 68, totalWins: 0, totalPoles: 0, totalPodiums: 3, championships: 0 },
  Tsunoda:    { totalPoints: 16, totalWins: 0, totalPoles: 0, totalPodiums: 0, championships: 0 },
  Russell:    { totalPoints: 28, totalWins: 0, totalPoles: 0, totalPodiums: 0, championships: 0 },
  Antonelli:  { totalPoints: 56, totalWins: 1, totalPoles: 0, totalPodiums: 2, championships: 0 },
  Leclerc:    { totalPoints: 38, totalWins: 0, totalPoles: 0, totalPodiums: 0, championships: 0 },
  Hamilton:   { totalPoints: 51, totalWins: 0, totalPoles: 0, totalPodiums: 2, championships: 0 },
  Albon:      { totalPoints: 18, totalWins: 0, totalPoles: 0, totalPodiums: 0, championships: 0 },
  Sainz:      { totalPoints: 37, totalWins: 1, totalPoles: 0, totalPodiums: 1, championships: 0 },
  Alonso:     { totalPoints: 38, totalWins: 0, totalPoles: 0, totalPodiums: 0, championships: 0 },
  Stroll:     { totalPoints: 2,  totalWins: 0, totalPoles: 0, totalPodiums: 0, championships: 0 },
  Lawson:     { totalPoints: 2,  totalWins: 0, totalPoles: 0, totalPodiums: 0, championships: 0 },
  Igor:       { totalPoints: 54, totalWins: 1, totalPoles: 3, interpole: 0, totalPodiums: 2, championships: 0 },
  Bearman:    { totalPoints: 0,  totalWins: 0, totalPoles: 0, totalPodiums: 0, championships: 0 },
  Manuel:     { totalPoints: 22, totalWins: 0, totalPoles: 0, interpole: 0, totalPodiums: 1, championships: 0 },
  Gasly:      { totalPoints: 1,  totalWins: 0, totalPoles: 0, totalPodiums: 0, championships: 0 },
  Alex:       { totalPoints: 75, totalWins: 3, totalPoles: 3, interpole: 0, totalPodiums: 3, championships: 0 },
  Hulkenberg: { totalPoints: 4,  totalWins: 0, totalPoles: 0, totalPodiums: 0, championships: 0 },
  Bortoleto:  { totalPoints: 40, totalWins: 0, totalPoles: 0, totalPodiums: 2, championships: 0 },
  Colapinto:  { totalPoints: 0,  totalWins: 0, totalPoles: 0, totalPodiums: 0, championships: 0 },
  Ocon:       { totalPoints: 0,  totalWins: 0, totalPoles: 0, totalPodiums: 0, championships: 0 },
  Hadjar:     { totalPoints: 0,  totalWins: 0, totalPoles: 0, totalPodiums: 0, championships: 0 },
};

const TEAM_CAREER_STATS = {
  "McLaren":          { totalPoints: 155, totalWins: 1, totalPoles: 1, championships: 1 },
  "Red Bull":         { totalPoints: 84,  totalWins: 0, totalPoles: 1, championships: 0 },
  "Mercedes":         { totalPoints: 84,  totalWins: 1, totalPoles: 0, championships: 0 },
  "Ferrari":          { totalPoints: 89,  totalWins: 0, totalPoles: 0, championships: 0 },
  "Williams":         { totalPoints: 55,  totalWins: 1, totalPoles: 0, championships: 0 },
  "Aston Martin":     { totalPoints: 40,  totalWins: 0, totalPoles: 0, championships: 0 },
  "Visa Cash App RB": { totalPoints: 56,  totalWins: 1, totalPoles: 3, championships: 0 },
  "Haas":             { totalPoints: 22,  totalWins: 0, totalPoles: 0, championships: 0 },
  "Alpine":           { totalPoints: 76,  totalWins: 3, totalPoles: 3, championships: 0 },
  "Sauber":           { totalPoints: 44,  totalWins: 0, totalPoles: 0, championships: 0 },
};

// ─── NAV ITEMS ────────────────────────────────────────────────────
const NAV = [
  { id: "leaderboard", label: "Leaderboard", icon: "🏆" },
  { id: "calendar",    label: "Calendario",  icon: "📅" },
  { id: "h2h",         label: "Head-to-Head", icon: "⚔️" },
  { id: "career",      label: "Carriera",    icon: "🏁" },
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
  @keyframes modalIn {
    from { opacity: 0; transform: scale(0.95); }
    to   { opacity: 1; transform: scale(1); }
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
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }
  .page-header-left h2 {
    font-family: 'Orbitron', sans-serif;
    font-size: 16px; font-weight: 600;
    color: #dde4eb; letter-spacing: 0.2px; margin-bottom: 4px;
  }
  .page-header-left p {
    font-size: 10.5px; color: #2a3f52; letter-spacing: 0.3px;
  }

  /* ── Season selector ───────────────────────────────────────── */
  .season-selector {
    position: relative;
  }
  .season-btn {
    padding: 8px 16px;
    background: #0a1018;
    border: 1px solid #1a2332;
    border-radius: 7px;
    color: #c8d6e0;
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
  }
  .season-btn:hover {
    border-color: #e8001d;
    background: rgba(232,0,29,0.08);
  }
  .season-btn-icon {
    font-size: 9px;
    transition: transform 0.2s;
  }
  .season-btn.open .season-btn-icon {
    transform: rotate(180deg);
  }
  .season-dropdown {
    position: absolute;
    top: calc(100% + 6px);
    right: 0;
    background: #0a1018;
    border: 1px solid #1a2332;
    border-radius: 7px;
    overflow: hidden;
    min-width: 160px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
    z-index: 100;
  }
  .season-option {
    padding: 10px 16px;
    font-size: 11px;
    color: #c8d6e0;
    cursor: pointer;
    transition: background 0.15s;
    border-bottom: 1px solid rgba(26,35,50,0.6);
  }
  .season-option:last-child {
    border-bottom: none;
  }
  .season-option:hover {
    background: rgba(232,0,29,0.08);
  }
  .season-option.active {
    background: rgba(232,0,29,0.12);
    color: #e8001d;
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

  .no-data-message {
    text-align: center;
    padding: 48px 20px;
    color: #2a3f52;
    font-size: 12px;
  }

  /* ═══════════════════════════════════════════════════════════════
     CALENDAR & MODAL
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
    transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s;
  }
  .cal-card.done {
    border-left: 3px solid #e8001d;
    cursor: pointer;
  }
  .cal-card.done:hover {
    border-color: #243848;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    transform: translateY(-2px);
  }
  .cal-card.upcoming { border-left: 3px solid #00d4ff; }

  .cal-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
  .cal-round {
    font-family: 'Orbitron', sans-serif;
    font-size: 9px; font-weight: 700;
    color: #2e4455; letter-spacing: 1px;
  }
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

  /* Modal */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(5,8,16,0.85);
    backdrop-filter: blur(4px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    animation: fadeIn 0.25s ease;
  }
  .modal {
    background: linear-gradient(155deg, #0e1522 0%, #0b1018 100%);
    border: 1px solid #1a2332;
    border-radius: 12px;
    max-width: 600px;
    width: 100%;
    max-height: 80vh;
    overflow-y: auto;
    animation: modalIn 0.3s cubic-bezier(.4,0,.2,1);
  }
  .modal-header {
    padding: 20px 24px;
    border-bottom: 1px solid #1a2332;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .modal-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 15px;
    font-weight: 600;
    color: #dde4eb;
  }
  .modal-subtitle {
    font-size: 10px;
    color: #2e4455;
    margin-top: 2px;
  }
  .modal-close {
    background: transparent;
    border: none;
    color: #5a7a8f;
    cursor: pointer;
    font-size: 20px;
    padding: 0;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    transition: background 0.2s, color 0.2s;
  }
  .modal-close:hover {
    background: rgba(232,0,29,0.1);
    color: #e8001d;
  }
  .modal-body {
    padding: 20px 24px;
  }
  .modal-results-table {
    width: 100%;
    border-collapse: collapse;
  }
  .modal-results-table tr {
    border-bottom: 1px solid rgba(26,35,50,0.5);
  }
  .modal-results-table tr:last-child {
    border-bottom: none;
  }
  .modal-results-table td {
    padding: 10px 8px;
    font-size: 11.5px;
  }
  .modal-pos {
    font-family: 'Orbitron', sans-serif;
    font-weight: 700;
    width: 40px;
  }
  .modal-pos.p1 { color: #FFD700; }
  .modal-pos.p2 { color: #C0C0C0; }
  .modal-pos.p3 { color: #CD7F32; }
  .modal-driver {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .modal-driver-flag {
    font-size: 14px;
  }
  .modal-driver-name {
    color: #dde4eb;
  }
  .modal-pts {
    text-align: right;
    color: #5a7a8f;
    font-size: 11px;
  }

  /* ═══════════════════════════════════════════════════════════════
     CAREER PAGE
     ══════════════════════════════════════════════════════════════ */
  .career-section {
    margin-bottom: 32px;
  }
  .career-section-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #dde4eb;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid #1a2332;
  }
  .career-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 10px;
  }
  .career-card {
    background: linear-gradient(155deg, #0e1522 0%, #0b1018 100%);
    border: 1px solid #162232;
    border-radius: 10px;
    padding: 16px;
    position: relative;
    overflow: hidden;
    animation: card-in 0.4s cubic-bezier(.4,0,.2,1) both;
    transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
  }
  .career-card:hover {
    border-color: #243848;
    box-shadow: 0 4px 20px rgba(0,0,0,0.35);
    transform: translateY(-2px);
  }
  .career-card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 14px;
  }
  .career-entity-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .career-entity-name {
    font-family: 'Orbitron', sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: #dde4eb;
  }
  .career-stats {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;
  }
  .career-stat-box {
    background: #0a1018;
    border: 1px solid #152230;
    border-radius: 6px;
    padding: 8px;
    text-align: center;
  }
  .career-stat-label {
    font-size: 7.5px;
    color: #2e4455;
    text-transform: uppercase;
    letter-spacing: 1.2px;
    margin-bottom: 3px;
  }
  .career-stat-val {
    font-family: 'Orbitron', sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: #dde4eb;
  }
  .career-stat-val.pts { color: #e8001d; }
  .career-stat-val.wins { color: #FFD700; }
  .career-stat-val.poles { color: #00d4ff; }
  .career-stat-val.podiums { color: #CD7F32; }
  .career-stat-val.wdc { color: #C0C0C0; }
  .career-stat-val.wcc { color: #C0C0C0; }

  /* ═══════════════════════════════════════════════════════════════
     HEAD TO HEAD PAGE
     ══════════════════════════════════════════════════════════════ */
  .h2h-team-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }
  .h2h-team-card {
    background: linear-gradient(155deg, #0e1522 0%, #0b1018 100%);
    border: 1px solid #162232;
    border-radius: 12px;
    overflow: hidden;
    animation: card-in 0.4s cubic-bezier(.4,0,.2,1) both;
    transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
  }
  .h2h-team-card:hover {
    border-color: #243848;
    box-shadow: 0 4px 20px rgba(0,0,0,0.35);
    transform: translateY(-2px);
  }
  .h2h-team-header {
    padding: 16px 20px;
    border-bottom: 1px solid #1a2332;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .h2h-team-dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .h2h-team-name {
    font-family: 'Orbitron', sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: #dde4eb;
  }
  .h2h-drivers-row {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    padding: 16px 20px;
    gap: 16px;
  }
  .h2h-driver {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .h2h-driver.right {
    align-items: flex-end;
  }
  .h2h-driver-name {
    font-family: 'Orbitron', sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: #dde4eb;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .h2h-driver-num {
    font-size: 10px;
    color: #2e4455;
  }
  .h2h-vs {
    font-family: 'Orbitron', sans-serif;
    font-size: 11px;
    font-weight: 700;
    color: #e8001d;
    padding: 6px 12px;
    background: rgba(232,0,29,0.1);
    border-radius: 6px;
  }
  .h2h-stats-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1px;
    background: #1a2332;
    border-top: 1px solid #1a2332;
  }
  .h2h-stat-row {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    background: linear-gradient(155deg, #0e1522 0%, #0b1018 100%);
    padding: 10px 20px;
    gap: 16px;
  }
  .h2h-stat-val {
    font-family: 'Orbitron', sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: #dde4eb;
  }
  .h2h-stat-val.left {
    text-align: right;
  }
  .h2h-stat-val.winner {
    color: #e8001d;
  }
  .h2h-stat-label {
    font-size: 9px;
    color: #2e4455;
    text-transform: uppercase;
    letter-spacing: 1.2px;
    text-align: center;
    font-weight: 600;
  }
  .h2h-detail-section {
    padding: 16px 20px;
    border-top: 1px solid #1a2332;
  }
  .h2h-detail-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 10px;
    font-weight: 600;
    color: #2e4455;
    text-transform: uppercase;
    letter-spacing: 1.4px;
    margin-bottom: 12px;
  }
  .h2h-race-results {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .h2h-race-item {
    display: grid;
    grid-template-columns: 1fr auto auto;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    background: rgba(26,35,50,0.3);
    border-radius: 6px;
    font-size: 10px;
  }
  .h2h-race-name {
    color: #5a7a8f;
  }
  .h2h-race-pos {
    font-family: 'Orbitron', sans-serif;
    font-size: 10px;
    font-weight: 600;
    color: #c8d6e0;
    min-width: 30px;
    text-align: center;
  }
  .h2h-race-pos.winner {
    color: #e8001d;
  }

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
  .sosp-grid { 
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 10px;
  }
  .sosp-labeled-val {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .sosp-label {
    font-size: 7px;
    color: #2e4455;
    text-transform: uppercase;
    letter-spacing: 1px;
    text-align: center;
    font-weight: 600;
  }
  .sosp-val {
    text-align: center;
    padding: 10px 6px;
    background: linear-gradient(155deg, #0d1822 0%, #0a1218 100%);
    border: 1px solid #1a2e3d; 
    border-radius: 7px;
    font-size: 13px; 
    color: #dde4eb; 
    letter-spacing: 0.4px;
    font-family: 'Orbitron', sans-serif;
    font-weight: 600;
    transition: all 0.2s;
  }
  .sosp-labeled-val:hover .sosp-val {
    background: linear-gradient(155deg, #121a26 0%, #0d1420 100%);
    border-color: #2a3f52;
    transform: translateY(-1px);
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
    .sosp-grid { grid-template-columns: repeat(3, 1fr); }
    .cal-grid { grid-template-columns: 1fr; }
    .career-grid { grid-template-columns: 1fr; }
    .lb-table th, .lb-table td { padding: 8px 8px; font-size: 10.5px; }
    .lb-driver-name { font-size: 10px; }
    .page-header { flex-direction: column; align-items: flex-start; }
    .h2h-team-grid { grid-template-columns: 1fr; }
    .h2h-race-item { grid-template-columns: 1fr auto auto; font-size: 9px; }
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

function TrackCard({ id, track, isOpen, onToggle, index }) {
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
            <div className="sosp-grid">
              <div className="sosp-labeled-val">
                <div className="sosp-label">Trasmissione</div>
                <div className="sosp-val">{track.sosp[0]}</div>
              </div>
              <div className="sosp-labeled-val">
                <div className="sosp-label">S1</div>
                <div className="sosp-val">{track.sosp[1]}</div>
              </div>
              <div className="sosp-labeled-val">
                <div className="sosp-label">S2</div>
                <div className="sosp-val">{track.sosp[2]}</div>
              </div>
              <div className="sosp-labeled-val">
                <div className="sosp-label">S3</div>
                <div className="sosp-val">{track.sosp[3]}</div>
              </div>
              <div className="sosp-labeled-val">
                <div className="sosp-label">S4</div>
                <div className="sosp-val">{track.sosp[4]}</div>
              </div>
              <div className="sosp-labeled-val">
                <div className="sosp-label">S5</div>
                <div className="sosp-val">{track.sosp[5]}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

// Season Selector Component
function SeasonSelector({ currentSeason, onSeasonChange }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="season-selector">
      <button 
        className={`season-btn${isOpen ? " open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{currentSeason}</span>
        <span className="season-btn-icon">▼</span>
      </button>
      {isOpen && (
        <div className="season-dropdown">
          {SEASONS.map((season) => (
            <div
              key={season}
              className={`season-option${season === currentSeason ? " active" : ""}`}
              onClick={() => {
                onSeasonChange(season);
                setIsOpen(false);
              }}
            >
              {season}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Race Results Modal
function RaceResultsModal({ race, raceResults, season, onClose }) {
  const DRIVER_TEAMS = getDriverTeamsForSeason(season);
  const raceData = raceResults.find(r => r.race === race.raceKey);
  
  if (!raceData) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">{race.race}</div>
            <div className="modal-subtitle">{race.city} · Round {race.round}</div>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <table className="modal-results-table">
            <tbody>
              {raceData.results.map((driver, i) => {
                const info = DRIVER_TEAMS[driver];
                const points = i < POINTS_TABLE.length ? POINTS_TABLE[i] : 0;
                return (
                  <tr key={`${driver}-${i}`}>
                    <td>
                      <div className={`modal-pos${i === 0 ? " p1" : i === 1 ? " p2" : i === 2 ? " p3" : ""}`}>
                        P{i + 1}
                      </div>
                    </td>
                    <td>
                      <div className="modal-driver">
                        <span className="modal-driver-flag">{info?.flag || "🏁"}</span>
                        <span className="modal-driver-name">{driver}</span>
                      </div>
                    </td>
                    <td className="modal-pts">{points > 0 ? `${points} pts` : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── LEADERBOARD PAGE ─────────────────────────────────────────────
function LeaderboardPage({ season }) {
  const [tab, setTab] = useState("drivers");
  const [expandedDriver, setExpandedDriver] = useState(null);

  const seasonData = SEASON_DATA[season];
  const driverStandings = useMemo(() => computeDriverStandings(seasonData.races, season), [season]);
  const teamStandings = useMemo(() => computeTeamStandings(seasonData.races, season), [season]);

  function getDriverRaces(driverName) {
    return seasonData.races.map(({ race, results }) => {
      const pos = results.indexOf(driverName);
      return { race, pos: pos >= 0 ? pos + 1 : null, pts: pos >= 0 && pos < POINTS_TABLE.length ? POINTS_TABLE[pos] : 0 };
    }).filter(r => r.pos !== null);
  }

  return (
    <>
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
            {driverStandings.map((d, i) => {
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
                        {races.length > 0 && (
                          <>
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
                          </>
                        )}
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
            {teamStandings.map((t, i) => (
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
    </>
  );
}

// ─── CALENDAR PAGE ────────────────────────────────────────────────
function CalendarPage({ season }) {
  const [selectedRace, setSelectedRace] = useState(null);
  
  const seasonData = SEASON_DATA[season];

  return (
    <>
      <div className="cal-grid">
        {seasonData.calendar.map((race, i) => (
          <div
            key={race.round}
            className={`cal-card ${race.status}`}
            style={{ animationDelay: `${i * 0.04}s` }}
            onClick={() => race.status === "done" && race.raceKey && setSelectedRace(race)}
          >
            <div className="cal-card-header">
              <span className="cal-round">Round {race.round}</span>
              <span className={`cal-status ${race.status}`}>
                {race.status === "done" ? "Completata" : "In arrivo"}
              </span>
            </div>
            <div className="cal-race-name">{race.race}</div>
            <div className="cal-city">{race.city}</div>
            {race.winner && race.winner !== "..." && (
              <div className="cal-winner">
                <span className="cal-winner-flag">🏆</span>
                <span>{race.winner}</span>
              </div>
            )}
          </div>
        ))}
      </div>
      {selectedRace && (
        <RaceResultsModal 
          race={selectedRace} 
          raceResults={seasonData.races}
          season={season}
          onClose={() => setSelectedRace(null)} 
        />
      )}
    </>
  );
}

// ─── CAREER PAGE ──────────────────────────────────────────────────
function CareerPage() {
  const drivers = useMemo(() => {
    return Object.keys(DRIVER_TEAMS_BASE).map((name) => ({
      name,
      ...DRIVER_TEAMS_BASE[name],
      ...CAREER_STATS[name],
    })).sort((a, b) => b.totalPoints - a.totalPoints || b.totalWins - a.totalWins);
  }, []);

  const teams = useMemo(() => {
    return Object.entries(TEAM_CAREER_STATS)
      .map(([team, stats]) => ({ team, ...stats }))
      .sort((a, b) => b.totalPoints - a.totalPoints);
  }, []);

  return (
    <>
      <div className="career-section">
        <h3 className="career-section-title">Piloti</h3>
        <div className="career-grid">
          {drivers.map((d, i) => (
            <div className="career-card" key={d.name} style={{ animationDelay: `${i * 0.035}s` }}>
              <div className="career-card-header">
                <div className="career-entity-dot" style={{ background: TEAM_COLORS[d.team] || "#555" }} />
                <div className="career-entity-name">{d.flag} {d.name}</div>
              </div>
              <div className="career-stats">
                <div className="career-stat-box">
                  <div className="career-stat-label">Punti</div>
                  <div className="career-stat-val pts">{d.totalPoints}</div>
                </div>
                <div className="career-stat-box">
                  <div className="career-stat-label">Pole</div>
                  <div className="career-stat-val poles">{d.totalPoles}</div>
                </div>
                <div className="career-stat-box">
                  <div className="career-stat-label">InterPole</div>
                  <div className="career-stat-val poles">{d.interpole}</div>
                </div>
                <div className="career-stat-box">
                  <div className="career-stat-label">Vittorie</div>
                  <div className="career-stat-val wins">{d.totalWins}</div>
                </div>
                <div className="career-stat-box">
                  <div className="career-stat-label">Podi</div>
                  <div className="career-stat-val podiums">{d.totalPodiums}</div>
                </div>
                <div className="career-stat-box">
                  <div className="career-stat-label">WDC</div>
                  <div className="career-stat-val wdc">{d.championships}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="career-section">
        <h3 className="career-section-title">Costruttori</h3>
        <div className="career-grid">
          {teams.map((t, i) => (
            <div className="career-card" key={t.team} style={{ animationDelay: `${i * 0.035}s` }}>
              <div className="career-card-header">
                <div className="career-entity-dot" style={{ background: TEAM_COLORS[t.team] || "#555" }} />
                <div className="career-entity-name">{t.team}</div>
              </div>
              <div className="career-stats">
                <div className="career-stat-box">
                  <div className="career-stat-label">Punti</div>
                  <div className="career-stat-val pts">{t.totalPoints}</div>
                </div>
                <div className="career-stat-box">
                  <div className="career-stat-label">Pole</div>
                  <div className="career-stat-val poles">{t.totalPoles}</div>
                </div>
                <div className="career-stat-box">
                  <div className="career-stat-label">Vittorie</div>
                  <div className="career-stat-val wins">{t.totalWins}</div>
                </div>
                <div className="career-stat-box">
                  <div className="career-stat-label">WCC</div>
                  <div className="career-stat-val wcc">{t.championships}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── HEAD TO HEAD PAGE ────────────────────────────────────────────
function HeadToHeadPage({ season }) {
  const seasonData = SEASON_DATA[season];
  const DRIVER_TEAMS = getDriverTeamsForSeason(season);

  // Raggruppa i piloti per team
  const teamPairs = useMemo(() => {
    const teams = {};
    Object.entries(DRIVER_TEAMS).forEach(([driver, info]) => {
      if (!teams[info.team]) teams[info.team] = [];
      teams[info.team].push({ name: driver, ...info });
    });
    return Object.entries(teams)
      .filter(([_, drivers]) => drivers.length === 2)
      .map(([team, drivers]) => ({ team, drivers }));
  }, [season]);

  // Calcola statistiche H2H per una coppia di piloti
  function calculateH2H(driver1, driver2) {
    const stats1 = { points: 0, wins: 0, podiums: 0, poles: 0, qualiWins: 0, raceWins: 0, races: [] };
    const stats2 = { points: 0, wins: 0, podiums: 0, poles: 0, qualiWins: 0, raceWins: 0, races: [] };

    seasonData.races.forEach(({ race, results }) => {
      const pos1 = results.indexOf(driver1.name);
      const pos2 = results.indexOf(driver2.name);
      
      if (pos1 >= 0 && pos1 < POINTS_TABLE.length) {
        stats1.points += POINTS_TABLE[pos1];
      }
      if (pos2 >= 0 && pos2 < POINTS_TABLE.length) {
        stats2.points += POINTS_TABLE[pos2];
      }

      if (pos1 === 0) stats1.wins++;
      if (pos2 === 0) stats2.wins++;

      if (pos1 >= 0 && pos1 < 3) stats1.podiums++;
      if (pos2 >= 0 && pos2 < 3) stats2.podiums++;

      // Qualifica (usando driverPoles)
      const poles = seasonData.driverPoles || {};
      stats1.poles = poles[driver1.name] || 0;
      stats2.poles = poles[driver2.name] || 0;

      // Race head-to-head
      if (pos1 >= 0 && pos2 >= 0) {
        if (pos1 < pos2) {
          stats1.raceWins++;
        } else if (pos2 < pos1) {
          stats2.raceWins++;
        }
        stats1.races.push({ race, pos: pos1 + 1 });
        stats2.races.push({ race, pos: pos2 + 1 });
      }
    });

    return { stats1, stats2 };
  }

  return (
    <div className="h2h-team-grid">
      {teamPairs.map(({ team, drivers }, idx) => {
        const [driver1, driver2] = drivers;
        const { stats1, stats2 } = calculateH2H(driver1, driver2);

        return (
          <div className="h2h-team-card" key={team} style={{ animationDelay: `${idx * 0.05}s` }}>
            <div className="h2h-team-header">
              <div className="h2h-team-dot" style={{ background: TEAM_COLORS[team] || "#555" }} />
              <div className="h2h-team-name">{team}</div>
            </div>

            <div className="h2h-drivers-row">
              <div className="h2h-driver">
                <div className="h2h-driver-name">
                  <span>{driver1.flag}</span>
                  <span>{driver1.name}</span>
                </div>
                <div className="h2h-driver-num">#{driver1.num}</div>
              </div>
              <div className="h2h-vs">VS</div>
              <div className="h2h-driver right">
                <div className="h2h-driver-name">
                  <span>{driver2.name}</span>
                  <span>{driver2.flag}</span>
                </div>
                <div className="h2h-driver-num">#{driver2.num}</div>
              </div>
            </div>

            <div className="h2h-stats-grid">
              <div className="h2h-stat-row">
                <div className={`h2h-stat-val left${stats1.points > stats2.points ? " winner" : ""}`}>
                  {stats1.points}
                </div>
                <div className="h2h-stat-label">Punti</div>
                <div className={`h2h-stat-val${stats2.points > stats1.points ? " winner" : ""}`}>
                  {stats2.points}
                </div>
              </div>

              <div className="h2h-stat-row">
                <div className={`h2h-stat-val left${stats1.wins > stats2.wins ? " winner" : ""}`}>
                  {stats1.wins}
                </div>
                <div className="h2h-stat-label">Vittorie</div>
                <div className={`h2h-stat-val${stats2.wins > stats1.wins ? " winner" : ""}`}>
                  {stats2.wins}
                </div>
              </div>

              <div className="h2h-stat-row">
                <div className={`h2h-stat-val left${stats1.podiums > stats2.podiums ? " winner" : ""}`}>
                  {stats1.podiums}
                </div>
                <div className="h2h-stat-label">Podi</div>
                <div className={`h2h-stat-val${stats2.podiums > stats1.podiums ? " winner" : ""}`}>
                  {stats2.podiums}
                </div>
              </div>

              <div className="h2h-stat-row">
                <div className={`h2h-stat-val left${stats1.poles > stats2.poles ? " winner" : ""}`}>
                  {stats1.poles}
                </div>
                <div className="h2h-stat-label">Pole Position</div>
                <div className={`h2h-stat-val${stats2.poles > stats1.poles ? " winner" : ""}`}>
                  {stats2.poles}
                </div>
              </div>

              <div className="h2h-stat-row">
                <div className={`h2h-stat-val left${stats1.raceWins > stats2.raceWins ? " winner" : ""}`}>
                  {stats1.raceWins}
                </div>
                <div className="h2h-stat-label">Gare Vinte H2H</div>
                <div className={`h2h-stat-val${stats2.raceWins > stats1.raceWins ? " winner" : ""}`}>
                  {stats2.raceWins}
                </div>
              </div>
            </div>

            {stats1.races.length > 0 && (
              <div className="h2h-detail-section">
                <div className="h2h-detail-title">Risultati Gara</div>
                <div className="h2h-race-results">
                  {stats1.races.map((r1, i) => {
                    const r2 = stats2.races[i];
                    return (
                      <div className="h2h-race-item" key={r1.race}>
                        <div className="h2h-race-name">{r1.race}</div>
                        <div className={`h2h-race-pos${r1.pos < r2.pos ? " winner" : ""}`}>
                          P{r1.pos}
                        </div>
                        <div className={`h2h-race-pos${r2.pos < r1.pos ? " winner" : ""}`}>
                          P{r2.pos}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── SETUP PAGE ───────────────────────────────────────────────────
function SetupPage() {
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState("Tutti");
  const [openCard, setOpenCard] = useState(null);

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
  };

  return (
    <>
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
            />
          ))
        )}
      </div>
    </>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────
export default function App() {
  useFonts();
  const [page, setPage] = useState("leaderboard");
  const [season, setSeason] = useState(SEASONS[0]);

  const seasonData = SEASON_DATA[season];
  const completedRaces = seasonData.calendar.filter(r => r.status === "done").length;
  const totalRaces = seasonData.calendar.length;

  const pageTitle = {
    leaderboard: "Classifica Generale",
    calendar: "Calendario",
    h2h: "Head-to-Head",
    career: "Statistiche Carriera",
    setup: "Setup Dashboard"
  }[page];

  const pageSubtitle = {
    leaderboard: `${season} · ${completedRaces}/${totalRaces} gare completate`,
    calendar: `${season} · ${totalRaces} gare programmate`,
    h2h: `${season} · Confronto compagni di squadra`,
    career: `Tutte le stagioni · Statistiche totali carriera`,
    setup: `${Object.keys(TRACKS).length} circuiti · simulatore`
  }[page];

  const showSeasonSelector = ["leaderboard", "calendar", "h2h"].includes(page);

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
                <span className="f1-status-label">{season} · Online</span>
              </div>
              <div className="f1-title-row">
                <h1 className="f1-title">F1 Dashboard</h1>
                <span className="f1-subtitle">Campionato in corso</span>
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

        <div className="f1-page">
          <div className="page-header">
            <div className="page-header-left">
              <h2>{pageTitle}</h2>
              <p>{pageSubtitle}</p>
            </div>
            {showSeasonSelector && (
              <SeasonSelector currentSeason={season} onSeasonChange={setSeason} />
            )}
          </div>

          {page === "leaderboard" && <LeaderboardPage season={season} />}
          {page === "calendar" && <CalendarPage season={season} />}
          {page === "h2h" && <HeadToHeadPage season={season} />}
          {page === "career" && <CareerPage />}
          {page === "setup" && <SetupPage />}
        </div>
      </div>
    </>
  );
}