import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { TextInput as PaperInput } from 'react-native-paper';
import { useButtonStyle } from 'src/common/assets/styles/button';
import { useFormStyle } from 'src/common/assets/styles/form';
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
  IFormField,
  INITIAL_FORM,
  IRegistrationForm,
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
} from './RegistrationUtils';

// ─── Props ────────────────────────────────────────────────────────────────────

interface RegistrationContainerProps {
  mode?: RegistrationMode;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  error?: string;
}

const Field: React.FC<FieldProps> = ({
  label, value, onChange, required, keyboardType = 'default', error,
}) => {
  const formStyle = useFormStyle();
  const { theme } = useAppTheme();
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
};


// ─── Main Component ───────────────────────────────────────────────────────────

const RegistrationContainer: React.FC<RegistrationContainerProps> = ({
  mode = 'structural',
}) => {
   const { t: TranslateMessage } = useTranslation();
  const { theme } = useAppTheme();
  const formStyle = useFormStyle();
  const button = useButtonStyle();

  const isPrivateArch = mode === 'privateArchitect';
  const attachmentFields = isPrivateArch
    ? PRIVATE_ARCH_ATTACHMENT_FIELDS
    : STRUCTURAL_REGISTRATION_ATTACHMENT_FIELDS;

  const [form, setForm] = useState<IRegistrationForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof IRegistrationForm, string>>>({});
  const [attachmentFiles, setAttachmentFiles] = useState<IDocumentFilesState>(
    () => generateInitialFilesStateFromFields(attachmentFields),
  );
  const [attachmentErrors, setAttachmentErrors] = useState<IDocumentErrors>(
    () => generateInitialErrorsFromFields(attachmentFields),
  );
  const [attachmentPickerErrors, setAttachmentPickerErrors] = useState<Record<string, string>>({});

  // ── i18n helpers ──────────────────────────────────────────────────────────
  // Structural keys live under Registration.*; Private Arch under PrivateArchReg.*
  const tReg = (key: string, opts?: Record<string, string>) =>
    TranslateMessage(`Admin.Sida.App.Registration.${key}` as any, opts);
  const tArch = (key: string, opts?: Record<string, string>) =>
    TranslateMessage(`Admin.Sida.App.PrivateArchReg.${key}` as any, opts);
  // tField resolves using the active mode's namespace
  const tField = isPrivateArch ? tArch : tReg;

  // ── Field setters ─────────────────────────────────────────────────────────
  const set = (key: keyof IRegistrationForm) => (value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  // ── Render a row of fields from config ───────────────────────────────────
  // `resolveLabel` lets callers override the namespace per field if needed
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
          error={errors[field.key] as string | undefined}
        />
      ))}
    </View>
  );

  // Render multiple rows at once
  const renderRows = (
    rows: IFormField[][],
    resolveLabel?: (f: IFormField) => string,
  ) => rows.map((row, i) => (
    <React.Fragment key={i}>{renderRow(row, resolveLabel)}</React.Fragment>
  ));

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const e: Partial<Record<keyof IRegistrationForm, string>> = {};

    const req = (key: keyof IRegistrationForm, label: string) => {
      const val = form[key];
      if (!val || (typeof val === 'string' && !val.trim())) {
        e[key] = tField('Required', { field: label });
      }
    };

    // Derive required fields from config arrays — no duplication
    const requiredFields: Array<[keyof IRegistrationForm, string]> = [
      ...SHARED_PERSONAL_FIELDS.flat()
        .filter((f) => f.required)
        .map((f): [keyof IRegistrationForm, string] => [f.key, tField(f.labelKey)]),
      ...SHARED_CONTACT_FIELDS.flat()
        .filter((f) => f.required)
        .map((f): [keyof IRegistrationForm, string] => [f.key, tField(f.labelKey)]),
      ...SHARED_REG_FIELDS
        .filter((f) => f.required)
        .map((f): [keyof IRegistrationForm, string] => [f.key, tField(f.labelKey)]),
      ...(isPrivateArch
        ? PRIVATE_ARCH_ONLY_FIELDS.flat()
          .filter((f) => f.required)
          .map((f): [keyof IRegistrationForm, string] => [f.key, tArch(f.labelKey)])
        : STRUCTURAL_ONLY_FIELDS.flat()
          .filter((f) => f.required)
          .map((f): [keyof IRegistrationForm, string] => [f.key, tReg(f.labelKey)])
      ),
    ];

    requiredFields.forEach(([key, label]) => req(key, label));

    if (!form.declared) {
      e.declared = tField('Required', { field: 'Declaration' }) as any;
    }

    setErrors(e);

    // Attachment validation — uses the active field list
    const { isValid: attachmentsValid, errors: attachmentValidationErrors } =
      validateDocumentUploadsForFields(attachmentFiles, attachmentFields);
    setAttachmentErrors(attachmentValidationErrors);

    return Object.keys(e).length === 0 && attachmentsValid;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    // TODO: dispatch registration action based on mode
  };

  // ── City row: Private Arch inserts CityOther between City and Pincode ────
  const cityRow: IFormField[] = isPrivateArch
    ? [CITY_ROW_BASE[0], CITY_OTHER_FIELD, CITY_ROW_BASE[1]]
    : [...CITY_ROW_BASE];

  // Authority field label differs per mode but occupies the same slot
  const authorityField = isPrivateArch ? PRIVATE_ARCH_AUTHORITY_FIELD : STRUCTURAL_AUTHORITY_FIELD;
  const resolveAuthorityLabel = (f: IFormField) =>
    isPrivateArch ? tArch(f.labelKey) : tReg(f.labelKey);


  function SelectionHeading(title:string) {
    return (
      <Text style={[formStyle.labelHeadTitle, { marginTop: 20, marginBottom: 8 }]}>
        {title}
      </Text>
    )
  }



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
        {SelectionHeading('PersonalInfo')}
        {renderRows(SHARED_PERSONAL_FIELDS)}

        {/* ══ Contact Information (shared) ══════════════════════════════════ */}
        {SelectionHeading('ContactInfo')}
        {/* MailingAddress, State/District/Tehsil */}
        {renderRows(SHARED_CONTACT_FIELDS.slice(0, 2))}
        {/* City row — Private Arch inserts CityOther between City and Pincode */}
        {renderRow(cityRow)}
        {/* Mobile + Email + Authority — one 3-column row; authority label differs per mode */}
        <View style={formStyle.formRow}>
          {SHARED_CONTACT_FIELDS[2].map((field) => (
            <Field
              key={field.key}
              label={tField(field.labelKey)}
              value={form[field.key] as string}
              onChange={set(field.key)}
              required={field.required}
              keyboardType={field.keyboardType}
              error={errors[field.key] as string | undefined}
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
            {SelectionHeading('OrgDetails')}
            <View style={formStyle.formRow}>
              <Field
                label={tReg(STRUCTURAL_ONLY_FIELDS[0][0].labelKey)}
                value={form[STRUCTURAL_ONLY_FIELDS[0][0].key] as string}
                onChange={set(STRUCTURAL_ONLY_FIELDS[0][0].key)}
                required={STRUCTURAL_ONLY_FIELDS[0][0].required}
                error={errors[STRUCTURAL_ONLY_FIELDS[0][0].key] as string | undefined}
              />
              <View style={formStyle.formCol} />
              <View style={formStyle.formCol} />
            </View>
            {/* <SectionHeading title={tReg('ProfDetails')} /> */}
            {SelectionHeading('ProfDetails')}
            <View style={formStyle.formRow}>
              <Field
                label={tReg(STRUCTURAL_ONLY_FIELDS[1][0].labelKey)}
                value={form[STRUCTURAL_ONLY_FIELDS[1][0].key] as string}
                onChange={set(STRUCTURAL_ONLY_FIELDS[1][0].key)}
                required={STRUCTURAL_ONLY_FIELDS[1][0].required}
                error={errors[STRUCTURAL_ONLY_FIELDS[1][0].key] as string | undefined}
              />
              <View style={formStyle.formCol} />
              <View style={formStyle.formCol} />
            </View>
          </>
        )}

        {/* ══ Registration Details ══════════════════════════════════════════ */}
        {/* <SectionHeading title={tField('RegDetails')} /> */}
        {SelectionHeading('RegDetails')}
        {/* Private Arch: AppType + NoOfYears row first */}
        {isPrivateArch && renderRow(PRIVATE_ARCH_ONLY_FIELDS[0], (f) => tArch(f.labelKey))}
        {/* Shared: RegLicenseNo + Validity */}
        {renderRow(SHARED_REG_FIELDS)}
        {/* Structural: YearsOfExperience + Grade */}
        {!isPrivateArch && renderRow(STRUCTURAL_ONLY_FIELDS[2], (f) => tReg(f.labelKey))}

        {/* ══ Education Information (Private Arch only) ════════════════════ */}
        {isPrivateArch && (
          <>   
            {SelectionHeading('EduInfo')}
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
          onPress={() => setForm((prev) => ({ ...prev, declared: !prev.declared }))}
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
        {errors.declared && (
          <Text style={[formStyle.errorMessage, { marginTop: -theme.spacing.sm, marginBottom: theme.spacing.md }]}>
            {errors.declared as string}
          </Text>
        )}

        {/* ══ Submit ═══════════════════════════════════════════════════════ */}
        <View style={{ alignItems: 'flex-end' }}>
          <Pressable onPress={handleSubmit} accessibilityRole="button">
            <Text style={[button.btnBase, button.btnPrimary, { minWidth: 180, textAlign: 'center' }]}>
              {isPrivateArch ? tArch('Submit') : tReg('Submit')}
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

export default RegistrationContainer;
