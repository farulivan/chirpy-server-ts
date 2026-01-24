import { PROFANE_WORDS } from '../shared/constants.js';

export class ContentFilterService {
  private readonly profaneWords: readonly string[];

  constructor(profaneWords: readonly string[] = PROFANE_WORDS) {
    this.profaneWords = profaneWords;
  }

  filterProfanity(content: string): string {
    const words = content.split(/\s+/).filter(Boolean);

    const cleanedWords = words.map((word) => {
      const trailingPunctuationMatch = word.match(/[.,!?;:]+$/);
      const trailingPunctuation = trailingPunctuationMatch?.[0] ?? '';
      const bareWord = trailingPunctuation
        ? word.slice(0, -trailingPunctuation.length)
        : word;

      const isProfane = this.profaneWords.includes(bareWord.toLowerCase());

      if (isProfane) {
        return '****' + trailingPunctuation;
      }

      return word;
    });

    return cleanedWords.join(' ');
  }
}

export const contentFilterService = new ContentFilterService();
