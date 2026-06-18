import { router } from 'expo-router';
import { useLocalSearchParams, useSearchParams } from 'expo-router/build/hooks';
import React, { useCallback, useEffect } from 'react';
import { BackHandler, Pressable, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { useAppTheme } from 'src/common/context/AppTheme';
import {
  resetOnboardingStepAction,
  updateOnboardingStep,
} from 'src/common/service/onboarding/action';
import { useOnBoardingStyle } from 'src/components/DriverOnboarding/onBoardingstyle';
import PersonalInformation from 'src/components/DriverOnboarding/PersonalInformation/PersonalInformation';
import { Routes } from 'src/routing/paths';
import { AppDispatch, RootState } from 'src/store';
import { Icon } from 'src/submodules/iconlibrary/src';
import BankDetails from './BankDetails/BankDetails';
import LegalDocuments from './LegalDocuments/LegalDocuments';

export enum NavigationScreen {
  PROFILE = 'profile',
  LEGAL = 'legal',
  BANK = 'bank',
  NAVIGATIONFROM = 'navigationFrom',
}

const SHOW_BANKING_STEP = false;
const ONBOARDING_STEPS = SHOW_BANKING_STEP
  ? ['step1', 'step2', 'step3']
  : ['step1', 'step2'];

const InformationData = () => {
  const layout = useLayoutStyle();
  const formStyle = useFormStyle();
  const { theme } = useAppTheme();
  const dispatch = useDispatch<AppDispatch>();
  const onboardingStyle = useOnBoardingStyle();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Get state from Redux
  const { currentStep } = useSelector((state: RootState) => state.onboarding);

  const steps = ONBOARDING_STEPS;

  const currentStepIndex = steps.indexOf(currentStep);

  const handlePreviousStep = useCallback(() => {
    if (currentStepIndex > 0) {
      dispatch(updateOnboardingStep(steps[currentStepIndex - 1]));
    }
  }, [currentStepIndex, dispatch, steps]);

  const handleNextStep = async () => {
    if (currentStepIndex < steps.length - 1) {
      dispatch(updateOnboardingStep(steps[currentStepIndex + 1]));
    } else {
      dispatch(resetOnboardingStepAction());
      router.replace(Routes.DRIVER);
    }
  };

  const searchParams = useSearchParams();

  useEffect(() => {
    const profileRedirect = searchParams.get(NavigationScreen?.NAVIGATIONFROM);
    if (profileRedirect === NavigationScreen.PROFILE) {
      dispatch(updateOnboardingStep('step1'));
    } else if (profileRedirect === NavigationScreen.LEGAL) {
      dispatch(updateOnboardingStep('step2'));
    } else if (
      SHOW_BANKING_STEP &&
      profileRedirect === NavigationScreen.BANK
    ) {
      dispatch(updateOnboardingStep('step3'));
    }
  }, [dispatch, searchParams]);

  useEffect(() => {
    const backAction = () => {
      if (currentStepIndex > 0) {
        handlePreviousStep();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [currentStepIndex, handlePreviousStep]);

  useEffect(() => {
    if (!id) {
      dispatch(updateOnboardingStep('step1'));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentStepIndex === -1) {
      dispatch(updateOnboardingStep('step1'));
    }
  }, [currentStepIndex, dispatch]);
  return (
    <>
      <View style={[layout.mainContainer, layout.flexDirectionColumn]}>
        <View style={[layout.container, onboardingStyle.mt20]}>
          <View style={[formStyle.formStep]}>
            {currentStepIndex > 0 && (
              <Pressable onPress={handlePreviousStep}>
                <Icon
                  name='chevronLeft'
                  size={22}
                  color={theme.colors.iconLow}
                />
              </Pressable>
            )}
            {steps.map((step, index) => (
              <View key={step} style={formStyle.stepItem}>
                <Pressable
                  style={[
                    formStyle.stepBtn,
                    // If the step is the current step
                    currentStep === step
                      ? formStyle.stepBtnActive
                      : index < currentStepIndex
                        ? formStyle.stepBtnCompleted
                        : formStyle.stepBtn,
                  ]}
                  // disabled={!id}
                  // onPress={() => {
                  //   dispatch(updateOnboardingStep(step));
                  // }}
                />
              </View>
            ))}
          </View>
        </View>
        <View style={layout.flexCol}>
          {/* 1st Step */}
          {currentStep === 'step1' && (
            <PersonalInformation handleNextStep={handleNextStep} />
          )}
          {/* 2nd Step */}
          {currentStep === 'step2' && id && (
            <LegalDocuments handleNextStep={handleNextStep} />
          )}
          {/* 3rd Step */}
          {SHOW_BANKING_STEP && currentStep === 'step3' && id && (
            <BankDetails handleNextStep={handleNextStep} />
          )}
        </View>
      </View>
    </>
  );
};

export default InformationData;
