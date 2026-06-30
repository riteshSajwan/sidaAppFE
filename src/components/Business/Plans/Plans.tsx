import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GestureResponderEvent, Pressable, ScrollView, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Divider, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useButtonStyle } from 'src/common/assets/styles/button';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import CustomSnackbar, { SnackbarType } from 'src/common/components/CustomSnackbar/CustomSnackbar';
import ErrorMessageContainer from 'src/common/components/ErrorMessage/ErrorMessage';
import { Loader } from 'src/common/components/Loader/Loader';
import Typography from 'src/common/components/Typography/Typography';
import { useAppTheme } from 'src/common/context/AppTheme';
import useCurrencyFormatter from 'src/common/hook/useCurrencyFormator';
import { clearCustomPlanState, createCustomPlan, fetchPlanDetails, resetPlanState, updateCustomPlan } from 'src/common/service/business/action';
import { setSelectedPlan } from 'src/common/service/business/slice';
import { fetchAllCountriesListAddPlanAction } from 'src/common/service/country/action';
import { CustomPlan } from 'src/components/Business/Plans/CustomPlan';
import { usePlansStyle } from 'src/components/Business/Plans/PlansStyle';
import { CustomPlanData, formatBenefitName, getPlanByName, PlanName, PlanType } from 'src/components/Business/Plans/PlansUtils';
import type { IAllCountry } from 'src/components/ManageServiceAreas/ManageActiveCountries/add/AddCountryUtil';
import { useRestroStyle } from 'src/components/Restaurant/RestroStyle';
import { Routes } from 'src/routing/paths';
import { AppDispatch, RootState } from 'src/store';
import { Icon } from 'src/submodules/iconlibrary/src';

export interface SelectedPlanData {
    planId: string;
    planName: string;
    planType: PlanType;
    price: number;
}

