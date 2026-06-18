import React from 'react'
import PermissionGuard from 'src/common/components/PermissionGuard/PermissionGuard'
import { MenuType } from 'src/common/utils/permissionUtils'
import TripDetailsContainer from 'src/components/TripDetails/TripDetails'

const TripDetails = () => {
	return (
		<PermissionGuard menuName={MenuType.BOOKING}>
			<TripDetailsContainer/>
		</PermissionGuard>
	)
}

export default TripDetails