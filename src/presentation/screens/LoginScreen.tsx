import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    Alert, ScrollView, ActivityIndicator
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../core/theme/ThemeProvider';
import DateTimePicker from '@react-native-community/datetimepicker';
import { loginWithMobile } from '../../data/firebase/authService';
import { saveUserProfile } from '../../data/firebase/firestoreService';
import { setUserName, setUserBirthDate, setGuestMode, clearGuestMode } from '../store/slices/appSlice';

export const LoginScreen = () => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [mobile, setMobile] = useState('');
    const [name, setName] = useState('');
    const [birthDate, setBirthDate] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [loading, setLoading] = useState(false);

    const onDateChange = (_event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setBirthDate(selectedDate);
        }
    };

    const handleLogin = async () => {
        // Validation
        const trimmedMobile = mobile.trim();
        const trimmedName = name.trim();

        if (!/^\d{10}$/.test(trimmedMobile)) {
            Alert.alert('', t('login.mobileInvalid'));
            return;
        }
        if (!trimmedName) {
            Alert.alert('', t('login.nameRequired'));
            return;
        }
        if (!birthDate) {
            Alert.alert('', t('login.dateRequired'));
            return;
        }

        setLoading(true);
        try {
            const user = await loginWithMobile(trimmedMobile);
            console.log('[Login] Authenticated UID:', user.uid);

            const birthDateISO = birthDate.toISOString();
            await saveUserProfile(user.uid, trimmedMobile, trimmedName, birthDateISO);
            dispatch(setUserName(trimmedName));
            dispatch(setUserBirthDate(birthDateISO));
            dispatch(clearGuestMode());

            console.log('[Login] Profile saved successfully');
        } catch (e: any) {
            console.error('[Login] Error:', e?.code, e?.message);
            Alert.alert('Error', e?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSkip = () => {
        dispatch(setGuestMode());
    };

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.background }]}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled"
        >
            <Text style={[styles.title, { color: theme.primary }]}>🙏 {t('login.title')}</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{t('login.subtitle')}</Text>

            <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                {/* Mobile Number */}
                <Text style={[styles.label, { color: theme.textSecondary }]}>{t('login.mobile')}</Text>
                <TextInput
                    style={[styles.input, { color: theme.textPrimary, borderColor: theme.border, backgroundColor: theme.background }]}
                    placeholderTextColor={theme.textSecondary}
                    placeholder="9876543210"
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={mobile}
                    onChangeText={setMobile}
                />

                {/* Full Name */}
                <Text style={[styles.label, { color: theme.textSecondary }]}>{t('login.name')}</Text>
                <TextInput
                    style={[styles.input, { color: theme.textPrimary, borderColor: theme.border, backgroundColor: theme.background }]}
                    placeholderTextColor={theme.textSecondary}
                    placeholder={t('login.namePlaceholder')}
                    value={name}
                    onChangeText={setName}
                />

                {/* Birthdate */}
                <Text style={[styles.label, { color: theme.textSecondary }]}>{t('login.birthDate')}</Text>
                <TouchableOpacity
                    style={[styles.input, { borderColor: theme.border, backgroundColor: theme.background, justifyContent: 'center' }]}
                    onPress={() => setShowDatePicker(true)}
                >
                    <Text style={{ color: birthDate ? theme.textPrimary : theme.textSecondary, fontSize: 16 }}>
                        {birthDate ? birthDate.toLocaleDateString() : t('login.selectDate')}
                    </Text>
                </TouchableOpacity>

                {/* Submit */}
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.primary, opacity: loading ? 0.6 : 1 }]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>{t('login.submit')}</Text>
                    )}
                </TouchableOpacity>

                {/* Skip Button */}
                <TouchableOpacity
                    style={[styles.skipButton, { borderColor: theme.border }]}
                    onPress={handleSkip}
                >
                    <Text style={[styles.skipButtonText, { color: theme.textSecondary }]}>{t('login.skip')}</Text>
                </TouchableOpacity>
            </View>

            {showDatePicker && (
                <DateTimePicker
                    value={birthDate || new Date()}
                    mode="date"
                    display="default"
                    maximumDate={new Date()}
                    onChange={onDateChange}
                />
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    card: {
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        marginTop: 30,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
    },
    label: {
        fontSize: 14,
        marginBottom: 5,
        marginTop: 12,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
    },
    button: {
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 25,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    skipButton: {
        height: 50,
        borderRadius: 8,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
    },
    skipButtonText: {
        fontSize: 16,
    },
});
