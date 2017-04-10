const bitcodin = require('bitcodin')(process.env.BITMOVIN_API_TOKEN);
encodingProfileConfiguration = () => {
return {"name": "bitcodin Encoding Profile",
"videoStreamConfigs": [
    {
        "defaultStreamId": 0,
        "bitrate": 1024000,
        "profile": "Main",
        "preset": "premium",
        "height": 768,
        "width": 1366
    }
],
"audioStreamConfigs": [
    {
        "defaultStreamId": 0,
        "bitrate": 256000
    }
]}
}

bitcodin.encodingProfile.create(encodingProfileConfiguration());
