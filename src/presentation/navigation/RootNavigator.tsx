import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../../core/theme/ThemeProvider';
import { LoginScreen } from '../screens/LoginScreen';
import { CalendarScreen } from '../screens/CalendarScreen';
import { CommunityScreen } from '../screens/CommunityScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { DayDetailScreen } from '../screens/DayDetailScreen';
import { LanguageSelectScreen } from '../screens/LanguageSelectScreen';
import { AddEventScreen } from '../screens/AddEventScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CalendarDay } from '../store/slices/appSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useTranslation } from 'react-i18next';
import { syncDeviceLanguage } from '../../core/i18n/i18n';
import { onAuthChanged } from '../../data/firebase/authService';

type RootStackParamList = {
    LanguageSelect: undefined;
    Auth: undefined;
    Main: undefined;
    DayDetail: { dayData: CalendarDay };
    AddEvent: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// Full tabs for authenticated users
const AuthenticatedTabs = () => {
    const { theme } = useTheme();
    const { t } = useTranslation();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName: any = 'home';
                    if (route.name === 'Calendar') iconName = 'calendar-month';
                    else if (route.name === 'Community') iconName = 'account-group';
                    else if (route.name === 'Profile') iconName = 'account';
                    return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: theme.primary,
                tabBarInactiveTintColor: theme.textSecondary,
                tabBarStyle: { backgroundColor: theme.surface, borderTopColor: theme.border },
                headerStyle: { backgroundColor: theme.primary },
                headerTintColor: '#fff',
            })}
        >
            <Tab.Screen name="Calendar" component={CalendarScreen} options={{ tabBarLabel: t('navigation.calendar') }} />
            <Tab.Screen name="Community" component={CommunityScreen} options={{ tabBarLabel: t('navigation.community') }} />
            <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: t('navigation.profile') }} />
        </Tab.Navigator>
    );
};

// Limited tabs for guest users (no Community)
const GuestTabs = () => {
    const { theme } = useTheme();
    const { t } = useTranslation();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName: any = 'home';
                    if (route.name === 'Calendar') iconName = 'calendar-month';
                    else if (route.name === 'Profile') iconName = 'account';
                    return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: theme.primary,
                tabBarInactiveTintColor: theme.textSecondary,
                tabBarStyle: { backgroundColor: theme.surface, borderTopColor: theme.border },
                headerStyle: { backgroundColor: theme.primary },
                headerTintColor: '#fff',
            })}
        >
            <Tab.Screen name="Calendar" component={CalendarScreen} options={{ tabBarLabel: t('navigation.calendar') }} />
            <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: t('navigation.profile') }} />
        </Tab.Navigator>
    );
};

export const RootNavigator = () => {
    const { t, i18n } = useTranslation();

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);
    const selectedLanguage = useSelector((state: RootState) => state.app.language);
    const isGuest = useSelector((state: RootState) => state.app.isGuest);

    useEffect(() => {
        const unsubscribe = onAuthChanged((user) => {
            setIsAuthenticated(!!user);
            setAuthChecked(true);
            console.log('[Nav] Auth state:', user ? user.uid : 'signed out');
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (selectedLanguage) {
            i18n.changeLanguage(selectedLanguage);
        } else {
            syncDeviceLanguage();
        }
    }, [selectedLanguage, i18n]);

    if (!authChecked) return null;

    const showApp = isAuthenticated || isGuest;

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!selectedLanguage ? (
                    <Stack.Screen name="LanguageSelect" component={LanguageSelectScreen} />
                ) : showApp ? (
                    <Stack.Group>
                        <Stack.Screen
                            name="Main"
                            component={isAuthenticated ? AuthenticatedTabs : GuestTabs}
                        />
                        <Stack.Screen
                            name="DayDetail"
                            component={DayDetailScreen}
                            options={{ headerShown: true, title: t('dayDetail.panchangDetails'), headerStyle: { backgroundColor: '#E65100' }, headerTintColor: '#fff' }}
                        />
                        {isAuthenticated && (
                            <Stack.Screen
                                name="AddEvent"
                                component={AddEventScreen}
                                options={{ headerShown: true, title: t('event.title'), headerStyle: { backgroundColor: '#E65100' }, headerTintColor: '#fff' }}
                            />
                        )}
                    </Stack.Group>
                ) : (
                    <Stack.Screen name="Auth" component={LoginScreen} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};
