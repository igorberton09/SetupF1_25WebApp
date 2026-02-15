import { useState, useMemo, useEffect, useRef } from "react";

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
  australia:   { nome: "Melbourne",   aero: [23, 10], trasmissione: [41, 1], sosp: [41, 1, 12, 17, 20, 44], freni: [55, 100], geometria: [-3.50, -2.00, 0.00, 0.10], gomme: [29.5, 29.5, 26.5, 26.5], continente: "Oceania" },
  cina:        { nome: "Shanghai",    aero: [24, 21], trasmissione: [41, 1], sosp: [41, 1,  4,  8, 21, 48], freni: [55, 100], geometria: [-3.50, -2.00, 0.00, 0.10], gomme: [29.5, 29.5, 26.5, 26.5], continente: "Asia"    },
  suzuka:      { nome: "Suzuka",      aero: [31, 21], trasmissione: [41, 1], sosp: [41, 1,  6, 21, 22, 42], freni: [55, 100], geometria: [-3.50, -2.00, 0.00, 0.10], gomme: [29.5, 29.5, 26.5, 26.5], continente: "Asia"    },
  bahrain:     { nome: "Sakhir",      aero: [34, 29], trasmissione: [41, 10], sosp: [41, 10, 9, 10, 20, 40], freni: [55, 100], geometria: [-3.50, -2.00, 0.00, 0.10], gomme: [29.5, 29.5, 26.5, 26.5], continente: "Asia"    },
  jeddah:      { nome: "Jeddah",      aero: [15,  1], trasmissione: [41, 6], sosp: [41, 6,  1,  7, 18, 40], freni: [55, 100], geometria: [-3.50, -2.00, 0.00, 0.10], gomme: [29.5, 29.5, 26.5, 26.5], continente: "Asia"    },
  miami:       { nome: "Miami",       aero: [12,  4], trasmissione: [30, 1], sosp: [30, 1,  1, 17, 22, 40], freni: [55, 100], geometria: [-3.50, -2.00, 0.00, 0.10], gomme: [29.5, 29.5, 26.5, 26.5], continente: "America" },
  imola:       { nome: "Imola",       aero: [43, 37], trasmissione: [41, 1], sosp: [41, 1,  9, 21, 23, 52], freni: [55, 100], geometria: [-3.50, -2.00, 0.00, 0.10], gomme: [29.5, 29.5, 26.5, 26.5], continente: "Europa"  },
  monaco:      { nome: "Monaco",      aero: [50, 50], trasmissione: [41, 22], sosp: [41, 22, 3, 21, 19, 49], freni: [55, 100], geometria: [-3.50, -2.00, 0.00, 0.10], gomme: [29.5, 29.5, 26.5, 26.5], continente: "Europa"  },
  spagna:      { nome: "Barcellona",  aero: [41, 32], trasmissione: [38, 2], sosp: [38, 2,  6, 21, 20, 43], freni: [55, 100], geometria: [-3.50, -2.00, 0.00, 0.10], gomme: [29.5, 29.5, 26.5, 26.5], continente: "Europa"  },
  canada:      { nome: "Montreal",    aero: [35, 28], trasmissione: [41, 1], sosp: [41, 1,  1, 18, 19, 40], freni: [55, 100], geometria: [-3.50, -2.00, 0.00, 0.10], gomme: [29.5, 29.5, 26.5, 26.5], continente: "America" },
  austria:     { nome: "Spielberg",   aero: [37, 30], trasmissione: [41, 5], sosp: [41, 5,  3, 20, 20, 46], freni: [55, 100], geometria: [-3.50, -2.00, 0.00, 0.10], gomme: [29.5, 29.5, 26.5, 26.5], continente: "Europa"  },
  silverstone: { nome: "Silverstone", aero: [12,  0], trasmissione: [41, 1], sosp: [41, 1,  5, 18, 21, 40], freni: [55, 100], geometria: [-3.50, -2.00, 0.00, 0.10], gomme: [29.5, 29.5, 26.5, 26.5], continente: "Europa"  },
  spa:         { nome: "Spa",         aero: [8,   8], trasmissione: [41, 1], sosp: [41, 1,  6, 12, 20, 40], freni: [55, 100], geometria: [-3.50, -2.00, 0.00, 0.10], gomme: [29.5, 29.5, 26.5, 26.5], continente: "Europa"  },
  ungheria:    { nome: "Budapest",    aero: [50, 50], trasmissione: [41, 1], sosp: [41, 1, 10, 21, 19, 40], freni: [55, 100], geometria: [-3.50, -2.00, 0.00, 0.10], gomme: [29.5, 29.5, 26.5, 26.5], continente: "Europa"  },
  olanda:      { nome: "Zandvoort",   aero: [50, 48], trasmissione: [41, 1], sosp: [41, 1,  9, 21, 22, 40], freni: [55, 100], geometria: [-3.50, -2.00, 0.00, 0.10], gomme: [29.5, 29.5, 26.5, 26.5], continente: "Europa"  },
  monza:       { nome: "Monza",       aero: [0,   3], trasmissione: [41, 1], sosp: [41, 1,  1, 21, 21, 40], freni: [55, 100], geometria: [-3.50, -2.00, 0.00, 0.10], gomme: [29.5, 29.5, 26.5, 26.5], continente: "Europa"  },
  baku:        { nome: "Baku",        aero: [4,   1], trasmissione: [41, 1], sosp: [41, 1,  1, 19, 21, 40], freni: [55, 100], geometria: [-3.50, -2.00, 0.00, 0.10], gomme: [29.5, 29.5, 26.5, 26.5], continente: "Asia"    },
  singapore:   { nome: "Singapore",   aero: [50, 47], trasmissione: [41, 1], sosp: [41, 1, 16, 21, 20, 40], freni: [55, 100], geometria: [-3.50, -2.00, 0.00, 0.10], gomme: [29.5, 29.5, 26.5, 26.5], continente: "Asia"    },
  austin:      { nome: "Austin",      aero: [41, 34], trasmissione: [41, 3], sosp: [41, 3,  1, 21, 20, 40], freni: [55, 100], geometria: [-3.50, -2.00, 0.00, 0.10], gomme: [29.5, 29.5, 26.5, 26.5], continente: "America" },
  messico:     { nome: "Mexico City", aero: [40, 36], trasmissione: [41, 3], sosp: [32, 3,  5, 21, 23, 45], freni: [55, 100], geometria: [-3.50, -2.00, 0.00, 0.10], gomme: [29.5, 29.5, 26.5, 26.5], continente: "America" },
  brasile:     { nome: "Sao Paolo",   aero: [27, 14], trasmissione: [41, 5], sosp: [41, 5,  2, 21, 22, 41], freni: [55, 100], geometria: [-3.50, -2.00, 0.00, 0.10], gomme: [29.5, 29.5, 26.5, 26.5], continente: "America" },
  lasvegas:    { nome: "Las Vegas",   aero: [1,   0], trasmissione: [41, 6], sosp: [41, 6,  5, 21, 23, 48], freni: [55, 100], geometria: [-3.50, -2.00, 0.00, 0.10], gomme: [29.5, 29.5, 26.5, 26.5], continente: "America" },
  qatar:       { nome: "Lusail",      aero: [42, 30], trasmissione: [41, 3], sosp: [41, 3,  1, 16, 19, 45], freni: [55, 100], geometria: [-3.50, -2.00, 0.00, 0.10], gomme: [29.5, 29.5, 26.5, 26.5], continente: "Asia"    },
  abudhabi:    { nome: "Yas Marina",  aero: [29, 18], trasmissione: [41, 1], sosp: [41, 1,  1, 17, 17, 40], freni: [55, 100], geometria: [-3.50, -2.00, 0.00, 0.10], gomme: [29.5, 29.5, 26.5, 26.5], continente: "Asia"    },
};

