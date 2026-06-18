import React from 'react'
import { useTranslation } from 'react-i18next';
import { Button, Dialog, Paragraph, Portal } from 'react-native-paper'

interface IConfirmationModalProps {
    visible:boolean,
    text:string,
    title:string;
    cancelBlockAction:()=>void;
    confirmBlockAction:()=>void;
}

const ConfirmationModal = ({visible,cancelBlockAction,confirmBlockAction, text, title}:IConfirmationModalProps) => {
 const { t: TranslateMessage } = useTranslation();
  return (
    <Portal>
    <Dialog visible={visible} onDismiss={cancelBlockAction}>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Content>
        <Paragraph>
         {text}
        </Paragraph>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={cancelBlockAction}>{TranslateMessage('Admin.Delivery.App.CancelBtnTitle')}</Button>
        <Button onPress={confirmBlockAction}>{TranslateMessage('Admin.Delivery.App.Yes')}</Button>
      </Dialog.Actions>
    </Dialog>
  </Portal>
  )
}

export default ConfirmationModal