import { useState, useEffect } from "react";

const fl = document.createElement("link");
fl.rel = "stylesheet";
fl.href = "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;900&family=DM+Sans:wght@300;400;500&display=swap";
document.head.appendChild(fl);

const styleEl = document.createElement("style");
styleEl.textContent = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg:#0a0a0a; --surface:#111; --card:#1a1a1a; --border:#2d2d2d;
  --red:#e63946; --red-dim:#e6394622; --amber:#ffb300;
  --text:#f0f0f0; --muted:#666; --radius:10px;
  --fh:'Barlow Condensed',sans-serif; --fb:'DM Sans',sans-serif;
}
body { background:var(--bg); color:var(--text); font-family:var(--fb); }
.app { min-height:100vh; padding-bottom:60px; background:radial-gradient(ellipse 80% 30% at 50% 0%,#2a0808 0%,transparent 60%),var(--bg); }
.header { text-align:center; padding:36px 20px 24px; border-bottom:1px solid var(--border); }
.header h1 { font-family:var(--fh); font-size:clamp(34px,8vw,66px); font-weight:900; line-height:.95; text-transform:uppercase; background:linear-gradient(135deg,#fff,var(--red)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.header p { color:var(--muted); font-size:13px; margin-top:8px; letter-spacing:1px; }
.divider { width:50px; height:3px; background:var(--red); margin:12px auto 0; border-radius:2px; }
.con { max-width:660px; margin:0 auto; padding:24px 16px; }
.lbl { font-family:var(--fh); font-size:11px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:var(--muted); margin-bottom:10px; }
.card { background:var(--card); border:1px solid var(--border); border-radius:var(--radius); padding:20px; margin-bottom:12px; }
.card.hi { border-color:var(--red); box-shadow:0 0 20px #e6394415; }
.btn { font-family:var(--fh); font-size:17px; font-weight:700; letter-spacing:1px; text-transform:uppercase; padding:13px 24px; border-radius:var(--radius); border:none; cursor:pointer; transition:all .2s; width:100%; display:block; text-align:center; margin-top:10px; }
.btn-r { background:var(--red); color:#fff; }
.btn-r:hover { background:#ff4d5a; box-shadow:0 0 20px #e6394450; }
.btn-r:disabled { background:var(--border); color:var(--muted); cursor:not-allowed; box-shadow:none; }
.btn-g { background:transparent; color:var(--muted); border:1px solid var(--border); }
.btn-g:hover { border-color:var(--text); color:var(--text); }
.btn-gold { background:linear-gradient(135deg,#c9a227,#ffb300); color:#000; }
.btn-sm { font-size:14px; padding:10px 18px; width:auto; margin-top:0; }
.inp { background:var(--surface); border:1px solid var(--border); border-radius:8px; color:var(--text); font-family:var(--fb); font-size:15px; padding:12px 14px; width:100%; outline:none; transition:border-color .2s; margin-bottom:10px; }
.inp:focus { border-color:var(--red); }
.spin { width:40px; height:40px; border:3px solid var(--border); border-top-color:var(--red); border-radius:50%; animation:spin .8s linear infinite; margin:0 auto 14px; }
@keyframes spin { to{transform:rotate(360deg)} }
.loading { text-align:center; padding:50px 20px; color:var(--muted); font-size:14px; }
.match-card { background:var(--card); border:1px solid var(--border); border-radius:var(--radius); padding:15px 18px; margin-bottom:10px; cursor:pointer; transition:all .2s; display:flex; align-items:center; gap:12px; }
.match-card:hover { border-color:var(--red); transform:translateY(-1px); }
.match-card.sel { border-color:var(--red); background:linear-gradient(135deg,#1a1a1a,#150505); }
.match-vs { font-family:var(--fh); font-size:clamp(14px,3vw,19px); font-weight:900; flex:1; }
.match-dt { font-size:12px; color:var(--muted); margin-top:2px; }
.avail { display:inline-flex; align-items:center; gap:4px; font-family:var(--fh); font-size:10px; font-weight:700; letter-spacing:1px; text-transform:uppercase; padding:3px 7px; border-radius:20px; white-space:nowrap; flex-shrink:0; }
.av-ok { background:#00e67618; color:#00e676; border:1px solid #00e67640; }
.av-soon { background:#ffb30018; color:var(--amber); border:1px solid #ffb30040; animation:pulse 2s ease infinite; }
.av-no { background:#ffffff10; color:var(--muted); border:1px solid #ffffff18; }
@keyframes pulse { 0%,100%{opacity:1}50%{opacity:.5} }
.av-dot { width:5px; height:5px; border-radius:50%; flex-shrink:0; }
.av-ok .av-dot { background:#00e676; }
.av-soon .av-dot { background:var(--amber); }
.av-no .av-dot { background:var(--muted); }
.team-panel { background:var(--card); border:1px solid var(--border); border-radius:var(--radius); overflow:hidden; margin-bottom:14px; }
.team-hdr { padding:12px 16px; font-family:var(--fh); font-size:18px; font-weight:900; text-transform:uppercase; border-bottom:1px solid var(--border); display:flex; align-items:center; gap:8px; }
.tdot { width:9px; height:9px; border-radius:50%; flex-shrink:0; }
.prow { display:flex; align-items:center; gap:10px; padding:9px 16px; border-bottom:1px solid #1e1e1e; cursor:pointer; transition:background .15s; }
.prow:last-child { border-bottom:none; }
.prow:hover { background:#ffffff06; }
.prow.taken { opacity:.3; cursor:not-allowed; }
.pnum { font-family:var(--fh); font-size:12px; font-weight:700; color:var(--muted); width:20px; text-align:center; flex-shrink:0; }
.pname { font-size:14px; font-weight:500; flex:1; }
.ppos { font-family:var(--fh); font-size:10px; font-weight:700; letter-spacing:1px; padding:2px 5px; border-radius:4px; text-transform:uppercase; flex-shrink:0; }
.pos-GK { background:#ffd60018; color:#ffd600; }
.pos-DEF { background:#4fc3f718; color:#4fc3f7; }
.pos-MID { background:#ab47bc18; color:#ce93d8; }
.pos-FWD { background:#e6394818; color:#ff8a80; }
.tabs { display:flex; gap:6px; margin-bottom:14px; }
.tab { font-family:var(--fh); font-size:14px; font-weight:700; text-transform:uppercase; letter-spacing:1px; padding:8px 16px; border-radius:6px; cursor:pointer; flex:1; text-align:center; background:var(--surface); border:1px solid var(--border); color:var(--muted); transition:all .15s; }
.tab.active { background:var(--red); color:#fff; border-color:var(--red); }
.overlay { position:fixed; inset:0; background:#000000b0; display:flex; align-items:center; justify-content:center; z-index:100; backdrop-filter:blur(6px); padding:20px; }
.modal { background:var(--card); border:1px solid var(--red); border-radius:14px; padding:28px; max-width:380px; width:100%; text-align:center; animation:pop .25s cubic-bezier(.34,1.56,.64,1); box-shadow:0 0 50px #e6394430; }
@keyframes pop { from{transform:scale(.85);opacity:0}to{transform:scale(1);opacity:1} }
.modal h2 { font-family:var(--fh); font-size:26px; font-weight:900; text-transform:uppercase; margin-bottom:6px; }
.modal-pick { font-family:var(--fh); font-size:22px; font-weight:700; color:var(--red); background:var(--red-dim); border-radius:8px; padding:10px 18px; margin:14px 0; border:1px solid #e6394835; }
.notice { background:#ffb30012; border:1px solid #ffb30030; border-radius:8px; padding:11px 14px; font-size:13px; color:var(--amber); margin-bottom:12px; }
.err { background:#e6394812; border:1px solid #e6394830; border-radius:8px; padding:11px 14px; font-size:13px; color:var(--red); margin-bottom:12px; display:flex; justify-content:space-between; align-items:center; gap:8px; }
.ok { background:#00e67612; border:1px solid #00e67630; border-radius:8px; padding:11px 14px; font-size:13px; color:#00e676; margin-bottom:12px; }
.pick-row { display:flex; align-items:center; justify-content:space-between; padding:12px 0; border-bottom:1px solid var(--border); }
.pick-row:last-child { border-bottom:none; }
.pot { font-family:var(--fh); font-size:56px; font-weight:900; color:var(--red); line-height:1; }
.winner-wrap { text-align:center; padding:40px 20px; }
.trophy { font-size:72px; display:block; animation:bounce 1s ease infinite alternate; margin-bottom:14px; }
@keyframes bounce { from{transform:translateY(0) rotate(-5deg)}to{transform:translateY(-12px) rotate(5deg)} }
.winner-name { font-family:var(--fh); font-size:clamp(42px,10vw,76px); font-weight:900; text-transform:uppercase; background:linear-gradient(135deg,#fff,var(--red)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.game-bar { background:var(--surface); border-bottom:1px solid var(--border); padding:7px 20px; display:flex; align-items:center; justify-content:center; gap:14px; font-size:12px; color:var(--muted); }
.game-bar strong { color:var(--text); font-family:var(--fh); font-size:14px; letter-spacing:1px; }
.leave { color:var(--red); font-size:11px; font-family:var(--fh); font-weight:700; letter-spacing:1px; text-transform:uppercase; cursor:pointer; border:1px solid var(--red); padding:2px 8px; border-radius:4px; }
.stats { display:flex; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); overflow:hidden; margin-bottom:16px; }
.stat { flex:1; text-align:center; padding:14px 8px; border-right:1px solid var(--border); }
.stat:last-child { border-right:none; }
.stat-v { font-family:var(--fh); font-size:26px; font-weight:900; color:var(--red); }
.stat-l { font-size:10px; color:var(--muted); text-transform:uppercase; letter-spacing:1px; font-family:var(--fh); }
.share-box { background:var(--surface); border:1px solid var(--red); border-radius:8px; padding:12px 16px; font-size:13px; word-break:break-all; color:var(--red); margin:8px 0; cursor:pointer; text-align:center; }
.player-lob { background:var(--surface); border:1px solid var(--border); border-radius:8px; padding:11px 14px; display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; }
.badge { font-family:var(--fh); font-size:10px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; padding:2px 7px; border-radius:10px; background:var(--red-dim); color:var(--red); border:1px solid #e6394835; margin-left:8px; }
.two { display:flex; gap:10px; margin-top:12px; }
.live-game { background:linear-gradient(135deg,#1a0505,#1a1a1a); border:2px solid var(--red); border-radius:var(--radius); padding:20px; margin-bottom:16px; cursor:pointer; transition:all .2s; }
.live-game:hover { box-shadow:0 0 30px #e6394430; transform:translateY(-2px); }
.live-badge { display:inline-flex; align-items:center; gap:5px; font-family:var(--fh); font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:var(--red); margin-bottom:10px; }
.live-dot { width:7px; height:7px; background:var(--red); border-radius:50%; animation:pulse 1s ease infinite; }
`;
document.head.appendChild(styleEl);

const COLS = ["#e63946","#ff6b35","#c9a227","#4361ee","#9b5de5","#00b4d8","#06d6a0","#fb8500","#e07a5f","#52b788"];

const FIXTURES = [
  { home:"Aston Villa", away:"Liverpool", date:"Fri 15 May", time:"20:00" },
  { home:"Brentford", away:"Crystal Palace", date:"Sat 17 May", time:"12:30" },
  { home:"Everton", away:"Sunderland", date:"Sat 17 May", time:"15:00" },
  { home:"Leeds United", away:"Brighton", date:"Sat 17 May", time:"15:00" },
  { home:"Manchester United", away:"Nottingham Forest", date:"Sat 17 May", time:"15:00" },
  { home:"Newcastle United", away:"West Ham United", date:"Sat 17 May", time:"15:00" },
  { home:"Arsenal", away:"Burnley", date:"Sun 18 May", time:"16:00" },
  { home:"AFC Bournemouth", away:"Manchester City", date:"Tue 20 May", time:"20:00" },
  { home:"Chelsea", away:"Tottenham Hotspur", date:"Tue 20 May", time:"20:00" },
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
];

function uid() { return Math.random().toString(36).substr(2,8).toUpperCase(); }

async function api(body) {
  const res = await fetch("/api/game", {
    method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "HTTP "+res.status);
  return data;
}

async function aiCall(body) {
  const res = await fetch("/api/chat", {
    method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body),
  });
  return res.json();
}

function avail(match) {
  try {
    const months = {Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};
    const p = match.date.replace(/^[A-Za-z]{2,3}\s/,"").split(" ");
    const ko = new Date(new Date().getFullYear(), months[p[1]], parseInt(p[0]), ...match.time.split(":").map(Number));
    const now = new Date();
    const ann = new Date(ko - 36e5);
    const hrs = (ko - now) / 36e5;
    if (now >= ann) return {cls:"av-ok", label:"Sheet Live"};
    if (hrs <= 3) return {cls:"av-soon", label:"Soon"};
    return {cls:"av-no", label:ann.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})};
  } catch { return {cls:"av-no",label:"TBC"}; }
}

function PosTag({pos}) {
  return <span className={"ppos pos-"+(pos||"MID")}>{pos||"?"}</span>;
}

function fallback(team, side) {
  const rows = side==="home"
    ? [["1","GK","GK"],["2","DEF","RB"],["5","DEF","CB"],["6","DEF","CB"],["3","DEF","LB"],["4","MID","DM"],["8","MID","CM"],["10","MID","AM"],["7","FWD","RW"],["9","FWD","ST"],["11","FWD","LW"]]
    : [["1","GK","GK"],["2","DEF","RB"],["4","DEF","CB"],["5","DEF","CB"],["3","DEF","LB"],["6","MID","DM"],["8","MID","CM"],["10","MID","AM"],["7","FWD","RW"],["9","FWD","ST"],["11","FWD","LW"]];
  return rows.map(([n,pos,lbl]) => ({number:n, name:team+" "+lbl, pos}));
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [myName, setMyName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [game, setGame] = useState(null);
  const [currentGame, setCurrentGame] = useState(null); // live game anyone can see
  const [teamSheet, setTeamSheet] = useState(null);
  const [loadingSheet, setLoadingSheet] = useState(false);
  const [sheetTab, setSheetTab] = useState("home");
  const [err, setErr] = useState("");
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(true);

  // On load: always show home screen, but fetch current game for display
  useEffect(() => {
    async function init() {
      try {
        const d = await api({action:"getCurrent"});
        if (d && d.game && Array.isArray(d.game.players)) {
          setCurrentGame(d.game);
        }
      } catch {}
      setLoading(false);
    }
    init();
    // Clear any old session so home screen is always fresh
    try { localStorage.removeItem("ff"); } catch {}
  }, []);

  // Save session
  useEffect(() => {
    if (game && myName) {
      try { localStorage.setItem("ff", JSON.stringify({gameId:game.id, myName, isAdmin})); } catch {}
    }
  }, [game, myName, isAdmin]);

  // Poll every 5s
  useEffect(() => {
    if (!game || screen === "home") return;
    const t = setInterval(async () => {
      try {
        const d = await api({action:"get", gameId:game.id});
        if (d && d.game && Array.isArray(d.game.players)) {
          setGame(d.game);
          if (d.game.winner) setScreen("results");
          else if (d.game.status === "picking" && screen === "lobby") {
            setScreen("picking");
            if (!teamSheet) loadSheet(d.game.match);
          } else if (d.game.status === "results") setScreen("results");
        }
      } catch {}
    }, 5000);
    return () => clearInterval(t);
  }, [game, screen, teamSheet]);

  // Poll home screen for new games every 10s
  useEffect(() => {
    if (screen !== "home") return;
    const t = setInterval(async () => {
      try {
        const d = await api({action:"getCurrent"});
        if (d && d.game && Array.isArray(d.game.players)) setCurrentGame(d.game);
        else setCurrentGame(null);
      } catch {}
    }, 10000);
    return () => clearInterval(t);
  }, [screen]);

  async function loadSheet(match) {
    if (!match) return;
    setLoadingSheet(true);
    setTeamSheet(null);
    try {
      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-GB", {hour:"2-digit",minute:"2-digit"});
      const dateStr = now.toLocaleDateString("en-GB", {weekday:"short",day:"numeric",month:"short",year:"numeric"});
      const prompt = "Search for the confirmed or predicted starting lineup for " + match.home + " vs " + match.away +
        " in the Premier League. Today is " + dateStr + " and the time is " + timeStr + ". " +
        "If the official lineup has been announced use that, otherwise use the predicted/expected lineup based on recent form and injuries. " +
        "Return ONLY a JSON array with no markdown, no explanation, nothing else: " +
        '[{"team":"' + match.home + '","colour":"#e63946","players":[{"number":1,"name":"Actual Player Name","pos":"GK"},{"number":2,"name":"Actual Player Name","pos":"DEF"}]},' +
        '{"team":"' + match.away + '","colour":"#4361ee","players":[{"number":1,"name":"Actual Player Name","pos":"GK"}]}]' +
        ". Include 11 starters and up to 5 substitutes per team. pos must be exactly GK, DEF, MID, or FWD. Use real player names.";
      const d = await aiCall({
        model:"claude-sonnet-4-20250514", max_tokens:2000,
        tools:[{type:"web_search_20250305",name:"web_search"}],
        messages:[{role:"user",content:prompt}]
      });
      const txt = (d.content||[]).map(b=>b.text||"").join(" ");
      const s = txt.indexOf("["), e = txt.lastIndexOf("]");
      if (s >= 0 && e > s) {
        const r = JSON.parse(txt.slice(s,e+1));
        if (r[0]?.players?.length && r[1]?.players?.length) {
          setTeamSheet({home:r[0], away:r[1]});
          setSheetTab("home");
          setLoadingSheet(false);
          return;
        }
      }
    } catch {}
    setTeamSheet({
      home:{team:match.home, colour:"#e63946", players:fallback(match.home,"home")},
      away:{team:match.away, colour:"#4361ee", players:fallback(match.away,"away")}
    });
    setLoadingSheet(false);
  }

  function leave() {
    try { localStorage.removeItem("ff"); } catch {}
    setGame(null); setMyName(""); setIsAdmin(false);
    setScreen("home"); setTeamSheet(null); setErr("");
    try { window.history.pushState({},"","/"); } catch {}
    // Refresh current game
    api({action:"getCurrent"}).then(d => {
      if (d && d.game && Array.isArray(d.game.players)) setCurrentGame(d.game);
    }).catch(()=>{});
  }

  // ── HOME SCREEN ─────────────────────────────────────────────────────
  function HomeScreen() {
    const [name, setName] = useState("");
    const [busy, setBusy] = useState(false);
    const [mode, setMode] = useState(null); // null | "join" | "joinGame"

    const hasGame = currentGame && Array.isArray(currentGame.players) && currentGame.status !== "results";
    const isPicking = hasGame && currentGame.status === "picking";
    const av = hasGame ? avail(currentGame.match) : null;

    async function joinGame() {
      if (!name.trim() || !currentGame) return;
      setBusy(true); setErr("");
      try {
        const d = await api({action:"join", gameId:currentGame.id, playerName:name.trim()});
        if (!d || !d.game || !Array.isArray(d.game.players)) { setErr("Failed to join."); setBusy(false); return; }
        if (d.error) { setErr(d.error); setBusy(false); return; }
        setTeamSheet(null); setModal(null);
        setGame(d.game);
        setMyName(name.trim());
        setIsAdmin(d.game.adminName === name.trim());
        if (d.game.status === "picking") { setScreen("picking"); loadSheet(d.game.match); }
        else if (d.game.status === "results") setScreen("results");
        else setScreen("lobby");
      } catch(e) { setErr(e.message || "Connection error"); }
      setBusy(false);
    }

    return (
      <div className="con">
        {err && <div className="err"><span>{err}</span><span style={{cursor:"pointer"}} onClick={()=>setErr("")}>✕</span></div>}

        {/* Hero */}
        <div style={{textAlign:"center",padding:"16px 0 24px"}}>
          <div style={{fontSize:44,marginBottom:10}}>⚽</div>
          <div style={{fontFamily:"var(--fh)",fontSize:14,color:"var(--muted)",letterSpacing:3,textTransform:"uppercase"}}>
            £1 Entry · Winner Takes All
          </div>
        </div>

        {loading ? (
          <div className="loading"><div className="spin"/><p>Loading…</p></div>
        ) : (
          <>
            {/* ── LIVE GAME CARD ── */}
            {hasGame && (
              <div style={{marginBottom:20}}>
                <div className={"avail "+av.cls} style={{display:"inline-flex",marginBottom:10,fontSize:12,padding:"4px 12px"}}>
                  <div className="av-dot"/>{isPicking ? "Picks Open" : "Game Lobby"}
                </div>
                <div className="live-game" style={{cursor:"default",marginBottom:0}}>
                  <div style={{fontFamily:"var(--fh)",fontSize:"clamp(20px,5vw,32px)",fontWeight:900,textTransform:"uppercase",lineHeight:1,marginBottom:4}}>
                    {currentGame.match?.home} <span style={{color:"var(--muted)",fontWeight:400}}>vs</span> {currentGame.match?.away}
                  </div>
                  <div style={{color:"var(--muted)",fontSize:13,marginBottom:14}}>
                    {currentGame.match?.date} · {currentGame.match?.time}
                  </div>
                  <div style={{display:"flex",gap:16,marginBottom:currentGame.players.length>0?14:0}}>
                    <div style={{fontSize:13}}><strong style={{color:"var(--text)"}}>{currentGame.players.length}</strong> <span style={{color:"var(--muted)"}}>players</span></div>
                    <div style={{fontSize:13}}><strong style={{color:"var(--red)"}}>£{currentGame.players.length}</strong> <span style={{color:"var(--muted)"}}>pot</span></div>
                    <div style={{fontSize:13}}><strong style={{color:"var(--text)"}}>{10-currentGame.players.length}</strong> <span style={{color:"var(--muted)"}}>slots left</span></div>
                  </div>
                  {currentGame.players.length > 0 && (
                    <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                      {currentGame.players.map((p,i) => (
                        <div key={i} style={{background:"#ffffff0a",border:"1px solid var(--border)",borderRadius:20,padding:"3px 10px",fontSize:12,display:"flex",alignItems:"center",gap:5}}>
                          <span style={{color:COLS[i%COLS.length],fontSize:9}}>●</span>{p.name}
                          {p.pick && <span style={{color:"#00e676",fontSize:10}}>✓</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── NO GAME MESSAGE ── */}
            {!hasGame && !currentGame?.status && (
              <div style={{textAlign:"center",padding:"20px 0 28px",color:"var(--muted)",fontSize:14}}>
                No active game right now
              </div>
            )}

            {/* ── ACTION BUTTONS ── */}
            {mode === null && (
              <div style={{display:"grid",gap:10}}>
                {hasGame && (
                  <button className="btn btn-r" style={{fontSize:20,padding:"16px"}} onClick={()=>setMode("joinGame")}>
                    ⚽ {isPicking ? "Rejoin & Pick →" : "Join Game →"}
                  </button>
                )}
                <button className="btn btn-g" style={{fontSize:16}} onClick={()=>setScreen("create")}>
                  🏆 Create a New Game
                </button>
                {currentGame?.status === "results" && (
                  <button className="btn btn-g" style={{fontSize:16}} onClick={()=>setMode("joinGame")}>
                    📋 View Results
                  </button>
                )}
              </div>
            )}

            {/* ── JOIN FORM ── */}
            {mode === "joinGame" && (
              <div className="card hi">
                <div style={{fontFamily:"var(--fh)",fontSize:20,fontWeight:900,textTransform:"uppercase",marginBottom:14,color:"var(--red)"}}>
                  {currentGame?.status === "results" ? "View Results" : isPicking ? "Rejoin Game" : "Join Game"}
                </div>
                <div className="lbl">Your Name</div>
                <input className="inp" placeholder="Enter your name…" value={name}
                  onChange={e=>setName(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&name.trim()&&(currentGame?.status==="results"?rejoinResults():joinGame())}
                  autoFocus style={{fontSize:17,padding:"14px"}} />
                {currentGame?.status === "results" ? (
                  <RejoinResultsBtn name={name} busy={busy} setBusy={setBusy} game={currentGame} />
                ) : (
                  <button className="btn btn-r" disabled={!name.trim()||busy} onClick={joinGame}
                    style={{fontSize:19,padding:"15px"}}>
                    {busy ? "Joining…" : isPicking ? "Rejoin & Pick →" : "Join Game →"}
                  </button>
                )}
                <button className="btn btn-g" style={{marginTop:8}} onClick={()=>setMode(null)}>← Back</button>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  function RejoinResultsBtn({ name, busy, setBusy, game }) {
    async function go() {
      if (!name.trim()) return;
      setBusy(true);
      try {
        const d = await api({action:"get", gameId:game.id});
        if (!d || !d.game || !Array.isArray(d.game.players)) { setBusy(false); return; }
        const wasIn = d.game.players.find(p=>p.name.toLowerCase()===name.trim().toLowerCase());
        if (!wasIn) { setErr("You weren't in this game."); setBusy(false); return; }
        setTeamSheet(null); setModal(null);
        setGame(d.game); setMyName(wasIn.name);
        setIsAdmin(d.game.adminName===wasIn.name);
        setScreen("results");
      } catch(e) { setErr(e.message); }
      setBusy(false);
    }
    return (
      <button className="btn btn-r" disabled={!name.trim()||busy} onClick={go} style={{fontSize:19,padding:"15px"}}>
        {busy ? "Loading…" : "View Results →"}
      </button>
    );
  }

  // ── CREATE GAME FORM ────────────────────────────────────────────────
  function CreateGameForm() {
    const [adminName, setAdminName] = useState("");
    const [sel, setSel] = useState(null);
    const [busy, setBusy] = useState(false);
    const [step, setStep] = useState(1); // 1=name, 2=match

    async function create() {
      if (!adminName.trim() || sel === null) return;
      setBusy(true); setErr("");
      const gameId = uid();
      const match = FIXTURES[sel];
      try {
        const d = await api({action:"create", gameId, adminName:adminName.trim(), match});
        if (!d || !d.game) { setErr("Failed to create game"); setBusy(false); return; }
        // Clear all old game state before setting new game
        setTeamSheet(null);
        setSheetTab("home");
        setModal(null);
        setErr("");
        setGame(d.game);
        setMyName(adminName.trim());
        setIsAdmin(true);
        setCurrentGame(d.game);
        try { localStorage.removeItem("ff"); } catch {}
        setScreen("lobby");
      } catch(e) { setErr(e.message || "Error creating game"); }
      setBusy(false);
    }

    return (
      <div className="card hi" style={{marginTop:16}}>
        <div style={{fontFamily:"var(--fh)",fontSize:20,fontWeight:900,textTransform:"uppercase",color:"var(--red)",marginBottom:16}}>
          🏆 Create a Game
        </div>

        {step === 1 && (
          <>
            <div className="lbl">Your Name</div>
            <input className="inp" placeholder="Enter your name…" value={adminName}
              onChange={e=>setAdminName(e.target.value)} autoFocus />
            <button className="btn btn-r" disabled={!adminName.trim()} onClick={()=>setStep(2)}>
              Next: Pick Match →
            </button>
            <button className="btn btn-g" onClick={()=>setScreen("home")}>← Cancel</button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="lbl">Select a Match</div>
            {FIXTURES.map((m,i) => {
              const av = avail(m);
              return (
                <div key={i} className={"match-card"+(sel===i?" sel":"")} onClick={()=>setSel(i)}>
                  <div style={{flex:1}}>
                    <div className="match-vs">{m.home} <span style={{color:"var(--muted)"}}>vs</span> {m.away}</div>
                    <div className="match-dt">{m.date} · {m.time}</div>
                  </div>
                  <div className={"avail "+av.cls}><div className="av-dot"/>{av.label}</div>
                  {sel===i&&<span style={{color:"var(--red)",fontSize:18,fontWeight:900}}>✓</span>}
                </div>
              );
            })}
            <div className="two">
              <button className="btn btn-g" onClick={()=>setStep(1)}>← Back</button>
              <button className="btn btn-r" disabled={sel===null||busy} onClick={create}>
                {busy?"Creating…":"Create Game →"}
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  // ── LOBBY ───────────────────────────────────────────────────────────
  function LobbyScreen() {
    const [copied, setCopied] = useState(false);
    const players = game?.players || [];
    const link = window.location.origin;

    function copy() {
      try { navigator.clipboard.writeText(link); } catch {}
      setCopied(true); setTimeout(()=>setCopied(false),2000);
    }

    async function startPicking() {
      try {
        // First refresh to get latest player list
        const latest = await api({action:"get", gameId:game.id});
        if (latest && latest.game && Array.isArray(latest.game.players)) {
          setGame(latest.game);
        }
        // Then open picking
        const d = await api({action:"startPicking", gameId:game.id});
        if (d && d.game && Array.isArray(d.game.players)) {
          setGame(d.game);
          setScreen("picking");
          loadSheet(d.game.match);
        }
      } catch(e) { setErr(e.message); }
    }

    async function refresh() {
      try {
        const d = await api({action:"get", gameId:game.id});
        if (d && d.game && Array.isArray(d.game.players)) setGame(d.game);
      } catch {}
    }

    return (
      <div className="con">
        <div className="card hi" style={{marginBottom:16}}>
          <div style={{fontFamily:"var(--fh)",fontSize:11,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:"var(--red)",marginBottom:6}}>Tonight's Match</div>
          <div style={{fontFamily:"var(--fh)",fontSize:"clamp(17px,4vw,24px)",fontWeight:900,textTransform:"uppercase",lineHeight:1.1}}>
            {game.match?.home} <span style={{color:"var(--muted)"}}>vs</span> {game.match?.away}
          </div>
          <div style={{color:"var(--muted)",fontSize:13,marginTop:6}}>{game.match?.date} · {game.match?.time}</div>
        </div>

        <div className="lbl">Invite Friends — Share This Link</div>
        <div className="share-box" onClick={copy}>{copied?"✓ Copied!":link}</div>
        <div style={{fontSize:11,color:"var(--muted)",textAlign:"center",marginBottom:16}}>
          Friends just open the link, enter their name and tap Join
        </div>

        <div className="stats">
          <div className="stat"><div className="stat-v">{players.length}</div><div className="stat-l">Players</div></div>
          <div className="stat"><div className="stat-v">£{players.length}</div><div className="stat-l">Pot</div></div>
          <div className="stat"><div className="stat-v">{10-players.length}</div><div className="stat-l">Slots Left</div></div>
        </div>

        <div className="lbl">Players Joined</div>
        {players.map((p,i) => (
          <div key={i} className="player-lob" style={p.name===game.adminName?{borderColor:"#e6394840"}:{}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{color:COLS[i%COLS.length],fontSize:18}}>●</span>
              <span style={{fontWeight:600}}>{p.name}</span>
              {p.name===myName&&<span className="badge">You</span>}
              {p.name===game.adminName&&<span style={{fontSize:11,color:"var(--red)",fontFamily:"var(--fh)",fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginLeft:4}}>Admin</span>}
            </div>
            <span style={{fontSize:12,color:p.pick?"#00e676":"var(--muted)"}}>{p.pick?"✓ Picked":"Waiting"}</span>
          </div>
        ))}

        <div className="two" style={{marginTop:16}}>
          <button className="btn btn-g btn-sm" onClick={refresh}>↻ Refresh</button>
          {isAdmin
            ? <button className="btn btn-r" style={{flex:1,marginTop:0}} onClick={startPicking}>Open Picks →</button>
            : <div style={{flex:1,fontSize:13,color:"var(--muted)",textAlign:"center",padding:"10px 0"}}>Waiting for admin…</div>
          }
        </div>
      </div>
    );
  }

  // ── PICKING ─────────────────────────────────────────────────────────
  function PickingScreen() {
    const players = game?.players || [];
    const myPlayer = players.find(p=>p.name===myName);
    const taken = players.filter(p=>p.pick).map(p=>p.pick?.name).filter(Boolean);

    // Load sheet if not already loaded
    useEffect(() => {
      if (!teamSheet && !loadingSheet && game?.match) {
        loadSheet(game.match);
      }
    }, []);

    if (myPlayer?.pick) return (
      <div className="con">
        <div className="ok">✅ Your pick: <strong>{myPlayer.pick.name}</strong> — Good luck!</div>
        <div className="lbl">All Picks</div>
        <div className="card">
          {players.map((p,i) => (
            <div key={i} className="pick-row">
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{color:COLS[i%COLS.length],fontSize:16}}>●</span>
                <div>
                  <div style={{fontWeight:600}}>{p.name}{p.name===myName&&<span className="badge">You</span>}</div>
                  <div style={{fontSize:13,color:p.pick?"#00e676":"var(--muted)",marginTop:2}}>{p.pick?"⚽ "+p.pick.name:"Yet to pick…"}</div>
                </div>
              </div>
            </div>
          ))}
          <div style={{textAlign:"center",paddingTop:14,borderTop:"1px solid var(--border)",marginTop:8}}>
            <div style={{color:"var(--muted)",fontSize:11,textTransform:"uppercase",letterSpacing:1,fontFamily:"var(--fh)"}}>Prize Pot</div>
            <div className="pot">£{players.length}</div>
          </div>
        </div>
        <div style={{textAlign:"center",color:"var(--muted)",fontSize:12,marginTop:8}}>Updates every 5 seconds</div>
      </div>
    );

    return (
      <div className="con">
        <div className="notice">⚽ <strong>{myName}</strong> — tap a player to pick your First Goal Scorer</div>
        {loadingSheet ? (
          <div className="loading"><div className="spin"/><p>Loading team sheets…</p></div>
        ) : teamSheet ? (
          <>
            <div className="tabs">
              <div className={"tab"+(sheetTab==="home"?" active":"")} onClick={()=>setSheetTab("home")}>{teamSheet.home?.team}</div>
              <div className={"tab"+(sheetTab==="away"?" active":"")} onClick={()=>setSheetTab("away")}>{teamSheet.away?.team}</div>
            </div>
            {["home","away"].map(side => sheetTab===side ? (
              <div key={side} className="team-panel">
                <div className="team-hdr">
                  <div className="tdot" style={{background:teamSheet[side]?.colour||"#e63946"}}/>
                  {teamSheet[side]?.team}
                </div>
                {(teamSheet[side]?.players||[]).map((p,i) => {
                  const isTaken = taken.includes(p.name);
                  const takenBy = players.find(pl=>pl.pick?.name===p.name);
                  return (
                    <div key={i} className={"prow"+(isTaken?" taken":"")} onClick={()=>!isTaken&&setModal(p)}>
                      <span className="pnum">#{p.number}</span>
                      <span className="pname">{p.name}</span>
                      <PosTag pos={p.pos}/>
                      {isTaken&&<span style={{fontSize:11,color:"var(--amber)"}}>→ {takenBy?.name}</span>}
                    </div>
                  );
                })}
              </div>
            ):null)}
          </>
        ) : <div style={{textAlign:"center",padding:40,color:"var(--muted)"}}>Team sheet not available</div>}
      </div>
    );
  }

  // ── RESULTS ─────────────────────────────────────────────────────────
  function ResultsScreen() {
    const players = game?.players || [];

    async function declareWinner(player) {
      try {
        const d = await api({action:"declareWinner", gameId:game.id, winnerName:player.name});
        if (d && d.game) setGame(d.game);
      } catch(e) { setErr(e.message); }
    }

    if (game?.winner) return (
      <div className="con">
        <div className="winner-wrap">
          <span className="trophy">🏆</span>
          <div className="winner-name">{game.winner.name}</div>
          <div style={{color:"var(--muted)",fontSize:15,margin:"10px 0 20px"}}>
            picked <strong style={{color:"#fff"}}>{game.winner.pick?.name}</strong> — First Goal Scorer!
          </div>
          <div className="pot">£{players.length}</div>
          <div style={{color:"var(--muted)",fontSize:12,marginTop:6}}>Winner takes all 🎉</div>
        </div>
      </div>
    );

    return (
      <div className="con">
        <div className="lbl">All Picks</div>
        <div className="stats">
          <div className="stat"><div className="stat-v">{players.filter(p=>p.pick).length}/{players.length}</div><div className="stat-l">Picked</div></div>
          <div className="stat"><div className="pot" style={{fontSize:32}}>£{players.length}</div><div className="stat-l">Prize Pot</div></div>
        </div>
        <div className="card">
          {players.map((p,i) => (
            <div key={i} className="pick-row">
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{color:COLS[i%COLS.length],fontSize:16}}>●</span>
                <div>
                  <div style={{fontWeight:600}}>{p.name}{p.name===myName&&<span className="badge">You</span>}</div>
                  <div style={{fontSize:13,color:p.pick?"#00e676":"var(--muted)",marginTop:2}}>
                    {p.pick?"⚽ "+p.pick.name+" ("+p.pick.pos+")":"No pick"}
                  </div>
                </div>
              </div>
              {isAdmin&&p.pick&&!game.winner&&(
                <button className="btn btn-gold btn-sm" onClick={()=>declareWinner(p)}>🏆 Winner!</button>
              )}
            </div>
          ))}
        </div>
        {!isAdmin&&<div style={{textAlign:"center",color:"var(--muted)",fontSize:13,marginTop:8}}>Waiting for the first goal… ⚽</div>}
        {isAdmin&&<div style={{textAlign:"center",color:"var(--muted)",fontSize:13,marginTop:8}}>Tap Winner! when the first goal goes in</div>}
      </div>
    );
  }

  // ── RENDER ──────────────────────────────────────────────────────────
  return (
    <div className="app">
      <div className="header">
        <div style={{fontSize:32,marginBottom:6}}>⚽</div>
        <h1>Football Friends<br/>1st Goal Scorer</h1>
        <p>Pick a player · £1 entry · Winner takes all</p>
        <div className="divider"/>
      </div>

      {game && (
        <div className="game-bar">
          <span>{game.match?.home} vs {game.match?.away}</span>
          <span>·</span>
          <strong>{myName}{isAdmin?" (Admin)":""}</strong>
          <span className="leave" onClick={leave}>✕ Leave</span>
        </div>
      )}

      {err && screen !== "home" && (
        <div className="con" style={{paddingBottom:0}}>
          <div className="err"><span>⚠️ {err}</span><span style={{cursor:"pointer"}} onClick={()=>setErr("")}>✕</span></div>
        </div>
      )}

      {screen==="home" && <HomeScreen/>}
      {screen==="create" && <CreateGameForm/>}
      {screen==="lobby" && game && <LobbyScreen/>}
      {screen==="picking" && game && <PickingScreen/>}
      {screen==="results" && game && <ResultsScreen/>}

      {modal && (
        <div className="overlay" onClick={()=>setModal(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <h2>Confirm Pick</h2>
            <p style={{color:"var(--muted)",fontSize:14,marginTop:4}}>Lock in your First Goal Scorer?</p>
            <div className="modal-pick">⚽ {modal.name}</div>
            <div style={{fontSize:13,color:"var(--muted)",marginBottom:16}}>£1 entry · winner takes all</div>
            <div className="two">
              <button className="btn btn-g" style={{marginTop:0}} onClick={()=>setModal(null)}>Cancel</button>
              <button className="btn btn-r" style={{marginTop:0}} onClick={async()=>{
                try {
                  const d = await api({action:"pick", gameId:game.id, playerName:myName, pick:modal});
                  if (d.error) { setErr(d.error); }
                  else if (d.game && Array.isArray(d.game.players)) {
                    setGame(d.game);
                    if (d.game.status==="results") setScreen("results");
                  }
                } catch(e) { setErr(e.message); }
                setModal(null);
              }}>Lock It In ✓</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