const SHARED = {
  trasmissione: "100 - 20",
  geometria:    "-3,50° · -2,00° · 0,00° · 0,10°",
  freni:        "55% - 100%",
  gomme:        "29,5 - 29,5 - 26,5 - 26,5",
};

const CONTINENTI = ["Tutti", "Europa", "Asia", "America", "Oceania"];
const CONTINENT_EMOJI = { Europa: "🇪🇺", Asia: "🌏", America: "🌎", Oceania: "🌏" };

// ... (rest of the data remains the same: RULES_CONFIG, SEASON_DATA, POINTS_TABLE, DRIVER_TEAMS_BASE, TEAM_CHANGES, TEAM_COLORS, CAREER_STATS, TEAM_CAREER_STATS, NAV)

// ─── RULES CONFIGURATION ──────────────────────────────────────────
const RULES_CONFIG = [
  {
    id: "points",
    title: "Sistema di Punteggio",
    icon: "🏆",
    content: [
      "I punti vengono assegnati ai primi 10 classificati secondo lo schema standard F1:",
      "1° posto: 25 punti",
      "2° posto: 18 punti", 
      "3° posto: 15 punti",
      "4° posto: 12 punti",
      "5° posto: 10 punti",
      "6° posto: 8 punti",
      "7° posto: 6 punti",
      "8° posto: 4 punti",
      "9° posto: 2 punti",
      "10° posto: 1 punto",
      "",
      "Interpole: 1 punto",
      "Pole: 1 punto",
      "Maggior numero di sorpassi: 1 punto",
      "Il pilota con più punti al termine della stagione viene incoronato Campione del Mondo."
    ]
  },
  {
    id: "qualifying and race",
    title: "Qualifiche e Gare",
    icon: "⏱️",
    content: [
      "Gare medie",
      "Qualifiche complete",
      "Le qualifiche determinano la griglia di partenza per la gara.",
      "Il pilota più veloce ottiene la Pole Position (1° posto in griglia) e riceverà un punto aggiuntivo.",
      "",
      "Le pole position vengono conteggiate nelle statistiche di carriera.",
      "Non vengono assegnati punti per le qualifiche, ma una buona posizione di partenza è fondamentale per la strategia di gara.",
      "",
      "Nel Q1 è possibile fare la interpole solo se si vuole, chi fa il giro più veloce con le intermedio nel Q1 prima dei 14 minuti riceverà un punto in più, solo se la condizione della pista è asciutto",
      "",
      "Il pilota con il maggior numero di sorpassi riceverà 1 punto"
    ]
  },
  {
    id: "teams",
    title: "Campionato Costruttori",
    icon: "🏗️",
    content: [
      "Ogni squadra schiera due piloti.",
      "I punti di entrambi i piloti vengono sommati per il Campionato Costruttori.",
      "",
      "La squadra con più punti totali vince il Campionato Costruttori.",
      "È possibile vincere il Campionato Piloti senza che la propria squadra vinca il Campionato Costruttori, e viceversa.",
      "",
      "I trasferimenti di piloti tra le stagioni possono modificare la composizione dei team."
    ]
  }
];

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
      { race: "Qatar",     results: []}
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
    races: [
      { race: "?",   results: []},
      { race: "?",   results: []},
      { race: "?",   results: []},
      { race: "?",   results: []},
      { race: "?",   results: []},
      { race: "?",   results: []},
      { race: "?",   results: []},
    ],
    calendar: [
      { round: 1, race: "?", city: "?", status: "upcoming", winner: "...", raceKey: null },
      { round: 2, race: "?", city: "?", status: "upcoming", winner: "...", raceKey: null },
      { round: 3, race: "?", city: "?", status: "upcoming", winner: "...", raceKey: null },
      { round: 4, race: "?", city: "?", status: "upcoming", winner: "...", raceKey: null },
      { round: 5, race: "?", city: "?", status: "upcoming", winner: "...", raceKey: null },
      { round: 6, race: "?", city: "?", status: "upcoming", winner: "...", raceKey: null },
      { round: 7, race: "?", city: "?", status: "upcoming", winner: "...", raceKey: null },
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
    Hadjar: { team: "Visa Cash App RB", num: 6},
    Norris: { num: 1 },
    Verstappen: { num: 3 },
  },
  "Stagione 3": {
  }
};

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
    .filter(name => DRIVER_TEAMS[name].team !== "No Seat")
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
  
  const teams = {};
  Object.values(DRIVER_TEAMS).forEach(driver => {
    if (driver.team !== "No Seat" && !teams[driver.team]) {
      teams[driver.team] = { points: 0, wins: 0, poles: 0, wcc: 0 };
    }
  });
  
  raceResults.forEach(({ results }) => {
    results.forEach((d, i) => {
      if (i >= POINTS_TABLE.length) return;
      const info = DRIVER_TEAMS[d];
      if (!info || info.team === "No Seat") return;
      teams[info.team].points += POINTS_TABLE[i];
      if (i === 0) teams[info.team].wins += 1;
    });
  });
  
  return Object.entries(teams)
    .map(([team, data]) => ({ team, ...data }))
    .sort((a, b) => b.points - a.points);
}

