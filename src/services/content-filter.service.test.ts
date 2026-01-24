import { describe, it, expect } from 'vitest';
import { ContentFilterService } from './content-filter.service.js';

describe('ContentFilterService', () => {
  const service = new ContentFilterService(['kerfuffle', 'sharbert', 'fornax']);

  it('should filter profane words', () => {
    const result = service.filterProfanity('This is a kerfuffle situation');
    expect(result).toBe('This is a **** situation');
  });

  it('should preserve punctuation after profane words', () => {
    const result = service.filterProfanity('What a kerfuffle!');
    expect(result).toBe('What a ****!');
  });

  it('should be case-insensitive', () => {
    const result = service.filterProfanity('KERFUFFLE and Sharbert');
    expect(result).toBe('**** and ****');
  });

  it('should not filter non-profane words', () => {
    const result = service.filterProfanity('This is a clean message');
    expect(result).toBe('This is a clean message');
  });

  it('should handle multiple profane words', () => {
    const result = service.filterProfanity('kerfuffle sharbert fornax');
    expect(result).toBe('**** **** ****');
  });
});
