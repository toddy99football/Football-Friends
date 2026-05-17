module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { home, away } = req.body || {};
  if (!home || !away) return res.status(400).json({ error: 'Missing home or away team' });

  try {
    // Step 1: Search for lineup
    const searchRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.VITE_ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        messages: [{
          role: 'user',
          content: 'Search for the confirmed or predicted starting lineup for ' + home + ' vs ' + away + ' Premier League 2025-26. List each player with their shirt number and position.'
        }]
      })
    });

    const searchData = await searchRes.json();
    const searchText = (searchData.content || []).map(function(b) { return b.text || ''; }).join(' ');

    if (!searchText || searchText.length < 50) {
      return res.json({ home: null, away: null, error: 'No lineup data found' });
    }

    // Step 2: Format into structured JSON
    const formatRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.VITE_ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: 'Extract the football lineups from this text and return ONLY a JSON object with no other text:\n\n' + searchText + '\n\nReturn exactly this structure:\n{"home":{"team":"' + home + '","colour":"#95bfe5","players":[{"number":1,"name":"Full Name","pos":"GK"}]},"away":{"team":"' + away + '","colour":"#e63946","players":[{"number":1,"name":"Full Name","pos":"GK"}]}}\n\npos must be GK, DEF, MID, or FWD. Include all starters and subs. Return ONLY the JSON object, nothing else.'
          }
        ]
      })
    });

    const formatData = await formatRes.json();
    const formatText = (formatData.content || []).filter(function(b) { return b.type === 'text'; }).map(function(b) { return b.text || ''; }).join('').trim();

    // Parse the JSON
    var jsonStart = formatText.indexOf('{');
    var jsonEnd = formatText.lastIndexOf('}');

    if (jsonStart >= 0 && jsonEnd > jsonStart) {
      var parsed = JSON.parse(formatText.slice(jsonStart, jsonEnd + 1));
      if (parsed.home && parsed.away && Array.isArray(parsed.home.players) && parsed.home.players.length >= 5) {
        return res.json({ home: parsed.home, away: parsed.away });
      }
    }

    return res.json({ home: null, away: null, error: 'Could not parse lineup' });

  } catch (err) {
    return res.status(500).json({ error: err.message, home: null, away: null });
  }
};
