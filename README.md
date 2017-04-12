# bitmovin-encoding-lambda
# Setup

* Add your AWS API key/secret to `vi ~/.aws/credentials`

* Install `serverless`

`npm install serverless -g`

`npm install`

In MySQL


```
CREATE USER 'ikatz'@'localhost' IDENTIFIED BY 'gimmeaccess';
GRANT ALL PRIVILEGES ON exec_online_dev.* To 'ikatz'@'localhost';
```

# Deploy

## Development

 serverless webpack --out dist
 SLS_DEBUG=true serverless webpack invoke --function test

## Staging

1. Create `.env` with staging values
1. `serverless deploy --stage staging --noDeploy --verbose`
1. `open .serverless/`
1. Configure lambda

![](https://github-wiki-img.s3.amazonaws.com/VideoThumbnailRecorder-staging-config.png)

## Production

1. Create `.env` with production values
2. `serverless deploy --stage production --noDeploy --verbose`

Upload created zip file into [AWS Lambda](https://console.aws.amazon.com/lambda/home?region=us-east-1#/functions/transcodeFromRaw)

# TODO

* make serverless work fully
