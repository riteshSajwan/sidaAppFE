import { getEmojiFlag, TCountryCode } from 'countries-list';
import React, { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Keyboard,
  Pressable,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import AllCountryList from 'src/components/DriverOnboarding/CountryPickerModal/AllCountryList';
import { useCountryPickerStyles } from 'src/components/DriverOnboarding/CountryPickerModal/CountryPickerModalStyle';

export interface ICountryData {
  name: string;
  native: string;
  code: TCountryCode;
  callingCodes?: number[];
}
interface ICountryModalProps {
  countryCode: TCountryCode | null;
  onSelect: (selectedCountry: ICountryData) => void;
  disable?: boolean;
}

const CountryListModal: FunctionComponent<ICountryModalProps> = ({
  countryCode,
  onSelect,
  disable,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const { t: TranslateMessage } = useTranslation();

  const toggleModal = () => {
    Keyboard.dismiss();
    setModalVisible(!modalVisible);
  };
  const layout = useLayoutStyle();
  const styles = useCountryPickerStyles();

  return (
    <>
      <Portal>
        {modalVisible && (
          <TouchableWithoutFeedback onPress={toggleModal}>
            <View style={layout.flexCol}>
              <Modal
                visible={modalVisible}
                onDismiss={toggleModal}
                contentContainerStyle={styles.modalContainer}
              >
                <TouchableWithoutFeedback>
                  <View style={styles.countryView}>
                    <View
                      style={[
                        styles.modalHeader,
                        layout.flexDirectionRow,
                        layout.justifyBetween,
                      ]}
                    >
                      <Text allowFontScaling={false} style={styles.closetext}>
                        {TranslateMessage(
                          'Admin.Delivery.App.Select.Country.Label',
                        )}
                      </Text>
                      <Pressable onPress={toggleModal}>
                        <Text allowFontScaling={false} style={styles.closetext}>
                          {TranslateMessage('Admin.Delivery.App.Close')}
                        </Text>
                      </Pressable>
                    </View>
                    <AllCountryList
                      modalVisible={modalVisible}
                      toggleModal={toggleModal}
                      countryCode={countryCode}
                      onSelect={onSelect}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
            </View>
          </TouchableWithoutFeedback>
        )}
      </Portal>
      {countryCode && (
        <TouchableOpacity
          onPress={toggleModal}
          style={{ marginBottom: 2 }}
          disabled={disable}
        >
          <Text
            allowFontScaling={false}
            style={{ fontSize: 35, fontFamily: 'Segoe UI Emoji' }}
          >
            {getEmojiFlag(countryCode)}
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
};

export default CountryListModal;
