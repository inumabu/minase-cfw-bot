import { drawOmikuji } from './omikuji.js';
import { getRandomMessage } from './random.js';
import { getTodayContent } from './today.js';

const JSON_HEADERS = {
  'content-type': 'application/json; charset=UTF-8',
  'cache-control': 'no-store'
};

const DISCORD_INTERACTION = {
  PING: 1,
  APPLICATION_COMMAND: 2
};

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...JSON_HEADERS, ...extraHeaders }
  });
}

function getCommandData(commandName, username = 'あなた') {
  if (commandName === 'omikuji') {
    const fortune = drawOmikuji();
    return {
      type: DISCORD_INTERACTION.APPLICATION_COMMAND,
      content: {
        embeds: [
          {
            title: `🔮 ${username} さんの運勢`,
            author: { name: fortune.result },
            color: fortune.color,
            description: `**【運勢】**\n${fortune.description}`,
            fields: fortune.fields,
            timestamp: new Date().toISOString()
          }
        ]
      }
    };
  }

  if (commandName === 'random') {
    const result = getRandomMessage();
    return {
      type: DISCORD_INTERACTION.APPLICATION_COMMAND,
      content: {
        content: `🎲 **今日のひとことガチャ**\n\n${result.type}\n> ${result.text}`
      }
    };
  }

  if (commandName === 'today') {
    const result = getTodayContent();
    return {
      type: DISCORD_INTERACTION.APPLICATION_COMMAND,
      content: {
        content: `🌞 **今日の○○**\n\n${result.type}\n> ${result.text}`
      }
    };
  }

  return null;
}

function createApiResult(type) {
  if (type === 'omikuji') return drawOmikuji();
  if (type === 'random') return getRandomMessage();
  if (type === 'today') return getTodayContent();
  return null;
}

function extractDiscordUsername(body) {
  return (
    body?.member?.user?.username ||
    body?.user?.username ||
    body?.member?.user?.global_name ||
    body?.user?.global_name ||
    'あなた'
  );
}

function hexToBytes(hex) {
  const clean = hex.trim().replace(/^0x/i, '');
  if (!/^[0-9a-fA-F]+$/.test(clean) || clean.length % 2 !== 0) {
    throw new Error('Invalid hex string');
  }
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = Number.parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

async function verifyDiscordSignature(request, rawBody, publicKeyHex) {
  if (!publicKeyHex) return false;

  const signatureHex = request.headers.get('X-Signature-Ed25519');
  const timestamp = request.headers.get('X-Signature-Timestamp');
  if (!signatureHex || !timestamp) return false;

  try {
    const publicKey = await crypto.subtle.importKey(
      'raw',
      hexToBytes(publicKeyHex),
      { name: 'Ed25519' },
      false,
      ['verify']
    );

    return await crypto.subtle.verify(
      { name: 'Ed25519' },
      publicKey,
      hexToBytes(signatureHex),
      new TextEncoder().encode(timestamp + rawBody)
    );
  } catch {
    return false;
  }
}

async function handleDiscordInteraction(request, env) {
  const rawBody = await request.text();

  const isValid = await verifyDiscordSignature(
    request,
    rawBody,
    env.DISCORD_PUBLIC_KEY
  );

  if (!isValid) {
    return new Response('Invalid request signature', { status: 401 });
  }

  let body;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  if (body.type === DISCORD_INTERACTION.PING) {
    return json({ type: 1 });
  }

  if (body.type !== DISCORD_INTERACTION.APPLICATION_COMMAND) {
    return json({ error: 'Unsupported interaction type' }, 400);
  }

  const result = getCommandData(body.data?.name, extractDiscordUsername(body));
  if (!result) {
    return json({ error: 'Unknown command' }, 404);
  }

  // Discord interaction callback format: { type: 4, data: { ... } }
  return json({
    type: 4,
    data: result.content
  });
}

function helpResponse() {
  return json({
    name: 'suzushiro-worker',
    endpoints: {
      '/omikuji': 'GET - おみくじ',
      '/random': 'GET - 今日のひとことガチャ',
      '/today': 'GET - 今日の○○',
      '/discord': 'POST - Discord Interactions endpoint'
    },
    commands: ['omikuji', 'random', 'today']
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const method = request.method.toUpperCase();

    if (method === 'GET' && url.pathname === '/') {
      return helpResponse();
    }

    if (method === 'GET' && ['/omikuji', '/random', '/today'].includes(url.pathname)) {
      const type = url.pathname.slice(1);
      const result = createApiResult(type);
      return json(result);
    }

    if (method === 'POST' && url.pathname === '/discord') {
      return handleDiscordInteraction(request, env);
    }

    return json({ error: 'Not Found' }, 404);
  }
};
