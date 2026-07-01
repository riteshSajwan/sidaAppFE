import React from 'react';
import { Text, TextInput, View } from 'react-native';
import { useNewApplicationStyle } from 'src/components/NewApplication/NewApplication';
import { IBuildingDetails, IFormData, IOwnerDetails, IPropertyDetails, MultistepFormProps } from '../NewApplicationUtils';


// ─── Reusable field ────────────────────────────────────────────────────────────

const Field: React.FC<{
  label: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  onChange: (v: string) => void;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  fullWidth?: boolean;
}> = ({ label, value, placeholder, required, onChange, keyboardType = 'default' }) => {
  const styles = useNewApplicationStyle();
  return (
    <View style={styles.formCol}>
      <Text style={styles.fieldLabel}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <TextInput
        style={styles.textInput}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder ?? label}
        keyboardType={keyboardType}
        placeholderTextColor="#A7A7A7"
      />
    </View>
  );
};

// ─── Step 0: Property Details ──────────────────────────────────────────────────

const PropertyDetailsForm: React.FC<{
  data: IPropertyDetails;
  onChange: (f: string, v: string) => void;
}> = ({ data, onChange }) => {
  const styles = useNewApplicationStyle();
  return (
    <View>
      <View style={styles.formRow}>
        <Field label="Property Address" value={data.propertyAddress} required onChange={(v) => onChange('propertyAddress', v)} />
        <Field label="Plot Number" value={data.plotNumber} required onChange={(v) => onChange('plotNumber', v)} />
      </View>
      <View style={styles.formRow}>
        <Field label="Area (sq ft)" value={data.area} required keyboardType="numeric" onChange={(v) => onChange('area', v)} />
        <Field label="Usage Type" value={data.usage} required onChange={(v) => onChange('usage', v)} />
      </View>
    </View>
  );
};

// ─── Step 1: Owner Details ─────────────────────────────────────────────────────

const OwnerDetailsForm: React.FC<{
  data: IOwnerDetails;
  onChange: (f: string, v: string) => void;
}> = ({ data, onChange }) => {
  const styles = useNewApplicationStyle();
  return (
    <View>
      <View style={styles.sectionBox}>
        <Text style={styles.sectionLabel}>Primary Owner</Text>
        <View style={styles.formRow}>
          <Field label="Full Name" value={data.fullName} required onChange={(v) => onChange('fullName', v)} />
          <Field label="Mobile Number" value={data.mobileNumber} required keyboardType="phone-pad" onChange={(v) => onChange('mobileNumber', v)} />
        </View>
        <View style={styles.formRow}>
          <Field label="Email Address" value={data.emailAddress} keyboardType="email-address" onChange={(v) => onChange('emailAddress', v)} />
          <Field label="Aadhaar Number" value={data.aadhaarNumber} required keyboardType="numeric" onChange={(v) => onChange('aadhaarNumber', v)} />
        </View>
        <View style={styles.formRow}>
          <Field label="Residential Address" value={data.residentialAddress} required onChange={(v) => onChange('residentialAddress', v)} />
        </View>
      </View>
    </View>
  );
};

// ─── Step 2: Architect / Engineer ─────────────────────────────────────────────

const ArchitectForm: React.FC<{
  data: IFormData['architect'];
  onChange: (f: string, v: string) => void;
}> = ({ data, onChange }) => {
  const styles = useNewApplicationStyle();
  return (
    <View>
      <View style={styles.sectionBox}>
        <View style={styles.formRow}>
          <Field label="Architect / Engineer Name" value={data.name} required onChange={(v) => onChange('name', v)} />
          <Field label="License Number" value={data.licenseNumber} required onChange={(v) => onChange('licenseNumber', v)} />
        </View>
        <View style={styles.formRow}>
          <Field label="Email Address" value={data.email} keyboardType="email-address" onChange={(v) => onChange('email', v)} />
          <View style={{ flex: 1 }} />
        </View>
      </View>
    </View>
  );
};

// ─── Step 3: Building Details ──────────────────────────────────────────────────

const BuildingDetailsForm: React.FC<{
  data: IBuildingDetails;
  onChange: (f: string, v: string) => void;
}> = ({ data, onChange }) => {
  const styles = useNewApplicationStyle();
  return (
    <View>
      <View style={styles.sectionBox}>
        <View style={styles.formRow}>
          <Field label="Number of Floors" value={data.floors} required keyboardType="numeric" onChange={(v) => onChange('floors', v)} />
          <Field label="Building Type" value={data.buildingType} required onChange={(v) => onChange('buildingType', v)} />
        </View>
        <View style={styles.formRow}>
          <Field label="Construction Area (sq ft)" value={data.constructionArea} required keyboardType="numeric" onChange={(v) => onChange('constructionArea', v)} />
          <View style={{ flex: 1 }} />
        </View>
      </View>
    </View>
  );
};

// ─── Step 4: Documents placeholder ────────────────────────────────────────────

const DocumentsForm: React.FC = () => {
  const styles = useNewApplicationStyle();
  return (
    <View style={styles.sectionBox}>
      <Text style={[styles.fieldLabel, { textAlign: 'center', paddingVertical: 40 }]}>
        Document upload will be available here.
      </Text>
    </View>
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

// ─── Step 6: Review & Submit placeholder ──────────────────────────────────────

const ReviewForm: React.FC<{ formData: IFormData }> = ({ formData }) => {
  const styles = useNewApplicationStyle();
  return (
    <View style={styles.sectionBox}>
      <Text style={[styles.fieldLabel, { textAlign: 'center', paddingVertical: 40 }]}>
        Review your application before submitting.
      </Text>
    </View>
  );
};

// ─── Step titles shown in the form card header ─────────────────────────────────

export const STEP_TITLES = [
  'Property Details',
  'Owner Details',
  'Architect / Engineer',
  'Building Details',
  'Documents',
  'Fee Payment',
  'Review & Submit',
];

// ─── Main MultistepForm ────────────────────────────────────────────────────────

const MultistepForm: React.FC<MultistepFormProps> = ({
  currentStep,
  formData,
  onChange,
}) => {
  const styles = useNewApplicationStyle();

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <PropertyDetailsForm
            data={formData.property}
            onChange={(f, v) => onChange('property', f, v)}
          />
        );
      case 1:
        return (
          <OwnerDetailsForm
            data={formData.owner}
            onChange={(f, v) => onChange('owner', f, v)}
          />
        );
      case 2:
        return (
          <ArchitectForm
            data={formData.architect}
            onChange={(f, v) => onChange('architect', f, v)}
          />
        );
      case 3:
        return (
          <BuildingDetailsForm
            data={formData.building}
            onChange={(f, v) => onChange('building', f, v)}
          />
        );
      case 4:
        return <DocumentsForm />;
      case 5:
        return <FeePaymentForm />;
      case 6:
        return <ReviewForm formData={formData} />;
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
          <View style={styles.addBtn}>
            <Text style={styles.addBtnText}>+ Add Owner</Text>
          </View>
        )}
      </View>

      {renderStep()}
    </View>
  );
};

export default MultistepForm;
