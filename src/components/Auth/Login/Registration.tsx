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
import { useUserStyle } from 'src/common/assets/styles/user';
import { useAppTheme } from 'src/common/context/AppTheme';
import DocumentUploads from 'src/components/ArchitectDetails/DocumentUploads/DocumentUploads';
import {
  FORMAT,
  generateInitialErrorsFromFields,
  generateInitialFilesStateFromFields,
  IDocumentErrors,
  IDocumentField,
  IDocumentFilesState,
} from 'src/components/ArchitectDetails/DocumentUploads/DocumentUploadsUtils';
import { Icon } from 'src/submodules/iconlibrary/src';

// ─── Registration attachment fields (matches the 5 rows in the image) ──────────

const REGISTRATION_ATTACHMENT_FIELDS: IDocumentField[] = [
  {
    key: 'identity',
    labelKey: 'Admin.Sida.App.Registration.Attach1',
    required: true,
    allowedTypes: [...FORMAT.IMAGE, ...FORMAT.PDF],
    maxSizeBytes: 5 * 1024 * 1024,
  },
  {
    key: 'photo',
    labelKey: 'Admin.Sida.App.Registration.Attach2',
    required: true,
    allowedTypes: [...FORMAT.IMAGE],
    maxSizeBytes: 5 * 1024 * 1024,
  },
  {
    key: 'photoId',
    labelKey: 'Admin.Sida.App.Registration.Attach3',
    required: true,
    allowedTypes: [...FORMAT.IMAGE, ...FORMAT.PDF],
    maxSizeBytes: 5 * 1024 * 1024,
  },
  {
    key: 'experienceCert',
    labelKey: 'Admin.Sida.App.Registration.Attach4',
    required: false,
    allowedTypes: [...FORMAT.PDF],
    maxSizeBytes: 10 * 1024 * 1024,
  },
  {
    key: 'workAssignment',
    labelKey: 'Admin.Sida.App.Registration.Attach5',
    required: false,
    allowedTypes: [...FORMAT.PDF],
    maxSizeBytes: 10 * 1024 * 1024,
  },
];

// ─── Types ─────────────────────────────────────────────────────────────────────

interface IRegistrationForm {
  // Personal
  firstName: string;
  middleName: string;
  lastName: string;
  father: string;
  spouse: string;
  fatherName: string;
  // Contact
  mailingAddress: string;
  state: string;
  district: string;
  tehsil: string;
  cityVillage: string;
  pinCode: string;
  mobileNumber: string;
  email: string;
  authority: string;
  // Organisation
  organisationName: string;
  // Professional
  qualification: string;
  // Registration
  regLicenseNo: string;
  validity: string;
  yearsOfExperience: string;
  grade: string;
  // Declaration
  declared: boolean;
}

const INITIAL_FORM: IRegistrationForm = {
  firstName: '', middleName: '', lastName: '',
  father: '', spouse: '', fatherName: '',
  mailingAddress: '', state: '', district: '',
  tehsil: '', cityVillage: '', pinCode: '',
  mobileNumber: '', email: '', authority: '',
  organisationName: '',
  qualification: '',
  regLicenseNo: '', validity: '', yearsOfExperience: '', grade: '',
  declared: false,
};

// ─── Reusable field ─────────────────────────────────────────────────────────────

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

// ─── Section heading ────────────────────────────────────────────────────────────

const SectionHeading: React.FC<{ title: string }> = ({ title }) => {
  const formStyle = useFormStyle();
  return <Text style={[formStyle.labelHeadTitle, { marginTop: 20, marginBottom: 8 }]}>{title}</Text>;
};

// ─── Main Component ─────────────────────────────────────────────────────────────

