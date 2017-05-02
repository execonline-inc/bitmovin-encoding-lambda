import mysql from 'mysql';

function storeBitmovin(input, folder) {
  const livestream_dir = 'bitmovin/' + folder
  console.log('livestream_dir', livestream_dir)
  console.log(`input: ${input}`);
  updateAsset(input, livestream_dir);
}

function updateAsset(input, livestream_dir) {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
  });

  connection.connect();

  const query = 'UPDATE content_library_assets SET livestream_dir = ?  WHERE tmp_video = ? ';
  console.log(`query: ${query}`);

  connection.query(query, [livestream_dir, input], (err, result) => {
    if (err) throw err;
    console.log(`updated ${result.affectedRows} rows`);
  });
  connection.end();
}

class BitmovinEncodingLambda {
  getVideoLink = (message, context, callback) => {
    console.log('message: ' + message);
    message = JSON.parse(message);
    const bucket = message.Records[0].s3.bucket.name;
    const video = message.Records[0].s3.object.key;
    const videoLink = `https://s3.amazonaws.com/${bucket}/${video}`;

    if (video)  {
      console.log(videoLink);
      this.transcodeFromRaw(videoLink, video);
    } else {
      console.log('missing path to video file, unable to transcode');
    }
  }

  transcodeFromRaw = (link, video) => {
    const bitcodin = require('bitcodin')(process.env.BITMOVIN_API_TOKEN);
    const createInputPromise = bitcodin.input.create(link);
    const jobConfiguration = {
      "inputId": -1,
      "encodingProfileId": parseInt(process.env.ENCODING_PROFILE_ID),
      "manifestTypes": ["mpd", "m3u8"],
      "outputId": parseInt(process.env.OUTPUT_ID)
    };
    this.triggerEncoding(createInputPromise, jobConfiguration, bitcodin, video);
  }

  triggerEncoding = (createInputPromise, jobConfiguration, bitcodin, video) => {
    const Q = require("Q");
    Q.all([createInputPromise]).then(
      (result) => {
        console.log('Successfully created input');
        jobConfiguration.inputId = result[0].inputId;

        bitcodin.job.create(jobConfiguration)
            .then(
            (newlyCreatedJob) => {
                console.log('Successfully created a new transcoding job:', newlyCreatedJob);
                console.log('MPD-Url:', newlyCreatedJob.manifestUrls.mpdUrl);
                console.log('M3U8-Url:', newlyCreatedJob.manifestUrls.m3u8Url);
                const folder = newlyCreatedJob.jobFolder
                storeBitmovin(video, folder)
            },
            (error) => {
                console.log('Error while creating a new transcoding job:', error);
            }
        );
      },
      (error) => {
        console.log('Error while creating input and/or encoding profile:', error);
      }
    );
  }
}

export default BitmovinEncodingLambda;
