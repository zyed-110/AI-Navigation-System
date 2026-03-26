type Coordinate = [number, number];

interface RouteParams {
  start: Coordinate;
  end: Coordinate;
  profile?: 'driving-car' | 'foot-walking' | 'cycling-regular';
}

const apiKey = process.env.EXPO_PUBLIC_OPEN_ROUTE_SERVICE_API_KEY || "";

function validateApiKey() {
  if (!apiKey || apiKey === "YOUR_OPEN_ROUTE_SERVICE_API_KEY") {
    const errorMessage =
      "OpenRouteService API key is missing. Please check your .env file.";
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
  return true;
}

export async function getDirections({
  start,
  end,
  profile = "foot-walking",
}: RouteParams) {
  validateApiKey();

  const url = `https://api.openrouteservice.org/v2/directions/${profile}/geojson`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json, application/geo+json",
        "Content-Type": "application/json",
        Authorization: apiKey,
      },
      body: JSON.stringify({
        coordinates: [start, end],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenRouteService error:", errorData);
      throw new Error(`Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Directions fetch error:", error);
    throw error;
  }
}

export async function searchLocation(query: string) {
  validateApiKey();

  const url = `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(
    query
  )}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Location search error:", errorData);
      throw new Error(`Search failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.features;
  } catch (error) {
    console.error("Search error:", error);
    throw error;
  }
}