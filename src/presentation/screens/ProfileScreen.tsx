import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState } from '../store';
import { setTheme, setLanguage, setUserBirthDate, setUserName, clearGuestMode } from '../store/slices/appSlice';
import { useTheme } from '../../core/theme/ThemeProvider';
import DateTimePicker from '@react-native-community/datetimepicker';
import { saveUserProfile } from '../../data/firebase/firestoreService';
import { getCurrentUser } from '../../data/firebase/authService';

export const ProfileScreen = () => {
    const dispatch = useDispatch();
    const { theme } = useTheme();
    const { t } = useTranslation();
    const currentTheme = useSelector((state: RootState) => state.app.theme);
    const currentLanguage = useSelector((state: RootState) => state.app.language);
    const userName = useSelector((state: RootState) => state.app.userName);
    const userBirthDate = useSelector((state: RootState) => state.app.userBirthDate);
    const isGuest = useSelector((state: RootState) => state.app.isGuest);

    const [nameInput, setNameInput] = React.useState(userName || '');
    const [showDatePicker, setShowDatePicker] = React.useState(false);
    const [saving, setSaving] = React.useState(false);

    const isDarkMode = currentTheme === 'dark';

    const toggleTheme = () => {
        dispatch(setTheme(isDarkMode ? 'light' : 'dark'));
    };

    const triggerLanguageSelect = () => {
        dispatch(setLanguage(null));
    };

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            dispatch(setUserBirthDate(selectedDate.toISOString()));
        }
    };

    const handleSaveProfile = async () => {
        const trimmedName = nameInput.trim();
        if (!trimmedName) {
            Alert.alert('', t('profile.nameRequired'));
            return;
        }
        if (!userBirthDate) {
            Alert.alert('', t('profile.dateRequired'));
            return;
        }

        setSaving(true);
        try {
            // User is already authenticated via LoginScreen
            const user = getCurrentUser();
            if (!user) {
                Alert.alert('Error', 'Not authenticated. Please restart the app.');
                return;
            }
            console.log('[Profile] Saving with auth UID:', user.uid);

            dispatch(setUserName(trimmedName));
            dispatch(setUserBirthDate(userBirthDate));
            await saveUserProfile(user.uid, trimmedName, userBirthDate);
            Alert.alert('', t('profile.saved'));
        } catch (e: any) {
            console.error('[Profile] Firestore save error:', e?.message || e);
            Alert.alert('Error', e?.message || 'Failed to save profile');
        } finally {
            setSaving(false);
        }
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.title, { color: theme.primary }]}>{t('profile.settings')}</Text>

            <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                {/* Dark Mode Toggle */}
                <View style={[styles.settingRow, { borderBottomColor: theme.border }]}>
                    <Text style={[styles.settingText, { color: theme.textPrimary }]}>{t('profile.darkMode')}</Text>
                    <Switch
                        value={isDarkMode}
                        onValueChange={toggleTheme}
                        trackColor={{ false: theme.border, true: theme.secondary }}
                        thumbColor={isDarkMode ? '#fff' : '#f4f3f4'}
                    />
                </View>

                {/* Change Language Action */}
                <TouchableOpacity style={styles.settingRow} onPress={triggerLanguageSelect}>
                    <Text style={[styles.settingText, { color: theme.textPrimary }]}>{t('profile.changeLanguage')}</Text>
                    <Text style={{ color: theme.textSecondary, fontSize: 16 }}>{currentLanguage === 'mr' ? 'मराठी' : 'English'} ›</Text>
                </TouchableOpacity>
            </View>

            {/* Guest Banner */}
            {isGuest && (
                <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.primary, marginTop: 20, alignItems: 'center' as const }]}>
                    <Text style={{ color: theme.textSecondary, fontSize: 16, textAlign: 'center', paddingTop: 15, paddingBottom: 10 }}>
                        {t('profile.guestMessage')}
                    </Text>
                    <TouchableOpacity
                        style={[styles.saveButton, { backgroundColor: theme.primary }]}
                        onPress={() => dispatch(clearGuestMode())}
                    >
                        <Text style={styles.saveButtonText}>{t('profile.loginPrompt')}</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Personal Info — only for authenticated users */}
            {!isGuest && (
                <>
                    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border, marginTop: 20 }]}>
                        <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>
                            {t('profile.personalInfo')}
                        </Text>

                        {/* Full Name */}
                        <Text style={[styles.label, { color: theme.textSecondary }]}>{t('profile.fullName')}</Text>
                        <TextInput
                            style={[styles.input, { color: theme.textPrimary, borderColor: theme.border, backgroundColor: theme.background }]}
                            value={nameInput}
                            onChangeText={setNameInput}
                            placeholder={t('profile.enterName')}
                            placeholderTextColor={theme.textSecondary}
                        />

                        {/* Birth Date */}
                        <TouchableOpacity style={styles.settingRow} onPress={() => setShowDatePicker(true)}>
                            <Text style={[styles.settingText, { color: theme.textPrimary }]}>{t('profile.birthDate')}</Text>
                            <Text style={{ color: theme.textSecondary, fontSize: 16 }}>
                                {userBirthDate ? new Date(userBirthDate).toLocaleDateString() : t('profile.selectDate')}
                            </Text>
                        </TouchableOpacity>

                        {/* Save Button */}
                        <TouchableOpacity
                            style={[styles.saveButton, { backgroundColor: theme.primary, opacity: saving ? 0.6 : 1 }]}
                            onPress={handleSaveProfile}
                            disabled={saving}
                        >
                            <Text style={styles.saveButtonText}>{t('profile.save')}</Text>
                        </TouchableOpacity>
                    </View>

                    {showDatePicker && (
                        <DateTimePicker
                            value={userBirthDate ? new Date(userBirthDate) : new Date()}
                            mode="date"
                            display="default"
                            maximumDate={new Date()}
                            onChange={onDateChange}
                        />
                    )}
                </>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    card: {
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 20,
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingTop: 15,
        paddingBottom: 5,
    },
    label: {
        fontSize: 14,
        marginTop: 15,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    settingText: {
        fontSize: 18,
    },
    saveButton: {
        marginVertical: 20,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
