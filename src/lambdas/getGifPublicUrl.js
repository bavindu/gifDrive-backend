const { Responses } = require("../core/API_RESPONSES");
const { Dynamo } = require("../database/db");
const AWS = require("aws-sdk");
const tableName = process.env.tableName;
const s3 = new AWS.S3();
const BUCKET = process.env.gifUploadBucket;
const CryptoJS = require("crypto-js");
const gifSecret = process.env.GIF_SECRET;

module.exports.handler = async (event) => {
  if (!event.pathParameters || !event.pathParameters.encryptedName) {
    return Responses._400({ error: "Incomplete Data" });
  }
  try {
    const urlSafeEncryptedName = event.pathParameters.encryptedName;
    const encryptedName = Buffer.from(urlSafeEncryptedName, "base64").toString(
      "ascii"
    );
    const bytes = CryptoJS.AES.decrypt(encryptedName, gifSecret);
    const decryptedFileName = bytes.toString(CryptoJS.enc.Utf8);
    const url = s3.getSignedUrl("getObject", {
      Bucket: BUCKET,
      Key: decryptedFileName,
      Expires: 60,
    });

    const resObj = {
      name: decryptedFileName.split("/")[1],
      url: url,
    };
    return Responses._200(resObj);
  } catch (error) {
    console.error(error);
    return Responses._500({ error: "Internal Server Error" });
  }
};
