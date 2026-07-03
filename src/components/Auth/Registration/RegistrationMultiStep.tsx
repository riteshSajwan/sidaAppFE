import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useFormStyle } from 'src/common/assets/styles/form';
import Customdropdown from 'src/common/components/CustomDropdown/CustomDropdown';
import ErrorMessageContainer from 'src/common/components/ErrorMessage/ErrorMessage';
import { useAppTheme } from 'src/common/context/AppTheme';
import DocumentUploads from 'src/components/ArchitectDetails/DocumentUploads/DocumentUploads';
import {
  generateInitialErrorsFromFields,
  generateInitialFilesStateFromFields,
  IDocumentErrors,
  IDocumentFilesState,
  validateDocumentUploadsForFields,
} from 'src/components/ArchitectDetails/DocumentUploads/DocumentUploadsUtils';
import { Routes } from 'src/routing/paths';
import { Icon } from 'src/submodules/iconlibrary/src';
import { sectionStyles, stepStyles, styles } from './Registration';
import {
  CITY_OTHER_FIELD,
  CITY_ROW_BASE,
  CONTACT_FIELDS,
  generateInitialFormErrors,
  IDropdownOption,
  IFormField,
  INITIAL_FORM,
  IRegistrationForm,
  IRegistrationFormErrors,
  PERSONAL_FIELDS,
  PRIVATE_ARCH_ATTACHMENT_FIELDS,
  PRIVATE_ARCH_AUTHORITY_FIELD,
  PRIVATE_ARCH_ONLY_FIELDS,
  SHARED_REG_FIELDS,
  STEPS,
  validateRegistrationForm,
} from './RegistrationUtils';

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <View style={stepStyles.row}>
      {STEPS.map((step, index) => {
        const isDone   = index < currentStep;
        const isActive = index === currentStep;
        return (
          <React.Fragment key={step.key}>
            <View style={stepStyles.item}>
              <View style={[stepStyles.circle, (isDone || isActive) && stepStyles.circleActive]}>
                {isDone ? (
                  <Icon name="tick" size={15} color="#fff" />
                ) : (
                  <Text style={[stepStyles.circleText, isActive && stepStyles.circleTextActive]}>
                    {index + 1}
                  </Text>
                )}
              </View>
              <Text style={[stepStyles.label, isActive && stepStyles.labelActive]}>
                {step.label}
              </Text>
            </View>
            {index < STEPS.length - 1 && (
              <View style={[stepStyles.line, isDone && stepStyles.lineActive]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────

function SectionHeading({ title }: { title: string }) {
  return (
    <View style={sectionStyles.container}>
      <Text style={sectionStyles.text}>{title}</Text>
    </View>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const Registration: React.FC = () => {
  const { t: TranslateMessage } = useTranslation();
  const { theme }  = useAppTheme();
  const formStyle  = useFormStyle();

  const tArch = useCallback(
    (key: string, opts?: Record<string, string>) =>
      TranslateMessage(`Admin.Sida.App.PrivateArchReg.${key}` as any, opts),
    [TranslateMessage],
  );

  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm]               = useState<IRegistrationForm>(INITIAL_FORM);
  const [formErrors, setFormErrors]   = useState<IRegistrationFormErrors>(generateInitialFormErrors);
  const [attachmentFiles, setAttachmentFiles] = useState<IDocumentFilesState>(
    () => generateInitialFilesStateFromFields(PRIVATE_ARCH_ATTACHMENT_FIELDS),
  );
  const [attachmentErrors, setAttachmentErrors] = useState<IDocumentErrors>(
    () => generateInitialErrorsFromFields(PRIVATE_ARCH_ATTACHMENT_FIELDS),
  );
  const [attachmentPickerErrors, setAttachmentPickerErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // ── Field setters ─────────────────────────────────────────────────────────

  const setField = useCallback(
    (key: keyof IRegistrationForm) => (value: string) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setFormErrors((prev) => ({ ...prev, [key]: '' }));
    },
    [],
  );

  const setDropdown = useCallback(
    (key: keyof IRegistrationForm) => (item: IDropdownOption) => {
      setForm((prev) => ({ ...prev, [key]: item.value }));
      setFormErrors((prev) => ({ ...prev, [key]: '' }));
    },
    [],
  );

  // ── Render helpers ────────────────────────────────────────────────────────

  const renderField = useCallback((field: IFormField, label: string) => {
    const error = formErrors[field.key] as string | undefined;
    return (
      <View key={field.key} style={formStyle.formCol}>
        <Text style={formStyle.labelTitle}>
          {label}
          {field.required && <Text style={formStyle.asteriskTxt}> *</Text>}
        </Text>
        <TextInput
          mode="outlined"
          value={form[field.key] as string}
          onChangeText={setField(field.key)}
          placeholder={label}
          placeholderTextColor={theme.colors.textNeutral}
          keyboardType={field.keyboardType ?? 'default'}
          autoCapitalize="none"
          autoComplete="off"
          activeOutlineColor={theme.colors.borderInverse}
          outlineColor={error ? theme.colors.borderErrorInverse : theme.colors.borderMedium}
          style={[formStyle.inputField, !!error && formStyle.errorBorderColor]}
          contentStyle={formStyle.textInputLabel}
          outlineStyle={formStyle.inputFieldOuline}
          error={!!error}
        />
        {!!error && <ErrorMessageContainer message={error} />}
      </View>
    );
  }, [form, formErrors, formStyle, setField, theme]);

  const renderDropdown = useCallback((field: IFormField, label: string) => {
    const error    = formErrors[field.key] as string | undefined;
    const strValue = form[field.key] as string;
    const selected = (field.options ?? []).find((o) => o.value === strValue)
      ?? { label: '', value: '' };
    return (
      <View key={field.key} style={formStyle.formCol}>
        <Text style={formStyle.labelTitle}>
          {label}
          {field.required && <Text style={formStyle.asteriskTxt}> *</Text>}
        </Text>
        <Customdropdown
          data={field.options ?? []}
          selectedValue={selected}
          onChange={setDropdown(field.key)}
          error={error}
        />
        {!!error && <ErrorMessageContainer message={error} />}
      </View>
    );
  }, [form, formErrors, formStyle, setDropdown]);

  const renderFormField = useCallback((field: IFormField, label: string) => {
    if (field.fieldType === 'dropdown' && field.options) return renderDropdown(field, label);
    return renderField(field, label);
  }, [renderDropdown, renderField]);

  const renderRow = useCallback((
    row: IFormField[],
    resolveLabel: (f: IFormField) => string = (f) => tArch(f.labelKey),
  ) => (
    <View style={formStyle.formRow}>
      {row.map((field) => renderFormField(field, resolveLabel(field)))}
    </View>
  ), [formStyle, renderFormField, tArch]);

  const renderRows = useCallback((
    rows: IFormField[][],
    resolveLabel?: (f: IFormField) => string,
  ) =>
    rows.map((row, i) => (
      <React.Fragment key={i}>{renderRow(row, resolveLabel)}</React.Fragment>
    )),
  [renderRow]);

  // ── Validation ────────────────────────────────────────────────────────────

  const validateStep1 = useCallback(() => {
    const { isValid, errors } = validateRegistrationForm(form, tArch);
    setFormErrors(errors);
    return isValid;
  }, [form, tArch]);

  const validateStep2 = useCallback(() => {
    const { isValid, errors: attachErrs } = validateDocumentUploadsForFields(
      attachmentFiles,
      PRIVATE_ARCH_ATTACHMENT_FIELDS,
    );
    setAttachmentErrors(attachErrs);
    return isValid;
  }, [attachmentFiles]);

  // ── Navigation ────────────────────────────────────────────────────────────

  const handleNext   = () => { if (validateStep1()) setCurrentStep(1); };
  const handleBack   = () => setCurrentStep(0);

  const handleSubmit = useCallback(async () => {
    if (!form.declared) {
      setFormErrors((prev) => ({
        ...prev,
        declared: tArch('Required', { field: 'Declaration' }),
      }));
      return;
    }
    if (!validateStep2()) return;
    setLoading(true);
    try {
      console.log('Submit registration', { form, attachmentFiles });
    } catch {
      setAttachmentErrors((prev: IDocumentErrors) => ({
        ...prev,
        apiError: TranslateMessage('Admin.Sida.App.DocumentUpload.ApiError' as any),
      }));
    } finally {
      setLoading(false);
    }
  }, [validateStep2, attachmentFiles, form, TranslateMessage, tArch]);

  const cityRow: IFormField[] = [CITY_ROW_BASE[0], CITY_OTHER_FIELD, CITY_ROW_BASE[1]];

  function renderFooter() {
    return (
      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Already registered? </Text>
        <Pressable
          onPress={() => router.replace(Routes.LOGIN as any)}
          accessibilityRole="link"
        >
          <Text style={styles.footerLink}>Sign in</Text>
        </Pressable>
      </View>
    );
  }
  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.scroll}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>

        {/* ── Left panel ── */}
        <View style={styles.leftPanel}>
          <View>
            <Text style={styles.leftTitle}>Smart City{'\n'}Building Services</Text>
            <Text style={styles.leftSubtitle}>
              Register as a Private Architect to submit building permit
              applications on behalf of citizens.
            </Text>
          </View>
          <View style={styles.stepSection}>
            <Text style={styles.stepLabel}>Progress</Text>
            <StepIndicator currentStep={currentStep} />
          </View>
        </View>

        {/* ── Right panel ── */}
        <View style={styles.rightPanel}>
          <Text style={styles.brandName}>SIDA</Text>
          <Text style={styles.pageHeading}>
            {currentStep === 0 ? 'Architect Registration' : 'Upload Documents'}
          </Text>
          <Text style={styles.pageSubtitle}>
            {currentStep === 0
              ? 'Step 1 of 2 — Fill in your personal and professional details'
              : 'Step 2 of 2 — Upload the required supporting documents'}
          </Text>

          {/* ══ STEP 1 ══ */}
          {currentStep === 0 && (
            <>
              <SectionHeading title={tArch('PersonalInfo')} />
              {renderRows(PERSONAL_FIELDS)}

              <SectionHeading title={tArch('ContactInfo')} />
              {renderRows(CONTACT_FIELDS.slice(0, 1))}
              {renderRows(CONTACT_FIELDS.slice(1, 2))}
              {renderRow(cityRow)}

              {/* Mobile / Email / RegAuthority */}
              <View style={formStyle.formRow}>
                {CONTACT_FIELDS[2].map((field) =>
                  renderFormField(field, tArch(field.labelKey)),
                )}
                {renderField(PRIVATE_ARCH_AUTHORITY_FIELD, tArch(PRIVATE_ARCH_AUTHORITY_FIELD.labelKey))}
              </View>

              <SectionHeading title={tArch('RegDetails')} />
              {renderRow(PRIVATE_ARCH_ONLY_FIELDS[0])}
              {renderRow(SHARED_REG_FIELDS)}

              <SectionHeading title={tArch('EduInfo')} />
              {renderRow(PRIVATE_ARCH_ONLY_FIELDS[1])}

              <View style={styles.btnRowEnd}>
                <Pressable
                  onPress={handleNext}
                  style={styles.primaryBtn}
                  accessibilityRole="button"
                >
                  <Text style={styles.primaryBtnText}>Save &amp; Continue →</Text>
                </Pressable>
              </View>
            </>
          )}

          {/* ══ STEP 2 ══ */}
          {currentStep === 1 && (
            <>
              <DocumentUploads
                fields={PRIVATE_ARCH_ATTACHMENT_FIELDS}
                sectionTitle={tArch('Attachments')}
                errors={attachmentErrors}
                setErrors={setAttachmentErrors}
                pickerErrors={attachmentPickerErrors}
                setPickerErrors={setAttachmentPickerErrors}
                files={attachmentFiles}
                onFilesChange={setAttachmentFiles}
              />

              {/* Declaration */}
              <Pressable
                style={styles.checkRow}
                onPress={() => {
                  setForm((prev) => ({ ...prev, declared: !prev.declared }));
                  setFormErrors((prev) => ({ ...prev, declared: '' }));
                }}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: form.declared }}
              >
                <View style={[styles.checkbox, form.declared && styles.checkboxChecked]}>
                  {form.declared && <Icon name="tick" size={13} color="#fff" />}
                </View>
                <Text style={styles.checkLabel}>{tArch('Declaration')}</Text>
              </Pressable>
              {!!formErrors.declared && (
                <ErrorMessageContainer message={formErrors.declared} />
              )}
              {!!attachmentErrors.apiError && (
                <ErrorMessageContainer message={attachmentErrors.apiError} />
              )}

              <View style={styles.btnRow}>
                <Pressable
                  onPress={handleBack}
                  style={styles.outlineBtn}
                  accessibilityRole="button"
                >
                  <Text style={styles.outlineBtnText}>← Back</Text>
                </Pressable>
                <Pressable
                  onPress={handleSubmit}
                  disabled={loading}
                  style={[styles.primaryBtn, loading && styles.disabledBtn]}
                  accessibilityRole="button"
                >
                  <Text style={styles.primaryBtnText}>
                    {loading ? 'Submitting…' : tArch('Submit')}
                  </Text>
                </Pressable>
              </View>
            </>
          )}

          {renderFooter()}
        </View>

      </View>
    </ScrollView>
  );
};

export default Registration;
