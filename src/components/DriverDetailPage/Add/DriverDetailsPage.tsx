import { useIsFocused } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ImageStyle, Pressable, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Divider, TextInput } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { useButtonStyle } from "src/common/assets/styles/button";
import { useFormStyle } from "src/common/assets/styles/form";
import { useLayoutStyle } from "src/common/assets/styles/layout";
import { useTimingStyle } from "src/common/assets/styles/timing";
import { IFilesData } from "src/common/components/CustomDocumentPicker/CustomDocumentPicker";
import { returnBlobForSingleFileNew } from "src/common/components/CustomDocumentPicker/DocumentPickerUtil";
import Customdropdown from "src/common/components/CustomDropdown/CustomDropdown";
import ErrorMessageContainer from "src/common/components/ErrorMessage/ErrorMessage";
import FileViewer from "src/common/components/FilesViewer/FilesViewer";
import { RenderImage } from "src/common/components/Image/Image";
import { Loader } from "src/common/components/Loader/Loader";
import Typography from "src/common/components/Typography/Typography";
import { useAppTheme } from "src/common/context/AppTheme";
import { usePermission } from "src/common/hooks/usePermission";
import { useTenantId } from "src/common/hooks/useTenantId";
import {
  driverBlockUnblockAction,
  fetchDriverDetailsAction,
} from "src/common/service/driver/action";
import { resetDriverDetails } from "src/common/service/driver/slice";
import { resetOnboardingStepAction } from "src/common/service/onboarding/action";
import { formatToDateMonthYear } from "src/common/utils/dateUtil";
import { MenuType } from "src/common/utils/permissionUtils";
import {
  getMediaDetails,
  IMinuteOption,
} from "src/components/Business/add/addBusinessUtils";
import {
  BLOCK_REASON_CHARACTER_LIMIT,
  ICustomerStatusRequest,
} from "src/components/CustomerDetailPage/Add/CustomDetailUtil";
import BlockRequestModal from "src/components/CustomerDetailPage/BlockRequestModal/BlockRequestModal";
import {
  generateIntialDriverData,
  IDriver,
} from "src/components/DriverDetailPage/Add/DriverDetailUtil";
import { useManageStyle } from "src/components/RequestManagement/Style";
import ImageModal from "src/components/Restaurant/ProfilePreview/ImagePreviewer";
import { checkIfEmpty } from "src/components/Restaurant/ProfilePreview/ProfilePreviewUtil";
import { useRestroStyle } from "src/components/Restaurant/RestroStyle";
// import MapComponentWeb from 'src/submodules/mapservicesfe/src/components/MapTrack/MapComponentWeb';

import { useCredentials } from "src/common/hook/useCredentials";
import { VehicleCategoryLabelKeys } from "src/components/RateTier/Cities/rateTierList/add/AddRateTierUtil";
import { Routes } from "src/routing/paths";
import { AppDispatch, RootState } from "src/store";
import { Icon } from "src/submodules/iconlibrary/src";

