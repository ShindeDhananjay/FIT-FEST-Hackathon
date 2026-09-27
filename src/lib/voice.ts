/**
 * EcoLoop Voice Synthesis — "J.A.R.V.I.S." inspired, Indian-accented assistant.
 *
 * The trick to sounding natural with browser SpeechSynthesis:
 *   - SHORT sentences (not one long paragraph — that's what makes it sound robotic)
 *   - Near-natural speed (0.95–1.0) — slow rates = "can't read" feel
 *   - Sequential utterances with micro-pauses between them
 *   - Slightly deeper pitch for authority, but not too low
 */

// ---------------------------------------------------------------------------
// Voice selection
// ---------------------------------------------------------------------------

const VOICE_PRIORITY = [
  'ravi',                         // Microsoft Ravi (en-IN male)
  'neerja online',                // Microsoft Neerja Online (en-IN natural)
  'google india english',         // Chrome Indian English
  'microsoft guy online',         // Windows 11 natural male
  'guy online',
  'daniel',                       // macOS British male (Jarvis-like)
  'george',                       // Windows British male
  'microsoft george',
  'google uk english male',
  'natural',
  'neural',
  'microsoft david',
  'microsoft mark',
  'google us english',
  'alex',
  'oliver',
];

const FEMALE_HINTS = ['female', 'zira', 'susan', 'hazel', 'jenny', 'aria', 'sonia', 'libby'];

function isFemale(name: string): boolean {
  const l = name.toLowerCase();
  return FEMALE_HINTS.some((h) => l.includes(h));
}

function pickVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  const en = voices.filter((v) => v.lang.startsWith('en'));
  if (!en.length) return voices[0];

  for (const kw of VOICE_PRIORITY) {
    const m = en.find((v) => v.name.toLowerCase().includes(kw) && !isFemale(v.name));
    if (m) return m;
  }

  // en-IN fallback
  const india = en.find((v) => v.lang === 'en-IN' && !isFemale(v.name));
  if (india) return india;

  return en.find((v) => !isFemale(v.name)) || en[0];
}

// ---------------------------------------------------------------------------
// Sequential speaking engine — the secret sauce
// ---------------------------------------------------------------------------

/**
 * Speaks an array of short sentences one after another with a small gap.
 * This sounds 10x more natural than one giant utterance.
 */
function speakSequence(
  lines: string[],
  voice: SpeechSynthesisVoice | undefined,
  gapMs = 250
): void {
  let index = 0;

  const speakNext = () => {
    if (index >= lines.length) return;

    const utt = new SpeechSynthesisUtterance(lines[index]);
    if (voice) utt.voice = voice;

    // Natural Jarvis-like acoustic profile:
    // Pitch 0.92 — slightly deeper but not comically low
    // Rate 0.97 — near-natural speed, confident, not sluggish
    utt.pitch = 0.92;
    utt.rate = 0.97;
    utt.volume = 1;

    utt.onend = () => {
      index++;
      if (index < lines.length) {
        // Small pause between sentences — feels like natural breathing
        setTimeout(speakNext, gapMs);
      }
    };

    utt.onerror = () => {
      // Skip to next sentence on error
      index++;
      if (index < lines.length) setTimeout(speakNext, gapMs);
    };

    window.speechSynthesis.speak(utt);
  };

  speakNext();
}

// ---------------------------------------------------------------------------
// Message builder
// ---------------------------------------------------------------------------

function buildLines(name: string, points: number): string[] {
  const first = name ? name.split(' ')[0] : 'Citizen';

  // Randomize the opener so it doesn't repeat every login
  const openers = [
    `Hello ${first}, welcome back.`,
    `Good to see you, ${first}.`,
    `Welcome back, ${first}.`,
  ];
  const opener = openers[Math.floor(Math.random() * openers.length)];

  const pointsStr = points === 1 ? '1 eco point' : `${points} eco points`;

  // Each line is short and punchy — Jarvis style
  const lines = [opener, `Your score is ${pointsStr}.`];

  if (points > 0) {
    lines.push('Keep recycling and earning rewards.');
  } else {
    lines.push('Start recycling to earn your first points.');
  }

  return lines;
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
      const chosen = voices?.length ? pickVoice(voices) : undefined;

      if (chosen) {
        console.info(`[EcoLoop Voice] Using: "${chosen.name}" (${chosen.lang})`);
      }

      // Speak each sentence separately with pauses — smooth & natural
      speakSequence(lines, chosen, 300);
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
