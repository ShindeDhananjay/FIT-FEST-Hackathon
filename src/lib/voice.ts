/**
 * EcoLoop Voice Synthesis — "J.A.R.V.I.S." inspired, Indian-accented assistant.
 *
 * Voice priority:
 *   1. Indian English (en-IN) natural voices (Microsoft Ravi, Neerja Online Natural, Google India English)
 *   2. British English male voices (Daniel, George) — the "Jarvis" formal cadence
 *   3. Any available natural/neural male English voice
 *   4. System default fallback
 *
 * Acoustic tuning: slightly deeper pitch, measured calm rate, full volume.
 */

// ---------------------------------------------------------------------------
// Voice selection helpers
// ---------------------------------------------------------------------------

/** Priority keywords for voice name matching — order matters (best first). */
const VOICE_PRIORITY = [
  // Indian English — best match for "Indian accent"
  'ravi',                         // Microsoft Ravi (en-IN male)
  'neerja online',                // Microsoft Neerja Online (en-IN, natural female — still better than robot)
  'google india english',         // Chrome's Indian English
  'en-in',                        // Generic Indian English tag
  // British / formal "Jarvis" style
  'microsoft guy online',         // Windows 11 natural male
  'guy online',
  'daniel',                       // macOS / iOS British male
  'george',                       // Windows British male
  'microsoft george',
  'google uk english male',       // Chrome UK male
  // General high-quality male fallbacks
  'natural',                      // Any voice tagged "natural"
  'neural',                       // Any neural voice
  'microsoft david',              // US male, Windows
  'microsoft mark',
  'google us english',
  'alex',                         // macOS US male
  'oliver',
];

/** Words in voice names that indicate female voices — we deprioritize these. */
const FEMALE_HINTS = ['female', 'zira', 'susan', 'hazel', 'jenny', 'aria', 'sonia', 'libby'];

function isFemaleVoice(name: string): boolean {
  const lower = name.toLowerCase();
  return FEMALE_HINTS.some((h) => lower.includes(h));
}

function pickBestVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  const english = voices.filter((v) => v.lang.startsWith('en'));
  if (english.length === 0) return voices[0]; // absolute fallback

  // 1. Walk priority list
  for (const kw of VOICE_PRIORITY) {
    const match = english.find(
      (v) => v.name.toLowerCase().includes(kw) && !isFemaleVoice(v.name)
    );
    if (match) return match;
  }

  // 2. Prefer any en-IN voice (even if not in priority list)
  const indiaVoice = english.find((v) => v.lang === 'en-IN' && !isFemaleVoice(v.name));
  if (indiaVoice) return indiaVoice;

  // 3. Any non-female English voice
  const maleFallback = english.find((v) => !isFemaleVoice(v.name));
  if (maleFallback) return maleFallback;

  // 4. First English voice
  return english[0];
}

// ---------------------------------------------------------------------------
// Message builder — conversational, Jarvis-like
// ---------------------------------------------------------------------------

function buildGreeting(name: string, points: number): string {
  const firstName = name ? name.split(' ')[0] : 'Citizen';

  // Vary the greeting so it doesn't sound "duplicate" / repetitive on every login
  const greetings = [
    `Hello ${firstName}, welcome back.`,
    `Good to see you again, ${firstName}.`,
    `Welcome back, ${firstName}.`,
  ];
  const greeting = greetings[Math.floor(Math.random() * greetings.length)];

  const pointsLabel = points === 1 ? '1 eco point' : `${points} eco points`;

  // Construct a natural multi-sentence announcement
  const lines = [
    greeting,
    `Your current score stands at ${pointsLabel}.`,
    points > 0
      ? 'Keep up the great work — every bit of waste you recycle makes a difference.'
      : 'Start recycling today and earn your first eco points.',
  ];

  return lines.join(' ');
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Play the login welcome voice note with natural Indian / Jarvis-like accent.
 *
 * @param userName - citizen's display name
 * @param ecoPoints - current EcoPoints balance
 */
export const playLoginWelcomeVoice = (userName: string, ecoPoints: number): void => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    // Cancel any ongoing speech first
    window.speechSynthesis.cancel();

    const text = buildGreeting(userName, ecoPoints);
    const utterance = new SpeechSynthesisUtterance(text);

    const configureAndSpeak = () => {
      const voices = window.speechSynthesis.getVoices();

      if (voices && voices.length > 0) {
        const chosen = pickBestVoice(voices);
        if (chosen) {
          utterance.voice = chosen;
          // Log for debugging (removable later)
          console.info(`[EcoLoop Voice] Using: "${chosen.name}" (${chosen.lang})`);
        }
      }

      // Jarvis-like acoustic profile:
      // - Pitch 0.85: deeper, authoritative tone
      // - Rate 0.88:  measured, calm delivery — not rushed
      // - Volume 1:   clear and confident
      utterance.pitch = 0.85;
      utterance.rate = 0.88;
      utterance.volume = 1;

      window.speechSynthesis.speak(utterance);
    };

    // Voices may load asynchronously (especially Chrome)
    const available = window.speechSynthesis.getVoices();
    if (available && available.length > 0) {
      configureAndSpeak();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        configureAndSpeak();
      };
    }
  } catch (err) {
    console.warn('[EcoLoop Voice] Speech synthesis skipped:', err);
  }
};
