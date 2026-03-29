import { useState, useMemo, useEffect, useRef, useCallback } from "react";

// ─── FONT LOADER ──────────────────────────────────────────────────
function useFonts() {
  useEffect(() => {
    if (document.getElementById("f1-fonts")) return;
    const link = document.createElement("link");
    link.id = "f1-fonts";
    link.href =
      "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Share+Tech+Mono&family=Rajdhani:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);
}

// ─── ANIMATED COUNTER ─────────────────────────────────────────────
function AnimatedNumber({ value, duration = 800 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    let start = null;
    const from = 0;
    const to = value;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
      setDisplay(Math.round(from + (to - from) * ease));
      if (p < 1) ref.current = requestAnimationFrame(step);
    };
    ref.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(ref.current);
  }, [value, duration]);
  return <>{display}</>;
}

// ─── SETUP DATA ───────────────────────────────────────────────────
const TRACKS = {
  australia:   { nome: "Melbourne",   aero: [23, 10], trasmissione: [100, 20], sosp: [41, 1, 12, 17, 20, 44], freni: [55, 100], geometria: [-3.50, -2.00, 0.00, 0.10], gomme: [29.5, 29.5, 26.5, 26.5], continente: "Oceania" },
  cina:        { nome: "Shanghai",    aero: [24, 21], trasmissione: [100, 20], sosp: [41, 1,  4,  8, 21, 48], freni: [55, 100], geometria: [-3.50, -2.00, 0.00, 0.10], gomme: [29.5, 29.5, 26.5, 26.5], continente: "Asia"    },
  suzuka:      { nome: "Suzuka",      aero: [31, 21], trasmissione: [100, 20], sosp: [41, 1,  6, 21, 22, 42], freni: [55, 100], geometria: [-3.50, -2.00, 0.00, 0.10], gomme: [29.5, 29.5, 26.5, 26.5], continente: "Asia"    },
  bahrain:     { nome: "Sakhir",      aero: [34, 29], trasmissione: [100, 20], sosp: [41, 10, 9, 10, 20, 40], freni: [55, 100], geometria: [-3.50, -2.00, 0.00, 0.10], gomme: [29.5, 29.5, 26.5, 26.5], continente: "Asia"    },
  jeddah:      { nome: "Jeddah",      aero: [15,  1], trasmissione: [100, 20], sosp: [41, 6,  1,  7, 18, 40], freni: [55, 100], geometria: [-3.50, -2.00, 0.00, 0.10], gomme: [29.5, 29.5, 26.5, 26.5], continente: "Asia"    },
  miami:       { nome: "Miami",       aero: [12,  4], trasmissione: [100, 20], sosp: [30, 1,  1, 17, 22, 40], freni: [55, 100], geometria: [-3.50, -2.00, 0.00, 0.10], gomme: [29.5, 29.5, 26.5, 26.5], continente: "America" },
  imola:       { nome: "Imola",       aero: [43, 37], trasmissione: [100, 20], sosp: [41, 1,  9, 21, 23, 52], freni: [55, 100], geometria: [-3.50, -2.00, 0.00, 0.10], gomme: [29.5, 29.5, 26.5, 26.5], continente: "Europa"  },
  monaco:      { nome: "Monaco",      aero: [50, 50], trasmissione: [100, 20], sosp: [41, 22, 3, 21, 19, 49], freni: [55, 100], geometria: [-3.50, -2.00, 0.00, 0.10], gomme: [29.5, 29.5, 26.5, 26.5], continente: "Europa"  },
  spagna:      { nome: "Barcellona",  aero: [41, 32], trasmissione: [100, 20], sosp: [38, 2,  6, 21, 20, 43], freni: [55, 100], geometria: [-3.50, -2.00, 0.00, 0.10], gomme: [29.5, 29.5, 26.5, 26.5], continente: "Europa"  },
  canada:      { nome: "Montreal",    aero: [35, 28], trasmissione: [100, 20], sosp: [41, 1,  1, 18, 19, 40], freni: [55, 100], geometria: [-3.50, -2.00, 0.00, 0.10], gomme: [29.5, 29.5, 26.5, 26.5], continente: "America" },
  austria:     { nome: "Spielberg",   aero: [37, 30], trasmissione: [100, 20], sosp: [41, 5,  3, 20, 20, 46], freni: [55, 100], geometria: [-3.50, -2.00, 0.00, 0.10], gomme: [29.5, 29.5, 26.5, 26.5], continente: "Europa"  },
  silverstone: { nome: "Silverstone", aero: [12,  0], trasmissione: [100, 20], sosp: [41, 1,  5, 18, 21, 40], freni: [55, 100], geometria: [-3.50, -2.00, 0.00, 0.10], gomme: [29.5, 29.5, 26.5, 26.5], continente: "Europa"  },
  spa:         { nome: "Spa",         aero: [8,   8], trasmissione: [100, 20], sosp: [41, 1,  6, 12, 20, 40], freni: [55, 100], geometria: [-3.50, -2.00, 0.00, 0.10], gomme: [29.5, 29.5, 26.5, 26.5], continente: "Europa"  },
  ungheria:    { nome: "Budapest",    aero: [50, 50], trasmissione: [100, 20], sosp: [41, 1, 10, 21, 19, 40], freni: [55, 100], geometria: [-3.50, -2.00, 0.00, 0.10], gomme: [29.5, 29.5, 26.5, 26.5], continente: "Europa"  },
  olanda:      { nome: "Zandvoort",   aero: [50, 48], trasmissione: [100, 20], sosp: [41, 1,  9, 21, 22, 40], freni: [55, 100], geometria: [-3.50, -2.00, 0.00, 0.10], gomme: [29.5, 29.5, 26.5, 26.5], continente: "Europa"  },
  monza:       { nome: "Monza",       aero: [0,   3], trasmissione: [100, 20], sosp: [41, 1,  1, 21, 21, 40], freni: [55, 100], geometria: [-3.50, -2.00, 0.00, 0.10], gomme: [29.5, 29.5, 26.5, 26.5], continente: "Europa"  },
  baku:        { nome: "Baku",        aero: [4,   1], trasmissione: [100, 20], sosp: [41, 1,  1, 19, 21, 40], freni: [55, 100], geometria: [-3.50, -2.00, 0.00, 0.10], gomme: [29.5, 29.5, 26.5, 26.5], continente: "Asia"    },
  singapore:   { nome: "Singapore",   aero: [50, 47], trasmissione: [100, 20], sosp: [41, 1, 16, 21, 20, 40], freni: [55, 100], geometria: [-3.50, -2.00, 0.00, 0.10], gomme: [29.5, 29.5, 26.5, 26.5], continente: "Asia"    },
  austin:      { nome: "Austin",      aero: [41, 34], trasmissione: [100, 20], sosp: [41, 3,  1, 21, 20, 40], freni: [55, 100], geometria: [-3.50, -2.00, 0.00, 0.10], gomme: [29.5, 29.5, 26.5, 26.5], continente: "America" },
  messico:     { nome: "Mexico City", aero: [40, 36], trasmissione: [100, 20], sosp: [32, 3,  5, 21, 23, 45], freni: [55, 100], geometria: [-3.50, -2.00, 0.00, 0.10], gomme: [29.5, 29.5, 26.5, 26.5], continente: "America" },
  brasile:     { nome: "Sao Paolo",   aero: [27, 14], trasmissione: [100, 20], sosp: [41, 5,  2, 21, 22, 41], freni: [55, 100], geometria: [-3.50, -2.00, 0.00, 0.10], gomme: [29.5, 29.5, 26.5, 26.5], continente: "America" },
  lasvegas:    { nome: "Las Vegas",   aero: [1,   0], trasmissione: [100, 20], sosp: [41, 6,  5, 21, 23, 48], freni: [55, 100], geometria: [-3.50, -2.00, 0.00, 0.10], gomme: [29.5, 29.5, 26.5, 26.5], continente: "America" },
  qatar:       { nome: "Lusail",      aero: [42, 30], trasmissione: [100, 20], sosp: [41, 3,  1, 16, 19, 45], freni: [55, 100], geometria: [-3.50, -2.00, 0.00, 0.10], gomme: [29.5, 29.5, 26.5, 26.5], continente: "Asia"    },
  abudhabi:    { nome: "Yas Marina",  aero: [29, 18], trasmissione: [100, 20], sosp: [41, 1,  1, 17, 17, 40], freni: [55, 100], geometria: [-3.50, -2.00, 0.00, 0.10], gomme: [29.5, 29.5, 26.5, 26.5], continente: "Asia"    },
};

const CONTINENTI = ["Tutti", "Europa", "Asia", "America", "Oceania"];
const CONTINENT_EMOJI = { Europa: "EU", Asia: "AS", America: "AM", Oceania: "OC" };

const RULES_CONFIG = [
  {
    id: "points", title: "Sistema di Punteggio", icon: "🏆",
    content: ["I punti vengono assegnati ai primi 10 classificati secondo lo schema standard F1:","1° posto: 25 punti","2° posto: 18 punti","3° posto: 15 punti","4° posto: 12 punti","5° posto: 10 punti","6° posto: 8 punti","7° posto: 6 punti","8° posto: 4 punti","9° posto: 2 punti","10° posto: 1 punto","","Interpole: 1 punto","Pole: 1 punto","Maggior numero di sorpassi: 1 punto","Il pilota con più punti al termine della stagione viene incoronato Campione del Mondo."]
  },
  {
    id: "qualifying and race", title: "Qualifiche e Gare", icon: "⏱️",
    content: ["Gare medie","Qualifiche complete","Le qualifiche determinano la griglia di partenza per la gara.","Il pilota più veloce ottiene la Pole Position (1° posto in griglia) e riceverà un punto aggiuntivo.","","Le pole position vengono conteggiate nelle statistiche di carriera.","Non vengono assegnati punti per le qualifiche, ma una buona posizione di partenza è fondamentale per la strategia di gara.","","Nel Q1 è possibile fare la interpole solo se si vuole, chi fa il giro più veloce con le intermedio nel Q1 prima dei 14 minuti riceverà un punto in più, solo se la condizione della pista è asciutto","","Il pilota con il maggior numero di sorpassi riceverà 1 punto"]
  },
  {
    id: "penalty", title: "Penalità e Regole", icon: "🚫",
    content: ["Ogni comportamento scorretto verrà valutato in base al danno causato al pilota coinvolto.","Ogni pilota dispone di 5 punti penalità. Al raggiungimento dei 5 punti scatterà la squalifica per una gara. I punti penalità verranno azzerati a inizio di ogni stagione.","","BRAKE CHECK:","Se il pilota danneggiato si ritira: squalifica dalla gara, +1 punto penalità.","Ala Rossa: Drive Through oppure +10/+20 secondi (a discrezione della direzione gara in base alla pista).","Ala Arancione: +5 secondi.","Ala Gialla: +3 secondi.","Ala Verde chiaro: doppio avvertimento (massimo 3). Superati i 3 avvertimenti: +3 secondi.","Nessun danno: avvertimento (massimo 3). Superati i 3 avvertimenti: +3 secondi.","","Tamponamento in entrata pit lane:","Se un pilota viene tamponato e riceve una penalità di 10 secondi, la penalità verrà trasferita al pilota responsabile del tamponamento.","La regola non si applica se il pilota tamponato effettua un brake check o rallenta/blocca volontariamente l'ingresso.","","Mandare volontariamente fuori pista un altro pilota:","Squalifica immediata dalla gara.","Ritiro del giocatore colpito: -10 posizioni in griglia, +3 punto penalità.","Se il pilota colpito subisce danni ma non si ritira: penalità in griglia per la gara successiva in base alla gravità del danno:","Danni gravi: -10 posizioni in griglia.","Danni medi: -5 posizioni in griglia.","Danni lievi o assenti: -3 posizioni in griglia.","Se il pilota colpito si ritira: squalifica anche dalla gara successiva +2 punti penalità.","","Ritiro dalla gara:","Il ritiro deve avvenire ai box utilizzando l'apposito comando.","È consentito ritirarsi in pista solo se non si arrecano danni ad altri piloti e non si provocano incidenti.","Il mancato rispetto di questa regola comporterà -5 posizioni in griglia nella gara successiva +1 punto penalità.","","Difese e attacchi illegali:","Movimento in frenata per ostacolare o spingere fuori un altro pilota: avvertimento (massimo 3). Superati i 3 avvertimenti: +3 secondi.","Zig-zag in rettilineo per impedire il sorpasso: avvertimento (massimo 3). Superati i 3 avvertimenti: +3 secondi.","Dive bomb eccessivi o irrealistici: avvertimento (massimo 3). Superati i 3 avvertimenti: +3 secondi.","Contatto volontario in rettilineo o in curva per impedire un sorpasso: avvertimento (massimo 3). Superati i 3 avvertimenti: +3 secondi.","Chiusura di traiettoria eccessivamente aggressiva con conseguente incidente: avvertimento (massimo 3). Superati i 3 avvertimenti: +3 secondi.","","Se due giocatori si toccano e il contatto può aver fatto fallire un sorpasso, chi ha causato il contatto deve dare/restituire la posizione all'altro giocatore per non avere possibili penalità dopo gara.","Se uno o entrambi i giocatori subiscono un danno, la situazione verrà valutata dopo la gara per decidere se assegnare una penalità.","","Se un pilota prende penalità e si ritira o viene squalificato senza aver scontato la penalità, gli verra assegnata una penalità nella griglia di partenza per la gara successiva a seconda della penalità","","Gli avvertimenti verranno sommati anche a quelli relativi ai track limits.","Gli incidenti tra piloti verranno riesaminati a fine gara dalla direzione gara, che deciderà eventuali penalità.","L'obiettivo è gareggiare in modo corretto, pulito e rispettoso."]
  }
];

