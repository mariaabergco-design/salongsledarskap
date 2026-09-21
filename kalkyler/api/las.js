// Läser fakturor och kassalistor åt Salongskalkylen med Claude, så att salongsledaren
// inte behöver något eget Claude-konto. Nyckeln ligger i Vercel som miljövariabeln
// ANTHROPIC_API_KEY och når aldrig webbläsaren. Anropen kräver en salongskod som
// ligger i miljövariabeln SALONGSKOD (flera koder skiljs med kommatecken).
//
// Anrop: POST /api/las med rubriken x-salongskod och kroppen
//   { "ping": true }                                    -> { "ok": true } om koden stämmer
//   { "prompt": "...", "images": [{ "media_type": "image/jpeg", "data": "<base64>" }] }
//                                                       -> { "text": "Claudes svar" }
// Fel svarar med { "fel": "<kod>", "message": "<text på svenska>" }.
import Anthropic from '@anthropic-ai/sdk';

const MODEL = 'claude-opus-5';
const MAX_PROMPT = 120000;
const MAX_BILDER = 6;
const BILDTYPER = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

const giltigaKoder = () => String(process.env.SALONGSKOD || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
const svara = (res, status, body) => { res.status(status).json(body); };

export default async function handler(req, res) {
  res.setHeader('cache-control', 'no-store');
  if (req.method !== 'POST') return svara(res, 405, { fel: 'metod', message: 'Bara POST.' });
  if (!process.env.ANTHROPIC_API_KEY) return svara(res, 500, { fel: 'saknas', message: 'Servern saknar miljövariabeln ANTHROPIC_API_KEY.' });
  const koder = giltigaKoder();
  if (!koder.length) return svara(res, 500, { fel: 'saknas', message: 'Servern saknar miljövariabeln SALONGSKOD.' });
  const kod = String(req.headers['x-salongskod'] || '').trim().toLowerCase();
  if (!kod || !koder.includes(kod)) return svara(res, 401, { fel: 'kod', message: 'Salongskoden stämmer inte.' });

  const body = (req.body && typeof req.body === 'object') ? req.body : {};
  if (body.ping) return svara(res, 200, { ok: true });
  const prompt = typeof body.prompt === 'string' ? body.prompt.slice(0, MAX_PROMPT) : '';
  if (!prompt.trim()) return svara(res, 400, { fel: 'prompt', message: 'Ingen text att läsa.' });
  const bilder = (Array.isArray(body.images) ? body.images : []).slice(0, MAX_BILDER)
    .filter(b => b && typeof b.data === 'string' && b.data.length && BILDTYPER.has(b.media_type));
  const content = bilder.map(b => ({ type: 'image', source: { type: 'base64', media_type: b.media_type, data: b.data } }));
  content.push({ type: 'text', text: prompt });

  const client = new Anthropic();
  try {
    const msg = await client.messages.stream({
      model: MODEL,
      max_tokens: 16000,
      messages: [{ role: 'user', content }]
    }).finalMessage();
    const text = msg.content.filter(b => b.type === 'text').map(b => b.text).join('\n');
    console.log(JSON.stringify({ salongskod: kod, bilder: bilder.length, tecken: prompt.length, in: msg.usage && msg.usage.input_tokens, ut: msg.usage && msg.usage.output_tokens, stopp: msg.stop_reason }));
    if (msg.stop_reason === 'refusal') return svara(res, 422, { fel: 'refused', message: 'Claude avböjde att läsa den här filen.' });
    if (!text.trim()) return svara(res, 502, { fel: 'empty_completion', message: 'Claude svarade utan text.' });
    return svara(res, 200, { text, stop_reason: msg.stop_reason });
  } catch (e) {
    if (e instanceof Anthropic.AuthenticationError) return svara(res, 500, { fel: 'nyckel', message: 'API-nyckeln i Vercel godtas inte av Anthropic. Kontrollera ANTHROPIC_API_KEY.' });
    if (e instanceof Anthropic.RateLimitError) return svara(res, 429, { fel: 'rate_limited', message: 'För många anrop just nu.' });
    if (e instanceof Anthropic.BadRequestError) return svara(res, 400, { fel: 'claude', message: 'Claude kunde inte ta emot filen: ' + e.message });
    if (e instanceof Anthropic.APIError) return svara(res, 502, { fel: 'claude', message: 'Claude svarade med fel ' + e.status + '. Försök igen om en stund.' });
    console.error(e);
    return svara(res, 500, { fel: 'server', message: 'Något gick fel på servern.' });
  }
}
