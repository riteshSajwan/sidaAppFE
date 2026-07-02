import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { TextInput as PaperInput } from 'react-native-paper';
import { useButtonStyle } from 'src/common/assets/styles/button';
import { useFormStyle } from 'src/common/assets/styles/form';
import Customdropdown from 'src/common/components/CustomDropdown/CustomDropdown';
import { useAppTheme } from 'src/common/context/AppTheme';
import DocumentUploads from 'src/components/ArchitectDetails/DocumentUploads/DocumentUploads';
import {
  generateInitialErrorsFromFields,
  generateInitialFilesStateFromFields,
  IDocumentErrors,
  IDocumentFilesState,
  validateDocumentUploadsForFields,
} from 'src/components/ArchitectDetails/DocumentUploads/DocumentUploadsUtils';
import { Icon } from 'src/submodules/iconlibrary/src';
import {
  CITY_OTHER_FIELD,
  CITY_ROW_BASE,
  generateInitialFormErrors,
  IDropdownOption,
  IFormField,
  INITIAL_FORM,
  IRegistrationForm,
  IRegistrationFormErrors,
  PRIVATE_ARCH_ATTACHMENT_FIELDS,
  PRIVATE_ARCH_AUTHORITY_FIELD,
  PRIVATE_ARCH_ONLY_FIELDS,
  RegistrationMode,
  SHARED_CONTACT_FIELDS,
  SHARED_PERSONAL_FIELDS,
  SHARED_REG_FIELDS,
  STRUCTURAL_AUTHORITY_FIELD,
  STRUCTURAL_ONLY_FIELDS,
  STRUCTURAL_REGISTRATION_ATTACHMENT_FIELDS,
  validateRegistrationForm
} from './RegistrationUtils';

// ─── Props ────────────────────────────────────────────────────────────────────

interface RegistrationContainerProps {
  mode: RegistrationMode;
}

// ─── Main Component ───────────────────────────────────────────────────────────

