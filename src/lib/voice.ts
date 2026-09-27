/**
 * Speech synthesis utility for EcoLoop Citizen Welcome.
 * Speaks with a formal, natural human male voice:
 * "Hello, welcome back [Name]. Your current score is [Points] points. Keep settling up garbage and earn rewards!"
 */
export const playLoginWelcomeVoice = (userName: string, ecoPoints: number) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    // Cancel any previous or stuck speech
    window.speechSynthesis.cancel();

    // Clean user name (first name, capitalized)
    const cleanName = userName ? userName.split(' ')[0] : 'Citizen';
    const pointsText = ecoPoints === 1 ? '1 point' : `${ecoPoints} points`;
    const message = `Hello, welcome back ${cleanName}. Your current score is ${pointsText}. Keep settling up garbage and earn rewards!`;

    const utterance = new SpeechSynthesisUtterance(message);

    const selectVoiceAndSpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices || voices.length === 0) {
        utterance.pitch = 0.92;
        utterance.rate = 0.94;
        window.speechSynthesis.speak(utterance);
        return;
      }

      // Prioritize natural, formal human male English voices across Windows, Chrome, Edge, Android, macOS
      const naturalMaleVoiceKeywords = [
        'microsoft guy online (natural)',
        'guy online',
        'natural',
        'google uk english male',
        'google us english',
        'en-us-standard-b',
        'en-us-neural2-d',
        'microsoft david',
        'microsoft mark',
        'microsoft george',
        'daniel',
        'oliver',
        'alex',
      ];

      const englishVoices = voices.filter((v) => v.lang.startsWith('en'));

      let chosenVoice: SpeechSynthesisVoice | undefined;

      // 1. Look for high quality natural male voices
      for (const keyword of naturalMaleVoiceKeywords) {
        chosenVoice = englishVoices.find((v) =>
          v.name.toLowerCase().includes(keyword) &&
          !v.name.toLowerCase().includes('female') &&
          !v.name.toLowerCase().includes('zira')
        );
        if (chosenVoice) break;
      }

      // 2. Fallback: Any English voice that does not have female identifiers
      if (!chosenVoice) {
        chosenVoice = englishVoices.find((v) => {
          const lower = v.name.toLowerCase();
          return !lower.includes('female') && !lower.includes('zira') && !lower.includes('susan') && !lower.includes('hazel');
        });
      }

      // 3. Fallback to any english voice or first available
      if (!chosenVoice) {
        chosenVoice = englishVoices[0] || voices[0];
      }

      if (chosenVoice) {
        utterance.voice = chosenVoice;
      }

      // Humanized acoustic parameters:
      // Deeper pitch (0.92) gives a natural, warm, formal male timbre
      // Rate (0.94) provides a calm, formal, deliberate professional cadence
      utterance.pitch = 0.92;
      utterance.rate = 0.94;
      utterance.volume = 1;

      window.speechSynthesis.speak(utterance);
    };

    if (window.speechSynthesis.getVoices().length > 0) {
      selectVoiceAndSpeak();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        selectVoiceAndSpeak();
      };
    }
  } catch (err) {
    console.warn('Speech synthesis notification skipped:', err);
  }
};
