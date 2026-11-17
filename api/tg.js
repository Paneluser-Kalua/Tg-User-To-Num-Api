const axios = require('axios');

// ============================================================
// 🔒 KALUA API STORE - EXCLUSIVE 2-DAY TELEGRAM INTEL ENGINE
// ============================================================
module.exports = async (req, res) => {
  // Plain text response for clean 3D report layout
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const username = req.query.username || req.query.user || req.query.num;

  if (!username) {
    return res.status(400).send(`
╔════════════════════════════════════════════════╗
║                ❌ ERROR LOG                    ║
╠════════════════════════════════════════════════╣
║ 💬 Username parameter missing hai!             ║
║ 🔍 Usage: /api/tg?username=@KaluaPapa          ║
╚════════════════════════════════════════════════╝
    `.trim());
  }

  // Ensure username starts with @
  const cleanUser = username.startsWith('@') ? username : `@${username}`;  try { // 🔒 Fully hidden internal secure proxy call to upstream API const upstreamUrl = `http://bronx-ultra-king.duckdns.org/api/custom/tg-tyle?key=bronx-tg&num=${encodeURIComponent(cleanUser)}`;
    
    const apiResponse = await axios.get(upstreamUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const rawData = apiResponse.data || {};
    const d = rawData.data || rawData;

    // Extracting main available fields cleanly
    const tgId = d.id || d.telegram_id || d.userId || 'N/A';
    const tgName = d.name || d.fullname || d.first_name || 'N/A';
    const tgUsername = d.username || cleanUser;
    const bio = d.bio || d.about || 'N/A';
    const phone = d.phone || d.mobile || d.number || 'N/A';

    // ⏳ 2-Day Trial Expiry Calculation
    const expiryDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // Compact & Short 3D Professional Layout
    const report = `
╔════════════════════════════════════════════════╗
║           🔍 TELEGRAM INTEL REPORT             ║
╠════════════════════════════════════════════════╣
║ 🎯 Target : ${tgUsername}                      ║
║ ⏳ Trial  : 48h (Exp: ${expiryDate})           ║
╚════════════════════════════════════════════════╝

👤 [ ACCOUNT DETAILS ]
--------------------------------------------------
 🏷️ Name     : ${tgName}
 🆔 User ID  : ${tgId}
 🔗 Username : ${tgUsername}

📞 [ LINKED CONTACT ]
--------------------------------------------------
 📱 Number   : ${phone}

📝 [ BIO / DESCRIPTION ]
--------------------------------------------------
 💬 Info     : ${bio}

══════════════════════════════════════════════════
 ⚡ EXCLUSIVE TRIAL BY KALUA API STORE
══════════════════════════════════════════════════
`.trim();

    return res.status(200).send(report);

  } catch (error) {
    return res.status(500).send(`
╔════════════════════════════════════════════════╗
║                🔥 ERROR REPORT                 ║
╠════════════════════════════════════════════════╣
║ 💬 Lookup timeout or account not found.        ║
╚════════════════════════════════════════════════╝
    `.trim());
  }
};