const RegistrationContainer: React.FC<RegistrationContainerProps> = ({
  mode 
}) => {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const formStyle = useFormStyle();
  const button = useButtonStyle();

  const isPrivateArch = mode === 'privateArchitect';
  const attachmentFields = isPrivateArch
    ? PRIVATE_ARCH_ATTACHMENT_FIELDS
    : STRUCTURAL_REGISTRATION_ATTACHMENT_FIELDS;

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<IRegistrationForm>(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState<IRegistrationFormErrors>(generateInitialFormErrors);
  const [attachmentFiles, setAttachmentFiles] = useState<IDocumentFilesState>(
    () => generateInitialFilesStateFromFields(attachmentFields),
  );
  const [attachmentErrors, setAttachmentErrors] = useState<IDocumentErrors>(
    () => generateInitialErrorsFromFields(attachmentFields),
  );
  const [attachmentPickerErrors, setAttachmentPickerErrors] = useState<Record<string, string>>({});

  // ── Inner render functions ────────────────────────────────────────────────

  function Field({
    label, value, onChange, required, keyboardType = 'default', error,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    required?: boolean;
    keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
    error?: string;
  }) {
    return (
      <View style={formStyle.formCol}>
        <Text style={formStyle.labelTitle}>
          {label}
          {required && <Text style={formStyle.asteriskTxt}> *</Text>}
        </Text>
        <PaperInput
          mode="outlined"
          value={value}
          onChangeText={onChange}
          placeholder={label}
          placeholderTextColor={theme.colors.textNeutral}
          keyboardType={keyboardType}
          autoCapitalize="none"
          activeOutlineColor={theme.colors.borderInverse}
          outlineColor={theme.colors.borderMedium}
          style={formStyle.inputField}
          contentStyle={formStyle.textInputLabel}
          outlineStyle={formStyle.inputFieldOuline}
          error={!!error}
        />
        {!!error && <Text style={formStyle.errorMessage}>{error}</Text>}
      </View>
    );
  }

  function SectionHeading( title : string ) {
    return (
      <Text style={[formStyle.labelHeadTitle, { marginTop: 20, marginBottom: 8 }]}>
        {title}
      </Text>
    );
  }

  function DropdownField({
    label, value, onChange, required, options, error,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    required?: boolean;
    options: IDropdownOption[];
    error?: string;
  }) {
    return (
      <View style={formStyle.formCol}>
        <Text style={formStyle.labelTitle}>
          {label}
          {required && <Text style={formStyle.asteriskTxt}> *</Text>}
        </Text>
        <Customdropdown
          data={options}
          selectedValue={
            options.find((o) => o.value === value) ?? { label: '', value: '' }
          }
          onChange={(item) => onChange(item.value)}
          error={error}
        />
        {!!error && <Text style={formStyle.errorMessage}>{error}</Text>}
      </View>
    );
  }

  // ── i18n helpers ──────────────────────────────────────────────────────────
  const tReg  = (key: string, opts?: Record<string, string>) =>
    t(`Admin.Sida.App.Registration.${key}` as any, opts);
  const tArch = (key: string, opts?: Record<string, string>) =>
    t(`Admin.Sida.App.PrivateArchReg.${key}` as any, opts);
  const tField = isPrivateArch ? tArch : tReg;

  // ── Field setters ─────────────────────────────────────────────────────────
  const set = (key: keyof IRegistrationForm) => (value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFormErrors((prev) => ({ ...prev, [key]: '' }));
  };

  // ── Render helpers ────────────────────────────────────────────────────────
  const renderRow = (
    row: IFormField[],
    resolveLabel: (f: IFormField) => string = (f) => tField(f.labelKey),
  ) => (
    <View style={formStyle.formRow}>
      {row.map((field) => (
        <Field
          key={field.key}
          label={resolveLabel(field)}
          value={form[field.key] as string}
          onChange={set(field.key)}
          required={field.required}
          keyboardType={field.keyboardType}
          error={formErrors[field.key] as string | undefined}
        />
      ))}
    </View>
  );

  const renderRows = (
    rows: IFormField[][],
    resolveLabel?: (f: IFormField) => string,
  ) => rows.map((row, i) => (
    <React.Fragment key={i}>{renderRow(row, resolveLabel)}</React.Fragment>
  ));

  // ── Validation ────────────────────────────────────────────────────────────
  const validateForm = useCallback(() => {
    const { isValid, errors } = validateRegistrationForm(form, mode, tField);
    setFormErrors(errors);
    return isValid;
  }, [form, mode, tField]);

  // ── Submit — mirrors ArchitectDetailsPage.handleSubmit ────────────────────
  const handleSubmit = useCallback(async () => {
    const isFormValid = validateForm();
    const { isValid: isAttachmentsValid, errors: attachmentValidationErrors } =
      validateDocumentUploadsForFields(attachmentFiles, attachmentFields);
    setAttachmentErrors(attachmentValidationErrors);

    if (!isFormValid || !isAttachmentsValid) return;

    setLoading(true);
    try {
      // TODO: wire up registration API call
      console.log('Submit registration', { form, attachmentFiles, mode });
    } catch {
      setAttachmentErrors((prev: IDocumentErrors) => ({
        ...prev,
        apiError: t('Admin.Sida.App.DocumentUpload.ApiError' as any),
      }));
    } finally {
      setLoading(false);
    }
  }, [validateForm, attachmentFiles, attachmentFields, form, mode, t]);

  // ── City row: Private Arch adds CityOther between City and Pincode ────────
  const cityRow: IFormField[] = isPrivateArch
    ? [CITY_ROW_BASE[0], CITY_OTHER_FIELD, CITY_ROW_BASE[1]]
    : [...CITY_ROW_BASE];

  // Authority field — same column slot, different key and label per mode
  const authorityField = isPrivateArch ? PRIVATE_ARCH_AUTHORITY_FIELD : STRUCTURAL_AUTHORITY_FIELD;
  const resolveAuthorityLabel = (f: IFormField) =>
    isPrivateArch ? tArch(f.labelKey) : tReg(f.labelKey);

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.surfaceLow }}
      contentContainerStyle={{ padding: theme.spacing.xl, paddingBottom: 60 }}
      showsVerticalScrollIndicator
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled
    >
      <View
        style={{
          backgroundColor: theme.colors.surfaceBase,
          borderRadius: theme.roundness.md,
          padding: theme.spacing.xl,
          borderWidth: 1,
          borderColor: theme.colors.borderLow,
        }}
      >
        {/* ── Page title ── */}
        <Text
          style={{
            fontSize: theme.fontSize.S1Subtitle,
            fontFamily: theme.fontFamily.bold,
            color: theme.colors.textHeading,
            marginBottom: theme.spacing.xl,
          }}
        >
          {isPrivateArch ? tArch('Title') : tReg('Title')}
        </Text>

        {/* ══ Personal Information (shared) ════════════════════════════════ */}
        {/* <SectionHeading title={tField('PersonalInfo')} /> */}
        {SectionHeading('PersonalInfo')}
        {renderRows(SHARED_PERSONAL_FIELDS)}

        {/* ══ Contact Information (shared) ══════════════════════════════════ */}
        {/* <SectionHeading title={tField('ContactInfo')} /> */}
        {SectionHeading('ContactInfo')}
        {renderRows(SHARED_CONTACT_FIELDS.slice(0, 2))}
        {/* City row — Private Arch inserts CityOther between City and Pincode */}
        {renderRow(cityRow)}
        {/* Mobile + Email + Authority — single 3-column row */}
        <View style={formStyle.formRow}>
          {SHARED_CONTACT_FIELDS[2].map((field) => (
            <Field
              key={field.key}
              label={tField(field.labelKey)}
              value={form[field.key] as string}
              onChange={set(field.key)}
              required={field.required}
              keyboardType={field.keyboardType}
              error={formErrors[field.key] as string | undefined}
            />
          ))}
          <Field
            label={resolveAuthorityLabel(authorityField)}
            value={form[authorityField.key] as string}
            onChange={set(authorityField.key)}
          />
        </View>

        {/* ══ Organisation + Professional Details (Structural only) ════════ */}
        {!isPrivateArch && (
          <>
            {/* <SectionHeading title={tReg('OrgDetails')} /> */}
            {SectionHeading('OrgDetails')}
            <View style={formStyle.formRow}>
              <Field
                label={tReg(STRUCTURAL_ONLY_FIELDS[0][0].labelKey)}
                value={form[STRUCTURAL_ONLY_FIELDS[0][0].key] as string}
                onChange={set(STRUCTURAL_ONLY_FIELDS[0][0].key)}
                required={STRUCTURAL_ONLY_FIELDS[0][0].required}
                error={formErrors[STRUCTURAL_ONLY_FIELDS[0][0].key] as string | undefined}
              />
              <View style={formStyle.formCol} />
              <View style={formStyle.formCol} />
            </View>
            {/* <SectionHeading title={tReg('ProfDetails')} /> */}
            {SectionHeading('ProfDetails')}
            <View style={formStyle.formRow}>
              <Field
                label={tReg(STRUCTURAL_ONLY_FIELDS[1][0].labelKey)}
                value={form[STRUCTURAL_ONLY_FIELDS[1][0].key] as string}
                onChange={set(STRUCTURAL_ONLY_FIELDS[1][0].key)}
                required={STRUCTURAL_ONLY_FIELDS[1][0].required}
                error={formErrors[STRUCTURAL_ONLY_FIELDS[1][0].key] as string | undefined}
              />
              <View style={formStyle.formCol} />
              <View style={formStyle.formCol} />
            </View>
          </>
        )}

        {/* ══ Registration Details ══════════════════════════════════════════ */}
         {SectionHeading('RegDetails')}
        {/* Private Arch: AppType + NoOfYears row first */}
        {isPrivateArch && renderRow(PRIVATE_ARCH_ONLY_FIELDS[0], (f) => tArch(f.labelKey))}
        {/* Shared: RegLicenseNo + Validity */}
        {renderRow(SHARED_REG_FIELDS)}
        {/* Structural: YearsOfExperience + Grade */}
        {!isPrivateArch && renderRow(STRUCTURAL_ONLY_FIELDS[2], (f) => tReg(f.labelKey))}

        {/* ══ Education Information (Private Arch only) ════════════════════ */}
        {isPrivateArch && (
          <>
            {SectionHeading('EduInfo')}
            {renderRow(PRIVATE_ARCH_ONLY_FIELDS[1], (f) => tArch(f.labelKey))}
          </>
        )}

        {/* ══ Attachments ══════════════════════════════════════════════════ */}
        <DocumentUploads
          fields={attachmentFields}
          sectionTitle={isPrivateArch ? tArch('Attachments') : tReg('Attachments')}
          errors={attachmentErrors}
          setErrors={setAttachmentErrors}
          pickerErrors={attachmentPickerErrors}
          setPickerErrors={setAttachmentPickerErrors}
          files={attachmentFiles}
          onFilesChange={setAttachmentFiles}
        />

        {/* ══ Declaration ══════════════════════════════════════════════════ */}
        <Pressable
          style={[formStyle.checkBoxItem, { marginBottom: theme.spacing.xl }]}
          onPress={() => {
            setForm((prev) => ({ ...prev, declared: !prev.declared }));
            setFormErrors((prev) => ({ ...prev, declared: '' }));
          }}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: form.declared }}
        >
          <View style={[formStyle.checkBox, form.declared && formStyle.checkBoxChecked]}>
            {form.declared && (
              <Icon name="tick" size={14} color={theme.colors.textInverse} />
            )}
          </View>
          <Text style={formStyle.checkBoxlabel}>
            {isPrivateArch ? tArch('Declaration') : tReg('Declaration')}
          </Text>
        </Pressable>
        {formErrors.declared && (
          <Text style={[formStyle.errorMessage, { marginTop: -theme.spacing.sm, marginBottom: theme.spacing.md }]}>
            {formErrors.declared}
          </Text>
        )}

        {/* API-level error */}
        {!!attachmentErrors.apiError && (
          <Text style={[formStyle.errorMessage, { marginBottom: theme.spacing.md }]}>
            {attachmentErrors.apiError}
          </Text>
        )}

        {/* ══ Submit ═══════════════════════════════════════════════════════ */}
        <View style={{ alignItems: 'flex-end' }}>
          <Pressable
            onPress={handleSubmit}
            disabled={loading}
            accessibilityRole="button"
          >
            <Text style={[
              button.btnBase,
              button.btnPrimary,
              loading && button.btnDisabled,
              { minWidth: 180, textAlign: 'center' },
            ]}>
              {loading
                ? t('Admin.Sida.App.DocumentUpload.Submitting' as any)
                : isPrivateArch ? tArch('Submit') : tReg('Submit')
              }
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

export default RegistrationContainer;
