import React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import Customdropdown from 'src/common/components/CustomDropdown/CustomDropdown';
import ErrorMessageContainer from 'src/common/components/ErrorMessage/ErrorMessage';
import { useAppTheme } from 'src/common/context/AppTheme';
import DocumentUploads from 'src/components/ArchitectDetails/DocumentUploads/DocumentUploads';
import { useNewApplicationStyle } from 'src/components/NewApplication/NewApplication';
import { Icon } from 'src/submodules/iconlibrary/src';
import {
  ARCHITECT_FIELDS,
  GIS_FIELDS,
  IArchitect,
  IArchitectErrors,
  IFormField,
  IGisCoordinates,
  IGisCoordinatesErrors,
  IOwner,
  IOwnerErrors,
  IPropertyDetails,
  IPropertyDetailsErrors,
  MultistepFormProps,
  NEW_APPLICATION_DOCUMENT_FIELDS,
  OWNER_FIELDS,
  PROPERTY_FIELDS,
  STEP_TITLES,
} from '../NewApplicationUtils';

// ─── Reusable field renderer (text input or dropdown) ─────────────────────────

function FormField<T extends Record<string, any>>({
  field,
  value,
  error,
  onChange,
}: {
  field: IFormField<T>;
  value: string;
  error?: string;
  onChange: (v: string) => void;
}) {
  const styles = useNewApplicationStyle();
  const { theme } = useAppTheme();

  const label = (
    <Text style={styles.fieldLabel}>
      {field.label}
      {field.required && <Text style={styles.required}> *</Text>}
    </Text>
  );

  if (field.fieldType === 'dropdown' && field.options) {
    const selected = field.options.find((o) => o.value === value) ?? { label: '', value: '' };
    return (
      <View style={[styles.formCol, field.span === 2 && { flexBasis: '100%' }]}>
        {label}
        <Customdropdown
          data={field.options}
          selectedValue={selected}
          onChange={(item) => onChange(item.value)}
          error={error}
        />
        {!!error && <ErrorMessageContainer message={error} />}
      </View>
    );
  }

  return (
    <View style={[styles.formCol, field.span === 2 && { flexBasis: '100%' }]}>
      {label}
      <TextInput
        style={[styles.textInput, !!error && { borderColor: theme.colors.borderErrorInverse }]}
        value={value}
        onChangeText={onChange}
        placeholder={field.placeholder ?? field.label}
        keyboardType={field.keyboardType ?? 'default'}
        maxLength={field.maxLength}
        placeholderTextColor="#A7A7A7"
      />
      {!!error && <ErrorMessageContainer message={error} />}
    </View>
  );
}

/** Chunks a flat field list into rows of 2 columns, honoring span=2 as a full-width row. */
function renderFieldRows<T extends Record<string, any>>(
  fields: IFormField<T>[],
  values: T,
  errors: Partial<Record<keyof T, string>>,
  onChange: (key: keyof T, value: string) => void,
  styles: ReturnType<typeof useNewApplicationStyle>,
) {
  const rows: IFormField<T>[][] = [];
  let current: IFormField<T>[] = [];

  fields.forEach((field) => {
    if (field.span === 2) {
      if (current.length) { rows.push(current); current = []; }
      rows.push([field]);
    } else {
      current.push(field);
      if (current.length === 2) { rows.push(current); current = []; }
    }
  });
  if (current.length) rows.push(current);

  return rows.map((row, i) => (
    <View key={i} style={styles.formRow}>
      {row.map((field) => (
        <FormField
          key={String(field.key)}
          field={field}
          value={String(values[field.key] ?? '')}
          error={errors[field.key]}
          onChange={(v) => onChange(field.key, v)}
        />
      ))}
    </View>
  ));
}

// ─── Step 0: Property Details ──────────────────────────────────────────────────

