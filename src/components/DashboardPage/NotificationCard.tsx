import { router } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Typography from 'src/common/components/Typography/Typography';
import { useAppTheme } from 'src/common/context/AppTheme';
import { Routes } from 'src/routing/paths';
import { useDashboardStyle } from './DashboardStyle';
// import { Pressable, ScrollView, Text, View } from 'react-native';
import { Icon } from 'src/submodules/iconlibrary/src';


interface NotifItem {
    id: string;
    title: string;
    sub: string;
    time: string;
    iconName: string;
    iconBg: string;
    iconColor: string;
}
const NOTIFICATIONS: NotifItem[] = [
    {
        id: '1',
        title: 'Application Approved',
        sub: 'APP-2024-0042 — Occupancy Cert',
        time: '2h ago',
        iconName: 'tickCircle',
        iconBg: '#E8F8EE',
        iconColor: '#0C9B25',
    },
    {
        id: '2',
        title: 'Document Required',
        sub: 'APP-2024-0038 — Upload Structure',
        time: '5h ago',
        iconName: 'document',
        iconBg: '#FFF8E6',
        iconColor: '#FF6100',
    },
    {
        id: '3',
        title: 'Fee Payment Due',
        sub: 'APP-2024-0045 — ₹4,250 pending',
        time: '1d ago',
        iconName: 'coin',
        iconBg: '#EEF2FF',
        iconColor: '#032B8E',
    },
    {
        id: '4',
        title: 'Inspection Scheduled',
        sub: 'APP-2024-0045 — Site visit on 15 J',
        time: '1d ago',
        iconName: 'calendar',
        iconBg: '#E8F4FD',
        iconColor: '#0369A1',
    },
];

const NotificationCard = () => {

    const styles = useDashboardStyle();
    const { theme } = useAppTheme();

    return (

        <View style={styles.notifCard}>
            <View style={styles.notifHeader}>
                <Typography variant="subTitle" fontWeight="semiBold">
                    Notifications
                </Typography>
                <Pressable
                    onPress={() => router.push(Routes.TICKET as any)}
                    accessibilityRole="link"
                >
                    <Text style={styles.viewAllText}>View all →</Text>
                </Pressable>
            </View>

            {NOTIFICATIONS.map((n, index) => (
                <View
                    key={n.id}
                    style={[
                        styles.notifItem,
                        index === NOTIFICATIONS.length - 1 && { borderBottomWidth: 0 },
                    ]}
                >
                    <View style={[styles.notifIconWrap, { backgroundColor: n.iconBg }]}>
                        <Icon name={n.iconName as any} size={16} color={n.iconColor} />
                    </View>
                    <View style={styles.notifContent}>
                        <Text style={styles.notifTitle}>{n.title}</Text>
                        <Text style={styles.notifSub}>{n.sub}</Text>
                        <Text style={styles.notifTime}>{n.time}</Text>
                    </View>
                </View>
            ))}
        </View>
    )
}

export default NotificationCard