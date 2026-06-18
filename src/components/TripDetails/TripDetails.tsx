import { useTranslation } from "react-i18next";
import { Image, Pressable, ScrollView, View } from "react-native";
import { Divider } from "react-native-paper";
import { useButtonStyle } from "src/common/assets/styles/button";
import { useLayoutStyle } from "src/common/assets/styles/layout";
import Typography from "src/common/components/Typography/Typography";
import { useAppTheme } from "src/common/context/AppTheme";
import { useCredentials } from "src/common/hook/useCredentials";
import { generateCurvedPolyline } from "src/common/utils/mapUtil";
import { useTripStyle } from "src/components/TripDetails/TripStyle";
import { Icon } from "src/submodules/iconlibrary/src";
// import MapComponentWeb from 'src/submodules/mapservicesfe/src/components/MapTrack/MapComponentWeb'

const TripDetailsContainer = () => {
  const layout = useLayoutStyle();
  const { theme } = useAppTheme();
  const { t: TranslateMessage } = useTranslation();
  const tripStyle = useTripStyle();
  const button = useButtonStyle();
  const credentials = useCredentials();
  const googlePlaceApiKey = credentials?.googleApiKey;

  const pickupIcon = "/markerIcon/pickUpIcon.png";
  const destinationIcon = "/markerIcon/destinationIcon.png";
  function renderMap() {
    if (!googlePlaceApiKey) {
      return null;
    }

    const pickupLat = 30.3562,
      pickupLng = 78.0855;
    const destLat = 30.287,
      destLng = 77.9983;
    const curvedPath = generateCurvedPolyline(
      { latitude: pickupLat, longitude: pickupLng },
      { latitude: destLat, longitude: destLng },
      0.45,
      80,
    ).map((p) => ({ lat: p.latitude, lng: p.longitude }));

    return (
      // <MapComponentWeb
      // 	initialRegion={{ latitude: pickupLat, longitude: pickupLng }}
      // 	zoom={12}
      // 	mapStyle={{ height: '100%' }}
      // 	googleApiKey={googlePlaceApiKey}
      // >
      // 	<Marker
      // 		position={{ lat: pickupLat, lng: pickupLng }}
      // 		icon={{ url: pickupIcon, scaledSize: { width: 25, height: 25 } as any }}
      // 	/>
      // 	<Marker
      // 		position={{ lat: destLat, lng: destLng }}
      // 		icon={{ url: destinationIcon, scaledSize: { width: 25, height: 25 } as any }}
      // 	/>
      // 	<Polyline
      // 		path={curvedPath}
      // 		options={{
      // 			strokeColor: theme.colors.borderErrorInverse,
      // 			strokeOpacity: 0,
      // 			strokeWeight: 3,
      // 			icons: [{ icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 3 }, offset: '0', repeat: '9px' }],
      // 		}}
      // 	/>
      // </MapComponentWeb>
      <></>
    );
  }

  function renderDriverDetails() {
    return (
      <View style={[layout.cardBox, layout.cardRoundNess]}>
        <Typography variant="subTitle" spacing={{ bottom: 10 }}>
          {TranslateMessage("Admin.Delivery.App.Driver.Detail")}
        </Typography>
        <View
          style={[
            layout.flexDirectionRow,
            layout.alignItemCenter,
            layout.justifyBetween,
            layout.flexWrap,
          ]}
        >
          <View style={[layout.flexDirectionRow, layout.alignItemCenter]}>
            <Image
              source={require("src/common/assets/images/avatar.png")}
              style={[tripStyle.userImg, { width: 52, height: 52 }]}
            />
            <View style={[layout.flexColItem, { rowGap: 5 }]}>
              <View style={[layout.flexDirectionRow, layout.alignItemCenter]}>
                <Typography variant="subTitle" spacing={{ bottom: 5 }}>
                  Marc Johns
                </Typography>
                <Typography
                  variant="textLabel"
                  align="center"
                  style={[layout.statusMessage]}
                >
                  On Ride
                </Typography>
              </View>
              <View
                style={[
                  layout.flexDirectionRow,
                  layout.alignItemCenter,
                  { gap: 5 },
                ]}
              >
                {/* <CustomRating  rating={4.5} imageSize={15}/> */}
                <Icon
                  name="star"
                  size={12}
                  color={theme.colors.iconWarningDark}
                />
                <Typography
                  variant="textLabel"
                  style={{ color: theme.colors.textNeutral }}
                  spacing={{ top: 2 }}
                >
                  4.9
                </Typography>
                <Typography
                  variant="textLabel"
                  style={{ color: theme.colors.textNeutral }}
                  spacing={{ top: 2 }}
                >
                  (950 rides)
                </Typography>
              </View>
            </View>
          </View>

          <View
            style={[layout.flexColItem, layout.alignItemCenter, { rowGap: 5 }]}
          >
            <Image
              source={require("src/common/assets/images/car-icon.png")}
              resizeMode="contain"
              style={{ width: 58, height: 30 }}
            />
            <Typography variant="subHeading" align="center">
              ABC-1234
            </Typography>
            <Typography
              variant="textLabel"
              align="center"
              style={{ color: theme.colors.textNeutral }}
            >
              Toyota White Camay
            </Typography>
          </View>
        </View>
      </View>
    );
  }

  function renderCustomerDetails() {
    return (
      <View style={[layout.cardBox, layout.cardRoundNess]}>
        <Typography variant="subTitle" spacing={{ bottom: 10 }}>
          {TranslateMessage("Admin.Delivery.App.Customer.Detail")}
        </Typography>
        <View
          style={[
            layout.flexDirectionRow,
            layout.alignItemCenter,
            layout.justifyBetween,
            layout.flexWrap,
          ]}
        >
          <View style={[layout.flexDirectionRow, layout.alignItemCenter]}>
            <Image
              source={require("src/common/assets/images/avatar.png")}
              style={[tripStyle.userImg, { width: 52, height: 52 }]}
            />
            <Typography variant="subTitle" spacing={{ bottom: 5 }}>
              Ram Narayan Shah
            </Typography>
          </View>

          <View
            style={[
              layout.flexDirectionRow,
              layout.alignItemCenter,
              { rowGap: 5 },
            ]}
          >
            <Pressable
              style={[button.btn, button.btnPrimary, button.btnCircle]}
            >
              <Icon name="phone" size={18} color={theme.colors.iconInverse} />
            </Pressable>
            <Pressable
              style={[button.btn, button.btnPrimary, button.btnCircle]}
            >
              <Icon
                name="chatLine"
                size={18}
                color={theme.colors.iconInverse}
              />
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  function renderDestination() {
    return (
      <View style={[layout.cardBox, layout.cardRoundNess]}>
        <View style={tripStyle.tripDetail}>
          <View style={tripStyle.tripTimeCol}>
            <Typography variant="body">09:33 PM</Typography>
            <View style={tripStyle.straightLine} />
            <Typography variant="body">09:56 PM</Typography>
          </View>
          <View style={[layout.flexCol, layout.justifyBetween]}>
            <View
              style={[
                layout.flexDirectionRow,
                layout.alignItemCenter,
                { gap: 10 },
              ]}
            >
              <Icon
                name="pickup"
                size={30}
                color={theme.colors.iconSuccessDark}
              />
              <Typography
                variant="subTitle"
                style={{ fontSize: theme.fontSize.S2Subtitle }}
              >
                Green Valley Apartments
              </Typography>
            </View>
            <Divider style={[tripStyle.divider]} />
            <View
              style={[
                layout.flexDirectionRow,
                layout.alignItemCenter,
                { gap: 10 },
              ]}
            >
              <Icon
                name="mapsArrowDiagonal"
                size={30}
                color={theme.colors.iconErrorDark}
              />
              <Typography
                variant="subTitle"
                spacing={{ top: 5 }}
                style={{ fontSize: theme.fontSize.S2Subtitle }}
              >
                6391 Elgin St. Celina, Delaware 10299 6391 Elgin St.
              </Typography>
            </View>
          </View>
        </View>
      </View>
    );
  }
  return (
    <>
      <ScrollView style={layout.flexCol} contentContainerStyle={layout.flexCol}>
        <View style={[layout.flexCol, { minHeight: 250 }]}>{renderMap()}</View>
        <View style={[layout.paddinghor17, layout.paddingTop26]}>
          {renderDestination()}
          {renderDriverDetails()}
          {renderCustomerDetails()}
        </View>
      </ScrollView>
    </>
  );
};

export default TripDetailsContainer;
