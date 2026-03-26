import 'dotenv/config';

// This is a dynamic configuration file.
// If you have an existing `app.json`, you can rename it to `app.config.js`
// and export the configuration object.
//
// For more details, see: https://docs.expo.dev/workflow/configuration/

export default ({ config }) => {
  // The `config` object is the original `app.json` content.
  // You can modify it here.
  return {
    ...config,
    android: {
      ...config.android,
      permissions: [
        ...(config.android?.permissions || []),
        "RECORD_AUDIO",
      ],
      config: {
        ...config.android?.config,
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY_ANDROID,
        },
      },
    },
    ios: {
      ...config.ios,
      infoPlist: {
        ...config.ios?.infoPlist,
        NSMicrophoneUsageDescription: "Allow $(PRODUCT_NAME) to access your microphone for real-time talk with the AI assistant.",
      },
      config: {
        ...config.ios?.config,
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY_IOS,
      },
    },
  };
};