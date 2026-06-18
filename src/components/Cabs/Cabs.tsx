import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";
import { Searchbar } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { useButtonStyle } from "src/common/assets/styles/button";
import { useLayoutStyle } from "src/common/assets/styles/layout";
import Customdropdown from "src/common/components/CustomDropdown/CustomDropdown";
import CustomGooglePlacesAutocomplete from "src/common/components/CustomGooglePlacesAutocomplete/CustomGooglePlacesAutocomplete";
import Typography from "src/common/components/Typography/Typography";
import { useAppTheme } from "src/common/context/AppTheme";
import { useCredentials } from "src/common/hook/useCredentials";
import {
  fetchCabByVehicleNumberAction,
  fetchNearByCabsAction,
} from "src/common/service/cab/action";
import { fetchNearByCabsSuccess } from "src/common/service/cab/slice";
import { getCurrentLocationWeb } from "src/common/utils/getCurrentLocation";
import { IMinuteOption } from "src/components/Business/add/addBusinessUtils";
import {
  generateInitialFilterData,
  ICabFilter,
  IDriverForCabs,
  ILocation,
  ISearchType,
  searchByOptions,
} from "src/components/Cabs/CabsUtil";
import DriverListWithSearch from "src/components/Cabs/DriverListWithSearch";
import { useRestroStyle } from "src/components/Restaurant/RestroStyle";
import { AppDispatch, RootState } from "src/store";
// import MapComponentWeb from 'src/submodules/mapservicesfe/src/components/MapTrack/MapComponentWeb';

const CabsDetailsContainer = () => {
  const layout = useLayoutStyle();
  const { theme } = useAppTheme();
  const { t: TranslateMessage } = useTranslation();
  const restroStyles = useRestroStyle();
  const button = useButtonStyle();
  const cabsIcon = "/taxi-service-icon.png";
  const dispatch = useDispatch<AppDispatch>();
  const credentials = useCredentials();
  const googlePlaceApiKey = credentials?.googleApiKey;
  const [location, setLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
    address: "",
  });
  const [selectedDriver, setSelectedDriver] = useState<IDriverForCabs | null>(
    null,
  );

  const [filter, setFilter] = useState<ICabFilter>({
    ...generateInitialFilterData(),
  });
  const { list, loading, error } = useSelector(
    (state: RootState) => state.cab.nearByCabsListing,
  );
  const handleSearchText = (searchKey: string) => {
    setFilter({ ...filter, searchKey });
  };
  const MemoizedGooglePlacesAutocomplete = useMemo(
    () => CustomGooglePlacesAutocomplete,
    [filter.searchKey],
  );

  const handlePlaceSelect = async (
    formatted_address: string,
    lat: number,
    lng: number,
  ) => {
    setLocation((prevState) => ({
      ...prevState,
      latitude: lat,
      longitude: lng,
      address: formatted_address,
    }));
  };

  const onChangeDropdown = (item: IMinuteOption) => {
    setFilter({ ...filter, searchType: item.value, searchKey: "" });
  };

  useEffect(() => {
    if (!googlePlaceApiKey) return;

    getCurrentLocationWeb(googlePlaceApiKey).then((loc) => {
      if (loc) {
        setLocation({
          latitude: loc.latitude,
          longitude: loc.longitude,
          address: loc.address ?? "",
        });
      }
    });
  }, [googlePlaceApiKey]);

  const handleSearchPress = () => {
    if (filter.searchType === ISearchType.VEHICLE_NO && filter.searchKey) {
      dispatch(fetchCabByVehicleNumberAction(filter.searchKey));
    } else if (location.address) {
      dispatch(
        fetchNearByCabsAction(location.latitude, location.longitude, 5, 10),
      );
    }
  };

  function renderMap() {
    if (!googlePlaceApiKey) {
      return <View style={{ flex: 1 }} />;
    }

    return (
      <View style={{ flex: 1 }}>
        {/* <MapComponentWeb
          initialRegion={{ latitude: location.latitude || 20.5937, longitude: location.longitude || 78.9629 }}
          zoom={12}
          mapStyle={{ height: '100%' }}
          googleApiKey={googlePlaceApiKey}
        >
          {list.map((cab, idx) => (
            <Marker
              key={idx}
              position={{ lat: cab.latitude, lng: cab.longitude }}
              icon={{ url: cabsIcon, scaledSize: { width: 25, height: 25 } as any }}
            />
          ))}
        </MapComponentWeb> */}
      </View>
    );
  }
  function renderSearch() {
    return (
      <View
        style={[layout.mapSearch, layout.flexNoWrap, { overflow: "visible" }]}
      >
        <View style={{ width: "25%" }}>
          <Customdropdown
            data={searchByOptions()}
            selectedValue={{ label: "", value: filter.searchType }}
            onChange={onChangeDropdown}
            style={{ height: 50 }}
          />
        </View>
        {filter.searchType === ISearchType.VEHICLE_NO ? (
          <Searchbar
            value={filter.searchKey}
            onChangeText={handleSearchText}
            placeholder={TranslateMessage("Admin.Delivery.App.SearchLabel")}
            placeholderTextColor={theme.colors.textNeutral}
            iconColor={theme.colors.iconBase}
            mode="bar"
            inputStyle={restroStyles.searchbarInput}
            style={[restroStyles.searchbar, { height: 55 }]}
            rippleColor={"transparent"}
          />
        ) : (
          <View
            style={{ width: "50%", backgroundColor: theme.colors.borderBase }}
          >
            <MemoizedGooglePlacesAutocomplete
              onPlaceSelect={handlePlaceSelect}
              initialAddress={location.address}
            />
          </View>
        )}
        <Pressable
          onPress={handleSearchPress}
          style={[
            button.btn,
            button.btnPrimary,
            {
              paddingHorizontal: theme.spacing.sm,
              paddingVertical: 0,
              height: 42,
            },
          ]}
        >
          <Typography
            variant="btnText"
            style={{ color: theme.colors.textInverse }}
            spacing={{ top: 7 }}
          >
            {TranslateMessage("Admin.Delivery.App.SearchLabel")}
          </Typography>
        </Pressable>
      </View>
    );
  }
  const handleDriverLocation = (driver: IDriverForCabs) => {
    setSelectedDriver(driver);
    dispatch(
      fetchNearByCabsSuccess([
        {
          latitude: driver.latitude ?? 30.3157,
          longitude: driver.longitude ?? 78.0336,
        },
      ]),
    );
    setLocation({
      latitude: driver.latitude ?? 30.3157,
      longitude: driver.longitude ?? 78.0336,
    });
  };

  return (
    <>
      <View style={{ flex: 1 }}>
        <View style={[layout.flexDirectionRow, { flex: 1 }]}>
          <View style={{ flex: 0.2 }}>
            <DriverListWithSearch
              selectedDriverId={selectedDriver?.id}
              onDriverSelect={handleDriverLocation}
              headerTitle={`${TranslateMessage("Admin.Delivery.App.Driver")}s`}
              pageSize={10}
            />
          </View>

          <View style={{ flex: 0.8 }}>
            {renderMap()}
            {/* {renderSearch()} */}
          </View>
        </View>
      </View>
    </>
  );
};

export default CabsDetailsContainer;
