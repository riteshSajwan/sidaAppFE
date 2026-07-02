import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useAppTheme } from 'src/common/context/AppTheme';
import { Role } from './RegistrationUtils';


const roles:Role[] = [
    {
        title: 'ARCHITECT/LICENCIATE',
        color: '#1E7D32',
        icon: '🏢',
        route: '/registrationArchitect',
    },
    {
        title: 'STRUCTURAL ENGINEER',
        color: '#F59E0B',
        icon: '📄',
        route: '/registrationEngineer',
    },
];

const RegistrationSelection = () => {
    const { theme } = useAppTheme();


    const handleClick = (route: Role['route']) => {
        router.push(route as any);
    };
    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: theme.colors.surfaceLow }}
            contentContainerStyle={{
                padding: theme.spacing.xl,
            }}
        >
            
            {/* Page Title */}
            <Text
                style={{
                    fontSize: 30,
                    fontWeight: '600',
                    marginBottom: theme.spacing.xl,
                    color: theme.colors.textHeading,
                }}
            >
                Building Permits
            </Text>

            {/* Cards */}
            <View
                style={{
                    flexDirection: 'row',
                    gap: theme.spacing.lg,
                    flexWrap: 'wrap',
                }}
            >
                {roles.map((role, index) => (
                    <View
                        key={index}
                        style={{
                            flex: 1,
                            minWidth: 280,
                            backgroundColor: '#fff',
                            borderRadius: theme.roundness.md,
                            padding: theme.spacing.xl,
                            borderLeftWidth: 4,
                            borderLeftColor: role.color,
                            shadowColor: '#000',
                            shadowOpacity: 0.1,
                            shadowRadius: 8,
                            elevation: 4,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <View>
                                <Text
                                    style={{
                                        fontSize: 20,
                                        fontWeight: '700',
                                        color: role.color,
                                        marginBottom: theme.spacing.md,
                                    }}
                                >
                                    {role.title}
                                </Text>

                                <Pressable
                                    style={{
                                        backgroundColor: role.color,
                                        paddingVertical: 10,
                                        paddingHorizontal: 24,
                                        borderRadius: theme.roundness.sm,
                                    }}
                                    onPress={() => handleClick(role.route)}
                                >
                                    <Text style={{ color: '#fff', fontWeight: '600' }}>
                                        Register
                                    </Text>
                                </Pressable>
                            </View>

                            <Text style={{ fontSize: 45, opacity: 0.2 }}>{role.icon}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

export default RegistrationSelection;