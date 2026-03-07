export interface CalendarCellData {
    isoDate: string;
    marathiDate: string;
    englishDate: number;

    tithi: string;
    paksha: string;
    hinduMonth: string;

    nakshatra?: string;

    sunrise: string;
    sunset: string;

    festivals: string[];
    notes?: string;

    isSunday: boolean;
    isToday: boolean;
    isHoliday: boolean;
    isEkadashi: boolean;
    isPurnima: boolean;
    isAmavasya: boolean;

    hasBirthday: boolean;
    hasEvent: boolean;
}
