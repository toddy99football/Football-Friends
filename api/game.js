const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function redisGet(key) {
  const res = await fetch(`${REDIS_URL}/get/${key}`, {
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
  });
  const data = await res.json();
  if (!data.result) return null;
  return JSON.parse(data.result);
}

async function redisSet(key, value) {
  await fetch(`${REDIS_URL}/set/${key}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(JSON.stringify(value)),
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { action, gameId, adminName, match, playerName, pick, winnerName } = req.body;

  try {
    switch (action) {

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
        await redisSet(`game:${gameId}`, game);
        return res.json({ game });
      }

      case 'get': {
        const game = await redisGet(`game:${gameId}`);
        if (!game) return res.status(404).json({ error: 'Game not found' });
        return res.json({ game });
      }

      case 'join': {
        const game = await redisGet(`game:${gameId}`);
        if (!game) return res.status(404).json({ error: 'Game not found. Check your code.' });
        if (game.players.length >= 10) return res.json({ error: 'Game is full (10 players max)' });
        const exists = game.players.find(p => p.name === playerName);
        if (!exists) game.players.push({ name: playerName, pick: null });
        await redisSet(`game:${gameId}`, game);
        return res.json({ game });
      }

      case 'startPicking': {
        const game = await redisGet(`game:${gameId}`);
        if (!game) return res.status(404).json({ error: 'Game not found' });
        game.status = 'picking';
        await redisSet(`game:${gameId}`, game);
        return res.json({ game });
      }

      case 'pick': {
        const game = await redisGet(`game:${gameId}`);
        if (!game) return res.status(404).json({ error: 'Game not found' });
        const player = game.players.find(p => p.name === playerName);
        if (!player) return res.json({ error: 'Player not in game' });
        const taken = game.players.find(p => p.pick?.name === pick.name);
        if (taken) return res.json({ error: 'Player already picked' });
        player.pick = pick;
        if (game.players.every(p => p.pick)) game.status = 'results';
        await redisSet(`game:${gameId}`, game);
        return res.json({ game });
      }

      case 'declareWinner': {
        const game = await redisGet(`game:${gameId}`);
        if (!game) return res.status(404).json({ error: 'Game not found' });
        const winner = game.players.find(p => p.name === winnerName);
        if (!winner) return res.json({ error: 'Player not found' });
        game.winner = winner;
        game.status = 'results';
        await redisSet(`game:${gameId}`, game);
        return res.json({ game });
      }

      default:
        return res.status(400).json({ error: 'Unknown action' });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
