/**
 * EcoLoop Voice Synthesis — Indian Accent Assistant
 * 
 * Ensures authentic Indian English pronunciation:
 * 1. Explicitly sets `utterance.lang = 'en-IN'` on every utterance so the browser
 *    phonetic synthesizer switches to the Indian English phoneme model.
 * 2. Strictly prioritizes Indian English voices (en-IN, Ravi, Prabhat, Neerja, Heera, Google India).
 * 3. Fallbacks preserve Indian cadence with natural pitch and pacing.
 */

// ---------------------------------------------------------------------------
// Voice Selection — Strictly Prioritize Indian Accent (en-IN)
// ---------------------------------------------------------------------------

const INDIAN_VOICE_KEYWORDS = [
  'en-in',
  'india',
  'indian',
  'ravi',                         // Microsoft Ravi (en-IN male)
  'prabhat',                      // Microsoft Prabhat (en-IN male, natural)
  'madhur',                       // Microsoft Madhur (hi-IN / en-IN male)
  'neerja',                       // Microsoft Neerja (en-IN natural)
  'heera',                        // Microsoft Heera (en-IN)
  'swara',                        // Microsoft Swara (hi-IN)
  'google हिन्दी',                 // Chrome Google Hindi / Indian
  'google english (india)',
];

const FEMALE_HINTS = ['female', 'zira', 'susan', 'hazel', 'jenny', 'aria', 'libby'];

function isFemale(name: string): boolean {
  const l = name.toLowerCase();
  return FEMALE_HINTS.some((h) => l.includes(h));
}

function pickIndianVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  if (!voices || voices.length === 0) return undefined;

  // 1. First priority: Indian English Male voice
  const indianMale = voices.find((v) => {
    const lang = (v.lang || '').toLowerCase().replace('_', '-');
    const name = (v.name || '').toLowerCase();
    const isIndian = lang.startsWith('en-in') || INDIAN_VOICE_KEYWORDS.some((kw) => name.includes(kw));
    return isIndian && !isFemale(name);
  });
  if (indianMale) return indianMale;

  // 2. Second priority: Any Indian English voice (even natural female like Neerja / Heera has authentic Indian accent)
  const anyIndian = voices.find((v) => {
    const lang = (v.lang || '').toLowerCase().replace('_', '-');
    const name = (v.name || '').toLowerCase();
    return lang.startsWith('en-in') || INDIAN_VOICE_KEYWORDS.some((kw) => name.includes(kw));
  });
  if (anyIndian) return anyIndian;

  // 3. Third priority: British English male (Daniel, George) which has close formal cadence
  const britishMale = voices.find((v) => {
    const lang = (v.lang || '').toLowerCase().replace('_', '-');
    const name = (v.name || '').toLowerCase();
    return (lang.startsWith('en-gb') || name.includes('uk') || name.includes('george') || name.includes('daniel')) && !isFemale(name);
  });
  if (britishMale) return britishMale;

  // 4. Any English non-female
  const anyMale = voices.find((v) => v.lang.startsWith('en') && !isFemale(v.name));
  if (anyMale) return anyMale;

  // 5. Default
  return voices.find((v) => v.lang.startsWith('en')) || voices[0];
}

// ---------------------------------------------------------------------------
// Sequential speaking engine
// ---------------------------------------------------------------------------

function speakSequence(
  lines: string[],
  voice: SpeechSynthesisVoice | undefined,
  gapMs = 280
): void {
  let index = 0;

  const speakNext = () => {
    if (index >= lines.length) return;

    const utt = new SpeechSynthesisUtterance(lines[index]);

    // Force Indian English language code on the utterance
    // This is CRITICAL: it instructs Chrome/Edge TTS engines to apply Indian English phonetics
    utt.lang = 'en-IN';

    if (voice) {
      utt.voice = voice;
    }

    // Acoustic parameters for warm, crisp Indian conversational delivery:
    // Pitch 0.95: Natural male tone
    // Rate 0.98: Fluent, natural Indian conversational pacing
    utt.pitch = 0.95;
    utt.rate = 0.98;
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
// Natural Indian English Message Script
// ---------------------------------------------------------------------------

function buildLines(name: string, points: number): string[] {
  const first = name ? name.split(' ')[0] : 'Citizen';
  const pointsStr = points === 1 ? '1 EcoPoint' : `${points} EcoPoints`;

  return [
    `Hello, welcome back ${first}.`,
    `Your current score is ${pointsStr}.`,
    points > 0
      ? 'Keep settling up your garbage and earn rewards!'
      : 'Start settling up your garbage today to earn exciting rewards!',
  ];
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
      const chosen = voices?.length ? pickIndianVoice(voices) : undefined;

      if (chosen) {
        console.info(`[EcoLoop Voice] Selected Indian Accent Voice: "${chosen.name}" (${chosen.lang})`);
      }

      speakSequence(lines, chosen, 280);
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
