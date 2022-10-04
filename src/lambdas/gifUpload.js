const { Responses } = require("../core/API_RESPONSES");
const AWS = require("aws-sdk");
const parseMultipart = require("parse-multipart");
const s3 = new AWS.S3();
const { Dynamo } = require("../database/db");
const tableName = process.env.tableName;

const BUCKET = process.env.gifUploadBucket;

module.exports.handler = async (event) => {
  if (!event.pathParameters || !event.pathParameters.email) {
    return Responses._400({ error: "email undifined" });
  }
  try {
    const email = event.pathParameters.email;
    const { filename, data } = extractFile(event);
    const user = await Dynamo.get(email, tableName);
    const saveFileName = user["userID"] + "/" + filename;
    await s3
      .putObject({
        Bucket: BUCKET,
        Key: saveFileName,
        ACL: "private",
        Body: data,
      })
      .promise();
    const tags = [];
    await Dynamo.update(tableName, email, saveFileName, filename, tags);

    return Responses._200("Success Gif Upload");
  } catch (error) {
    console.error(error);
    return Responses._500({ error: "Gif Upload Error" });
  }
};

const extractFile = (event) => {
  const boundary = parseMultipart.getBoundary(event.headers["content-type"]);
  const parts = parseMultipart.Parse(
    Buffer.from(event.body, "base64"),
    boundary
  );
  const [{ filename, data }] = parts;

  return {
    filename,
    data,
  };
};
