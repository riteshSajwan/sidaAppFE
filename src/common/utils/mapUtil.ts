type LatLng = { latitude: number; longitude: number };

export function generateCurvedPolyline(
  start: LatLng,
  end: LatLng,
  curvature = 0.45,
  numPoints = 80
): LatLng[] {
  if (!start || !end) return [];
  const lat1 = start.latitude, lon1 = start.longitude;
  const lat2 = end.latitude, lon2 = end.longitude;
  if (lat1 === lat2 && lon1 === lon2) return [{ latitude: lat1, longitude: lon1 }];

  const latMid = (lat1 + lat2) / 2, lonMid = (lon1 + lon2) / 2;
  const dx = lon2 - lon1, dy = lat2 - lat1;
  let px = -dy, py = dx;
  const plen = Math.sqrt(px * px + py * py);
  if (plen === 0) return [start, end];
  px /= plen; py /= plen;

  const offset = Math.sqrt(dx * dx + dy * dy) * curvature;
  const controlLat = latMid + py * offset;
  const controlLon = lonMid + px * offset;

  const points: LatLng[] = [];
  for (let i = 0; i < numPoints; i++) {
    const t = i / (numPoints - 1);
    const u = 1 - t;
    points.push({
      latitude: u * u * lat1 + 2 * u * t * controlLat + t * t * lat2,
      longitude: u * u * lon1 + 2 * u * t * controlLon + t * t * lon2,
    });
  }
  return points;
}
