// In-memory game store (persists as long as the serverless function is warm)
// For production use Vercel KV, but this works well for short-lived games
const games = {};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { action, gameId, adminName, match, playerName, pick, winnerName } = req.body;

  try {
    switch (action) {

      case 'create': {
        games[gameId] = {
          id: gameId,
          adminName,
          match,
          status: 'lobby', // lobby | picking | results
          players: [{ name: adminName, pick: null }],
          winner: null,
          createdAt: Date.now(),
        };
        return res.json({ game: games[gameId] });
      }

      case 'get': {
        const game = games[gameId];
        if (!game) return res.status(404).json({ error: 'Game not found' });
        return res.json({ game });
      }

      case 'join': {
        const game = games[gameId];
        if (!game) return res.status(404).json({ error: 'Game not found. Check your code.' });
        if (game.players.length >= 10) return res.json({ error: 'Game is full (10 players max)' });
        const exists = game.players.find(p => p.name === playerName);
        if (!exists) {
          game.players.push({ name: playerName, pick: null });
        }
        return res.json({ game });
      }

      case 'startPicking': {
        const game = games[gameId];
        if (!game) return res.status(404).json({ error: 'Game not found' });
        game.status = 'picking';
        return res.json({ game });
      }

      case 'pick': {
        const game = games[gameId];
        if (!game) return res.status(404).json({ error: 'Game not found' });
        const player = game.players.find(p => p.name === playerName);
        if (!player) return res.json({ error: 'Player not in game' });
        // Check not already taken
        const taken = game.players.find(p => p.pick?.name === pick.name);
        if (taken) return res.json({ error: 'Player already picked' });
        player.pick = pick;
        // If all picked move to results
        if (game.players.every(p => p.pick)) game.status = 'results';
        return res.json({ game });
      }

      case 'declareWinner': {
        const game = games[gameId];
        if (!game) return res.status(404).json({ error: 'Game not found' });
        const winner = game.players.find(p => p.name === winnerName);
        if (!winner) return res.json({ error: 'Player not found' });
        game.winner = winner;
        game.status = 'results';
        return res.json({ game });
      }

      default:
        return res.status(400).json({ error: 'Unknown action' });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
