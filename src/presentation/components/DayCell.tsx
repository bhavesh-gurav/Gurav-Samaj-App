import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../core/theme/ThemeProvider';
import { CalendarCellData } from '../../domain/models/CalendarCellData';

interface DayCellProps {
    cell: CalendarCellData | null;
    cellHeight: number;
    onPress: (isoDate: string) => void;
}

const DayCellComponent = ({ cell, cellHeight, onPress }: DayCellProps) => {
    const { isDark } = useTheme();

    if (!cell) {
        return <View style={[styles.cellContainer, { height: cellHeight, backgroundColor: isDark ? '#121212' : '#f5f5f5', borderWidth: 0 }]} />;
    }

    const {
        isoDate, marathiDate, tithi, festivals, sunrise, sunset,
        isSunday, isToday, isHoliday, isEkadashi, isPurnima, isAmavasya,
        hasBirthday, hasEvent
    } = cell;

    // Color logic
    let bgColor = isDark ? '#1e1e1e' : '#ffffff';
    let borderColor = isDark ? '#333' : '#e0e0e0';
    let borderWidth = 0.5;

    if (isToday) {
        borderColor = '#FF6F00'; // saffron
        borderWidth = 2;
    }

    if (isHoliday) {
        bgColor = isDark ? '#5a1a1a' : '#ffcdd2'; // stronger red
    } else if (isSunday) {
        bgColor = isDark ? '#3b1f1f' : '#ffebee'; // light red
    } else if (isToday) {
        bgColor = isDark ? '#1b3a4b' : '#bbdefb'; // blueish for today if not holiday/sunday
    }

    // Tithi color logic
    let tithiColor = isDark ? '#888' : '#666';
    if (isEkadashi) tithiColor = '#4caf50'; // green
    else if (isPurnima) tithiColor = '#ffb300'; // yellow (amber)
    else if (isAmavasya) tithiColor = '#d32f2f'; // dark red

    // Text color logic
    let dateTextColor = isDark ? '#e0e0e0' : '#1a1a1a';
    if (isSunday || isHoliday) dateTextColor = '#d32f2f';

    const shortTithi = tithi ? tithi.split(' ')[0] : '';
    const displayFestival = festivals.join(' • ');

    return (
        <TouchableOpacity
            style={[
                styles.cellContainer,
                {
                    height: cellHeight,
                    backgroundColor: bgColor,
                    borderColor: borderColor,
                    borderWidth: borderWidth,
                },
                isToday && styles.todayShadow
            ]}
            onPress={() => onPress(isoDate)}
            activeOpacity={0.7}
        >
            {/* TOP SECTION */}
            <View style={styles.topSection}>
                <Text style={[styles.tithiText, { color: tithiColor }]} numberOfLines={1}>
                    {shortTithi}
                </Text>
                {!!displayFestival && (
                    <Text style={[styles.festivalText, { color: '#d32f2f' }]} numberOfLines={2} ellipsizeMode="tail">
                        {displayFestival}
                    </Text>
                )}
            </View>

            {/* CENTER SECTION */}
            <View style={styles.centerSection}>
                <Text style={[styles.bigDateText, { color: dateTextColor }, isToday && { fontWeight: '900' }]}>
                    {marathiDate}
                </Text>
            </View>

            {/* BOTTOM SECTION */}
            <View style={styles.bottomSection}>
                <Text style={[styles.sunText, { color: isDark ? '#aaa' : '#888' }]}>{sunrise}</Text>
                <Text style={[styles.sunText, { color: isDark ? '#aaa' : '#888' }]}>{sunset}</Text>
            </View>

            {/* ICONS */}
            {hasBirthday && <Text style={styles.birthdayIcon}>🎉</Text>}
            {hasEvent && <View style={styles.eventDot} />}
        </TouchableOpacity>
    );
};

export const DayCell = React.memo(DayCellComponent);

const styles = StyleSheet.create({
    cellContainer: {
        width: '14.28%', // 100/7
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
        paddingHorizontal: 1,
        borderBottomWidth: 0.5,
    },
    todayShadow: {
        shadowColor: '#FF6F00',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 1,
    },
    topSection: {
        alignItems: 'center',
        width: '100%',
        minHeight: 20, // changed to minHeight so it can grow if 2 lines of festivals
    },
    tithiText: {
        fontSize: 8,
        textAlign: 'center',
        fontWeight: '500',
    },
    festivalText: {
        fontSize: 7, // slightly smaller to fit combination
        textAlign: 'center',
        fontWeight: '700',
        lineHeight: 9,
    },
    centerSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bigDateText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    bottomSection: {
        alignItems: 'center',
        width: '100%',
    },
    sunText: {
        fontSize: 7,
        textAlign: 'center',
        lineHeight: 9,
    },
    birthdayIcon: {
        fontSize: 10,
        position: 'absolute',
        top: 2,
        right: 2,
    },
    eventDot: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: '#2196f3',
        position: 'absolute',
        bottom: 3,
        right: 3, // Changed from left to right to not overlap sun text as much, or just adjust pos
    },
});