const PropertyDetailsForm: React.FC<{
  data: IPropertyDetails;
  errors: IPropertyDetailsErrors;
  onChange: (f: string, v: string) => void;
}> = ({ data, errors, onChange }) => {
  const styles = useNewApplicationStyle();
  const addressField = PROPERTY_FIELDS[PROPERTY_FIELDS.length - 1];
  const otherFields = PROPERTY_FIELDS.slice(0, -1);
  return (
    <View>
      {renderFieldRows(otherFields, data, errors, (key, v) => onChange(String(key), v), styles)}
      <View style={styles.formRow}>
        <FormField
          field={addressField}
          value={data[addressField.key]}
          error={errors[addressField.key]}
          onChange={(v) => onChange(String(addressField.key), v)}
        />
        <View style={styles.formCol}>
          <View style={styles.noteBox}>
            <Text style={styles.noteText}>
              <Text style={styles.noteTitle}>Note: </Text>
              The applicant will fill the application no. of the fresh application for which addition/alteration is being applied, in case of addition and alteration (CTE and CTO).
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

// ─── Step 1: Applicant Details (Owners) ────────────────────────────────────────

const OwnerBlock: React.FC<{
  owner: IOwner;
  index: number;
  errors: IOwnerErrors;
  onChange: (field: keyof IOwner, value: string) => void;
  onRemove?: () => void;
}> = ({ owner, index, errors, onChange, onRemove }) => {
  const styles = useNewApplicationStyle();
  const { theme } = useAppTheme();
  return (
    <View style={styles.sectionBox}>
      <View style={styles.formCardHeader}>
        <Text style={styles.sectionLabel}>{index === 0 ? 'Primary Owner' : `Owner ${index + 1}`}</Text>
        {!!onRemove && (
          <Pressable onPress={onRemove} accessibilityRole="button" accessibilityLabel="Remove owner">
            <Icon name="closeAlt" size={16} color={theme.colors.textErrorDark} />
          </Pressable>
        )}
      </View>
      {renderFieldRows(OWNER_FIELDS, owner, errors, onChange, styles)}
    </View>
  );
};

const ApplicantDetailsForm: React.FC<{
  owners: IOwner[];
  errors: Record<string, IOwnerErrors>;
  onOwnerChange: (ownerId: string, field: keyof IOwner, value: string) => void;
  onRemoveOwner: (ownerId: string) => void;
}> = ({ owners, errors, onOwnerChange, onRemoveOwner }) => {
  return (
    <View>
      {owners.map((owner, index) => (
        <OwnerBlock
          key={owner.id}
          owner={owner}
          index={index}
          errors={errors[owner.id] ?? {}}
          onChange={(field, value) => onOwnerChange(owner.id, field, value)}
          onRemove={owners.length > 1 ? () => onRemoveOwner(owner.id) : undefined}
        />
      ))}
    </View>
  );
};

// ─── Step 2: Architect / Engineer ─────────────────────────────────────────────

const ArchitectForm: React.FC<{
  data: IArchitect;
  errors: IArchitectErrors;
  onChange: (f: string, v: string) => void;
}> = ({ data, errors, onChange }) => {
  const styles = useNewApplicationStyle();
  return (
    <View>
      <View style={styles.sectionBox}>
        {renderFieldRows(ARCHITECT_FIELDS, data, errors, (key, v) => onChange(String(key), v), styles)}
      </View>
    </View>
  );
};

// ─── Step 3: GIS Coordinates ───────────────────────────────────────────────────

const GisCoordinatesForm: React.FC<{
  data: IGisCoordinates;
  errors: IGisCoordinatesErrors;
  onChange: (f: string, v: string) => void;
}> = ({ data, errors, onChange }) => {
  const styles = useNewApplicationStyle();
  return (
    <View>
      <View style={styles.sectionBox}>
        {renderFieldRows(GIS_FIELDS, data, errors, (key, v) => onChange(String(key), v), styles)}
      </View>
    </View>
  );
};

// ─── Step 4: Documents ──────────────────────────────────────────────────────────

const DocumentsForm: React.FC<
  Pick<
    MultistepFormProps,
    'documentFiles' | 'documentErrors' | 'documentPickerErrors' | 'setDocumentFiles' | 'setDocumentErrors' | 'setDocumentPickerErrors'
  >
> = ({ documentFiles, documentErrors, documentPickerErrors, setDocumentFiles, setDocumentErrors, setDocumentPickerErrors }) => {
  return (
    <DocumentUploads
      fields={NEW_APPLICATION_DOCUMENT_FIELDS}
      errors={documentErrors}
      setErrors={setDocumentErrors}
      pickerErrors={documentPickerErrors}
      setPickerErrors={setDocumentPickerErrors}
      files={documentFiles}
      onFilesChange={setDocumentFiles}
    />
  );
};

// ─── Step 5: Fee Payment placeholder ──────────────────────────────────────────

const FeePaymentForm: React.FC = () => {
  const styles = useNewApplicationStyle();
  return (
    <View style={styles.sectionBox}>
      <Text style={[styles.fieldLabel, { textAlign: 'center', paddingVertical: 40 }]}>
        Fee calculation and payment options will appear here.
      </Text>
    </View>
  );
};

// ─── Step 6: Upload Map placeholder ───────────────────────────────────────────

const UploadMapForm: React.FC = () => {
  const styles = useNewApplicationStyle();
  return (
    <View style={styles.sectionBox}>
      <Text style={[styles.fieldLabel, { textAlign: 'center', paddingVertical: 40 }]}>
        Map upload will be available here.
      </Text>
    </View>
  );
};

// ─── Step 7: Review & Submit placeholder ──────────────────────────────────────

const ReviewForm: React.FC = () => {
  const styles = useNewApplicationStyle();
  return (
    <View style={styles.sectionBox}>
      <Text style={[styles.fieldLabel, { textAlign: 'center', paddingVertical: 40 }]}>
        Review your application before submitting.
      </Text>
    </View>
  );
};

// ─── Main MultistepForm ────────────────────────────────────────────────────────

const MultistepForm: React.FC<MultistepFormProps> = ({
  currentStep,
  formData,
  formErrors,
  onFieldChange,
  onOwnerChange,
  onAddOwner,
  onRemoveOwner,
  documentFiles,
  documentErrors,
  documentPickerErrors,
  setDocumentFiles,
  setDocumentErrors,
  setDocumentPickerErrors,
}) => {
  const styles = useNewApplicationStyle();

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <PropertyDetailsForm
            data={formData.property}
            errors={formErrors.property}
            onChange={(f, v) => onFieldChange('property', f, v)}
          />
        );
      case 1:
        return (
          <ApplicantDetailsForm
            owners={formData.applicant.owners}
            errors={formErrors.applicant}
            onOwnerChange={onOwnerChange}
            onRemoveOwner={onRemoveOwner}
          />
        );
      case 2:
        return (
          <ArchitectForm
            data={formData.architect}
            errors={formErrors.architect}
            onChange={(f, v) => onFieldChange('architect', f, v)}
          />
        );
      case 3:
        return (
          <GisCoordinatesForm
            data={formData.gis}
            errors={formErrors.gis}
            onChange={(f, v) => onFieldChange('gis', f, v)}
          />
        );
      case 4:
        return (
          <DocumentsForm
            documentFiles={documentFiles}
            documentErrors={documentErrors}
            documentPickerErrors={documentPickerErrors}
            setDocumentFiles={setDocumentFiles}
            setDocumentErrors={setDocumentErrors}
            setDocumentPickerErrors={setDocumentPickerErrors}
          />
        );
      case 5:
        return <FeePaymentForm />;
      case 6:
        return <UploadMapForm />;
      case 7:
        return <ReviewForm />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.formCard}>
      {/* Form card header: step title + optional add button */}
      <View style={styles.formCardHeader}>
        <Text style={styles.fieldLabel}>
          {STEP_TITLES[currentStep]}
        </Text>
        {currentStep === 1 && (
          <Pressable style={styles.addBtn} onPress={onAddOwner} accessibilityRole="button" accessibilityLabel="Add owner">
            <Text style={styles.addBtnText}>+ Add Owner</Text>
          </Pressable>
        )}
      </View>

      {renderStep()}
    </View>
  );
};

export default MultistepForm;
