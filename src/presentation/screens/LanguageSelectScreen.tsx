import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { setLanguage } from '../store/slices/appSlice';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../core/theme/ThemeProvider';

export const LanguageSelectScreen = () => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const dispatch = useDispatch();

    const [selectedLanguage, setSelectedLang] = React.useState<'en' | 'mr' | null>(null);

    const onSelect = (lng: 'en' | 'mr') => {
        setSelectedLang(lng);
        i18n.changeLanguage(lng);
    };

    const handleContinue = () => {
        if (!selectedLanguage) {
            Alert.alert(t('languageSelect.title'), t('languageSelect.selectAlert'));
            return;
        }
        dispatch(setLanguage(selectedLanguage));
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.title, { color: theme.primary }]}>{t('languageSelect.title')}</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{t('languageSelect.subtitle')}</Text>

            <View style={styles.card}>
                <TouchableOpacity
                    style={[styles.optionRow, selectedLanguage === 'en' && { borderColor: theme.primary, borderWidth: 2 }]}
                    onPress={() => onSelect('en')}
                >
                    <Text style={[styles.optionText, { color: theme.textPrimary }]}>{t('languageSelect.english')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.optionRow, selectedLanguage === 'mr' && { borderColor: theme.primary, borderWidth: 2 }]}
                    onPress={() => onSelect('mr')}
                >
                    <Text style={[styles.optionText, { color: theme.textPrimary }]}>{t('languageSelect.marathi')}</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={[styles.submitButton, { backgroundColor: theme.primary }]} onPress={handleContinue}>
                <Text style={styles.submitText}>{t('languageSelect.continue')}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 40,
    },
    card: {
        width: '100%',
        marginBottom: 40,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
        borderRadius: 12,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
    },
    optionText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    submitButton: {
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    }
});
