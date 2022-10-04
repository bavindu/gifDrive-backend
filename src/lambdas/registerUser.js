const { Responses } = require("../core/API_RESPONSES");
const { Dynamo } = require("../database/db");
const tableName = process.env.tableName;
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

module.exports.handler = async (event) => {
  try {
    const user = JSON.parse(event.body);
    if (user && user.email && user.password) {
      const existUser = await Dynamo.get(user.email, tableName);
      if (existUser && existUser.Item) {
        return Responses._400("User Already Exist");
      }
      const hashedPwd = await bcrypt.hash(user.password, saltRounds);
      const userID = uuidv4();
      const res = await Dynamo.write(
        {
          email: user.email,
          userID: userID,
          password: hashedPwd,
          gifsNames: {},
          gifsTags: {},
        },
        tableName
      ).catch((error) => {
        console.error(error);
        return Responses._400(error);
      });
      if (res) {
        return Responses._200("registerded successfully");
      }
    }
    return Responses._400("Inconmplete User Details");
  } catch (error) {
    console.error(error);
    return Responses._500("Internal Server Error");
  }
};
