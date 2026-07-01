import React from 'react'
import PermissionGuard from 'src/common/components/PermissionGuard/PermissionGuard'
import { MenuType } from 'src/common/utils/permissionUtils'
// import BookingHistoryContainer from 'src/components/BookingHistory/BookingHistory'

const BookingHistory = () => {
	return (
		<PermissionGuard menuName={MenuType.BOOKING}>
			{/* <BookingHistoryContainer /> */}
			Test
		</PermissionGuard>
	)
}

export default BookingHistory