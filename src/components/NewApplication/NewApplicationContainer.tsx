import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Typography from 'src/common/components/Typography/Typography';
import { useAppTheme } from 'src/common/context/AppTheme';
import MultistepForm from 'src/components/NewApplication/MultistepForm/MultistepForm';
import MultistepTimeline from 'src/components/NewApplication/MultistepForm/MultistepTimeline';
import { useNewApplicationStyle } from 'src/components/NewApplication/NewApplication';
import { Icon } from 'src/submodules/iconlibrary/src';
import { IFormData, INITIAL_FORM, STEPS } from './NewApplicationUtils';


const NewApplicationContainer = () => {
  const styles = useNewApplicationStyle();
  const { theme } = useAppTheme();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<IFormData>(INITIAL_FORM);

  const totalSteps = STEPS.length;
  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;

  // ── Form field update ──────────────────────────────────────────────
  const handleChange = (
    section: keyof IFormData,
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  // ── Navigation ─────────────────────────────────────────────────────
  const handleNext = () => {
    if (!isLast) setCurrentStep((s) => s + 1);
    // TODO: on last step call submit API
  };

  const handlePrev = () => {
    if (!isFirst) setCurrentStep((s) => s - 1);
  };

  // ── Progress dots ──────────────────────────────────────────────────
  const renderDots = () => (
    <View style={styles.dotsRow}>
      {STEPS.map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i === currentStep ? styles.dotActive : styles.dotInactive,
          ]}
        />
      ))}
    </View>
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.surfaceLow }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* ── Page heading ── */}
      <View style={styles.headingBlock}>
        <Typography variant="subHeading">New Application</Typography>
        <Text style={styles.subHeadingText}>
          Complete all steps to submit your application
        </Text>
      </View>

      {/* ── Multistep timeline ── */}
      <MultistepTimeline steps={STEPS} currentStep={currentStep} />

      {/* ── Step form ── */}
      <MultistepForm
        currentStep={currentStep}
        formData={formData}
        onChange={handleChange}
      />

      {/* ── Bottom navigation bar ── */}
      <View style={styles.bottomBar}>
        {/* Previous */}
        <Pressable
          onPress={handlePrev}
          disabled={isFirst}
          style={[styles.prevBtn, isFirst && styles.disabledPrev]}
          accessibilityRole="button"
          accessibilityLabel="Previous step"
        >
          <Icon name="chevronLeft" size={16} color={theme.colors.textBody} />
          <Text style={styles.prevBtnText}>Previous</Text>
        </Pressable>

        {/* Step progress dots */}
        {renderDots()}

        {/* Save & Continue / Submit */}
        <Pressable
          onPress={handleNext}
          style={styles.nextBtn}
          accessibilityRole="button"
          accessibilityLabel={isLast ? 'Submit application' : 'Save and continue'}
        >
          <Text style={styles.nextBtnText}>
            {isLast ? 'Submit' : 'Save & Continue'}
          </Text>
          <Icon name="chevronRight" size={16} color={theme.colors.textInverse} />
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default NewApplicationContainer;