const RegistrationContainer = () => {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const formStyle = useFormStyle();
  const userStyle = useUserStyle();
  const button = useButtonStyle();

  const [form, setForm] = useState<IRegistrationForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof IRegistrationForm, string>>>({});

  // ── Document attachment state ──────────────────────────────────────────
  const [attachmentFiles, setAttachmentFiles] = useState<IDocumentFilesState>(
    () => generateInitialFilesStateFromFields(REGISTRATION_ATTACHMENT_FIELDS)
  );
  const [attachmentErrors, setAttachmentErrors] = useState<IDocumentErrors>(
    () => generateInitialErrorsFromFields(REGISTRATION_ATTACHMENT_FIELDS)
  );
  const [attachmentPickerErrors, setAttachmentPickerErrors] = useState<Record<string, string>>({});

  const set = (field: keyof IRegistrationForm) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof IRegistrationForm, string>> = {};
    if (!form.firstName.trim()) e.firstName = t('Admin.Sida.App.Registration.Required', { field: t('Admin.Sida.App.Registration.FirstName') });
    if (!form.lastName.trim()) e.lastName = t('Admin.Sida.App.Registration.Required', { field: t('Admin.Sida.App.Registration.LastName') });
    if (!form.mobileNumber.trim()) e.mobileNumber = t('Admin.Sida.App.Registration.Required', { field: t('Admin.Sida.App.Registration.Mobile') });
    if (!form.email.trim()) e.email = t('Admin.Sida.App.Registration.Required', { field: t('Admin.Sida.App.Registration.Email') });
    if (!form.regLicenseNo.trim()) e.regLicenseNo = t('Admin.Sida.App.Registration.Required', { field: t('Admin.Sida.App.Registration.RegLicenseNo') });
    if (!form.qualification.trim()) e.qualification = t('Admin.Sida.App.Registration.Required', { field: t('Admin.Sida.App.Registration.Qualification') });
    if (!form.declared) e.declared = t('Admin.Sida.App.Registration.Required', { field: 'Declaration' }) as any;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    // TODO: dispatch registration action
  };

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.surfaceLow }}
      contentContainerStyle={{
        padding: theme.spacing.xl,
        paddingBottom: 60,
      }}
      showsVerticalScrollIndicator={true}
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled
    >
      {/* ── Page Title ── */}
      <View
        style={{
          backgroundColor: theme.colors.surfaceBase,
          borderRadius: theme.roundness.md,
          padding: theme.spacing.xl,
          borderWidth: 1,
          borderColor: theme.colors.borderLow,
        }}
      >
        <Text
          style={{
            fontSize: theme.fontSize.S1Subtitle,
            fontFamily: theme.fontFamily.bold,
            color: theme.colors.textHeading,
            marginBottom: theme.spacing.xl,
          }}
        >
          {t('Admin.Sida.App.Registration.Title')}
        </Text>

        {/* ══ Personal Information ══════════════════════════════════════ */}
        <SectionHeading title={t('Admin.Sida.App.Registration.PersonalInfo')} />
        <View style={formStyle.formRow}>
          <Field label={t('Admin.Sida.App.Registration.FirstName')} value={form.firstName} onChange={set('firstName')} required error={errors.firstName} />
          <Field label={t('Admin.Sida.App.Registration.MiddleName')} value={form.middleName} onChange={set('middleName')} />
          <Field label={t('Admin.Sida.App.Registration.LastName')} value={form.lastName} onChange={set('lastName')} required error={errors.lastName} />
        </View>
        <View style={formStyle.formRow}>
          <Field label={t('Admin.Sida.App.Registration.FatherName')} value={form.father} onChange={set('father')} />
          <Field label={t('Admin.Sida.App.Registration.SpouseName')} value={form.spouse} onChange={set('spouse')} />
          <Field label={`${t('Admin.Sida.App.Registration.FatherName')} Name`} value={form.fatherName} onChange={set('fatherName')} required />
        </View>

        {/* ══ Contact Information ═══════════════════════════════════════ */}
        <SectionHeading title={t('Admin.Sida.App.Registration.ContactInfo')} />
        <View style={formStyle.formRow}>
          <Field label={t('Admin.Sida.App.Registration.MailingAddress')} value={form.mailingAddress} onChange={set('mailingAddress')} />
        </View>
        <View style={formStyle.formRow}>
          <Field label={t('Admin.Sida.App.Registration.State')} value={form.state} onChange={set('state')} />
          <Field label={t('Admin.Sida.App.Registration.District')} value={form.district} onChange={set('district')} />
          <Field label={t('Admin.Sida.App.Registration.Tehsil')} value={form.tehsil} onChange={set('tehsil')} />
        </View>
        <View style={formStyle.formRow}>
          <Field label={t('Admin.Sida.App.Registration.City')} value={form.cityVillage} onChange={set('cityVillage')} />
          <Field label={t('Admin.Sida.App.Registration.Pincode')} value={form.pinCode} onChange={set('pinCode')} keyboardType="numeric" />
        </View>
        <View style={formStyle.formRow}>
          <Field label={t('Admin.Sida.App.Registration.Mobile')} value={form.mobileNumber} onChange={set('mobileNumber')} required keyboardType="phone-pad" error={errors.mobileNumber} />
          <Field label={t('Admin.Sida.App.Registration.Email')} value={form.email} onChange={set('email')} required keyboardType="email-address" error={errors.email} />
          <Field label={t('Admin.Sida.App.Registration.Authority')} value={form.authority} onChange={set('authority')} />
        </View>

        {/* ══ Organisation Details ══════════════════════════════════════ */}
        <SectionHeading title={t('Admin.Sida.App.Registration.OrgDetails')} />
        <View style={formStyle.formRow}>
          <Field label={t('Admin.Sida.App.Registration.OrgName')} value={form.organisationName} onChange={set('organisationName')} required />
          {/* spacer so it doesn't stretch full width */}
          <View style={formStyle.formCol} />
          <View style={formStyle.formCol} />
        </View>

        {/* ══ Professional Details ══════════════════════════════════════ */}
        <SectionHeading title={t('Admin.Sida.App.Registration.ProfDetails')} />
        <View style={formStyle.formRow}>
          <Field label={t('Admin.Sida.App.Registration.Qualification')} value={form.qualification} onChange={set('qualification')} required error={errors.qualification} />
          <View style={formStyle.formCol} />
          <View style={formStyle.formCol} />
        </View>

        {/* ══ Registration Details ══════════════════════════════════════ */}
        <SectionHeading title={t('Admin.Sida.App.Registration.RegDetails')} />
        <View style={formStyle.formRow}>
          <Field label={t('Admin.Sida.App.Registration.RegLicenseNo')} value={form.regLicenseNo} onChange={set('regLicenseNo')} required error={errors.regLicenseNo} />
          <Field label={t('Admin.Sida.App.Registration.Validity')} value={form.validity} onChange={set('validity')} required />
        </View>
        <View style={formStyle.formRow}>
          <Field label={t('Admin.Sida.App.Registration.YearsOfExperience')} value={form.yearsOfExperience} onChange={set('yearsOfExperience')} required keyboardType="numeric" />
          <Field label={t('Admin.Sida.App.Registration.Grade')} value={form.grade} onChange={set('grade')} required />
        </View>

        {/* ══ Attachments — reusing DocumentUploads component ══════════ */}
        <DocumentUploads
          fields={REGISTRATION_ATTACHMENT_FIELDS}
          sectionTitle={t('Admin.Sida.App.Registration.Attachments')}
          errors={attachmentErrors}
          setErrors={setAttachmentErrors}
          pickerErrors={attachmentPickerErrors}
          setPickerErrors={setAttachmentPickerErrors}
          files={attachmentFiles}
          onFilesChange={setAttachmentFiles}
        />

        {/* ══ Declaration ═══════════════════════════════════════════════ */}
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
            {t('Admin.Sida.App.Registration.Declaration')}
          </Text>
        </Pressable>
        {errors.declared && (
          <Text style={[formStyle.errorMessage, { marginTop: -theme.spacing.sm, marginBottom: theme.spacing.md }]}>
            {errors.declared as string}
          </Text>
        )}

        {/* ══ Submit button ═════════════════════════════════════════════ */}
        <View style={{ alignItems: 'flex-end' }}>
          <Pressable onPress={handleSubmit} accessibilityRole="button">
            <Text style={[button.btnBase, button.btnPrimary, { minWidth: 180, textAlign: 'center' }]}>
              {t('Admin.Sida.App.Registration.Submit')}
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

export default RegistrationContainer;
