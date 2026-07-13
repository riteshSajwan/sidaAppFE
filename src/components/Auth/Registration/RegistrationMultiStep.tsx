import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Text, View } from "react-native";
import { TextInput } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { useFormStyle } from "src/common/assets/styles/form";
import Customdropdown from "src/common/components/CustomDropdown/CustomDropdown";
import ErrorMessageContainer from "src/common/components/ErrorMessage/ErrorMessage";
import { useAppTheme } from "src/common/context/AppTheme";
import { RegisterArchitectFilesDto } from "src/common/model/auth/login";
import { signUpRequest } from "src/common/service/auth/action";
import { resetAuthDetails } from "src/common/service/auth/slice";
import {
  fetchCityListingAction,
  fetchDistrictListingAction,
  fetchStateListingAction,
  fetchTehsilListingAction,
} from "src/common/service/masterlocation/action";
import {
  resetCityListing,
  resetDistrictListing,
  resetStateListing,
  resetTehsilListing,
} from "src/common/service/masterlocation/slice";
import DocumentUploads from "src/components/ArchitectDetails/DocumentUploads/DocumentUploads";
import {
  generateInitialErrorsFromFields,
  generateInitialFilesStateFromFields,
  IDocumentErrors,
  IDocumentFilesState,
  validateDocumentUploadsForFields,
} from "src/components/ArchitectDetails/DocumentUploads/DocumentUploadsUtils";
import { Routes } from "src/routing/paths";
import { AppDispatch, RootState } from "src/store";
import { Icon } from "src/submodules/iconlibrary/src";
import { sectionStyles, stepStyles, styles } from "./Registration";
import {
  CO_NUMBER_REGEX,
  CONTACT_FIELDS,
  EDUCATION_FIELDS,
  generateInitialFormErrors,
  IDropdownOption,
  IFormField,
  INITIAL_FORM,
  IRegistrationForm,
  IRegistrationFormErrors,
  PERSONAL_FIELDS,
  PRIVATE_ARCH_ATTACHMENT_FIELDS,
  REGISTRATION_FIELDS,
  STEPS,
  validateRegistrationForm,
} from "./RegistrationUtils";

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <View style={stepStyles.row}>
      {STEPS.map((step, index) => {
        const isDone = index < currentStep;
        const isActive = index === currentStep;
        return (
          <React.Fragment key={step.key}>
            <View style={stepStyles.item}>
              <View
                style={[
                  stepStyles.circle,
                  (isDone || isActive) && stepStyles.circleActive,
                ]}
              >
                {isDone ? (
                  <Icon name="tick" size={15} color="#fff" />
                ) : (
                  <Text
                    style={[
                      stepStyles.circleText,
                      isActive && stepStyles.circleTextActive,
                    ]}
                  >
                    {index + 1}
                  </Text>
                )}
              </View>
              <Text
                style={[stepStyles.label, isActive && stepStyles.labelActive]}
              >
                {step.label}
              </Text>
            </View>
            {index < STEPS.length - 1 && (
              <View
                style={[stepStyles.line, isDone && stepStyles.lineActive]}
              />
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
  const { theme } = useAppTheme();
  const formStyle = useFormStyle();
  const dispatch: AppDispatch = useDispatch();
  const tArch = useCallback(
    (key: string, opts?: Record<string, string>) =>
      TranslateMessage(`Admin.Sida.App.PrivateArchReg.${key}` as any, opts),
    [TranslateMessage],
  );

  // ── State ─────────────────────────────────────────────────────────────────

  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState<IRegistrationForm>(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState<IRegistrationFormErrors>(
    generateInitialFormErrors,
  );
  const [attachmentFiles, setAttachmentFiles] = useState<IDocumentFilesState>(
    () => generateInitialFilesStateFromFields(PRIVATE_ARCH_ATTACHMENT_FIELDS),
  );
  const [attachmentErrors, setAttachmentErrors] = useState<IDocumentErrors>(
    () => generateInitialErrorsFromFields(PRIVATE_ARCH_ATTACHMENT_FIELDS),
  );
  const [registrationError, setRegistrationError] = useState<string>("");
  const [attachmentPickerErrors, setAttachmentPickerErrors] = useState<
    Record<string, string>
  >({});
  const [loading, setLoading] = useState(false);
  const registerState = useSelector((state: RootState) => state.auth.register);

  // ── Location cascade (State → District/City, District → Tehsil) ────────────

  const stateListing = useSelector(
    (state: RootState) => state.masterlocation.stateListing,
  );
  const districtListing = useSelector(
    (state: RootState) => state.masterlocation.districtListing,
  );
  const tehsilListing = useSelector(
    (state: RootState) => state.masterlocation.tehsilListing,
  );
  const cityListing = useSelector(
    (state: RootState) => state.masterlocation.cityListing,
  );

  const toDropdownOptions = (
    items: { id: number; name: string }[] | undefined,
    placeholder: string,
  ): IDropdownOption[] => [
    { label: placeholder, value: "" },
    ...(items ?? []).map((item) => ({ label: item.name, value: String(item.id) })),
  ];
  // https://sida.findnerd.com/api/auth/master/districts/10087/tehsils
  
// https://sida.findnerd.com/api/master/districts/10090/tehsils
  const stateOptions = useMemo(
    () => toDropdownOptions(stateListing.data, "Select State"),
    [stateListing.data],
  );
  const districtOptions = useMemo(
    () => toDropdownOptions(districtListing.data, "Select District"),
    [districtListing.data],
  );
  const tehsilOptions = useMemo(
    () => toDropdownOptions(tehsilListing.data, "Select Tehsil"),
    [tehsilListing.data],
  );
  const cityOptions = useMemo(
    () => toDropdownOptions(cityListing.data, "Select City/Village"),
    [cityListing.data],
  );

  console.log("stateListing",stateListing)

  const contactFields = useMemo(
    () =>
      CONTACT_FIELDS.map((field) => {
        switch (field.key) {
          case "state":
            return { ...field, options: stateOptions };
          case "district":
            return { ...field, options: districtOptions };
          case "tehsil":
            return { ...field, options: tehsilOptions };
          case "cityVillage":
            return { ...field, options: cityOptions };
          default:
            return field;
        }
      }),
    [stateOptions, districtOptions, tehsilOptions, cityOptions],
  );

  // ── Field setters ─────────────────────────────────────────────────────────

  const setField = useCallback(
    (key: keyof IRegistrationForm) => (value: string) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setFormErrors((prev) => ({ ...prev, [key]: "" }));
    },
    [],
  );

  const setDropdown = useCallback(
    (key: keyof IRegistrationForm) => (item: IDropdownOption) => {
      setForm((prev) => ({ ...prev, [key]: item.value }));
      setFormErrors((prev) => ({ ...prev, [key]: "" }));
    },
    [],
  );

  // State changed → clear district/tehsil/city, refetch districts + cities for the new state
  const handleStateChange = useCallback(
    (item: IDropdownOption) => {
      setForm((prev) => ({
        ...prev,
        state: item.value,
        district: "",
        tehsil: "",
        cityVillage: "",
      }));
      setFormErrors((prev) => ({
        ...prev,
        state: "",
        district: "",
        tehsil: "",
        cityVillage: "",
      }));
      dispatch(resetDistrictListing());
      dispatch(resetTehsilListing());
      dispatch(resetCityListing());
      if (item.value) {
        dispatch(fetchDistrictListingAction(Number(item.value)));
        dispatch(fetchCityListingAction(Number(item.value)));
      }
    },
    [dispatch],
  );

  // District changed → clear tehsil, refetch tehsils for the new district
  const handleDistrictChange = useCallback(
    (item: IDropdownOption) => {
      setForm((prev) => ({ ...prev, district: item.value, tehsil: "" }));
      setFormErrors((prev) => ({ ...prev, district: "", tehsil: "" }));
      dispatch(resetTehsilListing());
      if (item.value) {
        dispatch(fetchTehsilListingAction(Number(item.value)));
      }
    },
    [dispatch],
  );
  // ── CO number handler ─────────────────────────────────────────────────────

  const handleCoNumberChange = useCallback((raw: string) => {
    // Always enforce "CA/" prefix — extract only the part after it
    const afterPrefix = raw.startsWith("CA/") ? raw.slice(3) : raw;

    // Keep only digits; cap total to 4 (year) + 10 (id) = 14 digits
    const digits = afterPrefix.replace(/[^\d]/g, "").slice(0, 14);

    let formatted: string;
    if (digits.length <= 4) {
      // Still typing the year
      formatted = `CA/${digits}`;
    } else {
      // Year complete — auto-insert slash between year and id (id max 10 digits)
      const year = digits.slice(0, 4);
      const id = digits.slice(4, 14);
      formatted = `CA/${year}/${id}`;
    }

    // Update form and run inline validation immediately
    setForm((prev) => ({ ...prev, regLicenseNo: formatted }));
    const errorMsg = CO_NUMBER_REGEX.test(formatted)
      ? ""
      : "Registration number must follow format CA/YYYY/ID (e.g. CA/2025/337337)";
    setFormErrors((prev) => ({ ...prev, regLicenseNo: errorMsg }));
  }, []);

  // ── Field renderers ───────────────────────────────────────────────────────

  const renderField = useCallback(
    (field: IFormField) => {
      const label = tArch(field.labelKey);
      const error = formErrors[field.key] as string | undefined;

      // ── CO number: "CA/" is baked into the input value, protected from deletion ──
      if (field.key === "regLicenseNo") {
        const stored = (form.regLicenseNo as string) || "CA/";
        // Ensure value always starts with "CA/"
        const displayValue = stored.startsWith("CA/") ? stored : `CA/${stored}`;
        return (
          <View
            key={field.key}
            style={[formStyle.formCol, field.span === 3 && { flex: 3 }]}
          >
            <Text style={formStyle.labelTitle}>
              {label}
              {field.required && <Text style={formStyle.asteriskTxt}> *</Text>}
            </Text>
            <TextInput
              mode="outlined"
              value={displayValue}
              onChangeText={(text) => {
                // Prevent backspace from eating "CA/" prefix
                if (!text.startsWith("CA/")) {
                  // User deleted into the prefix — restore it and keep whatever came after
                  handleCoNumberChange(`CA/${text.replace(/^C?A?\/?/i, "")}`);
                  return;
                }
                handleCoNumberChange(text);
              }}
              placeholder="CA/YYYY/ID (e.g. CA/2025/337337)"
              placeholderTextColor={theme.colors.textNeutral}
              keyboardType="default"
              autoCapitalize="none"
              autoComplete="off"
              activeOutlineColor={theme.colors.borderInverse}
              outlineColor={
                error
                  ? theme.colors.borderErrorInverse
                  : theme.colors.borderMedium
              }
              style={[
                formStyle.inputField,
                !!error && formStyle.errorBorderColor,
              ]}
              contentStyle={formStyle.textInputLabel}
              outlineStyle={formStyle.inputFieldOuline}
              error={!!error}
            />
            {!!error && <ErrorMessageContainer message={error} />}
          </View>
        );
      }

      return (
        <View
          key={field.key}
          style={[formStyle.formCol, field.span === 3 && { flex: 3 }]}
        >
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
            keyboardType={field.keyboardType ?? "default"}
            maxLength={field.maxLength ?? 100}
            autoCapitalize="none"
            autoComplete="off"
            activeOutlineColor={theme.colors.borderInverse}
            outlineColor={
              error
                ? theme.colors.borderErrorInverse
                : theme.colors.borderMedium
            }
            style={[
              formStyle.inputField,
              !!error && formStyle.errorBorderColor,
            ]}
            contentStyle={formStyle.textInputLabel}
            outlineStyle={formStyle.inputFieldOuline}
            error={!!error}
          />
          {!!error && <ErrorMessageContainer message={error} />}
        </View>
      );
    },
    [form, formErrors, formStyle, setField, tArch, theme],
  );

  const renderDropdown = useCallback(
    (field: IFormField) => {
      const label = tArch(field.labelKey);
      const error = formErrors[field.key] as string | undefined;
      const strValue = form[field.key] as string;
      const selected = (field.options ?? []).find(
        (o) => o.value === strValue,
      ) ?? { label: "", value: "" };

      // Dependent location fields: locked until their parent selection is made
      const disabled =
        (field.key === "district" && !form.state) ||
        (field.key === "tehsil" && !form.district) ||
        (field.key === "cityVillage" && !form.state);

      const onChange =
        field.key === "state"
          ? handleStateChange
          : field.key === "district"
            ? handleDistrictChange
            : setDropdown(field.key);

      return (
        <View key={field.key} style={formStyle.formCol}>
          <Text style={formStyle.labelTitle}>
            {label}
            {field.required && <Text style={formStyle.asteriskTxt}> *</Text>}
          </Text>
          <Customdropdown
            data={field.options ?? []}
            selectedValue={selected}
            onChange={onChange}
            disabled={disabled}
            error={error}
          />
          {!!error && <ErrorMessageContainer message={error} />}
        </View>
      );
    },
    [
      form,
      formErrors,
      formStyle,
      setDropdown,
      handleStateChange,
      handleDistrictChange,
      tArch,
    ],
  );

  /**
   * Renders a flat array of fields chunked into rows of 3 columns.
   * A field with span=3 gets its own full-width row.
   */
  const renderSection = useCallback(
    (fields: IFormField[]) => {
      const rows: IFormField[][] = [];
      let current: IFormField[] = [];

      fields.forEach((field) => {
        if (field.span === 3) {
          if (current.length) {
            rows.push(current);
            current = [];
          }
          rows.push([field]);
        } else {
          current.push(field);
          if (current.length === 3) {
            rows.push(current);
            current = [];
          }
        }
      });
      if (current.length) rows.push(current);

      return rows.map((row, i) => (
        <View key={i} style={formStyle.formRow}>
          {row.map((field) =>
            field.fieldType === "dropdown" && field.options
              ? renderDropdown(field)
              : renderField(field),
          )}
        </View>
      ));
    },
    [formStyle, renderDropdown, renderField],
  );

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

  const handleNext = () => {
    if (validateStep1()) setCurrentStep(1);
  };
  const handleBack = () => setCurrentStep(0);
  const handleSubmit = useCallback(async () => {
    setRegistrationError("");
    if (!validateStep2()) return;
    if (!form.declared) {
      setFormErrors((prev) => ({
        ...prev,
        declared: tArch("Required", { field: "Declaration" }),
      }));
      return;
    }

    try {
      setLoading(true);

      // ── Map form fields → API DTO ────────────────────────────────────────
      const dto = {
        firstName: form.firstName.trim(),
        middleName: form.middleName.trim(),
        lastName: form.lastName.trim(),
        fatherName: form.fatherName.trim(),
        spouseName: "",
        mailingAddress: form.mailingAddress.trim(),
        state: form.state,
        district: form.district,
        tehsil: form.tehsil,
        cityVillage: form.cityVillage,
        otherCityVillage: "",
        pinCode: form.pinCode.trim(),
        mobileNumber: `+91${form.mobileNumber.trim()}`,
        emailId: form.email.trim(),
        password: "", // collected elsewhere or left blank for now
        role: "PRIVATE_ARCHITECT",
        registeringAuthority: "",
        applicationType: "NEW_REGISTRATION",
        experience: "",
        registrationCoaNumber: form.regLicenseNo.trim(),
        validityDate: "",
        nameOfInstitute: form.instituteName.trim(),
        yearOfPassing: Number(form.yearOfPassing),
      };

      // ── Map attachment files → API file parts ────────────────────────────
      const files: RegisterArchitectFilesDto = {
        twelfthPassCertificate: attachmentFiles["twelfthPassCert"] ?? null,
        identityProof: attachmentFiles["aadharPassport"] ?? null,
        coaCertificate: attachmentFiles["coaCertScanCopy"] ?? null,
        degreeMarksheet: attachmentFiles["markSheetDegree"] ?? null,
        latestPhoto: attachmentFiles["latestPhoto"] ?? null,
      };

      dispatch(signUpRequest(dto, files));
    } catch {
      setAttachmentErrors((prev: IDocumentErrors) => ({
        ...prev,
        apiError: TranslateMessage(
          "Admin.Sida.App.DocumentUpload.ApiError" as any,
        ),
      }));
    } finally {
      setLoading(false);
    }
  }, [validateStep2, attachmentFiles, form, dispatch, TranslateMessage, tArch]);

  useEffect(() => {
    dispatch(fetchStateListingAction());

    // Clear stale location listings on unmount so a later visit starts fresh
    return () => {
      dispatch(resetStateListing());
      dispatch(resetDistrictListing());
      dispatch(resetTehsilListing());
      dispatch(resetCityListing());
    };
  }, []);

  useEffect(() => {
    if (registerState.success) {
      setLoading(false);
      dispatch(resetAuthDetails({ type: "register" }));
      try {
        router.replace(Routes.LOGIN);
      } catch {}
    } else if (registerState.error) {
      setRegistrationError("Something went wrong. Please try again later.");
      // setSnackbarVisible({ msg: registerState.error.error, state: true });
    }
  }, [registerState]);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
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
              <Text style={styles.leftTitle}>
                Smart City{"\n"}Building Services
              </Text>
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
              {currentStep === 0 ? tArch("Title") : tArch("Attachments")}
            </Text>
            <Text style={styles.pageSubtitle}>
              {currentStep === 0
                ? "Step 1 of 2 — Fill in your personal and professional details"
                : "Step 2 of 2 — Upload the required supporting documents"}
            </Text>

            {/* ══ STEP 1: Details ══════════════════════════════ */}
            {currentStep === 0 && (
              <>
                {/* Personal Information */}
                <SectionHeading title={tArch("PersonalInfo")} />
                {renderSection(PERSONAL_FIELDS)}

                {/* Contact Information */}
                <SectionHeading title={tArch("ContactInfo")} />
                {renderSection(contactFields)}

                {/* Registration Details */}
                <SectionHeading title={tArch("RegDetails")} />
                {renderSection(REGISTRATION_FIELDS)}

                {/* Education Information */}
                <SectionHeading title={tArch("EduInfo")} />
                {renderSection(EDUCATION_FIELDS)}

                <View style={styles.btnRowEnd}>
                  <Pressable
                    onPress={handleNext}
                    style={styles.primaryBtn}
                    accessibilityRole="button"
                  >
                    <Text style={styles.primaryBtnText}>
                      Save &amp; Continue →
                    </Text>
                  </Pressable>
                </View>
              </>
            )}

            {/* ══ STEP 2: Documents ════════════════════════════ */}
            {currentStep === 1 && (
              <>
                <DocumentUploads
                  fields={PRIVATE_ARCH_ATTACHMENT_FIELDS}
                  sectionTitle={tArch("Attachments")}
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
                    setFormErrors((prev) => ({ ...prev, declared: "" }));
                  }}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: form.declared }}
                >
                  <View
                    style={[
                      styles.checkbox,
                      form.declared && styles.checkboxChecked,
                    ]}
                  >
                    {form.declared && (
                      <Icon name="tick" size={13} color="#fff" />
                    )}
                  </View>
                  <Text style={styles.checkLabel}>{tArch("Declaration")}</Text>
                </Pressable>
                {!!formErrors.declared && (
                  <ErrorMessageContainer message={formErrors.declared} />
                )}
                {!!attachmentErrors.apiError && (
                  <ErrorMessageContainer message={attachmentErrors.apiError} />
                )}
                {!!registrationError && (
                  <ErrorMessageContainer message={registrationError} />
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
                      {loading ? "Submitting…" : tArch("Submit")}
                    </Text>
                  </Pressable>
                </View>
              </>
            )}

            {/* Footer */}
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Already registered? </Text>
              <Pressable
                onPress={() => router.replace(Routes.LOGIN as any)}
                accessibilityRole="link"
              >
                <Text style={styles.footerLink}>Sign in</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
      {/* <CustomSnackbar
        visible={snackbarVisible.state}
        message={snackbarVisible.msg}
        duration={3000}
        onDismiss={() => setSnackbarVisible({ msg: '', state: false })}
        type={SnackbarType.WARNING}
      /> */}
    </>
  );
};

export default Registration;
