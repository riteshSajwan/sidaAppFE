import Head from 'expo-router/head';
import type * as LeafletNamespace from 'leaflet';
import React, { useEffect, useState } from 'react';
import type { Circle, MapContainer, Marker, Polyline, TileLayer } from 'react-leaflet';
import { useMap } from 'react-leaflet';
import { DimensionValue, Platform, View } from 'react-native';
import { createMarkerIcon } from './leafletIcons';

type LatLng = {
  latitude: number;
  longitude: number;
};
type LeafletType = typeof LeafletNamespace;
type LeafletComponents = {
  MapContainer: typeof MapContainer;
  TileLayer: typeof TileLayer;
  Marker: typeof Marker;
  Circle: typeof Circle;
  Polyline: typeof Polyline;
};
type Marker = LatLng & { icon?: string , vehicleCategory?: string};

type Props = {
  pickupPin?: LatLng | null;
  destinationPin?: LatLng | null;
  markers?: Marker[];
  pickupIconSrc?: string;
  destinationIconSrc?: string;
  markerIconSrc?: string;
  iconSize?: number;
  markerIconSize?: number;
  radius?: number;
  showRadius?: boolean;
  polylineColor?: string;
  polylineDash?: number[];
  mapHeight?: number | string;
  tileUrl?: string;
  tileAttribution?: string;
  tileSubdomains?: string;
  mapCenter?: LatLng;
  renderMarkerImage? : (category: string) => string;
  zoom?: number;
};

export default function LeafletMap({
  pickupPin = null,
  destinationPin = null,
  markers = [],
  pickupIconSrc = 'https://cdn-icons-png.flaticon.com/512/487/487021.png',
  destinationIconSrc = 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  markerIconSrc = 'https://cdn-icons-png.flaticon.com/512/743/743131.png',

  iconSize = 36,
  markerIconSize = 40,

  radius = 0,
  showRadius = false,
  polylineColor = '#1976D2',
  polylineDash = [6, 10],
  mapHeight = 300,

  tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  tileAttribution = '© OpenStreetMap contributors',
  tileSubdomains = 'abc',
  mapCenter = { latitude: 0, longitude: 0 },
  renderMarkerImage,
  zoom = 12
}: Props) {
  const [leafletComponents, setLeafletComponents] = useState<LeafletComponents | null>(null);
  const [L, setL] = useState<LeafletType | null>(null);

  useEffect(() => {
    Promise.all([
      import('leaflet'),
      import('react-leaflet')
    ]).then(([Leaflet, RL]) => {
      const { MapContainer, TileLayer, Marker, Circle, Polyline } = RL;

      delete (Leaflet.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;

      Leaflet.Icon.Default.mergeOptions({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      setL(Leaflet);
      setLeafletComponents({
        MapContainer,
        TileLayer,
        Marker,
        Circle,
        Polyline,
      });
    });
  }, []);

  function RecenterOnChange({ center, zoomLevel }: { center: LatLng | null; zoomLevel?: number }) {
    const map = useMap();
    useEffect(() => {
      if (!center) return;
  
      map.setView(
        [center.latitude, center.longitude],
        zoomLevel ?? map.getZoom(),
        { animate: true }
      );
    }, [center?.latitude, center?.longitude, zoomLevel]);
  
    return null;
  }

  const focusPoint = pickupPin ?? destinationPin;
  
  if (!leafletComponents || !L) return <div>Loading map...</div>;

  const { MapContainer, TileLayer, Marker, Circle, Polyline } = leafletComponents;

  const pickupIcon = createMarkerIcon({
    src: pickupIconSrc,
    size: iconSize,
    offsetY: -10,
  });

  const destinationIcon = createMarkerIcon({
    src: destinationIconSrc,
    size: iconSize,
    offsetY: -10,
  });

  const markerIcon = createMarkerIcon({
    src: markerIconSrc,
    width: markerIconSize,
    height: markerIconSize * 1.8,
  });

  const defaultCenter =
    pickupPin ||
    destinationPin ||
    (markers.length > 0
      ? { latitude: markers[0].latitude, longitude: markers[0].longitude }
      : mapCenter);

  // Generate a smooth half-circle curve between two LatLng points
  function generateHalfCircleCurve(
    start: LatLng,
    end: LatLng,
    segments = 50,
    direction: 1 | -1 = 1
  ): [number, number][] {
    const lat1 = start.latitude;
    const lng1 = start.longitude;
    const lat2 = end.latitude;
    const lng2 = end.longitude;

    const midLat = (lat1 + lat2) / 2;
    const midLng = (lng1 + lng2) / 2;

    const dx = lng2 - lng1;
    const dy = lat2 - lat1;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const curveHeight = distance * 0.5;

    const nx = -dy;
    const ny = dx;
    const length = Math.sqrt(nx * nx + ny * ny);

    // ⬅️ Flip curve using "direction"
    const ux = direction * (nx / length) * curveHeight;
    const uy = direction * (ny / length) * curveHeight;

    const controlLat = midLat + uy;
    const controlLng = midLng + ux;

    const points: [number, number][] = [];

    for (let t = 0; t <= 1; t += 1 / segments) {
      const x =
        (1 - t) * (1 - t) * lng1 +
        2 * (1 - t) * t * controlLng +
        t * t * lng2;

      const y =
        (1 - t) * (1 - t) * lat1 +
        2 * (1 - t) * t * controlLat +
        t * t * lat2;

      points.push([y, x]);
    }

    return points;
  }



  return (
    <>
      {Platform.OS === 'web' && (
        <Head>
          <link
            rel='stylesheet'
            href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
          />
        </Head>
      )}

      <View style={{ height: mapHeight as DimensionValue }}>
        <MapContainer
          attributionControl={false}
          center={[defaultCenter.latitude, defaultCenter.longitude]}
          zoom={zoom}
          style={{ width: '100%', height: '100%' }}
        >
          <RecenterOnChange center={defaultCenter} zoomLevel={zoom} />
          {/* Reusable Tile Layer */}
          <TileLayer
            url={tileUrl}
            attribution={tileAttribution}
            subdomains={tileSubdomains}
          />

          {/* Pickup Pin */}
          {pickupPin && (
            <Marker
              icon={pickupIcon}
              position={[pickupPin.latitude, pickupPin.longitude]}
            />
          )}

          {/* Destination Pin */}
          {destinationPin && (
            <Marker
              icon={destinationIcon}
              position={[destinationPin.latitude, destinationPin.longitude]}
            />
          )}

          {/* markers List */}
          {markers.map((cab, idx) =>  {
            const markerIcon = createMarkerIcon({
              src: renderMarkerImage ? renderMarkerImage(cab.vehicleCategory ?? '') :markerIconSrc,
              width: markerIconSize,
              height: markerIconSize * 1.8,
            });
            return (
              <Marker
                key={idx}
                icon={markerIcon}
                position={[cab.latitude, cab.longitude]}
              />
            );
          })}

          {/* Route Polyline */}
          {pickupPin && destinationPin && (
            <Polyline
              positions={generateHalfCircleCurve(pickupPin, destinationPin, 150, -1)}
              pathOptions={{
                color: polylineColor,
                weight: 4,
                dashArray: polylineDash.join(' '),
              }}
            />
          )}

          {/* Radius */}
          {showRadius && pickupPin && (
            <Circle
              center={[pickupPin.latitude, pickupPin.longitude]}
              radius={radius * 1000}
              pathOptions={{ fillOpacity: 0.25, color: polylineColor }}
            />
          )}
        </MapContainer>
      </View>
    </>
  );
}
