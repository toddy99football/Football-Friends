import { useState, useEffect } from "react";

const FONT_LINK = document.createElement("link");
FONT_LINK.rel = "stylesheet";
FONT_LINK.href = "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;900&family=DM+Sans:wght@300;400;500&display=swap";
document.head.appendChild(FONT_LINK);

const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0d1117; --surface: #161b22; --card: #1c2230; --border: #2a3244;
    --green: #00e676; --green-dim: #00c36340; --amber: #ffb300; --red: #ef5350;
    --text: #e8eaf0; --muted: #6b7894; --radius: 10px;
    --font-head: 'Barlow Condensed', sans-serif; --font-body: 'DM Sans', sans-serif;
  }
  body { background: var(--bg); color: var(--text); font-family: var(--font-body); }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
  .app {
    min-height: 100vh; padding: 0 0 80px;
    background: radial-gradient(ellipse 80% 40% at 50% 0%, #003520 0%, transparent 60%), var(--bg);
  }
  .header { text-align: center; padding: 36px 20px 24px; border-bottom: 1px solid var(--border); }
  .header h1 {
    font-family: var(--font-head); font-size: clamp(36px, 7vw, 68px); font-weight: 900;
    letter-spacing: -1px; line-height: 1; text-transform: uppercase;
    background: linear-gradient(135deg, #fff 0%, var(--green) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .header p { margin-top: 8px; color: var(--muted); font-size: 14px; }
  .container { max-width: 700px; margin: 0 auto; padding: 28px 16px; }
  .section-label {
    font-family: var(--font-head); font-size: 11px; font-weight: 700;
    letter-spacing: 3px; text-transform: uppercase; color: var(--muted); margin-bottom: 16px;
  }
  .card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 20px 24px; margin-bottom: 12px;
  }
  .card.green-border { border-color: var(--green); }
  .btn {
    font-family: var(--font-head); font-size: 18px; font-weight: 700;
    letter-spacing: 1px; text-transform: uppercase; padding: 14px 36px;
    border-radius: var(--radius); border: none; cursor: pointer; transition: all 0.2s;
    display: inline-block; text-align: center;
  }
  .btn-primary { background: var(--green); color: #000; width: 100%; }
  .btn-primary:hover { background: #00ff84; box-shadow: 0 0 24px #00e67640; }
  .btn-primary:disabled { background: var(--border); color: var(--muted); cursor: not-allowed; }
  .btn-ghost { background: transparent; color: var(--muted); border: 1px solid var(--border); }
  .btn-ghost:hover { border-color: var(--text); color: var(--text); }
  .btn-danger { background: var(--red); color: #fff; }
  .btn-sm { font-size: 13px; padding: 8px 16px; }
  .input-field {
    background: var(--surface); border: 1px solid var(--border); border-radius: 8px;
    color: var(--text); font-family: var(--font-body); font-size: 15px;
    padding: 12px 16px; width: 100%; outline: none; transition: border-color 0.2s;
    margin-bottom: 12px;
  }
  .input-field:focus { border-color: var(--green); }
  .spinner {
    width: 48px; height: 48px; border: 3px solid var(--border);
    border-top-color: var(--green); border-radius: 50%;
    animation: spin 0.8s linear infinite; margin: 0 auto 20px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-wrap { text-align: center; padding: 60px 20px; }
  .loading-wrap p { color: var(--muted); font-size: 14px; }
  .match-card {
    background: var(--card); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 18px 20px; margin-bottom: 10px; cursor: pointer;
    transition: border-color 0.2s, transform 0.15s; display: flex; align-items: center; gap: 12px;
  }
  .match-card:hover { border-color: var(--green); transform: translateY(-2px); }
  .match-card.selected { border-color: var(--green); background: linear-gradient(135deg, #1c2230, #0d2016); }
  .match-vs { font-family: var(--font-head); font-size: clamp(15px,3vw,20px); font-weight: 900; flex: 1; }
  .match-meta { font-size: 12px; color: var(--muted); text-align: right; }
  .avail-badge {
    display: inline-flex; align-items: center; gap: 5px; font-family: var(--font-head);
    font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
    padding: 3px 8px; border-radius: 20px; white-space: nowrap;
  }
  .avail-confirmed { background: #00e67620; color: var(--green); border: 1px solid #00e67650; }
  .avail-soon { background: #ffb30020; color: var(--amber); border: 1px solid #ffb30050; animation: pulse 2s ease infinite; }
  .avail-pending { background: #6b789420; color: var(--muted); border: 1px solid #6b789440; }
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.6; } }
  .avail-dot { width: 6px; height: 6px; border-radius: 50%; }
  .avail-confirmed .avail-dot { background: var(--green); }
  .avail-soon .avail-dot { background: var(--amber); }
  .avail-pending .avail-dot { background: var(--muted); }
  .player-row {
    display: flex; align-items: center; gap: 12px; padding: 10px 18px;
    border-bottom: 1px solid #1e2738; cursor: pointer; transition: background 0.15s;
  }
  .player-row:last-child { border-bottom: none; }
  .player-row:hover { background: #ffffff08; }
  .player-row.taken { opacity: 0.35; cursor: not-allowed; }
  .player-row.mine { background: var(--green-dim); }
  .player-num { font-family: var(--font-head); font-size: 13px; font-weight: 700; color: var(--muted); width: 22px; text-align: center; }
  .player-name { font-size: 14px; font-weight: 500; flex: 1; }
  .player-pos { font-family: var(--font-head); font-size: 11px; font-weight: 700; letter-spacing: 1px; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; }
  .pos-GK { background: #ffd60020; color: #ffd600; }
  .pos-DEF { background: #4fc3f720; color: #4fc3f7; }
  .pos-MID { background: #ab47bc20; color: #ce93d8; }
  .pos-FWD { background: #ef535020; color: #ef9a9a; }
  .team-panel { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; margin-bottom: 16px; }
  .team-header {
    padding: 14px 18px; font-family: var(--font-head); font-size: 20px; font-weight: 900;
    text-transform: uppercase; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 10px;
  }
  .team-dot { width: 10px; height: 10px; border-radius: 50%; }
  .tabs { display: flex; gap: 4px; margin-bottom: 16px; }
  .tab {
    font-family: var(--font-head); font-size: 14px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 1px; padding: 8px 18px; border-radius: 6px; cursor: pointer;
    background: var(--surface); border: 1px solid var(--border); color: var(--muted); transition: all 0.15s;
  }
  .tab.active { background: var(--green); color: #000; border-color: var(--green); }
  .modal-overlay {
    position: fixed; inset: 0; background: #00000090; display: flex; align-items: center;
    justify-content: center; z-index: 100; backdrop-filter: blur(4px); padding: 20px;
  }
  .modal {
    background: var(--card); border: 1px solid var(--green); border-radius: 14px;
    padding: 32px; max-width: 420px; width: 100%; text-align: center;
    animation: pop 0.25s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes pop { from { transform: scale(0.85); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .modal h2 { font-family: var(--font-head); font-size: 30px; font-weight: 900; text-transform: uppercase; margin-bottom: 8px; }
  .modal-player { font-family: var(--font-head); font-size: 26px; font-weight: 700; color: var(--green); background: var(--green-dim); border-radius: 8px; padding: 10px 20px; margin: 16px 0; }
  .modal-buttons { display: flex; gap: 12px; justify-content: center; margin-top: 20px; }
  .notice { background: #ffb30015; border: 1px solid #ffb30040; border-radius: 8px; padding: 12px 16px; font-size: 13px; color: var(--amber); margin-bottom: 16px; }
  .success-notice { background: #00e67615; border: 1px solid #00e67640; border-radius: 8px; padding: 12px 16px; font-size: 13px; color: var(--green); margin-bottom: 16px; }
  .pick-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--border); }
  .pick-row:last-child { border-bottom: none; }
  .pot-big { font-family: var(--font-head); font-size: 56px; font-weight: 900; color: var(--green); line-height: 1; }
  .winner-wrap { text-align: center; padding: 40px 20px; }
  .trophy { font-size: 80px; animation: bounce 1s ease infinite alternate; }
  @keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-12px); } }
  .winner-name {
    font-family: var(--font-head); font-size: clamp(40px,8vw,72px); font-weight: 900;
    text-transform: uppercase;
    background: linear-gradient(135deg, var(--amber), var(--green));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .share-box {
    background: var(--surface); border: 1px solid var(--green); border-radius: 8px;
    padding: 14px 18px; font-size: 15px; word-break: break-all; color: var(--green);
    margin: 12px 0; cursor: pointer; text-align: center;
  }
  .actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 20px; flex-wrap: wrap; }
  .comp-tabs { display: flex; gap: 8px; justify-content: center; margin-bottom: 14px; }
  .comp-tab {
    font-family: var(--font-head); font-size: 12px; font-weight: 700; letter-spacing: 2px;
    text-transform: uppercase; padding: 5px 16px; border-radius: 20px; border: 1px solid;
    cursor: pointer; transition: all 0.15s;
  }
  .role-badge {
    font-family: var(--font-head); font-size: 10px; font-weight: 700; letter-spacing: 2px;
    text-transform: uppercase; padding: 2px 8px; border-radius: 10px;
    background: #00e67620; color: var(--green); border: 1px solid #00e67640;
  }
`;
const styleEl = document.createElement("style");
styleEl.textContent = css;
document.head.appendChild(styleEl);

const ENTRY_FEE = 1;
const MAX_PLAYERS = 10;
const TEAM_COLOURS = ["#e63946","#2a9d8f","#e9c46a","#4361ee","#f77f00","#8ecae6","#a8dadc","#c77dff","#fb8500","#52b788"];

function posTag(pos) {
  return <span className={`player-pos pos-${pos}`}>{pos}</span>;
}

function generateGameId() {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
}

async function apiCall(path, body) {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

function getAvailability(match) {
  try {
    const now = new Date();
    const months = { Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11 };
    const cleaned = match.date.replace(/^[A-Za-z]{2,3}\s/, "").trim().split(" ");
    const day = parseInt(cleaned[0]);
    const month = months[cleaned[1]];
    if (isNaN(day) || month === undefined) return { status:"pending", label:"Sheet TBC", sublabel:"" };
    const [h, m] = (match.time||"15:00").split(":").map(Number);
    const kickoff = new Date(now.getFullYear(), month, day, h, m, 0);
    if (kickoff < now && (now-kickoff) > 7*24*60*60*1000) kickoff.setFullYear(now.getFullYear()+1);
    const announce = new Date(kickoff.getTime() - 60*60*1000);
    const diffMs = kickoff - now;
    const diffHrs = diffMs / (1000*60*60);
    if (now >= announce) return { status:"confirmed", label:"Sheet Available", sublabel: diffMs<0?"In progress":` KO in ${Math.round(diffHrs*60)}m` };
    if (diffHrs <= 3) return { status:"soon", label:"Available Soon", sublabel:`Sheet in ~${Math.round((announce-now)/60000)}m` };
    return { status:"pending", label:"Not Yet Available", sublabel:`Sheet ~${announce.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}` };
  } catch { return { status:"pending", label:"Sheet TBC", sublabel:"" }; }
}

function AvailBadge({ match }) {
  const av = getAvailability(match);
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:3}}>
      <div className={`avail-badge avail-${av.status}`}><div className="avail-dot"/>{av.label}</div>
      {av.sublabel && <div style={{fontSize:10,color:"var(--muted)"}}>{av.sublabel}</div>}
    </div>
  );
}

// ─── SCREENS ──────────────────────────────────────────────────────────────────

// Home — create or join
function HomeScreen({ onCreate, onJoin }) {
  const [name, setName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [mode, setMode] = useState(null);

  // Auto-detect game code from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("game");
    if (code) {
      setJoinCode(code.toUpperCase());
      setMode("join");
    }
  }, []);

  return (
    <div className="container">
      {!mode && (
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontSize:48,marginBottom:8}}>⚽</div>
          <div style={{fontFamily:"var(--font-head)",fontSize:13,color:"var(--muted)",letterSpacing:3,textTransform:"uppercase",marginBottom:24}}>
            How do you want to play?
          </div>
          <div style={{display:"grid",gap:12}}>
            <button className="btn btn-primary" onClick={() => setMode('create')}>
              🏆 Create a New Game
            </button>
            <button className="btn btn-ghost" style={{width:"100%"}} onClick={() => setMode('join')}>
              🔗 Join a Game
            </button>
          </div>
        </div>
      )}

      {mode === 'create' && (
        <div className="card green-border">
          <div style={{fontFamily:"var(--font-head)",fontSize:22,fontWeight:900,textTransform:"uppercase",marginBottom:16}}>Create Game</div>
          <div className="section-label">Your Name</div>
          <input className="input-field" placeholder="Enter your name…" value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key==="Enter" && name.trim() && onCreate(name.trim())} autoFocus />
          <button className="btn btn-primary" disabled={!name.trim()} onClick={() => onCreate(name.trim())}>
            Create Game →
          </button>
          <button className="btn btn-ghost btn-sm" style={{width:"100%",marginTop:8}} onClick={() => setMode(null)}>← Back</button>
        </div>
      )}

      {mode === 'join' && (
        <div className="card green-border">
          <div style={{fontFamily:"var(--font-head)",fontSize:22,fontWeight:900,textTransform:"uppercase",marginBottom:16}}>
            {joinCode ? `Joining Game ${joinCode}` : "Join a Game"}
          </div>
          <div className="section-label">Your Name</div>
          <input
            className="input-field"
            placeholder="Enter your name…"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key==="Enter" && name.trim() && joinCode.trim() && onJoin(name.trim(), joinCode.trim())}
            autoFocus
          />
          {!joinCode && (
            <>
              <div className="section-label">Game Code</div>
              <input className="input-field" placeholder="e.g. ABC12345" value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())} />
            </>
          )}
          <button className="btn btn-primary" disabled={!name.trim()||!joinCode.trim()} onClick={() => onJoin(name.trim(), joinCode.trim())}>
            Join Game →
          </button>
          <button className="btn btn-ghost btn-sm" style={{width:"100%",marginTop:8}} onClick={() => { setMode(null); setJoinCode(""); window.history.pushState({},""," /"); }}>← Back</button>
        </div>
      )}
    </div>
  );
}

// Admin: pick match
function PickMatchScreen({ competition, setCompetition, matches, loadingMatches, selectedMatch, setSelectedMatch, onNext, matchesError, loadMatches }) {
  return (
    <div className="container">
      <div className="section-label">Step 1 — Pick a Match</div>
      <div className="comp-tabs">
        <div className="comp-tab" onClick={() => { setCompetition('pl'); loadMatches('pl'); }}
          style={{borderColor:competition==='pl'?"var(--green)":"var(--border)",color:competition==='pl'?"var(--green)":"var(--muted)",background:competition==='pl'?"var(--green-dim)":"transparent"}}>
          ⚽ Premier League
        </div>
        <div className="comp-tab" onClick={() => { setCompetition('ucl'); loadMatches('ucl'); }}
          style={{borderColor:competition==='ucl'?"#c9a227":"var(--border)",color:competition==='ucl'?"#c9a227":"var(--muted)",background:competition==='ucl'?"#c9a22720":"transparent"}}>
          ⭐ Champions League
        </div>
      </div>
      {matchesError && <div className="notice">⚠️ {matchesError}</div>}
      {loadingMatches ? (
        <div className="loading-wrap"><div className="spinner"/><p>Fetching fixtures…</p></div>
      ) : (
        matches.map((m, i) => (
          <div key={i} className={`match-card ${selectedMatch===i?"selected":""}`} onClick={() => setSelectedMatch(i)}>
            <div style={{flex:1}}>
              <div className="match-vs">{m.home} <span style={{color:"var(--muted)"}}>vs</span> {m.away}</div>
              <div className="match-meta" style={{textAlign:"left",marginTop:4}}><strong style={{display:"inline"}}>{m.date}</strong><span style={{marginLeft:8}}>{m.time}</span></div>
            </div>
            <AvailBadge match={m}/>
            {selectedMatch===i && <div style={{color:"var(--green)",fontSize:20}}>✓</div>}
          </div>
        ))
      )}
      <div className="actions">
        <button className="btn btn-ghost btn-sm" onClick={() => loadMatches(competition)}>↻ Refresh</button>
        <button className="btn btn-primary" style={{width:"auto"}} disabled={selectedMatch===null} onClick={onNext}>Next →</button>
      </div>
    </div>
  );
}

// Lobby — waiting for players / sharing link
function LobbyScreen({ game, myName, isAdmin, onStartPicking, onRefresh }) {
  const link = `${window.location.origin}?game=${game.id}`;
  const [copied, setCopied] = useState(false);

  function copyLink() {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="container">
      <div className="section-label">Game Lobby</div>
      <div className="card green-border" style={{marginBottom:16}}>
        <div style={{fontFamily:"var(--font-head)",fontSize:22,fontWeight:900,textTransform:"uppercase",marginBottom:4}}>
          {game.match.home} vs {game.match.away}
        </div>
        <div style={{color:"var(--muted)",fontSize:13}}>{game.match.date} · {game.match.time}</div>
        <div style={{marginTop:16}}>
          <div style={{fontSize:13,color:"var(--muted)",marginBottom:6}}>Share this link with your group:</div>
          <div className="share-box" onClick={copyLink}>
            {copied ? "✓ Copied!" : link}
          </div>
          <div style={{fontSize:12,color:"var(--muted)",textAlign:"center"}}>Tap to copy · Game code: <strong style={{color:"var(--text)"}}>{game.id}</strong></div>
        </div>
      </div>

      <div className="section-label">Players ({game.players.length}/{MAX_PLAYERS})</div>
      <div style={{display:"grid",gap:8,marginBottom:20}}>
        {game.players.map((p, i) => (
          <div key={i} className="card" style={{padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{color:TEAM_COLOURS[i%TEAM_COLOURS.length],fontSize:18}}>●</span>
              <span style={{fontWeight:600}}>{p.name}</span>
              {p.name === myName && <span className="role-badge">You</span>}
              {p.name === game.adminName && <span style={{...{},fontSize:11,color:"var(--amber)",fontFamily:"var(--font-head)",letterSpacing:1}}>ADMIN</span>}
            </div>
            <span style={{fontSize:13,color:p.pick?"var(--green)":"var(--muted)"}}>
              {p.pick ? "✓ Picked" : "Waiting…"}
            </span>
          </div>
        ))}
      </div>

      <div style={{display:"flex",gap:10}}>
        <button className="btn btn-ghost btn-sm" onClick={onRefresh}>↻ Refresh</button>
        {isAdmin && (
          <button className="btn btn-primary" style={{flex:1}} onClick={onStartPicking} disabled={game.players.length < 1}>
            Open Picking →
          </button>
        )}
      </div>
      {isAdmin && <div style={{fontSize:12,color:"var(--muted)",textAlign:"center",marginTop:8}}>As admin you control when picks open</div>}
      {!isAdmin && <div style={{fontSize:12,color:"var(--muted)",textAlign:"center",marginTop:8}}>Waiting for admin to open picks…</div>}
    </div>
  );
}

// Pick screen — individual player picks their player
function PickScreen({ game, myName, teamSheet, loadingSheet, onPick, sheetTab, setSheetTab }) {
  const myPlayer = game.players.find(p => p.name === myName);
  const [modal, setModal] = useState(null);

  if (myPlayer?.pick) {
    return (
      <div className="container">
        <div className="success-notice">✅ You've picked <strong>{myPlayer.pick.name}</strong> — good luck!</div>
        <div className="card">
          <div style={{fontFamily:"var(--font-head)",fontSize:20,fontWeight:900,textTransform:"uppercase",marginBottom:16}}>All Picks</div>
          {game.players.map((p, i) => (
            <div key={i} className="pick-row">
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{color:TEAM_COLOURS[i%TEAM_COLOURS.length]}}>●</span>
                <div>
                  <div style={{fontWeight:600}}>{p.name}{p.name===myName&&<span className="role-badge" style={{marginLeft:6}}>You</span>}</div>
                  <div style={{fontSize:13,color:p.pick?"var(--green)":"var(--muted)"}}>{p.pick?`⚽ ${p.pick.name}`:"Yet to pick"}</div>
                </div>
              </div>
            </div>
          ))}
          <div style={{marginTop:16,textAlign:"center",color:"var(--muted)",fontSize:13}}>
            Prize pot: <strong style={{color:"var(--green)",fontFamily:"var(--font-head)",fontSize:20}}>£{game.players.length}</strong>
          </div>
        </div>
      </div>
    );
  }

  const takenNames = game.players.filter(p => p.pick).map(p => p.pick.name);

  return (
    <div className="container">
      <div className="section-label">Make Your Pick</div>
      <div className="notice">⚽ <strong>{myName}</strong> — tap a player to pick your First Goal Scorer</div>

      {loadingSheet ? (
        <div className="loading-wrap"><div className="spinner"/><p>Loading team sheets…</p></div>
      ) : teamSheet ? (
        <>
          <div className="tabs">
            <div className={`tab ${sheetTab==="home"?"active":""}`} onClick={() => setSheetTab("home")}>{teamSheet.home.team}</div>
            <div className={`tab ${sheetTab==="away"?"active":""}`} onClick={() => setSheetTab("away")}>{teamSheet.away.team}</div>
          </div>
          {["home","away"].map(side => sheetTab===side ? (
            <div key={side} className="team-panel">
              <div className="team-header">
                <div className="team-dot" style={{background:teamSheet[side].colour||TEAM_COLOURS[side==="home"?0:4]}}/>
                {teamSheet[side].team}
              </div>
              {teamSheet[side].players.map((p, i) => {
                const taken = takenNames.includes(p.name);
                const takenBy = game.players.find(pl => pl.pick?.name === p.name);
                return (
                  <div key={i} className={`player-row ${taken?"taken":""}`}
                    onClick={() => !taken && setModal(p)}>
                    <span className="player-num">#{p.number}</span>
                    <span className="player-name">{p.name}</span>
                    {posTag(p.pos)}
                    {taken && <span style={{fontSize:11,color:"var(--amber)"}}>→ {takenBy?.name}</span>}
                  </div>
                );
              })}
            </div>
          ) : null)}
        </>
      ) : <div style={{color:"var(--muted)",textAlign:"center",padding:40}}>Team sheet loading…</div>}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Confirm Pick</h2>
            <p style={{color:"var(--muted)",fontSize:14}}>Are you sure you want to pick this player?</p>
            <div className="modal-player">⚽ {modal.name}</div>
            <div style={{fontSize:13,color:"var(--muted)"}}>£{ENTRY_FEE} entry · winner takes all</div>
            <div className="modal-buttons">
              <button className="btn btn-ghost btn-sm" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary btn-sm" style={{width:"auto"}} onClick={() => { onPick(modal); setModal(null); }}>Confirm ✓</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Results screen
function ResultsScreen({ game, myName, isAdmin, onDeclareWinner }) {
  const allPicked = game.players.every(p => p.pick);
  return (
    <div className="container">
      {game.winner ? (
        <div className="winner-wrap">
          <div className="trophy">🏆</div>
          <div className="winner-name">{game.winner.name}</div>
          <div style={{color:"var(--muted)",fontSize:16,margin:"12px 0"}}>
            picked <strong style={{color:"var(--green)"}}>{game.winner.pick?.name}</strong> — First Goal Scorer!
          </div>
          <div className="pot-big">£{game.players.length}</div>
          <div style={{color:"var(--muted)",fontSize:12,marginTop:4}}>Winner takes all 🎉</div>
        </div>
      ) : (
        <>
          <div className="section-label">All Picks</div>
          <div className="card">
            {game.players.map((p, i) => (
              <div key={i} className="pick-row">
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{color:TEAM_COLOURS[i%TEAM_COLOURS.length],fontSize:18}}>●</span>
                  <div>
                    <div style={{fontWeight:600}}>{p.name}{p.name===myName&&<span className="role-badge" style={{marginLeft:6}}>You</span>}</div>
                    <div style={{fontSize:13,color:p.pick?"var(--green)":"var(--muted)"}}>{p.pick?`⚽ ${p.pick.name} (${p.pick.pos})`:"No pick yet"}</div>
                  </div>
                </div>
                {isAdmin && p.pick && !game.winner && (
                  <button className="btn btn-primary btn-sm" style={{width:"auto"}} onClick={() => onDeclareWinner(p)}>
                    🏆 Winner!
                  </button>
                )}
              </div>
            ))}
          </div>
          {!allPicked && <div className="notice" style={{marginTop:12}}>⏳ Waiting for all players to pick…</div>}
          {isAdmin && allPicked && <div style={{fontSize:13,color:"var(--muted)",textAlign:"center",marginTop:8}}>Tap Winner! when the first goal goes in</div>}
          {!isAdmin && <div style={{fontSize:13,color:"var(--muted)",textAlign:"center",marginTop:8}}>Admin will declare the winner</div>}
        </>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("home"); // home, pickMatch, lobby, picking, results
  const [myName, setMyName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [game, setGame] = useState(null);
  const [competition, setCompetition] = useState("pl");
  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [matchesError, setMatchesError] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [teamSheet, setTeamSheet] = useState(null);
  const [loadingSheet, setLoadingSheet] = useState(false);
  const [sheetTab, setSheetTab] = useState("home");
  const [error, setError] = useState(null);
  const [polling, setPolling] = useState(false);

  // Restore session or init
  useEffect(() => {
    async function init() {
      try {
        const saved = localStorage.getItem("ff_session");
        if (saved) {
          const session = JSON.parse(saved);
          const data = await apiCall("/api/game", { action:"get", gameId:session.gameId });
          if (data.game) {
            setGame(data.game);
            setMyName(session.myName);
            setIsAdmin(session.isAdmin);
            if (data.game.winner || data.game.status === "results") setScreen("results");
            else if (data.game.status === "picking") { setScreen("picking"); loadTeamSheet(data.game.match); }
            else setScreen("lobby");
            loadMatches("pl");
            return;
          }
        }
      } catch {}
      loadMatches("pl");
    }
    init();
  }, []);

  // Save session whenever game state changes
  useEffect(() => {
    if (game && myName) {
      localStorage.setItem("ff_session", JSON.stringify({ gameId:game.id, myName, isAdmin }));
    }
  }, [game, myName, isAdmin]);

  // Poll game state every 5s when in lobby/picking/results
  useEffect(() => {
    if (!game || screen === "home" || screen === "pickMatch") return;
    const interval = setInterval(async () => {
      try {
        const data = await apiCall("/api/game", { action: "get", gameId: game.id });
        if (data.game) {
          setGame(data.game);
          // Sync screen state
          if (data.game.winner && screen !== "results") setScreen("results");
          if (data.game.status === "picking" && screen === "lobby" && !isAdmin) {
            setScreen("picking");
            if (!teamSheet) loadTeamSheet(data.game.match);
          }
          if (data.game.status === "results" && screen !== "results") setScreen("results");
        }
      } catch {}
    }, 5000);
    return () => clearInterval(interval);
  }, [game, screen, isAdmin, teamSheet]);

  async function loadMatches(comp) {
    setLoadingMatches(true);
    setMatchesError(null);
    setSelectedMatch(null);
    const compName = comp === "ucl" ? "UEFA Champions League" : "Premier League";
    const today = new Date().toLocaleDateString("en-GB", { weekday:"short", day:"numeric", month:"short", year:"numeric" });
    try {
      const data = await apiCall("/api/chat", {
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [{ role: "user", content: `Search for upcoming ${compName} fixtures from today (${today}) for the next 14 days. Return ONLY a raw JSON array, no markdown, no explanation. Format: [{"home":"Team A","away":"Team B","date":"Mon 11 May","time":"20:00"}]. Max 12 matches, 24hr UK time, order by date ascending.` }],
      });
      const text = (data.content||[]).map(b => b.text||"").join("\n");
      const match = text.replace(/```json|```/g,"").match(/\[[\s\S]*\]/);
      if (!match) throw new Error("no json");
      setMatches(JSON.parse(match[0]));
    } catch {
      if (comp === "ucl") {
        setMatches([
          { home:"PSG", away:"Arsenal", date:"Tue 13 May", time:"20:00" },
          { home:"Inter Milan", away:"Barcelona", date:"Wed 14 May", time:"20:00" },
        ]);
      } else {
        setMatches([
          { home:"Manchester City", away:"Crystal Palace", date:"Wed 13 May", time:"19:30" },
          { home:"Aston Villa", away:"Liverpool", date:"Fri 15 May", time:"20:00" },
          { home:"Arsenal", away:"Burnley", date:"Sun 18 May", time:"16:00" },
          { home:"Brentford", away:"Crystal Palace", date:"Sun 18 May", time:"16:00" },
          { home:"Chelsea", away:"Tottenham Hotspur", date:"Sun 18 May", time:"16:00" },
          { home:"Everton", away:"Sunderland", date:"Sun 18 May", time:"16:00" },
          { home:"Leeds United", away:"Brighton", date:"Sun 18 May", time:"16:00" },
          { home:"Newcastle United", away:"West Ham United", date:"Sun 18 May", time:"16:00" },
          { home:"Wolves", away:"Fulham", date:"Sun 18 May", time:"16:00" },
          { home:"AFC Bournemouth", away:"Manchester City", date:"Tue 19 May", time:"20:00" },
        ]);
      }
      setMatchesError("Showing confirmed fixtures — live fetch unavailable.");
    }
    setLoadingMatches(false);
  }

  async function loadTeamSheet(match) {
    setLoadingSheet(true);
    try {
      const data = await apiCall("/api/chat", {
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [{ role: "user", content: `Search for the expected starting lineup for ${match.home} vs ${match.away} in 2026. Return ONLY a JSON array with 2 objects, no markdown: [{"team":"${match.home}","colour":"#hex","players":[{"number":1,"name":"Player Name","pos":"GK"}]},{"team":"${match.away}","colour":"#hex","players":[...]}]. 11 starters + up to 7 subs. pos: GK DEF MID FWD only.` }],
      });
      const text = (data.content||[]).map(b => b.text||"").join("\n");
      const m = text.replace(/```json|```/g,"").match(/\[[\s\S]*\]/);
      if (!m) throw new Error("no json");
      const result = JSON.parse(m[0]);
      setTeamSheet({ home: result[0], away: result[1] });
      setSheetTab("home");
    } catch {
      setTeamSheet({
        home: { team: match.home, colour:"#e63946", players: fallbackPlayers(match.home,"home") },
        away: { team: match.away, colour:"#4361ee", players: fallbackPlayers(match.away,"away") },
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

  async function handleCreate(name) {
    setMyName(name);
    setIsAdmin(true);
    setScreen("pickMatch");
  }

  async function handleJoin(name, code) {
    setMyName(name);
    setError(null);
    try {
      const data = await apiCall("/api/game", { action:"join", gameId:code, playerName:name });
      if (data.error) { setError(data.error); return; }
      setGame(data.game);
      setIsAdmin(false);
      if (data.game.status === "picking") {
        setScreen("picking");
        loadTeamSheet(data.game.match);
      } else if (data.game.status === "results") {
        setScreen("results");
      } else {
        setScreen("lobby");
      }
    } catch { setError("Couldn't find that game. Check the code and try again."); }
  }

  async function handleMatchSelected() {
    const match = matches[selectedMatch];
    const gameId = generateGameId();
    const data = await apiCall("/api/game", { action:"create", gameId, adminName:myName, match });
    setGame(data.game);
    setScreen("lobby");
    // Update URL
    window.history.pushState({}, "", `?game=${gameId}`);
  }

  async function handleStartPicking() {
    const data = await apiCall("/api/game", { action:"startPicking", gameId:game.id });
    setGame(data.game);
    setScreen("picking");
    loadTeamSheet(game.match);
  }

  async function handlePick(player) {
    const data = await apiCall("/api/game", { action:"pick", gameId:game.id, playerName:myName, pick:player });
    setGame(data.game);
    if (data.game.status === "results") setScreen("results");
  }

  async function handleDeclareWinner(player) {
    const data = await apiCall("/api/game", { action:"declareWinner", gameId:game.id, winnerName:player.name });
    setGame(data.game);
    setScreen("results");
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="app">
      <div className="header">
        <div className="comp-tabs">
          {screen === "pickMatch" && <>
            <div className="comp-tab" onClick={() => { setCompetition("pl"); loadMatches("pl"); }}
              style={{borderColor:competition==="pl"?"var(--green)":"var(--border)",color:competition==="pl"?"var(--green)":"var(--muted)",background:competition==="pl"?"var(--green-dim)":"transparent"}}>
              ⚽ Premier League
            </div>
            <div className="comp-tab" onClick={() => { setCompetition("ucl"); loadMatches("ucl"); }}
              style={{borderColor:competition==="ucl"?"#c9a227":"var(--border)",color:competition==="ucl"?"#c9a227":"var(--muted)",background:competition==="ucl"?"#c9a22720":"transparent"}}>
              ⭐ Champions League
            </div>
          </>}
        </div>
        <h1>Football Friends<br/>1st Goal Scorer</h1>
        <p>Pick a player · £1 entry · Winner takes all</p>
        {game && (
          <div style={{marginTop:8,fontSize:12,color:"var(--muted)",display:"flex",alignItems:"center",justifyContent:"center",gap:12}}>
            <span>Game: <strong style={{color:"var(--text)"}}>{game.id}</strong> · {myName}{isAdmin?" (Admin)":""}</span>
            <span style={{cursor:"pointer",color:"var(--red)",fontSize:11,fontFamily:"var(--font-head)",fontWeight:700,letterSpacing:1,textTransform:"uppercase"}} onClick={() => { localStorage.removeItem("ff_session"); setGame(null); setMyName(""); setIsAdmin(false); setScreen("home"); window.history.pushState({},"","/"); }}>✕ Leave</span>
          </div>
        )}
      </div>

      {error && <div className="container"><div className="notice">⚠️ {error}</div></div>}

      {screen === "home" && <HomeScreen onCreate={handleCreate} onJoin={handleJoin} />}
      {screen === "pickMatch" && (
        <PickMatchScreen
          competition={competition} setCompetition={setCompetition}
          matches={matches} loadingMatches={loadingMatches}
          selectedMatch={selectedMatch} setSelectedMatch={setSelectedMatch}
          matchesError={matchesError} loadMatches={loadMatches}
          onNext={handleMatchSelected}
        />
      )}
      {screen === "lobby" && game && (
        <LobbyScreen game={game} myName={myName} isAdmin={isAdmin}
          onStartPicking={handleStartPicking}
          onRefresh={async () => {
            const data = await apiCall("/api/game", { action:"get", gameId:game.id });
            if (data.game) setGame(data.game);
          }}
        />
      )}
      {screen === "picking" && game && (
        <PickScreen game={game} myName={myName} teamSheet={teamSheet}
          loadingSheet={loadingSheet} onPick={handlePick}
          sheetTab={sheetTab} setSheetTab={setSheetTab}
        />
      )}
      {screen === "results" && game && (
        <ResultsScreen game={game} myName={myName} isAdmin={isAdmin}
          onDeclareWinner={handleDeclareWinner}
        />
      )}
    </div>
  );
}
