import { useIsFocused } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ImageStyle, Pressable, ScrollView, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { useTimingStyle } from 'src/common/assets/styles/timing';
import ErrorMessageContainer from 'src/common/components/ErrorMessage/ErrorMessage';
import { RenderImage } from 'src/common/components/Image/Image';
import { Loader } from 'src/common/components/Loader/Loader';
import Typography from 'src/common/components/Typography/Typography';
import { useAppTheme } from 'src/common/context/AppTheme';
import { fetchTopPerformerAction } from 'src/common/service/report/action';
import { useDashboardStyle } from 'src/components/DashboardPage/DashboardStyle';
import { useMenuDashboardStyle } from 'src/components/DashboardPage/menuManagement/menuDashboard';
import {truncateText } from 'src/components/DashboardPage/topPerformer/TopPerformerUtils';
import { Routes } from 'src/routing/paths';
import { AppDispatch, RootState } from 'src/store';
import { Icon } from 'src/submodules/iconlibrary/src';

export const TopPerformerPage = () => {
  const { t: TranslateMessage } = useTranslation();
  const DashboardStyle = useDashboardStyle();
  const menustyle = useMenuDashboardStyle();
  const layout = useLayoutStyle();
  const timing = useTimingStyle();
  const {theme} = useAppTheme();
  const focus = useIsFocused();
  const {data:bestRider,loading,error} = useSelector((state: RootState) => state.report.topPerformer);
  const dispatch = useDispatch<AppDispatch>();



  useEffect(() => {
    if (focus) {
      dispatch(fetchTopPerformerAction())
    }
  }, [focus]);

  function renderErrorMsg(error: string) {
    if (error) {
      return <ErrorMessageContainer message={error} />;
    }
    return null;
  }
  const handleBestRider = (id: number) => {
    router.push(`${Routes.DRIVER}${Routes.DRIVERDETAILS}/${id}`);
  }

  return (
    <View style={layout.flexCol}>
      <View
        style={[
          layout.cardBox,
          layout.flexCol,
          DashboardStyle.mb12,
          { backgroundColor: theme.colors.surfaceMedium },
        ]}
      >
        <View
          style={[
            layout.marBottom30,
            DashboardStyle.cardDashImgFlex,
            { gap: 8 },
          ]}
        >
          {/* <Image
            source={require('src/common/assets/images/trophy-solid.png')}
            resizeMode='contain'
            style={{ tintColor: theme.iconColor.iconBaseColor }}
          /> */}
          <Icon name='trophy' size={20} color={theme.colors.themeIcon}/>
          <Typography variant='subTitle'>{TranslateMessage('Admin.Delivery.App.Dashboard.TopPerformers')}</Typography>
        </View>
        {
          loading ?
            <Loader loading={loading} />
            :
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ maxHeight: 240 }}>
                {/* <View>

                  {bestSellers.length > 0 ? (
                    <View style={{ maxHeight: 240 }}>
                      <View>
                        <View style={DashboardStyle.flexRowCenter}>
                          <View style={DashboardStyle.line} />
                          <Text style={[DashboardStyle.texttopperformer, layout.txtUpperCase]}>
                            {TranslateMessage('Admin.Delivery.App.Restaurant')}
                          </Text>
                          <View style={DashboardStyle.line} />
                        </View>
                        {bestSellers.map((item, index) => (
                          <View
                            key={index}
                            style={[menustyle.menuItemBox, { borderBottomWidth: 0 }]}
                          >
                            <View style={menustyle.menuItem}>
                              <View style={menustyle.itemImg}>
                                <Image
                                  source={
                                    item.logoUrl
                                      ? { uri: item.logoUrl }
                                      : require('src/common/assets/images/Avator.png')
                                  }
                                  style={menustyle.itemImg}
                                />
                              </View>
                              <View>
                                <View
                                  style={[DashboardStyle.flexRowCenter, { gap: 10 }]}
                                >
                                  <Text
                                    style={[menustyle.itemTitle]}
                                    numberOfLines={1}
                                    ellipsizeMode='tail'
                                  >
                                    {truncateText(item.sellerName)}
                                  </Text>
                                  <View style={DashboardStyle.ratingWrap}>
                                    <IconButton
                                      icon='star'
                                      iconColor='#FFA500'
                                      size={14}
                                      style={[timing.icon, { width: 18, height: 16 }]}
                                    />
                                    <Text style={DashboardStyle.ratingTxt}>
                                      {item.sellerRatings ?? 0}
                                    </Text>
                                  </View>
                                  {
                                    item.reviewCount > 0 ?
                                      <Text style={[menustyle.itemPrice, { paddingRight: 10 }]}>
                                        {item.reviewCount + ' ' + TranslateMessage('Admin.Delivery.App.Restaurants.Reviews')}
                                      </Text>
                                    :null  
                                  }
                                </View>
                                <View style={DashboardStyle.flexRowCenter}>
                                  <Text style={menustyle.itemPrice}>
                                    {(item.totalOrders ?? 0) + ' ' + TranslateMessage('Admin.Delivery.App.Orders')}
                                  </Text>
                                </View>
                              </View>
                            </View>
                            <Pressable onPress={() => handleBestSeller(item.id)}>
                              <Icon name='externalLink' color={theme.colors.iconErrorDark} size={22}/>
                            </Pressable>
                          </View>
                        ))}
                      </View>
                    </View>
                  )
                    : null}
                  {renderErrorMsg(error.bestSellerError)}
                </View> */}
                {bestRider.length > 0 ? (
                  <>
                    <View style={DashboardStyle.flexRowCenter}>
                      <View style={DashboardStyle.line} />
                      <Text
                        style={[DashboardStyle.texttopperformer, layout.txtUpperCase]}
                      >
                        {TranslateMessage('Admin.Delivery.App.Driver.Ride.Partners')}
                      </Text>
                      <View style={DashboardStyle.line} />
                    </View>

                    {bestRider.map((item, index) => (
                      <View
                        key={index}
                        style={[menustyle.menuItemBox, { borderBottomWidth: 0, columnGap: theme.spacing.sm }]}
                      >
                        <View style={menustyle.menuItem}>
                          <RenderImage
                              uri={item.profileUrl}
                              style={menustyle.itemImg}
                          />
                          <View>
                            <View style={[DashboardStyle.flexRowCenter, { gap: theme.spacing.sm }]}>
                              <Text style={menustyle.itemTitle} numberOfLines={1} ellipsizeMode='tail'>
                                {truncateText(item.riderName)}
                              </Text>
                              <View style={DashboardStyle.ratingWrap}>
                                <Icon name='star' size={12} color={theme.colors.iconWarningDark}/>
                                <Text style={DashboardStyle.ratingTxt}>{item.rating}</Text>
                              </View>
                              {
                                item.totalReview > 0 ?
                                  <Text style={menustyle.itemPrice}>
                                    {item.totalReview + ' ' + TranslateMessage('Admin.Delivery.App.Restaurants.Reviews')}
                                  </Text>
                                :null 
                              }
                            </View>
                            <View style={DashboardStyle.flexRowCenter}>
                              <Text style={menustyle.itemPrice}>{item.totalOrder ?? 0} {TranslateMessage('Admin.Delivery.App.Driver.Rides')}</Text>
                            </View>
                          </View>
                        </View>
                        <Pressable onPress={() => handleBestRider(item.id)}>
                          <Icon name='externalLink' color={theme.colors.themeIcon} size={22} />
                        </Pressable>
                      </View>
                    ))}
                  </>
                ) : null}
                {(bestRider.length === 0) && (
                  <Image
                    source={require('src/common/assets/images/topperform.png')}
                    resizeMode='contain'
                    style={[DashboardStyle.imageGraph as ImageStyle]}
                  />
                )}
                {renderErrorMsg(error ?? '')}
              </View>
            </ScrollView>
        }
      </View>
    </View>
  );
};
