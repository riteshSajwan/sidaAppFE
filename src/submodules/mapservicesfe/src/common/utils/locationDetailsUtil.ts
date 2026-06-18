import * as Location from 'expo-location';

interface IAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export const moved_100m = 100;
export const time_interval = 25000;

export const getCountryFromCoordinates = async (
  latitude: number,
  longitude: number,
  googleApi: string
): Promise<{ country: string }> => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleApi}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      const addressComponents = data.results[0].address_components;
      const country =
        addressComponents.find((component: IAddressComponent) =>
          component.types.includes('country')
        )?.short_name || '';

      return { country };
    }
    return { country: '' };
  } catch (error) {
    console.error('Error in fetching country and city from Google API:', error);
    return { country: '' };
  }
};

export async function getAddressFromCoordinates(
  latitude: number,
  longitude: number,
  googleApi: string
): Promise<string | null> {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleApi}`
    );

    if (!response.ok) {
      console.error('Error fetching address:', response.statusText);
      return null;
    }

    const data = await response.json();
    return data.results[0]?.formatted_address || null;
  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    return null;
  }
}

export const getCoordinatesFromAddress = async (address: string) => {
  try {
    const geocode = await Location.geocodeAsync(address);

    if (geocode.length > 0) {
      const { latitude, longitude } = geocode[0];
      return { latitude, longitude };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting coordinates:', error);
  }
};

export const getBearing = (
  start: { latitude: number; longitude: number },
  end: { latitude: number; longitude: number }
) => {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;

  const lat1 = toRad(start.latitude);
  const lon1 = toRad(start.longitude);
  const lat2 = toRad(end.latitude);
  const lon2 = toRad(end.longitude);

  const dLon = lon2 - lon1;

  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

  const brng = Math.atan2(y, x);
  return (toDeg(brng) + 360) % 360;
};

type LatLng = { latitude: number; longitude: number };

export function generateCurvedPolyline(
  start: LatLng,
  end: LatLng,
  curvature = 0.4,   // 0 = straight, ~0.2 gentle, 0.5 strong
  numPoints = 64     // more points => smoother curve
): LatLng[] {
  if (!start || !end) return [];

  const lat1 = start.latitude;
  const lon1 = start.longitude;
  const lat2 = end.latitude;
  const lon2 = end.longitude;

  // If start === end just return single point
  if (lat1 === lat2 && lon1 === lon2) return [{ latitude: lat1, longitude: lon1 }];

  // midpoint
  const latMid = (lat1 + lat2) / 2;
  const lonMid = (lon1 + lon2) / 2;

  // vector from start -> end in "degree space"
  const dx = lon2 - lon1;
  const dy = lat2 - lat1;

  // perpendicular vector (-dy, dx)
  let px = -dy;
  let py = dx;

  // normalize perpendicular vector
  const plen = Math.sqrt(px * px + py * py);
  if (plen === 0) {
    // fallback to straight line
    const pts = [];
    for (let i = 0; i < numPoints; i++) {
      const t = i / (numPoints - 1);
      pts.push({
        latitude: lat1 + (lat2 - lat1) * t,
        longitude: lon1 + (lon2 - lon1) * t,
      });
    }
    return pts;
  }
  px /= plen;
  py /= plen;

  // scale factor: a fraction of the distance between points (in degree-space)
  // sqrt(dx^2+dy^2) is distance in degree units; multiply so control point offset is proportional.
  const distanceDeg = Math.sqrt(dx * dx + dy * dy);
  const offset = distanceDeg * curvature; // adjust curvature scale here

  const controlLat = latMid + py * offset;
  const controlLon = lonMid + px * offset;

  // generate quadratic Bezier points
  const points: LatLng[] = [];
  for (let i = 0; i < numPoints; i++) {
    const t = i / (numPoints - 1);
    const oneMinusT = 1 - t;

    // Quadratic Bezier: B(t) = (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
    const lat =
      oneMinusT * oneMinusT * lat1 +
      2 * oneMinusT * t * controlLat +
      t * t * lat2;
    const lon =
      oneMinusT * oneMinusT * lon1 +
      2 * oneMinusT * t * controlLon +
      t * t * lon2;

    points.push({ latitude: lat, longitude: lon });
  }

  return points;
}

export function getMidpoint(a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }) {
  return {
    latitude: (a.latitude + b.latitude) / 2,
    longitude: (a.longitude + b.longitude) / 2,
  };
}