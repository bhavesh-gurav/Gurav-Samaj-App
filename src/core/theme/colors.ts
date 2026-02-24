export const colors = {
    light: {
        background: '#FFFFFF',
        surface: '#F8F9FA',
        primary: '#E65100', // Saffron/Orange deeply associated with Hinduism
        primaryLight: '#FF833A',
        secondary: '#FFB300', // Yellow/Gold
        textPrimary: '#212121',
        textSecondary: '#757575',
        border: '#E0E0E0',
        error: '#D32F2F',
        success: '#388E3C',
        warning: '#F57C00',
        card: '#FFFFFF',
        icon: '#E65100',
    },
    dark: {
        background: '#121212',
        surface: '#1E1E1E',
        primary: '#FF9800', // Lighter saffron for dark mode visibility
        primaryLight: '#FFB74D',
        secondary: '#FFCA28',
        textPrimary: '#FFFFFF',
        textSecondary: '#B0BEC5',
        border: '#333333',
        error: '#EF5350',
        success: '#66BB6A',
        warning: '#FFA726',
        card: '#2C2C2C',
        icon: '#FF9800',
    }
};

export type ThemeColors = typeof colors.light;
