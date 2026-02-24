import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as Location from 'expo-location';
import { useTheme } from '../../core/theme/ThemeProvider';
import { RootState } from '../store';
import { cacheMonthData, CalendarDay } from '../store/slices/appSlice';
import { generateMonthGrid } from '../../core/utils/calendarGenerator';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { translatePanchangField } from '../../core/utils/panchangTranslations';
import { BirthdayModal } from '../components/BirthdayModal';

const FALLBACK_LAT = 19.0760;
const FALLBACK_LON = 72.8777;

export const CalendarScreen = () => {
    const { theme, isDark } = useTheme();
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const navigation = useNavigation<NavigationProp<any>>();

    // Navigation State
    const [currentDate, setCurrentDate] = useState(new Date());
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthKey = `${year}-${month.toString().padStart(2, '0')}`;

    // Redux Cache
    const calendarCache = useSelector((state: RootState) => state.app.calendarData || {});
    const cachedMonthGrid = calendarCache[monthKey];

    const [loading, setLoading] = useState(!cachedMonthGrid);
    const [locationName, setLocationName] = useState(t('calendar.fetchingLocation'));

    // Weekday labels translated
    const daysOfWeek = [
        t('weekDays.sun'), t('weekDays.mon'), t('weekDays.tue'),
        t('weekDays.wed'), t('weekDays.thu'), t('weekDays.fri'), t('weekDays.sat')
    ];

    useEffect(() => {
        (async () => {
            if (cachedMonthGrid) {
                setLoading(false);
                return; // Break early using memoized state
            }

            setLoading(true);
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                let lat = FALLBACK_LAT;
                let lon = FALLBACK_LON;

                if (status === 'granted') {
                    let location = await Location.getCurrentPositionAsync({});
                    lat = location.coords.latitude;
                    lon = location.coords.longitude;

                    let geocode = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
                    if (geocode && geocode.length > 0) {
                        setLocationName(geocode[0].city || t('calendar.detectedLocation'));
                    }
                }

                // Generate Grid
                const grid = generateMonthGrid(year, month, lat, lon);
                dispatch(cacheMonthData({ key: monthKey, data: grid }));

            } catch (e) {
                console.warn('Geolocation Error', e);
                // Execute fallback coordinates
                setLocationName(t('calendar.fallbackLocation'));
                const grid = generateMonthGrid(year, month, FALLBACK_LAT, FALLBACK_LON);
                dispatch(cacheMonthData({ key: monthKey, data: grid }));
            } finally {
                setLoading(false);
            }
        })();
    }, [year, month, cachedMonthGrid, dispatch, monthKey]);

    const changeMonth = (diff: number) => {
        setCurrentDate(new Date(year, month + diff, 1));
    };

    const getMonthName = (m: number) => {
        const months = [
            t('months.jan'), t('months.feb'), t('months.mar'), t('months.apr'),
            t('months.may'), t('months.jun'), t('months.jul'), t('months.aug'),
            t('months.sep'), t('months.oct'), t('months.nov'), t('months.dec')
        ];
        return months[m];
    };

    const renderHeader = () => (
        <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.arrowBtn}>
                <MaterialCommunityIcons name="chevron-left" size={32} color={theme.primary} />
            </TouchableOpacity>
            <View style={{ alignItems: 'center' }}>
                <Text style={[styles.monthText, { color: theme.textPrimary }]}>
                    {getMonthName(month)} {year}
                </Text>
                <Text style={{ color: theme.textSecondary, fontSize: 12 }}>{locationName}</Text>
            </View>
            <TouchableOpacity onPress={() => changeMonth(1)} style={styles.arrowBtn}>
                <MaterialCommunityIcons name="chevron-right" size={32} color={theme.primary} />
            </TouchableOpacity>
        </View>
    );

    const getMarkerColor = (marker?: string | null) => {
        switch (marker) {
            case 'amavasya': return '#f44336'; // Red
            case 'purnima': return '#ffeb3b'; // Yellow
            case 'ekadashi': return '#4caf50'; // Green
            default: return 'transparent';
        }
    };

    const onDayPress = (day: CalendarDay) => {
        navigation.navigate('DayDetail', { dayData: day });
    };

    const getDayBackgroundColor = (cell: CalendarDay) => {
        if (cell.nationalHolidayKey || cell.isSunday) {
            return isDark ? '#3b1f1f' : '#ffebee';
        }
        return theme.surface;
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <BirthdayModal />
            {renderHeader()}

            {/* WeekDays */}
            <View style={styles.weekDaysContainer}>
                {daysOfWeek.map((day, ix) => (
                    <Text key={ix} style={[styles.weekDayText, { color: theme.primary }]}>{day}</Text>
                ))}
            </View>

            {/* Math Grid */}
            <View style={{ flex: 1 }}>
                {loading ? (
                    <ActivityIndicator size="large" color={theme.primary} style={styles.loader} />
                ) : (
                    <View style={styles.gridContainer}>
                        {cachedMonthGrid?.map((cell, idx) => (
                            <TouchableOpacity
                                key={idx}
                                style={[
                                    styles.dayCell,
                                    { backgroundColor: getDayBackgroundColor(cell), borderColor: cell.isToday ? theme.primary : theme.border },
                                    cell.isToday && styles.todayCell
                                ]}
                                onPress={() => onDayPress(cell)}
                            >
                                <Text style={[
                                    styles.dayNumberText,
                                    { color: cell.isCurrentMonth ? theme.textPrimary : theme.textSecondary }
                                ]}>
                                    {cell.dayNumber}
                                </Text>

                                <Text style={[
                                    styles.tithiText,
                                    { color: cell.isCurrentMonth ? theme.textSecondary : theme.border }
                                ]} numberOfLines={1}>
                                    {translatePanchangField(cell.tithi.split(' ')[0], i18n.language)}
                                </Text>

                                {cell.nationalHolidayKey ? (
                                    <Text style={{ fontSize: 8, color: theme.error, marginTop: 1, fontWeight: 'bold' }}>
                                        {t('holidays.holiday')}
                                    </Text>
                                ) : (
                                    <Text style={{ fontSize: 9, color: theme.textSecondary }}> {translatePanchangField(cell.paksha.charAt(0), i18n.language)}</Text>
                                )}

                                {cell.festivalMarker && (
                                    <View style={[styles.dot, { backgroundColor: getMarkerColor(cell.festivalMarker) }]} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 15,
    },
    monthText: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    arrowBtn: {
        padding: 5,
    },
    weekDaysContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    weekDayText: {
        fontSize: 16,
        fontWeight: 'bold',
        width: 40,
        textAlign: 'center',
    },
    loader: {
        marginTop: 50,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    dayCell: {
        width: '13.5%', // Slightly less than 100/7 to account for margins
        height: 65,
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 8,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 5,
    },
    todayCell: {
        borderWidth: 2,
    },
    dayNumberText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    tithiText: {
        fontSize: 9,
        marginTop: 2,
        textAlign: 'center',
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        position: 'absolute',
        bottom: 5,
        right: 5,
    }
});
