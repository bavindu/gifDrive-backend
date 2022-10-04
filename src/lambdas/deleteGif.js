const { Responses } = require("../core/API_RESPONSES");
const { Dynamo } = require("../database/db");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const tableName = process.env.tableName;
const BUCKET = process.env.gifUploadBucket;

module.exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { email, key } = body;
  if (!(email && key)) {
    return Responses._400({ error: "Incomplete Data" });
  }
  const user = await Dynamo.get(email, tableName);
  if (!user) {
    return Responses._400({ error: "User Not Found" });
  }
  try {
    const params = { Bucket: BUCKET, Key: key };
    console.log("params", params);
    const s3Res = await s3.deleteObject(params).promise();
    console.log("s3Res", s3Res);
    const res = await Dynamo.delete(tableName, email, key);
    console.log("db res", res);
    return Responses._200({ message: "Gif Deleted" });
  } catch (error) {
    console.error(error);
    return Responses._500({ error: "Internal Server Error" });
  }
};
