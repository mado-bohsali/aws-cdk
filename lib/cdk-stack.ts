import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as sns from "aws-cdk-lib/aws-sns";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as subs from "aws-cdk-lib/aws-sns-subscriptions";


export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    //The code that defines your stack goes here example resource
    const queue = new sqs.Queue(this, "CdkQueue", {
      visibilityTimeout: cdk.Duration.seconds(300),
    });

    /**
     * Our function uses the NodeJS (NODEJS_16_X) runtime
     * The handler code is loaded from the lambda directory which we created earlier.
     * The name of the handler function is hello.handler (function is the name of the file and “handler” is the exported function name)
     */
    const lambda_function = new lambda.Function(this, "Lambda Handler", {
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset("lambda"),
      handler: "function.handler",
    });

    const topic = new sns.Topic(this, "CdkWorkshopTopic");

    topic.addSubscription(new subs.SqsSubscription(queue));

    new apigw.LambdaRestApi(this, 'Endpoint',{
      handler: lambda_function
    });
  }
}
