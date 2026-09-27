/**
 * EcoLoop Voice Synthesis — J.A.R.V.I.S. Mode
 *
 * Sounds like: confident, deep male AI assistant (Iron Man's JARVIS).
 * Technique:
 *   - Deep pitch (0.75) + measured pace (0.88) = authoritative AI feel
 *   - SHORT punchy sentences spoken sequentially with a real pause between them
 *   - Prioritizes deep English male voices: Microsoft Guy, David, Daniel (British)
 *   - Falls back to any male English voice
 */

// ---------------------------------------------------------------------------
// Voice keywords — prefer deep, clear English male voices (Jarvis-style)
// ---------------------------------------------------------------------------

/** Keywords for deep authoritative male AI-style voices */
const JARVIS_VOICE_PRIORITY = [
  'microsoft guy online',     // Windows 11 Neural — deep, natural male
  'guy online',
  'microsoft david online',   // Windows neural David — rich male voice
  'david online',
  'david',
  'daniel',                   // macOS/iOS British male — closest to Jarvis
  'george',                   // British English male
  'microsoft zira',           // Fallback — skip (female)
  'james',
  'richard',
  'en-gb',                    // British English locale
];

/** Voices that are clearly female — avoid them */
const FEMALE_KEYWORDS = [
  'female', 'zira', 'susan', 'hazel', 'jenny', 'aria', 'libby',
  'siri', 'cortana', 'victoria', 'moira', 'fiona', 'samantha',
  'karen', 'neerja', 'heera', 'swara',
];

function isFemale(name: string): boolean {
  const l = name.toLowerCase();
  return FEMALE_KEYWORDS.some((h) => l.includes(h));
}

function pickJarvisVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  if (!voices || voices.length === 0) return undefined;

  // 1. Exact priority match — look for named deep male voices
  for (const keyword of JARVIS_VOICE_PRIORITY) {
    if (keyword === 'en-gb') continue; // handled below
    const match = voices.find(
      (v) => v.name.toLowerCase().includes(keyword) && !isFemale(v.name)
    );
    if (match) return match;
  }

  // 2. Any British English male voice
  const britishMale = voices.find((v) => {
    const lang = v.lang.toLowerCase().replace('_', '-');
    return lang.startsWith('en-gb') && !isFemale(v.name);
  });
  if (britishMale) return britishMale;

  // 3. Any American English male voice (non-female)
  const usMale = voices.find((v) => {
    const lang = v.lang.toLowerCase().replace('_', '-');
    return lang.startsWith('en-us') && !isFemale(v.name);
  });
  if (usMale) return usMale;

  // 4. Any English male voice
  const anyMale = voices.find((v) => v.lang.startsWith('en') && !isFemale(v.name));
  if (anyMale) return anyMale;

  // 5. Final fallback
  return voices[0];
}

// ---------------------------------------------------------------------------
// Sequential speaking engine — Jarvis speaks in short confident bursts
// ---------------------------------------------------------------------------

function speakSequence(
  lines: string[],
  voice: SpeechSynthesisVoice | undefined,
  gapMs = 420
): void {
  let index = 0;

  const speakNext = () => {
    if (index >= lines.length) return;

    const utt = new SpeechSynthesisUtterance(lines[index]);

    // Language: prefer British English for Jarvis-style phonetics
    utt.lang = voice?.lang ?? 'en-GB';

    if (voice) utt.voice = voice;

    // Jarvis acoustic profile:
    //   pitch 0.75  → deep, authoritative AI tone
    //   rate  0.88  → measured, deliberate — not slow, not rushed
    //   volume 1    → full confidence
    utt.pitch = 0.75;
    utt.rate = 0.88;
    utt.volume = 1;

    utt.onend = () => {
      index++;
      if (index < lines.length) {
        setTimeout(speakNext, gapMs);
      }
    };

    utt.onerror = () => {
      index++;
      if (index < lines.length) setTimeout(speakNext, gapMs);
    };

    window.speechSynthesis.speak(utt);
  };

  speakNext();
}

// ---------------------------------------------------------------------------
// Message script — short, Jarvis-style punchy lines
// ---------------------------------------------------------------------------

const GREETINGS = [
  (name: string) => `Welcome back, ${name}.`,
  (name: string) => `Good to have you back, ${name}.`,
  (name: string) => `Identity confirmed. Hello, ${name}.`,
];

function buildLines(name: string, points: number): string[] {
  const first = name ? name.split(' ')[0] : 'Citizen';
  const pointsStr = points === 1 ? 'one EcoPoint' : `${points} EcoPoints`;

  const greeting = GREETINGS[Math.floor(Math.random() * GREETINGS.length)](first);

  const status =
    points === 0
      ? `Your current score is zero. Time to make your first move.`
      : `Your current score stands at ${pointsStr}.`;

  const motivation =
    points >= 100
      ? `Outstanding performance. The city thanks you.`
      : `Every collection counts. Keep earning your rewards.`;

  return [greeting, status, motivation];
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export const playLoginWelcomeVoice = (userName: string, ecoPoints: number): void => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel();

    const lines = buildLines(userName, ecoPoints);

    const fire = () => {
      const voices = window.speechSynthesis.getVoices();
      const chosen = voices?.length ? pickJarvisVoice(voices) : undefined;

      if (chosen) {
        console.info(`[EcoLoop Voice — JARVIS] Using: "${chosen.name}" (${chosen.lang})`);
      } else {
        console.info('[EcoLoop Voice — JARVIS] No voice found, using browser default.');
      }

      speakSequence(lines, chosen, 420);
    };

    const available = window.speechSynthesis.getVoices();
    if (available?.length) {
      fire();
    } else {
      window.speechSynthesis.onvoiceschanged = fire;
    }
  } catch (err) {
    console.warn('[EcoLoop Voice] Skipped:', err);
  }
};
