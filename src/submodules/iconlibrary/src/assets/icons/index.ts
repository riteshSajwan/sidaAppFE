import { analyticsIcons } from './analytics';
import { audioIcons } from './audio';
import { buildingIcons } from './building';
import { communicationIcons } from './communication';
import { docsIcons } from './docs';
import { financeIcons } from './finance';
import { homeIcons } from './home';
import { mapsIcons } from './maps';
import { navigationIcons } from './navigation';
import { othersIcons } from './others';
import { securityIcons } from './security';
import { shoppingIcons } from './shopping';
import { startIcons } from './stars';
import { systemIcons } from './system';
import { toolsIcons } from './tools';
import { userIcons } from './users';
import { weatherIcons } from './weather';

export const icons = {
  ...analyticsIcons,
  ...audioIcons,
  ...navigationIcons,
  ...systemIcons,
  ...othersIcons,
  ...docsIcons,
  ...securityIcons,
  ...communicationIcons,
  ...mapsIcons,
  ...startIcons,
  ...toolsIcons,
  ...userIcons,
  ...financeIcons,
  ...homeIcons,
  ...weatherIcons,
  ...buildingIcons,
  ...shoppingIcons,  
} as const;

export type IconName = keyof typeof icons;