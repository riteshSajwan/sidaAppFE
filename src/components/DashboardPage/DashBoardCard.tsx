import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { useAppTheme } from 'src/common/context/AppTheme';
import useCurrencyFormatter from 'src/common/hook/useCurrencyFormator';
import { useDashboardStyle } from 'src/components/DashboardPage/DashboardStyle';
import { IDashboardCardProps } from 'src/components/DashboardPage/DashboardUtil';
import { Icon } from 'src/submodules/iconlibrary/src';
import { IconName } from 'src/submodules/iconlibrary/src/assets/icons';



const DashboardCard =  ({ id, amount, messageKey,currency, onPress }:IDashboardCardProps) => {
    const { t: TranslateMessage } = useTranslation();
    const DashboardStyle = useDashboardStyle();
    const layout = useLayoutStyle();
    const {theme} = useAppTheme();
    const currencyFormate = useCurrencyFormatter();
    const getCardIcon = (id: number): IconName => {
      switch (id) {
        case 1:
          return 'wallet';
        case 2:
          return 'car';
        case 3:
          return 'help';
        default:
          return 'wallet';
      }
    };
    const cardContent = (
      <>
        <View style={DashboardStyle.btnCircle}>
          <Icon name={getCardIcon(id)} size={30} color={theme.colors.themeIcon} />
        </View>
        <View style={layout.flexShrink}>
          <View style={layout.flexDirectionRow}>
            {
              currency?
              <Text style={[DashboardStyle.TextCard,{marginRight:theme.spacing.sm}]}>{currencyFormate(amount as number, currency ?? '')}</Text>
              : <Text style={DashboardStyle.TextCard}>{amount}</Text>
            }
          </View>
            <Text style={[DashboardStyle.TextCardSubTitle]}  ellipsizeMode='tail' >
                {TranslateMessage(messageKey)}
            </Text>
        </View>
      </>
    );

    const cardStyle = [
      layout.cardBox,
      DashboardStyle.cardDashImgFlex,
      layout.flexCol,
      layout.flexWrap,
    ];

    return (
        <>
          {onPress ? (
            <Pressable onPress={onPress} style={cardStyle}>
              {cardContent}
            </Pressable>
          ) : (
            <View style={cardStyle}>
              {cardContent}
            </View>
          )}
        </>

    )
}
export default DashboardCard;
