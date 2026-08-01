import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "ap-southeast-1_Kg1vyWIZ4",
      userPoolClientId: "1bhgnpkm8ke9idecj24t7se1ld",
      loginWith: {
        email: true,
      },
    },
  },
});