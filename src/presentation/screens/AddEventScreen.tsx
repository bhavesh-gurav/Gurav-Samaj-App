import React from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    Alert, ScrollView, ActivityIndicator, Platform
} from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../core/theme/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createEvent } from '../../data/firebase/firestoreService';
import { RootState } from '../store';
import { getCurrentUser } from '../../data/firebase/authService';

export const AddEventScreen = () => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const userName = useSelector((state: RootState) => state.app.userName);

    const [eventName, setEventName] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [city, setCity] = React.useState('');
    const [eventDate, setEventDate] = React.useState<Date | null>(null);
    const [startTime, setStartTime] = React.useState('');
    const [contactNumber, setContactNumber] = React.useState('');
    const [showDatePicker, setShowDatePicker] = React.useState(false);
    const [submitting, setSubmitting] = React.useState(false);

    const onDateChange = (_event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setEventDate(selectedDate);
        }
    };

    const handleSubmit = async () => {
        if (!eventName.trim()) {
            Alert.alert('', t('event.nameRequired'));
            return;
        }
        if (!address.trim()) {
            Alert.alert('', t('event.addressRequired'));
            return;
        }
        if (!city.trim()) {
            Alert.alert('', t('event.cityRequired'));
            return;
        }
        if (!eventDate) {
            Alert.alert('', t('event.dateRequired'));
            return;
        }

        setSubmitting(true);
        try {
            // User is already authenticated via LoginScreen
            const user = getCurrentUser();
            if (!user) {
                Alert.alert('Error', 'Not authenticated. Please restart the app.');
                return;
            }
            console.log('[Event] Creating with auth UID:', user.uid);

            await createEvent({
                eventName: eventName.trim(),
                description: description.trim(),
                address: address.trim(),
                city: city.trim(),
                eventDate: eventDate.toISOString(),
                startTime: startTime.trim(),
                contactNumber: contactNumber.trim(),
                createdByUserId: user.uid,
                createdByName: userName || 'Unknown',
            });
            Alert.alert('', t('event.success'), [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (e: any) {
            console.error('[Event] Firestore error:', e?.message || e);
            Alert.alert('Error', e?.message || 'Failed to create event');
        } finally {
            setSubmitting(false);
        }
    };

    const renderInput = (
        label: string,
        value: string,
        onChangeText: (s: string) => void,
        multiline = false,
        keyboardType: 'default' | 'phone-pad' = 'default'
    ) => (
        <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
            <TextInput
                style={[
                    styles.input,
                    multiline && styles.multilineInput,
                    { color: theme.textPrimary, borderColor: theme.border, backgroundColor: theme.background }
                ]}
                value={value}
                onChangeText={onChangeText}
                multiline={multiline}
                keyboardType={keyboardType}
                placeholderTextColor={theme.textSecondary}
            />
        </View>
    );

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.title, { color: theme.primary }]}>{t('event.title')}</Text>

            <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                {renderInput(t('event.eventName'), eventName, setEventName)}
                {renderInput(t('event.description'), description, setDescription, true)}
                {renderInput(t('event.address'), address, setAddress)}
                {renderInput(t('event.city'), city, setCity)}

                {/* Date Picker */}
                <View style={styles.fieldContainer}>
                    <Text style={[styles.label, { color: theme.textSecondary }]}>{t('event.date')}</Text>
                    <TouchableOpacity
                        style={[styles.input, { borderColor: theme.border, backgroundColor: theme.background, justifyContent: 'center' }]}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Text style={{ color: eventDate ? theme.textPrimary : theme.textSecondary, fontSize: 16 }}>
                            {eventDate ? eventDate.toLocaleDateString() : t('profile.selectDate')}
                        </Text>
                    </TouchableOpacity>
                </View>

                {renderInput(t('event.startTime'), startTime, setStartTime)}
                {renderInput(t('event.contactNumber'), contactNumber, setContactNumber, false, 'phone-pad')}

                <TouchableOpacity
                    style={[styles.submitButton, { backgroundColor: theme.primary, opacity: submitting ? 0.6 : 1 }]}
                    onPress={handleSubmit}
                    disabled={submitting}
                >
                    {submitting ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.submitButtonText}>{t('event.submit')}</Text>
                    )}
                </TouchableOpacity>
            </View>

            {showDatePicker && (
                <DateTimePicker
                    value={eventDate || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    minimumDate={new Date()}
                    onChange={onDateChange}
                />
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
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    card: {
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    fieldContainer: {
        marginTop: 15,
    },
    label: {
        fontSize: 14,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    multilineInput: {
        height: 80,
        textAlignVertical: 'top',
    },
    submitButton: {
        marginVertical: 20,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
