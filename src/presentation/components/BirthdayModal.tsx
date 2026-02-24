import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, Animated, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setLastBirthdayShownDate } from '../store/slices/appSlice';
import { useTheme } from '../../core/theme/ThemeProvider';

export const BirthdayModal = () => {
    const { theme } = useTheme();
    const dispatch = useDispatch();

    const userBirthDate = useSelector((state: RootState) => state.app.userBirthDate);
    const lastBirthdayShownDate = useSelector((state: RootState) => state.app.lastBirthdayShownDate);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.5)).current;

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

    let isBirthdayToday = false;
    if (userBirthDate) {
        const bd = new Date(userBirthDate);
        if (bd.getDate() === today.getDate() && bd.getMonth() === today.getMonth()) {
            isBirthdayToday = true;
        }
    }

    const shouldShow = isBirthdayToday && lastBirthdayShownDate !== todayStr;

    useEffect(() => {
        if (shouldShow) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 4,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [shouldShow, fadeAnim, scaleAnim]);

    const handleClose = () => {
        dispatch(setLastBirthdayShownDate(todayStr));
    };

    if (!shouldShow) return null;

    return (
        <Modal transparent animationType="none" visible={shouldShow} onRequestClose={handleClose}>
            <View style={styles.overlay}>
                <Animated.View style={[
                    styles.modalContainer,
                    {
                        backgroundColor: theme.surface,
                        borderColor: theme.primary,
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }]
                    }
                ]}>
                    <Text style={styles.emoji}>🎂</Text>
                    <Text style={[styles.title, { color: theme.primary }]}>Happy Birthday!</Text>
                    <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                        Wishing you a fantastic day filled with joy and blessings!
                    </Text>

                    <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={handleClose}>
                        <Text style={styles.buttonText}>Thank You!</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '85%',
        padding: 30,
        borderRadius: 20,
        borderWidth: 2,
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    emoji: {
        fontSize: 60,
        marginBottom: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 24,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
