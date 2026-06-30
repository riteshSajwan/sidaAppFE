import { DrawerHeaderProps } from '@react-navigation/drawer';
import { router } from 'expo-router';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, FlatList, Pressable, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Appbar, Badge } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { useUserStyle } from 'src/common/assets/styles/user';
import CustomIconButton from 'src/common/components/CustomIconButton/CustomIconButton';
import CustomModal from 'src/common/components/CustomModal/CustomModal';
import ErrorMessageContainer from 'src/common/components/ErrorMessage/ErrorMessage';
import { RenderImage } from 'src/common/components/Image/Image';
import Typography from 'src/common/components/Typography/Typography';
import { useAppTheme } from 'src/common/context/AppTheme';
import { usePermission } from 'src/common/hooks/usePermission';
import { useTenantId } from 'src/common/hooks/useTenantId';
import Breadcrumbs from 'src/common/layouts/Header/Breadcrumbs';
import { useHeaderStyle } from 'src/common/layouts/Header/HeaderStyle';
import { INotificationTitile, MenuColor } from 'src/common/layouts/Header/HeaderUtil';
import { logout } from 'src/common/service/auth/action';
import { fetchNotificationListAction, markNotificationReadAction } from 'src/common/service/notification/action';
import { setNotificationReadStatus, setSelectedNotification } from 'src/common/service/notification/slice';
import { getDeviceToken } from 'src/common/utils/getDeviceToken';
import { getTimeAgo } from 'src/common/utils/getNotificationTime';
import { MenuType } from 'src/common/utils/permissionUtils';
import { getRefreshToken } from 'src/common/utils/refreshTokenUtils';
import { removeTenantId } from 'src/common/utils/tenantUtils';
import { useDashboardStyle } from 'src/components/DashboardPage/DashboardStyle';
import { DEFAULT_SIZE } from 'src/constants';
import { Routes } from 'src/routing/paths';
import { AppDispatch, RootState } from 'src/store';
import { Icon } from 'src/submodules/iconlibrary/src';

interface IHeaderProps extends Partial<DrawerHeaderProps> { 
  headerTitle?: string;
  /** When true, renders breadcrumbs instead of the back-button + title pattern */
  showBreadcrumbs?: boolean;
}

const Header: FunctionComponent<IHeaderProps> = (
  { headerTitle, showBreadcrumbs = false, ...props }
) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const { t: TranslateMessage } = useTranslation();
  const styles = useHeaderStyle();
  const DashboardStyle = useDashboardStyle();
  const layout = useLayoutStyle();
  const userStyle = useUserStyle();
  const {theme} = useAppTheme();
  const [loading, setLoading] = useState<boolean>(false);
  const [showLangModal, setShowLangModal] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const { isTenantView } = useTenantId();
  const userDetails = useSelector((state: RootState) => state.profile.data);
  const count = useSelector((state: RootState) => state.profile.notificationCount);
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);
  const dispatch: AppDispatch = useDispatch();
  const [isDesktop, setIsDesktop] = useState(
    Dimensions.get('window').width > 1199
  );
  const {hasMore, data: notificationData,error:apiError} = useSelector((state: RootState) => state.notification.notificationListing);
  const {notificationReadStatus,selectedNotification} = useSelector((state: RootState) => state.notification);
    const { isProductAdmin } = usePermission(MenuType.DASHBOARD);
  
  const openDrawer = () => {
    props.navigation?.toggleDrawer();
  };

  const profile = () => {
    closeMenu();
    router.push(Routes.PROFILE);
  };


  const pageRedirectHandle = () => {
    router.push(Routes.DASHBOARD);
  };

  const handleLogOut = () => {
    closeMenu();

    Promise.resolve(getDeviceToken() ?? '')
      .then((deviceToken) =>
        getRefreshToken().then((refreshToken) => ({
          deviceToken,
          refreshToken: refreshToken ?? '',
        }))
      )
      .then((payload) => dispatch(logout(payload)))
      .then(() => router.replace(Routes.LOGIN))
      .catch(() => {});
  };

