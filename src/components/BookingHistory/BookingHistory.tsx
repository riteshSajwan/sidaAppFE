import React, { useState } from 'react'
import { View, Text, Pressable, Image, ImageStyle } from 'react-native'
import { useLayoutStyle } from 'src/common/assets/styles/layout'
import Typography from 'src/common/components/Typography/Typography'
import { useAppTheme } from 'src/common/context/AppTheme'
import { useDashboardStyle } from 'src/components/DashboardPage/DashboardStyle'
import { useManageStyle } from 'src/components/RequestManagement/Style'
import RidesBookingPage from 'src/components/BookingHistory/Tabs/Rides/Rides'
import ParcelBookingPage from 'src/components/BookingHistory/Tabs/Parcel/Parcel'


const BookingHistoryContainer = () => {
	const layout = useLayoutStyle();
	const DashboardStyle = useDashboardStyle();
	const { theme } = useAppTheme();
	const ManageStyle = useManageStyle();
	const [activeTab, setActiveTab] = useState<'rides' | 'parcel'>('rides');
	function renderHeadingTabs() {
		return (
			<View style={[DashboardStyle.tabFlexRow, layout.mb10]}>
				<Pressable onPress={() => setActiveTab('rides')}>
					<Text
						style={[
							DashboardStyle.segmentedButton,
							activeTab === 'rides' && DashboardStyle.activeTab,
						]}
					>
						Rides
					</Text>
				</Pressable>
				<Pressable onPress={() => setActiveTab('parcel')}>
					<Text
						style={[
							DashboardStyle.segmentedButton,
							activeTab === 'parcel' && DashboardStyle.activeTab,
						]}
					>
						Parcel
					</Text>
				</Pressable>
			</View>
		);
	}
	return (
		<View style={[layout.container, layout.flexCol, layout.paddinghor17, layout.paddingTop26]}>
			{/* {renderHeadingTabs()} */}
			{activeTab === 'rides' ? <RidesBookingPage /> : <ParcelBookingPage />}
		</View>
	)
}

export default BookingHistoryContainer