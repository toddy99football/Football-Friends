const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function redisGet(key) {
  const res = await fetch(REDIS_URL + '/get/' + encodeURIComponent(key), {
    headers: { Authorization: 'Bearer ' + REDIS_TOKEN },
  });
  const data = await res.json();
  if (!data.result) return null;
  var val = data.result;
  try { val = JSON.parse(val); } catch(e) {}
  if (typeof val === 'string') { try { val = JSON.parse(val); } catch(e) {} }
  return val;
}

async function redisSet(key, value) {
  await fetch(REDIS_URL + '/set/' + encodeURIComponent(key), {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + REDIS_TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(JSON.stringify(value)),
  });
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { action, gameId, adminName, match, playerName, pick, winnerName } = req.body || {};

    switch (action) {

      case 'create': {
        const game = {
          id: gameId,
          adminName: adminName,
          match: match,
          status: 'lobby',
          players: [{ name: adminName, pick: null }],
          winner: null,
          createdAt: Date.now(),
        };
        // Save game and also set it as the "current" game
        await redisSet('game:' + gameId, game);
        await redisSet('current', gameId);
        return res.json({ game: game });
      }

      case 'getCurrent': {
        const currentId = await redisGet('current');
        if (!currentId) return res.json({ game: null });
        const game = await redisGet('game:' + currentId);
        return res.json({ game: game || null });
      }

      case 'get': {
        const game = await redisGet('game:' + gameId);
        if (!game) return res.status(404).json({ error: 'Game not found' });
        return res.json({ game: game });
      }

      case 'join': {
        const game = await redisGet('game:' + gameId);
        if (!game) return res.status(404).json({ error: 'Game not found' });
        if (game.players.length >= 10) return res.json({ error: 'Game is full' });
        var exists = false;
        for (var i = 0; i < game.players.length; i++) {
          if (game.players[i].name === playerName) { exists = true; break; }
        }
        if (!exists) game.players.push({ name: playerName, pick: null });
        await redisSet('game:' + game.id, game);
        return res.json({ game: game });
      }

      case 'startPicking': {
        const game = await redisGet('game:' + gameId);
        if (!game) return res.status(404).json({ error: 'Game not found' });
        game.status = 'picking';
        await redisSet('game:' + game.id, game);
        return res.json({ game: game });
      }

      case 'pick': {
        const game = await redisGet('game:' + gameId);
        if (!game) return res.status(404).json({ error: 'Game not found' });
        var player = null;
        var taken = false;
        for (var i = 0; i < game.players.length; i++) {
          if (game.players[i].name === playerName) player = game.players[i];
          if (game.players[i].pick && game.players[i].pick.name === pick.name) taken = true;
        }
        if (!player) return res.json({ error: 'Player not in game' });
        if (taken) return res.json({ error: 'Player already picked by someone else' });
        player.pick = pick;
        var allPicked = true;
        for (var i = 0; i < game.players.length; i++) {
          if (!game.players[i].pick) { allPicked = false; break; }
        }
        if (allPicked) game.status = 'results';
        await redisSet('game:' + game.id, game);
        return res.json({ game: game });
      }

      case 'declareWinner': {
        const game = await redisGet('game:' + gameId);
        if (!game) return res.status(404).json({ error: 'Game not found' });
        var winner = null;
        for (var i = 0; i < game.players.length; i++) {
          if (game.players[i].name === winnerName) { winner = game.players[i]; break; }
        }
        if (!winner) return res.json({ error: 'Player not found' });
        game.winner = winner;
        game.status = 'results';
        await redisSet('game:' + game.id, game);
        return res.json({ game: game });
      }

      default:
        return res.status(400).json({ error: 'Unknown action: ' + action });
    }
  } catch (err) {
    return res.status(500).json({ error: String(err.message || err) });
  }
};
