import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
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
} from 'src/components/ArchitectDetails/DocumentUploads/DocumentUploadsUtils';
import { Icon } from 'src/submodules/iconlibrary/src';
import {
  INITIAL_FORM,
  IRegistrationForm,
  PRIVATE_ARCH_ATTACHMENT_FIELDS,
  RegistrationMode,
  STRUCTURAL_REGISTRATION_ATTACHMENT_FIELDS,
} from './RegistrationUtils';

// ─── Props ────────────────────────────────────────────────────────────────────

interface RegistrationContainerProps {
  mode: RegistrationMode;
}

// ─── Reusable field ───────────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  error?: string;
}

const Field: React.FC<FieldProps> = ({
  label, value, onChange, required, placeholder, keyboardType = 'default', error,
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
        placeholder={placeholder ?? label}
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

// ─── Section heading ──────────────────────────────────────────────────────────

const SectionHeading: React.FC<{ title: string }> = ({ title }) => {
  const formStyle = useFormStyle();
  return (
    <Text style={[formStyle.labelHeadTitle, { marginTop: 20, marginBottom: 8 }]}>
      {title}
    </Text>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const RegistrationContainer: React.FC<RegistrationContainerProps> = ({ mode}) => {
  const { t } = useTranslation();
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
    () => generateInitialFilesStateFromFields(attachmentFields)
  );
  const [attachmentErrors, setAttachmentErrors] = useState<IDocumentErrors>(
    () => generateInitialErrorsFromFields(attachmentFields)
  );
  const [attachmentPickerErrors, setAttachmentPickerErrors] = useState<Record<string, string>>({});

  const set = (field: keyof IRegistrationForm) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  // ── i18n prefix helpers ────────────────────────────────────────────────────
  // Shared keys live under Registration.*; Private Arch extras under PrivateArchReg.*
  const tReg = (key: string, opts?: Record<string, string>) =>
    t(`Admin.Sida.App.Registration.${key}` as any, opts);
  const tArch = (key: string, opts?: Record<string, string>) =>
    t(`Admin.Sida.App.PrivateArchReg.${key}` as any, opts);
  // For fields that exist in both namespaces with the same meaning we prefer
  // the shared Registration.* key; arch-only fields use PrivateArchReg.*
  const tField = isPrivateArch ? tArch : tReg;

  const validate = (): boolean => {
    const e: Partial<Record<keyof IRegistrationForm, string>> = {};

    const req = (field: keyof IRegistrationForm, label: string) => {
      const val = form[field];
      if (!val || (typeof val === 'string' && !val.trim())) {
        e[field] = tField('Required', { field: label });
      }
    };

    // Shared required fields
    req('firstName', tField('FirstName'));
    req('lastName', tField('LastName'));
    req('mobileNumber', tField('Mobile'));
    req('email', tField('Email'));
    req('regLicenseNo', tField('RegLicenseNo'));

    if (isPrivateArch) {
      // Private Architect specific
      req('appType', tArch('AppType'));
      req('instituteName', tArch('InstituteName'));
      req('yearOfPassing', tArch('YearOfPassing'));
    } else {
      // Structural Engineer specific
      req('qualification', tReg('Qualification'));
    }

    if (!form.declared) {
      e.declared = tField('Required', { field: 'Declaration' }) as any;
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    // TODO: dispatch registration action based on mode
  };

  // ── Attachment section title ───────────────────────────────────────────────
  const attachmentTitle = isPrivateArch
    ? tArch('Attachments')
    : tReg('Attachments');

  // ── Declaration / Submit i18n ─────────────────────────────────────────────
  const declarationText = isPrivateArch
    ? tArch('Declaration')
    : tReg('Declaration');
  const submitText = isPrivateArch ? tArch('Submit') : tReg('Submit');
  const pageTitle = isPrivateArch
    ? tArch('Title')
    : tReg('Title');

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
          {pageTitle}
        </Text>

        {/* ══ Personal Information (shared) ════════════════════════════════ */}
        <SectionHeading title={tField('PersonalInfo')} />
        <View style={formStyle.formRow}>
          <Field label={tField('FirstName')} value={form.firstName} onChange={set('firstName')} required error={errors.firstName} />
          <Field label={tField('MiddleName')} value={form.middleName} onChange={set('middleName')} />
          <Field label={tField('LastName')} value={form.lastName} onChange={set('lastName')} required error={errors.lastName} />
        </View>
        <View style={formStyle.formRow}>
          {/* Structural uses FatherName/SpouseName keys; Private Arch uses Father/Spouse */}
          <Field
            label={isPrivateArch ? tArch('Father') : tReg('FatherName')}
            value={form.father}
            onChange={set('father')}
          />
          <Field
            label={isPrivateArch ? tArch('Spouse') : tReg('SpouseName')}
            value={form.spouse}
            onChange={set('spouse')}
          />
          <Field
            label={isPrivateArch ? tArch('FatherName') : tReg('FatherName')}
            value={form.fatherName}
            onChange={set('fatherName')}
            required
          />
        </View>

        {/* ══ Contact Information (shared) ══════════════════════════════════ */}
        <SectionHeading title={tField('ContactInfo')} />
        <View style={formStyle.formRow}>
          <Field label={tField('MailingAddress')} value={form.mailingAddress} onChange={set('mailingAddress')} />
        </View>
        <View style={formStyle.formRow}>
          <Field label={tField('State')} value={form.state} onChange={set('state')} />
          <Field label={tField('District')} value={form.district} onChange={set('district')} />
          <Field label={tField('Tehsil')} value={form.tehsil} onChange={set('tehsil')} />
        </View>
        <View style={formStyle.formRow}>
          <Field label={tField('City')} value={form.cityVillage} onChange={set('cityVillage')} />
          {/* Private Arch shows an extra "Other City/Village" field */}
          {isPrivateArch && (
            <Field label={tArch('CityOther')} value={form.cityVillageOther} onChange={set('cityVillageOther')} />
          )}
          <Field label={tField('Pincode')} value={form.pinCode} onChange={set('pinCode')} keyboardType="numeric" />
          {!isPrivateArch && <View style={formStyle.formCol} />}
        </View>
        <View style={formStyle.formRow}>
          <Field label={tField('Mobile')} value={form.mobileNumber} onChange={set('mobileNumber')} required keyboardType="phone-pad" error={errors.mobileNumber} />
          <Field label={tField('Email')} value={form.email} onChange={set('email')} required keyboardType="email-address" error={errors.email} />
          {/* Structural: "Authority" | Private Arch: "Register Authority (Private)" */}
          {isPrivateArch
            ? <Field label={tArch('RegAuthority')} value={form.regAuthority} onChange={set('regAuthority')} />
            : <Field label={tReg('Authority')} value={form.authority} onChange={set('authority')} />
          }
        </View>

        {/* ══ Organisation Details (Structural only) ════════════════════════ */}
        {!isPrivateArch && (
          <>
            <SectionHeading title={tReg('OrgDetails')} />
            <View style={formStyle.formRow}>
              <Field label={tReg('OrgName')} value={form.organisationName} onChange={set('organisationName')} required />
              <View style={formStyle.formCol} />
              <View style={formStyle.formCol} />
            </View>
          </>
        )}

        {/* ══ Professional Details (Structural only) ════════════════════════ */}
        {!isPrivateArch && (
          <>
            <SectionHeading title={tReg('ProfDetails')} />
            <View style={formStyle.formRow}>
              <Field label={tReg('Qualification')} value={form.qualification} onChange={set('qualification')} required error={errors.qualification} />
              <View style={formStyle.formCol} />
              <View style={formStyle.formCol} />
            </View>
          </>
        )}

        {/* ══ Registration Details (shared, with mode-specific extra fields) ═ */}
        <SectionHeading title={tField('RegDetails')} />
        {isPrivateArch && (
          <View style={formStyle.formRow}>
            <Field label={tArch('AppType')} value={form.appType} onChange={set('appType')} required error={errors.appType} />
            <Field label={tArch('NoOfYears')} value={form.noOfYears} onChange={set('noOfYears')} keyboardType="numeric" />
            <View style={formStyle.formCol} />
          </View>
        )}
        <View style={formStyle.formRow}>
          <Field label={tField('RegLicenseNo')} value={form.regLicenseNo} onChange={set('regLicenseNo')} required error={errors.regLicenseNo} />
          <Field label={tField('Validity')} value={form.validity} onChange={set('validity')} required />
          <View style={formStyle.formCol} />
        </View>
        {!isPrivateArch && (
          <View style={formStyle.formRow}>
            <Field label={tReg('YearsOfExperience')} value={form.yearsOfExperience} onChange={set('yearsOfExperience')} required keyboardType="numeric" />
            <Field label={tReg('Grade')} value={form.grade} onChange={set('grade')} required />
            <View style={formStyle.formCol} />
          </View>
        )}

        {/* ══ Education Information (Private Arch only) ════════════════════ */}
        {isPrivateArch && (
          <>
            <SectionHeading title={tArch('EduInfo')} />
            <View style={formStyle.formRow}>
              <Field label={tArch('InstituteName')} value={form.instituteName} onChange={set('instituteName')} required error={errors.instituteName} />
              <Field label={tArch('YearOfPassing')} value={form.yearOfPassing} onChange={set('yearOfPassing')} required keyboardType="numeric" error={errors.yearOfPassing} />
              <View style={formStyle.formCol} />
            </View>
          </>
        )}

        {/* ══ Attachments ══════════════════════════════════════════════════ */}
        <DocumentUploads
          fields={attachmentFields}
          sectionTitle={attachmentTitle}
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
          <Text style={formStyle.checkBoxlabel}>{declarationText}</Text>
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
              {submitText}
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

export default RegistrationContainer;