const SEASON_DATA = {
  "Stagione 1": {
    races: [
      { race: "Australia",  results: ["Alex","Igor","Hamilton","Norris","Russell","Verstappen","Tsunoda","Antonelli","Alonso","Leclerc","Bortoleto","Albon","Hulkenberg","Gasly","Sainz","Bearman","Lawson","Piastri","Manuel","Stroll"] },
      { race: "Olanda",     results: ["Igor","Verstappen","Norris","Piastri","Hamilton","Russell","Leclerc","Antonelli","Lawson","Stroll","Bearman","Alonso","Gasly","Tsunoda","Manuel","Alex","Hulkenberg","Bortoleto","Sainz","Albon"] },
      { race: "Messico",    results: ["Alex","Verstappen","Antonelli","Norris","Alonso","Russell","Igor","Bortoleto","Hamilton","Gasly","Tsunoda","Leclerc","Bearman","Albon","Stroll","Hulkenberg","Lawson","Sainz","Piastri","Manuel"] },
      { race: "Brasile",    results: ["Alex","Manuel","Norris","Alonso","Leclerc","Piastri","Verstappen","Antonelli","Russell","Hamilton","Gasly","Hulkenberg","Bearman","Albon","Lawson","Bortoleto","Lawson","Sainz","Igor","Stroll"] },
      { race: "Qatar",      results: ["Norris","Piastri","Bortoleto","Albon","Sainz","Hamilton","Alonso","Antonelli","Manuel","Leclerc","Hulkenberg","Lawson","Gasly","Russell","Igor","Tsunoda","Verstappen","Stroll","Bearman","Alex"] },
      { race: "Singapore",  results: ["Antonelli","Verstappen","Hamilton","Piastri","Leclerc","Alonso","Bortoleto","Igor","Sainz","Stroll","Tsunoda","Russell","Norris","Alex","Lawson","Bearman","Albon","Hulkenberg","Manuel","Gasly"] },
      { race: "Monaco",     results: ["Sainz","Norris","Bortoleto","Tsunoda","Leclerc","Piastri","Albon","Hulkenberg","Manuel","Igor","Gasly","Hamilton","Verstappen","Alex","Lawson","Stroll","Russell","Antonelli","Alonso","Bearman"] },
    ],
    raceExtras: [
      { race: "Australia",  pole: null,   overtakes: null,   interpole: null    },
      { race: "Olanda",     pole: null,   overtakes: null,   interpole: null    },
      { race: "Messico",    pole: null,   overtakes: null,   interpole: null    },
      { race: "Brasile",    pole: null,   overtakes: null,   interpole: null    },
      { race: "Qatar",      pole: null,   overtakes: null,   interpole: null    },
      { race: "Singapore",  pole: null,   overtakes: null,   interpole: null    },
      { race: "Monaco",     pole: null,   overtakes: null,   interpole: null    },
    ],
    calendar: [
      { round: 1, race: "Australian GP",  city: "Melbourne",   status: "done", winner: "Alex",      raceKey: "Australia" },
      { round: 2, race: "Dutch GP",       city: "Zandvoort",   status: "done", winner: "Igor",      raceKey: "Olanda" },
      { round: 3, race: "Mexico City GP", city: "Mexico City", status: "done", winner: "Alex",      raceKey: "Messico" },
      { round: 4, race: "São Paulo GP",   city: "São Paulo",   status: "done", winner: "Alex",      raceKey: "Brasile" },
      { round: 5, race: "Qatar GP",       city: "Lusail",      status: "done", winner: "Norris",    raceKey: "Qatar" },
      { round: 6, race: "Singapore GP",   city: "Singapore",   status: "done", winner: "Antonelli", raceKey: "Singapore" },
      { round: 7, race: "Monaco GP",      city: "Monaco",      status: "done", winner: "Sainz",     raceKey: "Monaco" },
    ],
    driverPoles: { Alex: 3, Igor: 3, Norris: 1, Verstappen: 0, Hamilton: 0, Russell: 0, Piastri: 0, Antonelli: 0, Leclerc: 0, Alonso: 0, Albon: 0, Sainz: 0, Stroll: 0, Lawson: 0, Tsunoda: 0, Bearman: 0, Manuel: 0, Gasly: 0, Hulkenberg: 0, Bortoleto: 0 }
  },
  "Stagione 2": {
    races: [
      { race: "Austria",   results: ["Alex","Igor","Norris","Russell","Bortoleto","Hamilton","Antonelli","Colapinto","Sainz","Alonso","Gasly","Bearman","Hulkenberg","Lawson","Ocon","Hadjar","Verstappen","Manuel","Leclerc","Albon"] },
      { race: "Ungheria",  results: ["Norris","Alex","Verstappen","Hamilton","Alonso","Leclerc","Russell","Colapinto","Antonelli","Albon","Gasly","Bortoleto","Hulkenberg","Bearman","Hadjar","Lawson","Igor","Ocon","Manuel","Sainz"] },
      { race: "Australia", results: ["Alex","Igor","Manuel","Norris","Antonelli","Verstappen","Hamilton","Russell","Leclerc","Bortoleto","Alonso","Gasly","Colapinto","Albon","Ocon","Sainz","Bearman","Lawson","Hadjar","Hulkenberg"] },
      { race: "Abu Dhabi", results: ["Alex","Igor","Norris","Colapinto","Hamilton","Russell","Alonso","Antonelli","Verstappen","Leclerc","Albon","Sainz","Ocon","Hulkenberg","Bearman","Bortoleto","Gasly","Hadjar","Lawson","Manuel"] },
      { race: "Olanda",    results: ["Igor","Alex","Antonelli","Russell","Albon","Leclerc","Norris","Sainz","Hamilton","Hulkenberg","Alonso","Lawson","Bortoleto","Bearman","Verstappen","Ocon","Colapinto","Hadjar","Gasly","Manuel"] },
      { race: "Jeddah",    results: ["Alex","Igor","Norris","Manuel","Antonelli","Russell","Leclerc","Bortoleto","Colapinto","Gasly","Hamilton","Albon","Bearman","Alonso","Hulkenberg","Ocon","Lawson","Sainz","Hadjar","Verstappen"] },
      { race: "Qatar",     results: ["Alex","Verstappen","Igor","Hamilton","Norris","Leclerc","Antonelli","Alonso","Colapinto","Ocon","Russell","Albon","Bortoleto","Hadjar","Gasly","Lawson","Hulkenberg","Sainz","Manuel","Bearman"] }
    ],
    raceExtras: [
      { race: "Austria",   pole: "Igor",      overtakes: "Antonelli", interpole: "Manuel" },
      { race: "Ungheria",  pole: "Alex",      overtakes: "Alex",      interpole: "Igor"   },
      { race: "Australia", pole: "Alex",      overtakes: "Igor",      interpole: "Alex"   },
      { race: "Abu Dhabi", pole: "Igor",      overtakes: "Igor",      interpole: "Alex"   },
      { race: "Olanda",    pole: "Norris",    overtakes: "Antonelli", interpole: null     },
      { race: "Jeddah",    pole: "Igor",      overtakes: "Manuel",    interpole: null     },
      { race: "Qatar",     pole: "Alex",      overtakes: "Igor",      interpole: "Alex"   },
    ],
    calendar: [
      { round: 1, race: "Austrian GP",      city: "Red Bull Ring", status: "done",     winner: "Alex",     raceKey: "Austria"   },
      { round: 2, race: "Hungary GP",       city: "Hungaroring",   status: "done",     winner: "Norris",   raceKey: "Ungheria"  },
      { round: 3, race: "Australian GP",    city: "Melbourne",     status: "done",     winner: "Alex",     raceKey: "Australia" },
      { round: 4, race: "Abu Dhabi GP",     city: "Yas Marina",    status: "done",     winner: "Alex",     raceKey: "Abu Dhabi" },
      { round: 5, race: "Dutch GP",         city: "Zandvoort",     status: "done",     winner: "Igor",     raceKey: "Olanda"    },
      { round: 6, race: "Saudi Arabian GP", city: "Jeddah",        status: "done",     winner: "Alex",     raceKey: "Jeddah"    },
      { round: 7, race: "Qatar GP",         city: "Lusail",        status: "done",     winner: "Alex",     raceKey: "Qatar"     },
    ],
    driverPoles: { Alex: 3, Igor: 3, Norris: 1, Verstappen: 0, Hamilton: 0, Russell: 0, Ocon: 0, Antonelli: 0, Leclerc: 0, Alonso: 0, Albon: 0, Sainz: 0, Colapinto: 0, Lawson: 0, Hadjar: 0, Bearman: 0, Manuel: 0, Gasly: 0, Hulkenberg: 0, Bortoleto: 0 }
  },
  "Stagione 3": {
    races: [
      { race: "Spa",       results: ["Igor","Alex","Antonelli","Piastri","Verstappen","Manuel","Colapinto","Gasly","Ocon","Russell","Albon","Hulkenberg","Alonso","Bortoleto","Lawson","Tsunoda","Leclerc","Bearman","Hadjar","Sainz"] },
      { race: "Ungheria",  results: [] },
      { race: "Austin",    results: [] },
      { race: "Australia", results: [] },
      { race: "Cina",      results: [] },
      { race: "Giappone",  results: [] },
      { race: "Olanda",    results: [] },
    ],
    raceExtras: [
      { race: "Spa",       pole: "Igor", overtakes: "Alex", fastest: "Igor", loyal: "Manuel" },
      { race: "Ungheria",  pole: null,   overtakes: null,   fastest: null,   loyal: null },
      { race: "Austin",    pole: null,   overtakes: null,   fastest: null,   loyal: null },
      { race: "Australia", pole: null,   overtakes: null,   fastest: null,   loyal: null },
      { race: "Cina",      pole: null,   overtakes: null,   fastest: null,   loyal: null },
      { race: "Giappone",  pole: null,   overtakes: null,   fastest: null,   loyal: null },
      { race: "Olanda",    pole: null,   overtakes: null,   fastest: null,   loyal: null },
    ],
    calendar: [
      { round: 1, race: "Belgium GP",    city: "Spa-Francochamps", status: "done",     winner: "Igor", raceKey: "Spa" },
      { round: 2, race: "Hungary GP",    city: "Hungaroring",      status: "upcoming", winner: "...",  raceKey: null },
      { round: 3, race: "Texas GP",      city: "Austin",           status: "upcoming", winner: "...",  raceKey: null },
      { round: 4, race: "Australian GP", city: "Melbourne",        status: "upcoming", winner: "...",  raceKey: null },
      { round: 5, race: "Chinese GP",    city: "Shanghai",         status: "upcoming", winner: "...",  raceKey: null },
      { round: 6, race: "Japan GP",      city: "Suzuka",           status: "upcoming", winner: "...",  raceKey: null },
      { round: 7, race: "Dutch GP",      city: "Zandvoort",        status: "upcoming", winner: "...",  raceKey: null },
    ],
    driverPoles: { Alex: 0, Igor: 1, Norris: 0, Verstappen: 0, Hamilton: 0, Russell: 0, Piastri: 0, Antonelli: 0, Leclerc: 0, Alonso: 0, Albon: 0, Sainz: 0, Stroll: 0, Lawson: 0, Tsunoda: 0, Bearman: 0, Manuel: 0, Gasly: 0, Hulkenberg: 0, Bortoleto: 0 }
  }
};

const POINTS_TABLE = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

const DRIVER_TEAMS_BASE = {
  Piastri:    { team: "McLaren",          num: 81, flag: "🇦🇺" },
  Norris:     { team: "McLaren",          num: 4,  flag: "🇬🇧" },
  Verstappen: { team: "Red Bull",         num: 1,  flag: "🇳🇱" },
  Tsunoda:    { team: "Red Bull",         num: 22, flag: "🇯🇵" },
  Russell:    { team: "Mercedes",         num: 63, flag: "🇬🇧" },
  Antonelli:  { team: "Mercedes",         num: 12, flag: "🇮🇹" },
  Leclerc:    { team: "Ferrari",          num: 16, flag: "🇲🇨" },
  Hamilton:   { team: "Ferrari",          num: 44, flag: "🇬🇧" },
  Albon:      { team: "Williams",         num: 23, flag: "🇹🇭" },
  Sainz:      { team: "Williams",         num: 55, flag: "🇪🇸" },
  Alonso:     { team: "Aston Martin",     num: 14, flag: "🇪🇸" },
  Stroll:     { team: "Aston Martin",     num: 18, flag: "🇨🇦" },
  Lawson:     { team: "Visa Cash App RB", num: 40, flag: "🇳🇿" },
  Igor:       { team: "Visa Cash App RB", num: 92, flag: "🇮🇹" },
  Bearman:    { team: "Haas",             num: 87, flag: "🇬🇧" },
  Manuel:     { team: "Haas",             num: 95, flag: "🇮🇹" },
  Gasly:      { team: "Alpine",           num: 10, flag: "🇫🇷" },
  Alex:       { team: "Alpine",           num: 99, flag: "🇮🇹" },
  Hulkenberg: { team: "Sauber",           num: 27, flag: "🇩🇪" },
  Bortoleto:  { team: "Sauber",           num: 5,  flag: "🇧🇷" },
  Ocon:       { team: "No Seat",          num: 31, flag: "🇫🇷" },
  Colapinto:  { team: "No Seat",          num: 43, flag: "🇦🇷" },
  Hadjar:     { team: "No Seat",          num: 6,  flag: "🇫🇷" },
};

const TEAM_CHANGES = {
  "Stagione 2": {
    Alex:      { team: "McLaren",          num: 99 },
    Igor:      { team: "Red Bull",         num: 92 },
    Piastri:   { team: "No Seat",          num: 81 },
    Manuel:    { team: "Aston Martin",     num: 95 },
    Stroll:    { team: "No Seat",          num: 18 },
    Tsunoda:   { team: "No Seat",          num: 22 },
    Ocon:      { team: "Haas",             num: 31 },
    Colapinto: { team: "Alpine",           num: 43 },
    Hadjar:    { team: "Visa Cash App RB", num: 6  },
    Norris:    { num: 1 },
    Verstappen:{ num: 3 },
  },
  "Stagione 3": {
    Alex:      { team: "Ferrari",          num: 1  },
    Igor:      { team: "McLaren",          num: 92 },
    Tsunoda:   { team: "Red Bull",         num: 22 },
    Hamilton:  { team: "No Seat",          num: 44 },
    Piastri:   { team: "McLaren",          num: 81 },
    Norris:    { team: "No Seat",          num: 4  },
    Hadjar:    { team: "Visa Cash App RB", num: 6  },
    Colapinto: { team: "Alpine",           num: 43 },
    Manuel:    { team: "Aston Martin",     num: 95 },
    Stroll:    { team: "No Seat",          num: 18 },
    Ocon:      { team: "Haas",             num: 31 }
  }
};

function getDriverTeamsForSeason(season) {
  const changes = TEAM_CHANGES[season] || {};
  return Object.keys(DRIVER_TEAMS_BASE).reduce((acc, driver) => {
    acc[driver] = { ...DRIVER_TEAMS_BASE[driver], ...(changes[driver] || {}) };
    return acc;
  }, {});
}

const TEAM_COLORS = {
  "McLaren":          "#FF8000",
  "Red Bull":         "#3070ca",
  "Mercedes":         "#a1a1a1",
  "Ferrari":          "#f10030",
  "Williams":         "#171bff",
  "Aston Martin":     "#228b6f",
  "Visa Cash App RB": "#4460ff",
  "Haas":             "#999999",
  "Alpine":           "#3de2ff",
  "Sauber":           "#31ff31",
};

function computeBonusPoints(raceExtras, driverName) {
  let pole = 0, overtakes = 0, interpole = 0, fastest = 0, loyal = 0;
  raceExtras.forEach(extra => {
    if (extra.pole       === driverName) pole++;
    if (extra.overtakes  === driverName) overtakes++;
    if (extra.interpole  === driverName) interpole++;
    if (extra.fastest    === driverName) fastest++;
    if (extra.loyal      === driverName) loyal++;
  });
  return { pole, overtakes, interpole, fastest, loyal, total: pole + overtakes + interpole + fastest + loyal };
}

function computeDriverStandings(raceResults, raceExtras, season) {
  const DRIVER_TEAMS = getDriverTeamsForSeason(season);
  const pts = {}, wins = {}, podiums = {};
  raceResults.forEach(({ results }) => {
    results.forEach((d, i) => {
      if (i >= POINTS_TABLE.length) return;
      pts[d] = (pts[d] || 0) + POINTS_TABLE[i];
      if (i === 0) wins[d] = (wins[d] || 0) + 1;
      if (i < 3)  podiums[d] = (podiums[d] || 0) + 1;
    });
  });
  return Object.keys(DRIVER_TEAMS)
    .filter(name => DRIVER_TEAMS[name].team !== "No Seat")
    .map((name) => {
      const bonus = computeBonusPoints(raceExtras, name);
      const racePts = pts[name] || 0;
      return { name, points: racePts + bonus.total, racePoints: racePts, bonusPole: bonus.pole, bonusOvertakes: bonus.overtakes, bonusInterpole: bonus.interpole, bonusTotal: bonus.total, wins: wins[name] || 0, podiums: podiums[name] || 0, wdc: 0, ...DRIVER_TEAMS[name] };
    })
    .sort((a, b) => b.points - a.points || b.wins - a.wins);
}

