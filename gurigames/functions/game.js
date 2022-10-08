const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "user";
exports.handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    switch (event.routeKey) {
      case "DELETE /user/{id}":
        await dynamo
          .delete({
            TableName: TABLE_NAME,
            Key: {
              id: event.pathParameters.id,
            },
          })
          .promise();
        body = `Deleted item ${event.pathParameters.id}`;
        break;
      case "GET /user/{id}":
        body = await dynamo
          .get({
            TableName: TABLE_NAME,
            Key: {
              id: event.pathParameters.id,
            },
          })
          .promise();
        break;
      case "GET /user":
        body = await dynamo.scan({ TableName: TABLE_NAME }).promise();
        break;
      case "PUT /user":
        let requestJSON = JSON.parse(event.body);
        await dynamo
          .put({
            TableName: TABLE_NAME,
            Item: {
              id: requestJSON.id,
              name: requestJSON.name,
            },
          })
          .promise();
        body = `Put item ${requestJSON.id}`;
        break;
      default:
        throw new Error(`Unsupported route: "${event.routeKey}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  };
};
