import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../core/theme/ThemeProvider';
import { translatePanchangField } from '../../core/utils/panchangTranslations';
import { calculatePanchang } from '../../core/utils/panchang';
import { INDIAN_NATIONAL_HOLIDAYS } from '../../core/constants/nationalHolidays';
import * as Location from 'expo-location';

type ParamList = {
    DayDetail: {
        isoDate: string;
    };
};

const WEEKDAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const WEEKDAYS_MR = ['रविवार', 'सोमवार', 'मंगळवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];

const MARATHI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
const toMarathiNumeral = (num: number): string => {
    return num.toString().split('').map((d) => MARATHI_DIGITS[parseInt(d, 10)] || d).join('');
};

const FALLBACK_LAT = 19.0760;
const FALLBACK_LON = 72.8777;

export const DayDetailScreen = () => {
    const route = useRoute<RouteProp<ParamList, 'DayDetail'>>();
    const { theme, isDark } = useTheme();
    const { t, i18n } = useTranslation();
    const { isoDate } = route.params;
    const lng = i18n.language;

    const [panchangData, setPanchangData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const dateParts = isoDate.split('-');
    const dateObj = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
    const dayOfWeek = dateObj.getDay();
    const isMr = lng === 'mr';
    const dayName = isMr ? WEEKDAYS_MR[dayOfWeek] : WEEKDAYS_EN[dayOfWeek];
    const marathiDateText = toMarathiNumeral(dateObj.getDate());

    useEffect(() => {
        (async () => {
            let lat = FALLBACK_LAT, lon = FALLBACK_LON;
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status === 'granted') {
                    let location = await Location.getCurrentPositionAsync({});
                    lat = location.coords.latitude;
                    lon = location.coords.longitude;
                }
            } catch (e) {
                console.warn('Geolocation Error', e);
            }

            const calculated = calculatePanchang(dateObj, lat, lon);

            const festivals: string[] = [];
            const holidayMatches = INDIAN_NATIONAL_HOLIDAYS.filter(
                (h: any) => h.month === dateObj.getMonth() && h.day === dateObj.getDate()
            );
            for (const h of holidayMatches) {
                festivals.push(h.name);
            }

            setPanchangData({
                ...calculated,
                festivals,
                birthdays: [], // mock
                communityEvents: [], // mock
            });
            setLoading(false);
        })();
    }, [isoDate]);

    // Helper to translate values based on language
    const tr = (val: string): string => translatePanchangField(val, lng);

    if (loading || !panchangData) {
        return (
            <View style={[styles.loaderContainer, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            {/* ── Header ── */}
            <View style={[styles.header, { backgroundColor: isDark ? '#1a1a2e' : '#E65100' }]}>
                <Text style={styles.headerMarathiDate}>{marathiDateText}</Text>
                <Text style={styles.headerEnglishDate}>
                    {dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </Text>
                <Text style={styles.headerDayName}>{dayName}</Text>
                {panchangData.festivals.length > 0 && (
                    <View style={styles.festivalBadge}>
                        <Text style={styles.festivalBadgeText}>{panchangData.festivals[0]}</Text>
                    </View>
                )}
            </View>

            {/* ── Section 1: Panchang Details ── */}
            <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Text style={[styles.sectionTitle, { color: theme.primary }]}>{t('detail.panchang')}</Text>
                <InfoRow label={t('detail.tithi')} value={tr(panchangData.tithi)} theme={theme} />
                <InfoRow label={t('detail.nakshatra')} value={tr(panchangData.nakshatra)} theme={theme} />
                <InfoRow label={t('detail.yoga')} value={tr(panchangData.yoga)} theme={theme} />
                <InfoRow label={t('detail.karana')} value={tr(panchangData.karana)} theme={theme} />
                <InfoRow label={t('detail.paksha')} value={tr(panchangData.paksha)} theme={theme} />
                <InfoRow label={t('detail.hinduMonth')} value={tr(panchangData.hinduMonth)} theme={theme} />
            </View>

            {/* ── Section 2: Sun Info ── */}
            <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Text style={[styles.sectionTitle, { color: theme.primary }]}>{t('detail.sunInfo')}</Text>
                <InfoRow label={t('dayDetail.sunrise')} value={panchangData.sunrise} theme={theme} icon="🌅" />
                <InfoRow label={t('dayDetail.sunset')} value={panchangData.sunset} theme={theme} icon="🌇" />
                <InfoRow label={t('dayDetail.rahuKaal')} value={panchangData.rahuKaal} theme={theme} icon="⚠️" />
                {panchangData.abhijitMuhurat && (
                    <InfoRow label={t('dayDetail.abhijitMuhurat')} value={panchangData.abhijitMuhurat} theme={theme} icon="✨" />
                )}
            </View>

            {/* ── Section 3: Festivals ── */}
            {panchangData.festivals.length > 0 && (
                <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <Text style={[styles.sectionTitle, { color: theme.primary }]}>{t('detail.festivals')}</Text>
                    {panchangData.festivals.map((festName: string, i: number) => (
                        <View key={i} style={styles.listItem}>
                            <Text style={[styles.listTitle, { color: theme.textPrimary }]}>
                                🇮🇳 {festName}
                            </Text>
                        </View>
                    ))}
                </View>
            )}

            <View style={{ height: 30 }} />
        </ScrollView>
    );
};

// ── Row component ──
const InfoRow = ({ label, value, endTime, theme, icon }: {
    label: string; value: string; endTime?: string | null; theme: any; icon?: string;
}) => (
    <View style={styles.row}>
        <Text style={[styles.rowLabel, { color: theme.textSecondary }]}>{icon ? `${icon} ` : ''}{label}</Text>
        <View style={{ alignItems: 'flex-end' }}>
            <Text style={[styles.rowValue, { color: theme.textPrimary }]}>{value}</Text>
            {endTime && <Text style={[styles.rowEndTime, { color: theme.textSecondary }]}>→ {endTime}</Text>}
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1 },
    loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        padding: 24, alignItems: 'center', marginBottom: 12,
    },
    headerMarathiDate: { fontSize: 48, fontWeight: 'bold', color: '#fff' },
    headerEnglishDate: { fontSize: 16, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
    headerDayName: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
    festivalBadge: {
        marginTop: 10, backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20,
    },
    festivalBadgeText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
    section: {
        marginHorizontal: 12, marginBottom: 12, borderRadius: 12,
        borderWidth: 1, padding: 16,
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
    },
    sectionTitle: {
        fontSize: 17, fontWeight: 'bold', marginBottom: 10,
        borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 6,
    },
    row: {
        flexDirection: 'row', justifyContent: 'space-between',
        paddingVertical: 9, borderBottomWidth: 0.5, borderBottomColor: '#eee',
    },
    rowLabel: { fontSize: 14 },
    rowValue: { fontSize: 14, fontWeight: '600' },
    rowEndTime: { fontSize: 11, marginTop: 2 },
    listItem: {
        paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: '#eee',
    },
    listTitle: { fontSize: 15, fontWeight: '500' },
});
