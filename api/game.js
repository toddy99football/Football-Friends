const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function redisGet(key) {
  if (!REDIS_URL || !REDIS_TOKEN) throw new Error('Redis env vars not set');
  const res = await fetch(REDIS_URL + '/get/' + encodeURIComponent(key), {
    headers: { Authorization: 'Bearer ' + REDIS_TOKEN },
  });
  if (!res.ok) throw new Error('Redis GET failed: ' + res.status);
  const data = await res.json();
  if (!data.result) return null;
  return JSON.parse(data.result);
}

async function redisSet(key, value) {
  if (!REDIS_URL || !REDIS_TOKEN) throw new Error('Redis env vars not set');
  const serialized = JSON.stringify(value);
  const res = await fetch(REDIS_URL + '/set/' + encodeURIComponent(key), {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + REDIS_TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(serialized),
  });
  if (!res.ok) throw new Error('Redis SET failed: ' + res.status);
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Debug: check env vars are present
  if (!REDIS_URL || !REDIS_TOKEN) {
    return res.status(500).json({ 
      error: 'Redis not configured. Check UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in Vercel environment variables.' 
    });
  }

  const body = req.body || {};
  const { action, gameId, adminName, match, playerName, pick, winnerName } = body;

  if (!action) return res.status(400).json({ error: 'Missing action' });
  if (!gameId && action !== 'test') return res.status(400).json({ error: 'Missing gameId' });

  try {
    switch (action) {

      case 'test': {
        await redisSet('test:ping', { ok: true, ts: Date.now() });
        const result = await redisGet('test:ping');
        return res.json({ ok: true, redis: result ? 'connected' : 'empty response' });
      }

      case 'create': {
        const game = {
          id: gameId,
          adminName,
          match,
          status: 'lobby',
          players: [{ name: adminName, pick: null }],
          winner: null,
          createdAt: Date.now(),
        };
        await redisSet('game:' + gameId, game);
        return res.json({ game });
      }

      case 'get': {
        const game = await redisGet('game:' + gameId);
        if (!game) return res.status(404).json({ error: 'Game not found' });
        return res.json({ game });
      }

      case 'join': {
        const game = await redisGet('game:' + gameId);
        if (!game) return res.status(404).json({ error: 'Game not found. Check your code.' });
        if (game.players.length >= 10) return res.json({ error: 'Game is full (10 players max)' });
        const exists = game.players.find(function(p) { return p.name === playerName; });
        if (!exists) game.players.push({ name: playerName, pick: null });
        await redisSet('game:' + gameId, game);
        return res.json({ game });
      }

      case 'startPicking': {
        const game = await redisGet('game:' + gameId);
        if (!game) return res.status(404).json({ error: 'Game not found' });
        game.status = 'picking';
        await redisSet('game:' + gameId, game);
        return res.json({ game });
      }

      case 'pick': {
        const game = await redisGet('game:' + gameId);
        if (!game) return res.status(404).json({ error: 'Game not found' });
        const player = game.players.find(function(p) { return p.name === playerName; });
        if (!player) return res.json({ error: 'Player not in game' });
        const taken = game.players.find(function(p) { return p.pick && p.pick.name === pick.name; });
        if (taken) return res.json({ error: 'Player already picked' });
        player.pick = pick;
        if (game.players.every(function(p) { return p.pick; })) game.status = 'results';
        await redisSet('game:' + gameId, game);
        return res.json({ game });
      }

      case 'declareWinner': {
        const game = await redisGet('game:' + gameId);
        if (!game) return res.status(404).json({ error: 'Game not found' });
        const winner = game.players.find(function(p) { return p.name === winnerName; });
        if (!winner) return res.json({ error: 'Player not found' });
        game.winner = winner;
        game.status = 'results';
        await redisSet('game:' + gameId, game);
        return res.json({ game });
      }

      default:
        return res.status(400).json({ error: 'Unknown action: ' + action });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Unknown server error' });
  }
};
