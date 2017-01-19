FlowRouter.setDeferScriptLoading(true);

// We cache SSR pages for 4 minutes.
const FOUR_MINUTES = 1000 * 60 * 4;
FlowRouter.setPageCacheTimeout(FOUR_MINUTES);

YoutubeApi.authenticate({
    type: 'key',
    key: 'AIzaSyA4nxbIISSIaLaM-ZCIaMPVybwZX_lpKtg'
});

Kadira.connect('LnHhWccEfPpXKkDJF', '0de1e557-bda0-4484-9417-816910dad5ea');

ServiceConfiguration.configurations.update(
  { "service": "spotify" },
  {
    $set: {
      // production
      "clientId": "eceed1d320654b0389faf3fc14d8b865",
      "secret": "ad6872f414a14879a5e1978889541df8"
    }
  },
  { upsert: true }
);
