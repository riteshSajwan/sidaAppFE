import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import CustomModal from 'src/common/components/CustomModal/CustomModal';
import { useAppTheme } from 'src/common/context/AppTheme';
import useCurrencyFormatter from 'src/common/hook/useCurrencyFormator';
import { IWalletBalanceItem } from 'src/components/DashboardPage/DashboardUtil';

interface WalletBalanceModalProps {
  visible: boolean;
  available: IWalletBalanceItem[];
  onClose: () => void;
}

const WalletBalanceModal = ({ visible, available, onClose }: WalletBalanceModalProps) => {
  const { t: TranslateMessage } = useTranslation();
  const layout = useLayoutStyle();
  const { theme } = useAppTheme();
  const currencyFormat = useCurrencyFormatter();

  return (
    <CustomModal
      visible={visible}
      dismissOutside
      title={TranslateMessage('Admin.Delivery.App.Wallet.AvailableByCurrency')}
      bodyContent={[]}
      onCancel={onClose}
      isHome
      dialogStyle={{ maxWidth: 520 }}
    >
      <View style={{ gap: theme.spacing.md, paddingBottom: theme.spacing.md }}>
        <Text style={layout.paraText}>
          {TranslateMessage('Admin.Delivery.App.Wallet.AvailableByCurrency.Message')}
        </Text>
        {available.length > 0 ? (
          available.map((item) => (
            <View
              key={item.currency}
              style={{
                borderWidth: 1,
                borderColor: theme.colors.borderLow,
                borderRadius: theme.roundness.sm,
                padding: theme.spacing.md,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View>
                <Text style={[layout.accordionTitle, { textTransform: 'uppercase' }]}>
                  {item.currency}
                </Text>
                <Text style={layout.paraText}>{TranslateMessage('Admin.Delivery.App.Wallet.AvailableBalance')}</Text>
              </View>
              <Text style={[layout.accordionTitle, { color: theme.colors.themeText }]}>
                {currencyFormat(item.amountDecimal, item.currency.toUpperCase())}
              </Text>
            </View>
          ))
        ) : (
          <Text style={layout.paraText}>{TranslateMessage('Admin.Delivery.App.Wallet.NoAvailableBalance')}</Text>
        )}
      </View>
    </CustomModal>
  );
};

export default WalletBalanceModal;