useEffect(() => {
  if (notificationReadStatus && selectedNotification) {
    const { requestId, type } = selectedNotification;
    setShowNotifications(false);
    switch (type) {
      case INotificationTitile.NEW_TICKET_CREATED:
      case INotificationTitile.New_RIDER_TICKET_RAISED:
      case INotificationTitile.NEW__CUSTOMER_TICKET_RAISED:
      case INotificationTitile.REFUND:
      case INotificationTitile.ACCIDENT:
      case INotificationTitile.PAYMENT_ISSUES:
      case INotificationTitile.ADDRESS_NOT_FOUND:
      case INotificationTitile.PASSENGER_DID_NOT_SHOW_UP:
      case INotificationTitile.ROUTE_CHANGED:
      case INotificationTitile.PASSENGER_NOT_READY_FOR_PICKUP:
      case INotificationTitile.PASSENGER_NOT_CONTACTABLE:
      case INotificationTitile.DRIVER_NOT_ARRIVED:
      case INotificationTitile.UNSAFE_OR_RUDE_DRIVER:
      case INotificationTitile.DOUBLE_CHARGE_FOR_RIDE:
      case INotificationTitile.WRONG_ROUTE_TAKEN:
      case INotificationTitile.UNABLE_TO_TRACK_DRIVER:
      case INotificationTitile.DRIVER_CANCELLED_BUT_CHARGED:
      case INotificationTitile.CANNOT_UPDATE_DESTINATION:
      case INotificationTitile.OTHER:
        router.push(`${Routes.TICKET}/${requestId}`);
        break;

      case INotificationTitile.NEW_RIDER_ONBOARD:
      case INotificationTitile.RIDER:
        router.push(`${Routes.REQUESTS}/${requestId}${Routes.DRIVER_ONBOARRDING}`);
        break;

      case INotificationTitile.New_RIDER_TICKET_RAISED:
        router.push(`${Routes.TICKET}/${requestId}`);
        break;

      case INotificationTitile.NEW__CUSTOMER_TICKET_RAISED:
        router.push(`${Routes.TICKET}/${requestId}`);
        break;

      default:
        break;
    }
    dispatch(setNotificationReadStatus(null));
    setSelectedNotification(null);
  }
}, [notificationReadStatus]);

  const toggleModalVisible = () => {
    setShowNotifications(!showNotifications);
  }

  function toggleModal() {
    setShowLangModal(prevState => !prevState);
  }
  const handleNotification = () => {
    setPage(0);
    toggleModalVisible();
  };

  const profileButton = () => (
    <CustomIconButton icon='userOutline' iconColor={MenuColor.WHITECOLOR} />
  );

  const logoutButton = () => (
    <CustomIconButton icon='logout' iconColor={MenuColor.WHITECOLOR} />
  );

  const fetchNotifications = () => {
    if (!userDetails?.id) return;
    setLoading(true);
  
    dispatch(
      fetchNotificationListAction(userDetails.id, {
        page,
        size: DEFAULT_SIZE,
      })
    )
  };

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setIsDesktop(window.width > 1199);
    });
    return () => {
      subscription?.remove();
    };
  }, []);

  const handleSwitchToProductAdmin = () => {
    removeTenantId()
      .then(() => {
        router.replace(Routes.DASHBOARD);
      })
      .catch((error) => {
        console.error('Failed to remove tenant ID:', error);
      });
  };

  useEffect(() => {
    if (userDetails?.id && showNotifications) {
      fetchNotifications();

    }
  }, [userDetails?.id, showNotifications, page]);

  function showProfileImage() {
    return userDetails?.profileUrl
      ? userDetails.profileUrl
      : require('src/common/assets/images/avatar.png');
  }