function computeTeamStandings(raceResults, raceExtras, season) {
  const DRIVER_TEAMS = getDriverTeamsForSeason(season);
  const teams = {};
  Object.values(DRIVER_TEAMS).forEach(driver => {
    if (driver.team !== "No Seat" && !teams[driver.team]) teams[driver.team] = { points: 0, wins: 0, poles: 0, wcc: 0 };
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
  Object.keys(DRIVER_TEAMS).forEach(driverName => {
    const info = DRIVER_TEAMS[driverName];
    if (!info || info.team === "No Seat") return;
    const bonus = computeBonusPoints(raceExtras, driverName);
    if (teams[info.team]) teams[info.team].points += bonus.total;
  });
  return Object.entries(teams).map(([team, data]) => ({ team, ...data })).sort((a, b) => b.points - a.points);
}

const SEASONS = ["Stagione 1", "Stagione 2", "Stagione 3"];

const CAREER_STATS = {
  Piastri:    { totalPoints: 70,  totalWins: 0, totalPoles: 0, totalPodiums: 1,  HatTrick: 0, GrandSlam: 0, championships: 0, constructorchamp: 1 },
  Norris:     { totalPoints: 196, totalWins: 2, totalPoles: 2, totalPodiums: 7,  HatTrick: 0, GrandSlam: 0, championships: 1, constructorchamp: 2 },
  Verstappen: { totalPoints: 121, totalWins: 0, totalPoles: 0, totalPodiums: 4,  HatTrick: 0, GrandSlam: 0, championships: 0, constructorchamp: 0 },
  Tsunoda:    { totalPoints: 16,  totalWins: 0, totalPoles: 0, totalPodiums: 0,  HatTrick: 0, GrandSlam: 0, championships: 0, constructorchamp: 0 },
  Russell:    { totalPoints: 79,  totalWins: 0, totalPoles: 0, totalPodiums: 0,  HatTrick: 0, GrandSlam: 0, championships: 0, constructorchamp: 0 },
  Antonelli:  { totalPoints: 126, totalWins: 1, totalPoles: 0, totalPodiums: 4,  HatTrick: 0, GrandSlam: 0, championships: 0, constructorchamp: 0 },
  Leclerc:    { totalPoints: 71,  totalWins: 0, totalPoles: 0, totalPodiums: 0,  HatTrick: 0, GrandSlam: 0, championships: 0, constructorchamp: 0 },
  Hamilton:   { totalPoints: 101, totalWins: 0, totalPoles: 0, totalPodiums: 2,  HatTrick: 0, GrandSlam: 0, championships: 0, constructorchamp: 0 },
  Albon:      { totalPoints: 29,  totalWins: 0, totalPoles: 0, totalPodiums: 0,  HatTrick: 0, GrandSlam: 0, championships: 0, constructorchamp: 0 },
  Sainz:      { totalPoints: 44,  totalWins: 1, totalPoles: 0, totalPodiums: 1,  HatTrick: 0, GrandSlam: 0, championships: 0, constructorchamp: 0 },
  Alonso:     { totalPoints: 59,  totalWins: 0, totalPoles: 0, totalPodiums: 0,  HatTrick: 0, GrandSlam: 0, championships: 0, constructorchamp: 0 },
  Stroll:     { totalPoints: 2,   totalWins: 0, totalPoles: 0, totalPodiums: 0,  HatTrick: 0, GrandSlam: 0, championships: 0, constructorchamp: 0 },
  Lawson:     { totalPoints: 2,   totalWins: 0, totalPoles: 0, totalPodiums: 0,  HatTrick: 0, GrandSlam: 0, championships: 0, constructorchamp: 0 },
  Igor:       { totalPoints: 166, totalWins: 3, totalPoles: 7, totalPodiums: 9,  HatTrick: 0, GrandSlam: 1, championships: 0, constructorchamp: 0, totalInterpole: 1 },
  Bearman:    { totalPoints: 0,   totalWins: 0, totalPoles: 0, totalPodiums: 0,  HatTrick: 0, GrandSlam: 0, championships: 0, constructorchamp: 0 },
  Manuel:     { totalPoints: 48,  totalWins: 0, totalPoles: 0, totalPodiums: 2,  HatTrick: 0, GrandSlam: 0, championships: 0, constructorchamp: 0, totalInterpole: 1 },
  Gasly:      { totalPoints: 6,   totalWins: 0, totalPoles: 0, totalPodiums: 0,  HatTrick: 0, GrandSlam: 0, championships: 0, constructorchamp: 0 },
  Alex:       { totalPoints: 262, totalWins: 6, totalPoles: 6, totalPodiums: 11, HatTrick: 0, GrandSlam: 2, championships: 1, constructorchamp: 1, totalInterpole: 3 },
  Hulkenberg: { totalPoints: 5,   totalWins: 0, totalPoles: 0, totalPodiums: 0,  HatTrick: 0, GrandSlam: 0, championships: 0, constructorchamp: 0 },
  Bortoleto:  { totalPoints: 55,  totalWins: 0, totalPoles: 0, totalPodiums: 2,  HatTrick: 0, GrandSlam: 0, championships: 0, constructorchamp: 0 },
  Colapinto:  { totalPoints: 30,  totalWins: 0, totalPoles: 0, totalPodiums: 0,  HatTrick: 0, GrandSlam: 0, championships: 0, constructorchamp: 0 },
  Ocon:       { totalPoints: 3,   totalWins: 0, totalPoles: 0, totalPodiums: 0,  HatTrick: 0, GrandSlam: 0, championships: 0, constructorchamp: 0 },
  Hadjar:     { totalPoints: 0,   totalWins: 0, totalPoles: 0, totalPodiums: 0,  HatTrick: 0, GrandSlam: 0, championships: 0, constructorchamp: 0 },
};

const TEAM_CAREER_STATS = {
  "McLaren":          { totalPoints: 442, totalWins: 7, totalPoles: 7, championships: 2, driverchamp: 2 },
  "Red Bull":         { totalPoints: 251, totalWins: 1, totalPoles: 6, championships: 0, driverchamp: 0 },
  "Mercedes":         { totalPoints: 205, totalWins: 1, totalPoles: 0, championships: 0, driverchamp: 0 },
  "Ferrari":          { totalPoints: 190, totalWins: 0, totalPoles: 0, championships: 0, driverchamp: 0 },
  "Williams":         { totalPoints: 72,  totalWins: 1, totalPoles: 0, championships: 0, driverchamp: 0 },
  "Aston Martin":     { totalPoints: 96,  totalWins: 0, totalPoles: 0, championships: 0, driverchamp: 0 },
  "Visa Cash App RB": { totalPoints: 56,  totalWins: 1, totalPoles: 3, championships: 0, driverchamp: 0 },
  "Haas":             { totalPoints: 25,  totalWins: 0, totalPoles: 0, championships: 0, driverchamp: 0 },
  "Alpine":           { totalPoints: 111, totalWins: 3, totalPoles: 3, championships: 0, driverchamp: 0 },
  "Sauber":           { totalPoints: 60,  totalWins: 0, totalPoles: 0, championships: 0, driverchamp: 0 },
};

const NAV = [
  { id: "leaderboard", label: "Classifica", icon: "🏆" },
  { id: "calendar",    label: "Calendario", icon: "📅" },
  { id: "h2h",         label: "H2H",        icon: "⚔️" },
  { id: "career",      label: "Carriera",   icon: "🏁" },
  { id: "setup",       label: "Setup",      icon: "⚙️" },
  { id: "rules",       label: "Regole",     icon: "📋" },
];

// ─── MASTER CSS ───────────────────────────────────────────────────
const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes pulse-dot {
    0%, 100% { opacity: 1; box-shadow: 0 0 6px #e8001d, 0 0 12px rgba(232,0,29,0.4); }
    50%       { opacity: 0.4; box-shadow: 0 0 2px #e8001d; }
  }
  @keyframes scanline {
    0%   { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-24px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideInUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes modalIn {
    from { opacity: 0; transform: scale(0.92) translateY(16px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes glowPulse {
    0%, 100% { box-shadow: 0 0 8px var(--glow), 0 0 20px rgba(var(--glow-rgb), 0.2); }
    50%       { box-shadow: 0 0 16px var(--glow), 0 0 40px rgba(var(--glow-rgb), 0.35); }
  }
  @keyframes stripeScroll {
    from { background-position: 0 0; }
    to   { background-position: 60px 0; }
  }
  @keyframes rowIn {
    from { opacity: 0; transform: translateX(-12px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes ringSpin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes barFill {
    from { width: 0%; }
    to   { width: var(--w); }
  }
  @keyframes haloIn {
    from { opacity: 0; transform: scale(0.8); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes ticker {
    from { transform: translateX(100%); }
    to   { transform: translateX(-100%); }
  }

  /* ── Root ─────────────────────────────────────────────────── */
  :root {
    --red:    #e8001d;
    --cyan:   #00d4ff;
    --gold:   #FFD700;
    --silver: #C0C0C0;
    --bronze: #CD7F32;
    --bg0:    #030508;
    --bg1:    #080c14;
    --bg2:    #0d1421;
    --bg3:    #121a2b;
    --border: rgba(255,255,255,0.06);
    --text:   #c8d6e0;
    --muted:  #3d5a6e;
    --dim:    #1e3040;
  }

  .f1-root {
    min-height: 100vh;
    background: var(--bg0);
    color: var(--text);
    font-family: 'Rajdhani', sans-serif;
    position: relative;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
  }

  /* Subtle noise texture overlay */
  .f1-root::before {
    content: '';
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    background-size: 256px;
    opacity: 0.35;
  }

  /* Grid background */
  .f1-grid-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(0,212,255,0.022) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,212,255,0.022) 1px, transparent 1px);
    background-size: 56px 56px;
  }

  /* Diagonal accent lines */
  .f1-accent-lines {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background: repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 48px,
      rgba(232,0,29,0.012) 48px,
      rgba(232,0,29,0.012) 49px
    );
  }

  /* Radial vignette */
  .f1-vignette {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background: radial-gradient(ellipse 90% 70% at 50% 35%, transparent 30%, rgba(3,5,8,0.7) 100%);
  }

  /* Scanline effect */
  .f1-scanline {
    position: fixed; left: 0; right: 0; height: 2px; top: 0;
    background: linear-gradient(90deg, transparent, rgba(0,212,255,0.06), transparent);
    pointer-events: none; z-index: 1;
    animation: scanline 8s linear infinite;
  }

  /* ── Header ─────────────────────────────────────────────── */
  .f1-header {
    position: relative; z-index: 10;
    background: linear-gradient(180deg, rgba(8,12,20,0.98) 0%, rgba(3,5,8,0.95) 100%);
    border-bottom: 1px solid var(--border);
    backdrop-filter: blur(20px);
  }
  .f1-header::after {
    content: '';
    position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--red), var(--cyan), var(--red), transparent);
    opacity: 0.4;
  }

  .f1-header-top {
    padding: 14px 20px 0;
    max-width: 1440px; margin: 0 auto;
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 8px;
  }

  .f1-logo-area { display: flex; align-items: center; gap: 14px; }

  /* Racing stripes accent */
  .f1-stripes {
    display: flex; gap: 3px; align-items: stretch; height: 34px;
  }
  .f1-stripe {
    width: 4px; border-radius: 2px;
  }
  .f1-stripe:nth-child(1) { background: var(--red); opacity: 0.9; }
  .f1-stripe:nth-child(2) { background: var(--red); opacity: 0.5; }
  .f1-stripe:nth-child(3) { background: var(--cyan); opacity: 0.7; }

  .f1-logo-text { }
  .f1-status { display: flex; align-items: center; gap: 7px; margin-bottom: 3px; }
  .f1-status-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--red);
    animation: pulse-dot 2s ease-in-out infinite;
    flex-shrink: 0;
  }
  .f1-status-label {
    font-size: 9px; color: var(--red);
    text-transform: uppercase; letter-spacing: 3px; font-weight: 600;
    font-family: 'Share Tech Mono', monospace;
  }
  .f1-title-row { display: flex; align-items: baseline; gap: 10px; }
  .f1-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 20px; font-weight: 900; color: #fff;
    letter-spacing: -0.5px;
    background: linear-gradient(135deg, #fff 0%, rgba(200,214,224,0.85) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .f1-subtitle {
    font-size: 9px; color: var(--dim);
    font-family: 'Share Tech Mono', monospace;
    letter-spacing: 0.5px;
  }

  /* ── Nav ─────────────────────────────────────────────────── */
  .f1-nav {
    display: flex; gap: 1px;
    padding: 12px 20px 0;
    max-width: 1440px; margin: 0 auto;
    overflow-x: auto; -webkit-overflow-scrolling: touch;
    scrollbar-width: none; -ms-overflow-style: none;
  }
  .f1-nav::-webkit-scrollbar { display: none; }
  .f1-nav-btn {
    position: relative;
    padding: 9px 18px 10px;
    background: transparent; border: none; border-bottom: 2px solid transparent;
    color: var(--muted);
    font-family: 'Rajdhani', sans-serif; font-size: 12px; font-weight: 600;
    letter-spacing: 1.2px; text-transform: uppercase; cursor: pointer;
    transition: color 0.2s, border-color 0.2s;
    border-radius: 6px 6px 0 0; white-space: nowrap; flex-shrink: 0;
    overflow: hidden;
  }
  .f1-nav-btn::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 50% 100%, rgba(232,0,29,0.1) 0%, transparent 70%);
    opacity: 0; transition: opacity 0.25s;
  }
  .f1-nav-btn:hover { color: #8aacbe; }
  .f1-nav-btn:hover::before { opacity: 1; }
  .f1-nav-btn.active {
    color: #fff; border-bottom-color: var(--red);
  }
  .f1-nav-btn.active::before { opacity: 1; }
  .f1-nav-icon { margin-right: 5px; font-size: 11px; }

  /* ── Page ─────────────────────────────────────────────────── */
  .f1-page {
    position: relative; z-index: 1;
    padding: 20px 16px 56px;
    max-width: 1440px; margin: 0 auto; width: 100%;
    flex: 1;
  }

  .page-enter { animation: slideInUp 0.3s cubic-bezier(.4,0,.2,1) both; }

  .page-header {
    margin-bottom: 20px;
    display: flex; align-items: flex-start; justify-content: space-between;
    flex-wrap: wrap; gap: 12px;
  }
  .page-header-left h2 {
    font-family: 'Orbitron', sans-serif; font-size: 15px; font-weight: 700;
    color: #e8ecf0; letter-spacing: 0.3px; margin-bottom: 4px;
  }
  .page-header-left p { font-size: 11px; color: var(--dim); letter-spacing: 0.5px; font-family: 'Share Tech Mono', monospace; }

  /* ── Season Selector ──────────────────────────────────────── */
  .season-selector { position: relative; }
  .season-btn {
    padding: 8px 14px; background: var(--bg2);
    border: 1px solid var(--border); border-radius: 8px;
    color: var(--text); font-family: 'Rajdhani', sans-serif;
    font-size: 12px; font-weight: 600; letter-spacing: 0.5px;
    cursor: pointer; display: flex; align-items: center; gap: 8px;
    transition: all 0.2s;
  }
  .season-btn:hover, .season-btn.open {
    border-color: rgba(232,0,29,0.4);
    background: rgba(232,0,29,0.06);
    color: #fff;
  }
  .season-btn-chevron { font-size: 8px; transition: transform 0.25s; }
  .season-btn.open .season-btn-chevron { transform: rotate(180deg); }
  .season-dropdown {
    position: absolute; top: calc(100% + 6px); right: 0;
    background: var(--bg2); border: 1px solid var(--border); border-radius: 9px;
    overflow: hidden; min-width: 160px;
    box-shadow: 0 12px 32px rgba(0,0,0,0.5); z-index: 100;
    animation: slideInUp 0.18s ease;
  }
  .season-option {
    padding: 10px 16px; font-size: 12px; font-weight: 600;
    color: var(--text); cursor: pointer;
    transition: background 0.15s, color 0.15s;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    font-family: 'Rajdhani', sans-serif; letter-spacing: 0.3px;
  }
  .season-option:last-child { border-bottom: none; }
  .season-option:hover { background: rgba(232,0,29,0.08); color: #fff; }
  .season-option.active { color: var(--red); background: rgba(232,0,29,0.1); }

  /* ═══ LEADERBOARD ════════════════════════════════════════════ */
  .lb-tabs { display: flex; gap: 8px; margin-bottom: 16px; }
  .lb-tab {
    padding: 8px 20px; border-radius: 7px;
    background: transparent; border: 1px solid var(--border);
    color: var(--muted); font-family: 'Rajdhani', sans-serif;
    font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;
    cursor: pointer; transition: all 0.2s;
  }
  .lb-tab:hover { border-color: rgba(255,255,255,0.12); color: var(--text); }
  .lb-tab.active {
    background: rgba(232,0,29,0.1);
    border-color: rgba(232,0,29,0.4); color: var(--red);
  }

  /* ── List container ── */
  .lb-list {
    border-radius: 12px; border: 1px solid var(--border);
    overflow: hidden; box-shadow: 0 4px 40px rgba(0,0,0,0.3);
  }

  /* Header: # | Pilota | V | Podi | Pole | Punti */
  .lb-list-header {
    display: grid;
    grid-template-columns: 52px 1fr 40px 40px 40px 90px;
    padding: 9px 16px;
    background: var(--bg2); border-bottom: 1px solid var(--border);
    align-items: center;
  }
  .lb-list-header span {
    font-size: 8px; color: var(--dim);
    text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;
    font-family: 'Share Tech Mono', monospace;
  }
  .lb-list-header span:nth-child(3),
  .lb-list-header span:nth-child(4),
  .lb-list-header span:nth-child(5) { text-align: center; }
  .lb-list-header span:last-child { text-align: right; }

  /* Row: same grid */
  .lb-row {
    display: grid;
    grid-template-columns: 52px 1fr 40px 40px 40px 90px;
    align-items: center;
    padding: 11px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    background: var(--bg1);
    transition: background 0.18s;
    animation: rowIn 0.35s cubic-bezier(.4,0,.2,1) both;
  }
  .lb-row:last-child { border-bottom: none; }
  .lb-row:hover { background: rgba(255,255,255,0.025); }
  .lb-row.rank-1 { background: linear-gradient(90deg, rgba(255,215,0,0.055) 0%, var(--bg1) 50%); }
  .lb-row.rank-2 { background: linear-gradient(90deg, rgba(192,192,192,0.035) 0%, var(--bg1) 50%); }
  .lb-row.rank-3 { background: linear-gradient(90deg, rgba(205,127,50,0.035) 0%, var(--bg1) 50%); }

  /* ── POSITION BADGE (the "before" style, enhanced) ── */
  .lb-pos-wrap {
    display: flex; align-items: center; justify-content: center;
  }
  .lb-pos {
    font-family: 'Orbitron', sans-serif; font-size: 13px; font-weight: 900;
    width: 34px; height: 34px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    color: var(--muted);
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    letter-spacing: -0.5px;
    transition: all 0.2s;
  }
  .lb-pos.p1 {
    color: #000;
    background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
    border-color: #FFD700;
    box-shadow: 0 0 14px rgba(255,215,0,0.4), 0 2px 6px rgba(0,0,0,0.4);
    font-size: 14px;
  }
  .lb-pos.p2 {
    color: #000;
    background: linear-gradient(135deg, #E8E8E8 0%, #A8A8A8 100%);
    border-color: #C0C0C0;
    box-shadow: 0 0 10px rgba(192,192,192,0.3), 0 2px 6px rgba(0,0,0,0.3);
  }
  .lb-pos.p3 {
    color: #000;
    background: linear-gradient(135deg, #D4905A 0%, #A0522D 100%);
    border-color: #CD7F32;
    box-shadow: 0 0 10px rgba(205,127,50,0.3), 0 2px 6px rgba(0,0,0,0.3);
  }

  /* Driver cell */
  .lb-driver-cell { display: flex; align-items: center; gap: 10px; min-width: 0; }
  .lb-team-bar {
    width: 3px; min-width: 3px; height: 36px; border-radius: 2px; flex-shrink: 0;
  }
  .lb-driver-info { min-width: 0; flex: 1; }
  .lb-driver-name {
    font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: 700;
    color: #e8ecf0; letter-spacing: 0.1px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .lb-driver-meta { display: flex; align-items: center; gap: 5px; margin-top: 2px; flex-wrap: wrap; }
  .lb-driver-team { font-size: 9px; color: var(--muted); font-family: 'Share Tech Mono', monospace; white-space: nowrap; }
  .lb-driver-num  { font-size: 8px; color: var(--dim); font-family: 'Orbitron', sans-serif; }

  /* Bonus badges */
  .lb-bonus-row { display: flex; align-items: center; gap: 3px; flex-wrap: wrap; margin-top: 3px; }
  .lb-bonus-badge {
    display: inline-flex; align-items: center; gap: 2px;
    padding: 1px 5px; border-radius: 3px;
    font-size: 7.5px; font-weight: 700; letter-spacing: 0.3px;
    font-family: 'Share Tech Mono', monospace; white-space: nowrap;
  }
  .lb-bonus-badge.pole      { background: rgba(0,212,255,0.1); color: var(--cyan); border: 1px solid rgba(0,212,255,0.2); }
  .lb-bonus-badge.overtakes { background: rgba(255,128,0,0.1); color: #FF8000;     border: 1px solid rgba(255,128,0,0.2); }
  .lb-bonus-badge.interpole { background: rgba(0,168,22,0.1);  color: #00c820;     border: 1px solid rgba(0,168,22,0.2);  }

  /* Race result toggle */
  .lb-race-toggle {
    font-size: 9px; color: var(--dim); cursor: pointer;
    background: none; border: none; font-family: 'Share Tech Mono', monospace;
    letter-spacing: 0.5px; padding: 0; transition: color 0.2s; margin-top: 3px;
    display: block;
  }
  .lb-race-toggle:hover { color: var(--cyan); }
  .lb-race-list {
    overflow: hidden; max-height: 0; opacity: 0;
    transition: max-height 0.4s cubic-bezier(.4,0,.2,1), opacity 0.3s;
    margin-top: 2px;
  }
  .lb-race-list.open { max-height: 700px; opacity: 1; }
  .lb-race-item {
    display: flex; align-items: center; justify-content: space-between;
    padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,0.04);
    font-size: 9.5px;
  }
  .lb-race-item:last-child { border-bottom: none; }
  .lb-race-item-name { color: var(--muted); }
  .lb-race-item-pos  { color: var(--text); font-family: 'Orbitron', sans-serif; font-size: 9px; flex-shrink: 0; margin-left: 8px; }

  /* Stat cells (V, Podi, Pole) */
  .lb-stat {
    font-size: 14px; font-weight: 900; text-align: center;
    color: var(--muted); font-family: 'Orbitron', sans-serif;
    display: flex; align-items: center; justify-content: center;
  }
  .lb-stat.wins-col    { color: var(--gold); }
  .lb-stat.podiums-col { color: var(--bronze); }
  .lb-stat.poles-col   { color: var(--cyan); }
  .lb-stat.zero        { color: var(--dim); font-size: 12px; font-weight: 600; }

  /* Points */
  .lb-pts-wrap { text-align: right; }
  .lb-pts {
    font-family: 'Orbitron', sans-serif; font-size: 18px; font-weight: 900;
    color: var(--red); line-height: 1; display: block; text-align: right;
  }
  .lb-pts-breakdown { font-size: 7.5px; color: var(--muted); margin-top: 2px; font-family: 'Share Tech Mono', monospace; text-align: right; }
  .lb-bar-wrap { width: 100%; height: 2px; background: rgba(255,255,255,0.06); border-radius: 2px; margin-top: 5px; overflow: hidden; }
  .lb-bar-fill { height: 100%; border-radius: 2px; background: linear-gradient(90deg, var(--red), #ff4060); transition: width 1s cubic-bezier(.4,0,.2,1); }

  /* ── Mobile responsive ── */
  @media (max-width: 520px) {
    /* On mobile hide "Pole" column (5th), keep V and Podi */
    .lb-list-header { grid-template-columns: 46px 1fr 34px 34px 76px; }
    .lb-row          { grid-template-columns: 46px 1fr 34px 34px 76px; padding: 10px 11px; }
    .lb-list-header span:nth-child(5),
    .lb-row .lb-stat.poles-col { display: none; }
    .lb-pos { width: 30px; height: 30px; font-size: 11px; border-radius: 7px; }
    .lb-pts { font-size: 15px; }
    .lb-driver-name { font-size: 10px; }
    .lb-team-bar { height: 30px; }
  }
  @media (max-width: 380px) {
    /* Tiny phones: hide V too, just Podi */
    .lb-list-header { grid-template-columns: 40px 1fr 32px 72px; }
    .lb-row          { grid-template-columns: 40px 1fr 32px 72px; padding: 9px 9px; }
    .lb-list-header span:nth-child(3),
    .lb-row .lb-stat.wins-col { display: none; }
  }

  /* ═══ CALENDAR ════════════════════════════════════════════════ */
  .cal-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 12px; }

  .cal-card {
    background: var(--bg1);
    border: 1px solid var(--border); border-radius: 12px; padding: 0;
    position: relative; overflow: hidden;
    animation: slideInUp 0.4s cubic-bezier(.4,0,.2,1) both;
    transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  }
  .cal-card.done { cursor: pointer; }
  .cal-card.done:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(232,0,29,0.2);
    border-color: rgba(232,0,29,0.25);
  }
  .cal-card.upcoming:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  }

  /* Top accent stripe on cal card */
  .cal-card-stripe {
    height: 3px; width: 100%;
    background: linear-gradient(90deg, var(--red), transparent);
  }
  .cal-card.upcoming .cal-card-stripe {
    background: linear-gradient(90deg, var(--cyan), transparent);
  }

  .cal-card-body { padding: 13px 15px 14px; }

  .cal-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
  .cal-round {
    font-family: 'Orbitron', sans-serif; font-size: 9px; font-weight: 700;
    color: var(--dim); letter-spacing: 1.5px;
  }
  .cal-status {
    font-size: 8px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;
    padding: 2px 8px; border-radius: 4px;
    font-family: 'Share Tech Mono', monospace;
  }
  .cal-status.done     { background: rgba(232,0,29,0.12); color: var(--red); }
  .cal-status.upcoming { background: rgba(0,212,255,0.1);  color: var(--cyan); }

  .cal-race-name {
    font-family: 'Orbitron', sans-serif; font-size: 11.5px; font-weight: 700;
    color: #e8ecf0; margin-bottom: 3px; line-height: 1.2;
  }
  .cal-city { font-size: 10px; color: var(--muted); margin-bottom: 10px; }
  .cal-winner {
    display: flex; align-items: center; gap: 6px;
    font-size: 11px; color: var(--text); font-weight: 600;
  }
  .cal-winner-trophy { font-size: 11px; }

  /* Bonus chips */
  .cal-bonuses { display: flex; gap: 4px; margin-top: 8px; flex-wrap: wrap; }
  .cal-bonus-chip {
    font-size: 8px; padding: 2px 6px; border-radius: 4px;
    font-family: 'Share Tech Mono', monospace;
  }
  .cal-bonus-chip.pole      { background: rgba(0,212,255,0.1);  color: var(--cyan); }
  .cal-bonus-chip.overtakes { background: rgba(255,128,0,0.1);  color: #FF8000; }
  .cal-bonus-chip.interpole { background: rgba(0,168,22,0.1);   color: #00c820; }

/* ═══ MODAL ═════════════════════════════════════════════════ */
  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(3,5,8,0.88); backdrop-filter: blur(8px);
    z-index: 1000;
    display: flex; align-items: center; justify-content: center;
    padding: 16px; animation: fadeIn 0.2s ease;
    overflow-y: auto;
  }
  .modal {
    background: var(--bg1);
    border: 1px solid var(--border); border-radius: 14px;
    max-width: 460px; width: 100%;
    margin: auto;
    animation: modalIn 0.28s cubic-bezier(.4,0,.2,1);
    box-shadow: 0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04);
  }
  .modal-header {
    padding: 18px 22px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    border-radius: 14px 14px 0 0;
  }
  .modal-title {
    font-family: 'Orbitron', sans-serif; font-size: 14px; font-weight: 700; color: #e8ecf0;
  }
  .modal-subtitle { font-size: 10px; color: var(--muted); margin-top: 3px; font-family: 'Share Tech Mono', monospace; }
  .modal-close {
    background: rgba(255,255,255,0.05); border: 1px solid var(--border);
    color: var(--muted); cursor: pointer; font-size: 18px;
    width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;
    border-radius: 8px; transition: all 0.2s; flex-shrink: 0;
  }
  .modal-close:hover { background: rgba(232,0,29,0.1); border-color: rgba(232,0,29,0.3); color: var(--red); }
  .modal-body { padding: 16px 18px; }

  .modal-bonus-section {
    display: flex; gap: 10px; flex-wrap: wrap;
    padding: 10px 14px; margin-bottom: 14px;
    background: rgba(0,212,255,0.03);
    border: 1px solid rgba(0,212,255,0.1); border-radius: 9px;
  }
  .modal-bonus-item { display: flex; align-items: center; gap: 6px; font-size: 11px; }
  .modal-bonus-dot  { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
  .modal-bonus-dot.pole      { background: var(--cyan); }
  .modal-bonus-dot.overtakes { background: #FF8000; }
  .modal-bonus-dot.interpole { background: #00c820; }
  .modal-bonus-label  { color: var(--muted); }
  .modal-bonus-driver { color: var(--text); font-weight: 700; }
  .modal-bonus-pts    { color: var(--red); font-size: 9px; font-family: 'Share Tech Mono', monospace; }

  .modal-results-table {
    width: 100%; border-collapse: collapse; table-layout: fixed;
  }
  .modal-results-table tr {
    border-bottom: 1px solid rgba(255,255,255,0.04); transition: background 0.15s;
  }
  .modal-results-table tr:last-child { border-bottom: none; }
  .modal-results-table tr:hover { background: rgba(255,255,255,0.025); }
  .modal-results-table td {
    padding: 9px 6px; font-size: 12px; vertical-align: middle;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .modal-col-pos { width: 44px; }
  .modal-col-pts { width: 54px; }

  .modal-pos {
    font-family: 'Orbitron', sans-serif; font-weight: 700;
    font-size: 11px; color: var(--muted); display: inline-block; min-width: 32px;
  }
  .modal-pos.p1 { color: var(--gold); }
  .modal-pos.p2 { color: var(--silver); }
  .modal-pos.p3 { color: var(--bronze); }

  .modal-driver { display: flex; align-items: center; gap: 8px; min-width: 0; }
  .modal-driver-flag { font-size: 14px; flex-shrink: 0; }
  .modal-driver-name { color: #e8ecf0; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .modal-pts { text-align: right; color: var(--muted); font-size: 10px; font-family: 'Share Tech Mono', monospace; white-space: nowrap; }
  .modal-driver-bonus { display: flex; gap: 3px; flex-shrink: 0; }
  .modal-driver-bonus-icon { font-size: 11px; }

  @media (max-width: 600px) {
    .modal-overlay { padding: 8px; align-items: flex-start; padding-top: 40px; }
    .modal { border-radius: 14px; }
    .modal-header { padding: 14px 16px; }
    .modal-body { padding: 12px 14px; }
    .modal-results-table td { padding: 8px 4px; font-size: 11px; }
    .modal-col-pts { width: 48px; }
  }
  /* ═══ CAREER ════════════════════════════════════════════════ */
  .career-section { margin-bottom: 32px; }
  .career-section-title {
    font-family: 'Orbitron', sans-serif; font-size: 13px; font-weight: 700;
    color: #e8ecf0; margin-bottom: 16px; padding-bottom: 9px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 10px;
  }
  .career-section-title::before {
    content: ''; display: block; width: 3px; height: 16px;
    background: var(--red); border-radius: 2px;
  }
  .career-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; }
  .career-card {
    background: var(--bg1);
    border: 1px solid var(--border); border-radius: 12px; padding: 16px;
    animation: slideInUp 0.4s cubic-bezier(.4,0,.2,1) both;
    transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
    position: relative; overflow: hidden;
  }
  .career-card::before {
    content: ''; position: absolute;
    top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--team-color, var(--red)), transparent);
  }
  .career-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 36px rgba(0,0,0,0.4);
    border-color: rgba(255,255,255,0.1);
  }
  .career-card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
  .career-entity-dot  { width: 11px; height: 11px; border-radius: 50%; flex-shrink: 0; box-shadow: 0 0 8px currentColor; }
  .career-entity-name { font-family: 'Orbitron', sans-serif; font-size: 12px; font-weight: 700; color: #e8ecf0; }
  .career-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(68px, 1fr)); gap: 8px; }
  .career-stat-box {
    background: var(--bg2); border: 1px solid var(--border);
    border-radius: 8px; padding: 9px 8px; text-align: center;
    transition: border-color 0.2s;
  }
  .career-stat-box:hover { border-color: rgba(255,255,255,0.1); }
  .career-stat-label {
    font-size: 7px; color: var(--dim);
    text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 4px;
    font-family: 'Share Tech Mono', monospace;
  }
  .career-stat-val {
    font-family: 'Orbitron', sans-serif; font-size: 17px; font-weight: 900; color: #e8ecf0;
    line-height: 1;
  }
  .career-stat-val.pts     { color: var(--red); }
  .career-stat-val.wins    { color: var(--gold); }
  .career-stat-val.poles   { color: var(--cyan); }
  .career-stat-val.interpole { color: #00c820; }
  .career-stat-val.podiums { color: var(--bronze); }
  .career-stat-val.wdc     { color: var(--gold); }
  .career-stat-val.wcc     { color: var(--gold); }
  .career-stat-val.GrandSlam { color: #ffea60; }
  .career-stat-val.HatTrick  { color: #ffea60; }
  .career-stat-val.constructorchamp { color: #ffea60; }
  .career-stat-val.driverchamp      { color: #ffea60; }

  /* ═══ HEAD TO HEAD ════════════════════════════════════════════ */
  .h2h-team-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(330px, 1fr)); gap: 16px; }
  .h2h-team-card {
    background: var(--bg1);
    border: 1px solid var(--border); border-radius: 14px; overflow: hidden;
    animation: slideInUp 0.4s cubic-bezier(.4,0,.2,1) both;
    transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  }
  .h2h-team-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.4);
    border-color: rgba(255,255,255,0.08);
  }
  .h2h-team-header {
    padding: 14px 18px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 10px;
    background: var(--bg2);
  }
  .h2h-team-dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
  .h2h-team-name { font-family: 'Orbitron', sans-serif; font-size: 12px; font-weight: 700; color: #e8ecf0; }

  .h2h-drivers-row {
    display: grid; grid-template-columns: 1fr auto 1fr;
    align-items: center; padding: 16px 18px; gap: 14px;
    background: linear-gradient(135deg, rgba(255,255,255,0.015) 0%, transparent 100%);
  }
  .h2h-driver { display: flex; flex-direction: column; gap: 3px; }
  .h2h-driver.right { align-items: flex-end; }
  .h2h-driver-name {
    font-family: 'Orbitron', sans-serif; font-size: 12px; font-weight: 700;
    color: #e8ecf0; display: flex; align-items: center; gap: 5px;
  }
  .h2h-driver-num { font-size: 9px; color: var(--muted); font-family: 'Share Tech Mono', monospace; }
  .h2h-vs {
    font-family: 'Orbitron', sans-serif; font-size: 10px; font-weight: 900;
    color: var(--red); padding: 6px 12px;
    background: rgba(232,0,29,0.1); border: 1px solid rgba(232,0,29,0.2);
    border-radius: 6px;
  }

  .h2h-stats-grid { background: var(--border); display: grid; gap: 1px; border-top: 1px solid var(--border); }
  .h2h-stat-row {
    display: grid; grid-template-columns: 1fr auto 1fr;
    align-items: center; background: var(--bg1); padding: 9px 18px; gap: 12px;
    transition: background 0.15s;
  }
  .h2h-stat-row:hover { background: rgba(255,255,255,0.02); }
  .h2h-stat-val {
    font-family: 'Orbitron', sans-serif; font-size: 15px; font-weight: 900; color: var(--muted);
    transition: color 0.2s;
  }
  .h2h-stat-val.left   { text-align: right; }
  .h2h-stat-val.winner { color: var(--red); }
  .h2h-stat-label {
    font-size: 8px; color: var(--dim);
    text-transform: uppercase; letter-spacing: 1.2px; text-align: center; font-weight: 700;
    font-family: 'Share Tech Mono', monospace; white-space: nowrap;
  }

  .h2h-detail-section { padding: 14px 18px; border-top: 1px solid var(--border); }
  .h2h-detail-title {
    font-size: 9px; color: var(--dim);
    text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;
    margin-bottom: 10px; font-family: 'Share Tech Mono', monospace;
  }
  .h2h-race-results { display: flex; flex-direction: column; gap: 4px; }
  .h2h-race-item {
    display: grid; grid-template-columns: 1fr auto auto;
    align-items: center; gap: 10px;
    padding: 7px 10px; background: var(--bg2); border-radius: 7px;
    font-size: 10px; transition: background 0.15s;
  }
  .h2h-race-item:hover { background: rgba(255,255,255,0.04); }
  .h2h-race-name { color: var(--muted); }
  .h2h-race-pos  {
    font-family: 'Orbitron', sans-serif; font-size: 10px; font-weight: 700;
    color: var(--text); min-width: 28px; text-align: center;
  }
  .h2h-race-pos.winner { color: var(--red); }

  /* ═══ SETUP ═════════════════════════════════════════════════ */
  .setup-creator-container { display: grid; grid-template-columns: 360px 1fr; gap: 16px; min-height: 600px; }
  .setup-left-panel { display: flex; flex-direction: column; gap: 14px; }

  .track-selector-card {
    background: var(--bg1); border: 1px solid var(--border); border-radius: 12px; padding: 18px;
    animation: slideInUp 0.4s ease;
  }
  .track-selector-title {
    font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: 700;
    color: #e8ecf0; margin-bottom: 12px; display: flex; align-items: center; gap: 7px;
  }
  .track-select {
    width: 100%; padding: 10px 14px; background: var(--bg2);
    border: 1px solid var(--border); border-radius: 8px;
    color: var(--text); font-family: 'Rajdhani', sans-serif; font-size: 13px; font-weight: 600;
    outline: none; cursor: pointer; transition: border-color 0.2s;
  }
  .track-select:focus { border-color: var(--cyan); }

  .track-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 14px; }
  .track-info-item {
    padding: 10px; background: rgba(0,212,255,0.04);
    border: 1px solid rgba(0,212,255,0.15); border-radius: 8px;
  }
  .track-info-label { font-size: 7px; color: var(--dim); text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 4px; font-family: 'Share Tech Mono', monospace; }
  .track-info-value { font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: 700; color: var(--cyan); }

  .quick-guides-card {
    background: var(--bg1); border: 1px solid var(--border); border-radius: 12px; padding: 18px; flex: 1; overflow-y: auto;
  }
  .quick-guide-title {
    font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: 700;
    color: #e8ecf0; margin-bottom: 14px; display: flex; align-items: center; gap: 7px;
  }
  .quick-guide-section { margin-bottom: 16px; padding-bottom: 14px; border-bottom: 1px solid rgba(255,255,255,0.04); }
  .quick-guide-section:last-child { border-bottom: none; }
  .quick-guide-section h4 {
    font-family: 'Orbitron', sans-serif; font-size: 10px; font-weight: 600;
    color: var(--muted); margin-bottom: 8px; display: flex; align-items: center; gap: 5px;
  }
  .quick-tip {
    font-size: 10px; color: #6a8ea0; line-height: 1.6;
    padding-left: 12px; position: relative; margin-bottom: 3px;
  }
  .quick-tip::before { content: '→'; position: absolute; left: 0; color: var(--cyan); font-size: 9px; }

  .setup-right-panel { display: flex; flex-direction: column; gap: 14px; overflow-y: auto; }
  .setup-editor-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 18px; background: var(--bg1); border: 1px solid var(--border);
    border-radius: 12px; flex-wrap: wrap; gap: 10px;
  }
  .setup-editor-title {
    font-family: 'Orbitron', sans-serif; font-size: 13px; font-weight: 700;
    color: #e8ecf0; display: flex; align-items: center; gap: 9px; flex-wrap: wrap;
  }
  .setup-actions { display: flex; gap: 8px; flex-wrap: wrap; }
  .setup-action-btn {
    padding: 8px 16px; background: var(--bg2); border: 1px solid var(--border);
    border-radius: 7px; color: var(--text); font-family: 'Rajdhani', sans-serif;
    font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.2s;
    display: flex; align-items: center; gap: 5px;
  }
  .setup-action-btn:hover { border-color: var(--cyan); color: var(--cyan); }
  .setup-action-btn.primary {
    background: linear-gradient(135deg, rgba(0,212,255,0.15) 0%, rgba(232,0,29,0.15) 100%);
    border-color: rgba(0,212,255,0.3); color: var(--cyan);
  }
  .setup-action-btn.primary:hover {
    background: linear-gradient(135deg, rgba(0,212,255,0.25) 0%, rgba(232,0,29,0.25) 100%);
    box-shadow: 0 4px 16px rgba(0,212,255,0.2);
  }

  .setup-categories-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px; }
  .setup-category-card {
    background: var(--bg1); border: 1px solid var(--border); border-radius: 12px; overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s; animation: slideInUp 0.4s ease both;
  }
  .setup-category-card:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.3); }
  .setup-category-header {
    padding: 13px 18px; background: var(--bg2); border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 8px;
  }
  .setup-category-title {
    font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: 700; color: #e8ecf0;
    display: flex; align-items: center; gap: 7px;
  }
  .setup-category-body { padding: 18px; }
  .setup-param-group { margin-bottom: 18px; }
  .setup-param-group:last-child { margin-bottom: 0; }
  .setup-param-label {
    display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
  }
  .setup-param-name { font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; font-family: 'Share Tech Mono', monospace; }
  .setup-param-value { font-family: 'Orbitron', sans-serif; font-size: 15px; font-weight: 900; color: var(--cyan); }

  .setup-slider {
    width: 100%; height: 4px; background: var(--bg2); border-radius: 2px;
    outline: none; -webkit-appearance: none; cursor: pointer;
  }
  .setup-slider::-webkit-slider-thumb {
    -webkit-appearance: none; width: 18px; height: 18px;
    background: var(--cyan); border-radius: 50%; cursor: pointer;
    transition: all 0.2s; box-shadow: 0 0 8px rgba(0,212,255,0.5);
  }
  .setup-slider::-webkit-slider-thumb:hover {
    transform: scale(1.25); box-shadow: 0 0 16px rgba(0,212,255,0.7);
  }
  .setup-slider::-moz-range-thumb {
    width: 18px; height: 18px; background: var(--cyan); border-radius: 50%;
    cursor: pointer; border: none; box-shadow: 0 0 8px rgba(0,212,255,0.5);
  }

  .setup-hint {
    margin-top: 8px; padding: 7px 11px;
    background: rgba(0,212,255,0.04); border-left: 2px solid rgba(0,212,255,0.35);
    border-radius: 0 5px 5px 0; font-size: 9.5px; color: rgba(0,212,255,0.7); line-height: 1.5;
    font-family: 'Share Tech Mono', monospace;
  }

  .setup-multi-param { display: grid; grid-template-columns: repeat(auto-fit, minmax(80px, 1fr)); gap: 10px; }
  .setup-multi-item { display: flex; flex-direction: column; gap: 5px; }
  .setup-multi-label { font-size: 7px; color: var(--dim); text-transform: uppercase; letter-spacing: 1px; text-align: center; font-family: 'Share Tech Mono', monospace; }
  .setup-multi-input {
    padding: 9px; background: var(--bg2); border: 1px solid var(--border);
    border-radius: 7px; color: var(--text); font-family: 'Orbitron', sans-serif;
    font-size: 11px; font-weight: 700; text-align: center; outline: none;
    transition: all 0.2s; width: 100%;
  }
  .setup-multi-input:focus { border-color: var(--cyan); box-shadow: 0 0 0 2px rgba(0,212,255,0.1); }

  /* Export Modal */
  .export-modal-overlay {
    position: fixed; inset: 0; background: rgba(3,5,8,0.9); backdrop-filter: blur(8px);
    z-index: 1000; display: flex; align-items: center; justify-content: center;
    padding: 16px; animation: fadeIn 0.2s ease;
  }
  .export-modal {
    background: var(--bg1); border: 1px solid var(--border); border-radius: 14px;
    max-width: 560px; width: 100%; max-height: 85vh; overflow-y: auto;
    animation: modalIn 0.28s cubic-bezier(.4,0,.2,1);
  }
  .export-modal-header {
    padding: 18px 22px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }
  .export-modal-title { font-family: 'Orbitron', sans-serif; font-size: 14px; font-weight: 700; color: #e8ecf0; }
  .export-modal-close {
    background: rgba(255,255,255,0.05); border: 1px solid var(--border);
    color: var(--muted); cursor: pointer; font-size: 18px;
    width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;
    border-radius: 8px; transition: all 0.2s;
  }
  .export-modal-close:hover { background: rgba(232,0,29,0.1); color: var(--red); }
  .export-modal-body { padding: 18px 22px; }
  .export-format-label { font-size: 11px; color: var(--muted); margin-bottom: 10px; display: block; font-family: 'Rajdhani', sans-serif; }
  .export-formats { display: flex; gap: 10px; margin-bottom: 18px; }
  .export-format-btn {
    flex: 1; padding: 14px; background: var(--bg2); border: 1px solid var(--border);
    border-radius: 9px; cursor: pointer; transition: all 0.2s; text-align: center;
  }
  .export-format-btn:hover { border-color: rgba(0,212,255,0.3); }
  .export-format-btn.active { border-color: var(--red); background: rgba(232,0,29,0.08); }
  .export-format-icon { font-size: 22px; margin-bottom: 7px; }
  .export-format-name { font-family: 'Orbitron', sans-serif; font-size: 10px; font-weight: 700; color: #e8ecf0; }
  .export-preview {
    background: var(--bg2); border: 1px solid var(--border); border-radius: 9px;
    padding: 14px; font-family: 'Share Tech Mono', monospace; font-size: 9.5px;
    color: var(--text); max-height: 260px; overflow-y: auto;
    white-space: pre-wrap; line-height: 1.7;
  }
  .export-actions { display: flex; gap: 10px; margin-top: 16px; }
  .export-btn {
    flex: 1; padding: 12px;
    background: linear-gradient(135deg, rgba(0,212,255,0.2) 0%, rgba(232,0,29,0.2) 100%);
    border: 1px solid rgba(0,212,255,0.3);
    border-radius: 9px; color: var(--cyan);
    font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: 700;
    cursor: pointer; transition: all 0.2s;
  }
  .export-btn:hover { box-shadow: 0 6px 24px rgba(0,212,255,0.25); transform: translateY(-2px); }

  /* ═══ RULES ══════════════════════════════════════════════════ */
  .rules-grid { display: grid; gap: 10px; }
  .rule-card {
    background: var(--bg1); border: 1px solid var(--border); border-radius: 12px; overflow: hidden;
    animation: slideInUp 0.4s cubic-bezier(.4,0,.2,1) both;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .rule-card:hover { border-color: rgba(255,255,255,0.08); box-shadow: 0 4px 24px rgba(0,0,0,0.3); }
  .rule-header {
    padding: 16px 20px; display: flex; align-items: center; justify-content: space-between;
    cursor: pointer; user-select: none;
    background: linear-gradient(90deg, rgba(255,255,255,0.01) 0%, transparent 100%);
    transition: background 0.2s;
  }
  .rule-header:hover { background: rgba(255,255,255,0.02); }
  .rule-header-left { display: flex; align-items: center; gap: 12px; }
  .rule-icon {
    font-size: 20px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;
    background: rgba(232,0,29,0.08); border: 1px solid rgba(232,0,29,0.15); border-radius: 10px;
  }
  .rule-title { font-family: 'Orbitron', sans-serif; font-size: 13px; font-weight: 700; color: #e8ecf0; }
  .rule-toggle {
    width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;
    border-radius: 7px; background: var(--bg2); border: 1px solid var(--border);
    color: var(--muted); font-size: 10px;
    transition: transform 0.35s cubic-bezier(.4,0,.2,1), background 0.2s, color 0.2s;
  }
  .rule-card.expanded .rule-toggle {
    transform: rotate(180deg); background: rgba(232,0,29,0.1); color: var(--red);
    border-color: rgba(232,0,29,0.2);
  }
  .rule-content { overflow: hidden; max-height: 0; opacity: 0; transition: max-height 0.45s cubic-bezier(.4,0,.2,1), opacity 0.3s; }
  .rule-card.expanded .rule-content { max-height: none; opacity: 1; }
  .rule-content-inner { padding: 0 20px 20px; border-top: 1px solid var(--border); }
  .rule-text { font-size: 12px; color: #6a8ea0; line-height: 1.8; margin-top: 16px; font-family: 'Rajdhani', sans-serif; }
  .rule-text-item { margin-bottom: 5px; }

  /* ── Responsive ───────────────────────────────────────────── */
  @media (max-width: 900px) {
    .setup-creator-container { grid-template-columns: 1fr; height: auto; }
    .setup-left-panel { flex-direction: row; }
    .track-selector-card, .quick-guides-card { flex: 1; min-width: 0; }
    .h2h-team-grid { grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); }
    .career-grid   { grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); }
  }
  @media (max-width: 600px) {
    .f1-header-top { padding: 12px 14px 0; }
    .f1-title { font-size: 16px; }
    .f1-subtitle { display: none; }
    .f1-nav { padding: 8px 14px 0; }
    .f1-nav-btn { padding: 8px 11px; font-size: 10px; }
    .f1-page { padding: 14px 10px 44px; }

    .lb-driver-name { font-size: 10.5px; }
    .lb-pts { font-size: 15px; }
    /* calendar */
    .cal-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
    .cal-race-name { font-size: 10px; }
    /* h2h */
    .h2h-team-grid { grid-template-columns: 1fr; }
    /* career */
    .career-grid { grid-template-columns: 1fr; }
    /* setup */
    .setup-creator-container { grid-template-columns: 1fr; }
    .setup-left-panel { flex-direction: column; }
    .setup-categories-grid { grid-template-columns: 1fr; }
    .export-formats { flex-direction: column; }
    /* modal */
    .modal-overlay { padding: 8px; align-items: flex-end; }
    .modal { max-height: 92vh; border-radius: 14px 14px 0 0; }
    .modal-header { padding: 14px 16px; }
    .modal-body { padding: 12px 14px; }
    .modal-results-table td { padding: 8px 4px; font-size: 11px; }
    .modal-driver-flag { font-size: 12px; }
    .modal-driver-name { font-size: 11px; }
    .modal-pts { font-size: 10px; }
  }
  @media (max-width: 380px) {
    .f1-title { font-size: 14px; }
    .f1-nav-btn { padding: 7px 9px; font-size: 9px; }
    .f1-nav-icon { display: none; }
    .cal-grid { grid-template-columns: 1fr; }
    .career-stat-val { font-size: 15px; }

  }
`;

// ─── SETUP CREATOR ────────────────────────────────────────────────
function AdvancedSetupCreator() {
  const [selectedTrack, setSelectedTrack] = useState("");
  const [setupValues, setSetupValues] = useState({
    aero: [25, 25], trasmissione: [50, 1],
    geometria: [-3.50, -2.00, 0.00, 0.10],
    sosp: [41, 1, 10, 21, 20, 40], freni: [55, 100], gomme: [29.5, 29.5, 26.5, 26.5],
  });
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState("text");
  const trackData = selectedTrack ? TRACKS[selectedTrack] : null;

  useEffect(() => {
    if (trackData) {
      setSetupValues({
        aero: [...trackData.aero], trasmissione: [...trackData.trasmissione],
        geometria: [...trackData.geometria], sosp: [...trackData.sosp],
        freni: [...trackData.freni], gomme: [...trackData.gomme],
      });
    }
  }, [selectedTrack]);

  const updateSetupValue = (category, index, value) => {
    setSetupValues(prev => {
      const newValues = { ...prev };
      const newArray = [...newValues[category]];
      newArray[index] = parseFloat(value) || 0;
      newValues[category] = newArray;
      return newValues;
    });
  };

  const resetToBase = () => {
    if (trackData) {
      setSetupValues({
        aero: [...trackData.aero], trasmissione: [...trackData.trasmissione],
        geometria: [...trackData.geometria], sosp: [...trackData.sosp],
        freni: [...trackData.freni], gomme: [...trackData.gomme],
      });
    }
  };

  const exportSetup = () => {
    if (!trackData) return "";
    if (exportFormat === "text") {
      return `═══════════════════════════════════════\n🏁 F1 SETUP EXPORT - ${trackData.nome}\n═══════════════════════════════════════\n\n📍 CIRCUITO: ${trackData.nome}\n🌍 CONTINENTE: ${trackData.continente}\n\n⚙️ SETUP DETTAGLIATO:\n\n✈️ AERODINAMICA:\n   Front Wing: ${setupValues.aero[0]}\n   Rear Wing: ${setupValues.aero[1]}\n\n🔧 TRASMISSIONE:\n   Diff On-Throttle: ${setupValues.trasmissione[0]}\n   Diff Off-Throttle: ${setupValues.trasmissione[1]}\n\n📐 GEOMETRIA:\n   Camber Ant.: ${setupValues.geometria[0]}°\n   Camber Post.: ${setupValues.geometria[1]}°\n   Toe Ant.: ${setupValues.geometria[2]}°\n   Toe Post.: ${setupValues.geometria[3]}°\n\n🔩 SOSPENSIONI:\n   Trasmissione: ${setupValues.sosp[0]}\n   S1: ${setupValues.sosp[1]}\n   S2: ${setupValues.sosp[2]}\n   S3: ${setupValues.sosp[3]}\n   S4: ${setupValues.sosp[4]}\n   S5: ${setupValues.sosp[5]}\n\n🛑 FRENI:\n   Bilanciamento: ${setupValues.freni[0]}%\n   Pressione: ${setupValues.freni[1]}%\n\n🏎️ PRESSIONE GOMME:\n   Ant. Sx: ${setupValues.gomme[0]} PSI\n   Ant. Dx: ${setupValues.gomme[1]} PSI\n   Post. Sx: ${setupValues.gomme[2]} PSI\n   Post. Dx: ${setupValues.gomme[3]} PSI\n\n═══════════════════════════════════════\nGenerated by F1 Dashboard\n═══════════════════════════════════════`;
    }
    return JSON.stringify({ track: trackData.nome, continent: trackData.continente, setup: setupValues, timestamp: new Date().toISOString() }, null, 2);
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
    aero: ["+ Ala = + Velocità in curva + Grip","- Ala = + Velocità rettilineo - Grip","+ Gap ali = + Sovrasterzo","- Gap ali = + Sottosterzo"],
    trasmissione: ["Valori alti = Blocca diff = + Sottosterzo + Trazione","Valori bassi = Sblocca diff = + Sovrasterzo"],
    geometria: ["+ Campanatura = + Grip curva + Usura","- Campanatura = - Grip - Usura","+ Convergenza = + Stabilità - Reattività"],
    sospensioni: ["+ Rigidità = + Stabilità piste lisce","- Rigidità = + Grip cordoli/dossi","+ Altezza = - Velocità + Grip cordoli"],
    freni: ["+ Bilanciamento = + Sovrasterzo in ingresso","- Bilanciamento = + Sottosterzo","+ Pressione = + Potenza + Blocaggio"],
    gomme: ["+ Pressione = - Usura + Velocità - Grip","- Pressione = + Grip + Usura - Velocità"],
  };

  return (
    <div className="setup-creator-container">
      <div className="setup-left-panel">
        <div className="track-selector-card">
          <div className="track-selector-title">🏁 Seleziona Circuito</div>
          <select className="track-select" value={selectedTrack} onChange={(e) => setSelectedTrack(e.target.value)}>
            <option value="">-- Scegli una pista --</option>
            {Object.entries(TRACKS).map(([key, track]) => (
              <option key={key} value={key}>{CONTINENT_EMOJI[track.continente]} {track.nome}</option>
            ))}
          </select>
          {trackData && (
            <div className="track-info-grid">
              <div className="track-info-item"><div className="track-info-label">Continente</div><div className="track-info-value">{trackData.continente}</div></div>
              <div className="track-info-item"><div className="track-info-label">Circuito</div><div className="track-info-value">{trackData.nome}</div></div>
            </div>
          )}
        </div>
        <div className="quick-guides-card">
          <div className="quick-guide-title">💡 Guide Rapide</div>
          {Object.entries({ "✈️ Aerodinamica": quickGuides.aero, "⚙️ Trasmissione": quickGuides.trasmissione, "📐 Geometria": quickGuides.geometria, "🔩 Sospensioni": quickGuides.sospensioni, "🛑 Freni": quickGuides.freni, "🏎️ Gomme": quickGuides.gomme }).map(([title, tips]) => (
            <div className="quick-guide-section" key={title}>
              <h4>{title}</h4>
              <div>{tips.map((tip, i) => <div key={i} className="quick-tip">{tip}</div>)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="setup-right-panel">
        <div className="setup-editor-header">
          <div className="setup-editor-title">
            ⚙️ Editor Setup
            {trackData && <span style={{ color: 'var(--cyan)' }}>· {trackData.nome}</span>}
          </div>
          {trackData && (
            <div className="setup-actions">
              <button className="setup-action-btn" onClick={resetToBase}>↻ Reset</button>
              <button className="setup-action-btn primary" onClick={() => setShowExportModal(true)}>💾 Esporta</button>
            </div>
          )}
        </div>
        {!selectedTrack && (
          <div style={{ textAlign: 'center', padding: '70px 20px', color: 'var(--dim)', fontSize: '13px', fontFamily: 'Rajdhani' }}>
            <div style={{ fontSize: '48px', marginBottom: '14px', opacity: 0.25 }}>🏎️</div>
            Seleziona un circuito per iniziare
          </div>
        )}
        {trackData && (
          <div className="setup-categories-grid">
            <div className="setup-category-card">
              <div className="setup-category-header"><div className="setup-category-title">✈️ Aerodinamica</div></div>
              <div className="setup-category-body">
                {[["Front Wing", 0, 0, 50], ["Rear Wing", 1, 0, 50]].map(([label, idx, min, max]) => (
                  <div className="setup-param-group" key={label}>
                    <div className="setup-param-label"><span className="setup-param-name">{label}</span><span className="setup-param-value">{setupValues.aero[idx]}</span></div>
                    <input type="range" min={min} max={max} value={setupValues.aero[idx]} onChange={(e) => updateSetupValue('aero', idx, e.target.value)} className="setup-slider" />
                  </div>
                ))}
                <div className="setup-hint">Aumenta per più grip in curva, riduci per più velocità sul dritto</div>
              </div>
            </div>
            <div className="setup-category-card">
              <div className="setup-category-header"><div className="setup-category-title">⚙️ Trasmissione</div></div>
              <div className="setup-category-body">
                <div className="setup-param-group">
                  <div className="setup-param-label"><span className="setup-param-name">Diff On-Throttle</span><span className="setup-param-value">{setupValues.trasmissione[0]}</span></div>
                  <input type="range" min="20" max="100" value={setupValues.trasmissione[0]} onChange={(e) => updateSetupValue('trasmissione', 0, e.target.value)} className="setup-slider" />
                  <div className="setup-hint">Alto = blocco = + sottosterzo + trazione</div>
                </div>
                <div className="setup-param-group">
                  <div className="setup-param-label"><span className="setup-param-name">Diff Off-Throttle</span><span className="setup-param-value">{setupValues.trasmissione[1]}</span></div>
                  <input type="range" min="1" max="50" value={setupValues.trasmissione[1]} onChange={(e) => updateSetupValue('trasmissione', 1, e.target.value)} className="setup-slider" />
                  <div className="setup-hint">Controlla comportamento in rilascio</div>
                </div>
              </div>
            </div>
            <div className="setup-category-card">
              <div className="setup-category-header"><div className="setup-category-title">📐 Geometria</div></div>
              <div className="setup-category-body">
                <div className="setup-multi-param">
                  {[["Camber Ant.", 0, 0.1], ["Camber Post.", 1, 0.1], ["Toe Ant.", 2, 0.05], ["Toe Post.", 3, 0.05]].map(([label, idx, step]) => (
                    <div className="setup-multi-item" key={label}>
                      <div className="setup-multi-label">{label}</div>
                      <input type="number" step={step} value={setupValues.geometria[idx]} onChange={(e) => updateSetupValue('geometria', idx, e.target.value)} className="setup-multi-input" />
                    </div>
                  ))}
                </div>
                <div className="setup-hint">Camber: + valore = + grip. Toe: + convergenza = + stabilità</div>
              </div>
            </div>
            <div className="setup-category-card">
              <div className="setup-category-header"><div className="setup-category-title">🔧 Sospensioni</div></div>
              <div className="setup-category-body">
                <div className="setup-multi-param">
                  {[["Trasm.", 0], ["S1", 1], ["S2", 2], ["S3", 3], ["S4", 4], ["S5", 5]].map(([label, idx]) => (
                    <div className="setup-multi-item" key={label}>
                      <div className="setup-multi-label">{label}</div>
                      <input type="number" value={setupValues.sosp[idx]} onChange={(e) => updateSetupValue('sosp', idx, e.target.value)} className="setup-multi-input" />
                    </div>
                  ))}
                </div>
                <div className="setup-hint">+ Rigidità = piste lisce. - Rigidità = cordoli/dossi</div>
              </div>
            </div>
            <div className="setup-category-card">
              <div className="setup-category-header"><div className="setup-category-title">🛑 Freni</div></div>
              <div className="setup-category-body">
                <div className="setup-param-group">
                  <div className="setup-param-label"><span className="setup-param-name">Bilanciamento</span><span className="setup-param-value">{setupValues.freni[0]}%</span></div>
                  <input type="range" min="50" max="65" value={setupValues.freni[0]} onChange={(e) => updateSetupValue('freni', 0, e.target.value)} className="setup-slider" />
                </div>
                <div className="setup-param-group">
                  <div className="setup-param-label"><span className="setup-param-name">Pressione</span><span className="setup-param-value">{setupValues.freni[1]}%</span></div>
                  <input type="range" min="80" max="100" value={setupValues.freni[1]} onChange={(e) => updateSetupValue('freni', 1, e.target.value)} className="setup-slider" />
                </div>
                <div className="setup-hint">Bilanciamento: + valore = più carico anteriore</div>
              </div>
            </div>
            <div className="setup-category-card">
              <div className="setup-category-header"><div className="setup-category-title">🏎️ Pressione Gomme</div></div>
              <div className="setup-category-body">
                <div className="setup-multi-param">
                  {[["Ant. Sx", 0], ["Ant. Dx", 1], ["Post. Sx", 2], ["Post. Dx", 3]].map(([label, idx]) => (
                    <div className="setup-multi-item" key={label}>
                      <div className="setup-multi-label">{label}</div>
                      <input type="number" step="0.5" value={setupValues.gomme[idx]} onChange={(e) => updateSetupValue('gomme', idx, e.target.value)} className="setup-multi-input" />
                    </div>
                  ))}
                </div>
                <div className="setup-hint">+ Pressione = - usura - grip. - Pressione = + grip + usura</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showExportModal && (
        <div className="export-modal-overlay" onClick={() => setShowExportModal(false)}>
          <div className="export-modal" onClick={(e) => e.stopPropagation()}>
            <div className="export-modal-header">
              <div className="export-modal-title">Esporta Setup</div>
              <button className="export-modal-close" onClick={() => setShowExportModal(false)}>×</button>
            </div>
            <div className="export-modal-body">
              <label className="export-format-label">Formato:</label>
              <div className="export-formats">
                {[["text","📄","Testo"],["json","🔧","JSON"]].map(([fmt, icon, name]) => (
                  <button key={fmt} className={`export-format-btn${exportFormat === fmt ? ' active' : ''}`} onClick={() => setExportFormat(fmt)}>
                    <div className="export-format-icon">{icon}</div>
                    <div className="export-format-name">{name}</div>
                  </button>
                ))}
              </div>
              <div className="export-preview">{exportSetup()}</div>
              <div className="export-actions">
                <button className="export-btn" onClick={downloadSetup}>💾 Scarica Setup</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SEASON SELECTOR ──────────────────────────────────────────────
function SeasonSelector({ currentSeason, onSeasonChange }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="season-selector">
      <button className={`season-btn${isOpen ? " open" : ""}`} onClick={() => setIsOpen(!isOpen)}>
        <span>{currentSeason}</span>
        <span className="season-btn-chevron">▼</span>
      </button>
      {isOpen && (
        <div className="season-dropdown">
          {SEASONS.map((season) => (
            <div key={season} className={`season-option${season === currentSeason ? " active" : ""}`}
              onClick={() => { onSeasonChange(season); setIsOpen(false); }}>
              {season}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RaceResultsModal({ race, raceResults, raceExtras, season, onClose }) {
  const DRIVER_TEAMS = getDriverTeamsForSeason(season);
  const raceData  = raceResults.find(r => r.race === race.raceKey);
  const extraData = raceExtras.find(r => r.race === race.raceKey);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!raceData) return null;

  const driverBonuses = {};
  if (extraData) {
    if (extraData.pole)      driverBonuses[extraData.pole]      = [...(driverBonuses[extraData.pole]      || []), { icon: '🅿️' }];
    if (extraData.overtakes) driverBonuses[extraData.overtakes] = [...(driverBonuses[extraData.overtakes] || []), { icon: '⚡' }];
    if (extraData.interpole) driverBonuses[extraData.interpole] = [...(driverBonuses[extraData.interpole] || []), { icon: '🌧️' }];
  }
  const hasBonuses = extraData && (extraData.pole || extraData.overtakes || extraData.interpole);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute', inset: 0,
        background: 'rgba(3,5,8,0.92)',
        zIndex: 50,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: '24px 12px',
        overflowY: 'auto',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#080c14',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 14,
          width: '100%', maxWidth: 440,
          flexShrink: 0,
        }}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 13, fontWeight: 700, color: '#e8ecf0' }}>{race.race}</div>
            <div style={{ fontSize: 10, color: '#3d5a6e', marginTop: 3, fontFamily: 'Share Tech Mono, monospace' }}>{race.city} · Round {race.round}</div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
              color: '#3d5a6e', cursor: 'pointer', fontSize: 20, lineHeight: 1,
              width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 8, flexShrink: 0,
            }}
          >×</button>
        </div>

        {/* Body */}
        <div style={{ padding: '14px 18px' }}>
          {hasBonuses && (
            <div style={{
              display: 'flex', gap: 10, flexWrap: 'wrap',
              padding: '9px 13px', marginBottom: 13,
              background: 'rgba(0,212,255,0.04)',
              border: '1px solid rgba(0,212,255,0.12)', borderRadius: 9,
            }}>
              {extraData.pole && <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11 }}>
                <div style={{ width:7, height:7, borderRadius:'50%', background:'#00d4ff', flexShrink:0 }} />
                <span style={{ color:'#3d5a6e' }}>Pole:</span>
                <span style={{ color:'#c8d6e0', fontWeight:700 }}> {extraData.pole}</span>
                <span style={{ color:'#e8001d', fontSize:9, fontFamily:'Share Tech Mono,monospace' }}> +1pt</span>
              </div>}
              {extraData.overtakes && <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11 }}>
                <div style={{ width:7, height:7, borderRadius:'50%', background:'#FF8000', flexShrink:0 }} />
                <span style={{ color:'#3d5a6e' }}>Sorpassi:</span>
                <span style={{ color:'#c8d6e0', fontWeight:700 }}> {extraData.overtakes}</span>
                <span style={{ color:'#e8001d', fontSize:9, fontFamily:'Share Tech Mono,monospace' }}> +1pt</span>
              </div>}
              {extraData.interpole && <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11 }}>
                <div style={{ width:7, height:7, borderRadius:'50%', background:'#00c820', flexShrink:0 }} />
                <span style={{ color:'#3d5a6e' }}>Interpole:</span>
                <span style={{ color:'#c8d6e0', fontWeight:700 }}> {extraData.interpole}</span>
                <span style={{ color:'#e8001d', fontSize:9, fontFamily:'Share Tech Mono,monospace' }}> +1pt</span>
              </div>}
            </div>
          )}

          <table style={{ width:'100%', borderCollapse:'collapse', tableLayout:'fixed' }}>
            <colgroup>
              <col style={{ width: 44 }} />
              <col />
              <col style={{ width: 52 }} />
            </colgroup>
            <tbody>
              {raceData.results.map((driver, i) => {
                const info     = DRIVER_TEAMS[driver];
                const points   = i < POINTS_TABLE.length ? POINTS_TABLE[i] : 0;
                const bonuses  = driverBonuses[driver] || [];
                const totalPts = points + bonuses.length;
                const posColor = i===0 ? '#FFD700' : i===1 ? '#C0C0C0' : i===2 ? '#CD7F32' : '#3d5a6e';
                return (
                  <tr key={`${driver}-${i}`} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '8px 4px', verticalAlign:'middle' }}>
                      <span style={{
                        fontFamily:'Orbitron,sans-serif', fontWeight:700, fontSize:11,
                        color: posColor, display:'inline-block', minWidth:32,
                      }}>P{i+1}</span>
                    </td>
                    <td style={{ padding: '8px 4px', verticalAlign:'middle', overflow:'hidden' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:7, minWidth:0 }}>
                        <span style={{ fontSize:13, flexShrink:0 }}>{info?.flag||'🏁'}</span>
                        <span style={{
                          color:'#e8ecf0', fontWeight:600, fontSize:12,
                          overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
                        }}>{driver}</span>
                        {bonuses.map((b, bi) => (
                          <span key={bi} style={{ fontSize:11, flexShrink:0 }}>{b.icon}</span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '8px 4px', verticalAlign:'middle', textAlign:'right', whiteSpace:'nowrap' }}>
                      <span style={{ fontSize:10, color:'#3d5a6e', fontFamily:'Share Tech Mono,monospace' }}>
                        {totalPts > 0 ? `${totalPts}pt` : '—'}
                      </span>
                    </td>
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

function CalendarPage({ season }) {
  const [selectedRace, setSelectedRace] = useState(null);
  const seasonData = SEASON_DATA[season];

  return (
    <div style={{ position: 'relative' }}>
      <div className="cal-grid">
        {seasonData.calendar.map((race, i) => {
          const extra = seasonData.raceExtras.find(e => e.race === race.raceKey) || {};
          return (
            <div key={race.round}
              className={`cal-card ${race.status}`}
              style={{ animationDelay: `${i * 0.05}s` }}
              onClick={() => race.status === "done" && race.raceKey && setSelectedRace(race)}>
              <div className="cal-card-stripe" />
              <div className="cal-card-body">
                <div className="cal-card-header">
                  <span className="cal-round">Round {String(race.round).padStart(2,'0')}</span>
                  <span className={`cal-status ${race.status}`}>{race.status === "done" ? "✓ Done" : "Soon"}</span>
                </div>
                <div className="cal-race-name">{race.race}</div>
                <div className="cal-city">{race.city}</div>
                {race.winner && race.winner !== "..." && (
                  <div className="cal-winner">
                    <span className="cal-winner-trophy">🏆</span>
                    <span style={{ fontFamily: 'Orbitron', fontSize: 11, fontWeight: 700 }}>{race.winner}</span>
                  </div>
                )}
                {race.status === "done" && (extra.pole || extra.overtakes || extra.interpole) && (
                  <div className="cal-bonuses">
                    {extra.pole      && <span className="cal-bonus-chip pole">🅿️ {extra.pole}</span>}
                    {extra.overtakes && <span className="cal-bonus-chip overtakes">⚡ {extra.overtakes}</span>}
                    {extra.interpole && <span className="cal-bonus-chip interpole">🌧️ {extra.interpole}</span>}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedRace && (
        <RaceResultsModal
          race={selectedRace}
          raceResults={seasonData.races}
          raceExtras={seasonData.raceExtras}
          season={season}
          onClose={() => setSelectedRace(null)}
        />
      )}
    </div>
  );
}

// ─── LEADERBOARD PAGE ─────────────────────────────────────────────
function LeaderboardPage({ season }) {
  const [tab, setTab] = useState("drivers");
  const [expandedDriver, setExpandedDriver] = useState(null);
  const seasonData      = SEASON_DATA[season];
  const driverStandings = useMemo(() => computeDriverStandings(seasonData.races, seasonData.raceExtras, season), [season]);
  const teamStandings   = useMemo(() => computeTeamStandings(seasonData.races, seasonData.raceExtras, season), [season]);
  const maxPts = driverStandings[0]?.points || 1;
  const maxTeamPts = teamStandings[0]?.points || 1;

  function getDriverRaces(driverName) {
    return seasonData.races.map(({ race, results }, raceIdx) => {
      const pos   = results.indexOf(driverName);
      const extra = seasonData.raceExtras[raceIdx] || {};
      const bonuses = [
        extra.pole       === driverName ? '🅿️' : null,
        extra.overtakes  === driverName ? '⚡' : null,
        extra.interpole  === driverName ? '🌧️' : null,
      ].filter(Boolean);
      const racePts  = pos >= 0 && pos < POINTS_TABLE.length ? POINTS_TABLE[pos] : 0;
      return { race, pos: pos >= 0 ? pos + 1 : null, pts: racePts + bonuses.length, bonuses };
    }).filter(r => r.pos !== null);
  }

  return (
    <>
      <div className="lb-tabs">
        <button className={`lb-tab${tab === "drivers" ? " active" : ""}`} onClick={() => setTab("drivers")}>Piloti</button>
        <button className={`lb-tab${tab === "teams"   ? " active" : ""}`} onClick={() => setTab("teams")}>Costruttori</button>
      </div>

      {tab === "drivers" && (
        <div className="lb-list">
          <div className="lb-list-header">
            <span>#</span>
            <span>Pilota</span>
            <span>V</span>
            <span>Podi</span>
            <span>Pole</span>
            <span>Punti</span>
          </div>
          {driverStandings.map((d, i) => {
            const isExp = expandedDriver === d.name;
            const races = isExp ? getDriverRaces(d.name) : [];
            const pct   = Math.round((d.points / maxPts) * 100);
            const poles = seasonData.driverPoles?.[d.name] || 0;
            const posClass = i===0?" p1":i===1?" p2":i===2?" p3":"";
            return (
              <div key={d.name} className={`lb-row rank-${i+1}`} style={{ animationDelay: `${i * 0.035}s` }}>
                {/* Posizione con badge */}
                <div className="lb-pos-wrap">
                  <div className={`lb-pos${posClass}`}>{i+1}</div>
                </div>
                {/* Pilota */}
                <div className="lb-driver-cell">
                  <div className="lb-team-bar" style={{ background: TEAM_COLORS[d.team]||"#555", boxShadow:`0 0 6px ${TEAM_COLORS[d.team]||"#555"}44` }} />
                  <div className="lb-driver-info">
                    <div className="lb-driver-name">{d.flag} {d.name}</div>
                    <div className="lb-driver-meta">
                      <span className="lb-driver-team">{d.team}</span>
                      <span className="lb-driver-num">#{d.num}</span>
                    </div>
                    {(d.bonusPole>0||d.bonusOvertakes>0||d.bonusInterpole>0) && (
                      <div className="lb-bonus-row">
                        {d.bonusPole>0 && <span className="lb-bonus-badge pole">🅿️ ×{d.bonusPole}</span>}
                        {d.bonusOvertakes>0 && <span className="lb-bonus-badge overtakes">⚡ ×{d.bonusOvertakes}</span>}
                        {d.bonusInterpole>0 && <span className="lb-bonus-badge interpole">🌧️ ×{d.bonusInterpole}</span>}
                      </div>
                    )}
                    {seasonData.races.some(r => r.results.includes(d.name)) && (
                      <>
                        <button className="lb-race-toggle" onClick={()=>setExpandedDriver(isExp?null:d.name)}>
                          {isExp ? "▲ chiudi" : "▼ risultati"}
                        </button>
                        <div className={`lb-race-list${isExp?" open":""}`}>
                          {races.map((r) => (
                            <div className="lb-race-item" key={r.race}>
                              <span className="lb-race-item-name">{r.race}</span>
                              <span className="lb-race-item-pos">P{r.pos} · {r.pts}pt{r.bonuses.length>0 && <span style={{color:'var(--red)'}}> {r.bonuses.join('')}</span>}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                {/* V */}
                <span className={`lb-stat wins-col${d.wins===0?" zero":""}`}>{d.wins}</span>
                {/* Podi */}
                <span className={`lb-stat podiums-col${d.podiums===0?" zero":""}`}>{d.podiums}</span>
                {/* Pole */}
                <span className={`lb-stat poles-col${poles===0?" zero":""}`}>{poles}</span>
                {/* Punti */}
                <div className="lb-pts-wrap">
                  <span className="lb-pts">{d.points}</span>
                  {d.bonusTotal>0 && <div className="lb-pts-breakdown">{d.racePoints}+{d.bonusTotal}b</div>}
                  <div className="lb-bar-wrap"><div className="lb-bar-fill" style={{width:`${pct}%`}} /></div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "teams" && (
        <div className="lb-list">
          <div className="lb-list-header">
            <span>#</span>
            <span>Costruttore</span>
            <span>V</span>
            <span>Pole</span>
            <span></span>
            <span>Punti</span>
          </div>
          {teamStandings.map((t, i) => {
            const pct = Math.round((t.points/maxTeamPts)*100);
            const tc = TEAM_COLORS[t.team]||'var(--red)';
            const posClass = i===0?" p1":i===1?" p2":i===2?" p3":"";
            // sum poles for this team from driverPoles
            const DRIVER_TEAMS_CUR = getDriverTeamsForSeason(season);
            const teamPoles = Object.entries(DRIVER_TEAMS_CUR)
              .filter(([,info]) => info.team === t.team)
              .reduce((sum,[name]) => sum + (seasonData.driverPoles?.[name]||0), 0);
            return (
              <div key={t.team} className={`lb-row rank-${i+1}`} style={{animationDelay:`${i*0.045}s`}}>
                <div className="lb-pos-wrap">
                  <div className={`lb-pos${posClass}`}>{i+1}</div>
                </div>
                <div className="lb-driver-cell">
                  <div className="lb-team-bar" style={{background:tc, boxShadow:`0 0 6px ${tc}44`}} />
                  <div className="lb-driver-info">
                    <div className="lb-driver-name">{t.team}</div>
                  </div>
                </div>
                <span className={`lb-stat wins-col${t.wins===0?" zero":""}`}>{t.wins}</span>
                <span className={`lb-stat poles-col${teamPoles===0?" zero":""}`}>{teamPoles}</span>
                <span></span>
                <div className="lb-pts-wrap">
                  <span className="lb-pts">{t.points}</span>
                  <div className="lb-bar-wrap"><div className="lb-bar-fill" style={{width:`${pct}%`, background:`linear-gradient(90deg,${tc},${tc}88)`}} /></div>
                </div>
              </div>
            );
          })}
        </div>
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
        {seasonData.calendar.map((race, i) => {
          const extra = seasonData.raceExtras.find(e => e.race === race.raceKey) || {};
          return (
            <div key={race.round}
              className={`cal-card ${race.status}`}
              style={{ animationDelay: `${i * 0.05}s` }}
              onClick={() => race.status === "done" && race.raceKey && setSelectedRace(race)}>
              <div className="cal-card-stripe" />
              <div className="cal-card-body">
                <div className="cal-card-header">
                  <span className="cal-round">Round {String(race.round).padStart(2,'0')}</span>
                  <span className={`cal-status ${race.status}`}>{race.status === "done" ? "✓ Done" : "Soon"}</span>
                </div>
                <div className="cal-race-name">{race.race}</div>
                <div className="cal-city">{race.city}</div>
                {race.winner && race.winner !== "..." && (
                  <div className="cal-winner">
                    <span className="cal-winner-trophy">🏆</span>
                    <span style={{ fontFamily: 'Orbitron', fontSize: 11, fontWeight: 700 }}>{race.winner}</span>
                  </div>
                )}
                {race.status === "done" && (extra.pole || extra.overtakes || extra.interpole) && (
                  <div className="cal-bonuses">
                    {extra.pole      && <span className="cal-bonus-chip pole">🅿️ {extra.pole}</span>}
                    {extra.overtakes && <span className="cal-bonus-chip overtakes">⚡ {extra.overtakes}</span>}
                    {extra.interpole && <span className="cal-bonus-chip interpole">🌧️ {extra.interpole}</span>}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {selectedRace && (
        <RaceResultsModal
          race={selectedRace}
          raceResults={seasonData.races}
          raceExtras={seasonData.raceExtras}
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
      name, ...DRIVER_TEAMS_BASE[name], ...CAREER_STATS[name],
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
            <div className="career-card" key={d.name} style={{ animationDelay: `${i * 0.03}s`, '--team-color': TEAM_COLORS[d.team] || 'var(--red)' }}>
              <div className="career-card-header">
                <div className="career-entity-dot" style={{ background: TEAM_COLORS[d.team] || '#555', color: TEAM_COLORS[d.team] || '#555' }} />
                <div className="career-entity-name">{d.flag} {d.name}</div>
              </div>
              <div className="career-stats">
                <div className="career-stat-box"><div className="career-stat-label">Punti</div><div className="career-stat-val pts">{d.totalPoints}</div></div>
                <div className="career-stat-box"><div className="career-stat-label">Pole</div><div className="career-stat-val poles">{d.totalPoles}</div></div>
                {driversWithInterpole.includes(d.name) && (
                  <div className="career-stat-box"><div className="career-stat-label">Interpole</div><div className="career-stat-val interpole">{d.totalInterpole || 0}</div></div>
                )}
                <div className="career-stat-box"><div className="career-stat-label">Vittorie</div><div className="career-stat-val wins">{d.totalWins}</div></div>
                <div className="career-stat-box"><div className="career-stat-label">Podi</div><div className="career-stat-val podiums">{d.totalPodiums}</div></div>
                <div className="career-stat-box"><div className="career-stat-label">Hat Trick</div><div className="career-stat-val HatTrick">{d.HatTrick}</div></div>
                <div className="career-stat-box"><div className="career-stat-label">Grand Slam</div><div className="career-stat-val GrandSlam">{d.GrandSlam}</div></div>
                <div className="career-stat-box"><div className="career-stat-label">WDC</div><div className="career-stat-val wdc">{d.championships}</div></div>
                <div className="career-stat-box"><div className="career-stat-label">WCC</div><div className="career-stat-val wcc">{d.constructorchamp}</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="career-section">
        <h3 className="career-section-title">Costruttori</h3>
        <div className="career-grid">
          {teams.map((t, i) => (
            <div className="career-card" key={t.team} style={{ animationDelay: `${i * 0.035}s`, '--team-color': TEAM_COLORS[t.team] || 'var(--red)' }}>
              <div className="career-card-header">
                <div className="career-entity-dot" style={{ background: TEAM_COLORS[t.team] || '#555', color: TEAM_COLORS[t.team] || '#555' }} />
                <div className="career-entity-name">{t.team}</div>
              </div>
              <div className="career-stats">
                <div className="career-stat-box"><div className="career-stat-label">Punti</div><div className="career-stat-val pts">{t.totalPoints}</div></div>
                <div className="career-stat-box"><div className="career-stat-label">Pole</div><div className="career-stat-val poles">{t.totalPoles}</div></div>
                <div className="career-stat-box"><div className="career-stat-label">Vittorie</div><div className="career-stat-val wins">{t.totalWins}</div></div>
                <div className="career-stat-box"><div className="career-stat-label">WCC</div><div className="career-stat-val wcc">{t.championships}</div></div>
                <div className="career-stat-box"><div className="career-stat-label">WDC</div><div className="career-stat-val wdc">{t.driverchamp}</div></div>
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
  const seasonData   = SEASON_DATA[season];
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
    const s1 = { points: 0, wins: 0, podiums: 0, poles: 0, raceWins: 0, races: [] };
    const s2 = { points: 0, wins: 0, podiums: 0, poles: 0, raceWins: 0, races: [] };
    seasonData.races.forEach(({ race, results }, idx) => {
      const pos1 = results.indexOf(driver1.name);
      const pos2 = results.indexOf(driver2.name);
      const extra = seasonData.raceExtras[idx] || {};
      if (pos1 >= 0 && pos1 < POINTS_TABLE.length) s1.points += POINTS_TABLE[pos1];
      if (pos2 >= 0 && pos2 < POINTS_TABLE.length) s2.points += POINTS_TABLE[pos2];
      if (pos1 === 0) s1.wins++;
      if (pos2 === 0) s2.wins++;
      if (pos1 >= 0 && pos1 < 3) s1.podiums++;
      if (pos2 >= 0 && pos2 < 3) s2.podiums++;
      ['pole','overtakes','interpole'].forEach(k => {
        if (extra[k] === driver1.name) s1.points++;
        if (extra[k] === driver2.name) s2.points++;
      });
      const poles = seasonData.driverPoles || {};
      s1.poles = poles[driver1.name] || 0;
      s2.poles = poles[driver2.name] || 0;
      if (pos1 >= 0 && pos2 >= 0) {
        if (pos1 < pos2) s1.raceWins++;
        else if (pos2 < pos1) s2.raceWins++;
        s1.races.push({ race, pos: pos1 + 1 });
        s2.races.push({ race, pos: pos2 + 1 });
      }
    });
    return { stats1: s1, stats2: s2 };
  }

  return (
    <div className="h2h-team-grid">
      {teamPairs.map(({ team, drivers }, idx) => {
        const [driver1, driver2] = drivers;
        const { stats1, stats2 } = calculateH2H(driver1, driver2);
        return (
          <div className="h2h-team-card" key={team} style={{ animationDelay: `${idx * 0.055}s` }}>
            <div className="h2h-team-header">
              <div className="h2h-team-dot" style={{ background: TEAM_COLORS[team] || '#555', boxShadow: `0 0 8px ${TEAM_COLORS[team] || '#555'}66` }} />
              <div className="h2h-team-name">{team}</div>
            </div>
            <div className="h2h-drivers-row">
              <div className="h2h-driver">
                <div className="h2h-driver-name"><span>{driver1.flag}</span><span>{driver1.name}</span></div>
                <div className="h2h-driver-num">#{driver1.num}</div>
              </div>
              <div className="h2h-vs">VS</div>
              <div className="h2h-driver right">
                <div className="h2h-driver-name"><span>{driver2.name}</span><span>{driver2.flag}</span></div>
                <div className="h2h-driver-num">#{driver2.num}</div>
              </div>
            </div>
            <div className="h2h-stats-grid">
              {[
                [stats1.points, stats2.points, "Punti"],
                [stats1.wins,   stats2.wins,   "Vittorie"],
                [stats1.podiums,stats2.podiums,"Podi"],
                [stats1.poles,  stats2.poles,  "Pole"],
                [stats1.raceWins,stats2.raceWins,"H2H"],
              ].map(([v1, v2, label]) => (
                <div className="h2h-stat-row" key={label}>
                  <div className={`h2h-stat-val left${v1 > v2 ? " winner" : ""}`}>{v1}</div>
                  <div className="h2h-stat-label">{label}</div>
                  <div className={`h2h-stat-val${v2 > v1 ? " winner" : ""}`}>{v2}</div>
                </div>
              ))}
            </div>
            {stats1.races.length > 0 && (
              <div className="h2h-detail-section">
                <div className="h2h-detail-title">Risultati Gara per Gara</div>
                <div className="h2h-race-results">
                  {stats1.races.map((r1, i) => {
                    const r2 = stats2.races[i];
                    return (
                      <div className="h2h-race-item" key={r1.race}>
                        <div className="h2h-race-name">{r1.race}</div>
                        <div className={`h2h-race-pos${r1.pos < r2.pos ? " winner" : ""}`}>P{r1.pos}</div>
                        <div className={`h2h-race-pos${r2.pos < r1.pos ? " winner" : ""}`}>P{r2.pos}</div>
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

// ─── RULES PAGE ───────────────────────────────────────────────────
function RulesPage() {
  const [expandedRules, setExpandedRules] = useState([]);
  const toggleRule = (id) => setExpandedRules(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  return (
    <div className="rules-grid">
      {RULES_CONFIG.map((rule, idx) => (
        <div key={rule.id} className={`rule-card${expandedRules.includes(rule.id) ? " expanded" : ""}`} style={{ animationDelay: `${idx * 0.08}s` }}>
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
                  <div key={i} className="rule-text-item">{line || <br />}</div>
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
  const [page, setPage]     = useState("leaderboard");
  const [season, setSeason] = useState(SEASONS[2]);
  const [pageKey, setPageKey] = useState(0);

  const seasonData     = SEASON_DATA[season];
  const completedRaces = seasonData.calendar.filter(r => r.status === "done").length;
  const totalRaces     = seasonData.calendar.length;

  const handleNav = (id) => { setPage(id); setPageKey(k => k + 1); };
  const handleSeason = (s) => { setSeason(s); setPageKey(k => k + 1); };

  const pageInfo = {
    leaderboard: { title: "Classifica Generale",   subtitle: `${season} · ${completedRaces}/${totalRaces} gare completate` },
    calendar:    { title: "Calendario",            subtitle: `${season} · ${totalRaces} gare programmate` },
    h2h:         { title: "Head-to-Head",          subtitle: `${season} · Confronto compagni di squadra` },
    career:      { title: "Statistiche Carriera",  subtitle: `Tutte le stagioni · Totali carriera` },
    setup:       { title: "Setup Creator",         subtitle: `Configura il tuo setup perfetto` },
    rules:       { title: "Regolamento",           subtitle: `Tutte le regole del campionato` },
  };

  const showSeasonSelector = ["leaderboard", "calendar", "h2h"].includes(page);

  return (
    <>
      <style>{css}</style>
      <div className="f1-root">
        <div className="f1-grid-bg" />
        <div className="f1-accent-lines" />
        <div className="f1-vignette" />
        <div className="f1-scanline" />

        <header className="f1-header">
          <div className="f1-header-top">
            <div className="f1-logo-area">
              <div className="f1-stripes">
                <div className="f1-stripe" />
                <div className="f1-stripe" />
                <div className="f1-stripe" />
              </div>
              <div className="f1-logo-text">
                <div className="f1-status">
                  <div className="f1-status-dot" />
                  <span className="f1-status-label">{season} · Live</span>
                </div>
                <div className="f1-title-row">
                  <h1 className="f1-title">F1 Dashboard</h1>
                  <span className="f1-subtitle">Pro · Season Manager</span>
                </div>
              </div>
            </div>
          </div>
          <nav className="f1-nav">
            {NAV.map((n) => (
              <button key={n.id} className={`f1-nav-btn${page === n.id ? " active" : ""}`} onClick={() => handleNav(n.id)}>
                <span className="f1-nav-icon">{n.icon}</span>{n.label}
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
            {showSeasonSelector && <SeasonSelector currentSeason={season} onSeasonChange={handleSeason} />}
          </div>

          <div key={pageKey} className="page-enter">
            {page === "leaderboard" && <LeaderboardPage season={season} />}
            {page === "calendar"    && <CalendarPage    season={season} />}
            {page === "h2h"         && <HeadToHeadPage  season={season} />}
            {page === "career"      && <CareerPage />}
            {page === "setup"       && <AdvancedSetupCreator />}
            {page === "rules"       && <RulesPage />}
          </div>
        </div>
      </div>
    </>
  );
}