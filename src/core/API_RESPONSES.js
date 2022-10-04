const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "*",
};
const Responses = {
  _200(data = {}) {
    return {
      headers: headers,
      statusCode: 200,
      body: JSON.stringify(data),
    };
  },
  _400(data = {}) {
    return {
      headers: headers,
      statusCode: 400,
      body: JSON.stringify(data),
    };
  },
  _500(data = {}) {
    return {
      headers: headers,
      statusCode: 500,
      body: JSON.stringify(data),
    };
  },
};

module.exports.Responses = Responses;
