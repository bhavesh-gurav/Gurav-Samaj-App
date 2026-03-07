/**
 * PanchangDay — Comprehensive daily Panchang data model.
 * Used for both calendar grid cells (minimal) and detail screens (full).
 */

export interface TithiInfo {
    name: string;
    paksha: string;
    endsAt: string | null;
}

export interface NakshatraInfo {
    name: string;
    endsAt: string | null;
}

export interface YogaInfo {
    name: string;
    endsAt: string | null;
}

export interface KaranaInfo {
    name: string;
    endsAt: string | null;
}

export interface FestivalInfo {
    name: string;
    type: 'national' | 'hindu' | 'community';
    description?: string;
}

export interface BirthdayInfo {
    userId: string;
    name: string;
}

export interface CommunityEventInfo {
    id: string;
    title: string;
    location: string;
    time?: string;
}

export interface PanchangDay {
    // Date identity
    isoDate: string;           // "2026-03-25"
    englishDate: number;
    marathiDate: string;       // "२५"

    // Panchang Core
    tithi: TithiInfo;
    nakshatra: NakshatraInfo;
    yoga: YogaInfo;
    karana: KaranaInfo;
    hinduMonth: string;

    // Sun timings
    sunrise: string;
    sunset: string;
    rahuKaal: string;
    abhijitMuhurat: string | null;

    // Events
    festivals: FestivalInfo[];
    birthdays: BirthdayInfo[];
    communityEvents: CommunityEventInfo[];

    // UI flags
    isSunday: boolean;
    isToday: boolean;
    isHoliday: boolean;
    isCurrentMonth: boolean;
}
