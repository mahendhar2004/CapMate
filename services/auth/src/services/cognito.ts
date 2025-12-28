import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { CONFIG } from "../config";

export const cognitoClient = new CognitoIdentityProviderClient({
    region: CONFIG.AWS.REGION,
});
