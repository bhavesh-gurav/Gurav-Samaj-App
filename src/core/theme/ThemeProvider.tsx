import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../presentation/store';
import { colors, ThemeColors } from './colors';

interface ThemeContextType {
    theme: ThemeColors;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: colors.light,
    isDark: false,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const storedThemeConfig = useSelector((state: RootState) => state.app.theme);

    const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

    useEffect(() => {
        if (storedThemeConfig === 'system') {
            setIsDark(systemColorScheme === 'dark');
        } else {
            setIsDark(storedThemeConfig === 'dark');
        }
    }, [storedThemeConfig, systemColorScheme]);

    const currentThemeStr = isDark ? 'dark' : 'light';
    const currentThemeColors = colors[currentThemeStr];

    return (
        <ThemeContext.Provider value={{ theme: currentThemeColors, isDark }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
