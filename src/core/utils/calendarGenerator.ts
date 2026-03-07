import { calculatePanchang } from './panchang';
import { INDIAN_NATIONAL_HOLIDAYS } from '../constants/nationalHolidays';
import { CalendarCellData } from '../../domain/models/CalendarCellData';

// ─── Marathi numeral converter ───
const MARATHI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
const toMarathiNumeral = (num: number): string => {
    return num.toString().split('').map((d) => MARATHI_DIGITS[parseInt(d, 10)] || d).join('');
};

/**
 * Generates a full month grid of CalendarCellData objects.
 * Structured as a 2D array of weeks (rows) x days (columns).
 * Contains only current month dates. Precedes start date with nulls.
 * Rows = 5 or 6 depending on month start/length.
 */
export const generateMonthData = (
    year: number,
    month: number,
    lat: number,
    lon: number
): (CalendarCellData | null)[][] => {
    const weeks: (CalendarCellData | null)[][] = [];
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const today = new Date();

    const startingDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    let currentWeek: (CalendarCellData | null)[] = [];

    // 1. Insert empty cells before start
    for (let i = 0; i < startingDayOfWeek; i++) {
        currentWeek.push(null);
    }

    // 2. Current month days
    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i);
        currentWeek.push(buildCalendarCellData(date, today, lat, lon));

        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    }

    // 3. Fill remaining days of the last week with nulls to keep grid structure
    if (currentWeek.length > 0) {
        while (currentWeek.length < 7) {
            currentWeek.push(null);
        }
        weeks.push(currentWeek);
    }

    return weeks;
};

const buildCalendarCellData = (
    date: Date,
    today: Date,
    lat: number,
    lon: number
): CalendarCellData => {
    const panchang = calculatePanchang(date, lat, lon);

    const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

    const isSunday = date.getDay() === 0;

    // Build festivals from national holidays
    const festivals: string[] = [];
    const holidayMatches = INDIAN_NATIONAL_HOLIDAYS.filter(
        (h) => h.month === date.getMonth() && h.day === date.getDate()
    );
    for (const h of holidayMatches) {
        festivals.push(h.name);
    }

    const isHoliday = festivals.length > 0 || isSunday;

    // Format ISO date string
    const isoDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    const tithiStr = panchang.tithi || '';
    const isEkadashi = tithiStr.toLowerCase().includes('ekadashi');
    const isPurnima = tithiStr.toLowerCase().includes('purnima');
    const isAmavasya = tithiStr.toLowerCase().includes('amavasya');

    return {
        isoDate,
        marathiDate: toMarathiNumeral(date.getDate()),
        englishDate: date.getDate(),

        tithi: panchang.tithi,
        paksha: panchang.paksha,
        hinduMonth: panchang.hinduMonth,

        nakshatra: panchang.nakshatra,

        sunrise: panchang.sunrise,
        sunset: panchang.sunset,

        festivals,
        notes: undefined,

        isSunday,
        isToday,
        isHoliday,
        isEkadashi,
        isPurnima,
        isAmavasya,

        hasBirthday: false, // Populated later if needed
        hasEvent: false,    // Populated later if needed
    };
};
