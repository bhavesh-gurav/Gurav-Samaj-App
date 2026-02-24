import { calculatePanchang, PanchangInfo } from './panchang';
import { INDIAN_NATIONAL_HOLIDAYS } from '../constants/nationalHolidays';

export interface CalendarDay extends PanchangInfo {
    dateObj: string; // ISO String to persist via Redux
    dayNumber: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    isSunday: boolean;
    festivalMarker?: 'amavasya' | 'purnima' | 'ekadashi' | null;
    nationalHolidayKey?: string;
}

export const generateMonthGrid = (
    year: number,
    month: number,
    lat: number,
    lon: number
): CalendarDay[] => {
    const grid: CalendarDay[] = [];
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Day of week (0 = Sunday, 1 = Monday ...)
    const startingDayOfWeek = firstDayOfMonth.getDay();
    const today = new Date();

    // 1. Generate previous month overflowing days
    const prevMonthLastDate = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const dayNum = prevMonthLastDate - i;
        const date = new Date(year, month - 1, dayNum);
        grid.push(buildCalendarDay(date, false, today, lat, lon));
    }

    // 2. Generate current month days
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
        const date = new Date(year, month, i);
        grid.push(buildCalendarDay(date, true, today, lat, lon));
    }

    // 3. Generate next month overflow to complete the grid (5 or 6 rows)
    const totalCurrentAndPrev = grid.length;
    const totalCellsRequired = totalCurrentAndPrev > 35 ? 42 : 35;
    const remainingCells = totalCellsRequired - totalCurrentAndPrev;

    for (let i = 1; i <= remainingCells; i++) {
        const date = new Date(year, month + 1, i);
        grid.push(buildCalendarDay(date, false, today, lat, lon));
    }

    return grid;
};

const buildCalendarDay = (
    date: Date,
    isCurrentMonth: boolean,
    today: Date,
    lat: number,
    lon: number
): CalendarDay => {
    const panchang = calculatePanchang(date, lat, lon);

    const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

    // Deduce marker based on mock string for now
    // In production, 'tithi' should be an enum/number mapped to these
    let marker: 'amavasya' | 'purnima' | 'ekadashi' | null = null;
    const tithiLower = panchang.tithi.toLowerCase();

    // Random mock markers to demonstrate capabilities
    if (tithiLower.includes('amavasya') || date.getDate() === 15) marker = 'amavasya';
    else if (tithiLower.includes('purnima') || date.getDate() === 30) marker = 'purnima';
    else if (tithiLower.includes('ekadashi') || date.getDate() === 11 || date.getDate() === 26) marker = 'ekadashi';

    const isSunday = date.getDay() === 0;

    const holidayMatch = INDIAN_NATIONAL_HOLIDAYS.find(
        (h) => h.month === date.getMonth() && h.day === date.getDate()
    );

    return {
        ...panchang,
        dateObj: date.toISOString(),
        dayNumber: date.getDate(),
        isCurrentMonth,
        isToday,
        isSunday,
        festivalMarker: marker,
        nationalHolidayKey: holidayMatch?.key,
    };
};
