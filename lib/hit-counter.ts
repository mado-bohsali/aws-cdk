import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export interface HitCounterProps {
  // The function counting URL hits
  downstream: lambda.IFunction;
}

export class HitCounter extends Construct {
  // Accesses the counter function
  public readonly handler: lambda.Function;

  constructor(scope: Construct, id: string, props: HitCounterProps) {
    // Propagate them to the cdk.Construct class
    super(scope, id);

    const table = new dynamodb.Table(this, "Hits", {
      partitionKey: {
        name: "path",
        type: dynamodb.AttributeType.STRING,
      },
    });

    this.handler = new lambda.Function(this, "HitCounterHandler", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "hitcounter.handler",
      code: lambda.Code.fromAsset("lambda"),
      // values only resolved when we deploy our stack
      environment: {
        DOWNSTREAM_FUNCTION_NAME: props.downstream.functionName,
        HITS_TABLE_NAME: table.tableName,
      },
    });
  }
}
