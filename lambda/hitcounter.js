const { DynamoDB, Lambda } = require("aws-cdk");

exports.handler = async function (event) {
  console.log("Request:", JSON.stringify(event, undefined, 2));

  const dynamoDB = new DynamoDB();
  const lambda = new Lambda();

  await dynamoDB.updateItem({
    // the name of the DynamoDB table to use for storage
    TableName: process.env.HITS_TABLE_NAME,
    Key: { path: { S: event.path } },
    UpdateExpression: "ADD hits :incr",
    ExpressionAttributeValues: { ":incr": { N: "1" } },
  }).promise();

  const response = await lambda.invoke({
    // the name of the downstream AWS Lambda function
    FunctionName: process.env.DOWNSTREAM_FUNCTION_NAME,
    Payload: JSON.stringify(event)
  }).promise();

  console.log("Downstream response:", JSON.stringify(response, undefined, 2));

  return JSON.parse(response.Payload);
};
