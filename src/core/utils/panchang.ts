import { SearchRiseSet, Observer, MakeTime, Body } from 'astronomy-engine';

export interface PanchangInfo {
    sunrise: string;
    sunset: string;
    tithi: string;
    nakshatra: string;
    paksha: string;
    hinduMonth: string;
    rahuKaal: string;
    abhijitMuhurat: string;
}

/**
 * Calculates local sunrise and sunset based on latitude, longitude, and date.
 * Generates mock values for complex Hindu astronomical metrics.
 */
export const calculatePanchang = (date: Date, lat: number, lon: number): PanchangInfo => {
    const time = MakeTime(date);
    const observer = new Observer(lat, lon, 0);

    // Calculate Sunrise and Sunset
    let sunriseStr = 'N/A';
    let sunsetStr = 'N/A';

    // We will need numeric sunrise/sunset for muhurat calculations
    let sunriseDate: Date | null = null;
    let sunsetDate: Date | null = null;

    try {
        const sunrise = SearchRiseSet(Body.Sun, observer, 1, time, 300);
        const sunset = SearchRiseSet(Body.Sun, observer, -1, time, 300);

        if (sunrise) {
            sunriseDate = sunrise.date;
            sunriseStr = sunrise.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        if (sunset) {
            sunsetDate = sunset.date;
            sunsetStr = sunset.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
    } catch (e) {
        console.warn("Could not calculate sunrise/sunset timezone variations", e);
    }

    // --- MOCK HINDU ASTRONOMY MATH ---
    // True Tithi / Nakshatra requires lunar longitude and geocentric calculations.
    // For a production app, we would replace these with either exact calculations 
    // or an external Panchang REST API for scale.

    // Rahu Kaal roughly 1/8th of daylight
    let rahuKaalMock = '09:00 AM - 10:30 AM';
    let abhijitMock = '11:45 AM - 12:30 PM';

    if (sunriseDate && sunsetDate) {
        const diffMs = sunsetDate.getTime() - sunriseDate.getTime();
        const eighth = diffMs / 8;
        // Abhijit is the middle 1/15th, or roughly around local noon
        const midDay = new Date(sunriseDate.getTime() + diffMs / 2);
        const abhijitStart = new Date(midDay.getTime() - (24 * 60 * 1000));
        const abhijitEnd = new Date(midDay.getTime() + (24 * 60 * 1000));
        abhijitMock = `${abhijitStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${abhijitEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }

    return {
        sunrise: sunriseStr,
        sunset: sunsetStr,
        tithi: 'Pratipada (Mock)',
        nakshatra: 'Ashvini (Mock)',
        paksha: 'Shukla Paksha (Mock)',
        hinduMonth: 'Chaitra (Mock)',
        rahuKaal: rahuKaalMock,
        abhijitMuhurat: abhijitMock
    };
};
