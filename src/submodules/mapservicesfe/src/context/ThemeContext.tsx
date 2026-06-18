import React, { createContext, useContext } from 'react';

export interface ITheme {
    primaryColor?: string;
    background?: string;
    fontFamily?: string;
    containerMaxWidth?: number;
}

const MapThemeContext = createContext<ITheme | undefined>(undefined);

const defaultTheme: ITheme = {
    containerMaxWidth: 300,
};

export const MapThemeProvider: React.FC<{
    theme: ITheme;
    children: React.ReactNode;
}> = ({ theme, children }) => {
    return <MapThemeContext.Provider value={{ ...defaultTheme, ...theme }}>{children}</MapThemeContext.Provider>;
};

export const useTheme = () => {
    const context = useContext(MapThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};