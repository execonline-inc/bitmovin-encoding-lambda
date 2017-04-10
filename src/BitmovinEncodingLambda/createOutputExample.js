//New outputs can be created with the bitmovin web console or the API.  
const bitcodin = require('bitcodin')(process.env.BITMOVIN_API_TOKEN);

function output() {
  return {
    "type": "s3",
    "name": "Staging S3 Output",
    "region": "us-east-1",
    "accessKey": process.env.AWS_KEY,
    "secretKey": process.env.AWS_SECRET_KEY,
    "bucket": "execonline-staging-video",
    "prefix": "bitmovin",
    "makePublic": true
  };
}

bitcodin.output.s3.create(output());
