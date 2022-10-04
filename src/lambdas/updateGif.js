const { Responses } = require("../core/API_RESPONSES");
const { Dynamo } = require("../database/db");
const AWS = require("aws-sdk");
const tableName = process.env.tableName;

module.exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { email, key, newName, tags } = body;
  if (!(email && key && tags && newName)) {
    return Responses._400({ error: "Incomplete Data" });
  }
  const user = await Dynamo.get(email, tableName);
  if (!user) {
    return Responses._400({ error: "User Not Found" });
  }
  try {
    const res = await Dynamo.update(tableName, email, key, newName, tags);
    return Responses._200({ message: "Gif Updated" });
  } catch (error) {
    return Responses._500({ error: "Internal Server Error" });
  }
};
