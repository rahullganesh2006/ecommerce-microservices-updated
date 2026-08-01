import { d as fetchAuthSession, l as signIn, t as signOut, u as getCurrentUser } from "../_libs/@aws-amplify/auth+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cognito-auth-BqXre1jH.js
async function cognitoLogin(email, password) {
	try {
		await signOut();
	} catch {}
	const result = await signIn({
		username: email,
		password
	});
	if (!result.isSignedIn) return {
		...result,
		session: void 0,
		user: void 0
	};
	const session = await fetchAuthSession({ forceRefresh: true });
	const user = await getCurrentUser();
	console.log("Session:", JSON.stringify(session, null, 2));
	console.log("Tokens:", session.tokens);
	console.log("User:", user);
	return {
		...result,
		session,
		user
	};
}
async function cognitoLogout() {
	await signOut({ global: true });
}
//#endregion
export { cognitoLogout as n, cognitoLogin as t };
