const { Responses } = require("../core/API_RESPONSES");
const { Dynamo } = require("../database/db");
const tableName = process.env.tableName;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports.handler = async (event) => {
  const { email, password } = JSON.parse(event.body);
  if (!(email && password)) {
    return Responses._400("All Inputs is required!");
  }
  const user = await Dynamo.get(email, tableName);
  if (
    user &&
    user.Item &&
    (await bcrypt.compare(password, user.Item.password))
  ) {
    const token = jwt.sign({ user_email: email }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    const payload = { email: email, token: token };
    return Responses._200(payload);
  }
  return Responses._400("Invalid Credentials");
};