export const Plans: React.FC = () => {
    const { t: TranslateMessage } = useTranslation();
    const style = useRestroStyle();
    const button = useButtonStyle();
    const dispatch: AppDispatch = useDispatch();
    const [selectedTab, setSelectedTab] = useState<PlanType>(PlanType.CUSTOM);
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
    const [showCustomBenefits, setShowCustomBenefits] = useState(true);
    const [customPlanFormKey, setCustomPlanFormKey] = useState(0);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState<IAllCountry | null>(null);
    const [countryError, setCountryError] = useState('');
    const [isCountryDropdownFocused, setIsCountryDropdownFocused] = useState(false);
    const customPlanValidateRef = useRef<(() => { isValid: boolean; data: CustomPlanData | null }) | null>(null);
    const { id: editPlanId } = useLocalSearchParams<{ id?: string }>();
    const styles = usePlansStyle();
    const layout = useLayoutStyle();
    const formStyle = useFormStyle();
    const { theme } = useAppTheme();
    const currencyFormate = useCurrencyFormatter();
    const { fixedPlans, createCustomPlan: createPlanState, planDetails, updateCustomPlan: updatePlanState } = useSelector((state: RootState) => state.business);
    const { loading: countriesLoading, allUnregisteredCountrylist: allCountriesList } = useSelector((state: RootState) => state.country.countryDetails);
    const { data: apiPlansData, loading, error } = fixedPlans;
    const isEditMode = Boolean(editPlanId);
    const isEditingCustomPlan = isEditMode && showCustomBenefits;
    const editPlanInitialData = useMemo(() => planDetails.data ? {
        planName: planDetails.data.planName,
        billingCycleMonths: planDetails.data.billingCycleMonths ?? planDetails.data.durationMonths,
        riderLimit: planDetails.data.riderLimit,
        price: planDetails.data.price,
        extraRideChargePercentage: planDetails.data.extraRideChargePercentage,
        shortRideAmount: planDetails.data.shortRideAmount,
        shortRideShareAmount: planDetails.data.shortRideShareAmount,
        longRideShareAmount: planDetails.data.longRideShareAmount,
        monthlyCharges: planDetails.data.monthlyCharges,
        onboardingFirstTimeCharge: planDetails.data.onboardingFirstTimeCharge,
    } : null, [planDetails.data]);
    const selectedCountryName = selectedCountry?.countryName || planDetails.data?.countryName || '';
    const selectedCountryISO = selectedCountry?.countryISO || planDetails.data?.countryISO || '';
    const selectedCurrency = selectedCountry?.currency || planDetails.data?.currency || '';
    const { businessId } = useLocalSearchParams<{ businessId: string }>();

    const getPlanPrice = useCallback((plan: any): number => {
        return plan.totalPrice || plan.basePrice;
    }, []);

    const handlePlanSelect = useCallback((plan: any) => {
        setSelectedPlanId(plan.id.toString());
        setShowCustomBenefits(false);

        const planData: SelectedPlanData = {
            planId: plan.id.toString(),
            planName: plan.planName,
            planType: selectedTab,
            price: getPlanPrice(plan),
        };

        dispatch(setSelectedPlan(planData));
    }, [dispatch, getPlanPrice, selectedTab]);
    
    useFocusEffect(
        useCallback(() => {
            if (editPlanId) {
                dispatch(fetchPlanDetails(editPlanId));
            } else {
                dispatch(resetPlanState());
                customPlanValidateRef.current = null;
                setSelectedTab(PlanType.CUSTOM);
                setSelectedPlanId(null);
                setShowCustomBenefits(true);
                setSelectedCountry(null);
                setCountryError('');
                setIsCountryDropdownFocused(false);
                setCustomPlanFormKey((key) => key + 1);
            }
            return () => {
                customPlanValidateRef.current = null;
                setSelectedTab(PlanType.CUSTOM);
                setSelectedPlanId(null);
                setShowCustomBenefits(true);
                setSelectedCountry(null);
                setCountryError('');
                setIsCountryDropdownFocused(false);
                dispatch(clearCustomPlanState());
            };
        }, [dispatch, editPlanId])
    );

    useEffect(() => {
        dispatch(fetchAllCountriesListAddPlanAction());
    }, [dispatch]);

    useEffect(() => {
        if (editPlanId) {
            setSelectedTab(PlanType.CUSTOM);
            setSelectedPlanId(null);
            setShowCustomBenefits(true);
            customPlanValidateRef.current = null;
            dispatch(fetchPlanDetails(editPlanId));
        }
    }, [dispatch, editPlanId]);

    useEffect(() => {
        if (apiPlansData.length > 0 && !showCustomBenefits) {
            const defaultPlan = apiPlansData.find(p => p.planName === PlanName.PRO) || apiPlansData[0];
            if (defaultPlan) {
                handlePlanSelect(defaultPlan);
            }
        }
    }, [apiPlansData, handlePlanSelect, showCustomBenefits]);

    useEffect(() => {
        if (createPlanState.success) {
            dispatch(clearCustomPlanState());
            customPlanValidateRef.current = null;
            const planId = createPlanState.data?.planId;
            const params = businessId
                ? `planId=${planId}&businessId=${businessId}`
                : `planId=${planId}`;
            router.push(`${Routes.BUSINESS}${Routes.NEW}?${params}`);
        }
    }, [businessId, createPlanState.success, createPlanState.data?.planId, dispatch]);

    useEffect(() => {
        if (updatePlanState.success) {
            dispatch(clearCustomPlanState());
            setSnackbarVisible(true);
        }
    }, [dispatch, updatePlanState.success]);

    const getAllUniqueBenefits = (): string[] => {
        if (apiPlansData.length === 0) return [];
        
        const allBenefits = apiPlansData
            .flatMap(plan => plan.benefits.map(benefit => benefit.benefitName))
            .filter((value, index, self) => self.indexOf(value) === index);
        
        return allBenefits;
    };

    function renderHeading() {
        return (
            <>
                <View style={[layout.container,style.headerContainer,layout.paddingTop26,{ marginHorizontal: theme.spacing.md }]}>
                    <View style={style.filterrow}>
                        <Typography variant='subHeading'>
                            {TranslateMessage('Admin.Delivery.App.BusinessManagement.Heading')}
                        </Typography>
                    </View>
                </View>
                <Divider style={[layout.DividerSperator, { marginBottom: 30 }]} />
            </>
        );
    }
    function renderErrorMsg() {
        return <ErrorMessageContainer message={error || planDetails.error || createPlanState.error || updatePlanState.error} />;
    }
    
    const handlePlanEdit = (planId: number) => (event: GestureResponderEvent) => {
        event.stopPropagation();
        const nextPlanId = planId.toString();
        setSelectedPlanId(null);
        setShowCustomBenefits(true);
        if (editPlanId === nextPlanId) {
            dispatch(fetchPlanDetails(nextPlanId));
        }
        router.push(`${Routes.BUSINESS}${Routes.PLANS}/${planId}`);
    };

    const handleContinue = () => {
        if (showCustomBenefits) {
            const validationResult = customPlanValidateRef.current?.();
            
            if (!validationResult?.isValid || !validationResult?.data) {
                return;
            }

            if (!isEditMode && !selectedCountryISO) {
                setCountryError(TranslateMessage('Admin.Delivery.App.Country.Name.required'));
                return;
            }

            const payload = {
                ...validationResult.data,
                planType: planDetails.data?.planType || PlanType.CUSTOM,
                billingCycle: "MONTHLY",
                countryName: selectedCountryName,
                countryISO: selectedCountryISO,
                currency: selectedCurrency,
            };

            if (isEditMode && editPlanId) {
                dispatch(updateCustomPlan(editPlanId, payload));
                return;
            }

            dispatch(createCustomPlan(payload));
        } else {
            if (!selectedPlanId) {
                return;
            }
            const params = businessId
                ? `planId=${selectedPlanId}&businessId=${businessId}`
                : `planId=${selectedPlanId}`;
            router.push(`${Routes.BUSINESS}${Routes.NEW}?${params}`);
        }
    };

    const handleSnackbarDismiss = () => {
        setSnackbarVisible(false);
        router.push(Routes.BUSINESS);
    };

    function renderCountryCard() {
        return (
            <View style={[styles.sectionCard, isCountryDropdownFocused && styles.sectionCardRaised]}>
                <View style={styles.sectionHeader}>
                    <View style={styles.sectionTitleWrap}>
                        <View style={styles.sectionIcon}>
                            <Typography variant='body' fontWeight='semiBold'>1</Typography>
                        </View>
                        <Typography variant='subTitle' style={styles.sectionTitle}>
                            {TranslateMessage('Admin.Delivery.App.Select.Country')}
                        </Typography>
                    </View>
                    {selectedCurrency ? (
                        <View style={styles.currencyPill}>
                            <Typography variant='body' style={styles.currencyPillText}>{selectedCurrency}</Typography>
                        </View>
                    ) : null}
                </View>
                <View style={formStyle.formBoxLayout}>
                    <View style={[formStyle.formRow, formStyle.mb0]}>
                        <View style={formStyle.width48}>
                            <View style={styles.fieldLabel}>
                                <Typography>
                                    {TranslateMessage('Admin.Delivery.App.Country.Name')}
                                    <Typography color={theme.colors.textErrorDark}>*</Typography>
                                </Typography>
                            </View>
                            {isEditMode ? (
                                <TextInput
                                    style={[formStyle.inputField, styles.readonlyInput, countryError !== '' && formStyle.errorBorderColor]}
                                    value={selectedCountryName}
                                    mode='outlined'
                                    disabled
                                    autoCapitalize='none'
                                    activeOutlineColor={theme.colors.borderErrorInverse}
                                    outlineColor={theme.colors.borderMedium}
                                    contentStyle={formStyle.inputPlaceholderLabel}
                                    placeholderTextColor={theme.colors.textNeutral}
                                    placeholder={TranslateMessage('Admin.Delivery.App.Select.Country')}
                                />
                            ) : (
                                <Dropdown
                                    style={[
                                        styles.dropdownInput,
                                        isCountryDropdownFocused && styles.dropdownInputActive,
                                        countryError !== '' && formStyle.errorBorderColor,
                                    ]}
                                    placeholderStyle={layout.placeholderStyle}
                                    selectedTextStyle={[
                                        layout.placeholderStyle,
                                        selectedCountryName !== '' && layout.selectedTextStyle,
                                    ]}
                                    inputSearchStyle={layout.inputSearchStyle}
                                    data={allCountriesList || []}
                                    labelField='countryName'
                                    valueField='countryISO'
                                    placeholder={selectedCountryName || TranslateMessage('Admin.Delivery.App.Select.Country')}
                                    value={selectedCountryISO}
                                    search
                                    onFocus={() => setIsCountryDropdownFocused(true)}
                                    onBlur={() => setIsCountryDropdownFocused(false)}
                                    onChange={(item: IAllCountry) => {
                                        setSelectedCountry(item);
                                        setCountryError('');
                                        setIsCountryDropdownFocused(false);
                                    }}
                                    searchPlaceholder={TranslateMessage('Admin.Delivery.App.SearchLabel')}
                                    renderItem={(item: IAllCountry) => (
                                        <View style={[
                                            styles.dropdownItem,
                                            item.countryISO === selectedCountryISO && styles.dropdownItemSelected,
                                        ]}>
                                            <Typography
                                                variant='body'
                                                style={[
                                                    styles.dropdownItemText,
                                                    item.countryISO === selectedCountryISO && styles.dropdownItemTextSelected,
                                                ]}
                                            >
                                                {item.countryName}
                                            </Typography>
                                        </View>
                                    )}
                                    containerStyle={styles.dropdownContainer}
                                    // inputSearchStyle={styles.dropdownSearch}
                                    itemContainerStyle={{ backgroundColor: theme.colors.surfaceBase }}
                                />
                            )}
                            {countryError ? <ErrorMessageContainer message={countryError} /> : null}
                        </View>
                        <View style={formStyle.width48}>
                            <View style={styles.fieldLabel}>
                                <Typography>{TranslateMessage('Admin.Delivery.App.Country.Currency')}</Typography>
                            </View>
                            <TextInput
                                style={[formStyle.inputField, styles.readonlyInput]}
                                value={selectedCurrency}
                                mode='outlined'
                                disabled
                                autoCapitalize='none'
                                activeOutlineColor={theme.colors.borderErrorInverse}
                                outlineColor={theme.colors.borderMedium}
                                contentStyle={formStyle.inputPlaceholderLabel}
                                placeholderTextColor={theme.colors.textNeutral}
                                placeholder={TranslateMessage('Admin.Delivery.App.Country.Currency')}
                            />
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <>
        <ScrollView>
            <Loader loading={loading || countriesLoading || planDetails.loading || createPlanState.loading || updatePlanState.loading}/>
            {renderHeading()}
            <View style={styles.content}>
                <Typography variant='subTitle' style={styles.pageTitle}>
                    {TranslateMessage('Admin.Delivery.App.Select.Plan')}
                </Typography>
                {/* <View style={styles.toggleContainer}> */}
                    {/* <Pressable
                        style={[styles.toggleButton, selectedTab === PlanType.FIXED && styles.toggleButtonActive]}
                        onPress={() => {setSelectedTab(PlanType.FIXED),setShowCustomBenefits(false);}}>
                        <Typography variant='body' style={[styles.toggleText, selectedTab === PlanType.FIXED && styles.toggleTextActive]}>
                            {TranslateMessage('Admin.Delivery.App.Select.Plan.Fixed')}
                        </Typography>
                    </Pressable> */}
                    {/* <Pressable
                        style={[styles.toggleButton, selectedTab === PlanType.CUSTOM && styles.toggleButtonActive]}
                        onPress={() => {
                            setSelectedTab(PlanType.CUSTOM);
                            setShowCustomBenefits(true);
                            setSelectedPlanId(null);
                        }}
                    >
                        <Typography variant='body' style={[styles.toggleText, selectedTab === PlanType.CUSTOM && styles.toggleTextActive]}>
                            {TranslateMessage('Admin.Delivery.App.Custom')}
                        </Typography>
                    </Pressable> */}
                {/* </View> */}

                {showCustomBenefits ? (
                    <>
                        {renderCountryCard()}
                        <CustomPlan
                            key={editPlanId ?? `new-${customPlanFormKey}`}
                            initialData={isEditMode ? editPlanInitialData : null}
                            isEditMode={isEditMode}
                            countryISO={selectedCountryISO}
                            currency={selectedCurrency}
                            onValidate={(validateFn) => {
                                customPlanValidateRef.current = validateFn;
                            }}
                        />
                    </>

                ) :  (
                    <>
                        <View style={styles.plansContainer}>
                            {apiPlansData.map((plan) => {
                                const isSelected = selectedPlanId === plan.id.toString();
                                const isPopular = plan.planName === PlanName.PRO;
                                return (
                                    <Pressable
                                        key={plan.id}
                                        style={[
                                            styles.planCard,
                                            isSelected && styles.planCardSelected
                                        ]}
                                        onPress={() => handlePlanSelect(plan)}
                                    >
                                        {isPopular && (
                                            <View style={styles.popularBadge}>
                                                <Typography variant='body' style={styles.popularBadgeText}>{TranslateMessage('Admin.Delivery.App.Popular')}</Typography>
                                            </View>
                                        )}
                                        <Pressable style={styles.planEditButton} onPress={handlePlanEdit(plan.id)}>
                                            <Icon name='edit' size={20} color={theme.colors.iconBase} />
                                        </Pressable>

                                        <Typography variant='subTitle' style={styles.planName}>{plan.planName}</Typography>

                                        <View style={styles.priceContainer}>
                                            <Typography variant='subHeading' style={styles.priceSymbol}>
                                                {currencyFormate( plan.price ?? '', plan.currency ?? '')}
                                            </Typography>
                                            <Typography variant='body' style={styles.pricePeriod}>/{plan.durationMonths}{TranslateMessage('Admin.Delivery.App.Business.Month')}</Typography>
                                        </View>

                                        <View style={styles.featuresList}>
                                            {plan.benefits.map((benefit, index) => (
                                                <View key={index} style={styles.featureItem}>
                                                    <Icon name='tick' size={20} color={theme.colors.iconBase} />
                                                    <Typography variant='body' style={styles.featureText}>
                                                        {benefit.description || formatBenefitName(benefit.benefitName)}
                                                    </Typography>
                                                </View>
                                            ))}
                                        </View>
                                    </Pressable>
                                );
                            })}
                        </View>
                        {apiPlansData.length > 0 && (
                            <View style={styles.comparisonSection}>
                                <View style={styles.tableHeader}>
                                    <Typography variant='subTitle' style={[styles.tableHeaderCell, styles.tableHeaderCellFirst]}>
                                        {TranslateMessage('Admin.Delivery.App.Features')}
                                    </Typography>
                                    <Typography variant='subTitle' style={styles.tableHeaderCell}>
                                        {getPlanByName(apiPlansData, PlanName.BASIC)?.planName }
                                    </Typography>
                                    <Typography variant='subTitle' style={styles.tableHeaderCell}>
                                        {getPlanByName(apiPlansData, PlanName.PRO)?.planName }
                                    </Typography>
                                    <Typography variant='subTitle' style={styles.tableHeaderCell}>
                                        {getPlanByName(apiPlansData, PlanName.ENTERPRISE)?.planName }
                                    </Typography>
                                </View>

                                {getAllUniqueBenefits().map((benefitName, index) => {
                                    const basicPlan = getPlanByName(apiPlansData, PlanName.BASIC);
                                    const proPlan = getPlanByName(apiPlansData, PlanName.PRO);
                                    const enterprisePlan = getPlanByName(apiPlansData, PlanName.ENTERPRISE);

                                    const hasBasic = basicPlan?.benefits.some((b: any) => b.benefitName === benefitName);
                                    const hasPro = proPlan?.benefits.some((b: any) => b.benefitName === benefitName);
                                    const hasEnterprise = enterprisePlan?.benefits.some((b: any) => b.benefitName === benefitName);

                                    return (
                                        <View
                                            key={index}
                                            style={[
                                                styles.tableRow,
                                                index === getAllUniqueBenefits().length - 1 && styles.tableRowLast
                                            ]}
                                        >
                                            <Typography variant='body' style={styles.tableCellFirst}>
                                                {formatBenefitName(benefitName)}
                                            </Typography>

                                            <View style={styles.tableCellIcon}>
                                                {hasBasic ? (
                                                    <Icon name='tick' size={20} color={theme.colors.iconBase} />
                                                ) : (
                                                    <Typography variant='body' style={styles.tableCellText}>-</Typography>
                                                )}
                                            </View>

                                            <View style={styles.tableCellIcon}>
                                                {hasPro ? (
                                                    <Icon name='tick' size={20} color={theme.colors.iconBase} />
                                                ) : (
                                                    <Typography variant='body' style={styles.tableCellText}>-</Typography>
                                                )}
                                            </View>

                                            <View style={styles.tableCellIcon}>
                                                {hasEnterprise ? (
                                                    <Icon name='tick' size={20} color={theme.colors.iconBase} />
                                                ) : (
                                                    <Typography variant='body' style={styles.tableCellText}>-</Typography>
                                                )}
                                            </View>
                                        </View>
                                    );
                                })}
                                <View style={[styles.tableRow, styles.tableRowLast]}>
                                    <Typography variant='body' style={styles.tableCellFirst}>
                                        {TranslateMessage('Admin.Delivery.App.Business.NumberOfVehicles')}
                                    </Typography>

                                    <View style={styles.tableCellIcon}>
                                        <Typography variant='body' style={styles.tableCellText}>
                                            {getPlanByName(apiPlansData, PlanName.BASIC)?.riderLimit || '-'}
                                        </Typography>
                                    </View>

                                    <View style={styles.tableCellIcon}>
                                        <Typography variant='body' style={styles.tableCellText}>
                                            {getPlanByName(apiPlansData, PlanName.PRO)?.riderLimit || '-'}
                                        </Typography>
                                    </View>

                                    <View style={styles.tableCellIcon}>
                                        <Typography variant='body' style={styles.tableCellText}>
                                            {getPlanByName(apiPlansData, PlanName.ENTERPRISE)?.riderLimit || '-'}
                                        </Typography>
                                    </View>
                                </View>
                            </View>
                        )}
                    </>
                )}

                <View style={[styles.actionButtonContainer, isEditingCustomPlan && styles.editButtonContainer]}>
                    <Pressable onPress={handleContinue} style={[button.btnBase, button.btnPrimary, styles.actionButton]}>
                        <Typography variant='btnText' color={theme.colors.textInverse}>{isEditingCustomPlan ? TranslateMessage('Admin.Delivery.App.Business.EditPlan') : TranslateMessage('Admin.Delivery.App.LogIn.Continue')}
                        </Typography>
                    </Pressable>
                </View>
                {renderErrorMsg()}
            </View>
        </ScrollView>
        <CustomSnackbar
            visible={snackbarVisible}
            message={TranslateMessage('Admin.Delivery.App.Snackbar.DataSaved')}
            type={SnackbarType.SUCCESS}
            onDismiss={handleSnackbarDismiss}
        />
        </>
    );
};
