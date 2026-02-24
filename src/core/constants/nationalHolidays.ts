export interface NationalHoliday {
    month: number; // 0-indexed (0 = January)
    day: number;
    key: string;   // Maps to i18n translation key
}

export const INDIAN_NATIONAL_HOLIDAYS: NationalHoliday[] = [
    { month: 0, day: 26, key: 'republic_day' },
    { month: 7, day: 15, key: 'independence_day' },
    { month: 9, day: 2, key: 'gandhi_jayanti' }
];
