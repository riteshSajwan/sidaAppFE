import React from 'react';
import { Text, View } from 'react-native';
import { useAppTheme } from 'src/common/context/AppTheme';
import { Icon } from 'src/submodules/iconlibrary/src';
import { useDashboardStyle } from './DashboardStyle';

interface StatCard {
    label: string;
    value: number;
    trend: string;
    trendPositive: boolean;
    iconName: string;
    iconBg: string;
}
const DashboardCards = () => {

    const styles = useDashboardStyle();
    const { theme } = useAppTheme();
    // ─── Static data (replace with Redux selectors as needed) ─────────────────────

    const STAT_CARDS: StatCard[] = [
        { label: 'Total Applications', value: 48, trend: '+12% this month', trendPositive: true, iconName: 'page', iconBg: '#EEF2FF' },
        { label: 'Draft Applications', value: 7, trend: '+2 this month', trendPositive: true, iconName: 'edit', iconBg: '#FFF8E6' },
        { label: 'Submitted', value: 23, trend: '+5 this month', trendPositive: true, iconName: 'statsDownSquare', iconBg: '#E8F4FD' },
        { label: 'Approved', value: 14, trend: '+8% this month', trendPositive: true, iconName: 'tick', iconBg: '#E8F8EE' },
        { label: 'Objections Raised', value: 3, trend: '-1 this month', trendPositive: false, iconName: 'legal', iconBg: '#FFF3E0' },
        { label: 'Rejected', value: 1, trend: '0 this month', trendPositive: true, iconName: 'closeAlt', iconBg: '#FEEDED' },
    ];
    return (
        <View style={styles.statsRow}>
            {STAT_CARDS.map((card) => (
                <View key={card.label} style={styles.statCard}>
                    <View style={[styles.statIconWrap, { backgroundColor: card.iconBg }]}>
                        <Icon name={card.iconName as any} size={18} color={theme.colors.surfaceInverse} />
                    </View>
                    <Text style={styles.statValue}>{card.value}</Text>
                    <Text style={styles.statLabel}>{card.label}</Text>
                    <View style={styles.statTrend}>
                        <Icon
                            name={card.trendPositive ? 'chevronUp' : 'chevronDown'}
                            size={12}
                            color={card.trendPositive ? theme.colors.textSuccessDark : theme.colors.textErrorDark}
                        />
                        <Text
                            style={
                                card.trendPositive
                                    ? styles.statTrendTextPos
                                    : styles.statTrendTextNeg
                            }
                        >
                            {card.trend}
                        </Text>
                    </View>
                </View>
            ))}
        </View>
    )
}

export default DashboardCards