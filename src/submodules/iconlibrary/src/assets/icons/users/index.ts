import UserOutline from "./user.svg";
import UserCircle from './user-circle.svg'
import UserOutlineGroup from './group.svg'
import CommunityOutline from './community.svg'

export const userIcons = {
	userOutline: UserOutline,
	userCircle: UserCircle,
	userOutlineGroup: UserOutlineGroup,
	communityOutline: CommunityOutline,
} as const;

export type SystemIconName = keyof typeof userIcons;