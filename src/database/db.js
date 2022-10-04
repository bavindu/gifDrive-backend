const AWS = require("aws-sdk");
let options = {};
if (process.env.IS_OFFLINE) {
  options = {
    region: "localhost",
    endpoint: "http://localhost:8000",
  };
}

const documentClient = new AWS.DynamoDB.DocumentClient(options);

const Dynamo = {
  async get(email, TableName) {
    const params = {
      TableName,
      Key: {
        email,
      },
    };
    const data = await documentClient.get(params).promise();
    if (!data) {
      throw Error(
        `Error Occourd while getting data for email ${email} in ${TableName}`
      );
    } else {
      if (data.Item) {
        return data.Item;
      } else {
        return null;
      }
    }
  },
  async write(data, TableName) {
    const params = {
      TableName,
      Item: data,
    };
    const res = await documentClient.put(params).promise();
    if (!res) {
      throw Error(
        `Error Occourd while write data for email ${email} in ${TableName}`
      );
    }
    return res;
  },

  async update(tableName, primaryKeyValue, key, fileName, tags, encryptedUrl) {
    const params = {
      TableName: tableName,
      Key: {
        email: primaryKeyValue,
      },
      UpdateExpression: `set gifsNames.#key = :fileName, gifsTags.#key = :tags, gifsPublicUrls.#key = :encryptedUrl`,
      ExpressionAttributeNames: {
        "#key": key,
      },
      ExpressionAttributeValues: {
        ":fileName": fileName,
        ":tags": tags,
        ":encryptedUrl": encryptedUrl,
      },
    };
    return await documentClient.update(params).promise();
  },

  async delete(tableName, email, key) {
    const params = {
      TableName: tableName,
      Key: {
        email: email,
      },
      UpdateExpression: `REMOVE gifsNames.#key , gifsTags.#key`,
      ExpressionAttributeNames: {
        "#key": key,
      },
    };
    console.log("params", params);
    return documentClient.update(params).promise();
  },
};

module.exports.Dynamo = Dynamo;
