const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const dynamo = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "user";
const STATUS = {
  ONLINE: "ONLINE",
};

const LABEL = {
  SEARCHING: "SEARCHING",
  DUELING: "DUELING",
};

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function join(event) {
  const id = uuidv4();
  const join = JSON.parse(event.body);
  console.log("join", join);
  const res = await dynamo
    .put({
      TableName: TABLE_NAME,
      Item: {
        id: id,
        label: `${LABEL.SEARCHING}_${id}`,
        name: join.name,
        status: STATUS.ONLINE,
      },
    })
    .promise();
  console.log("res", res);
  return getGame(id);
}

async function getGame(playerId) {
  const { Items, Count } = await dynamo
    .scan({ TableName: TABLE_NAME })
    .promise();

  console.log("getGame", Items, Count);

  const users = Items.filter(
    (u) => u.label.startsWith(LABEL.SEARCHING) && u.id !== playerId
  );
  const player = Items.find((u) => u.id === playerId);
  console.log("users", users);
  if (!users.length) {
    return {
      foundGame: false,
      player,
      opponent: null,
    };
  }

  const randomIndex = randomIntFromInterval(0, users.length - 1);
  const opponent = users[randomIndex];

  console.log("oponent", opponent, randomIndex);
  console.log("player", player);

  let res = await dynamo
    .put({
      TableName: TABLE_NAME,
      Item: {
        ...player,
        label: `${LABEL.DUELING}_${playerId}`,
      },
    })
    .promise();
  console.log("1", res);
  res = await dynamo
    .put({
      TableName: TABLE_NAME,
      Item: {
        ...opponent,
        label: `${LABEL.DUELING}_${opponent.id}`,
      },
    })
    .promise();
  console.log("2", res);
  res = await dynamo
    .delete({
      TableName: TABLE_NAME,
      Key: {
        id: opponent.id,
        label: `${LABEL.SEARCHING}_${opponent.id}`,
      },
    })
    .promise();
  console.log("3", res);
  res = await dynamo
    .delete({
      TableName: TABLE_NAME,
      Key: {
        id: playerId,
        label: `${LABEL.SEARCHING}_${playerId}`,
      },
    })
    .promise();
  console.log("4", res);

  return {
    foundGame: true,
    player,
    opponent,
  };
}

exports.handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    switch (event.routeKey) {
      case "POST /join":
        console.log("start");
        body = JSON.stringify(await join(event));
        break;
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
