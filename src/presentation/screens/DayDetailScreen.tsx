import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../core/theme/ThemeProvider';
import { CalendarDay } from '../store/slices/appSlice';
import { translatePanchangField } from '../../core/utils/panchangTranslations';

type ParamList = {
    DayDetail: {
        dayData: CalendarDay;
    };
};

export const DayDetailScreen = () => {
    const route = useRoute<RouteProp<ParamList, 'DayDetail'>>();
    const { theme } = useTheme();
    const { t, i18n } = useTranslation();
    const { dayData } = route.params;

    const dateObject = new Date(dayData.dateObj);
    const lng = i18n.language;

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header Date Card */}
            <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Text style={[styles.title, { color: theme.primary }]}>
                    {dateObject.toDateString()}
                </Text>

                {dayData.festivalMarker && (
                    <Text style={{ color: theme.secondary, fontWeight: 'bold', marginBottom: 10, fontSize: 16 }}>
                        {t('dayDetail.festival')}: {translatePanchangField(dayData.festivalMarker.toUpperCase(), lng)}
                    </Text>
                )}
            </View>

            {/* Core Panchang Card */}
            <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{t('dayDetail.panchangDetails')}</Text>

                <PanchangRow label={t('dayDetail.monthPaksha')} value={`${translatePanchangField(dayData.hinduMonth, lng)}, ${translatePanchangField(dayData.paksha, lng)}`} color={theme.textPrimary} secondaryColor={theme.textSecondary} />
                <PanchangRow label={t('dayDetail.tithi')} value={translatePanchangField(dayData.tithi, lng)} color={theme.textPrimary} secondaryColor={theme.textSecondary} />
                <PanchangRow label={t('dayDetail.nakshatra')} value={translatePanchangField(dayData.nakshatra, lng)} color={theme.textPrimary} secondaryColor={theme.textSecondary} />
            </View>

            {/* Sun Timing Card */}
            <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{t('dayDetail.sunriseSunset')}</Text>
                <PanchangRow label={t('dayDetail.sunrise')} value={dayData.sunrise} color={theme.textPrimary} secondaryColor={theme.textSecondary} />
                <PanchangRow label={t('dayDetail.sunset')} value={dayData.sunset} color={theme.textPrimary} secondaryColor={theme.textSecondary} />
            </View>

            {/* Muhurat Card */}
            <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{t('dayDetail.muhurat')}</Text>
                <PanchangRow label={t('dayDetail.abhijitMuhurat')} value={dayData.abhijitMuhurat} color={theme.success} secondaryColor={theme.textSecondary} />
                <PanchangRow label={t('dayDetail.rahuKaal')} value={dayData.rahuKaal} color={theme.error} secondaryColor={theme.textSecondary} />
            </View>

        </ScrollView>
    );
};

const PanchangRow = ({ label, value, color, secondaryColor }: { label: string, value: string, color: string, secondaryColor: string }) => (
    <View style={styles.row}>
        <Text style={{ color: secondaryColor }}>{label}</Text>
        <Text style={{ color: color, fontWeight: 'bold' }}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    card: {
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 5,
    },
    dataContainer: {
        marginTop: 5,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
    }
});
