let config = {
  address: '0.0.0.0',
  port: 8080,
  basePath: '/',
  ipWhitelist: [],
  useHttps: false,
  httpsPrivateKey: '',
  httpsCertificate: '',

  language: 'de',
  locale: 'de-AT',
  logLevel: ['INFO', 'LOG', 'WARN', 'ERROR'],
  timeFormat: 24,
  units: 'metric',

  modules: [
    {
      module: 'MMM-SpencerHill',
      position: 'top_center',
      config: {
        // overwrite default config values here
      },
    },
  ],
};

if (typeof module !== 'undefined') {
  module.exports = config;
}
