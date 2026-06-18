import React from 'react';
import { View } from 'react-native';
import { Switch } from 'react-native-paper';
import Typography from 'src/common/components/Typography/Typography';
import { useAppTheme } from 'src/common/context/AppTheme';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { useTranslation } from 'react-i18next';

const ThemeToggle = () => {
	const { t: TranslateMessage } = useTranslation();
	const { theme, mode, toggleTheme } = useAppTheme();
	const layout = useLayoutStyle();

	const isDark = mode === 'dark';

	return (
		<View
			style={[
				layout.flexDirectionRow,
				layout.alignItemsCenter,
				{
					marginTop: theme.spacing.xl,
					paddingHorizontal: theme.spacing.md,
					columnGap: theme.spacing.lg,
				},
			]}
		>
			<View style={[layout.flexDirectionRow, layout.alignItemsCenter, { columnGap: theme.spacing.sm }]}>
				<Typography variant="body" fontWeight="bold">
					{isDark
						? TranslateMessage('Admin.Delivery.App.Theme.Dark')
						: TranslateMessage('Admin.Delivery.App.Theme.Light')}
				</Typography>
			</View>
			<Switch
				value={isDark}
				onValueChange={toggleTheme}
				color={theme.colors.iconBase}
			/>
		</View>
	);
};

export default ThemeToggle;
