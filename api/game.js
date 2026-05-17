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

      case 'listGames': {
        const gameList = await redisGet('gamelist') || [];
        var activeGames = [];
        for (var i = 0; i < gameList.length; i++) {
          try {
            var g = await redisGet('game:' + gameList[i]);
            // Only show lobby and picking games - hide finished and cancelled
            if (g && g.status !== 'cancelled' && g.status !== 'results') {
              var safe = JSON.parse(JSON.stringify(g));
              safe.players = safe.players.map(function(p) { return { name: p.name, pick: p.pick }; });
              activeGames.push(safe);
            }
          } catch(e) {}
        }
        return res.json({ games: activeGames });
      }

      case 'create': {
        const adminPassword = req.body.adminPassword || '';
        const game = {
          id: gameId,
          adminName: adminName,
          match: match,
          status: 'lobby',
          players: [{ name: adminName, pick: null, password: adminPassword }],
          winner: null,
          createdAt: Date.now(),
        };
        await redisSet('game:' + gameId, game);
        // Add to game list
        var list = await redisGet('gamelist') || [];
        if (!Array.isArray(list)) list = [];
        list.push(gameId);
        // Keep only last 20 games
        if (list.length > 20) list = list.slice(-20);
        await redisSet('gamelist', list);
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
        var safeGet = JSON.parse(JSON.stringify(game));
        safeGet.players = safeGet.players.map(function(p) { return { name: p.name, pick: p.pick }; });
        return res.json({ game: safeGet });
      }

      case 'join': {
        const game = await redisGet('game:' + gameId);
        if (!game) return res.status(404).json({ error: 'Game not found' });
        if (game.players.length >= 10) return res.json({ error: 'Game is full (10 players max)' });
        var playerPassword = req.body.playerPassword || '';
        var existingPlayer = null;
        for (var i = 0; i < game.players.length; i++) {
          if (game.players[i].name.toLowerCase() === playerName.toLowerCase()) {
            existingPlayer = game.players[i];
            break;
          }
        }
        if (existingPlayer) {
          // Returning player - check their password if they set one
          if (existingPlayer.password && playerPassword.toLowerCase() !== existingPlayer.password.toLowerCase()) {
            return res.status(401).json({ error: 'Wrong password for ' + playerName + '. Try again.' });
          }
        } else {
          // New player - add them with their chosen password
          game.players.push({ name: playerName, pick: null, password: playerPassword });
        }
        await redisSet('game:' + game.id, game);
        // Don't expose other players passwords in response
        var safeGame = JSON.parse(JSON.stringify(game));
        safeGame.players = safeGame.players.map(function(p) {
          return { name: p.name, pick: p.pick };
        });
        return res.json({ game: safeGame });
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
        // Don't auto-progress - admin controls kick-off lock
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

      case 'cancel': {
        const game = await redisGet('game:' + gameId);
        if (!game) return res.status(404).json({ error: 'Game not found' });
        game.status = 'cancelled';
        await redisSet('game:' + game.id, game);
        // Clear current game pointer
        await redisSet('current', null);
        return res.json({ game: game });
      }

      case 'lockPicks': {
        // Admin locks picks at kick off - game progresses regardless
        const game = await redisGet('game:' + gameId);
        if (!game) return res.status(404).json({ error: 'Game not found' });
        game.picksLocked = true;
        game.status = 'results'; // Move to results so admin can declare winner
        await redisSet('game:' + game.id, game);
        return res.json({ game: game });
      }

      case 'adminPick': {
        // Admin assigns a pick for a player who hasn't picked
        const game = await redisGet('game:' + gameId);
        if (!game) return res.status(404).json({ error: 'Game not found' });
        var player = null;
        var taken = false;
        for (var i = 0; i < game.players.length; i++) {
          if (game.players[i].name === playerName) player = game.players[i];
          if (game.players[i].pick && game.players[i].pick.name === pick.name) taken = true;
        }
        if (!player) return res.json({ error: 'Player not found' });
        if (taken) return res.json({ error: 'Player already picked by someone else' });
        player.pick = pick;
        await redisSet('game:' + game.id, game);
        return res.json({ game: game });
      }

      case 'removePlayer': {
        const game = await redisGet('game:' + gameId);
        if (!game) return res.status(404).json({ error: 'Game not found' });
        game.players = game.players.filter(function(p) { return p.name !== playerName; });
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
