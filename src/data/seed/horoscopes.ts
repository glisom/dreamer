import { SQLiteDatabase } from '../sqlite/types';
import {
  CreateHoroscopeInput,
  Horoscope,
  HoroscopesRepository,
} from '../repositories/horoscopesRepo';

export interface HoroscopePlaceholder {
  zodiacSign: string;
  summary: string;
  compatibility: string;
  luckyNumbers: string;
}

export const DEFAULT_HOROSCOPE_PLACEHOLDERS: HoroscopePlaceholder[] = [
  {
    zodiacSign: 'Aries',
    summary: 'Channel bold energy into creative pursuits and collaborative breakthroughs.',
    compatibility: 'Leo, Sagittarius',
    luckyNumbers: '1, 9, 27',
  },
  {
    zodiacSign: 'Taurus',
    summary: 'Ground yourself with consistent rituals and appreciate small comforts.',
    compatibility: 'Virgo, Capricorn',
    luckyNumbers: '2, 8, 16',
  },
  {
    zodiacSign: 'Gemini',
    summary: 'Curiosity opens doors; share your discoveries with trusted friends.',
    compatibility: 'Libra, Aquarius',
    luckyNumbers: '3, 5, 14',
  },
  {
    zodiacSign: 'Cancer',
    summary: 'Nurture emotional connections and set firm boundaries where needed.',
    compatibility: 'Scorpio, Pisces',
    luckyNumbers: '4, 7, 22',
  },
  {
    zodiacSign: 'Leo',
    summary: 'Lead with warmth and celebrate progress toward long-term dreams.',
    compatibility: 'Aries, Sagittarius',
    luckyNumbers: '5, 19, 33',
  },
  {
    zodiacSign: 'Virgo',
    summary: 'Refine your routines; mindful organization invites clarity.',
    compatibility: 'Taurus, Capricorn',
    luckyNumbers: '6, 15, 24',
  },
  {
    zodiacSign: 'Libra',
    summary: 'Seek balance in relationships and add beauty to your surroundings.',
    compatibility: 'Gemini, Aquarius',
    luckyNumbers: '7, 11, 28',
  },
  {
    zodiacSign: 'Scorpio',
    summary: 'Transformative insights arrive when you lean into vulnerability.',
    compatibility: 'Cancer, Pisces',
    luckyNumbers: '8, 13, 21',
  },
  {
    zodiacSign: 'Sagittarius',
    summary: 'Adventure awaits; expand your worldview through study or travel.',
    compatibility: 'Aries, Leo',
    luckyNumbers: '9, 18, 30',
  },
  {
    zodiacSign: 'Capricorn',
    summary: 'Strategic planning turns ambitions into tangible milestones.',
    compatibility: 'Taurus, Virgo',
    luckyNumbers: '10, 17, 26',
  },
  {
    zodiacSign: 'Aquarius',
    summary: 'Innovative ideas flourish when you collaborate with like minds.',
    compatibility: 'Gemini, Libra',
    luckyNumbers: '11, 20, 32',
  },
  {
    zodiacSign: 'Pisces',
    summary: 'Dreams guide you; translate intuition into grounded action.',
    compatibility: 'Cancer, Scorpio',
    luckyNumbers: '12, 23, 34',
  },
];

export interface SeedHoroscopeOptions {
  readingDate?: string;
  overwrite?: boolean;
}

export function seedHoroscopePlaceholders(
  db: SQLiteDatabase,
  userId: number,
  placeholders: HoroscopePlaceholder[] = DEFAULT_HOROSCOPE_PLACEHOLDERS,
  options: SeedHoroscopeOptions = {}
): Horoscope[] {
  const repository = new HoroscopesRepository(db);
  const readingDate = options.readingDate ?? new Date().toISOString().slice(0, 10);

  if (!options.overwrite) {
    const existing = repository.getByUser(userId).filter(
      (entry) => entry.readingDate === readingDate
    );

    if (existing.length >= placeholders.length) {
      return existing;
    }

    const existingSigns = new Set(existing.map((entry) => entry.zodiacSign));
    const toCreate: CreateHoroscopeInput[] = placeholders
      .filter((placeholder) => !existingSigns.has(placeholder.zodiacSign))
      .map((placeholder) => ({
        userId,
        zodiacSign: placeholder.zodiacSign,
        readingDate,
        summary: placeholder.summary,
        compatibility: placeholder.compatibility,
        luckyNumbers: placeholder.luckyNumbers,
      }));

    for (const entry of toCreate) {
      repository.create(entry);
    }

    return repository.getByUser(userId).filter(
      (entry) => entry.readingDate === readingDate
    );
  }

  if (options.overwrite) {
    const existing = repository.getByUser(userId).filter(
      (entry) => entry.readingDate === readingDate
    );
    for (const entry of existing) {
      repository.delete(entry.id);
    }
  }

  const created: Horoscope[] = [];
  for (const placeholder of placeholders) {
    created.push(
      repository.create({
        userId,
        zodiacSign: placeholder.zodiacSign,
        readingDate,
        summary: placeholder.summary,
        compatibility: placeholder.compatibility,
        luckyNumbers: placeholder.luckyNumbers,
      })
    );
  }

  return created;
}
