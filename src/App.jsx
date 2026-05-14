import { useState, useEffect } from "react";

const FONT_LINK = document.createElement("link");
FONT_LINK.rel = "stylesheet";
FONT_LINK.href = "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;900&family=DM+Sans:wght@300;400;500&display=swap";
document.head.appendChild(FONT_LINK);

const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0a0a0a;
    --surface: #111111;
    --card: #1a1a1a;
    --border: #2d2d2d;
    --red: #e63946;
    --red-dim: #e6394620;
    --red-bright: #ff4d5a;
    --amber: #ffb300;
    --text: #f0f0f0;
    --muted: #666;
    --radius: 10px;
    --font-head: 'Barlow Condensed', sans-serif;
    --font-body: 'DM Sans', sans-serif;
  }
  body { background: var(--bg); color: var(--text); font-family: var(--font-body); }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

  .app {
    min-height: 100vh; padding: 0 0 80px;
    background: radial-gradient(ellipse 80% 35% at 50% 0%, #3a0a0a 0%, transparent 65%), var(--bg);
  }

  /* HEADER */
  .header {
    text-align: center; padding: 40px 20px 28px;
    border-bottom: 1px solid var(--border);
    position: relative;
  }
  .header-ball { font-size: 36px; margin-bottom: 8px; display: block; }
  .header h1 {
    font-family: var(--font-head); font-size: clamp(38px, 8vw, 72px); font-weight: 900;
    letter-spacing: -1px; line-height: 0.95; text-transform: uppercase;
    background: linear-gradient(135deg, #ffffff 0%, var(--red) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .header-sub {
    margin-top: 10px; color: var(--muted); font-size: 13px; letter-spacing: 2px;
    text-transform: uppercase; font-family: var(--font-head); font-weight: 600;
  }
  .header-divider {
    width: 60px; height: 3px; background: var(--red); margin: 14px auto 0; border-radius: 2px;
  }

  /* GAME INFO BAR */
  .game-bar {
    background: var(--surface); border-bottom: 1px solid var(--border);
    padding: 8px 20px; display: flex; align-items: center; justify-content: center;
    gap: 16px; font-size: 12px; color: var(--muted);
  }
  .game-bar strong { color: var(--text); font-family: var(--font-head); font-size: 14px; letter-spacing: 1px; }
  .leave-btn {
    color: var(--red); font-size: 11px; font-family: var(--font-head); font-weight: 700;
    letter-spacing: 1px; text-transform: uppercase; cursor: pointer; border: 1px solid var(--red);
    padding: 2px 8px; border-radius: 4px; transition: all 0.15s;
  }
  .leave-btn:hover { background: var(--red); color: #fff; }

  /* CONTAINER */
  .container { max-width: 680px; margin: 0 auto; padding: 28px 16px; }

  /* SECTION LABEL */
  .section-label {
    font-family: var(--font-head); font-size: 11px; font-weight: 700;
    letter-spacing: 3px; text-transform: uppercase; color: var(--muted); margin-bottom: 14px;
  }

  /* CARD */
  .card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 20px 22px; margin-bottom: 12px;
  }
  .card.accent-border { border-color: var(--red); }
  .card.accent-border { box-shadow: 0 0 20px #e6394410; }

  /* BUTTONS */
  .btn {
    font-family: var(--font-head); font-size: 18px; font-weight: 700;
    letter-spacing: 1px; text-transform: uppercase; padding: 14px 28px;
    border-radius: var(--radius); border: none; cursor: pointer; transition: all 0.2s;
    display: inline-block; text-align: center; width: 100%;
  }
  .btn-primary { background: var(--red); color: #fff; }
  .btn-primary:hover { background: var(--red-bright); box-shadow: 0 0 24px #e6394450; }
  .btn-primary:disabled { background: var(--border); color: var(--muted); cursor: not-allowed; box-shadow: none; }
  .btn-ghost { background: transparent; color: var(--muted); border: 1px solid var(--border); }
  .btn-ghost:hover { border-color: var(--text); color: var(--text); }
  .btn-sm { font-size: 13px; padding: 8px 16px; width: auto; }
  .btn-winner { background: linear-gradient(135deg, #c9a227, #ffb300); color: #000; }
  .btn-winner:hover { box-shadow: 0 0 20px #ffb30060; }

  /* INPUT */
  .input-field {
    background: var(--surface); border: 1px solid var(--border); border-radius: 8px;
    color: var(--text); font-family: var(--font-body); font-size: 15px;
    padding: 13px 16px; width: 100%; outline: none; transition: border-color 0.2s; margin-bottom: 12px;
  }
  .input-field:focus { border-color: var(--red); }

  /* LOADING */
  .loading-wrap { text-align: center; padding: 60px 20px; }
  .spinner {
    width: 44px; height: 44px; border: 3px solid var(--border);
    border-top-color: var(--red); border-radius: 50%;
    animation: spin 0.8s linear infinite; margin: 0 auto 16px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-wrap p { color: var(--muted); font-size: 14px; }

  /* MATCH CARDS */
  .match-card {
    background: var(--card); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 16px 18px; margin-bottom: 10px; cursor: pointer;
    transition: border-color 0.2s, transform 0.15s, box-shadow 0.2s;
    display: flex; align-items: center; gap: 12px;
  }
  .match-card:hover { border-color: var(--red); transform: translateY(-2px); box-shadow: 0 6px 24px #e6394420; }
  .match-card.selected { border-color: var(--red); background: linear-gradient(135deg, #1a1a1a, #1a0505); box-shadow: 0 6px 24px #e6394420; }
  .match-vs { font-family: var(--font-head); font-size: clamp(15px,3vw,20px); font-weight: 900; flex: 1; }
  .match-meta { font-size: 12px; color: var(--muted); }

  /* AVAILABILITY */
  .avail-badge {
    display: inline-flex; align-items: center; gap: 5px; font-family: var(--font-head);
    font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
    padding: 3px 8px; border-radius: 20px; white-space: nowrap;
  }
  .avail-confirmed { background: #00e67620; color: #00e676; border: 1px solid #00e67650; }
  .avail-soon { background: #ffb30020; color: var(--amber); border: 1px solid #ffb30050; animation: pulse 2s ease infinite; }
  .avail-pending { background: #ffffff10; color: var(--muted); border: 1px solid #ffffff20; }
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
  .avail-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .avail-confirmed .avail-dot { background: #00e676; }
  .avail-soon .avail-dot { background: var(--amber); }
  .avail-pending .avail-dot { background: var(--muted); }

  /* TEAM SHEET */
  .team-panel { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; margin-bottom: 14px; }
  .team-header {
    padding: 13px 18px; font-family: var(--font-head); font-size: 19px; font-weight: 900;
    text-transform: uppercase; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 10px;
    background: linear-gradient(135deg, #1a1a1a, #111);
  }
  .team-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
  .player-row {
    display: flex; align-items: center; gap: 10px; padding: 10px 18px;
    border-bottom: 1px solid #1e1e1e; cursor: pointer; transition: background 0.15s;
  }
  .player-row:last-child { border-bottom: none; }
  .player-row:hover { background: #ffffff06; }
  .player-row.taken { opacity: 0.3; cursor: not-allowed; }
  .player-row.mine { background: var(--red-dim); }
  .player-num { font-family: var(--font-head); font-size: 13px; font-weight: 700; color: var(--muted); width: 22px; text-align: center; flex-shrink: 0; }
  .player-name { font-size: 14px; font-weight: 500; flex: 1; }
  .player-pos { font-family: var(--font-head); font-size: 11px; font-weight: 700; letter-spacing: 1px; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; flex-shrink: 0; }
  .pos-GK { background: #ffd60020; color: #ffd600; }
  .pos-DEF { background: #4fc3f720; color: #4fc3f7; }
  .pos-MID { background: #ab47bc20; color: #ce93d8; }
  .pos-FWD { background: #e6394820; color: #ff8a80; }

  /* TABS */
  .tabs { display: flex; gap: 6px; margin-bottom: 14px; }
  .tab {
    font-family: var(--font-head); font-size: 14px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 1px; padding: 8px 18px; border-radius: 6px; cursor: pointer; flex: 1; text-align: center;
    background: var(--surface); border: 1px solid var(--border); color: var(--muted); transition: all 0.15s;
  }
  .tab.active { background: var(--red); color: #fff; border-color: var(--red); }

  /* MODAL */
  .modal-overlay {
    position: fixed; inset: 0; background: #000000b0; display: flex; align-items: center;
    justify-content: center; z-index: 100; backdrop-filter: blur(6px); padding: 20px;
  }
  .modal {
    background: var(--card); border: 1px solid var(--red); border-radius: 14px;
    padding: 32px; max-width: 400px; width: 100%; text-align: center;
    animation: pop 0.25s cubic-bezier(0.34,1.56,0.64,1);
    box-shadow: 0 0 60px #e6394430;
  }
  @keyframes pop { from { transform: scale(0.85); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .modal h2 { font-family: var(--font-head); font-size: 28px; font-weight: 900; text-transform: uppercase; margin-bottom: 6px; }
  .modal-player {
    font-family: var(--font-head); font-size: 24px; font-weight: 700; color: var(--red);
    background: var(--red-dim); border-radius: 8px; padding: 10px 20px; margin: 16px 0;
    border: 1px solid #e6394840;
  }

  /* NOTICES */
  .notice { background: #ffb30012; border: 1px solid #ffb30030; border-radius: 8px; padding: 12px 16px; font-size: 13px; color: var(--amber); margin-bottom: 14px; }
  .success-notice { background: #00e67612; border: 1px solid #00e67630; border-radius: 8px; padding: 12px 16px; font-size: 13px; color: #00e676; margin-bottom: 14px; }
  .error-notice { background: #e6394812; border: 1px solid #e6394830; border-radius: 8px; padding: 12px 16px; font-size: 13px; color: var(--red); margin-bottom: 14px; }

  /* PLAYER ROWS */
  .pick-row { display: flex; align-items: center; justify-content: space-between; padding: 13px 0; border-bottom: 1px solid var(--border); }
  .pick-row:last-child { border-bottom: none; }

  /* POT */
  .pot-big { font-family: var(--font-head); font-size: 64px; font-weight: 900; color: var(--red); line-height: 1; }

  /* WINNER */
  .winner-wrap { text-align: center; padding: 40px 20px; }
  .trophy { font-size: 80px; display: block; animation: bounce 1s ease infinite alternate; margin-bottom: 16px; }
  @keyframes bounce { from { transform: translateY(0) rotate(-5deg); } to { transform: translateY(-14px) rotate(5deg); } }
  .winner-name {
    font-family: var(--font-head); font-size: clamp(44px,10vw,80px); font-weight: 900;
    text-transform: uppercase; line-height: 1;
    background: linear-gradient(135deg, #fff, var(--red));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .winner-pick { color: var(--muted); font-size: 16px; margin: 10px 0 24px; }
  .winner-pick strong { color: #fff; }

  /* SHARE BOX */
  .share-box {
    background: var(--surface); border: 1px solid var(--red); border-radius: 8px;
    padding: 14px 18px; font-size: 14px; word-break: break-all; color: var(--red);
    margin: 10px 0; cursor: pointer; text-align: center; transition: background 0.15s;
  }
  .share-box:hover { background: var(--red-dim); }

  /* ROLE BADGE */
  .role-badge {
    font-family: var(--font-head); font-size: 10px; font-weight: 700; letter-spacing: 1.5px;
    text-transform: uppercase; padding: 2px 7px; border-radius: 10px;
    background: var(--red-dim); color: var(--red); border: 1px solid #e6394840;
  }

  /* HOME SCREEN */
  .home-hero { text-align: center; padding: 32px 0 24px; }
  .home-hero-icon { font-size: 56px; margin-bottom: 16px; display: block; }
  .home-hero h2 { font-family: var(--font-head); font-size: 28px; font-weight: 900; text-transform: uppercase; margin-bottom: 6px; }
  .home-hero p { color: var(--muted); font-size: 14px; margin-bottom: 28px; }
  .home-grid { display: grid; gap: 12px; }
  .home-option {
    background: var(--card); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 20px; cursor: pointer; transition: all 0.2s; text-align: left; display: flex; align-items: center; gap: 16px;
  }
  .home-option:hover { border-color: var(--red); transform: translateY(-2px); box-shadow: 0 6px 24px #e6394420; }
  .home-option-icon { font-size: 32px; flex-shrink: 0; }
  .home-option-title { font-family: var(--font-head); font-size: 20px; font-weight: 900; text-transform: uppercase; }
  .home-option-sub { font-size: 13px; color: var(--muted); margin-top: 2px; }

  /* LOBBY PLAYERS */
  .lobby-player {
    background: var(--surface); border: 1px solid var(--border); border-radius: 8px;
    padding: 12px 16px; display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 8px;
  }
  .lobby-player.admin-player { border-color: var(--red); }

  /* ACTIONS */
  .actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; flex-wrap: wrap; }

  /* STATS BAR */
  .stats-bar {
    display: flex; gap: 0; background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); overflow: hidden; margin-bottom: 20px;
  }
  .stat-item { flex: 1; text-align: center; padding: 14px 10px; border-right: 1px solid var(--border); }
  .stat-item:last-child { border-right: none; }
  .stat-value { font-family: var(--font-head); font-size: 28px; font-weight: 900; color: var(--red); }
  .stat-label { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; font-family: var(--font-head); }
`;

const styleEl = document.createElement("style");
styleEl.textContent = css;
document.head.appendChild(styleEl);

const ENTRY_FEE = 1;
const MAX_PLAYERS = 10;
const TEAM_COLOURS = ["#e63946","#ff6b35","#c9a227","#4361ee","#9b5de5","#00b4d8","#06d6a0","#fb8500","#e63946","#52b788"];

function posTag(pos) {
  return <span className={`player-pos pos-${pos || 'MID'}`}>{pos || '?'}</span>;
}

function generateGameId() {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
}

async function apiCall(path, body) {
  try {
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    throw new Error(e.message || "Network error");
  }
}

function getAvailability(match) {
  try {
    const now = new Date();
    const months = { Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11 };
    const cleaned = (match.date || "").replace(/^[A-Za-z]{2,3}\s/, "").trim().split(" ");
    const day = parseInt(cleaned[0]);
    const month = months[cleaned[1]];
    if (isNaN(day) || month === undefined) return { status:"pending", label:"Sheet TBC", sublabel:"" };
    const [h, m] = (match.time||"15:00").split(":").map(Number);
    const kickoff = new Date(now.getFullYear(), month, day, h, m, 0);
    if (kickoff < now && (now-kickoff) > 7*24*60*60*1000) kickoff.setFullYear(now.getFullYear()+1);
    const announce = new Date(kickoff.getTime() - 60*60*1000);
    const diffMs = kickoff - now;
    const diffHrs = diffMs / (1000*60*60);
    if (now >= announce) return { status:"confirmed", label:"Sheet Live", sublabel: diffMs<0?"In progress":` KO in ${Math.round(diffHrs*60)}m` };
    if (diffHrs <= 3) return { status:"soon", label:"Available Soon", sublabel:`~${Math.round((announce-now)/60000)}m` };
    return { status:"pending", label:"Not Yet", sublabel:`Sheet ~${announce.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}` };
  } catch { return { status:"pending", label:"TBC", sublabel:"" }; }
}

function AvailBadge({ match }) {
  const av = getAvailability(match);
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:3,flexShrink:0}}>
      <div className={`avail-badge avail-${av.status}`}><div className="avail-dot"/>{av.label}</div>
      {av.sublabel && <div style={{fontSize:10,color:"var(--muted)"}}>{av.sublabel}</div>}
    </div>
  );
}

// ─── HOME SCREEN ──────────────────────────────────────────────────────────────
function HomeScreen({ onCreate, onJoin, error }) {
  const [name, setName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [mode, setMode] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("game");
      if (code) { setJoinCode(code.toUpperCase()); setMode("join"); }
    } catch {}
  }, []);

  async function handleJoin() {
    if (!name.trim() || !joinCode.trim()) return;
    setLoading(true);
    await onJoin(name.trim(), joinCode.trim());
    setLoading(false);
  }

  async function handleCreate() {
    if (!name.trim()) return;
    setLoading(true);
    await onCreate(name.trim());
    setLoading(false);
  }

  if (!mode) return (
    <div className="container">
      <div className="home-hero">
        <span className="home-hero-icon">⚽</span>
        <h2>Ready to Play?</h2>
        <p>Create a game or join your friends</p>
      </div>
      <div className="home-grid">
        <div className="home-option" onClick={() => setMode("create")}>
          <div className="home-option-icon">🏆</div>
          <div>
            <div className="home-option-title">Create Game</div>
            <div className="home-option-sub">Set up a new sweepstake for tonight's match</div>
          </div>
        </div>
        <div className="home-option" onClick={() => setMode("join")}>
          <div className="home-option-icon">🔗</div>
          <div>
            <div className="home-option-title">Join Game</div>
            <div className="home-option-sub">Enter a code or tap your WhatsApp link</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container">
      {error && <div className="error-notice">⚠️ {error}</div>}
      <div className="card accent-border">
        <div style={{fontFamily:"var(--font-head)",fontSize:24,fontWeight:900,textTransform:"uppercase",marginBottom:20,color:"var(--red)"}}>
          {mode === "create" ? "🏆 Create Game" : `🔗 ${joinCode ? `Join Game ${joinCode}` : "Join Game"}`}
        </div>
        <div className="section-label">Your Name</div>
        <input className="input-field" placeholder="Enter your name…" value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key==="Enter" && (mode==="create" ? handleCreate() : handleJoin())}
          autoFocus />
        {mode === "join" && !joinCode && (
          <>
            <div className="section-label">Game Code</div>
            <input className="input-field" placeholder="e.g. ABC12345" value={joinCode}
              onChange={e => setJoinCode(e.target.value.toUpperCase())} />
          </>
        )}
        <button className="btn btn-primary" disabled={!name.trim() || loading || (mode==="join" && !joinCode.trim())}
          onClick={mode==="create" ? handleCreate : handleJoin}>
          {loading ? "Loading…" : mode==="create" ? "Create Game →" : "Join Game →"}
        </button>
        <button className="btn btn-ghost" style={{marginTop:8}}
          onClick={() => { setMode(null); setJoinCode(""); try { window.history.pushState({},"","/"); } catch {} }}>
          ← Back
        </button>
      </div>
    </div>
  );
}

// ─── PICK MATCH SCREEN ────────────────────────────────────────────────────────
function PickMatchScreen({ matches, loadingMatches, selectedMatch, setSelectedMatch, onNext, matchesError, onRefresh }) {
  return (
    <div className="container">
      <div className="section-label">Step 1 of 3 — Select Tonight's Match</div>
      {matchesError && <div className="notice">⚠️ {matchesError}</div>}
      {loadingMatches ? (
        <div className="loading-wrap"><div className="spinner"/><p>Fetching Premier League fixtures…</p></div>
      ) : matches.length === 0 ? (
        <div className="notice">No fixtures found. Try refreshing.</div>
      ) : (
        matches.map((m, i) => (
          <div key={i} className={`match-card ${selectedMatch===i?"selected":""}`} onClick={() => setSelectedMatch(i)}>
            <div style={{flex:1}}>
              <div className="match-vs">{m.home} <span style={{color:"var(--muted)"}}>vs</span> {m.away}</div>
              <div className="match-meta" style={{marginTop:4}}><strong style={{color:"var(--text)"}}>{m.date}</strong> · {m.time}</div>
            </div>
            <AvailBadge match={m}/>
            {selectedMatch===i && <div style={{color:"var(--red)",fontSize:22,fontWeight:900}}>✓</div>}
          </div>
        ))
      )}
      <div className="actions">
        <button className="btn btn-ghost btn-sm" onClick={onRefresh}>↻ Refresh</button>
        <button className="btn btn-primary btn-sm" disabled={selectedMatch===null} onClick={onNext}>
          Next: Invite Friends →
        </button>
      </div>
    </div>
  );
}

// ─── LOBBY SCREEN ─────────────────────────────────────────────────────────────
function LobbyScreen({ game, myName, isAdmin, onStartPicking, onRefresh }) {
  const [copied, setCopied] = useState(false);
  const link = `${window.location.origin}?game=${game.id}`;
  const players = game.players || [];

  function copyLink() {
    try { navigator.clipboard.writeText(link); } catch { }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="container">
      {/* Match info */}
      <div className="card accent-border" style={{marginBottom:20}}>
        <div style={{fontFamily:"var(--font-head)",fontSize:11,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:"var(--red)",marginBottom:6}}>Tonight's Match</div>
        <div style={{fontFamily:"var(--font-head)",fontSize:"clamp(18px,4vw,26px)",fontWeight:900,textTransform:"uppercase",lineHeight:1.1}}>
          {game.match?.home} <span style={{color:"var(--muted)"}}>vs</span> {game.match?.away}
        </div>
        <div style={{color:"var(--muted)",fontSize:13,marginTop:6}}>{game.match?.date} · {game.match?.time}</div>
      </div>

      {/* Share */}
      <div className="section-label">Step 2 of 3 — Invite Your Friends</div>
      <div className="card">
        <div style={{fontSize:13,color:"var(--muted)",marginBottom:8}}>Share this link on WhatsApp:</div>
        <div className="share-box" onClick={copyLink}>
          {copied ? "✓ Copied to clipboard!" : link}
        </div>
        <div style={{textAlign:"center",fontSize:12,color:"var(--muted)"}}>
          Game code: <strong style={{color:"var(--text)",fontFamily:"var(--font-head)",fontSize:16,letterSpacing:2}}>{game.id}</strong>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-bar">
        <div className="stat-item">
          <div className="stat-value">{players.length}</div>
          <div className="stat-label">Players</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">£{players.length}</div>
          <div className="stat-label">Prize Pot</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{MAX_PLAYERS - players.length}</div>
          <div className="stat-label">Slots Left</div>
        </div>
      </div>

      {/* Players */}
      <div className="section-label">Players In</div>
      {players.map((p, i) => (
        <div key={i} className={`lobby-player ${p.name===game.adminName?"admin-player":""}`}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{color:TEAM_COLOURS[i%TEAM_COLOURS.length],fontSize:20}}>●</span>
            <div>
              <span style={{fontWeight:600}}>{p.name}</span>
              {p.name===myName && <span className="role-badge" style={{marginLeft:8}}>You</span>}
            </div>
          </div>
          <div style={{fontSize:12,color:p.name===game.adminName?"var(--red)":"var(--muted)",fontFamily:"var(--font-head)",fontWeight:700,letterSpacing:1,textTransform:"uppercase"}}>
            {p.name===game.adminName ? "Admin" : "Ready"}
          </div>
        </div>
      ))}

      <div style={{display:"flex",gap:10,marginTop:16}}>
        <button className="btn btn-ghost btn-sm" onClick={onRefresh}>↻ Refresh</button>
        {isAdmin && (
          <button className="btn btn-primary" style={{flex:1}} disabled={players.length < 1} onClick={onStartPicking}>
            Open Picks →
          </button>
        )}
      </div>
      {isAdmin && <div style={{fontSize:12,color:"var(--muted)",textAlign:"center",marginTop:8}}>Open picks when everyone has joined</div>}
      {!isAdmin && <div style={{fontSize:12,color:"var(--muted)",textAlign:"center",marginTop:8}}>⏳ Waiting for admin to open picks…</div>}
    </div>
  );
}

// ─── PICK SCREEN ──────────────────────────────────────────────────────────────
function PickScreen({ game, myName, teamSheet, loadingSheet, onPick, sheetTab, setSheetTab }) {
  const [modal, setModal] = useState(null);
  const players = game?.players || [];
  const myPlayer = players.find(p => p.name === myName);

  if (myPlayer?.pick) {
    return (
      <div className="container">
        <div className="success-notice">
          ✅ Your pick: <strong>{myPlayer.pick.name}</strong> — Good luck!
        </div>
        <div className="section-label">All Picks So Far</div>
        <div className="card">
          {players.map((p, i) => (
            <div key={i} className="pick-row">
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{color:TEAM_COLOURS[i%TEAM_COLOURS.length],fontSize:18}}>●</span>
                <div>
                  <div style={{fontWeight:600}}>{p.name} {p.name===myName&&<span className="role-badge">You</span>}</div>
                  <div style={{fontSize:13,color:p.pick?"#00e676":"var(--muted)",marginTop:2}}>
                    {p.pick ? `⚽ ${p.pick.name}` : "Yet to pick…"}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div style={{textAlign:"center",paddingTop:16,borderTop:"1px solid var(--border)",marginTop:8}}>
            <div style={{color:"var(--muted)",fontSize:12,textTransform:"uppercase",letterSpacing:1,fontFamily:"var(--font-head)"}}>Prize Pot</div>
            <div className="pot-big">£{players.length}</div>
          </div>
        </div>
        <div style={{textAlign:"center",color:"var(--muted)",fontSize:13,marginTop:8}}>This page updates every 5 seconds</div>
      </div>
    );
  }

  const takenNames = players.filter(p => p.pick).map(p => p.pick?.name).filter(Boolean);

  return (
    <div className="container">
      <div className="section-label">Step 3 of 3 — Make Your Pick</div>
      <div className="notice" style={{background:"var(--red-dim)",borderColor:"#e6394840",color:"var(--red)"}}>
        ⚽ <strong>{myName}</strong> — tap a player to pick your First Goal Scorer
      </div>

      {loadingSheet ? (
        <div className="loading-wrap"><div className="spinner"/><p>Loading team sheets…</p></div>
      ) : teamSheet ? (
        <>
          <div className="tabs">
            <div className={`tab ${sheetTab==="home"?"active":""}`} onClick={() => setSheetTab("home")}>{teamSheet.home?.team || "Home"}</div>
            <div className={`tab ${sheetTab==="away"?"active":""}`} onClick={() => setSheetTab("away")}>{teamSheet.away?.team || "Away"}</div>
          </div>
          {["home","away"].map(side => sheetTab===side ? (
            <div key={side} className="team-panel">
              <div className="team-header">
                <div className="team-dot" style={{background:teamSheet[side]?.colour||TEAM_COLOURS[side==="home"?0:3]}}/>
                {teamSheet[side]?.team}
              </div>
              {(teamSheet[side]?.players || []).map((p, i) => {
                const taken = takenNames.includes(p.name);
                const takenBy = players.find(pl => pl.pick?.name === p.name);
                return (
                  <div key={i} className={`player-row ${taken?"taken":""}`} onClick={() => !taken && setModal(p)}>
                    <span className="player-num">#{p.number}</span>
                    <span className="player-name">{p.name}</span>
                    {posTag(p.pos)}
                    {taken && <span style={{fontSize:11,color:"var(--amber)",marginLeft:4}}>→ {takenBy?.name}</span>}
                  </div>
                );
              })}
            </div>
          ) : null)}
        </>
      ) : (
        <div style={{textAlign:"center",padding:40,color:"var(--muted)"}}>Team sheet not available yet</div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Confirm Pick</h2>
            <p style={{color:"var(--muted)",fontSize:14,marginTop:4}}>Lock in your First Goal Scorer?</p>
            <div className="modal-player">⚽ {modal.name}</div>
            <div style={{fontSize:13,color:"var(--muted)",marginBottom:20}}>£{ENTRY_FEE} entry · winner takes all</div>
            <div style={{display:"flex",gap:10,justifyContent:"center"}}>
              <button className="btn btn-ghost btn-sm" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary btn-sm" onClick={() => { onPick(modal); setModal(null); }}>
                Lock It In ✓
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── RESULTS SCREEN ───────────────────────────────────────────────────────────
function ResultsScreen({ game, myName, isAdmin, onDeclareWinner }) {
  const players = game?.players || [];

  if (game?.winner) {
    return (
      <div className="container">
        <div className="winner-wrap">
          <span className="trophy">🏆</span>
          <div className="winner-name">{game.winner.name}</div>
          <div className="winner-pick">picked <strong>{game.winner.pick?.name}</strong> — First Goal Scorer!</div>
          <div className="pot-big">£{players.length}</div>
          <div style={{color:"var(--muted)",fontSize:13,marginTop:6}}>Winner takes all 🎉</div>
          <div style={{marginTop:32,padding:"16px",background:"var(--surface)",borderRadius:10,border:"1px solid var(--border)"}}>
            <div className="section-label" style={{marginBottom:10}}>All Picks</div>
            {players.map((p, i) => (
              <div key={i} className="pick-row">
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{color:TEAM_COLOURS[i%TEAM_COLOURS.length]}}>●</span>
                  <div>
                    <div style={{fontWeight:600}}>{p.name}{p.name===myName&&<span className="role-badge" style={{marginLeft:6}}>You</span>}</div>
                    <div style={{fontSize:13,color:"var(--muted)"}}>{p.pick?.name}</div>
                  </div>
                </div>
                {p.name===game.winner.name && <span style={{color:"#c9a227",fontFamily:"var(--font-head)",fontSize:16,fontWeight:900}}>🏆 WINNER</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="section-label">All Picks — Declare Winner When First Goal Scores</div>
      <div className="stats-bar">
        <div className="stat-item">
          <div className="stat-value">{players.filter(p=>p.pick).length}/{players.length}</div>
          <div className="stat-label">Picked</div>
        </div>
        <div className="stat-item">
          <div className="pot-big" style={{fontSize:36}}>£{players.length}</div>
          <div className="stat-label">Prize Pot</div>
        </div>
      </div>
      <div className="card">
        {players.map((p, i) => (
          <div key={i} className="pick-row">
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{color:TEAM_COLOURS[i%TEAM_COLOURS.length],fontSize:18}}>●</span>
              <div>
                <div style={{fontWeight:600}}>{p.name}{p.name===myName&&<span className="role-badge" style={{marginLeft:6}}>You</span>}</div>
                <div style={{fontSize:13,color:p.pick?"#00e676":"var(--muted)",marginTop:2}}>
                  {p.pick ? `⚽ ${p.pick.name} (${p.pick.pos})` : "No pick yet"}
                </div>
              </div>
            </div>
            {isAdmin && p.pick && (
              <button className="btn btn-winner btn-sm" onClick={() => onDeclareWinner(p)}>
                🏆 Winner!
              </button>
            )}
          </div>
        ))}
      </div>
      {isAdmin && <div style={{fontSize:12,color:"var(--muted)",textAlign:"center",marginTop:8}}>Tap Winner! when the first goal goes in</div>}
      {!isAdmin && <div style={{fontSize:12,color:"var(--muted)",textAlign:"center",marginTop:8}}>Waiting for the first goal… ⚽</div>}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("home");
  const [myName, setMyName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [game, setGame] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [matchesError, setMatchesError] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [teamSheet, setTeamSheet] = useState(null);
  const [loadingSheet, setLoadingSheet] = useState(false);
  const [sheetTab, setSheetTab] = useState("home");
  const [error, setError] = useState(null);

  // Restore session on load
  useEffect(() => {
    async function init() {
      // Check URL for game code first
      const params = new URLSearchParams(window.location.search);
      const urlGameId = params.get("game");

      // Try to restore saved session
      try {
        const saved = localStorage.getItem("ff_session");
        if (saved) {
          const session = JSON.parse(saved);
          // Use URL game code if present, otherwise use saved one
          const gameId = urlGameId || session.gameId;
          if (gameId && session.myName) {
            try {
              const data = await apiCall("/api/game", { action:"get", gameId });
              if (data && data.game && Array.isArray(data.game.players)) {
                setGame(data.game);
                setMyName(session.myName);
                setIsAdmin(session.isAdmin && session.gameId === gameId);
                if (data.game.winner || data.game.status === "results") setScreen("results");
                else if (data.game.status === "picking") {
                  setScreen("picking");
                  if (data.game.match) loadTeamSheet(data.game.match);
                } else {
                  setScreen("lobby");
                }
                loadMatches();
                return;
              }
            } catch(e) { /* fetch failed, continue to home */ }
          }
        }
      } catch(e) { /* session parse failed */ }
      loadMatches();
    }
    init();
  }, []);

  // Save session
  useEffect(() => {
    if (game?.id && myName) {
      try { localStorage.setItem("ff_session", JSON.stringify({ gameId:game.id, myName, isAdmin })); } catch {}
    }
  }, [game, myName, isAdmin]);

  // Poll every 5s
  useEffect(() => {
    if (!game || screen === "home" || screen === "pickMatch") return;
    const interval = setInterval(async () => {
      try {
        const data = await apiCall("/api/game", { action:"get", gameId:game.id });
        if (data?.game?.players) {
          setGame(data.game);
          if (data.game.winner) setScreen("results");
          else if (data.game.status === "picking" && screen === "lobby") {
            setScreen("picking");
            if (!teamSheet && data.game.match) loadTeamSheet(data.game.match);
          } else if (data.game.status === "results") setScreen("results");
        }
      } catch {}
    }, 5000);
    return () => clearInterval(interval);
  }, [game, screen, teamSheet]);

  async function loadMatches() {
    setLoadingMatches(true);
    setMatchesError(null);
    // Confirmed remaining PL fixtures 2025-26 season
    setMatches([
      { home:"Aston Villa", away:"Liverpool", date:"Thu 15 May", time:"20:00" },
      { home:"Brentford", away:"Crystal Palace", date:"Sat 17 May", time:"12:30" },
      { home:"Everton", away:"Sunderland", date:"Sat 17 May", time:"15:00" },
      { home:"Leeds United", away:"Brighton", date:"Sat 17 May", time:"15:00" },
      { home:"Manchester United", away:"Nottingham Forest", date:"Sat 17 May", time:"15:00" },
      { home:"Newcastle United", away:"West Ham United", date:"Sat 17 May", time:"15:00" },
      { home:"Wolves", away:"Fulham", date:"Sat 17 May", time:"15:00" },
      { home:"Arsenal", away:"Burnley", date:"Sun 18 May", time:"16:00" },
      { home:"AFC Bournemouth", away:"Manchester City", date:"Mon 19 May", time:"20:00" },
      { home:"Chelsea", away:"Tottenham Hotspur", date:"Mon 19 May", time:"20:00" },
      { home:"Brighton", away:"Manchester United", date:"Sun 24 May", time:"17:00" },
      { home:"Burnley", away:"Wolves", date:"Sun 24 May", time:"17:00" },
      { home:"Crystal Palace", away:"Arsenal", date:"Sun 24 May", time:"17:00" },
      { home:"Fulham", away:"Newcastle United", date:"Sun 24 May", time:"17:00" },
      { home:"Liverpool", away:"Brentford", date:"Sun 24 May", time:"17:00" },
      { home:"Manchester City", away:"Aston Villa", date:"Sun 24 May", time:"17:00" },
      { home:"Nottingham Forest", away:"Bournemouth", date:"Sun 24 May", time:"17:00" },
      { home:"Sunderland", away:"Chelsea", date:"Sun 24 May", time:"17:00" },
      { home:"Tottenham Hotspur", away:"Everton", date:"Sun 24 May", time:"17:00" },
      { home:"West Ham United", away:"Leeds United", date:"Sun 24 May", time:"17:00" },
    ]);
    setLoadingMatches(false);
  }

  async function loadTeamSheet(match) {
    if (!match || !match.home || !match.away) return;
    setLoadingSheet(true);
    setTeamSheet(null);
    try {
      const home = match.home;
      const away = match.away;
      const prompt = `Search for the expected starting XI for ${home} vs ${away} in the Premier League 2025-26. Return ONLY a JSON array with no markdown or explanation. Format: [{"team":"${home}","colour":"#e63946","players":[{"number":1,"name":"Player Name","pos":"GK"}]},{"team":"${away}","colour":"#4361ee","players":[{"number":1,"name":"Player Name","pos":"GK"}]}]. Include 11 starters and 5 subs per team. pos must be GK DEF MID or FWD only. Use real player names.`;
      const data = await apiCall("/api/chat", {
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [{ role: "user", content: prompt }],
      });
      const blocks = (data && data.content) ? data.content : [];
      const text = blocks.map(function(b) { return b.text || ""; }).join(" ");
      const s = text.indexOf("[");
      const e = text.lastIndexOf("]");
      if (s < 0 || e < 0 || e <= s) throw new Error("no array found");
      const result = JSON.parse(text.slice(s, e + 1));
      if (!Array.isArray(result) || result.length < 2) throw new Error("bad array");
      const homePlayers = result[0] && Array.isArray(result[0].players) ? result[0].players : [];
      const awayPlayers = result[1] && Array.isArray(result[1].players) ? result[1].players : [];
      if (homePlayers.length === 0 || awayPlayers.length === 0) throw new Error("empty players");
      setTeamSheet({ home: result[0], away: result[1] });
      setSheetTab("home");
    } catch(err) {
      setTeamSheet({
        home: { team: match.home, colour: "#e63946", players: fallbackPlayers(match.home, "home") },
        away: { team: match.away, colour: "#4361ee", players: fallbackPlayers(match.away, "away") },
      });
    }
    setLoadingSheet(false);
  }

  function fallbackPlayers(team, side) {
    const names = side==="home"
      ? [["1","GK","Goalkeeper"],["2","DEF","Right Back"],["5","DEF","Centre Back"],["6","DEF","Centre Back"],["3","DEF","Left Back"],["8","MID","Central Mid"],["4","MID","Defensive Mid"],["10","MID","Attacking Mid"],["7","FWD","Right Winger"],["9","FWD","Striker"],["11","FWD","Left Winger"]]
      : [["1","GK","Goalkeeper"],["2","DEF","Right Back"],["4","DEF","Centre Back"],["5","DEF","Centre Back"],["3","DEF","Left Back"],["6","MID","Defensive Mid"],["8","MID","Central Mid"],["10","MID","Attacking Mid"],["7","FWD","Right Winger"],["9","FWD","Striker"],["11","FWD","Left Winger"]];
    return names.map(([number,pos,label]) => ({ number, name:`${team} ${label}`, pos }));
  }

  function leaveGame() {
    try { localStorage.removeItem("ff_session"); } catch {}
    setGame(null);
    setMyName("");
    setIsAdmin(false);
    setScreen("home");
    setTeamSheet(null);
    setSelectedMatch(null);
    setError(null);
    try { window.history.pushState({}, "", window.location.pathname); } catch {}
  }

  async function handleCreate(name) {
    setMyName(name); setIsAdmin(true); setError(null); setScreen("pickMatch");
  }

  async function handleJoin(name, code) {
    setError(null);
    try {
      const data = await apiCall("/api/game", { action:"join", gameId:code, playerName:name });
      if (data?.error) { setError(data.error); return; }
      if (!data?.game) { setError("Game not found. Check the code and try again."); return; }
      setGame(data.game); setMyName(name); setIsAdmin(false);
      if (data.game.status === "picking") { setScreen("picking"); if (data.game.match) loadTeamSheet(data.game.match); }
      else if (data.game.status === "results") setScreen("results");
      else setScreen("lobby");
    } catch (e) { setError("Couldn't connect. Please try again."); }
  }

  async function handleMatchSelected() {
    if (selectedMatch === null || selectedMatch === undefined) {
      setError("Please select a match first.");
      return;
    }
    const match = matches[selectedMatch];
    if (!match) {
      setError("Match not found. Please try again.");
      return;
    }
    const gameId = generateGameId();
    const adminName = myName || "Admin";
    setError(null);
    try {
      const payload = { action:"create", gameId, adminName, match };
      const data = await apiCall("/api/game", payload);
      if (!data) {
        setError("No response from server. Check your connection.");
        return;
      }
      if (data.error) {
        setError("Server error: " + data.error);
        return;
      }
      if (!data.game) {
        setError("Game creation failed. Try again.");
        return;
      }
      setMyName(adminName);
      setGame(data.game);
      setScreen("lobby");
      try { window.history.pushState({}, "", "?game=" + gameId); } catch {}
    } catch(e) {
      setError("Connection error: " + (e.message || "unknown error") + ". Check Vercel logs.");
    }
  }

  async function handleStartPicking() {
    try {
      const data = await apiCall("/api/game", { action:"startPicking", gameId:game.id });
      if (data?.game) { setGame(data.game); setScreen("picking"); if (game.match) loadTeamSheet(game.match); }
    } catch {}
  }

  async function handlePick(player) {
    try {
      const data = await apiCall("/api/game", { action:"pick", gameId:game.id, playerName:myName, pick:player });
      if (data?.error) { setError(data.error); return; }
      if (data?.game) { setGame(data.game); if (data.game.status==="results") setScreen("results"); }
    } catch { setError("Failed to save pick. Try again."); }
  }

  async function handleDeclareWinner(player) {
    try {
      const data = await apiCall("/api/game", { action:"declareWinner", gameId:game.id, winnerName:player.name });
      if (data?.game) { setGame(data.game); setScreen("results"); }
    } catch {}
  }

  return (
    <div className="app">
      <div className="header">
        <span className="header-ball">⚽</span>
        <h1>Football Friends<br/>1st Goal Scorer</h1>
        <p className="header-sub">Pick a player · £1 entry · Winner takes all</p>
        <div className="header-divider"/>
      </div>

      {game && (
        <div className="game-bar">
          <span>Game: <strong>{game.id}</strong></span>
          <span>·</span>
          <span>{myName}{isAdmin ? " (Admin)" : ""}</span>
          <span className="leave-btn" onClick={leaveGame}>✕ Leave</span>
        </div>
      )}

      {error && (
        <div className="container" style={{paddingBottom:0}}>
          <div className="error-notice">⚠️ {error} <span style={{cursor:"pointer",marginLeft:8,opacity:0.6}} onClick={() => setError(null)}>✕</span></div>
        </div>
      )}

      {screen === "home" && <HomeScreen onCreate={handleCreate} onJoin={handleJoin} error={null} />}
      {screen === "pickMatch" && (
        <PickMatchScreen matches={matches} loadingMatches={loadingMatches}
          selectedMatch={selectedMatch} setSelectedMatch={setSelectedMatch}
          matchesError={matchesError} onRefresh={loadMatches} onNext={handleMatchSelected} />
      )}
      {screen === "lobby" && game && (
        <LobbyScreen game={game} myName={myName} isAdmin={isAdmin}
          onStartPicking={handleStartPicking}
          onRefresh={async () => {
            try {
              const data = await apiCall("/api/game", { action:"get", gameId:game.id });
              if (data?.game?.players) setGame(data.game);
            } catch {}
          }} />
      )}
      {screen === "picking" && game && (
        <PickScreen game={game} myName={myName} teamSheet={teamSheet}
          loadingSheet={loadingSheet} onPick={handlePick}
          sheetTab={sheetTab} setSheetTab={setSheetTab} />
      )}
      {screen === "results" && game && (
        <ResultsScreen game={game} myName={myName} isAdmin={isAdmin}
          onDeclareWinner={handleDeclareWinner} />
      )}
    </div>
  );
}
