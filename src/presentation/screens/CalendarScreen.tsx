import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import { useTheme } from '../../core/theme/ThemeProvider';
import { generateMonthData } from '../../core/utils/calendarGenerator';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { BirthdayModal } from '../components/BirthdayModal';
import { DayCell } from '../components/DayCell';

const FALLBACK_LAT = 19.0760;
const FALLBACK_LON = 72.8777;

export const CalendarScreen = () => {
    const { theme, isDark } = useTheme();
    const { t, i18n } = useTranslation();
    const navigation = useNavigation<NavigationProp<any>>();

    const [currentDate, setCurrentDate] = useState(new Date());
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthKey = `${year}-${month.toString().padStart(2, '0')}`;

    const [loading, setLoading] = useState(true);
    const [locationName, setLocationName] = useState(t('calendar.fetchingLocation'));
    const [userLat, setUserLat] = useState(FALLBACK_LAT);
    const [userLon, setUserLon] = useState(FALLBACK_LON);

    const daysOfWeek = ['रवि', 'सोम', 'मंगळ', 'बुध', 'गुरु', 'शुक्र', 'शनि'];

    // Generate month data cleanly via useMemo instead of reading stale Redux data from old app versions
    const monthData = useMemo(() => {
        setLoading(true);
        const data = generateMonthData(year, month, userLat, userLon);
        // Defer unsetting loading so visually we can catch any transition
        setTimeout(() => setLoading(false), 0);
        return data;
    }, [year, month, userLat, userLon]);

    useEffect(() => {
        (async () => {
            let lat = FALLBACK_LAT, lon = FALLBACK_LON;
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status === 'granted') {
                    let location = await Location.getCurrentPositionAsync({});
                    lat = location.coords.latitude;
                    lon = location.coords.longitude;
                    setUserLat(lat);
                    setUserLon(lon);
                    let geocode = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
                    if (geocode && geocode.length > 0) {
                        setLocationName(geocode[0].city || t('calendar.detectedLocation'));
                    }
                }
            } catch (e) {
                console.warn('Geolocation Error', e);
                setLocationName(t('calendar.fallbackLocation'));
            }
        })();
    }, [t]);



    const changeMonth = (diff: number) => setCurrentDate(new Date(year, month + diff, 1));

    const marathiMonths = [
        'जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल',
        'मे', 'जून', 'जुलै', 'ऑगस्ट',
        'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर'
    ];

    const MARATHI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    const toMarathi = (num: number): string =>
        num.toString().split('').map((d) => MARATHI_DIGITS[parseInt(d, 10)] || d).join('');

    const getMonthName = (m: number) => {
        if (i18n.language === 'mr') return marathiMonths[m];
        return [t('months.jan'), t('months.feb'), t('months.mar'), t('months.apr'),
        t('months.may'), t('months.jun'), t('months.jul'), t('months.aug'),
        t('months.sep'), t('months.oct'), t('months.nov'), t('months.dec')][m];
    };

    const renderHeader = () => (
        <View style={[styles.headerRow, { backgroundColor: isDark ? '#1a1a2e' : '#E65100' }]}>
            <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.arrowBtn}>
                <MaterialCommunityIcons name="chevron-left" size={30} color="#fff" />
            </TouchableOpacity>
            <View style={{ alignItems: 'center' }}>
                <Text style={styles.monthText}>
                    {getMonthName(month)} {i18n.language === 'mr' ? toMarathi(year) : year}
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>{locationName}</Text>
            </View>
            <TouchableOpacity onPress={() => changeMonth(1)} style={styles.arrowBtn}>
                <MaterialCommunityIcons name="chevron-right" size={30} color="#fff" />
            </TouchableOpacity>
        </View>
    );

    const onDayPress = (isoDate: string) => {
        navigation.navigate('DayDetail', { isoDate });
    };

    // Calculate responsive row height based on screen dimensions
    const screenHeight = Dimensions.get("window").height;
    const headerHeight = 250; // Increased by another 30px to reduce cell height by ~5px
    const availableHeight = screenHeight - headerHeight;
    const rowsCount = monthData ? monthData.length : 5;
    const cellHeight = availableHeight / rowsCount;

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
            <BirthdayModal />
            {renderHeader()}

            {/* Weekday Header */}
            <View style={[styles.weekRow, { backgroundColor: isDark ? '#2a2a2a' : '#fff3e0' }]}>
                {daysOfWeek.map((day, ix) => (
                    <Text key={ix} style={[styles.weekText, { color: ix === 0 ? '#d32f2f' : (isDark ? '#ffcc80' : '#E65100') }]}>{day}</Text>
                ))}
            </View>

            {/* Grid */}
            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color={theme.primary} />
                </View>
            ) : (
                <View style={[styles.gridContainer, { height: availableHeight }]}>
                    {monthData && monthData.map((week, weekIdx) => (
                        <View key={`week-${weekIdx}`} style={styles.weekContainer}>
                            {week.map((cell, dayIdx) => (
                                <DayCell
                                    key={`cell-${weekIdx}-${dayIdx}`}
                                    cell={cell}
                                    cellHeight={cellHeight}
                                    onPress={onDayPress}
                                />
                            ))}
                        </View>
                    ))}
                </View>
            )}

            {/* Ad Space Placeholder */}
            {!loading && (
                <View style={styles.adContainer}>
                    <Text style={{ color: isDark ? '#555' : '#aaa', fontSize: 12 }}>Ad Space</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    headerRow: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', paddingVertical: 14, paddingHorizontal: 10,
    },
    monthText: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
    arrowBtn: { padding: 5 },
    weekRow: {
        flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 8,
    },
    weekText: { fontSize: 13, fontWeight: 'bold', width: '14.28%', textAlign: 'center' },
    loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    gridContainer: {
        flexDirection: 'column',
    },
    weekContainer: {
        flexDirection: 'row',
        width: '100%',
    },
    adContainer: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
        marginTop: 5,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#ccc',
        borderRadius: 8,
    }
});