function renderProfilePill() {
    return (
      <Pressable
        onPress={profile}
        style={styles.profilePill}
        accessibilityRole="button"
        accessibilityLabel="Open profile"
      >
        {/* Avatar circle — shows profile image or initials fallback */}
        {userDetails?.profileUrl ? (
          <RenderImage uri={userDetails.profileUrl} style={styles.avatar} />
        ) : (
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitials}>AD</Text>
          </View>
        )}
        <View>
          <Text style={styles.profileName}>Admin</Text>
          <Text style={styles.profileRole}>Administrator</Text>
        </View>
        <Icon name="chevronDown" size={14} color={theme.colors.iconBase} />
      </Pressable>
    );
  }
  const loadMore = () => {
    if (!hasMore || notificationData.data.length === 0) return;
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };
  const onEndReachHandler = () => {
    loadMore();
  };

  const handleViewNotification = (
    id: number,
    title: string,
    isRead: boolean,
    requestId?: string,
    type?: string
  ) => () => {
    
    dispatch(setSelectedNotification({ requestId, type }));
    dispatch(markNotificationReadAction(id, isRead));
  };
  
  const getOrderStatusImage = (title: string) => {
    switch (title) {
      case INotificationTitile.NEW_TICKET_CREATED:
        return require('src/common/assets/images/icons/NEW_TICKET_CREATED.png');
      case INotificationTitile.NEW_RIDER_ONBOARD:
        return require('src/common/assets/images/icons/NEW_RESTAURENT_ONBOARD_.png');
      case INotificationTitile.New_RIDER_TICKET_RAISED:
        return require('src/common/assets/images/icons/New_RIDER_TICKET_RAISED.png');
      case INotificationTitile.NEW_RESTAURENT_ONBOARD:
        return require('src/common/assets/images/order-delivered.png');
      case INotificationTitile.NEW__CUSTOMER_TICKET_RAISED:
        return require('src/common/assets/images/icons/NEW__CUSTOMER_TICKET_RAISED.png');
      default:
        return require('src/common/assets/images/dish.png');
    }
  };
  
  function renderNotificationsFlatList() {
    if (notificationData.data.length === 0 && !loading && apiError === '') {
      return (
        <View style={[layout.justifyCenter, { alignSelf: 'center', height: '100%' }]}>
          <Text
            style={[DashboardStyle.TextCardSubTitle, DashboardStyle.BottomDashboardText]} >
            {TranslateMessage('Admin.Delivery.App.Dashboard.NoDataAvailableYet')}
          </Text>
        </View>
      )
    }

    if (apiError !== '' && !loading) {
      return (
        <View style={[layout.justifyCenter, { alignSelf: 'center', height: '100%' }]}>
          <ErrorMessageContainer message={apiError??''} />
        </View>
      )
    }
    
    return (
      <FlatList
        style={{ flex: 1, }}
        data={notificationData.data}
        keyExtractor={(category) => String(category.id)}
        onEndReached={onEndReachHandler}
        onEndReachedThreshold={0.9}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableWithoutFeedback>
            <Pressable onPress={handleViewNotification(item.id, item.title, item.isRead, item.requestId, item.type)}>
              <View style={[userStyle.menuItemBox]}>
                <View
                  style={[
                    layout.flexDirectionRow,
                    layout.justifyCenter,
                    layout.alignItemsCenter,
                    layout.flexCol,
                    layout.notificationlist,
                    { backgroundColor: item.isRead === true ? theme.colors.surfaceDisabled : theme.colors.surfaceMedium }
                  ]}
                >
                  <View style={[layout.flexDirectionRow, layout.flexCol]}>
                    <View
                      style={layout.imagenotification}
                    >

                    <View style={[layout.statusImage, { flexShrink: 0 }]}>
                      <Icon name="car" size={24} color={theme.colors.iconBase} />
                    </View>
                      {/* <Image source={require('src/common/assets/images/dish.png')} resizeMode='contain' style={{ width: 35 }} /> */}
                    </View>
                    <View style={layout.flexCol}>
                      <Text style={layout.listTitle}>{item.title}</Text>
                      <Typography variant='textLabel' spacing={{top: 2}}>{item.message}</Typography>
                    </View>
                  </View>
                  {/* required in future */}
                  <View style={layout.justifyEnd}>
                    <Typography variant='textLabel' spacing={{bottom: 10}}>{getTimeAgo(item.createdAt)}</Typography>
                    {/* <Pressable onPress={handleViewNotification(item.id, item.title, item.requestId, item.userId)}> */}
                    <Typography variant='textLabel'>{TranslateMessage('Admin.Driver.Delivery.App.View.Details')}</Typography>
                    {/* </Pressable> */}
                  </View>
                  {/* <Text style={[layout.tabItem, color.color_EB3C36]}>View Details</Text> */}

                </View>
              </View>
            </Pressable>
          </TouchableWithoutFeedback>
        )}
      />
    );
  }
  function renderSelectedGroupFlatlist() {
    return (
      <View style={{ maxHeight: 545, minHeight: 150, width: 580 }}>
        <View style={{ height: '96%' }}>
          {/* <Loader loading={loading} /> */}
          {renderNotificationsFlatList()}
        </View>
      </View>
    );
  }

  return (
    <Appbar.Header style={styles.header}>
      <View style={styles.leftSide}>
        {/* {!isDesktop && (
          <CustomIconButton
            icon='menu'
            onPress={openDrawer}
            iconColor={theme.colors.iconInverse}
          />
        )} */}
        <Icon name='phone' size={0}/>

        {showBreadcrumbs ? (
          /* Desktop mode — show breadcrumbs */
          <Breadcrumbs />
        ) : (
          /* Mobile / drawer header mode — show back-button + title */
          <>
            {
              headerTitle !== 'Dashboard' ?
              <CustomIconButton
                icon='chevronLeft'
                size={30}
                spacing={10}
                iconColor={theme.colors.iconInverse}
                onPress={() => {
                  if (router.canGoBack()) {
                    router.back();
                  } else {
                    router.replace(Routes.DASHBOARD);
                  }
                }}
              />
              : null
            }
            <Typography variant='subHeading' color={theme.colors.textInverse} style={{paddingLeft: headerTitle === 'Dashboard' ? 18 : 0}}>
              {headerTitle}
            </Typography>
          </>
        )}
        {/* <Pressable onPress={pageRedirectHandle}>
          <BrandLogo width={200} height={40} color={theme.colors.iconInverse} />
        </Pressable> */}
      </View>
      <View style={styles.rightIcons}>
        {isTenantView && isProductAdmin &&  (
          <Pressable onPress={handleSwitchToProductAdmin} style={layout.marRight}>
            <View style={styles.productAdminSwitch}>
              <Icon name='refresh' size={16} color={theme.colors.textBody} />
              <Typography variant='textLabel' color={theme.colors.textBody}>
                {TranslateMessage('Admin.Delivery.App.Switch.To.Product.Admin')}
              </Typography>
            </View>
          </Pressable>
        )}
        {/* Language selector — commented out to match design */}
        {/* <LangaugeSelectorDropdown /> */}

        {/* Bell notification button */}
        <Pressable onPress={handleNotification} style={styles.notificationBtn}>
          <CustomIconButton
            icon='bell'
            size={22}
            spacing={0}
            iconColor={theme.colors.iconBase}
            onPress={handleNotification}
          />
          {count > 0 ? (
            <Badge style={[styles.badge, styles.notificationbadge]}>
              {count <= 99 ? count : '99+'}
            </Badge>
          ) : null}
        </Pressable>

        {/* Profile pill: avatar + name + role */}
        {renderProfilePill()}
      </View>
      <CustomModal
        visible={showNotifications}
        dismissOutside={false}
        title={TranslateMessage('Admin.Delivery.App.Notifications')}
        bodyContent={[]}
        onCancel={handleNotification}
        isHome={true}
      >
        {renderSelectedGroupFlatlist()}
      </CustomModal>


    </Appbar.Header>
  );
};

export default Header;
