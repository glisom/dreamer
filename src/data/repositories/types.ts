export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Alarm extends BaseEntity {
  userId: number;
  label: string | null;
  alarmTime: string;
  recurrence: string | null;
  enabled: boolean;
}

export interface Dream extends BaseEntity {
  userId: number;
  title: string;
  narrative: string | null;
  mood: string | null;
  lucidityLevel: number | null;
  sleepQuality: number | null;
  dreamDate: string;
}

export interface Horoscope extends BaseEntity {
  userId: number;
  zodiacSign: string;
  readingDate: string;
  summary: string | null;
  compatibility: string | null;
  luckyNumbers: string | null;
}

export interface UserProfile extends BaseEntity {
  displayName: string;
  timezone: string | null;
  birthdate: string | null;
  bio: string | null;
}

export interface DreamSymbol extends BaseEntity {
  dreamId: number | null;
  symbol: string;
  meaning: string | null;
  notes: string | null;
}

export interface Synchronicity extends BaseEntity {
  dreamId: number | null;
  description: string;
  occurredOn: string | null;
  correlationScore: number | null;
}

export type EntityMap = {
  alarms: Alarm;
  dreams: Dream;
  horoscopes: Horoscope;
  userProfile: UserProfile;
  dreamSymbols: DreamSymbol;
  synchronicities: Synchronicity;
};
