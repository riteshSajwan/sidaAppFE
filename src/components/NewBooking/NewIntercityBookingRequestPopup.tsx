import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, Easing, Pressable, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import Typography from 'src/common/components/Typography/Typography';
import { useAppTheme } from 'src/common/context/AppTheme';
import { hideNewBookingNotification } from 'src/common/service/websocket/newBookingNotificationSlice';
import { Routes } from 'src/routing/paths';
import { RootState } from 'src/store';
import { Icon } from 'src/submodules/iconlibrary/src';

const AUTO_DISMISS_MS = 6000;

const NewIntercityBookingRequestPopup = () => {
  const dispatch = useDispatch();
  const { theme } = useAppTheme();
  const layout = useLayoutStyle();
  const { t: TranslateMessage } = useTranslation();
  const { notification, isVisible } = useSelector((state: RootState) => state.newBookingNotification);
  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.92)).current;
  const progressWidth = useRef(new Animated.Value(100)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.18, duration: 600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  useEffect(() => {
    if (isVisible && notification) {
      progressWidth.setValue(100);
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, tension: 80, friction: 10, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, tension: 80, friction: 10, useNativeDriver: true }),
      ]).start();
      Animated.timing(progressWidth, { toValue: 0, duration: AUTO_DISMISS_MS, easing: Easing.linear, useNativeDriver: false }).start();
      const timer = setTimeout(() => dismissWithAnimation(), AUTO_DISMISS_MS);
      return () => clearTimeout(timer);
    } else {
      translateY.setValue(-120);
      opacity.setValue(0);
      scale.setValue(0.92);
    }
  }, [isVisible, notification]);

  const dismissWithAnimation = () => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: -120, duration: 280, easing: Easing.in(Easing.ease), useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start(() => dispatch(hideNewBookingNotification()));
  };

  if (!isVisible || !notification) return null;

  const handleView = () => {
    router.push(Routes.NEWBOOKING);
    dispatch(hideNewBookingNotification());
  };

  const progressBarColor = progressWidth.interpolate({
    inputRange: [0, 40, 100],
    outputRange: [theme.colors.borderSuccessInverse, theme.colors.borderSuccessInverse, theme.colors.surfaceSuccessInverse],
  });

  return (
    <View pointerEvents='box-none' style={layout.notificationPopupOverlay}>
      <Animated.View
        style={[
          layout.notificationPopupCard,
          {
            backgroundColor: theme.colors.surfaceBase,
            borderColor: theme.colors.borderSuccessInverse,
            shadowColor: theme.colors.surfaceSuccessInverse,
            transform: [{ translateY }, { scale }],
            opacity,
          },
        ]}
      >
        <View style={[layout.notificationPopupAccentBar, { backgroundColor: theme.colors.surfaceSuccessInverse }]} />

        <View style={layout.notificationPopupBody}>
          <Animated.View
            style={[
              layout.notificationPopupIconRing,
              { borderColor: theme.colors.borderSuccessInverse, transform: [{ scale: pulseAnim }] },
            ]}
          >
            <View style={[layout.notificationPopupIconInner, { backgroundColor: theme.colors.surfaceSuccessInverse }]}>
              <Icon name='bell' size={18} color={theme.colors.iconInverse} />
            </View>
          </Animated.View>

          <View style={layout.notificationPopupTextBlock}>
            <View style={layout.notificationPopupBadgeRow}>
              <View style={[layout.notificationPopupBadge, { backgroundColor: theme.colors.surfaceSuccessBase }]}>
                <Typography variant='textLabel' color={theme.colors.textSuccessDark} fontWeight='semiBold'>
                  {TranslateMessage('Admin.Delivery.App.NewBooking.Notification.Badge')}
                </Typography>
              </View>
            </View>

            <Typography variant='subTitle' fontWeight='semiBold'>
              {TranslateMessage('Admin.Delivery.App.NewBooking.Notification.Title')}
            </Typography>

            {notification.customerName ? (
              <Typography variant='textLabel' color={theme.colors.textNeutral}>
                {notification.customerName}
              </Typography>
            ) : null}

            {notification.sourceName ? (
              <View style={layout.notificationPopupMetaRow}>
                <Icon name='pickup' size={12} color={theme.colors.iconNeutral} />
                <Typography variant='textLabel' color={theme.colors.textNeutral}>
                  {notification.sourceName}
                </Typography>
              </View>
            ) : null}
          </View>

          <Pressable onPress={dismissWithAnimation} hitSlop={10} style={layout.notificationPopupCloseBtn}>
            <Icon name='closeAlt' size={13} color={theme.colors.iconBase} />
          </Pressable>
        </View>

        <Pressable
          onPress={handleView}
          style={({ pressed }) => [
            layout.notificationPopupActionBtn,
            { backgroundColor: theme.colors.surfaceSuccessInverse, opacity: pressed ? 0.82 : 1 },
          ]}
        >
          <Typography variant='textLabel' color={theme.colors.textInverse} fontWeight='semiBold'>
            {TranslateMessage('Admin.Delivery.App.NewBooking.Notification.ViewRequest')}
          </Typography>
          <Icon name='arrowRight' size={14} color={theme.colors.iconInverse} />
        </Pressable>

        <View style={[layout.notificationPopupProgressTrack, { backgroundColor: theme.colors.borderLow }]}>
          <Animated.View
            style={[
              layout.notificationPopupProgressFill,
              {
                backgroundColor: progressBarColor,
                width: progressWidth.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
              },
            ]}
          />
        </View>
      </Animated.View>
    </View>
  );
};

export default NewIntercityBookingRequestPopup;
