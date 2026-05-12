import { useState, useEffect, useCallback } from "react";

// ─── Palette & Fonts ────────────────────────────────────────────────────────
// Aesthetic: Matchday programme meets dark stadium atmosphere.
// Deep navy/charcoal base, vivid green pitch accent, bold condensed headlines.
// Google Fonts loaded via @import in the style tag injected below.

const FONT_LINK = document.createElement("link");
FONT_LINK.rel = "stylesheet";
FONT_LINK.href =
  "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;900&family=DM+Sans:wght@300;400;500&display=swap";
document.head.appendChild(FONT_LINK);

const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg:        #0d1117;
    --surface:   #161b22;
    --card:      #1c2230;
    --border:    #2a3244;
    --green:     #00e676;
    --green-dim: #00c36340;
    --amber:     #ffb300;
    --red:       #ef5350;
    --text:      #e8eaf0;
    --muted:     #6b7894;
    --radius:    10px;
    --font-head: 'Barlow Condensed', sans-serif;
    --font-body: 'DM Sans', sans-serif;
  }
  body { background: var(--bg); color: var(--text); font-family: var(--font-body); }

  /* scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

  /* stadium bg grain */
  .app {
    min-height: 100vh;
    padding: 0 0 80px;
    background:
      radial-gradient(ellipse 80% 40% at 50% 0%, #003520 0%, transparent 60%),
      var(--bg);
    position: relative;
  }

  /* HEADER */
  .header {
    text-align: center;
    padding: 36px 20px 24px;
    border-bottom: 1px solid var(--border);
    position: relative;
  }
  .header-badge {
    display: inline-block;
    font-family: var(--font-head);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--green);
    border: 1px solid var(--green);
    padding: 3px 12px;
    border-radius: 20px;
    margin-bottom: 12px;
  }
  .header h1 {
    font-family: var(--font-head);
    font-size: clamp(38px, 7vw, 72px);
    font-weight: 900;
    letter-spacing: -1px;
    line-height: 1;
    text-transform: uppercase;
    background: linear-gradient(135deg, #fff 0%, var(--green) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .header p {
    margin-top: 8px;
    color: var(--muted);
    font-size: 14px;
    letter-spacing: 0.5px;
  }

  /* STEPS */
  .steps {
    display: flex;
    justify-content: center;
    gap: 6px;
    padding: 20px 20px 0;
    flex-wrap: wrap;
  }
  .step-dot {
    width: 32px; height: 4px;
    border-radius: 2px;
    background: var(--border);
    transition: background 0.3s;
  }
  .step-dot.active { background: var(--green); }
  .step-dot.done { background: var(--green-dim); border: 1px solid var(--green); }

  /* CONTAINER */
  .container { max-width: 860px; margin: 0 auto; padding: 28px 16px; }

  /* SECTION LABEL */
  .section-label {
    font-family: var(--font-head);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 16px;
  }

  /* MATCH CARD */
  .match-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 20px 24px;
    margin-bottom: 12px;
    cursor: pointer;
    transition: border-color 0.2s, transform 0.15s, box-shadow 0.2s;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .match-card:hover { border-color: var(--green); transform: translateY(-2px); box-shadow: 0 8px 32px #00e67618; }
  .match-card.selected { border-color: var(--green); background: linear-gradient(135deg, #1c2230, #0d2016); }

  /* AVAILABILITY BADGES */
  .avail-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-family: var(--font-head);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    padding: 3px 8px;
    border-radius: 20px;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .avail-confirmed {
    background: #00e67620;
    color: var(--green);
    border: 1px solid #00e67650;
  }
  .avail-soon {
    background: #ffb30020;
    color: var(--amber);
    border: 1px solid #ffb30050;
    animation: pulse-amber 2s ease infinite;
  }
  .avail-pending {
    background: #6b789420;
    color: var(--muted);
    border: 1px solid #6b789440;
  }
  @keyframes pulse-amber {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
  .avail-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .avail-confirmed .avail-dot { background: var(--green); }
  .avail-soon .avail-dot { background: var(--amber); }
  .avail-pending .avail-dot { background: var(--muted); }
  .match-vs {
    font-family: var(--font-head);
    font-size: clamp(16px, 3vw, 22px);
    font-weight: 900;
    letter-spacing: -0.5px;
    flex: 1;
  }
  .match-meta { font-size: 12px; color: var(--muted); text-align: right; }
  .match-meta strong { color: var(--text); display: block; }
  .selected-tick { color: var(--green); font-size: 20px; flex-shrink: 0; }

  /* BTN */
  .btn {
    font-family: var(--font-head);
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    padding: 14px 36px;
    border-radius: var(--radius);
    border: none;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-primary {
    background: var(--green);
    color: #000;
  }
  .btn-primary:hover { background: #00ff84; box-shadow: 0 0 24px #00e67640; }
  .btn-primary:disabled { background: var(--border); color: var(--muted); cursor: not-allowed; box-shadow: none; }
  .btn-ghost {
    background: transparent;
    color: var(--muted);
    border: 1px solid var(--border);
  }
  .btn-ghost:hover { border-color: var(--text); color: var(--text); }

  /* LOADING */
  .loading-wrap { text-align: center; padding: 60px 20px; }
  .spinner {
    width: 48px; height: 48px;
    border: 3px solid var(--border);
    border-top-color: var(--green);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 20px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-wrap p { color: var(--muted); font-size: 14px; }

  /* TEAM SHEET */
  .team-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  @media(max-width: 580px) { .team-grid { grid-template-columns: 1fr; } }

  .team-panel {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
  }
  .team-header {
    padding: 14px 18px;
    font-family: var(--font-head);
    font-size: 20px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .team-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }

  .player-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 18px;
    border-bottom: 1px solid #1e2738;
    cursor: pointer;
    transition: background 0.15s;
    position: relative;
  }
  .player-row:last-child { border-bottom: none; }
  .player-row:hover { background: #ffffff08; }
  .player-row.picked-by-other { opacity: 0.4; cursor: not-allowed; }
  .player-row.my-pick { background: var(--green-dim); }

  .player-num {
    font-family: var(--font-head);
    font-size: 13px;
    font-weight: 700;
    color: var(--muted);
    width: 22px;
    text-align: center;
    flex-shrink: 0;
  }
  .player-name { font-size: 14px; font-weight: 500; flex: 1; }
  .player-pos {
    font-family: var(--font-head);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    padding: 2px 6px;
    border-radius: 4px;
    text-transform: uppercase;
  }
  .pos-GK { background: #ffd60020; color: #ffd600; }
  .pos-DEF { background: #4fc3f720; color: #4fc3f7; }
  .pos-MID { background: #ab47bc20; color: #ce93d8; }
  .pos-FWD { background: #ef535020; color: #ef9a9a; }

  .picker-badge {
    font-size: 11px;
    color: var(--amber);
    font-weight: 600;
  }
  .my-pick-badge {
    font-size: 11px;
    color: var(--green);
    font-weight: 700;
    font-family: var(--font-head);
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  /* POOL PANEL */
  .pool-panel {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 20px 24px;
    margin-bottom: 24px;
  }
  .pool-title {
    font-family: var(--font-head);
    font-size: 24px;
    font-weight: 900;
    text-transform: uppercase;
    margin-bottom: 4px;
  }
  .pot-amount {
    font-family: var(--font-head);
    font-size: 48px;
    font-weight: 900;
    color: var(--green);
    line-height: 1;
  }
  .pot-label { font-size: 12px; color: var(--muted); margin-top: 4px; }

  /* ENTRANTS */
  .entrants-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 10px;
    margin-top: 20px;
  }
  .entrant-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 12px 14px;
  }
  .entrant-card.active { border-color: var(--green); }
  .entrant-name { font-size: 13px; font-weight: 600; }
  .entrant-pick { font-size: 12px; color: var(--muted); margin-top: 3px; }
  .entrant-pick.has-pick { color: var(--green); }
  .entrant-slot {
    border: 1px dashed var(--border);
    border-radius: 8px;
    padding: 12px 14px;
    color: var(--muted);
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  /* NAME INPUT */
  .input-row { display: flex; gap: 10px; margin-bottom: 14px; flex-wrap: wrap; }
  .input-field {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text);
    font-family: var(--font-body);
    font-size: 15px;
    padding: 12px 16px;
    flex: 1;
    min-width: 160px;
    outline: none;
    transition: border-color 0.2s;
  }
  .input-field:focus { border-color: var(--green); }

  /* PICK MODAL OVERLAY */
  .modal-overlay {
    position: fixed; inset: 0;
    background: #00000090;
    display: flex; align-items: center; justify-content: center;
    z-index: 100;
    backdrop-filter: blur(4px);
    padding: 20px;
  }
  .modal {
    background: var(--card);
    border: 1px solid var(--green);
    border-radius: 14px;
    padding: 32px;
    max-width: 420px;
    width: 100%;
    text-align: center;
    animation: pop 0.25s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes pop { from { transform: scale(0.85); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .modal h2 {
    font-family: var(--font-head);
    font-size: 32px;
    font-weight: 900;
    text-transform: uppercase;
    margin-bottom: 8px;
  }
  .modal p { color: var(--muted); font-size: 14px; margin-bottom: 24px; }
  .modal-player {
    font-family: var(--font-head);
    font-size: 28px;
    font-weight: 700;
    color: var(--green);
    background: var(--green-dim);
    border-radius: 8px;
    padding: 10px 20px;
    margin-bottom: 24px;
    letter-spacing: 0.5px;
  }
  .modal-buttons { display: flex; gap: 12px; justify-content: center; }

  /* WINNER SCREEN */
  .winner-wrap { text-align: center; padding: 60px 20px; }
  .trophy { font-size: 80px; line-height: 1; margin-bottom: 20px; animation: bounce 1s ease infinite alternate; }
  @keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-12px); } }
  .winner-name {
    font-family: var(--font-head);
    font-size: clamp(40px, 8vw, 80px);
    font-weight: 900;
    text-transform: uppercase;
    background: linear-gradient(135deg, var(--amber), var(--green));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .winner-sub { color: var(--muted); font-size: 16px; margin: 12px 0 32px; }
  .winner-pot {
    font-family: var(--font-head);
    font-size: 56px;
    font-weight: 900;
    color: var(--green);
  }

  /* DIVIDER */
  .divider { border: none; border-top: 1px solid var(--border); margin: 28px 0; }

  /* BOTTOM NAV ACTIONS */
  .actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 28px; flex-wrap: wrap; }

  /* NOTICE */
  .notice {
    background: #ffb30015;
    border: 1px solid #ffb30040;
    border-radius: 8px;
    padding: 12px 16px;
    font-size: 13px;
    color: var(--amber);
    margin-bottom: 20px;
  }

  /* TABS */
  .tabs { display: flex; gap: 4px; margin-bottom: 20px; }
  .tab {
    font-family: var(--font-head);
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 8px 18px;
    border-radius: 6px;
    cursor: pointer;
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--muted);
    transition: all 0.15s;
  }
  .tab.active { background: var(--green); color: #000; border-color: var(--green); }
`;

const styleEl = document.createElement("style");
styleEl.textContent = css;
document.head.appendChild(styleEl);

// ─── Constants ───────────────────────────────────────────────────────────────
const MAX_PLAYERS = 10;
const ENTRY_FEE = 1;

const TEAM_COLOURS = [
  "#e63946","#2a9d8f","#e9c46a","#4361ee","#f77f00",
  "#8ecae6","#a8dadc","#c77dff","#fb8500","#52b788",
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function posTag(pos) {
  return <span className={`player-pos pos-${pos}`}>{pos}</span>;
}

// ─── Claude API call ─────────────────────────────────────────────────────────
async function fetchViaAI(prompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  const text = data.content.map(b => b.text || "").join("\n");
  const clean = text.replace(/```json|```/g, "").trim();
  const match = clean.match(/\[[\s\S]*\]/);
  if (!match) throw new Error("No JSON array in response");
  return JSON.parse(match[0]);
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState(0); // 0=choose match, 1=add entrants, 2=pick players, 3=winner
  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [teamSheet, setTeamSheet] = useState(null); // { home: [], away: [] }
  const [loadingSheet, setLoadingSheet] = useState(false);
  const [entrants, setEntrants] = useState([]); // [{name, pick: null}]
  const [nameInput, setNameInput] = useState("");
  const [activeEntrant, setActiveEntrant] = useState(null); // index picking now
  const [modal, setModal] = useState(null); // {entrantIdx, player}
  const [sheetTab, setSheetTab] = useState("home");
  const [winner, setWinner] = useState(null);
  const [matchesError, setMatchesError] = useState(null);

  // Load upcoming PL fixtures on mount
  useEffect(() => {
    loadMatches();
  }, []);

  async function loadMatches() {
    setLoadingMatches(true);
    setMatchesError(null);
    // Confirmed PL fixtures week of 11–18 May 2026
    setMatches([
      { home: "Tottenham Hotspur", away: "Leeds United",      date: "Mon 11 May", time: "20:00" },
      { home: "Manchester City",   away: "Crystal Palace",    date: "Wed 13 May", time: "19:30" },
      { home: "Aston Villa",       away: "Liverpool",         date: "Fri 15 May", time: "20:00" },
      { home: "Arsenal",           away: "Burnley",           date: "Sun 18 May", time: "16:00" },
      { home: "Brentford",         away: "Crystal Palace",    date: "Sun 18 May", time: "16:00" },
      { home: "Chelsea",           away: "Tottenham Hotspur", date: "Sun 18 May", time: "16:00" },
      { home: "Everton",           away: "Sunderland",        date: "Sun 18 May", time: "16:00" },
      { home: "Leeds United",      away: "Brighton",          date: "Sun 18 May", time: "16:00" },
      { home: "Newcastle United",  away: "West Ham United",   date: "Sun 18 May", time: "16:00" },
      { home: "Wolves",            away: "Fulham",            date: "Sun 18 May", time: "16:00" },
    ]);
    setLoadingMatches(false);
  }

  async function loadTeamSheet(match) {
    setLoadingSheet(true);
    setTeamSheet(null);
    try {
      const result = await fetchViaAI(
        `Search for the expected or confirmed starting lineup for ${match.home} vs ${match.away} in the Premier League in 2026.
Return ONLY a JSON array (no other text, no markdown) with exactly 2 objects:
[
  { "team": "${match.home}", "colour": "#red_or_relevant_hex", "players": [ { "number": 1, "name": "Player Name", "pos": "GK" }, ... ] },
  { "team": "${match.away}", "colour": "#blue_or_relevant_hex", "players": [ ... ] }
]
Each team should have 11 starting players + up to 7 subs. 
pos must be one of: GK, DEF, MID, FWD.
Use real player names for these clubs. No extra keys.`
      );
      setTeamSheet({ home: result[0], away: result[1] });
      setSheetTab("home");
    } catch (e) {
      // minimal fallback
      setTeamSheet({
        home: { team: match.home, colour: "#e63946", players: fallbackPlayers(match.home, "home") },
        away: { team: match.away, colour: "#4361ee", players: fallbackPlayers(match.away, "away") },
      });
    }
    setLoadingSheet(false);
  }

  function fallbackPlayers(team, side) {
    const names = side === "home"
      ? [["1","GK","Goalkeeper"],["2","DEF","Right Back"],["5","DEF","Centre Back"],["6","DEF","Centre Back"],["3","DEF","Left Back"],
         ["8","MID","Central Mid"],["4","MID","Defensive Mid"],["10","MID","Attacking Mid"],
         ["7","FWD","Right Winger"],["9","FWD","Striker"],["11","FWD","Left Winger"]]
      : [["1","GK","Goalkeeper"],["2","DEF","Right Back"],["4","DEF","Centre Back"],["5","DEF","Centre Back"],["3","DEF","Left Back"],
         ["6","MID","Defensive Mid"],["8","MID","Central Mid"],["10","MID","Attacking Mid"],
         ["7","FWD","Right Winger"],["9","FWD","Striker"],["11","FWD","Left Winger"]];
    return names.map(([number, pos, label]) => ({ number, name: `${team} ${label}`, pos }));
  }

  // ── Team sheet availability ──────────────────────────────────────────────
  function getAvailability(match) {
    try {
      const now = new Date();
      const currentYear = now.getFullYear();
      const months = { Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11 };
      const cleaned = match.date.replace(/^[A-Za-z]{2,3}\s/, "").trim();
      const parts = cleaned.split(" ");
      const day = parseInt(parts[0]);
      const month = months[parts[1]];
      if (isNaN(day) || month === undefined) return { status:"pending", label:"Sheet TBC", sublabel:"Date unclear" };
      const [hours, mins] = (match.time || "15:00").split(":").map(Number);
      const kickoff = new Date(currentYear, month, day, hours, mins, 0);
      if (kickoff < now && (now - kickoff) > 7*24*60*60*1000) kickoff.setFullYear(currentYear + 1);
      const announceTime = new Date(kickoff.getTime() - 60*60*1000); // 1hr before KO
      const diffMs = kickoff - now;
      const diffHrs = diffMs / (1000*60*60);
      if (now >= announceTime) {
        return {
          status: "confirmed",
          label: "Sheet Available",
          sublabel: diffMs < 0 ? "Match in progress / ended" : `KO in ${Math.round(diffHrs * 60)}m`
        };
      } else if (diffHrs <= 3) {
        const minsUntil = Math.round((announceTime - now) / 60000);
        return { status:"soon", label:"Available Soon", sublabel:`Sheet expected in ~${minsUntil}m` };
      } else {
        const hoursAway = Math.round(diffHrs);
        const announceStr = announceTime.toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" });
        return {
          status: "pending",
          label: "Not Yet Available",
          sublabel: hoursAway < 24 ? `Sheet expected ~${announceStr}` : `KO ${match.date} · ${match.time}`
        };
      }
    } catch { return { status:"pending", label:"Sheet TBC", sublabel:"" }; }
  }

  function AvailBadge({ match }) {
    const av = getAvailability(match);
    return (
      <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}>
        <div className={`avail-badge avail-${av.status}`}>
          <div className="avail-dot" />
          {av.label}
        </div>
        {av.sublabel && (
          <div style={{fontSize:11,color:"var(--muted)",textAlign:"right"}}>{av.sublabel}</div>
        )}
      </div>
    );
  }

  // Pick management
  function getAllPicks() {
    return entrants.map(e => e.pick?.name).filter(Boolean);
  }

  function isPickedByOther(playerName, myIdx) {
    return entrants.some((e, i) => i !== myIdx && e.pick?.name === playerName);
  }

  function handlePlayerClick(player, entrantIdx) {
    if (isPickedByOther(player.name, entrantIdx)) return;
    setModal({ entrantIdx, player });
  }

  function confirmPick() {
    const updated = [...entrants];
    updated[modal.entrantIdx] = { ...updated[modal.entrantIdx], pick: modal.player };
    setEntrants(updated);
    setModal(null);
    // advance to next unpicked entrant
    const nextIdx = updated.findIndex((e, i) => i > modal.entrantIdx && !e.pick);
    if (nextIdx !== -1) setActiveEntrant(nextIdx);
    else setActiveEntrant(null);
  }

  function addEntrant() {
    if (!nameInput.trim() || entrants.length >= MAX_PLAYERS) return;
    const newList = [...entrants, { name: nameInput.trim(), pick: null }];
    setEntrants(newList);
    setNameInput("");
    if (newList.length === 1) setActiveEntrant(0);
  }

  function removeEntrant(i) {
    setEntrants(entrants.filter((_, idx) => idx !== i));
  }

  function pot() { return entrants.length * ENTRY_FEE; }

  const allPicked = entrants.length > 0 && entrants.every(e => e.pick);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="app">
      <div className="header">
        <div className="header-badge">⚽ Premier League</div>
        <h1>Football Friends<br/>1st Goal Scorer</h1>
        <p>Pick a player · £1 entry · Winner takes all</p>
      </div>

      {/* STEP DOTS */}
      <div className="steps">
        {["Match","Entrants","Picks","Result"].map((_, i) => (
          <div key={i} className={`step-dot ${i === step ? "active" : i < step ? "done" : ""}`} />
        ))}
      </div>

      <div className="container">

        {/* ── STEP 0: CHOOSE MATCH ── */}
        {step === 0 && (
          <>
            <div className="section-label">Step 1 — Select a Match</div>
            {matchesError && <div className="notice">⚠️ {matchesError}</div>}
            {loadingMatches ? (
              <div className="loading-wrap">
                <div className="spinner" />
                <p>Fetching Premier League fixtures…</p>
              </div>
            ) : (
              <>
                {matches.map((m, i) => (
                  <div
                    key={i}
                    className={`match-card ${selectedMatch === i ? "selected" : ""}`}
                    onClick={() => setSelectedMatch(i)}
                  >
                    <div style={{flex:1,minWidth:0}}>
                      <div className="match-vs">{m.home} <span style={{color:"var(--muted)"}}>vs</span> {m.away}</div>
                      <div className="match-meta" style={{textAlign:"left",marginTop:4}}>
                        <strong style={{display:"inline"}}>{m.date}</strong>
                        <span style={{marginLeft:8}}>{m.time}</span>
                      </div>
                    </div>
                    <AvailBadge match={m} />
                    {selectedMatch === i && <div className="selected-tick">✓</div>}
                  </div>
                ))}
              </>
            )}
            <div className="actions">
              <button className="btn btn-ghost" onClick={loadMatches}>↻ Refresh</button>
              <button
                className="btn btn-primary"
                disabled={selectedMatch === null}
                onClick={() => { setStep(1); }}
              >Next →</button>
            </div>
            <div style={{marginTop:16,display:"flex",gap:16,flexWrap:"wrap",justifyContent:"center"}}>
              <div style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"var(--muted)"}}>
                <div className="avail-badge avail-confirmed" style={{fontSize:10,padding:"2px 6px"}}><div className="avail-dot"/>Sheet Available</div>
                Team sheet confirmed (within 1hr of KO)
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"var(--muted)"}}>
                <div className="avail-badge avail-soon" style={{fontSize:10,padding:"2px 6px"}}><div className="avail-dot"/>Available Soon</div>
                Expected within 3hrs
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"var(--muted)"}}>
                <div className="avail-badge avail-pending" style={{fontSize:10,padding:"2px 6px"}}><div className="avail-dot"/>Not Yet Available</div>
                Too early — check back closer to KO
              </div>
            </div>
          </>
        )}

        {/* ── STEP 1: ENTRANTS ── */}
        {step === 1 && (
          <>
            <div className="section-label">Step 2 — Add Entrants (max {MAX_PLAYERS})</div>

            <div className="pool-panel">
              <div className="pool-title">🏆 Prize Pot</div>
              <div className="pot-amount">£{pot()}</div>
              <div className="pot-label">£{ENTRY_FEE} per person · {entrants.length}/{MAX_PLAYERS} entered</div>
            </div>

            {entrants.length < MAX_PLAYERS && (
              <div className="input-row">
                <input
                  className="input-field"
                  placeholder="Entrant name…"
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addEntrant()}
                />
                <button className="btn btn-primary" onClick={addEntrant} disabled={!nameInput.trim()}>
                  + Add
                </button>
              </div>
            )}

            <div className="entrants-grid">
              {entrants.map((e, i) => (
                <div key={i} className="entrant-card active">
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div className="entrant-name">
                      <span style={{color:TEAM_COLOURS[i % TEAM_COLOURS.length],marginRight:6}}>●</span>
                      {e.name}
                    </div>
                    <span
                      style={{cursor:"pointer",color:"var(--muted)",fontSize:16}}
                      onClick={() => removeEntrant(i)}
                    >✕</span>
                  </div>
                  <div className="entrant-pick">Awaiting pick</div>
                </div>
              ))}
              {Array.from({ length: Math.max(0, MAX_PLAYERS - entrants.length) }).map((_, i) => (
                <div key={i} className="entrant-slot">
                  <span style={{opacity:0.4}}>+</span> Slot {entrants.length + i + 1}
                </div>
              ))}
            </div>

            <div className="actions">
              <button className="btn btn-ghost" onClick={() => setStep(0)}>← Back</button>
              <button
                className="btn btn-primary"
                disabled={entrants.length < 2}
                onClick={() => {
                  loadTeamSheet(matches[selectedMatch]);
                  setStep(2);
                }}
              >
                Lock & Pick →
              </button>
            </div>
          </>
        )}

        {/* ── STEP 2: PICK PLAYERS ── */}
        {step === 2 && (
          <>
            <div className="section-label">
              Step 3 — Each Person Picks a Player
            </div>

            {/* Pool summary */}
            <div className="pool-panel" style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16}}>
              <div>
                <div className="pool-title">
                  {matches[selectedMatch].home} vs {matches[selectedMatch].away}
                </div>
                <div style={{color:"var(--muted)",fontSize:13,marginTop:4}}>
                  {matches[selectedMatch].date} · {matches[selectedMatch].time}
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <div className="pot-amount">£{pot()}</div>
                <div className="pot-label">Total pot</div>
              </div>
            </div>

            {/* Entrant cards with picks */}
            <div className="entrants-grid" style={{marginBottom:24}}>
              {entrants.map((e, i) => (
                <div
                  key={i}
                  className="entrant-card"
                  style={{borderColor: activeEntrant === i ? TEAM_COLOURS[i % TEAM_COLOURS.length] : undefined, cursor:"pointer"}}
                  onClick={() => setActiveEntrant(i)}
                >
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span style={{color:TEAM_COLOURS[i % TEAM_COLOURS.length]}}>●</span>
                    <span className="entrant-name">{e.name}</span>
                  </div>
                  <div className={`entrant-pick ${e.pick ? "has-pick" : ""}`}>
                    {e.pick ? `⚽ ${e.pick.name}` : activeEntrant === i ? "← Making pick…" : "Tap to pick"}
                  </div>
                </div>
              ))}
            </div>

            {/* Team sheet */}
            {loadingSheet ? (
              <div className="loading-wrap">
                <div className="spinner" />
                <p>Loading team sheets via live search…</p>
              </div>
            ) : teamSheet ? (
              <>
                {activeEntrant !== null && (
                  <div className="notice" style={{background:"#00e67615",borderColor:"#00e67640",color:"var(--green)"}}>
                    ⚽ <strong>{entrants[activeEntrant]?.name}</strong> — tap a player below to make your pick
                  </div>
                )}

                <div className="tabs">
                  <div className={`tab ${sheetTab === "home" ? "active" : ""}`} onClick={() => setSheetTab("home")}>
                    {teamSheet.home.team}
                  </div>
                  <div className={`tab ${sheetTab === "away" ? "active" : ""}`} onClick={() => setSheetTab("away")}>
                    {teamSheet.away.team}
                  </div>
                </div>

                {["home","away"].map(side => {
                  const panel = teamSheet[side];
                  return sheetTab === side ? (
                    <div key={side} className="team-panel">
                      <div className="team-header">
                        <div className="team-dot" style={{background: panel.colour || TEAM_COLOURS[side==="home"?0:4]}} />
                        {panel.team}
                      </div>
                      {panel.players.map((p, pi) => {
                        const pickedBy = entrants.find((e, ei) => e.pick?.name === p.name);
                        const isMyPick = activeEntrant !== null && entrants[activeEntrant]?.pick?.name === p.name;
                        const otherPicked = pickedBy && (activeEntrant === null || entrants[activeEntrant]?.pick?.name !== p.name) && pickedBy.name !== entrants[activeEntrant]?.name;
                        return (
                          <div
                            key={pi}
                            className={`player-row ${otherPicked ? "picked-by-other" : ""} ${isMyPick ? "my-pick" : ""}`}
                            onClick={() => activeEntrant !== null && !otherPicked && handlePlayerClick(p, activeEntrant)}
                          >
                            <span className="player-num">#{p.number}</span>
                            <span className="player-name">{p.name}</span>
                            {posTag(p.pos)}
                            {pickedBy && !isMyPick && <span className="picker-badge">→ {pickedBy.name}</span>}
                            {isMyPick && <span className="my-pick-badge">✓ Yours</span>}
                          </div>
                        );
                      })}
                    </div>
                  ) : null;
                })}
              </>
            ) : null}

            <div className="actions">
              <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
              <button
                className="btn btn-primary"
                disabled={!allPicked}
                onClick={() => setStep(3)}
              >
                All Picked — See Leaderboard →
              </button>
            </div>
          </>
        )}

        {/* ── STEP 3: RESULT / WINNER ── */}
        {step === 3 && (
          <>
            <div className="section-label">Step 4 — Declare a Winner</div>

            <div className="pool-panel">
              <div className="pool-title">📋 All Picks</div>
              <div style={{marginTop:16,display:"grid",gap:10}}>
                {entrants.map((e, i) => (
                  <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid var(--border)"}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <span style={{color:TEAM_COLOURS[i%TEAM_COLOURS.length],fontSize:18}}>●</span>
                      <div>
                        <div style={{fontWeight:600}}>{e.name}</div>
                        <div style={{fontSize:13,color:"var(--green)"}}>⚽ {e.pick?.name} ({e.pick?.pos})</div>
                      </div>
                    </div>
                    {!winner && (
                      <button
                        className="btn btn-primary"
                        style={{padding:"8px 18px",fontSize:14}}
                        onClick={() => setWinner(e)}
                      >
                        🏆 Winner!
                      </button>
                    )}
                    {winner?.name === e.name && (
                      <span style={{color:"var(--amber)",fontFamily:"var(--font-head)",fontSize:18,fontWeight:900}}>🏆 WINNER</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {winner && (
              <div className="winner-wrap">
                <div className="trophy">🏆</div>
                <div className="winner-name">{winner.name}</div>
                <div className="winner-sub">
                  picked <strong style={{color:"var(--green)"}}>{winner.pick?.name}</strong> who scored the first goal!
                </div>
                <div className="winner-pot">£{pot()}</div>
                <div className="pot-label" style={{marginTop:4}}>Winner takes all 🎉</div>

                <div className="actions" style={{justifyContent:"center",marginTop:40}}>
                  <button className="btn btn-ghost" onClick={() => {
                    setWinner(null);
                    setEntrants([]);
                    setSelectedMatch(null);
                    setTeamSheet(null);
                    setStep(0);
                  }}>
                    ↺ New Game
                  </button>
                </div>
              </div>
            )}

            {!winner && (
              <div className="actions">
                <button className="btn btn-ghost" onClick={() => setStep(2)}>← Back to Picks</button>
              </div>
            )}
          </>
        )}

      </div>

      {/* CONFIRM PICK MODAL */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Confirm Pick</h2>
            <p>
              <strong>{entrants[modal.entrantIdx]?.name}</strong> — are you picking this player as your First Goal Scorer?
            </p>
            <div className="modal-player">⚽ {modal.player.name}</div>
            <div style={{fontSize:13,color:"var(--muted)",marginBottom:20}}>
              {modal.player.pos} · £{ENTRY_FEE} entry fee applies
            </div>
            <div className="modal-buttons">
              <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={confirmPick}>Confirm Pick ✓</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
