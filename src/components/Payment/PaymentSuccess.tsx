import React, { useEffect, useState } from 'react';
import { View, Text,Pressable, Linking, Image, ImageBackground } from 'react-native';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams } from 'expo-router';
import { setUserLanguage } from 'src/i18n/i18nUtils';
import { usePaymentStyle } from 'src/components/Payment/PaymentStyle';

const PaymentSuccess = () => {
  const layout = useLayoutStyle();
  const PaymentStyle = usePaymentStyle();
  const {lang, orderId} = useLocalSearchParams();
  const[ updatedOrderId,setUpdatedOrderId]=useState<string>('')
  const handleRedirect = async () => {
    try {
      if(updatedOrderId as string){
        await Linking.openURL(`EndUserFrontend://order/${updatedOrderId}/summary`);  
      }
      else{
        await Linking.openURL('EndUserFrontend://home/checkOut');
      }
    } catch (error) {
      console.error('Failed to redirect:', error);
    }
  };
  const { t: TranslateMessage } = useTranslation();

  useEffect(()=>{
    if(!orderId) return;
    setUpdatedOrderId(orderId as string)
  },[orderId])

  useEffect(() => {
    if(!lang) return ;
    setUserLanguage(lang as string);
  },[lang]);

  return (
    <View style={PaymentStyle.container}>
      <ImageBackground
        source={require('src/common/assets/images/user-account-bg.png')}
        resizeMode='cover'
        style={PaymentStyle.mainbgImg}
      >
        <View style={[layout.container, PaymentStyle.containerWrap]}>
          <Text style={PaymentStyle.userTitle}>{TranslateMessage('Admin.Delivery.App.Payment.Success')}</Text>
          <Image
            source={require('src/common/assets/images/successPayment.png')}
            style={PaymentStyle.userImg}
            resizeMode='contain'
          ></Image>
          <Text style={PaymentStyle.paraText}>{TranslateMessage('Admin.Delivery.App.Thank.For.Payment')}</Text>
          <Pressable style={PaymentStyle.button} onPress={handleRedirect}>
            <Text style={PaymentStyle.buttonText}>{TranslateMessage('Admin.Delivery.App.Back.App')}</Text>
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
};

export default PaymentSuccess;