const DriverDetailPage = () => {
  const { t: TranslateMessage } = useTranslation();
  const layout = useLayoutStyle();
  const formStyle = useFormStyle();
  const button = useButtonStyle();
  const styles = useRestroStyle();
  const ManageStyle = useManageStyle();
  const timing = useTimingStyle();
  const { theme } = useAppTheme();
  const credentials = useCredentials();
  const googlePlaceApiKey = credentials?.googleApiKey;
  const { canEdit } = usePermission(MenuType.DRIVER);
  const { tenantId } = useTenantId();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { id } = useLocalSearchParams<{ id: string }>();
  const [requestRejectReason, setRequestRejectReason] = useState<string | null>(
    null,
  );
  const [blockedReason, setBlockedReason] = useState<string | null>(null);
  // const [loading, setLoading] = useState<boolean>(false);
  // const [error, setError] = useState<string>('');
  const [uploadLicenceProof, setUploadLicenceProof] = useState<IFilesData[]>(
    [],
  );
  const [uploadRegistrationProof, setUploadRegistrationProof] = useState<
    IFilesData[]
  >([]);
  const [uploadInsuranceProof, setUploadInsuranceProof] = useState<
    IFilesData[]
  >([]);
  const [driverData, setDriverData] = useState<IDriver>({
    ...generateIntialDriverData(),
  });
  const [isModalBlockVisible, setIsBlockModalVisible] =
    useState<boolean>(false);
  const [blockReasonError, setBlockReasonError] = useState<string>("");
  const focus = useIsFocused();
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error, blockStatus } = useSelector(
    (state: RootState) => state.driver.driverDetails,
  );

  const toggleBlockModal = () => {
    setIsBlockModalVisible(!isModalBlockVisible);
    setBlockedReason("");
    setBlockReasonError("");
  };

  const openImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };
  const handleBlockChange = (text: string) => {
    if (text.length > BLOCK_REASON_CHARACTER_LIMIT) {
      setBlockReasonError(
        TranslateMessage("Admin.Delivery.App.Customer.Error.MaxLength", {
          blockreasonLimit: BLOCK_REASON_CHARACTER_LIMIT,
        }),
      );
      return;
    }
    if (text.trim() === "") {
      setBlockReasonError(
        TranslateMessage("Admin.Delivery.App.Customer.Error.Mandatory.Field"),
      );
    } else {
      setBlockReasonError("");
    }
    setBlockedReason(text);
  };

  const customerStatus = [
    { label: "Active", value: "active" },
    { label: "Blocked", value: "blocked" },
  ];

  const onChangeDropdown = (item: IMinuteOption, key: string) => {
    setDriverData((prev) => ({
      ...prev,
      [key]: item.value, // Update the corresponding key in state
    }));
  };

  const getDriverDetails = () => {
    dispatch(fetchDriverDetailsAction(Number(id)));
  };

  const processDriverImages = (driverData: IDriver) => {
    Promise.all(
      driverData?.licenseImages?.map((img) =>
        returnBlobForSingleFileNew(img.fileUrl, tenantId ?? "").then((blob) => {
          const [file] = getMediaDetails(blob);
          return file;
        }),
      ),
    )
      .then((files) => setUploadLicenceProof(files))
      .catch(() => {});

    Promise.all(
      driverData?.registrationImages?.map((img) =>
        returnBlobForSingleFileNew(img.fileUrl, tenantId ?? "").then((blob) => {
          const [file] = getMediaDetails(blob);
          return file;
        }),
      ),
    )
      .then((files) => setUploadRegistrationProof(files))
      .catch(() => {});

    Promise.all(
      driverData?.insuranceImages?.map((img) =>
        returnBlobForSingleFileNew(img.fileUrl, tenantId ?? "").then((blob) => {
          const [file] = getMediaDetails(blob);
          return file;
        }),
      ),
    )
      .then((files) => setUploadInsuranceProof(files))
      .catch(() => {});
  };

  useEffect(() => {
    if (!data) return;

    setDriverData(data);
    processDriverImages(data);
  }, [data]);

  useEffect(() => {
    if (blockStatus !== null) {
      router.push(Routes.DRIVER);
    }
  }, [blockStatus]);

  useEffect(() => {
    if (focus) {
      getDriverDetails();
    }
    return () => {
      dispatch(resetDriverDetails());
    };
  }, [focus]);

  function renderHeading(label: string) {
    return (
      <View style={formStyle.formRow}>
        <View style={formStyle.formCol}>
          <Text style={formStyle.labelHeadTitle}>{label}</Text>
        </View>
      </View>
    );
  }

  function renderInputField(label: string, value: string) {
    return (
      <View style={formStyle.formCol}>
        <Text style={formStyle.labelTitle}>{label}</Text>
        <TextInput
          style={[formStyle.inputField, formStyle.inputDisabled]}
          value={value}
          placeholderTextColor={theme.colors.textNeutral}
          mode="outlined"
          autoCapitalize="none"
          secureTextEntry={false}
          editable={false}
          disabled
          contentStyle={formStyle.inputLabel}
        />
      </View>
    );
  }
  function renderCustomDropDown(label: string, value: string) {
    return (
      <View style={formStyle.formCol}>
        <Text style={formStyle.labelTitle}>{label}</Text>
        <Customdropdown
          data={customerStatus}
          selectedValue={{
            label:
              customerStatus.find(
                (item) => item.value === driverData.activeStatus,
              )?.label || "",
            value: driverData.activeStatus,
          }}
          onChange={(item) => onChangeDropdown(item, "acriveStatus")}
        />
      </View>
    );
  }
  function renderRestaurantLogo(value: string) {
    return (
      <View>
        {/* <View style={formStyle.formCol}>
          <Text style={formStyle.labelTitle}>{label}</Text>
        </View> */}
        <View style={ManageStyle.userImage}>
          <Pressable onPress={() => openImage(value)}>
            <RenderImage
              uri={value}
              style={[ManageStyle.userImageImg as ImageStyle]}
            />
          </Pressable>
        </View>
      </View>
    );
  }

  function renderErrorMsgSection(error: string) {
    return <ErrorMessageContainer message={error} />;
  }

  const renderBlockUnblockButton = () => {
    if (!canEdit) {
      return null;
    }

    if (!driverData.isBlocked) {
      return (
        <Pressable
          style={[button.btnBase, button.btnOutlineDanger, button.btnMd]}
          onPress={toggleBlockModal}
        >
          <Typography
            variant="btnText"
            color={theme.colors.textErrorDark}
            style={{ paddingHorizontal: 0 }}
          >
            {!driverData.isBlocked
              ? TranslateMessage("Admin.Delivery.App.Block")
              : TranslateMessage("Admin.Delivery.App.Unblock")}
          </Typography>
        </Pressable>
      );
    } else {
      return (
        <Pressable
          style={[button.btnBase, button.btnOutlineSuccess, button.btnMd]}
          onPress={() => handleCustomerBlockUnblock(false, "unblock")}
        >
          <Typography
            variant="btnText"
            color={theme.colors.textSuccessDark}
            style={{ paddingHorizontal: 0 }}
          >
            {!driverData.isBlocked
              ? TranslateMessage("Admin.Delivery.App.Block")
              : TranslateMessage("Admin.Delivery.App.Unblock")}
          </Typography>
        </Pressable>
      );
    }
  };

  const handleCustomerBlockUnblock = async (
    isBlocked: boolean,
    blockedReason: string | null,
  ) => {
    const payloadData = {
      id,
      isBlocked,
      blockedReason,
    } as ICustomerStatusRequest;
    dispatch(driverBlockUnblockAction(payloadData));
  };

  function renderDocumentField(label: string, files: IFilesData[]) {
    return (
      <View style={formStyle.formRow}>
        <View style={formStyle.formCol}>
          <Text style={formStyle.labelTitle}>{label}</Text>
          <FileViewer filesData={files} showDefaultImage={true} />
        </View>
      </View>
    );
  }
  const handleBookingPage = () => {
    router.push({
      pathname: `${Routes.DRIVER}${Routes.BOOKINGHISTORY}/[id]`,
      params: {
        id: String(id),
        key: "RIDER",
      },
    });
  };

  function renderEditButton() {
    if (!canEdit) {
      return null;
    }

    return (
      <View style={[layout.container]}>
        <Pressable onPress={handleEditDriver}>
          <Text
            allowFontScaling={false}
            style={[button.btnPrimary, button.btn]}
          >
            {TranslateMessage("Admin.Delivery.App.Edit.Details")}
          </Text>
        </Pressable>
      </View>
    );
  }

  const handleEditDriver = () => {
    dispatch(resetOnboardingStepAction());
    router.push(`${Routes.DRIVER}${Routes.ONBOARDING}/${id}`);
  };
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={[layout.flexCol, layout.sectionSpace, layout.paddinghor17]}>
        <View style={layout.loaderonboard}>
          <Loader loading={loading} />
        </View>

        {isModalBlockVisible && (
          <BlockRequestModal
            isModalVisible={isModalBlockVisible}
            toggleModal={toggleBlockModal}
            handleChange={handleBlockChange}
            description={blockedReason}
            handleRequestRejection={() =>
              handleCustomerBlockUnblock(true, blockedReason)
            }
            error={blockReasonError}
            modalTitle={TranslateMessage(
              "Admin.Delivery.App.Driver.Block.Reason",
            )}
            loading={loading}
          />
        )}
        <View
          style={[
            layout.container,
            styles.headerContainer,
            layout.paddingTop26,
            { flexWrap: "wrap" },
          ]}
        >
          <View style={[styles.filterrow, layout.alignItemCenter]}>
            {/* <Pressable>
              <IconButton
                icon='chevron-left'
                style={[button.btnfilter]}
                size={40}
                iconColor={theme.colors.iconBase}
                onPress={() => router.push(Routes.DRIVER)}
              />
            </Pressable> */}
            <Text style={[layout.Adminh1Title]}>
              {TranslateMessage("Admin.Delivery.App.DriverManagement.Heading")}
            </Text>
          </View>

          {/* require in future */}
          {/* <View style={styles.breadcrumbContainer}>
            <Pressable>
              <Text style={styles.breadcrumb}>
                {TranslateMessage('Admin.Delivery.App.Home')}
              </Text>
            </Pressable>
            <Text style={styles.breadcrumb}>/</Text>
            <Pressable>
              <Text style={styles.breadcrumb}>
                {TranslateMessage(
                  'Admin.Delivery.App.UserManagementList.Heading'
                )}
              </Text>
            </Pressable>
            <Text style={styles.breadcrumb}>/</Text>
            <Text style={[styles.breadcrumb, styles.bredcrumActive]}>
              {TranslateMessage('Admin.Delivery.App.Driver.Detail')}
            </Text>
          </View> */}
        </View>
        <Divider style={layout.DividerSperator} />
        {driverData.latitude && driverData.longitude && googlePlaceApiKey && (
          <View style={{ height: 300 }}>
            {/* <MapComponentWeb
              initialRegion={{ latitude: driverData.latitude, longitude: driverData.longitude }}
              zoom={14}
              googleApiKey={googlePlaceApiKey}
            >
              <Marker
                position={{ lat: driverData.latitude, lng: driverData.longitude }}
                icon={{ url: '/taxi-service-icon.png', scaledSize: { width: 25, height: 25 } as any }}
              />
            </MapComponentWeb> */}
          </View>
        )}
        <View style={[layout.cardBox]}>
          <View
            style={[
              layout.flexDirectionRow,
              layout.alignItemCenter,
              layout.flexWrap,
            ]}
          >
            <View>
              {renderRestaurantLogo(
                // TranslateMessage('Admin.Delivery.App.Customer.Profile.Name'),
                driverData.profileUrl,
              )}
            </View>
            <View style={{ alignItems: "baseline" }}>
              <Typography variant="subHeading" spacing={{ bottom: 8 }}>
                {driverData.firstName}
              </Typography>
              <Typography
                variant="textLabel"
                align="center"
                style={[
                  layout.statusMessage,
                  driverData.isBlocked ? layout.cancelStatus : null,
                ]}
              >
                {driverData.isBlocked
                  ? TranslateMessage(
                      "Admin.Delivery.App.UserManagementList.Filter.Block",
                    )
                  : TranslateMessage(
                      "Admin.Delivery.App.UserManagementList.Filter.Unblock",
                    )}
              </Typography>
            </View>
            {/* Required in Future */}
            {/* <Pressable style={[button.btn, button.btnMd, button.btnOutlinePrimary]} onPress={() => router.push(Routes.CHAT)}>
              <View style={[layout.flexDirectionRow, layout.alignItemCenter, {gap: 5}]}>
                <Icon name='messageOutline' color={theme.colors.iconBase} size={20}/>
                <Typography variant='btnText' style={{paddingHorizontal: 0}} fontWeight='medium'>{TranslateMessage('Admin.Delivery.App.Message')}</Typography>
              </View>
            </Pressable> */}
            <Pressable
              style={[button.btn, button.btnMd, button.btnOutlinePrimary]}
              onPress={handleBookingPage}
            >
              <View
                style={[
                  layout.flexDirectionRow,
                  layout.alignItemCenter,
                  { gap: 5 },
                ]}
              >
                <Icon name="steering" color={theme.colors.iconBase} size={25} />
                <Typography
                  variant="btnText"
                  fontWeight="medium"
                  style={{ paddingHorizontal: 0 }}
                >
                  {TranslateMessage("Admin.Delivery.App.Booking.History")}
                </Typography>
              </View>
            </Pressable>
            {/* <Pressable style={[button.btn, button.btnMd, button.btnOutlineDanger]}>
              <View style={[layout.flexDirectionRow, layout.alignItemCenter, { gap: 5 }]}>
                <Icon name='cancel' color={theme.colors.iconErrorDark} size={25} />
                <Typography variant='btnText' fontWeight='medium'  color={theme.colors.textErrorDark} style={{ paddingHorizontal: 0 }}>{TranslateMessage('Admin.Delivery.App.Booking.Suspend')}</Typography>
              </View>
            </Pressable> */}
          </View>
        </View>
        <View style={[layout.cardBox, layout.flexCol]}>
          <View style={[formStyle.formRow, layout.alignCenter]}>
            <View style={formStyle.formCol}>
              <Text style={[formStyle.labelHeadTitle, layout.mb0]}>
                {renderHeading(
                  TranslateMessage("Admin.Delivery.App.Driver.Detail"),
                )}
              </Text>
            </View>
            {renderEditButton()}
            {renderBlockUnblockButton()}
          </View>

          <View style={formStyle.formRow}>
            {renderInputField(
              TranslateMessage("Admin.Delivery.App.Customer.Driver.Name"),
              driverData.firstName,
            )}
            {renderInputField(
              TranslateMessage("Admin.Delivery.App.Driver.Vehicle.Type"),
              checkIfEmpty(driverData?.riderVehicleRegistration?.vehicleType),
            )}
          </View>
          <View style={formStyle.formRow}>
            {renderInputField(
              TranslateMessage("Admin.Delivery.App.Customer.Email"),
              driverData.email,
            )}
            {renderInputField(
              TranslateMessage("Admin.Delivery.App.Customer.Phone.Number"),
              driverData.phoneNumber,
            )}
          </View>
          <View style={formStyle.formRow}>
            {renderInputField(
              TranslateMessage(
                "Admin.Delivery.App.Customer.Registeration.Date",
              ),
              driverData.createdAt
                ? formatToDateMonthYear(driverData.createdAt)
                : "",
            )}
            {renderInputField(
              TranslateMessage(
                "Admin.Delivery.App.RequestManagementList.Table.Status",
              ),
              driverData.isBlocked
                ? TranslateMessage(
                    "Admin.Delivery.App.UserManagementList.Filter.Block",
                  )
                : TranslateMessage(
                    "Admin.Delivery.App.UserManagementList.Filter.Unblock",
                  ),
            )}
          </View>
          {/* <Divider style={layout.seperator} /> */}
          {/* <View style={formStyle.formCol}> */}
          <Text style={formStyle.labelHeadTitle}>
            {TranslateMessage("Admin.Delivery.App.Restaurant.Licence.Document")}
          </Text>

          <View style={formStyle.formRow}>
            {renderInputField(
              TranslateMessage("Admin.Delivery.App.Restaurant.Licence.Number"),
              driverData?.riderLicense?.licenseNumber,
            )}
            {renderInputField(
              TranslateMessage("Admin.Delivery.App.Restaurant.Expiry.Date"),
              formatToDateMonthYear(driverData?.riderLicense?.expiryDate),
            )}
          </View>
          <View style={formStyle.formRow}>
            {/* required in future */}
            {/* {renderInputField(
                TranslateMessage('Admin.Delivery.App.Restaurant.Created.By'),
                driverData?.riderLicense?.userId
              )} */}
            {renderInputField(
              TranslateMessage("Admin.Delivery.App.Restaurant.Created.At"),
              formatToDateMonthYear(driverData?.riderLicense?.createdAt),
            )}
          </View>
          <View style={[formStyle.formRow]}>
            {renderDocumentField(
              TranslateMessage(
                "Admin.Delivery.App.OnboardingRequest.LicenseProof",
              ),
              uploadLicenceProof,
            )}
          </View>
          {/* </View> */}

          <Text style={formStyle.labelHeadTitle}>
            {TranslateMessage("Admin.Delivery.App.Driver.License.Details")}
          </Text>

          <View style={formStyle.formRow}>
            {renderInputField(
              TranslateMessage(
                "Admin.Delivery.App.Driver.License.Registration.Number",
              ),
              checkIfEmpty(
                driverData?.riderVehicleRegistration?.registrationNumber,
              ),
            )}
          </View>
          <View style={formStyle.formRow}>
            {renderInputField(
              TranslateMessage("Admin.Delivery.App.Driver.Vehicle.Type"),
              checkIfEmpty(driverData?.riderVehicleRegistration?.vehicleType),
            )}
            {renderInputField(
              TranslateMessage("Admin.Delivery.App.Restaurant.Created.At"),
              driverData?.riderVehicleRegistration?.createdAt &&
                formatToDateMonthYear(
                  driverData?.riderVehicleRegistration?.createdAt,
                ),
            )}
          </View>
          <View style={formStyle.formRow}>
            {renderInputField(
              TranslateMessage("Admin.Delivery.App.Vehicle.Category"),
              TranslateMessage(
                VehicleCategoryLabelKeys[
                  checkIfEmpty(
                    driverData?.riderVehicleRegistration?.vehicleCategory,
                  ) as keyof typeof VehicleCategoryLabelKeys
                ] ??
                  checkIfEmpty(
                    driverData?.riderVehicleRegistration?.vehicleCategory,
                  ),
              ),
            )}
            {renderInputField(
              TranslateMessage("Admin.Delivery.App.Vehicle.Name"),
              checkIfEmpty(driverData?.riderVehicleRegistration?.vehicleName),
            )}
          </View>
          <View style={[formStyle.formRow]}>
            {renderDocumentField(
              TranslateMessage("Admin.Delivery.App.Restaurant.Vehicle.Proff"),
              uploadRegistrationProof,
            )}
          </View>
          <View style={formStyle.formCol}>
            <Text style={formStyle.labelHeadTitle}>
              {TranslateMessage("Admin.Delivery.App.Driver.Emergency.Details")}
            </Text>

            <View style={formStyle.formRow}>
              {renderInputField(
                TranslateMessage("Admin.Delivery.App.Driver.Full.Name"),
                driverData?.emergencyContactDto?.fullName,
              )}
              {renderInputField(
                TranslateMessage("Admin.Delivery.App.Customer.Phone.Number"),
                driverData?.emergencyContactDto?.phoneNumber,
              )}
            </View>
            <View style={formStyle.formRow}>
              {renderInputField(
                TranslateMessage("Admin.Delivery.App.Driver.Relationship"),
                driverData?.emergencyContactDto?.relationship,
              )}
              {renderInputField(
                TranslateMessage("Admin.Delivery.App.Restaurants.AddressTitle"),
                driverData?.emergencyContactDto?.address,
              )}
            </View>
          </View>
          {/* <Text style={formStyle.labelHeadTitle}>
            {TranslateMessage('Admin.Delivery.App.Driver.Payment.Method')}
          </Text> */}
          {/* <Text style={formStyle.labelTitle}>
            {driverData?.bankDetailsResponse?.paymentMethod === PaymentOptions.BANKTRANSFER
              ? ` (${TranslateMessage('Admin.Delivery.App.Default')})`
              : ''}
          </Text> */}
          {/* <View style={formStyle.formRow}> */}
          {/* {renderInputField(
              TranslateMessage('Admin.Delivery.App.Driver.ifscCode'),
              driverData?.bankDetailsResponse?.ifscCode
            )} */}
          {/* {renderInputField(
              TranslateMessage('Admin.Delivery.App.Driver.AccountHolderName'),
              driverData?.bankDetailsResponse?.accountHolderName,
            )}

            {renderInputField(
              TranslateMessage('Admin.Delivery.App.Driver.MobileNumber'),
              driverData?.bankDetailsResponse?.mobileNumber,
            )} */}
          {/* </View> */}
          {/* <View style={formStyle.formRow}> */}
          {/* {renderInputField(
              TranslateMessage('Admin.Delivery.App.Driver.RibNumber'),
              driverData?.bankDetailsResponse?.ribNumber
            )} */}
          {/* {renderInputField(
              TranslateMessage('Admin.Delivery.App.Driver.Payment.Method'),
              getPaymentMethodByKey(
                driverData?.bankDetailsResponse?.paymentMethod,
              ),
            )} */}
          {/* </View> */}

          <Text style={formStyle.labelHeadTitle}>
            {TranslateMessage(
              "Admin.Delivery.App.Driver.Vehicle.Insurance.Details",
            )}
          </Text>

          <View style={formStyle.formRow}>
            {renderInputField(
              TranslateMessage(
                "Admin.Delivery.App.Driver.Vehicle.Insurance.Number",
              ),
              driverData?.vehicleInsurance?.insuranceNumber,
            )}
            {renderInputField(
              TranslateMessage("Admin.Delivery.App.Restaurant.Created.At"),
              driverData?.vehicleInsurance?.createdAt &&
                formatToDateMonthYear(driverData?.vehicleInsurance?.createdAt),
            )}
          </View>
          <View style={[formStyle.formRow]}>
            {renderDocumentField(
              TranslateMessage("Admin.Delivery.App.Restaurant.Insurance.Proof"),
              uploadInsuranceProof,
            )}
          </View>
          <View>
            <ImageModal
              setModalVisible={setModalVisible}
              selectedImage={selectedImage}
              modalVisible={modalVisible}
            />
          </View>
          {driverData.isBlocked && (
            <View style={formStyle.formRow}>
              {renderInputField(
                TranslateMessage(
                  "Admin.Delivery.App.RequestManagementList.Table.Blocked.Reason",
                ),
                driverData.blockedReason,
              )}
            </View>
          )}
          {renderErrorMsgSection(error ?? "")}
        </View>
      </View>
    </ScrollView>
  );
};

export default DriverDetailPage;
