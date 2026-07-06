import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Typography from 'src/common/components/Typography/Typography';
import { useAppTheme } from 'src/common/context/AppTheme';
import {
  generateInitialErrorsFromFields,
  generateInitialFilesStateFromFields,
  validateDocumentUploadsForFields,
} from 'src/components/ArchitectDetails/DocumentUploads/DocumentUploadsUtils';
import MultistepForm from 'src/components/NewApplication/MultistepForm/MultistepForm';
import MultistepTimeline from 'src/components/NewApplication/MultistepForm/MultistepTimeline';
import { useNewApplicationStyle } from 'src/components/NewApplication/NewApplication';
import { Icon } from 'src/submodules/iconlibrary/src';
import {
  createEmptyOwner,
  generateInitialFormErrors,
  IFormData,
  IOwner,
  INITIAL_FORM,
  NEW_APPLICATION_DOCUMENT_FIELDS,
  STEPS,
  validateApplicantDetails,
  validateArchitectDetails,
  validateGisCoordinates,
  validatePropertyDetails,
} from './NewApplicationUtils';


const NewApplicationContainer = () => {
  const styles = useNewApplicationStyle();
  const { theme } = useAppTheme();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<IFormData>(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState(generateInitialFormErrors);
  const [documentFiles, setDocumentFiles] = useState(() =>
    generateInitialFilesStateFromFields(NEW_APPLICATION_DOCUMENT_FIELDS),
  );
  const [documentErrors, setDocumentErrors] = useState(() =>
    generateInitialErrorsFromFields(NEW_APPLICATION_DOCUMENT_FIELDS),
  );
  const [documentPickerErrors, setDocumentPickerErrors] = useState<Record<string, string>>({});

  const totalSteps = STEPS.length;
  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;

  // ── Field update (property / architect / gis) ────────────────────────
  const handleFieldChange = (
    section: 'property' | 'architect' | 'gis',
    field: string,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
    setFormErrors((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: '' },
    }));
  };

  // ── Owner (Applicant Details) update ────────────────────────────────
  const handleOwnerChange = (ownerId: string, field: keyof IOwner, value: string) => {
    setFormData((prev) => ({
      ...prev,
      applicant: {
        owners: prev.applicant.owners.map((owner) =>
          owner.id === ownerId ? { ...owner, [field]: value } : owner,
        ),
      },
    }));
    setFormErrors((prev) => ({
      ...prev,
      applicant: {
        ...prev.applicant,
        [ownerId]: { ...prev.applicant[ownerId], [field]: '' },
      },
    }));
  };

  const handleAddOwner = () => {
    setFormData((prev) => ({
      ...prev,
      applicant: { owners: [...prev.applicant.owners, createEmptyOwner()] },
    }));
  };

  const handleRemoveOwner = (ownerId: string) => {
    setFormData((prev) => {
      if (prev.applicant.owners.length <= 1) return prev;
      return {
        ...prev,
        applicant: { owners: prev.applicant.owners.filter((owner) => owner.id !== ownerId) },
      };
    });
    setFormErrors((prev) => {
      const rest = { ...prev.applicant };
      delete rest[ownerId];
      return { ...prev, applicant: rest };
    });
  };

  // ── Per-step validation ──────────────────────────────────────────────
  const validateCurrentStep = (): boolean => {
    if (currentStep === 0) {
      const { isValid, errors } = validatePropertyDetails(formData.property);
      setFormErrors((prev) => ({ ...prev, property: errors }));
      return isValid;
    }
    if (currentStep === 1) {
      const { isValid, errors } = validateApplicantDetails(formData.applicant);
      setFormErrors((prev) => ({ ...prev, applicant: errors }));
      return isValid;
    }
    if (currentStep === 2) {
      const { isValid, errors } = validateArchitectDetails(formData.architect);
      setFormErrors((prev) => ({ ...prev, architect: errors }));
      return isValid;
    }
    if (currentStep === 3) {
      const { isValid, errors } = validateGisCoordinates(formData.gis);
      setFormErrors((prev) => ({ ...prev, gis: errors }));
      return isValid;
    }
    if (currentStep === 4) {
      const { isValid, errors } = validateDocumentUploadsForFields(documentFiles, NEW_APPLICATION_DOCUMENT_FIELDS);
      setDocumentErrors(errors);
      return isValid;
    }
    return true;
  };

  // ── Navigation ─────────────────────────────────────────────────────
  const handleNext = () => {
    if (!validateCurrentStep()) return;
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
        formErrors={formErrors}
        onFieldChange={handleFieldChange}
        onOwnerChange={handleOwnerChange}
        onAddOwner={handleAddOwner}
        onRemoveOwner={handleRemoveOwner}
        documentFiles={documentFiles}
        documentErrors={documentErrors}
        documentPickerErrors={documentPickerErrors}
        setDocumentFiles={setDocumentFiles}
        setDocumentErrors={setDocumentErrors}
        setDocumentPickerErrors={setDocumentPickerErrors}
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
