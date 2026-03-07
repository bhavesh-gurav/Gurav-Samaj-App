import { SearchRiseSet, Observer, MakeTime, Body } from 'astronomy-engine';

export interface PanchangInfo {
    sunrise: string;
    sunset: string;
    tithi: string;
    nakshatra: string;
    paksha: string;
    hinduMonth: string;
    yoga: string;
    karana: string;
    rahuKaal: string;
    abhijitMuhurat: string;
}

// ─── Tithi names (30 tithis in a lunar month) ───
const TITHIS = [
    'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
    'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
    'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima',
    'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
    'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
    'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya',
];

// ─── Nakshatra names (27 nakshatras) ───
const NAKSHATRAS = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira',
    'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha',
    'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati',
    'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha',
    'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha',
    'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
];

// ─── Yoga names (27 yogas) ───
const YOGAS = [
    'Vishkumbha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana',
    'Atiganda', 'Sukarma', 'Dhriti', 'Shula', 'Ganda',
    'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra',
    'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva',
    'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma',
    'Indra', 'Vaidhriti',
];

// ─── Karana names (11 karanas, repeating) ───
const KARANAS = [
    'Bava', 'Balava', 'Kaulava', 'Taitila', 'Garaja',
    'Vanija', 'Vishti', 'Shakuni', 'Chatushpada', 'Nagava', 'Kimstughna',
];

// ─── Hindu month names ───
const HINDU_MONTHS = [
    'Pausha', 'Magha', 'Phalguna', 'Chaitra', 'Vaishakha', 'Jyeshtha',
    'Ashadha', 'Shravana', 'Bhadrapada', 'Ashwin', 'Kartik', 'Margashirsha',
];

// ─── Rahu Kaal by day of week (Sun=0 to Sat=6) ───
// Standard Rahu Kaal periods per weekday (based on sunrise)
const RAHU_KAAL_SEGMENTS: Record<number, [number, number]> = {
    0: [8, 9],     // Sunday: 8th segment (4:30-6:00 PM approx)
    1: [2, 3],     // Monday: 2nd segment
    2: [7, 8],     // Tuesday: 7th segment
    3: [5, 6],     // Wednesday: 5th segment
    4: [6, 7],     // Thursday: 6th segment
    5: [4, 5],     // Friday: 4th segment
    6: [3, 4],     // Saturday: 3rd segment
};

/**
 * Reference new moon date for lunar cycle calculations.
 * Jan 29, 2025 is a known Amavasya (new moon).
 */
const REFERENCE_NEW_MOON = new Date(2025, 0, 29);
const LUNAR_MONTH_DAYS = 29.53059;

const getDaysSinceNewMoon = (date: Date): number => {
    const diffMs = date.getTime() - REFERENCE_NEW_MOON.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    return ((diffDays % LUNAR_MONTH_DAYS) + LUNAR_MONTH_DAYS) % LUNAR_MONTH_DAYS;
};

const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/**
 * Calculates Panchang data for a given date and location.
 * Sunrise/sunset are real (via astronomy-engine).
 * Tithi, Nakshatra, Yoga, Karana are astronomically approximated based on lunar cycle.
 */
export const calculatePanchang = (date: Date, lat: number, lon: number): PanchangInfo => {
    const time = MakeTime(date);
    const observer = new Observer(lat, lon, 0);

    // ── Real sunrise/sunset ──
    let sunriseStr = '06:00 AM';
    let sunsetStr = '06:30 PM';
    let sunriseDate: Date | null = null;
    let sunsetDate: Date | null = null;

    try {
        const sunrise = SearchRiseSet(Body.Sun, observer, 1, time, 300);
        const sunset = SearchRiseSet(Body.Sun, observer, -1, time, 300);
        if (sunrise) {
            sunriseDate = sunrise.date;
            sunriseStr = formatTime(sunrise.date);
        }
        if (sunset) {
            sunsetDate = sunset.date;
            sunsetStr = formatTime(sunset.date);
        }
    } catch (e) {
        console.warn('Sunrise/sunset calculation error', e);
    }

    // ── Lunar cycle based calculations ──
    const lunarDay = getDaysSinceNewMoon(date);

    // Tithi: each tithi spans ~0.9844 days (29.53 / 30)
    const tithiIndex = Math.floor(lunarDay / (LUNAR_MONTH_DAYS / 30));
    const tithi = TITHIS[tithiIndex % 30];

    // Paksha: first 15 tithis = Shukla (waxing), next 15 = Krishna (waning)
    const paksha = tithiIndex < 15 ? 'Shukla Paksha' : 'Krishna Paksha';

    // Nakshatra: each nakshatra spans ~1.0936 days (29.53 / 27)
    const nakshatraIndex = Math.floor(lunarDay / (LUNAR_MONTH_DAYS / 27));
    const nakshatra = NAKSHATRAS[nakshatraIndex % 27];

    // Hindu month
    const totalLunarMonths = Math.floor((date.getTime() - REFERENCE_NEW_MOON.getTime()) / (LUNAR_MONTH_DAYS * 24 * 60 * 60 * 1000));
    const hinduMonthIndex = ((totalLunarMonths % 12) + 12) % 12;
    const hinduMonth = HINDU_MONTHS[hinduMonthIndex];

    // Yoga: each yoga spans ~1.0936 days, offset from nakshatra by ~4
    const yogaIndex = Math.floor((lunarDay + 4) / (LUNAR_MONTH_DAYS / 27));
    const yoga = YOGAS[yogaIndex % 27];

    // Karana: each karana spans ~0.4922 days (half a tithi), 60 karanas per lunar month
    const karanaIndex = Math.floor(lunarDay / (LUNAR_MONTH_DAYS / 60));
    const karana = KARANAS[karanaIndex % 11];

    // ── Rahu Kaal (based on sunrise/sunset and day of week) ──
    let rahuKaalStr = '09:00 AM - 10:30 AM';
    if (sunriseDate && sunsetDate) {
        const diffMs = sunsetDate.getTime() - sunriseDate.getTime();
        const eighth = diffMs / 8;
        const dayOfWeek = date.getDay();
        const [segStart] = RAHU_KAAL_SEGMENTS[dayOfWeek] || [2, 3];
        const rahuStart = new Date(sunriseDate.getTime() + (segStart - 1) * eighth);
        const rahuEnd = new Date(rahuStart.getTime() + eighth);
        rahuKaalStr = `${formatTime(rahuStart)} - ${formatTime(rahuEnd)}`;
    }

    // ── Abhijit Muhurat (48 minutes around local noon) ──
    let abhijitStr = '11:45 AM - 12:33 PM';
    if (sunriseDate && sunsetDate) {
        const diffMs = sunsetDate.getTime() - sunriseDate.getTime();
        const midDay = new Date(sunriseDate.getTime() + diffMs / 2);
        const abhijitStart = new Date(midDay.getTime() - (24 * 60 * 1000));
        const abhijitEnd = new Date(midDay.getTime() + (24 * 60 * 1000));
        abhijitStr = `${formatTime(abhijitStart)} - ${formatTime(abhijitEnd)}`;
    }

    return {
        sunrise: sunriseStr,
        sunset: sunsetStr,
        tithi,
        nakshatra,
        paksha,
        hinduMonth,
        yoga,
        karana,
        rahuKaal: rahuKaalStr,
        abhijitMuhurat: abhijitStr,
    };
};
