import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../core/theme/ThemeProvider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect, NavigationProp } from '@react-navigation/native';
import { getTodaysBirthdays, getUpcomingEvents, UserProfile, CommunityEvent } from '../../data/firebase/firestoreService';

export const CommunityScreen = () => {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const navigation = useNavigation<NavigationProp<any>>();

    const [birthdays, setBirthdays] = useState<UserProfile[]>([]);
    const [events, setEvents] = useState<CommunityEvent[]>([]);
    const [loadingBirthdays, setLoadingBirthdays] = useState(true);
    const [loadingEvents, setLoadingEvents] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchAllData = useCallback(async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);

        try {
            const [bdays, evts] = await Promise.all([
                getTodaysBirthdays(),
                getUpcomingEvents(),
            ]);
            setBirthdays(bdays);
            setEvents(evts);
        } catch (e) {
            console.warn('[Community] Fetch error:', e);
        } finally {
            setLoadingBirthdays(false);
            setLoadingEvents(false);
            if (isRefresh) setRefreshing(false);
        }
    }, []);

    // Fetch on screen focus (handles return from AddEvent)
    useFocusEffect(
        useCallback(() => {
            fetchAllData();
        }, [fetchAllData])
    );

    const onRefresh = useCallback(() => {
        fetchAllData(true);
    }, [fetchAllData]);

    const calculateAge = (birthDate: string): number => {
        const bd = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - bd.getFullYear();
        const monthDiff = today.getMonth() - bd.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < bd.getDate())) {
            age--;
        }
        return age;
    };

    const renderBirthdayItem = ({ item }: { item: UserProfile }) => (
        <View style={[styles.birthdayItem, { borderBottomColor: theme.border }]}>
            <View style={[styles.birthdayIconContainer, { backgroundColor: theme.background }]}>
                <MaterialCommunityIcons name="cake-variant" size={24} color={theme.primary} />
            </View>
            <View>
                <Text style={[styles.birthdayName, { color: theme.textPrimary }]}>{item.name}</Text>
                <Text style={{ color: theme.textSecondary, fontSize: 12 }}>
                    {t('community.yearsOld', { age: calculateAge(item.birthDate) })}
                </Text>
            </View>
        </View>
    );

    const renderEventItem = ({ item }: { item: CommunityEvent }) => (
        <View style={[styles.eventItem, { borderBottomColor: theme.border }]}>
            <View style={{ flex: 1 }}>
                <Text style={[styles.eventName, { color: theme.textPrimary }]}>{item.eventName}</Text>
                <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
                    📅 {new Date(item.eventDate).toLocaleDateString()}
                </Text>
                <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
                    📍 {item.address}, {item.city}
                </Text>
                <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 4 }}>
                    {t('community.createdBy', { name: item.createdByName })}
                </Text>
            </View>
        </View>
    );

    const isLoading = loadingBirthdays && loadingEvents;

    if (isLoading && !refreshing) {
        return (
            <View style={[styles.container, styles.centered, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    return (
        <FlatList
            style={[styles.container, { backgroundColor: theme.background }]}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={[theme.primary]}
                    tintColor={theme.primary}
                />
            }
            ListHeaderComponent={
                <>
                    <Text style={[styles.title, { color: theme.primary }]}>{t('navigation.community')}</Text>

                    {/* Today's Birthdays */}
                    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border, marginBottom: 20 }]}>
                        <Text style={[styles.sectionTitle, { color: theme.primary }]}>🎂 {t('community.todaysBirthdays')}</Text>
                        {birthdays.length === 0 ? (
                            <Text style={{ color: theme.textSecondary, paddingBottom: 10 }}>{t('community.noBirthdays')}</Text>
                        ) : (
                            <FlatList
                                data={birthdays}
                                keyExtractor={(it) => it.id}
                                renderItem={renderBirthdayItem}
                                scrollEnabled={false}
                            />
                        )}
                    </View>

                    {/* Upcoming Events Header + Add Button */}
                    <View style={styles.sectionHeaderRow}>
                        <Text style={[styles.sectionTitle, { color: theme.primary }]}>📋 {t('community.upcomingEvents')}</Text>
                        <TouchableOpacity
                            style={[styles.addButton, { backgroundColor: theme.primary }]}
                            onPress={() => navigation.navigate('AddEvent')}
                        >
                            <MaterialCommunityIcons name="plus" size={16} color="#fff" />
                            <Text style={styles.addButtonText}>{t('community.addEvent')}</Text>
                        </TouchableOpacity>
                    </View>

                    {events.length === 0 && !loadingEvents ? (
                        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                            <Text style={{ color: theme.textSecondary, padding: 10 }}>{t('community.noEvents')}</Text>
                        </View>
                    ) : null}
                </>
            }
            data={events}
            keyExtractor={(it) => it.id}
            renderItem={({ item }) => (
                <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border, marginBottom: 12 }]}>
                    {renderEventItem({ item })}
                </View>
            )}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 40,
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    card: {
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    birthdayItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
    },
    birthdayIconContainer: {
        marginRight: 15,
        padding: 10,
        borderRadius: 20,
    },
    birthdayName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    eventItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    eventName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
});
