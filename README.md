***** This repository is deprecated *****
# bitmovin-encoding-lambda
 The bitmovin-encoding-lambda is a lambda function that allows for asynchronous encoding of raw video files.  This function is triggered by SNS when a new video is uploaded to S3 from our platform.  The lambda parses the link to the video from the SNS message, and creates an bitmovin input for that video.  We provide an encoding profile and output location.  The encoding profile dictates how many livestreams will be created and what their resolution will be.  The output location in our example is another Amazon S3 bucket.  This function produces a folder with livestream encodings and DASH/HLS manifest files, as well as thumbnails.

# Setup

`npm install`

# Deploy

## Development

`SLS_DEBUG='*' serverless webpack invoke --function test` to test with serverless locally. You may need to set SLS_DEBUG: `export SLS_DEBUG='*'`

## Staging

1. `serverless deploy --stage staging --verbose`
1. Configure lambda: add any environment variables and values, adjust the timeout if needed (up to 5 minutes), enable a trigger for your function, add a test event (json).

## Production

1. `serverless deploy --stage production --verbose`
1. Configure lambda: add any environment variables and values, adjust the timeout if needed (up to 5 minutes), enable a trigger for your function, add a test event (json).
