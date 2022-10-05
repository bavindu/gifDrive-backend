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
    return documentClient.get(params).promise();
  },
  async write(data, TableName) {
    const params = {
      TableName,
      Item: data,
    };
    return documentClient.put(params).promise();
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
    return documentClient.update(params).promise();
  },

  async updateNameandTags(tableName, primaryKeyValue, key, fileName, tags) {
    const params = {
      TableName: tableName,
      Key: {
        email: primaryKeyValue,
      },
      UpdateExpression: `set gifsNames.#key = :fileName, gifsTags.#key = :tags`,
      ExpressionAttributeNames: {
        "#key": key,
      },
      ExpressionAttributeValues: {
        ":fileName": fileName,
        ":tags": tags,
      },
    };
    return documentClient.update(params).promise();
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
