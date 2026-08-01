import {
  signIn,
  signOut,
  fetchAuthSession,
  getCurrentUser,
  confirmSignIn,
} from "aws-amplify/auth";
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

export async function cognitoLogin(email: string, password: string) {
  // Clear previous session (ignore errors)
  try {
    await signOut();
  } catch {}

  const result = await signIn({
    username: email,
    password,
  });

  // First-time login — password change required
  if (!result.isSignedIn) {
    return { ...result, session: undefined, user: undefined };
  }

  // Force fresh session fetch
  const session = await fetchAuthSession({ forceRefresh: true });
  const user = await getCurrentUser();

  console.log("Session:", JSON.stringify(session, null, 2));
  console.log("Tokens:", session.tokens);
  console.log("User:", user);

  return {
    ...result,
    session,
    user,
  };
}

export async function completeNewPassword(newPassword: string) {
  await confirmSignIn({
    challengeResponse: newPassword,
  });

  const session = await fetchAuthSession();
  const user = await getCurrentUser();

  return {
    session,
    user,
  };
}

export async function cognitoLogout() {
  await signOut({
    global: true,
  });
}