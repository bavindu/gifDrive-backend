const jwt = require("jsonwebtoken");
const BEARER_TOKEN_PATTERN = /^Bearer[ ]+([^ ]+)[ ]*$/i;

// Policy helper function
const generatePolicy = (principalId, effect, resource) => {
  const authResponse = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = "2012-10-17";
    policyDocument.Statement = [];
    const statementOne = {};
    statementOne.Action = "execute-api:Invoke";
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  console.log("authResponse", authResponse);
  return authResponse;
};

module.exports.handler = (event, context, callback) => {
  const token = event.headers.authorization;

  console.log("token", token);

  if (!token) callback(null, "Unauthorized");

  jwt.verify(
    token.replace("Bearer ", ""),
    process.env.JWT_SECRET,
    (err, decoded) => {
      if (err) {
        console.log("Verification error", error);
        callback(null, "Unauthorized");
      }

      console.log("Decoded", decoded);
      callback(
        null,
        generatePolicy(decoded.user_email, "Allow", event.routeArn)
      );
    }
  );
};
