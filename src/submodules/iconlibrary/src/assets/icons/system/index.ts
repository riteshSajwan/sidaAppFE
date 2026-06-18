import Eye from './eye.svg';
import EyeOff from './eye-off.svg';
import Upload from './upload.svg';
import Calendar from './calendar.svg';
import Logout from './log-out.svg';
import InfoOutline from './info-outline.svg';
import Help from './help.svg';
import Setting from './settings.svg';
import Dashboard from './dashboard-grid.svg';
import ExternalLink from './external-link.svg';
import Refresh from './refresh.svg';
import AddLargeLine from './add-large-line.svg'
import SwitchOn from './switch-on.svg'
import switchOff from './switch-off.svg'
import TicketLine from './ticket-line.svg'
import Cancel from './cancel.svg'


export const systemIcons = {
	eye: Eye,
	eyeOff: EyeOff,
	upload: Upload,
	calendar: Calendar,
	logout: Logout,
	infoOutline: InfoOutline,
	help: Help,
	setting: Setting,
	dashboard: Dashboard,
	externalLink: ExternalLink,
	refresh: Refresh,
	addLargeLine: AddLargeLine,
	switchOn: SwitchOn,
	switchOff: switchOff,
	ticketLine: TicketLine,
	cancel: Cancel,
} as const;

export type SystemIconName = keyof typeof systemIcons;