const SEASONS = ["Stagione 1", "Stagione 2", "Stagione 3"];

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
  Igor:       { totalPoints: 54, totalWins: 1, totalPoles: 3, totalPodiums: 2, championships: 0, totalInterpole: 0 },
  Bearman:    { totalPoints: 0,  totalWins: 0, totalPoles: 0, totalPodiums: 0, championships: 0 },
  Manuel:     { totalPoints: 22, totalWins: 0, totalPoles: 0, totalPodiums: 1, championships: 0, totalInterpole: 0 },
  Gasly:      { totalPoints: 1,  totalWins: 0, totalPoles: 0, totalPodiums: 0, championships: 0 },
  Alex:       { totalPoints: 75, totalWins: 3, totalPoles: 3, totalPodiums: 3, championships: 0, totalInterpole: 0 },
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

const NAV = [
  { id: "leaderboard", label: "Leaderboard",  icon: "🏆" },
  { id: "calendar",    label: "Calendario",   icon: "📅" },
  { id: "h2h",         label: "Head-to-Head", icon: "⚔️" },
  { id: "career",      label: "Carriera",     icon: "🏁" },
  { id: "setup",       label: "Setup Creator", icon: "⚙️" },
  { id: "rules",       label: "Regole",       icon: "📋" },
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
  @keyframes ai-pulse {
    0%, 100% { box-shadow: 0 0 20px rgba(0,212,255,0.3); }
    50%      { box-shadow: 0 0 30px rgba(0,212,255,0.5), 0 0 40px rgba(232,0,29,0.2); }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
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
    max-width: 1400px; margin: 0 auto;
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
    max-width: 1400px; margin: 0 auto;
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
    max-width: 1400px; margin: 0 auto; width: 100%;
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
     SETUP CREATOR - ADVANCED INTERFACE
     ══════════════════════════════════════════════════════════════ */
  .setup-creator-container {
    display: grid;
    grid-template-columns: 400px 1fr;
    gap: 20px;
    height: calc(100vh - 240px);
  }

  /* Left Panel - Track Selection & Info */
  .setup-left-panel {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .track-selector-card {
    background: linear-gradient(155deg, #0e1522 0%, #0b1018 100%);
    border: 1px solid #1a2332;
    border-radius: 12px;
    padding: 20px;
    animation: card-in 0.4s ease;
  }

  .track-selector-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: #dde4eb;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .track-select {
    width: 100%;
    padding: 12px 16px;
    background: #0a1018;
    border: 1px solid #1a2332;
    border-radius: 8px;
    color: #c8d6e0;
    font-family: 'Share Tech Mono', monospace;
    font-size: 12px;
    outline: none;
    transition: border-color 0.2s;
    cursor: pointer;
  }

  .track-select:focus {
    border-color: #00d4ff;
  }

  .track-info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-top: 16px;
  }

  .track-info-item {
    padding: 10px;
    background: rgba(0,212,255,0.03);
    border: 1px solid rgba(0,212,255,0.2);
    border-radius: 6px;
  }

  .track-info-label {
    font-size: 8px;
    color: #2e4455;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 4px;
  }

  .track-info-value {
    font-family: 'Orbitron', sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: #00d4ff;
  }

  .quick-guides-card {
    background: linear-gradient(155deg, #0e1522 0%, #0b1018 100%);
    border: 1px solid #1a2332;
    border-radius: 12px;
    padding: 20px;
    flex: 1;
    overflow-y: auto;
  }

  .quick-guide-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: #dde4eb;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .quick-guide-section {
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(26,35,50,0.6);
  }

  .quick-guide-section:last-child {
    border-bottom: none;
  }

  .quick-guide-section h4 {
    font-family: 'Orbitron', sans-serif;
    font-size: 11px;
    font-weight: 600;
    color: #5a7a8f;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .quick-guide-tips {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .quick-tip {
    font-size: 10px;
    color: #8aacbe;
    line-height: 1.5;
    padding-left: 12px;
    position: relative;
  }

  .quick-tip::before {
    content: '•';
    position: absolute;
    left: 0;
    color: #00d4ff;
  }

  /* Right Panel - Setup Editor */
  .setup-right-panel {
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow-y: auto;
  }

  .setup-editor-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    background: linear-gradient(155deg, #0e1522 0%, #0b1018 100%);
    border: 1px solid #1a2332;
    border-radius: 12px;
  }

  .setup-editor-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #dde4eb;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .setup-actions {
    display: flex;
    gap: 8px;
  }

  .setup-action-btn {
    padding: 8px 16px;
    background: #0a1018;
    border: 1px solid #1a2332;
    border-radius: 6px;
    color: #c8d6e0;
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .setup-action-btn:hover {
    border-color: #00d4ff;
    background: rgba(0,212,255,0.05);
  }

  .setup-action-btn.primary {
    background: linear-gradient(135deg, #00d4ff 0%, #e8001d 100%);
    border: none;
    color: #fff;
  }

  .setup-action-btn.primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0,212,255,0.4);
  }

  /* Setup Categories */
  .setup-categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 16px;
  }

  .setup-category-card {
    background: linear-gradient(155deg, #0e1522 0%, #0b1018 100%);
    border: 1px solid #1a2332;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.2s;
    animation: card-in 0.4s ease;
  }

  .setup-category-card:hover {
    border-color: #243848;
    box-shadow: 0 4px 20px rgba(0,0,0,0.35);
    transform: translateY(-2px);
  }

  .setup-category-header {
    padding: 16px 20px;
    background: rgba(0,212,255,0.02);
    border-bottom: 1px solid #1a2332;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .setup-category-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: #dde4eb;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .setup-category-icon {
    font-size: 18px;
  }

  .setup-category-body {
    padding: 20px;
  }

  .setup-param-group {
    margin-bottom: 20px;
  }

  .setup-param-group:last-child {
    margin-bottom: 0;
  }

  .setup-param-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .setup-param-name {
    font-size: 10px;
    color: #5a7a8f;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .setup-param-value {
    font-family: 'Orbitron', sans-serif;
    font-size: 13px;
    font-weight: 700;
    color: #00d4ff;
  }

  .setup-slider {
    width: 100%;
    height: 6px;
    background: #0d1520;
    border-radius: 3px;
    outline: none;
    -webkit-appearance: none;
  }

  .setup-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    background: linear-gradient(135deg, #00d4ff 0%, #e8001d 100%);
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s;
  }

  .setup-slider::-webkit-slider-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 0 12px rgba(0,212,255,0.6);
  }

  .setup-slider::-moz-range-thumb {
    width: 18px;
    height: 18px;
    background: linear-gradient(135deg, #00d4ff 0%, #e8001d 100%);
    border-radius: 50%;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
  }

  .setup-slider::-moz-range-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 0 12px rgba(0,212,255,0.6);
  }

  /* Multi-value controls */
  .setup-multi-param {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 12px;
  }

  .setup-multi-item {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .setup-multi-label {
    font-size: 8px;
    color: #2e4455;
    text-transform: uppercase;
    letter-spacing: 1px;
    text-align: center;
  }

  .setup-multi-input {
    padding: 10px;
    background: #0a1018;
    border: 1px solid #1a2332;
    border-radius: 6px;
    color: #c8d6e0;
    font-family: 'Orbitron', sans-serif;
    font-size: 12px;
    font-weight: 600;
    text-align: center;
    outline: none;
    transition: all 0.2s;
  }

  .setup-multi-input:focus {
    border-color: #00d4ff;
    box-shadow: 0 0 0 2px rgba(0,212,255,0.1);
  }

  /* Preset buttons */
  .setup-presets {
    display: flex;
    gap: 8px;
    margin-top: 12px;
    flex-wrap: wrap;
  }

  .setup-preset-btn {
    padding: 6px 12px;
    background: rgba(0,212,255,0.05);
    border: 1px solid rgba(0,212,255,0.2);
    border-radius: 4px;
    color: #00d4ff;
    font-size: 9px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .setup-preset-btn:hover {
    background: rgba(0,212,255,0.1);
    border-color: rgba(0,212,255,0.4);
  }

  /* Export Modal */
  .export-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(5,8,16,0.9);
    backdrop-filter: blur(4px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    animation: fadeIn 0.25s ease;
  }

  .export-modal {
    background: linear-gradient(155deg, #0e1522 0%, #0b1018 100%);
    border: 1px solid #1a2332;
    border-radius: 12px;
    max-width: 600px;
    width: 100%;
    max-height: 80vh;
    overflow-y: auto;
    animation: modalIn 0.3s cubic-bezier(.4,0,.2,1);
  }

  .export-modal-header {
    padding: 20px 24px;
    border-bottom: 1px solid #1a2332;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .export-modal-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 15px;
    font-weight: 600;
    color: #dde4eb;
  }

  .export-modal-close {
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

  .export-modal-close:hover {
    background: rgba(232,0,29,0.1);
    color: #e8001d;
  }

  .export-modal-body {
    padding: 20px 24px;
  }

  .export-format-label {
    font-size: 11px;
    color: #5a7a8f;
    margin-bottom: 12px;
    display: block;
  }

  .export-formats {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
  }

  .export-format-btn {
    flex: 1;
    padding: 16px;
    background: #0a1018;
    border: 1px solid #1a2332;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    text-align: center;
  }

  .export-format-btn:hover {
    border-color: #00d4ff;
    background: rgba(0,212,255,0.05);
  }

  .export-format-btn.active {
    border-color: #e8001d;
    background: rgba(232,0,29,0.1);
  }

  .export-format-icon {
    font-size: 24px;
    margin-bottom: 8px;
  }

  .export-format-name {
    font-family: 'Orbitron', sans-serif;
    font-size: 11px;
    font-weight: 600;
    color: #dde4eb;
  }

  .export-preview {
    background: #0a1018;
    border: 1px solid #1a2332;
    border-radius: 8px;
    padding: 16px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px;
    color: #c8d6e0;
    max-height: 300px;
    overflow-y: auto;
    white-space: pre-wrap;
    line-height: 1.6;
  }

  .export-actions {
    display: flex;
    gap: 12px;
    margin-top: 20px;
  }

  .export-btn {
    flex: 1;
    padding: 12px;
    background: linear-gradient(135deg, #00d4ff 0%, #e8001d 100%);
    border: none;
    border-radius: 8px;
    color: #fff;
    font-family: 'Orbitron', sans-serif;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .export-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,212,255,0.4);
  }

  /* Responsive */
  @media (max-width: 1200px) {
    .setup-creator-container {
      grid-template-columns: 1fr;
    }
    
    .setup-left-panel {
      flex-direction: row;
    }
    
    .track-selector-card,
    .quick-guides-card {
      flex: 1;
    }
  }

  @media (max-width: 768px) {
    .setup-left-panel {
      flex-direction: column;
    }
    
    .setup-categories-grid {
      grid-template-columns: 1fr;
    }
    
    .export-formats {
      flex-direction: column;
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     ORIGINAL STYLES (Leaderboard, Calendar, etc.)
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

  /* Calendar */
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

  /* Career */
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
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
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
  .career-stat-val.wins { color: #c0a300; }
  .career-stat-val.poles { color: #00d4ff; }
  .career-stat-val.interpole { color: #00a816; }
  .career-stat-val.podiums { color: #a16325; }
  .career-stat-val.wdc { color: #ffc400; }
  .career-stat-val.wcc { color: #ffc400; }

  /* H2H */
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

  /* Rules */
  .rules-grid {
    display: grid;
    gap: 16px;
  }
  .rule-card {
    background: linear-gradient(155deg, #0e1522 0%, #0b1018 100%);
    border: 1px solid #162232;
    border-radius: 12px;
    overflow: hidden;
    animation: card-in 0.4s cubic-bezier(.4,0,.2,1) both;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .rule-card:hover {
    border-color: #243848;
    box-shadow: 0 4px 20px rgba(0,0,0,0.35);
  }
  .rule-header {
    padding: 18px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    user-select: none;
  }
  .rule-header-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .rule-icon {
    font-size: 24px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(232,0,29,0.1);
    border-radius: 8px;
  }
  .rule-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #dde4eb;
  }
  .rule-toggle {
    font-size: 12px;
    color: #5a7a8f;
    transition: transform 0.3s cubic-bezier(.4,0,.2,1), color 0.2s;
  }
  .rule-card.expanded .rule-toggle {
    transform: rotate(180deg);
    color: #e8001d;
  }
  .rule-content {
    overflow: hidden;
    max-height: 0;
    opacity: 0;
    transition: max-height 0.4s cubic-bezier(.4,0,.2,1), opacity 0.3s;
  }
  .rule-card.expanded .rule-content {
    max-height: 800px;
    opacity: 1;
  }
  .rule-content-inner {
    padding: 0 20px 20px;
    border-top: 1px solid #1a2332;
  }
  .rule-text {
    font-size: 11px;
    color: #8aacbe;
    line-height: 1.7;
    margin-top: 16px;
  }
  .rule-text-item {
    margin-bottom: 8px;
  }
  .rule-text-item:last-child {
    margin-bottom: 0;
  }
`;

// ─── ADVANCED SETUP CREATOR COMPONENT ─────────────────────────────
function AdvancedSetupCreator() {
  const [selectedTrack, setSelectedTrack] = useState("");
  const [setupValues, setSetupValues] = useState({
    aero: [25, 25],
    trasmissione: 50,
    geometria: [-3.50, -2.00, 0.00, 0.10],
    sosp: [41, 1, 10, 21, 20, 40],
    freni: [55, 100],
    gomme: [29.5, 29.5, 26.5, 26.5],
  });
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState("text");

  const trackData = selectedTrack ? TRACKS[selectedTrack] : null;

  // Load track's base setup
  useEffect(() => {
    if (trackData) {
      setSetupValues({
        aero: [...trackData.aero],
        trasmissione: trackData.trasmissione,
        geometria: [...trackData.geometria],
        sosp: [...trackData.sosp],
        freni: [...trackData.freni],
        gomme: [...trackData.gomme],
      });
    }
  }, [selectedTrack]);

  const updateSetupValue = (category, index, value) => {
    setSetupValues(prev => {
      const newValues = { ...prev };
      if (Array.isArray(newValues[category])) {
        const newArray = [...newValues[category]];
        newArray[index] = parseFloat(value) || 0;
        newValues[category] = newArray;
      } else {
        newValues[category] = parseFloat(value) || 0;
      }
      return newValues;
    });
  };

  const resetToBase = () => {
    if (trackData) {
      setSetupValues({
        aero: [...trackData.aero],
        trasmissione: trackData.trasmissione,
        geometria: [...trackData.geometria],
        sosp: [...trackData.sosp],
        freni: [...trackData.freni],
        gomme: [...trackData.gomme],
      });
    }
  };

  const exportSetup = () => {
    if (!trackData) return "";
    
    if (exportFormat === "text") {
      return `═══════════════════════════════════════
🏁 F1 SETUP EXPORT - ${trackData.nome}
═══════════════════════════════════════

📍 CIRCUITO: ${trackData.nome}
🌍 CONTINENTE: ${trackData.continente}

⚙️ SETUP DETTAGLIATO:

✈️ AERODINAMICA:
   Front Wing: ${setupValues.aero[0]}
   Rear Wing: ${setupValues.aero[1]}

🔧 TRASMISSIONE:
   Differenziale: ${setupValues.trasmissione[0]}
   Differenziale: ${setupValues.trasmissione[1]}

📐 GEOMETRIA:
   Camber Ant.: ${setupValues.geometria[0]}°
   Camber Post.: ${setupValues.geometria[1]}°
   Toe Ant.: ${setupValues.geometria[2]}°
   Toe Post.: ${setupValues.geometria[3]}°

🔩 SOSPENSIONI:
   Trasmissione: ${setupValues.sosp[0]}
   S1: ${setupValues.sosp[1]}
   S2: ${setupValues.sosp[2]}
   S3: ${setupValues.sosp[3]}
   S4: ${setupValues.sosp[4]}
   S5: ${setupValues.sosp[5]}

🛑 FRENI:
   Bilanciamento: ${setupValues.freni[0]}%
   Pressione: ${setupValues.freni[1]}%

🏎️ PRESSIONE GOMME:
   Ant. Sx: ${setupValues.gomme[0]} PSI
   Ant. Dx: ${setupValues.gomme[1]} PSI
   Post. Sx: ${setupValues.gomme[2]} PSI
   Post. Dx: ${setupValues.gomme[3]} PSI

═══════════════════════════════════════
Generated by F1 Dashboard Setup Creator
═══════════════════════════════════════`;
    } else if (exportFormat === "json") {
      return JSON.stringify({
        track: trackData.nome,
        continent: trackData.continente,
        setup: setupValues,
        timestamp: new Date().toISOString()
      }, null, 2);
    }
  };

  const downloadSetup = () => {
    const content = exportSetup();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `setup-${trackData?.nome || 'custom'}.${exportFormat === 'json' ? 'json' : 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const quickGuides = {
    aero: [
      "+ Ala = + Velocità in curva + Grip curva",
      "- Ala = + Velocità sul dritto - Grip curva",
      "+ Gap ali = + Sovrasterzo - Stabilità",
      "- Gap ali = + Sottosterzo + Stabilità"
    ],
    trasmissione: [
      "Valori alti = Blocca diff. = + Sottosterzo + Trazione",
      "Valori bassi = Sblocca diff. = + Sovrasterzo - Trazione"
    ],
    geometria: [
      "+ Campanatura = + Grip in curva + Usura gomme",
      "- Campanatura = - Grip in curva - Usura gomme",
      "+ Convergenza = + Stabilità - Reattività",
      "- Convergenza = - Stabilità + Reattività",
      "+ Divergenza = + Stabilità in frenata + Usura - Reattività",
      "- Divergenza = - Stabilità in frenata - Usura + Reattività"
    ],
    sospensioni: [
      "+ Rigidità = + Stabilità piste lisce + Usura - Grip dossi",
      "- Rigidità = - Stabilità piste lisce - Usura + Grip dossi",
      "+ Barra = + Reattività in curva - Stabilità cambi direzione",
      "- Barra = - Reattività in curva + Stabilità cambi direzione",
      "+ Altezza = - Velocità sul dritto + Grip cordoli",
      "- Altezza = + Velocità sul dritto - Grip cordoli + Bottoming"
    ],
    freni: [
      "+ Bilanciamento = - Blocaggio post + Blocaggio ant + Sovrasterzo in ingresso",
      "- Bilanciamento = + Blocaggio post - Blocaggio ant + Sottosterzo in ingresso",
      "+ Pressione = + Potenza + Blocaggio",
      "- Pressione = - Potenza - Blocaggio"
    ],
    gomme: [
      "+ Pressione = - Usura + Velocità sul dritto - Grip curva",
      "- Pressione = - Usura + Velocità sul dritto - Grip curva"
    ]
  };

  return (
    <div className="setup-creator-container">
      {/* Left Panel */}
      <div className="setup-left-panel">
        <div className="track-selector-card">
          <div className="track-selector-title">
            🏁 Seleziona Circuito
          </div>
          <select 
            className="track-select"
            value={selectedTrack}
            onChange={(e) => setSelectedTrack(e.target.value)}
          >
            <option value="">-- Scegli una pista --</option>
            {Object.entries(TRACKS).map(([key, track]) => (
              <option key={key} value={key}>
                {CONTINENT_EMOJI[track.continente]} {track.nome}
              </option>
            ))}
          </select>

          {trackData && (
            <div className="track-info-grid">
              <div className="track-info-item">
                <div className="track-info-label">Continente</div>
                <div className="track-info-value">{trackData.continente}</div>
              </div>
              <div className="track-info-item">
                <div className="track-info-label">Circuito</div>
                <div className="track-info-value">{trackData.nome}</div>
              </div>
            </div>
          )}
        </div>

        <div className="quick-guides-card">
          <div className="quick-guide-title">
            💡 Guide Rapide
          </div>
          <div className="quick-guide-section">
            <h4>✈️ Aerodinamica</h4>
            <div className="quick-guide-tips">
              {quickGuides.aero.map((tip, i) => (
                <div key={i} className="quick-tip">{tip}</div>
              ))}
            </div>
          </div>
          <div className="quick-guide-section">
            <h4>⚙️ Trasmissione</h4>
            <div className="quick-guide-tips">
              {quickGuides.trasmissione.map((tip, i) => (
                <div key={i} className="quick-tip">{tip}</div>
              ))}
            </div>
          </div>
          <div className="quick-guide-section">
            <h4>📐 Geometria</h4>
            <div className="quick-guide-tips">
              {quickGuides.geometria.map((tip, i) => (
                <div key={i} className="quick-tip">{tip}</div>
              ))}
            </div>
          </div>
          <div className="quick-guide-section">
            <h4>🔩 Sospensioni</h4>
            <div className="quick-guide-tips">
              {quickGuides.sospensioni.map((tip, i) => (
                <div key={i} className="quick-tip">{tip}</div>
              ))}
            </div>
          </div>
          <div className="quick-guide-section">
            <h4>🛑 Freni</h4>
            <div className="quick-guide-tips">
              {quickGuides.freni.map((tip, i) => (
                <div key={i} className="quick-tip">{tip}</div>
              ))}
            </div>
          </div>
          <div className="quick-guide-section">
            <h4>🏎️ Gomme</h4>
            <div className="quick-guide-tips">
              {quickGuides.gomme.map((tip, i) => (
                <div key={i} className="quick-tip">{tip}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="setup-right-panel">
        <div className="setup-editor-header">
          <div className="setup-editor-title">
            ⚙️ Editor Setup
            {trackData && <span style={{color: '#00d4ff'}}>· {trackData.nome}</span>}
          </div>
          <div className="setup-actions">
            {trackData && (
              <>
                <button className="setup-action-btn" onClick={resetToBase}>
                  ↻ Reset
                </button>
                <button className="setup-action-btn primary" onClick={() => setShowExportModal(true)}>
                  💾 Esporta
                </button>
              </>
            )}
          </div>
        </div>

        {!selectedTrack && (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            color: '#2a3f52',
            fontSize: '13px'
          }}>
            <div style={{fontSize: '48px', marginBottom: '16px', opacity: 0.3}}>🏎️</div>
            Seleziona un circuito per iniziare a creare il tuo setup
          </div>
        )}

        {trackData && (
          <div className="setup-categories-grid">
            {/* Aerodinamica */}
            <div className="setup-category-card">
              <div className="setup-category-header">
                <div className="setup-category-title">
                  <span className="setup-category-icon">✈️</span>
                  Aerodinamica
                </div>
              </div>
              <div className="setup-category-body">
                <div className="setup-param-group">
                  <div className="setup-param-label">
                    <span className="setup-param-name">Front Wing</span>
                    <span className="setup-param-value">{setupValues.aero[0]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={setupValues.aero[0]}
                    onChange={(e) => updateSetupValue('aero', 0, e.target.value)}
                    className="setup-slider"
                  />
                  
                </div>

                <div className="setup-param-group">
                  <div className="setup-param-label">
                    <span className="setup-param-name">Rear Wing</span>
                    <span className="setup-param-value">{setupValues.aero[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={setupValues.aero[1]}
                    onChange={(e) => updateSetupValue('aero', 1, e.target.value)}
                    className="setup-slider"
                  />
                  
                </div>
              </div>
            </div>

            {/* Trasmissione */}
            <div className="setup-category-card">
              <div className="setup-category-header">
                <div className="setup-category-title">
                  <span className="setup-category-icon">⚙️</span>
                  Trasmissione
                </div>
              </div>
              <div className="setup-category-body">
                <div className="setup-param-group">
                  <div className="setup-param-label">
                    <span className="setup-param-name">Differenziale</span>
                    <span className="setup-param-value">{setupValues.trasmissione}</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={setupValues.trasmissione}
                    onChange={(e) => updateSetupValue('trasmissione', null, e.target.value)}
                    className="setup-slider"
                  />
                  
                </div>
              </div>
            </div>

            {/* Geometria */}
            <div className="setup-category-card">
              <div className="setup-category-header">
                <div className="setup-category-title">
                  <span className="setup-category-icon">📐</span>
                  Geometria
                </div>
              </div>
              <div className="setup-category-body">
                <div className="setup-multi-param">
                  <div className="setup-multi-item">
                    <div className="setup-multi-label">Camber Ant.</div>
                    <input
                      type="number"
                      step="0.1"
                      value={setupValues.geometria[0]}
                      onChange={(e) => updateSetupValue('geometria', 0, e.target.value)}
                      className="setup-multi-input"
                    />
                  </div>
                  <div className="setup-multi-item">
                    <div className="setup-multi-label">Camber Post.</div>
                    <input
                      type="number"
                      step="0.1"
                      value={setupValues.geometria[1]}
                      onChange={(e) => updateSetupValue('geometria', 1, e.target.value)}
                      className="setup-multi-input"
                    />
                  </div>
                  <div className="setup-multi-item">
                    <div className="setup-multi-label">Toe Ant.</div>
                    <input
                      type="number"
                      step="0.05"
                      value={setupValues.geometria[2]}
                      onChange={(e) => updateSetupValue('geometria', 2, e.target.value)}
                      className="setup-multi-input"
                    />
                  </div>
                  <div className="setup-multi-item">
                    <div className="setup-multi-label">Toe Post.</div>
                    <input
                      type="number"
                      step="0.05"
                      value={setupValues.geometria[3]}
                      onChange={(e) => updateSetupValue('geometria', 3, e.target.value)}
                      className="setup-multi-input"
                    />
                  </div>
                </div>
                
              </div>
            </div>

            {/* Sospensioni */}
            <div className="setup-category-card">
              <div className="setup-category-header">
                <div className="setup-category-title">
                  <span className="setup-category-icon">🔧</span>
                  Sospensioni
                </div>
              </div>
              <div className="setup-category-body">
                <div className="setup-multi-param">
                  <div className="setup-multi-item">
                    <div className="setup-multi-label">Trasm.</div>
                    <input
                      type="number"
                      value={setupValues.sosp[0]}
                      onChange={(e) => updateSetupValue('sosp', 0, e.target.value)}
                      className="setup-multi-input"
                    />
                  </div>
                  <div className="setup-multi-item">
                    <div className="setup-multi-label">S1</div>
                    <input
                      type="number"
                      value={setupValues.sosp[1]}
                      onChange={(e) => updateSetupValue('sosp', 1, e.target.value)}
                      className="setup-multi-input"
                    />
                  </div>
                  <div className="setup-multi-item">
                    <div className="setup-multi-label">S2</div>
                    <input
                      type="number"
                      value={setupValues.sosp[2]}
                      onChange={(e) => updateSetupValue('sosp', 2, e.target.value)}
                      className="setup-multi-input"
                    />
                  </div>
                  <div className="setup-multi-item">
                    <div className="setup-multi-label">S3</div>
                    <input
                      type="number"
                      value={setupValues.sosp[3]}
                      onChange={(e) => updateSetupValue('sosp', 3, e.target.value)}
                      className="setup-multi-input"
                    />
                  </div>
                  <div className="setup-multi-item">
                    <div className="setup-multi-label">S4</div>
                    <input
                      type="number"
                      value={setupValues.sosp[4]}
                      onChange={(e) => updateSetupValue('sosp', 4, e.target.value)}
                      className="setup-multi-input"
                    />
                  </div>
                  <div className="setup-multi-item">
                    <div className="setup-multi-label">S5</div>
                    <input
                      type="number"
                      value={setupValues.sosp[5]}
                      onChange={(e) => updateSetupValue('sosp', 5, e.target.value)}
                      className="setup-multi-input"
                    />
                  </div>
                </div>
                
              </div>
            </div>

            {/* Freni */}
            <div className="setup-category-card">
              <div className="setup-category-header">
                <div className="setup-category-title">
                  <span className="setup-category-icon">🛑</span>
                  Freni
                </div>
              </div>
              <div className="setup-category-body">
                <div className="setup-param-group">
                  <div className="setup-param-label">
                    <span className="setup-param-name">Bilanciamento</span>
                    <span className="setup-param-value">{setupValues.freni[0]}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="65"
                    value={setupValues.freni[0]}
                    onChange={(e) => updateSetupValue('freni', 0, e.target.value)}
                    className="setup-slider"
                  />
                </div>

                <div className="setup-param-group">
                  <div className="setup-param-label">
                    <span className="setup-param-name">Pressione</span>
                    <span className="setup-param-value">{setupValues.freni[1]}%</span>
                  </div>
                  <input
                    type="range"
                    min="80"
                    max="100"
                    value={setupValues.freni[1]}
                    onChange={(e) => updateSetupValue('freni', 1, e.target.value)}
                    className="setup-slider"
                  />
                </div>

                
              </div>
            </div>

            {/* Gomme */}
            <div className="setup-category-card">
              <div className="setup-category-header">
                <div className="setup-category-title">
                  <span className="setup-category-icon">🏎️</span>
                  Pressione Gomme
                </div>
              </div>
              <div className="setup-category-body">
                <div className="setup-multi-param">
                  <div className="setup-multi-item">
                    <div className="setup-multi-label">Ant. Sx</div>
                    <input
                      type="number"
                      step="0.5"
                      value={setupValues.gomme[0]}
                      onChange={(e) => updateSetupValue('gomme', 0, e.target.value)}
                      className="setup-multi-input"
                    />
                  </div>
                  <div className="setup-multi-item">
                    <div className="setup-multi-label">Ant. Dx</div>
                    <input
                      type="number"
                      step="0.5"
                      value={setupValues.gomme[1]}
                      onChange={(e) => updateSetupValue('gomme', 1, e.target.value)}
                      className="setup-multi-input"
                    />
                  </div>
                  <div className="setup-multi-item">
                    <div className="setup-multi-label">Post. Sx</div>
                    <input
                      type="number"
                      step="0.5"
                      value={setupValues.gomme[2]}
                      onChange={(e) => updateSetupValue('gomme', 2, e.target.value)}
                      className="setup-multi-input"
                    />
                  </div>
                  <div className="setup-multi-item">
                    <div className="setup-multi-label">Post. Dx</div>
                    <input
                      type="number"
                      step="0.5"
                      value={setupValues.gomme[3]}
                      onChange={(e) => updateSetupValue('gomme', 3, e.target.value)}
                      className="setup-multi-input"
                    />
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="export-modal-overlay" onClick={() => setShowExportModal(false)}>
          <div className="export-modal" onClick={(e) => e.stopPropagation()}>
            <div className="export-modal-header">
              <div>
                <div className="export-modal-title">Esporta Setup</div>
              </div>
              <button className="export-modal-close" onClick={() => setShowExportModal(false)}>×</button>
            </div>
            <div className="export-modal-body">
              <label className="export-format-label">Formato di esportazione:</label>
              <div className="export-formats">
                <button
                  className={`export-format-btn${exportFormat === 'text' ? ' active' : ''}`}
                  onClick={() => setExportFormat('text')}
                >
                  <div className="export-format-icon">📄</div>
                  <div className="export-format-name">Testo</div>
                </button>
                <button
                  className={`export-format-btn${exportFormat === 'json' ? ' active' : ''}`}
                  onClick={() => setExportFormat('json')}
                >
                  <div className="export-format-icon">🔧</div>
                  <div className="export-format-name">JSON</div>
                </button>
              </div>

              <div className="export-preview">
                {exportSetup()}
              </div>

              <div className="export-actions">
                <button className="export-btn" onClick={downloadSetup}>
                  💾 Scarica Setup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── COMPONENTS (Keep existing components: SeasonSelector, RaceResultsModal, LeaderboardPage, CalendarPage, CareerPage, HeadToHeadPage, RulesPage) ───

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

  const driversWithInterpole = ['Igor', 'Alex', 'Manuel'];

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
                {driversWithInterpole.includes(d.name) && (
                  <div className="career-stat-box">
                    <div className="career-stat-label">Interpole</div>
                    <div className="career-stat-val interpole">{d.totalInterpole || 0}</div>
                  </div>
                )}
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

function HeadToHeadPage({ season }) {
  const seasonData = SEASON_DATA[season];
  const DRIVER_TEAMS = getDriverTeamsForSeason(season);

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

      const poles = seasonData.driverPoles || {};
      stats1.poles = poles[driver1.name] || 0;
      stats2.poles = poles[driver2.name] || 0;

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

function RulesPage() {
  const [expandedRules, setExpandedRules] = useState([]);

  const toggleRule = (ruleId) => {
    setExpandedRules(prev => 
      prev.includes(ruleId) 
        ? prev.filter(id => id !== ruleId)
        : [...prev, ruleId]
    );
  };

  return (
    <div className="rules-grid">
      {RULES_CONFIG.map((rule, idx) => (
        <div 
          key={rule.id} 
          className={`rule-card${expandedRules.includes(rule.id) ? " expanded" : ""}`}
          style={{ animationDelay: `${idx * 0.08}s` }}
        >
          <div className="rule-header" onClick={() => toggleRule(rule.id)}>
            <div className="rule-header-left">
              <div className="rule-icon">{rule.icon}</div>
              <div className="rule-title">{rule.title}</div>
            </div>
            <div className="rule-toggle">▼</div>
          </div>
          <div className="rule-content">
            <div className="rule-content-inner">
              <div className="rule-text">
                {rule.content.map((line, i) => (
                  <div key={i} className="rule-text-item">
                    {line || <br />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
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

  const pageInfo = {
    leaderboard: { 
      title: "Classifica Generale", 
      subtitle: `${season} · ${completedRaces}/${totalRaces} gare completate` 
    },
    calendar: { 
      title: "Calendario", 
      subtitle: `${season} · ${totalRaces} gare programmate` 
    },
    h2h: { 
      title: "Head-to-Head", 
      subtitle: `${season} · Confronto compagni di squadra` 
    },
    career: { 
      title: "Statistiche Carriera", 
      subtitle: `Tutte le stagioni · Statistiche totali carriera` 
    },
    setup: { 
      title: "Setup Creator Pro", 
      subtitle: `Crea e personalizza il tuo setup perfetto` 
    },
    rules: { 
      title: "Regolamento", 
      subtitle: `Tutte le regole del campionato` 
    }
  };

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
                <h1 className="f1-title">F1 Dashboard Pro</h1>
                <span className="f1-subtitle">Advanced Setup Creator</span>
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
              <h2>{pageInfo[page].title}</h2>
              <p>{pageInfo[page].subtitle}</p>
            </div>
            {showSeasonSelector && (
              <SeasonSelector currentSeason={season} onSeasonChange={setSeason} />
            )}
          </div>

          {page === "leaderboard" && <LeaderboardPage season={season} />}
          {page === "calendar" && <CalendarPage season={season} />}
          {page === "h2h" && <HeadToHeadPage season={season} />}
          {page === "career" && <CareerPage />}
          {page === "setup" && <AdvancedSetupCreator />}
          {page === "rules" && <RulesPage />}
        </div>
      </div>
    </>
  );
}