

export const getCurrentLocationWeb = (
  googleKey: string
): Promise<{ latitude: number; longitude: number; address: string | null } | null> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Call your geocode API helper
        fetchLocationDetails(latitude, longitude, googleKey)
          .then((address) => {
            resolve({
              latitude,
              longitude,
              address,
            });
          })
          .catch(() => {
            resolve({
              latitude,
              longitude,
              address: null,
            });
          });
      },
      (error) => {
        console.error("Error fetching location:", error);
        resolve(null);
      },
      { enableHighAccuracy: true }
    );
  });
};

export const fetchLocationDetails = (
  latitude: number,
  longitude: number,
  googleKey: string
): Promise<string | null> => {
  return fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.results && data.results.length > 0) {
        return data.results[0].formatted_address;
      }
      return "";
    })
    .catch((error) => {
      console.error("Error fetching location details:", error);
      return "";
    });
};
