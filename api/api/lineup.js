module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { home, away } = req.body || {};
  if (!home || !away) return res.status(400).json({ error: 'Missing teams' });

  const API_KEY = process.env.FOOTBALL_API_KEY;

  try {
    // Get current PL matches
    const matchRes = await fetch('https://api.football-data.org/v4/competitions/PL/matches?status=SCHEDULED,LIVE,IN_PLAY,PAUSED', {
      headers: { 'X-Auth-Token': API_KEY }
    });
    const matchData = await matchRes.json();

    // Find our match
    const match = (matchData.matches || []).find(m => {
      const h = m.homeTeam.name.toLowerCase();
      const a = m.awayTeam.name.toLowerCase();
      const searchHome = home.toLowerCase();
      const searchAway = away.toLowerCase();
      return (h.includes(searchHome.split(' ')[0]) || searchHome.includes(h.split(' ')[0])) &&
             (a.includes(searchAway.split(' ')[0]) || searchAway.includes(a.split(' ')[0]));
    });

    if (!match) {
      return res.json({ home: null, away: null, error: 'Match not found' });
    }

    // Get lineups for this match
    const lineupRes = await fetch('https://api.football-data.org/v4/matches/' + match.id + '/lineups', {
      headers: { 'X-Auth-Token': API_KEY }
    });
    const lineupData = await lineupRes.json();

    if (!lineupData.homeTeam || !lineupData.awayTeam) {
      return res.json({ home: null, away: null, error: 'Lineups not yet available' });
    }

    function formatTeam(team, colour) {
      var players = [];
      (team.startingXI || []).forEach(function(p) {
        players.push({
          number: p.shirtNumber || 0,
          name: p.name,
          pos: mapPos(p.position)
        });
      });
      (team.substitutes || []).forEach(function(p) {
        players.push({
          number: p.shirtNumber || 0,
          name: p.name,
          pos: mapPos(p.position)
        });
      });
      return { team: team.name, colour: colour, players: players };
    }

    function mapPos(pos) {
      if (!pos) return 'MID';
      pos = pos.toUpperCase();
      if (pos.includes('KEEPER') || pos === 'GK') return 'GK';
      if (pos.includes('BACK') || pos.includes('DEFENCE') || pos === 'DEF') return 'DEF';
      if (pos.includes('FORWARD') || pos.includes('WINGER') || pos === 'FWD') return 'FWD';
      return 'MID';
    }

    return res.json({
      home: formatTeam(lineupData.homeTeam, '#95bfe5'),
      away: formatTeam(lineupData.awayTeam, '#e63946')
    });

  } catch (err) {
    return res.status(500).json({ error: err.message, home: null, away: null });
  }
};
