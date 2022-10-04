const { Responses } = require("../core/API_RESPONSES");
const { Dynamo } = require("../database/db");
const AWS = require("aws-sdk");
const tableName = process.env.tableName;
const s3 = new AWS.S3();
const BUCKET = process.env.gifUploadBucket;

module.exports.handler = async (event) => {
  if (!event.pathParameters || !event.pathParameters.email) {
    return Responses._400({ error: "Incomplete Data" });
  }

  let email = event.pathParameters.email;
  const user = await Dynamo.get(email, tableName);
  if (!(user && user.userID)) {
    return Responses._400({ error: "User Not Found" });
  }

  const userID = user.userID;
  const s3Params = {
    Bucket: BUCKET,
    Prefix: userID,
  };

  const gifsList = [];
  const gifs = await s3.listObjectsV2(s3Params).promise();
  if (gifs && gifs.Contents) {
    console.log("gif", gifs);
    gifs.Contents.forEach((gif) => {
      const url = s3.getSignedUrl("getObject", {
        Bucket: BUCKET,
        Key: gif.Key,
        Expires: 60,
      });
      gifsList.push({ name: gif.Key, url: url });
    });
  }
  const userObj = {
    email: user.email,
    userID: user.userID,
    gifsNames: user.gifsNames,
    gifsTags: user.gifsTags,
    gifsList: gifsList,
  };
  return Responses._200(userObj);
};
