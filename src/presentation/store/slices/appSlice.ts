import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ThemeType = 'light' | 'dark' | 'system';

export interface CalendarDay {
    dateObj: string;
    dayNumber: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    isSunday: boolean;
    festivalMarker?: 'amavasya' | 'purnima' | 'ekadashi' | null;
    nationalHolidayKey?: string;
    sunrise: string;
    sunset: string;
    tithi: string;
    nakshatra: string;
    paksha: string;
    hinduMonth: string;
    rahuKaal: string;
    abhijitMuhurat: string;
}

interface AppState {
    theme: ThemeType;
    isFirstLaunch: boolean;
    language: 'en' | 'mr' | null;
    calendarData: Record<string, CalendarDay[]>;
    userName: string | null;
    userBirthDate: string | null;
    lastBirthdayShownDate: string | null;
    isGuest: boolean;
}

const initialState: AppState = {
    theme: 'system',
    isFirstLaunch: true,
    language: null,
    calendarData: {},
    userName: null,
    userBirthDate: null,
    lastBirthdayShownDate: null,
    isGuest: false,
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<ThemeType>) => {
            state.theme = action.payload;
        },
        setAppLaunched: (state) => {
            state.isFirstLaunch = false;
        },
        cacheMonthData: (state, action: PayloadAction<{ key: string; data: CalendarDay[] }>) => {
            if (!state.calendarData) {
                state.calendarData = {};
            }
            state.calendarData[action.payload.key] = action.payload.data;
        },
        setLanguage: (state, action: PayloadAction<'en' | 'mr' | null>) => {
            state.language = action.payload;
        },
        setUserBirthDate: (state, action: PayloadAction<string>) => {
            state.userBirthDate = action.payload;
        },
        setUserName: (state, action: PayloadAction<string>) => {
            state.userName = action.payload;
        },
        setLastBirthdayShownDate: (state, action: PayloadAction<string>) => {
            state.lastBirthdayShownDate = action.payload;
        },
        setGuestMode: (state) => {
            state.isGuest = true;
        },
        clearGuestMode: (state) => {
            state.isGuest = false;
        }
    },
});

export const { setTheme, setAppLaunched, cacheMonthData, setLanguage, setUserBirthDate, setUserName, setLastBirthdayShownDate, setGuestMode, clearGuestMode } = appSlice.actions;

export default appSlice.reducer;
