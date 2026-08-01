import { randomFillSync, randomUUID } from "crypto";
import { __awaiter, __generator } from "tslib";
import { Buffer as Buffer$1 } from "buffer";
var NO_HUBCALLBACK_PROVIDED_EXCEPTION = "NoHubcallbackProvidedException";
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/Logger/types.mjs
var LogType;
(function(LogType) {
	LogType["DEBUG"] = "DEBUG";
	LogType["ERROR"] = "ERROR";
	LogType["INFO"] = "INFO";
	LogType["WARN"] = "WARN";
	LogType["VERBOSE"] = "VERBOSE";
	LogType["NONE"] = "NONE";
})(LogType || (LogType = {}));
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/Logger/ConsoleLogger.mjs
var LOG_LEVELS = {
	VERBOSE: 1,
	DEBUG: 2,
	INFO: 3,
	WARN: 4,
	ERROR: 5,
	NONE: 6
};
/**
* Write logs
* @class Logger
*/
var ConsoleLogger = class ConsoleLogger {
	/**
	* @constructor
	* @param {string} name - Name of the logger
	*/
	constructor(name, level = LogType.WARN) {
		this.name = name;
		this.level = level;
		this._pluggables = [];
	}
	_padding(n) {
		return n < 10 ? "0" + n : "" + n;
	}
	_ts() {
		const dt = /* @__PURE__ */ new Date();
		return [this._padding(dt.getMinutes()), this._padding(dt.getSeconds())].join(":") + "." + dt.getMilliseconds();
	}
	configure(config) {
		if (!config) return this._config;
		this._config = config;
		return this._config;
	}
	/**
	* Write log
	* @method
	* @memeberof Logger
	* @param {LogType|string} type - log type, default INFO
	* @param {string|object} msg - Logging message or object
	*/
	_log(type, ...msg) {
		let loggerLevelName = this.level;
		if (ConsoleLogger.LOG_LEVEL) loggerLevelName = ConsoleLogger.LOG_LEVEL;
		if (typeof window !== "undefined" && window.LOG_LEVEL) loggerLevelName = window.LOG_LEVEL;
		const loggerLevel = LOG_LEVELS[loggerLevelName];
		if (!(LOG_LEVELS[type] >= loggerLevel)) return;
		let log = console.log.bind(console);
		if (type === LogType.ERROR && console.error) log = console.error.bind(console);
		if (type === LogType.WARN && console.warn) log = console.warn.bind(console);
		if (ConsoleLogger.BIND_ALL_LOG_LEVELS) {
			if (type === LogType.INFO && console.info) log = console.info.bind(console);
			if (type === LogType.DEBUG && console.debug) log = console.debug.bind(console);
		}
		const prefix = `[${type}] ${this._ts()} ${this.name}`;
		let message = "";
		if (msg.length === 1 && typeof msg[0] === "string") {
			message = `${prefix} - ${msg[0]}`;
			log(message);
		} else if (msg.length === 1) {
			message = `${prefix} ${msg[0]}`;
			log(prefix, msg[0]);
		} else if (typeof msg[0] === "string") {
			let obj = msg.slice(1);
			if (obj.length === 1) obj = obj[0];
			message = `${prefix} - ${msg[0]} ${obj}`;
			log(`${prefix} - ${msg[0]}`, obj);
		} else {
			message = `${prefix} ${msg}`;
			log(prefix, msg);
		}
		for (const plugin of this._pluggables) {
			const logEvent = {
				message,
				timestamp: Date.now()
			};
			plugin.pushLogs([logEvent]);
		}
	}
	/**
	* Write General log. Default to INFO
	* @method
	* @memeberof Logger
	* @param {string|object} msg - Logging message or object
	*/
	log(...msg) {
		this._log(LogType.INFO, ...msg);
	}
	/**
	* Write INFO log
	* @method
	* @memeberof Logger
	* @param {string|object} msg - Logging message or object
	*/
	info(...msg) {
		this._log(LogType.INFO, ...msg);
	}
	/**
	* Write WARN log
	* @method
	* @memeberof Logger
	* @param {string|object} msg - Logging message or object
	*/
	warn(...msg) {
		this._log(LogType.WARN, ...msg);
	}
	/**
	* Write ERROR log
	* @method
	* @memeberof Logger
	* @param {string|object} msg - Logging message or object
	*/
	error(...msg) {
		this._log(LogType.ERROR, ...msg);
	}
	/**
	* Write DEBUG log
	* @method
	* @memeberof Logger
	* @param {string|object} msg - Logging message or object
	*/
	debug(...msg) {
		this._log(LogType.DEBUG, ...msg);
	}
	/**
	* Write VERBOSE log
	* @method
	* @memeberof Logger
	* @param {string|object} msg - Logging message or object
	*/
	verbose(...msg) {
		this._log(LogType.VERBOSE, ...msg);
	}
	addPluggable(pluggable) {
		if (pluggable && pluggable.getCategoryName() === "Logging") {
			this._pluggables.push(pluggable);
			pluggable.configure(this._config);
		}
	}
	listPluggables() {
		return this._pluggables;
	}
};
ConsoleLogger.LOG_LEVEL = null;
ConsoleLogger.BIND_ALL_LOG_LEVELS = false;
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/errors/AmplifyError.mjs
var AmplifyError = class AmplifyError extends Error {
	/**
	*  Constructs an AmplifyError.
	*
	* @param message text that describes the main problem.
	* @param underlyingError the underlying cause of the error.
	* @param recoverySuggestion suggestion to recover from the error.
	*
	*/
	constructor({ message, name, recoverySuggestion, underlyingError, metadata }) {
		super(message);
		this.name = name;
		this.underlyingError = underlyingError;
		this.recoverySuggestion = recoverySuggestion;
		if (metadata) {
			const { extendedRequestId, httpStatusCode, requestId } = metadata;
			this.metadata = {
				extendedRequestId,
				httpStatusCode,
				requestId
			};
		}
		this.constructor = AmplifyError;
		Object.setPrototypeOf(this, AmplifyError.prototype);
	}
};
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/types/errors.mjs
var AmplifyErrorCode;
(function(AmplifyErrorCode) {
	AmplifyErrorCode["NoEndpointId"] = "NoEndpointId";
	AmplifyErrorCode["PlatformNotSupported"] = "PlatformNotSupported";
	AmplifyErrorCode["Unknown"] = "Unknown";
	AmplifyErrorCode["NetworkError"] = "NetworkError";
})(AmplifyErrorCode || (AmplifyErrorCode = {}));
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/errors/createAssertionFunction.mjs
var createAssertionFunction = (errorMap, AssertionError = AmplifyError) => (assertion, name, additionalContext) => {
	const { message, recoverySuggestion } = errorMap[name];
	if (!assertion) throw new AssertionError({
		name,
		message: additionalContext ? `${message} ${additionalContext}` : message,
		recoverySuggestion
	});
};
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/Hub/index.mjs
var AMPLIFY_SYMBOL = typeof Symbol !== "undefined" ? Symbol("amplify_default") : "@@amplify_default";
var logger$4 = new ConsoleLogger("Hub");
var HubClass = class {
	constructor(name) {
		this.listeners = /* @__PURE__ */ new Map();
		this.protectedChannels = [
			"core",
			"auth",
			"api",
			"analytics",
			"interactions",
			"pubsub",
			"storage",
			"ui",
			"xr"
		];
		this.name = name;
	}
	/**
	* Used internally to remove a Hub listener.
	*
	* @remarks
	* This private method is for internal use only. Instead of calling Hub.remove, call the result of Hub.listen.
	*/
	_remove(channel, listener) {
		const holder = this.listeners.get(channel);
		if (!holder) {
			logger$4.warn(`No listeners for ${channel}`);
			return;
		}
		this.listeners.set(channel, [...holder.filter(({ callback }) => callback !== listener)]);
	}
	dispatch(channel, payload, source, ampSymbol) {
		if (typeof channel === "string" && this.protectedChannels.indexOf(channel) > -1) {
			if (!(ampSymbol === AMPLIFY_SYMBOL)) logger$4.warn(`WARNING: ${channel} is protected and dispatching on it can have unintended consequences`);
		}
		const capsule = {
			channel,
			payload: { ...payload },
			source,
			patternInfo: []
		};
		try {
			this._toListeners(capsule);
		} catch (e) {
			logger$4.error(e);
		}
	}
	listen(channel, callback, listenerName = "noname") {
		let cb;
		if (typeof callback !== "function") throw new AmplifyError({
			name: NO_HUBCALLBACK_PROVIDED_EXCEPTION,
			message: "No callback supplied to Hub"
		});
		else cb = callback;
		let holder = this.listeners.get(channel);
		if (!holder) {
			holder = [];
			this.listeners.set(channel, holder);
		}
		holder.push({
			name: listenerName,
			callback: cb
		});
		return () => {
			this._remove(channel, cb);
		};
	}
	_toListeners(capsule) {
		const { channel, payload } = capsule;
		const holder = this.listeners.get(channel);
		if (holder) holder.forEach((listener) => {
			logger$4.debug(`Dispatching to ${channel} with `, payload);
			try {
				listener.callback(capsule);
			} catch (e) {
				logger$4.error(e);
			}
		});
	}
};
var Hub = new HubClass("__default__");
/**
* @internal
*
* Internal hub used for core Amplify functionality. Not intended for use outside of Amplify.
*
*/
var HubInternal = new HubClass("internal-hub");
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/utils/globalHelpers/index.mjs
var getCrypto = () => {
	if (typeof window === "object" && typeof window.crypto === "object") return window.crypto;
	if (typeof crypto === "object") return crypto;
	throw new AmplifyError({
		name: "MissingPolyfill",
		message: "Cannot resolve the `crypto` function from the environment."
	});
};
var getBtoa = () => {
	if (typeof window !== "undefined" && typeof window.btoa === "function") return window.btoa;
	if (typeof btoa === "function") return btoa;
	throw new AmplifyError({
		name: "Base64EncoderError",
		message: "Cannot resolve the `btoa` function from the environment."
	});
};
var getAtob = () => {
	if (typeof window !== "undefined" && typeof window.atob === "function") return window.atob;
	if (typeof atob === "function") return atob;
	throw new AmplifyError({
		name: "Base64EncoderError",
		message: "Cannot resolve the `atob` function from the environment."
	});
};
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/utils/convert/base64/base64Decoder.mjs
var base64Decoder = { convert(input, options) {
	let inputStr = input;
	if (options?.urlSafe) inputStr = inputStr.replace(/-/g, "+").replace(/_/g, "/");
	return getAtob()(inputStr);
} };
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/singleton/Auth/utils/errorHelpers.mjs
var AuthConfigurationErrorCode;
(function(AuthConfigurationErrorCode) {
	AuthConfigurationErrorCode["AuthTokenConfigException"] = "AuthTokenConfigException";
	AuthConfigurationErrorCode["AuthUserPoolAndIdentityPoolException"] = "AuthUserPoolAndIdentityPoolException";
	AuthConfigurationErrorCode["AuthUserPoolException"] = "AuthUserPoolException";
	AuthConfigurationErrorCode["InvalidIdentityPoolIdException"] = "InvalidIdentityPoolIdException";
	AuthConfigurationErrorCode["OAuthNotConfigureException"] = "OAuthNotConfigureException";
})(AuthConfigurationErrorCode || (AuthConfigurationErrorCode = {}));
var assert$1 = createAssertionFunction({
	[AuthConfigurationErrorCode.AuthTokenConfigException]: {
		message: "Auth Token Provider not configured.",
		recoverySuggestion: "Make sure to call Amplify.configure in your app."
	},
	[AuthConfigurationErrorCode.AuthUserPoolAndIdentityPoolException]: {
		message: "Auth UserPool or IdentityPool not configured.",
		recoverySuggestion: "Make sure to call Amplify.configure in your app with UserPoolId and IdentityPoolId."
	},
	[AuthConfigurationErrorCode.AuthUserPoolException]: {
		message: "Auth UserPool not configured.",
		recoverySuggestion: "Make sure to call Amplify.configure in your app with userPoolId and userPoolClientId."
	},
	[AuthConfigurationErrorCode.InvalidIdentityPoolIdException]: {
		message: "Invalid identity pool id provided.",
		recoverySuggestion: "Make sure a valid identityPoolId is given in the config."
	},
	[AuthConfigurationErrorCode.OAuthNotConfigureException]: {
		message: "oauth param not configured.",
		recoverySuggestion: "Make sure to call Amplify.configure with oauth parameter in your app."
	}
});
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/singleton/Auth/utils/index.mjs
function assertTokenProviderConfig(cognitoConfig) {
	let assertionValid = true;
	if (!cognitoConfig) assertionValid = false;
	else assertionValid = !!cognitoConfig.userPoolId && !!cognitoConfig.userPoolClientId;
	assert$1(assertionValid, AuthConfigurationErrorCode.AuthUserPoolException);
}
function assertOAuthConfig(cognitoConfig) {
	assert$1(!!cognitoConfig?.loginWith?.oauth?.domain && !!cognitoConfig?.loginWith?.oauth?.redirectSignOut && !!cognitoConfig?.loginWith?.oauth?.redirectSignIn && !!cognitoConfig?.loginWith?.oauth?.responseType, AuthConfigurationErrorCode.OAuthNotConfigureException);
}
/**
* Decodes payload of JWT token
*
* @param {String} token A string representing a token to be decoded
* @throws {@link Error} - Throws error when token is invalid or payload malformed.
*/
function decodeJWT(token) {
	const tokenParts = token.split(".");
	if (tokenParts.length !== 3) throw new Error("Invalid token");
	try {
		const base64 = tokenParts[1].replace(/-/g, "+").replace(/_/g, "/");
		const jsonStr = decodeURIComponent(base64Decoder.convert(base64).split("").map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`).join(""));
		return {
			toString: () => token,
			payload: JSON.parse(jsonStr)
		};
	} catch (err) {
		throw new Error("Invalid token payload");
	}
}
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/utils/deepFreeze.mjs
var deepFreeze = (object) => {
	const propNames = Reflect.ownKeys(object);
	for (const name of propNames) {
		const value = object[name];
		if (value && typeof value === "object" || typeof value === "function") deepFreeze(value);
	}
	return Object.freeze(object);
};
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/parseAWSExports.mjs
var logger$3 = new ConsoleLogger("parseAWSExports");
var authTypeMapping = {
	API_KEY: "apiKey",
	AWS_IAM: "iam",
	AMAZON_COGNITO_USER_POOLS: "userPool",
	OPENID_CONNECT: "oidc",
	NONE: "none",
	AWS_LAMBDA: "lambda",
	LAMBDA: "lambda"
};
/**
* Converts the object imported from `aws-exports.js` or `amplifyconfiguration.json` files generated by
* the Amplify CLI into an object that conforms to the {@link ResourcesConfig}.
*
* @param config A configuration object imported  from `aws-exports.js` or `amplifyconfiguration.json`.
*
* @returns An object that conforms to the {@link ResourcesConfig} .
*/
var parseAWSExports = (config = {}) => {
	if (!Object.prototype.hasOwnProperty.call(config, "aws_project_region")) throw new AmplifyError({
		name: "InvalidParameterException",
		message: "Invalid config parameter.",
		recoverySuggestion: "Ensure passing the config object imported from  `amplifyconfiguration.json`."
	});
	const { aws_appsync_apiKey, aws_appsync_authenticationType, aws_appsync_graphqlEndpoint, aws_appsync_region, aws_bots_config, aws_cognito_identity_pool_id, aws_cognito_sign_up_verification_method, aws_cognito_mfa_configuration, aws_cognito_mfa_types, aws_cognito_password_protection_settings, aws_cognito_verification_mechanisms, aws_cognito_signup_attributes, aws_cognito_social_providers, aws_cognito_username_attributes, aws_mandatory_sign_in, aws_mobile_analytics_app_id, aws_mobile_analytics_app_region, aws_user_files_s3_bucket, aws_user_files_s3_bucket_region, aws_user_files_s3_dangerously_connect_to_http_endpoint_for_testing, aws_user_pools_id, aws_user_pools_web_client_id, geo, oauth, predictions, aws_cloud_logic_custom, Notifications, modelIntrospection } = config;
	const amplifyConfig = {};
	if (aws_mobile_analytics_app_id) amplifyConfig.Analytics = { Pinpoint: {
		appId: aws_mobile_analytics_app_id,
		region: aws_mobile_analytics_app_region
	} };
	const { InAppMessaging, Push } = Notifications ?? {};
	if (InAppMessaging?.AWSPinpoint || Push?.AWSPinpoint) {
		if (InAppMessaging?.AWSPinpoint) {
			const { appId, region } = InAppMessaging.AWSPinpoint;
			amplifyConfig.Notifications = { InAppMessaging: { Pinpoint: {
				appId,
				region
			} } };
		}
		if (Push?.AWSPinpoint) {
			const { appId, region } = Push.AWSPinpoint;
			amplifyConfig.Notifications = {
				...amplifyConfig.Notifications,
				PushNotification: { Pinpoint: {
					appId,
					region
				} }
			};
		}
	}
	if (Array.isArray(aws_bots_config)) amplifyConfig.Interactions = { LexV1: Object.fromEntries(aws_bots_config.map((bot) => [bot.name, bot])) };
	if (aws_appsync_graphqlEndpoint) {
		const defaultAuthMode = authTypeMapping[aws_appsync_authenticationType];
		if (!defaultAuthMode) logger$3.debug(`Invalid authentication type ${aws_appsync_authenticationType}. Falling back to IAM.`);
		amplifyConfig.API = { GraphQL: {
			endpoint: aws_appsync_graphqlEndpoint,
			apiKey: aws_appsync_apiKey,
			region: aws_appsync_region,
			defaultAuthMode: defaultAuthMode ?? "iam"
		} };
		if (modelIntrospection) amplifyConfig.API.GraphQL.modelIntrospection = modelIntrospection;
	}
	const mfaConfig = aws_cognito_mfa_configuration ? {
		status: aws_cognito_mfa_configuration && aws_cognito_mfa_configuration.toLowerCase(),
		totpEnabled: aws_cognito_mfa_types?.includes("TOTP") ?? false,
		smsEnabled: aws_cognito_mfa_types?.includes("SMS") ?? false
	} : void 0;
	const passwordFormatConfig = aws_cognito_password_protection_settings ? {
		minLength: aws_cognito_password_protection_settings.passwordPolicyMinLength,
		requireLowercase: aws_cognito_password_protection_settings.passwordPolicyCharacters?.includes("REQUIRES_LOWERCASE") ?? false,
		requireUppercase: aws_cognito_password_protection_settings.passwordPolicyCharacters?.includes("REQUIRES_UPPERCASE") ?? false,
		requireNumbers: aws_cognito_password_protection_settings.passwordPolicyCharacters?.includes("REQUIRES_NUMBERS") ?? false,
		requireSpecialCharacters: aws_cognito_password_protection_settings.passwordPolicyCharacters?.includes("REQUIRES_SYMBOLS") ?? false
	} : void 0;
	const userAttributes = Array.from(/* @__PURE__ */ new Set([...aws_cognito_verification_mechanisms ?? [], ...aws_cognito_signup_attributes ?? []])).reduce((attributes, key) => ({
		...attributes,
		[key.toLowerCase()]: { required: true }
	}), {});
	const loginWithEmailEnabled = aws_cognito_username_attributes?.includes("EMAIL") ?? false;
	const loginWithPhoneEnabled = aws_cognito_username_attributes?.includes("PHONE_NUMBER") ?? false;
	if (aws_cognito_identity_pool_id || aws_user_pools_id) amplifyConfig.Auth = { Cognito: {
		identityPoolId: aws_cognito_identity_pool_id,
		allowGuestAccess: aws_mandatory_sign_in !== "enable",
		signUpVerificationMethod: aws_cognito_sign_up_verification_method,
		userAttributes,
		userPoolClientId: aws_user_pools_web_client_id,
		userPoolId: aws_user_pools_id,
		mfa: mfaConfig,
		passwordFormat: passwordFormatConfig,
		loginWith: {
			username: !(loginWithEmailEnabled || loginWithPhoneEnabled),
			email: loginWithEmailEnabled,
			phone: loginWithPhoneEnabled
		}
	} };
	const hasOAuthConfig = oauth ? Object.keys(oauth).length > 0 : false;
	const hasSocialProviderConfig = aws_cognito_social_providers ? aws_cognito_social_providers.length > 0 : false;
	if (amplifyConfig.Auth && hasOAuthConfig) amplifyConfig.Auth.Cognito.loginWith = {
		...amplifyConfig.Auth.Cognito.loginWith,
		oauth: {
			...getOAuthConfig(oauth),
			...hasSocialProviderConfig && { providers: parseSocialProviders(aws_cognito_social_providers) }
		}
	};
	if (aws_user_files_s3_bucket) amplifyConfig.Storage = { S3: {
		bucket: aws_user_files_s3_bucket,
		region: aws_user_files_s3_bucket_region,
		dangerouslyConnectToHttpEndpointForTesting: aws_user_files_s3_dangerously_connect_to_http_endpoint_for_testing
	} };
	if (geo) {
		const { amazon_location_service } = geo;
		amplifyConfig.Geo = { LocationService: {
			maps: amazon_location_service.maps,
			geofenceCollections: amazon_location_service.geofenceCollections,
			searchIndices: amazon_location_service.search_indices,
			region: amazon_location_service.region
		} };
	}
	if (aws_cloud_logic_custom) amplifyConfig.API = {
		...amplifyConfig.API,
		REST: aws_cloud_logic_custom.reduce((acc, api) => {
			const { name, endpoint, region, service } = api;
			return {
				...acc,
				[name]: {
					endpoint,
					...service ? { service } : void 0,
					...region ? { region } : void 0
				}
			};
		}, {})
	};
	if (predictions) {
		const { VoiceId: voiceId } = predictions?.convert?.speechGenerator?.defaults ?? {};
		amplifyConfig.Predictions = voiceId ? {
			...predictions,
			convert: {
				...predictions.convert,
				speechGenerator: {
					...predictions.convert.speechGenerator,
					defaults: { voiceId }
				}
			}
		} : predictions;
	}
	return amplifyConfig;
};
var getRedirectUrl$1 = (redirectStr) => redirectStr?.split(",") ?? [];
var getOAuthConfig = ({ domain, scope, redirectSignIn, redirectSignOut, responseType }) => ({
	domain,
	scopes: scope,
	redirectSignIn: getRedirectUrl$1(redirectSignIn),
	redirectSignOut: getRedirectUrl$1(redirectSignOut),
	responseType
});
var parseSocialProviders = (aws_cognito_social_providers) => {
	return aws_cognito_social_providers.map((provider) => {
		const updatedProvider = provider.toLowerCase();
		return updatedProvider.charAt(0).toUpperCase() + updatedProvider.slice(1);
	});
};
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/singleton/constants.mjs
var ADD_OAUTH_LISTENER = Symbol("oauth-listener");
//#endregion
//#region node_modules/uuid/dist/esm/stringify.js
var byteToHex = [];
for (let i = 0; i < 256; ++i) byteToHex.push((i + 256).toString(16).slice(1));
function unsafeStringify(arr, offset = 0) {
	return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}
//#endregion
//#region node_modules/uuid/dist/esm/rng.js
var rnds8Pool = /* @__PURE__ */ new Uint8Array(256);
var poolPtr = rnds8Pool.length;
function rng() {
	if (poolPtr > rnds8Pool.length - 16) {
		randomFillSync(rnds8Pool);
		poolPtr = 0;
	}
	return rnds8Pool.slice(poolPtr, poolPtr += 16);
}
//#endregion
//#region node_modules/uuid/dist/esm/native.js
var native_default = { randomUUID };
//#endregion
//#region node_modules/uuid/dist/esm/v4.js
function v4(options, buf, offset) {
	if (native_default.randomUUID && !buf && !options) return native_default.randomUUID();
	options = options || {};
	const rnds = options.random ?? options.rng?.() ?? rng();
	if (rnds.length < 16) throw new Error("Random bytes length must be >= 16");
	rnds[6] = rnds[6] & 15 | 64;
	rnds[8] = rnds[8] & 63 | 128;
	if (buf) {
		offset = offset || 0;
		if (offset < 0 || offset + 16 > buf.length) throw new RangeError(`UUID byte range ${offset}:${offset + 15} is out of buffer bounds`);
		for (let i = 0; i < 16; ++i) buf[offset + i] = rnds[i];
		return buf;
	}
	return unsafeStringify(rnds);
}
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/parseAmplifyOutputs.mjs
function isAmplifyOutputs(config) {
	const { version } = config;
	if (!version) return false;
	return version.startsWith("1");
}
function parseStorage(amplifyOutputsStorageProperties) {
	if (!amplifyOutputsStorageProperties) return;
	const { bucket_name, aws_region, buckets } = amplifyOutputsStorageProperties;
	return { S3: {
		bucket: bucket_name,
		region: aws_region,
		buckets: buckets && createBucketInfoMap(buckets)
	} };
}
function parseAuth(amplifyOutputsAuthProperties) {
	if (!amplifyOutputsAuthProperties) return;
	const { user_pool_id, user_pool_client_id, identity_pool_id, password_policy, mfa_configuration, mfa_methods, unauthenticated_identities_enabled, oauth, username_attributes, standard_required_attributes, groups, passwordless } = amplifyOutputsAuthProperties;
	const authConfig = { Cognito: {
		userPoolId: user_pool_id,
		userPoolClientId: user_pool_client_id,
		groups
	} };
	if (identity_pool_id) authConfig.Cognito = {
		...authConfig.Cognito,
		identityPoolId: identity_pool_id
	};
	if (password_policy) authConfig.Cognito.passwordFormat = {
		requireLowercase: password_policy.require_lowercase,
		requireNumbers: password_policy.require_numbers,
		requireUppercase: password_policy.require_uppercase,
		requireSpecialCharacters: password_policy.require_symbols,
		minLength: password_policy.min_length ?? 6
	};
	if (mfa_configuration) authConfig.Cognito.mfa = {
		status: getMfaStatus(mfa_configuration),
		smsEnabled: mfa_methods?.includes("SMS"),
		totpEnabled: mfa_methods?.includes("TOTP")
	};
	if (unauthenticated_identities_enabled) authConfig.Cognito.allowGuestAccess = unauthenticated_identities_enabled;
	if (oauth) authConfig.Cognito.loginWith = { oauth: {
		domain: oauth.domain,
		redirectSignIn: oauth.redirect_sign_in_uri,
		redirectSignOut: oauth.redirect_sign_out_uri,
		responseType: oauth.response_type === "token" ? "token" : "code",
		scopes: oauth.scopes,
		providers: getOAuthProviders(oauth.identity_providers)
	} };
	if (username_attributes) authConfig.Cognito.loginWith = {
		...authConfig.Cognito.loginWith,
		email: username_attributes.includes("email"),
		phone: username_attributes.includes("phone_number"),
		username: username_attributes.includes("username")
	};
	if (standard_required_attributes) authConfig.Cognito.userAttributes = standard_required_attributes.reduce((acc, curr) => ({
		...acc,
		[curr]: { required: true }
	}), {});
	if (passwordless) authConfig.Cognito.passwordless = {
		emailOtpEnabled: passwordless.email_otp_enabled,
		smsOtpEnabled: passwordless.sms_otp_enabled,
		webAuthn: passwordless.web_authn ? {
			relyingPartyId: passwordless.web_authn.relying_party_id,
			userVerification: passwordless.web_authn.user_verification
		} : void 0,
		preferredChallenge: passwordless.preferred_challenge
	};
	return authConfig;
}
function parseAnalytics(amplifyOutputsAnalyticsProperties) {
	if (!amplifyOutputsAnalyticsProperties?.amazon_pinpoint) return;
	const { amazon_pinpoint } = amplifyOutputsAnalyticsProperties;
	return { Pinpoint: {
		appId: amazon_pinpoint.app_id,
		region: amazon_pinpoint.aws_region
	} };
}
function parseGeo(amplifyOutputsAnalyticsProperties) {
	if (!amplifyOutputsAnalyticsProperties) return;
	const { aws_region, geofence_collections, maps, search_indices } = amplifyOutputsAnalyticsProperties;
	return { LocationService: {
		region: aws_region,
		searchIndices: search_indices,
		geofenceCollections: geofence_collections,
		maps
	} };
}
function parseData(amplifyOutputsDataProperties) {
	if (!amplifyOutputsDataProperties) return;
	const { aws_region, default_authorization_type, url, api_key, model_introspection } = amplifyOutputsDataProperties;
	return { GraphQL: {
		endpoint: url,
		defaultAuthMode: getGraphQLAuthMode(default_authorization_type),
		region: aws_region,
		apiKey: api_key,
		modelIntrospection: model_introspection
	} };
}
function parseCustom(amplifyOutputsCustomProperties) {
	if (!amplifyOutputsCustomProperties?.events) return;
	const { url, aws_region, api_key, default_authorization_type } = amplifyOutputsCustomProperties.events;
	return { Events: {
		endpoint: url,
		defaultAuthMode: getGraphQLAuthMode(default_authorization_type),
		region: aws_region,
		apiKey: api_key
	} };
}
function parseNotifications(amplifyOutputsNotificationsProperties) {
	if (!amplifyOutputsNotificationsProperties) return;
	const { aws_region, channels, amazon_pinpoint_app_id } = amplifyOutputsNotificationsProperties;
	const hasInAppMessaging = channels.includes("IN_APP_MESSAGING");
	const hasPushNotification = channels.includes("APNS") || channels.includes("FCM");
	if (!(hasInAppMessaging || hasPushNotification)) return;
	const notificationsConfig = {};
	if (hasInAppMessaging) notificationsConfig.InAppMessaging = { Pinpoint: {
		appId: amazon_pinpoint_app_id,
		region: aws_region
	} };
	if (hasPushNotification) notificationsConfig.PushNotification = { Pinpoint: {
		appId: amazon_pinpoint_app_id,
		region: aws_region
	} };
	return notificationsConfig;
}
function parseAmplifyOutputs(amplifyOutputs) {
	const resourcesConfig = {};
	if (amplifyOutputs.storage) resourcesConfig.Storage = parseStorage(amplifyOutputs.storage);
	if (amplifyOutputs.auth) resourcesConfig.Auth = parseAuth(amplifyOutputs.auth);
	if (amplifyOutputs.analytics) resourcesConfig.Analytics = parseAnalytics(amplifyOutputs.analytics);
	if (amplifyOutputs.geo) resourcesConfig.Geo = parseGeo(amplifyOutputs.geo);
	if (amplifyOutputs.data) resourcesConfig.API = parseData(amplifyOutputs.data);
	if (amplifyOutputs.custom) {
		const customConfig = parseCustom(amplifyOutputs.custom);
		if (customConfig && "Events" in customConfig) resourcesConfig.API = {
			...resourcesConfig.API,
			...customConfig
		};
	}
	if (amplifyOutputs.notifications) resourcesConfig.Notifications = parseNotifications(amplifyOutputs.notifications);
	return resourcesConfig;
}
var authModeNames = {
	AMAZON_COGNITO_USER_POOLS: "userPool",
	API_KEY: "apiKey",
	AWS_IAM: "iam",
	AWS_LAMBDA: "lambda",
	OPENID_CONNECT: "oidc"
};
function getGraphQLAuthMode(authType) {
	return authModeNames[authType];
}
var providerNames = {
	GOOGLE: "Google",
	LOGIN_WITH_AMAZON: "Amazon",
	FACEBOOK: "Facebook",
	SIGN_IN_WITH_APPLE: "Apple"
};
function getOAuthProviders(providers = []) {
	return providers.reduce((oAuthProviders, provider) => {
		if (providerNames[provider] !== void 0) oAuthProviders.push(providerNames[provider]);
		return oAuthProviders;
	}, []);
}
function getMfaStatus(mfaConfiguration) {
	if (mfaConfiguration === "OPTIONAL") return "optional";
	if (mfaConfiguration === "REQUIRED") return "on";
	return "off";
}
function createBucketInfoMap(buckets) {
	const mappedBuckets = {};
	buckets.forEach(({ name, bucket_name: bucketName, aws_region: region, paths }) => {
		if (name in mappedBuckets) throw new Error(`Duplicate friendly name found: ${name}. Name must be unique.`);
		const sanitizedPaths = paths ? Object.entries(paths).reduce((acc, [key, value]) => {
			if (value !== void 0) acc[key] = value;
			return acc;
		}, {}) : void 0;
		mappedBuckets[name] = {
			bucketName,
			region,
			paths: sanitizedPaths
		};
	});
	return mappedBuckets;
}
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/utils/parseAmplifyConfig.mjs
/**
* Parses the variety of configuration shapes that Amplify can accept into a ResourcesConfig.
*
* @param amplifyConfig An Amplify configuration object conforming to one of the supported schemas.
* @return A ResourcesConfig for the provided configuration object.
*/
var parseAmplifyConfig = (amplifyConfig) => {
	if (Object.keys(amplifyConfig).some((key) => key.startsWith("aws_"))) return parseAWSExports(amplifyConfig);
	else if (isAmplifyOutputs(amplifyConfig)) return parseAmplifyOutputs(amplifyConfig);
	else return amplifyConfig;
};
//#endregion
//#region node_modules/@aws-amplify/core/node_modules/@aws-crypto/sha256-js/build/module/constants.js
/**
* @internal
*/
var KEY$1 = new Uint32Array([
	1116352408,
	1899447441,
	3049323471,
	3921009573,
	961987163,
	1508970993,
	2453635748,
	2870763221,
	3624381080,
	310598401,
	607225278,
	1426881987,
	1925078388,
	2162078206,
	2614888103,
	3248222580,
	3835390401,
	4022224774,
	264347078,
	604807628,
	770255983,
	1249150122,
	1555081692,
	1996064986,
	2554220882,
	2821834349,
	2952996808,
	3210313671,
	3336571891,
	3584528711,
	113926993,
	338241895,
	666307205,
	773529912,
	1294757372,
	1396182291,
	1695183700,
	1986661051,
	2177026350,
	2456956037,
	2730485921,
	2820302411,
	3259730800,
	3345764771,
	3516065817,
	3600352804,
	4094571909,
	275423344,
	430227734,
	506948616,
	659060556,
	883997877,
	958139571,
	1322822218,
	1537002063,
	1747873779,
	1955562222,
	2024104815,
	2227730452,
	2361852424,
	2428436474,
	2756734187,
	3204031479,
	3329325298
]);
/**
* @internal
*/
var INIT$1 = [
	1779033703,
	3144134277,
	1013904242,
	2773480762,
	1359893119,
	2600822924,
	528734635,
	1541459225
];
/**
* @internal
*/
var MAX_HASHABLE_LENGTH$1 = Math.pow(2, 53) - 1;
//#endregion
//#region node_modules/@aws-amplify/core/node_modules/@aws-crypto/sha256-js/build/module/RawSha256.js
/**
* @internal
*/
var RawSha256$1 = function() {
	function RawSha256() {
		this.state = Int32Array.from(INIT$1);
		this.temp = /* @__PURE__ */ new Int32Array(64);
		this.buffer = /* @__PURE__ */ new Uint8Array(64);
		this.bufferLength = 0;
		this.bytesHashed = 0;
		/**
		* @internal
		*/
		this.finished = false;
	}
	RawSha256.prototype.update = function(data) {
		if (this.finished) throw new Error("Attempted to update an already finished hash.");
		var position = 0;
		var byteLength = data.byteLength;
		this.bytesHashed += byteLength;
		if (this.bytesHashed * 8 > MAX_HASHABLE_LENGTH$1) throw new Error("Cannot hash more than 2^53 - 1 bits");
		while (byteLength > 0) {
			this.buffer[this.bufferLength++] = data[position++];
			byteLength--;
			if (this.bufferLength === 64) {
				this.hashBuffer();
				this.bufferLength = 0;
			}
		}
	};
	RawSha256.prototype.digest = function() {
		if (!this.finished) {
			var bitsHashed = this.bytesHashed * 8;
			var bufferView = new DataView(this.buffer.buffer, this.buffer.byteOffset, this.buffer.byteLength);
			var undecoratedLength = this.bufferLength;
			bufferView.setUint8(this.bufferLength++, 128);
			if (undecoratedLength % 64 >= 56) {
				for (var i = this.bufferLength; i < 64; i++) bufferView.setUint8(i, 0);
				this.hashBuffer();
				this.bufferLength = 0;
			}
			for (var i = this.bufferLength; i < 56; i++) bufferView.setUint8(i, 0);
			bufferView.setUint32(56, Math.floor(bitsHashed / 4294967296), true);
			bufferView.setUint32(60, bitsHashed);
			this.hashBuffer();
			this.finished = true;
		}
		var out = /* @__PURE__ */ new Uint8Array(32);
		for (var i = 0; i < 8; i++) {
			out[i * 4] = this.state[i] >>> 24 & 255;
			out[i * 4 + 1] = this.state[i] >>> 16 & 255;
			out[i * 4 + 2] = this.state[i] >>> 8 & 255;
			out[i * 4 + 3] = this.state[i] >>> 0 & 255;
		}
		return out;
	};
	RawSha256.prototype.hashBuffer = function() {
		var _a = this, buffer = _a.buffer, state = _a.state;
		var state0 = state[0], state1 = state[1], state2 = state[2], state3 = state[3], state4 = state[4], state5 = state[5], state6 = state[6], state7 = state[7];
		for (var i = 0; i < 64; i++) {
			if (i < 16) this.temp[i] = (buffer[i * 4] & 255) << 24 | (buffer[i * 4 + 1] & 255) << 16 | (buffer[i * 4 + 2] & 255) << 8 | buffer[i * 4 + 3] & 255;
			else {
				var u = this.temp[i - 2];
				var t1_1 = (u >>> 17 | u << 15) ^ (u >>> 19 | u << 13) ^ u >>> 10;
				u = this.temp[i - 15];
				var t2_1 = (u >>> 7 | u << 25) ^ (u >>> 18 | u << 14) ^ u >>> 3;
				this.temp[i] = (t1_1 + this.temp[i - 7] | 0) + (t2_1 + this.temp[i - 16] | 0);
			}
			var t1 = (((state4 >>> 6 | state4 << 26) ^ (state4 >>> 11 | state4 << 21) ^ (state4 >>> 25 | state4 << 7)) + (state4 & state5 ^ ~state4 & state6) | 0) + (state7 + (KEY$1[i] + this.temp[i] | 0) | 0) | 0;
			var t2 = ((state0 >>> 2 | state0 << 30) ^ (state0 >>> 13 | state0 << 19) ^ (state0 >>> 22 | state0 << 10)) + (state0 & state1 ^ state0 & state2 ^ state1 & state2) | 0;
			state7 = state6;
			state6 = state5;
			state5 = state4;
			state4 = state3 + t1 | 0;
			state3 = state2;
			state2 = state1;
			state1 = state0;
			state0 = t1 + t2 | 0;
		}
		state[0] += state0;
		state[1] += state1;
		state[2] += state2;
		state[3] += state3;
		state[4] += state4;
		state[5] += state5;
		state[6] += state6;
		state[7] += state7;
	};
	return RawSha256;
}();
//#endregion
//#region node_modules/@smithy/util-utf8/node_modules/@smithy/util-buffer-from/dist-es/index.js
var fromString = (input, encoding) => {
	if (typeof input !== "string") throw new TypeError(`The "input" argument must be of type string. Received type ${typeof input} (${input})`);
	return encoding ? Buffer$1.from(input, encoding) : Buffer$1.from(input);
};
//#endregion
//#region node_modules/@smithy/util-utf8/dist-es/fromUtf8.js
var fromUtf8$2 = (input) => {
	const buf = fromString(input, "utf8");
	return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength / Uint8Array.BYTES_PER_ELEMENT);
};
//#endregion
//#region node_modules/@aws-amplify/core/node_modules/@aws-crypto/util/build/module/convertToBuffer.js
var fromUtf8$1 = typeof Buffer !== "undefined" && Buffer.from ? function(input) {
	return Buffer.from(input, "utf8");
} : fromUtf8$2;
function convertToBuffer$1(data) {
	if (data instanceof Uint8Array) return data;
	if (typeof data === "string") return fromUtf8$1(data);
	if (ArrayBuffer.isView(data)) return new Uint8Array(data.buffer, data.byteOffset, data.byteLength / Uint8Array.BYTES_PER_ELEMENT);
	return new Uint8Array(data);
}
//#endregion
//#region node_modules/@aws-amplify/core/node_modules/@aws-crypto/util/build/module/isEmptyData.js
function isEmptyData$1(data) {
	if (typeof data === "string") return data.length === 0;
	return data.byteLength === 0;
}
(function() {
	function Sha256(secret) {
		this.secret = secret;
		this.hash = new RawSha256$1();
		this.reset();
	}
	Sha256.prototype.update = function(toHash) {
		if (isEmptyData$1(toHash) || this.error) return;
		try {
			this.hash.update(convertToBuffer$1(toHash));
		} catch (e) {
			this.error = e;
		}
	};
	Sha256.prototype.digestSync = function() {
		if (this.error) throw this.error;
		if (this.outer) {
			if (!this.outer.finished) this.outer.update(this.hash.digest());
			return this.outer.digest();
		}
		return this.hash.digest();
	};
	Sha256.prototype.digest = function() {
		return __awaiter(this, void 0, void 0, function() {
			return __generator(this, function(_a) {
				return [2, this.digestSync()];
			});
		});
	};
	Sha256.prototype.reset = function() {
		this.hash = new RawSha256$1();
		if (this.secret) {
			this.outer = new RawSha256$1();
			var inner = bufferFromSecret$1(this.secret);
			var outer = /* @__PURE__ */ new Uint8Array(64);
			outer.set(inner);
			for (var i = 0; i < 64; i++) {
				inner[i] ^= 54;
				outer[i] ^= 92;
			}
			this.hash.update(inner);
			this.outer.update(outer);
			for (var i = 0; i < inner.byteLength; i++) inner[i] = 0;
		}
	};
	return Sha256;
})();
function bufferFromSecret$1(secret) {
	var input = convertToBuffer$1(secret);
	if (input.byteLength > 64) {
		var bufferHash = new RawSha256$1();
		bufferHash.update(input);
		input = bufferHash.digest();
	}
	var buffer = /* @__PURE__ */ new Uint8Array(64);
	buffer.set(input);
	return buffer;
}
//#endregion
//#region node_modules/@smithy/util-hex-encoding/dist-es/index.js
var SHORT_TO_HEX$1 = {};
var HEX_TO_SHORT$1 = {};
for (let i = 0; i < 256; i++) {
	let encodedByte = i.toString(16).toLowerCase();
	if (encodedByte.length === 1) encodedByte = `0${encodedByte}`;
	SHORT_TO_HEX$1[i] = encodedByte;
	HEX_TO_SHORT$1[encodedByte] = i;
}
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/Platform/types.mjs
var Framework;
(function(Framework) {
	Framework["WebUnknown"] = "0";
	Framework["React"] = "1";
	Framework["NextJs"] = "2";
	Framework["Angular"] = "3";
	Framework["VueJs"] = "4";
	Framework["Nuxt"] = "5";
	Framework["Svelte"] = "6";
	Framework["ServerSideUnknown"] = "100";
	Framework["ReactSSR"] = "101";
	Framework["NextJsSSR"] = "102";
	Framework["AngularSSR"] = "103";
	Framework["VueJsSSR"] = "104";
	Framework["NuxtSSR"] = "105";
	Framework["SvelteSSR"] = "106";
	Framework["ReactNative"] = "201";
	Framework["Expo"] = "202";
})(Framework || (Framework = {}));
var Category;
(function(Category) {
	Category["AI"] = "ai";
	Category["API"] = "api";
	Category["Auth"] = "auth";
	Category["Analytics"] = "analytics";
	Category["DataStore"] = "datastore";
	Category["Geo"] = "geo";
	Category["InAppMessaging"] = "inappmessaging";
	Category["Interactions"] = "interactions";
	Category["Predictions"] = "predictions";
	Category["PubSub"] = "pubsub";
	Category["PushNotification"] = "pushnotification";
	Category["Storage"] = "storage";
})(Category || (Category = {}));
var AiAction;
(function(AiAction) {
	AiAction["CreateConversation"] = "1";
	AiAction["GetConversation"] = "2";
	AiAction["ListConversations"] = "3";
	AiAction["DeleteConversation"] = "4";
	AiAction["SendMessage"] = "5";
	AiAction["ListMessages"] = "6";
	AiAction["OnMessage"] = "7";
	AiAction["Generation"] = "8";
	AiAction["UpdateConversation"] = "9";
})(AiAction || (AiAction = {}));
var AnalyticsAction;
(function(AnalyticsAction) {
	AnalyticsAction["Record"] = "1";
	AnalyticsAction["IdentifyUser"] = "2";
})(AnalyticsAction || (AnalyticsAction = {}));
var ApiAction;
(function(ApiAction) {
	ApiAction["GraphQl"] = "1";
	ApiAction["Get"] = "2";
	ApiAction["Post"] = "3";
	ApiAction["Put"] = "4";
	ApiAction["Patch"] = "5";
	ApiAction["Del"] = "6";
	ApiAction["Head"] = "7";
})(ApiAction || (ApiAction = {}));
var AuthAction;
(function(AuthAction) {
	AuthAction["SignUp"] = "1";
	AuthAction["ConfirmSignUp"] = "2";
	AuthAction["ResendSignUpCode"] = "3";
	AuthAction["SignIn"] = "4";
	AuthAction["FetchMFAPreference"] = "6";
	AuthAction["UpdateMFAPreference"] = "7";
	AuthAction["SetUpTOTP"] = "10";
	AuthAction["VerifyTOTPSetup"] = "11";
	AuthAction["ConfirmSignIn"] = "12";
	AuthAction["DeleteUserAttributes"] = "15";
	AuthAction["DeleteUser"] = "16";
	AuthAction["UpdateUserAttributes"] = "17";
	AuthAction["FetchUserAttributes"] = "18";
	AuthAction["ConfirmUserAttribute"] = "22";
	AuthAction["SignOut"] = "26";
	AuthAction["UpdatePassword"] = "27";
	AuthAction["ResetPassword"] = "28";
	AuthAction["ConfirmResetPassword"] = "29";
	AuthAction["FederatedSignIn"] = "30";
	AuthAction["RememberDevice"] = "32";
	AuthAction["ForgetDevice"] = "33";
	AuthAction["FetchDevices"] = "34";
	AuthAction["SendUserAttributeVerificationCode"] = "35";
	AuthAction["SignInWithRedirect"] = "36";
	AuthAction["StartWebAuthnRegistration"] = "37";
	AuthAction["CompleteWebAuthnRegistration"] = "38";
	AuthAction["ListWebAuthnCredentials"] = "39";
	AuthAction["DeleteWebAuthnCredential"] = "40";
})(AuthAction || (AuthAction = {}));
var DataStoreAction;
(function(DataStoreAction) {
	DataStoreAction["Subscribe"] = "1";
	DataStoreAction["GraphQl"] = "2";
})(DataStoreAction || (DataStoreAction = {}));
var GeoAction;
(function(GeoAction) {
	GeoAction["SearchByText"] = "0";
	GeoAction["SearchByCoordinates"] = "1";
	GeoAction["SearchForSuggestions"] = "2";
	GeoAction["SearchByPlaceId"] = "3";
	GeoAction["SaveGeofences"] = "4";
	GeoAction["GetGeofence"] = "5";
	GeoAction["ListGeofences"] = "6";
	GeoAction["DeleteGeofences"] = "7";
})(GeoAction || (GeoAction = {}));
var InAppMessagingAction;
(function(InAppMessagingAction) {
	InAppMessagingAction["SyncMessages"] = "1";
	InAppMessagingAction["IdentifyUser"] = "2";
	InAppMessagingAction["NotifyMessageInteraction"] = "3";
})(InAppMessagingAction || (InAppMessagingAction = {}));
var InteractionsAction;
(function(InteractionsAction) {
	InteractionsAction["None"] = "0";
})(InteractionsAction || (InteractionsAction = {}));
var PredictionsAction;
(function(PredictionsAction) {
	PredictionsAction["Convert"] = "1";
	PredictionsAction["Identify"] = "2";
	PredictionsAction["Interpret"] = "3";
})(PredictionsAction || (PredictionsAction = {}));
var PubSubAction;
(function(PubSubAction) {
	PubSubAction["Subscribe"] = "1";
})(PubSubAction || (PubSubAction = {}));
var PushNotificationAction;
(function(PushNotificationAction) {
	PushNotificationAction["InitializePushNotifications"] = "1";
	PushNotificationAction["IdentifyUser"] = "2";
})(PushNotificationAction || (PushNotificationAction = {}));
var StorageAction;
(function(StorageAction) {
	StorageAction["UploadData"] = "1";
	StorageAction["DownloadData"] = "2";
	StorageAction["List"] = "3";
	StorageAction["Copy"] = "4";
	StorageAction["Remove"] = "5";
	StorageAction["GetProperties"] = "6";
	StorageAction["GetUrl"] = "7";
	StorageAction["GetDataAccess"] = "8";
	StorageAction["ListCallerAccessGrants"] = "9";
})(StorageAction || (StorageAction = {}));
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/Platform/version.mjs
var version = "6.18.0";
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/Platform/detection/helpers.mjs
var globalExists = () => {
	return typeof global !== "undefined";
};
var windowExists = () => {
	return typeof window !== "undefined";
};
var documentExists = () => {
	return typeof document !== "undefined";
};
var processExists = () => {
	return typeof process !== "undefined";
};
var keyPrefixMatch = (object, prefix) => {
	return !!Object.keys(object).find((key) => key.startsWith(prefix));
};
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/Platform/detection/React.mjs
function reactWebDetect() {
	const elementKeyPrefixedWithReact = (key) => {
		return key.startsWith("_react") || key.startsWith("__react");
	};
	const elementIsReactEnabled = (element) => {
		return Object.keys(element).find(elementKeyPrefixedWithReact);
	};
	const allElementsWithId = () => Array.from(document.querySelectorAll("[id]"));
	return documentExists() && allElementsWithId().some(elementIsReactEnabled);
}
function reactSSRDetect() {
	return processExists() && typeof process.env !== "undefined" && !!Object.keys(process.env).find((key) => key.includes("react"));
}
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/Platform/detection/Vue.mjs
function vueWebDetect() {
	return windowExists() && keyPrefixMatch(window, "__VUE");
}
function vueSSRDetect() {
	return globalExists() && keyPrefixMatch(global, "__VUE");
}
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/Platform/detection/Svelte.mjs
function svelteWebDetect() {
	return windowExists() && keyPrefixMatch(window, "__SVELTE");
}
function svelteSSRDetect() {
	return processExists() && typeof process.env !== "undefined" && !!Object.keys(process.env).find((key) => key.includes("svelte"));
}
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/Platform/detection/Next.mjs
function nextWebDetect() {
	return windowExists() && window.next && typeof window.next === "object";
}
function nextSSRDetect() {
	return globalExists() && (keyPrefixMatch(global, "__next") || keyPrefixMatch(global, "__NEXT"));
}
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/Platform/detection/Nuxt.mjs
function nuxtWebDetect() {
	return windowExists() && (window.__NUXT__ !== void 0 || window.$nuxt !== void 0);
}
function nuxtSSRDetect() {
	return globalExists() && typeof global.__NUXT_PATHS__ !== "undefined";
}
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/Platform/detection/Angular.mjs
function angularWebDetect() {
	const angularVersionSetInDocument = Boolean(documentExists() && document.querySelector("[ng-version]"));
	const angularContentSetInWindow = Boolean(windowExists() && typeof window.ng !== "undefined");
	return angularVersionSetInDocument || angularContentSetInWindow;
}
function angularSSRDetect() {
	return processExists() && typeof process.env === "object" && process.env.npm_lifecycle_script?.startsWith("ng ") || false;
}
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/Platform/detection/ReactNative.mjs
function reactNativeDetect() {
	return typeof navigator !== "undefined" && typeof navigator.product !== "undefined" && navigator.product === "ReactNative";
}
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/Platform/detection/Expo.mjs
function expoDetect() {
	return globalExists() && typeof global.expo !== "undefined";
}
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/Platform/detection/Web.mjs
function webDetect() {
	return windowExists();
}
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/Platform/detection/index.mjs
var detectionMap = [
	{
		platform: Framework.Expo,
		detectionMethod: expoDetect
	},
	{
		platform: Framework.ReactNative,
		detectionMethod: reactNativeDetect
	},
	{
		platform: Framework.NextJs,
		detectionMethod: nextWebDetect
	},
	{
		platform: Framework.Nuxt,
		detectionMethod: nuxtWebDetect
	},
	{
		platform: Framework.Angular,
		detectionMethod: angularWebDetect
	},
	{
		platform: Framework.React,
		detectionMethod: reactWebDetect
	},
	{
		platform: Framework.VueJs,
		detectionMethod: vueWebDetect
	},
	{
		platform: Framework.Svelte,
		detectionMethod: svelteWebDetect
	},
	{
		platform: Framework.WebUnknown,
		detectionMethod: webDetect
	},
	{
		platform: Framework.NextJsSSR,
		detectionMethod: nextSSRDetect
	},
	{
		platform: Framework.NuxtSSR,
		detectionMethod: nuxtSSRDetect
	},
	{
		platform: Framework.ReactSSR,
		detectionMethod: reactSSRDetect
	},
	{
		platform: Framework.VueJsSSR,
		detectionMethod: vueSSRDetect
	},
	{
		platform: Framework.AngularSSR,
		detectionMethod: angularSSRDetect
	},
	{
		platform: Framework.SvelteSSR,
		detectionMethod: svelteSSRDetect
	}
];
function detect() {
	return detectionMap.find((detectionEntry) => detectionEntry.detectionMethod())?.platform || Framework.ServerSideUnknown;
}
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/Platform/detectFramework.mjs
var frameworkCache;
var frameworkChangeObservers = [];
var resetTriggered = false;
var SSR_RESET_TIMEOUT = 10;
var WEB_RESET_TIMEOUT = 10;
var PRIME_FRAMEWORK_DELAY = 1e3;
var detectFramework = () => {
	if (!frameworkCache) {
		frameworkCache = detect();
		if (resetTriggered) while (frameworkChangeObservers.length) frameworkChangeObservers.pop()?.();
		else frameworkChangeObservers.forEach((fcn) => {
			fcn();
		});
		resetTimeout(Framework.ServerSideUnknown, SSR_RESET_TIMEOUT);
		resetTimeout(Framework.WebUnknown, WEB_RESET_TIMEOUT);
	}
	return frameworkCache;
};
/**
* @internal Setup observer callback that will be called everytime the framework changes
*/
var observeFrameworkChanges = (fcn) => {
	if (resetTriggered) return;
	frameworkChangeObservers.push(fcn);
};
function clearCache() {
	frameworkCache = void 0;
}
function resetTimeout(framework, delay) {
	if (frameworkCache === framework && !resetTriggered) setTimeout(() => {
		clearCache();
		resetTriggered = true;
		setTimeout(detectFramework, PRIME_FRAMEWORK_DELAY);
	}, delay);
}
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/Platform/customUserAgent.mjs
var customUserAgentState = {};
var getCustomUserAgent = (category, api) => customUserAgentState[category]?.[api]?.additionalDetails;
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/Platform/index.mjs
var BASE_USER_AGENT = `aws-amplify`;
/** Sanitize Amplify version string be removing special character + and character post the special character  */
var sanitizeAmplifyVersion = (amplifyVersion) => amplifyVersion.replace(/\+.*/, "");
var PlatformBuilder = class {
	constructor() {
		this.userAgent = `${BASE_USER_AGENT}/${sanitizeAmplifyVersion(version)}`;
	}
	get framework() {
		return detectFramework();
	}
	get isReactNative() {
		return this.framework === Framework.ReactNative || this.framework === Framework.Expo;
	}
	observeFrameworkChanges(fcn) {
		observeFrameworkChanges(fcn);
	}
};
new PlatformBuilder();
var getAmplifyUserAgentObject = ({ category, action } = {}) => {
	const userAgent = [[BASE_USER_AGENT, sanitizeAmplifyVersion(version)]];
	if (category) userAgent.push([category, action]);
	userAgent.push(["framework", detectFramework()]);
	if (category && action) {
		const customState = getCustomUserAgent(category, action);
		if (customState) customState.forEach((state) => {
			userAgent.push(state);
		});
	}
	return userAgent;
};
var getAmplifyUserAgent = (customUserAgentDetails) => {
	return getAmplifyUserAgentObject(customUserAgentDetails).map(([agentKey, agentValue]) => agentKey && agentValue ? `${agentKey}/${agentValue}` : agentKey).join(" ");
};
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/utils/isBrowser.mjs
var isBrowser = () => typeof window !== "undefined" && typeof window.document !== "undefined";
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/singleton/Auth/index.mjs
var logger$2 = new ConsoleLogger("Auth");
var AuthClass = class {
	/**
	* Configure Auth category
	*
	* @internal
	*
	* @param authResourcesConfig - Resources configurations required by Auth providers.
	* @param authOptions - Client options used by library
	*
	* @returns void
	*/
	configure(authResourcesConfig, authOptions) {
		this.authConfig = authResourcesConfig;
		this.authOptions = authOptions;
		if (authResourcesConfig && authResourcesConfig.Cognito?.userPoolEndpoint) logger$2.warn(getCustomEndpointWarningMessage("Amazon Cognito User Pool"));
		if (authResourcesConfig && authResourcesConfig.Cognito?.identityPoolEndpoint) logger$2.warn(getCustomEndpointWarningMessage("Amazon Cognito Identity Pool"));
	}
	/**
	* Fetch the auth tokens, and the temporary AWS credentials and identity if they are configured. By default it
	* will automatically refresh expired auth tokens if a valid refresh token is present. You can force a refresh
	* of non-expired tokens with `{ forceRefresh: true }` input.
	*
	* @param options - Options configuring the fetch behavior.
	*
	* @returns Promise of current auth session {@link AuthSession}.
	*/
	async fetchAuthSession(options = {}) {
		let credentialsAndIdentityId;
		let userSub;
		const tokens = await this.getTokens(options);
		if (tokens) {
			userSub = tokens.accessToken?.payload?.sub;
			credentialsAndIdentityId = await this.authOptions?.credentialsProvider?.getCredentialsAndIdentityId({
				authConfig: this.authConfig,
				tokens,
				authenticated: true,
				forceRefresh: options.forceRefresh
			});
		} else credentialsAndIdentityId = await this.authOptions?.credentialsProvider?.getCredentialsAndIdentityId({
			authConfig: this.authConfig,
			authenticated: false,
			forceRefresh: options.forceRefresh
		});
		return {
			tokens,
			credentials: credentialsAndIdentityId?.credentials,
			identityId: credentialsAndIdentityId?.identityId,
			userSub
		};
	}
	async clearCredentials() {
		await this.authOptions?.credentialsProvider?.clearCredentialsAndIdentityId();
	}
	async getTokens(options) {
		return await this.authOptions?.tokenProvider?.getTokens(options) ?? void 0;
	}
};
var getCustomEndpointWarningMessage = (target) => `You are using a custom Amazon ${target} endpoint, ensure the endpoint is correct.`;
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/singleton/Amplify.mjs
var AmplifyClass = class {
	constructor() {
		this.oAuthListener = void 0;
		this.isConfigured = false;
		this.resourcesConfig = {};
		this.libraryOptions = {};
		this.Auth = new AuthClass();
	}
	/**
	* Configures Amplify for use with your back-end resources.
	*
	* @remarks
	* This API does not perform any merging of either `resourcesConfig` or `libraryOptions`. The most recently
	* provided values will be used after configuration.
	*
	* @remarks
	* `configure` can be used to specify additional library options where available for supported categories.
	*
	* @param resourceConfig - Back-end resource configuration. Typically provided via the `aws-exports.js` file.
	* @param libraryOptions - Additional options for customizing the behavior of the library.
	*/
	configure(resourcesConfig, libraryOptions) {
		const resolvedResourceConfig = parseAmplifyConfig(resourcesConfig);
		this.resourcesConfig = resolvedResourceConfig;
		if (libraryOptions) this.libraryOptions = libraryOptions;
		this.resourcesConfig = deepFreeze(this.resourcesConfig);
		this.Auth.configure(this.resourcesConfig.Auth, this.libraryOptions.Auth);
		if (this.resourcesConfig.Analytics?.Pinpoint || this.resourcesConfig.Notifications?.InAppMessaging?.Pinpoint || this.resourcesConfig.Notifications?.PushNotification?.Pinpoint) console.warn("AWS will end support for Amazon Pinpoint on October 30, 2026. The guidance is to use AWS End User Messaging for push notifications and SMS, Amazon Simple Email Service for sending emails, Amazon Connect for campaigns, journeys, endpoints, and engagement analytics. Pinpoint recommends Amazon Kinesis for event collection and mobile analytics.");
		Hub.dispatch("core", {
			event: "configure",
			data: this.resourcesConfig
		}, "Configure", AMPLIFY_SYMBOL);
		this.notifyOAuthListener();
		this.isConfigured = true;
	}
	/**
	* Provides access to the current back-end resource configuration for the Library.
	*
	* @returns Returns the immutable back-end resource configuration.
	*/
	getConfig() {
		if (!this.isConfigured) console.warn(`Amplify has not been configured. Please call Amplify.configure() before using this service.`);
		return this.resourcesConfig;
	}
	/** @internal */
	[ADD_OAUTH_LISTENER](listener) {
		if (this.resourcesConfig.Auth?.Cognito.loginWith?.oauth) listener(this.resourcesConfig.Auth?.Cognito);
		else this.oAuthListener = listener;
	}
	notifyOAuthListener() {
		if (!this.resourcesConfig.Auth?.Cognito.loginWith?.oauth || !this.oAuthListener) return;
		this.oAuthListener(this.resourcesConfig.Auth?.Cognito);
		this.oAuthListener = void 0;
	}
};
/**
* The `Amplify` utility is used to configure the library.
*
* @remarks
* `Amplify` orchestrates cross-category communication within the library.
*/
var Amplify = new AmplifyClass();
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/singleton/apis/internal/fetchAuthSession.mjs
var fetchAuthSession$1 = (amplify, options) => {
	return amplify.Auth.fetchAuthSession(options);
};
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/singleton/apis/fetchAuthSession.mjs
/**
* Fetch the auth session including the tokens and credentials if they are available. By default it
* will automatically refresh expired auth tokens if a valid refresh token is present. You can force a refresh
* of non-expired tokens with `{ forceRefresh: true }` input.
*
* @param options - Options configuring the fetch behavior.
* @throws {@link AuthError} - Throws error when session information cannot be refreshed.
* @returns Promise<AuthSession>
*/
var fetchAuthSession = (options) => {
	return fetchAuthSession$1(Amplify, options);
};
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/singleton/apis/clearCredentials.mjs
function clearCredentials() {
	return Amplify.Auth.clearCredentials();
}
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/clients/serde/responseInfo.mjs
var parseMetadata = (response) => {
	const { headers, statusCode } = response;
	return {
		...isMetadataBearer(response) ? response.$metadata : {},
		httpStatusCode: statusCode,
		requestId: headers["x-amzn-requestid"] ?? headers["x-amzn-request-id"] ?? headers["x-amz-request-id"],
		extendedRequestId: headers["x-amz-id-2"],
		cfId: headers["x-amz-cf-id"]
	};
};
var isMetadataBearer = (response) => typeof response?.$metadata === "object";
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/clients/serde/json.mjs
/**
* Utility functions for serializing and deserializing of JSON protocol in general(including: REST-JSON, JSON-RPC, etc.)
*/
/**
* Error parser for AWS JSON protocol.
*/
var parseJsonError = async (response) => {
	if (!response || response.statusCode < 300) return;
	const body = await parseJsonBody(response);
	const sanitizeErrorCode = (rawValue) => {
		const [cleanValue] = rawValue.toString().split(/[,:]+/);
		if (cleanValue.includes("#")) return cleanValue.split("#")[1];
		return cleanValue;
	};
	const code = sanitizeErrorCode(response.headers["x-amzn-errortype"] ?? body.code ?? body.__type ?? "UnknownError");
	const message = body.message ?? body.Message ?? "Unknown error";
	const error = new Error(message);
	return Object.assign(error, {
		name: code,
		$metadata: parseMetadata(response)
	});
};
/**
* Parse JSON response body to JavaScript object.
*/
var parseJsonBody = async (response) => {
	if (!response.body) throw new Error("Missing response payload");
	const output = await response.body.json();
	return Object.assign(output, { $metadata: parseMetadata(response) });
};
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/clients/internal/composeServiceApi.mjs
/**
* Compose a service API handler that accepts input as defined shape and responds conforming to defined output shape.
* A service API handler is composed with:
* * A transfer handler
* * A serializer function
* * A deserializer function
* * A default config object
*
* The returned service API handler, when called, will trigger the following workflow:
* 1. When calling the service API handler function, the default config object is merged into the input config
* object to assign the default values of some omitted configs, resulting to a resolved config object.
* 2. The `endpointResolver` function from the default config object will be invoked with the resolved config object and
* API input object resulting to an endpoint instance.
* 3. The serializer function is invoked with API input object and the endpoint instance resulting to an HTTP request
* instance.
* 4. The HTTP request instance and the resolved config object is passed to the transfer handler function.
* 5. The transfer handler function resolves to an HTTP response instance(can be either successful or failed status code).
* 6. The deserializer function is invoked with the HTTP response instance resulting to the API output object, and
* return to the caller.
*
*
* @param transferHandler Async function for dispatching HTTP requests and returning HTTP response.
* @param serializer  Async function for converting object in defined input shape into HTTP request targeting a given
* 	endpoint.
* @param deserializer Async function for converting HTTP response into output object in defined output shape, or error
* 	shape.
* @param defaultConfig  object containing default options to be consumed by transfer handler, serializer and
*  deserializer.
* @returns a async service API handler function that accepts a config object and input object in defined shape, returns
* 	an output object in defined shape. It may also throw error instance in defined shape in deserializer. The config
*  object type is composed with options type of transferHandler, endpointResolver function as well as endpointResolver
*  function's input options type, region string. The config object property will be marked as optional if it's also
* 	defined in defaultConfig.
*
* @internal
*/
var composeServiceApi = (transferHandler, serializer, deserializer, defaultConfig) => {
	return async (config, input) => {
		const resolvedConfig = {
			...defaultConfig,
			...config
		};
		return deserializer(await transferHandler(await serializer(input, await resolvedConfig.endpointResolver(resolvedConfig, input)), { ...resolvedConfig }));
	};
};
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/utils/retry/constants.mjs
var MAX_DELAY_MS = 300 * 1e3;
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/utils/retry/jitteredBackoff.mjs
/**
* @private
* Internal use of Amplify only
*/
function jitteredBackoff$1(maxDelayMs = MAX_DELAY_MS) {
	const BASE_TIME_MS = 100;
	const JITTER_FACTOR = 100;
	return (attempt) => {
		const delay = 2 ** attempt * BASE_TIME_MS + JITTER_FACTOR * Math.random();
		return delay > maxDelayMs ? false : delay;
	};
}
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/clients/middleware/retry/constants.mjs
var AMZ_SDK_INVOCATION_ID_HEADER = "amz-sdk-invocation-id";
var AMZ_SDK_REQUEST_HEADER = "amz-sdk-request";
var DEFAULT_MAX_DELAY_MS = 300 * 1e3;
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/clients/middleware/retry/jitteredBackoff.mjs
var jitteredBackoff = (attempt) => {
	const delay = jitteredBackoff$1(DEFAULT_MAX_DELAY_MS)(attempt);
	return delay === false ? DEFAULT_MAX_DELAY_MS : delay;
};
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/clients/middleware/retry/isClockSkewError.mjs
var CLOCK_SKEW_ERROR_CODES = [
	"AuthFailure",
	"InvalidSignatureException",
	"RequestExpired",
	"RequestInTheFuture",
	"RequestTimeTooSkewed",
	"SignatureDoesNotMatch",
	"BadRequestException"
];
/**
* Given an error code, returns true if it is related to a clock skew error.
*
* @param errorCode String representation of some error.
* @returns True if given error is present in `CLOCK_SKEW_ERROR_CODES`, false otherwise.
*
* @internal
*/
var isClockSkewError = (errorCode) => !!errorCode && CLOCK_SKEW_ERROR_CODES.includes(errorCode);
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/clients/middleware/retry/defaultRetryDecider.mjs
/**
* Get retry decider function
* @param errorParser Function to load JavaScript error from HTTP response
*/
var getRetryDecider = (errorParser) => async (response, error) => {
	const parsedError = error ?? await errorParser(response) ?? void 0;
	const errorCode = parsedError?.code || parsedError?.name;
	const statusCode = response?.statusCode;
	return { retryable: isConnectionError(error) || isThrottlingError(statusCode, errorCode) || isClockSkewError(errorCode) || isServerSideError(statusCode, errorCode) };
};
var THROTTLING_ERROR_CODES = [
	"BandwidthLimitExceeded",
	"EC2ThrottledException",
	"LimitExceededException",
	"PriorRequestNotComplete",
	"ProvisionedThroughputExceededException",
	"RequestLimitExceeded",
	"RequestThrottled",
	"RequestThrottledException",
	"SlowDown",
	"ThrottledException",
	"Throttling",
	"ThrottlingException",
	"TooManyRequestsException"
];
var TIMEOUT_ERROR_CODES = [
	"TimeoutError",
	"RequestTimeout",
	"RequestTimeoutException"
];
var isThrottlingError = (statusCode, errorCode) => statusCode === 429 || !!errorCode && THROTTLING_ERROR_CODES.includes(errorCode);
var isConnectionError = (error) => [AmplifyErrorCode.NetworkError, "ERR_NETWORK"].includes(error?.name);
var isServerSideError = (statusCode, errorCode) => !!statusCode && [
	500,
	502,
	503,
	504
].includes(statusCode) || !!errorCode && TIMEOUT_ERROR_CODES.includes(errorCode);
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/clients/middleware/retry/retryMiddleware.mjs
/**
* Middleware that executes the retry logic.
*/
var retryMiddlewareFactory = ({ maxAttempts = 3, retryDecider, computeDelay, abortSignal }) => {
	if (maxAttempts < 1) throw new Error("maxAttempts must be greater than 0");
	return (next, context) => async function retryMiddleware(request) {
		let error;
		let attemptsCount = context.attemptsCount ?? 0;
		let response;
		const handleTerminalErrorOrResponse = () => {
			if (response) {
				addOrIncrementMetadataAttempts(response, attemptsCount);
				return response;
			} else {
				addOrIncrementMetadataAttempts(error, attemptsCount);
				throw error;
			}
		};
		while (!abortSignal?.aborted && attemptsCount < maxAttempts) {
			try {
				response = await next(request);
				error = void 0;
			} catch (e) {
				error = e;
				response = void 0;
			}
			attemptsCount = (context.attemptsCount ?? 0) > attemptsCount ? context.attemptsCount ?? 0 : attemptsCount + 1;
			context.attemptsCount = attemptsCount;
			const { isCredentialsExpiredError, retryable } = await retryDecider(response, error, context);
			if (retryable) {
				context.isCredentialsExpired = !!isCredentialsExpiredError;
				if (!abortSignal?.aborted && attemptsCount < maxAttempts) await cancellableSleep(computeDelay(attemptsCount), abortSignal);
				continue;
			} else return handleTerminalErrorOrResponse();
		}
		if (abortSignal?.aborted) throw new Error("Request aborted.");
		else return handleTerminalErrorOrResponse();
	};
};
var cancellableSleep = (timeoutMs, abortSignal) => {
	if (abortSignal?.aborted) return Promise.resolve();
	let timeoutId;
	let sleepPromiseResolveFn;
	const sleepPromise = new Promise((resolve) => {
		sleepPromiseResolveFn = resolve;
		timeoutId = setTimeout(resolve, timeoutMs);
	});
	abortSignal?.addEventListener("abort", function cancelSleep(_) {
		clearTimeout(timeoutId);
		abortSignal?.removeEventListener("abort", cancelSleep);
		sleepPromiseResolveFn();
	});
	return sleepPromise;
};
var addOrIncrementMetadataAttempts = (nextHandlerOutput, attempts) => {
	if (Object.prototype.toString.call(nextHandlerOutput) !== "[object Object]") return;
	nextHandlerOutput.$metadata = {
		...nextHandlerOutput.$metadata ?? {},
		attempts
	};
};
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/utils/amplifyUuid/index.mjs
var amplifyUuid = v4;
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/clients/middleware/retry/amzSdkInvocationIdHeaderMiddleware.mjs
/**
* Middleware injects a UUID string to `amz-sdk-invocation-id` header.
* if the header is not set already. This header is helpful to provide
* observability to group the requests caused by automatic retry.
*
* This middleware is standalone because of extra UUID dependency, we will
* NOT use this middleware for API categories.
*
* Ref: https://sdk.amazonaws.com/kotlin/api/smithy-kotlin/api/1.0.9/http-client/aws.smithy.kotlin.runtime.http.operation/-http-operation-context/-sdk-invocation-id.html
*/
var amzSdkInvocationIdHeaderMiddlewareFactory = () => (next) => {
	return async function amzSdkInvocationIdHeaderMiddleware(request) {
		if (!request.headers["amz-sdk-invocation-id"]) request.headers[AMZ_SDK_INVOCATION_ID_HEADER] = amplifyUuid();
		return next(request);
	};
};
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/clients/middleware/retry/amzSdkRequestHeaderMiddleware.mjs
/**
* Middleware injects `amz-sdk-request` header to indicate the retry state at the time an HTTP request is made.
* This middleware should co-exist with retryMiddleware as it relies on the retryAttempts value in middleware context
* set by the retry middleware.
*
* Example header: `amz-sdk-request: attempt=1; max=3`.
*
* This middleware is standalone because of extra headers may conflict with custom endpoint settings(e.g. CORS), we will
* NOT use this middleware for API categories.
*/
var amzSdkRequestHeaderMiddlewareFactory = ({ maxAttempts = 3 }) => (next, context) => {
	return async function amzSdkRequestHeaderMiddleware(request) {
		const attemptsCount = context.attemptsCount ?? 0;
		request.headers[AMZ_SDK_REQUEST_HEADER] = `attempt=${attemptsCount + 1}; max=${maxAttempts}`;
		return next(request);
	};
};
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/clients/middleware/userAgent/middleware.mjs
/**
* Middleware injects user agent string to specified header(default to 'x-amz-user-agent'),
* if the header is not set already.
*
* TODO: incorporate new user agent design
*/
var userAgentMiddlewareFactory = ({ userAgentHeader = "x-amz-user-agent", userAgentValue = "" }) => (next) => {
	return async function userAgentMiddleware(request) {
		if (userAgentValue.trim().length === 0) return await next(request);
		else {
			const headerName = userAgentHeader.toLowerCase();
			request.headers[headerName] = request.headers[headerName] ? `${request.headers[headerName]} ${userAgentValue}` : userAgentValue;
			return await next(request);
		}
	};
};
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/clients/internal/composeTransferHandler.mjs
/**
* Compose a transfer handler with a core transfer handler and a list of middleware.
* @param coreHandler Core transfer handler
* @param middleware	List of middleware
* @returns A transfer handler whose option type is the union of the core
* 	transfer handler's option type and the middleware's option type.
* @internal
*/
var composeTransferHandler = (coreHandler, middleware) => (request, options) => {
	const context = {};
	let composedHandler = (composeHandlerRequest) => coreHandler(composeHandlerRequest, options);
	for (let i = middleware.length - 1; i >= 0; i--) {
		const m = middleware[i];
		composedHandler = m(options)(composedHandler, context);
	}
	return composedHandler(request);
};
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/clients/utils/memoization.mjs
/**
* Cache the payload of a response body. It allows multiple calls to the body,
* for example, when reading the body in both retry decider and error deserializer.
* Caching body is allowed here because we call the body accessor(blob(), json(),
* etc.) when body is small or streaming implementation is not available(RN).
*
* @internal
*/
var withMemoization = (payloadAccessor) => {
	let cached;
	return () => {
		if (!cached) cached = payloadAccessor();
		return cached;
	};
};
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/clients/handlers/fetch.mjs
var shouldSendBody = (method) => !["HEAD", "GET"].includes(method.toUpperCase());
var fetchTransferHandler = async ({ url, method, headers, body }, { abortSignal, cache, withCrossDomainCredentials }) => {
	let resp;
	try {
		resp = await fetch(url, {
			method,
			headers,
			body: shouldSendBody(method) ? body : void 0,
			signal: abortSignal,
			cache,
			credentials: withCrossDomainCredentials ? "include" : "same-origin"
		});
	} catch (e) {
		if (e instanceof TypeError) throw new AmplifyError({
			name: AmplifyErrorCode.NetworkError,
			message: "A network error has occurred.",
			underlyingError: e
		});
		throw e;
	}
	const responseHeaders = {};
	resp.headers?.forEach((value, key) => {
		responseHeaders[key.toLowerCase()] = value;
	});
	const httpResponse = {
		statusCode: resp.status,
		headers: responseHeaders,
		body: null
	};
	const bodyWithMixin = Object.assign(resp.body ?? {}, {
		text: withMemoization(() => resp.text()),
		blob: withMemoization(() => resp.blob()),
		json: withMemoization(() => resp.json())
	});
	return {
		...httpResponse,
		body: bodyWithMixin
	};
};
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/clients/handlers/aws/unauthenticated.mjs
var unauthenticatedHandler = composeTransferHandler(fetchTransferHandler, [
	userAgentMiddlewareFactory,
	amzSdkInvocationIdHeaderMiddlewareFactory,
	retryMiddlewareFactory,
	amzSdkRequestHeaderMiddlewareFactory
]);
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/clients/endpoints/partitions.mjs
/**
* Default partition for AWS services. This is used when the region is not provided or the region is not recognized.
*
* @internal
*/
var defaultPartition = {
	id: "aws",
	outputs: { dnsSuffix: "amazonaws.com" },
	regionRegex: "^(us|eu|ap|sa|ca|me|af)\\-\\w+\\-\\d+$",
	regions: ["aws-global"]
};
/**
* This data is adapted from the partition file from AWS SDK shared utilities but remove some contents for bundle size
* concern. Information removed are `dualStackDnsSuffix`, `supportDualStack`, `supportFIPS`, restricted partitions, and
* list of regions for each partition other than global regions.
*
* * Ref: https://docs.aws.amazon.com/general/latest/gr/rande.html#regional-endpoints
* * Ref: https://github.com/aws/aws-sdk-js-v3/blob/0201baef03c2379f1f6f7150b9d401d4b230d488/packages/util-endpoints/src/lib/aws/partitions.json#L1
*
* @internal
*/
var partitionsInfo = { partitions: [defaultPartition, {
	id: "aws-cn",
	outputs: { dnsSuffix: "amazonaws.com.cn" },
	regionRegex: "^cn\\-\\w+\\-\\d+$",
	regions: ["aws-cn-global"]
}] };
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/clients/endpoints/getDnsSuffix.mjs
/**
* Get the AWS Services endpoint URL's DNS suffix for a given region. A typical AWS regional service endpoint URL will
* follow this pattern: {endpointPrefix}.{region}.{dnsSuffix}. For example, the endpoint URL for Cognito Identity in
* us-east-1 will be cognito-identity.us-east-1.amazonaws.com. Here the DnsSuffix is `amazonaws.com`.
*
* @param region
* @returns The DNS suffix
*
* @internal
*/
var getDnsSuffix = (region) => {
	const { partitions } = partitionsInfo;
	for (const { regions, outputs, regionRegex } of partitions) {
		const regex = new RegExp(regionRegex);
		if (regions.includes(region) || regex.test(region)) return outputs.dnsSuffix;
	}
	return defaultPartition.outputs.dnsSuffix;
};
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/utils/amplifyUrl/index.mjs
var AmplifyUrl = URL;
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/errors/PlatformNotSupportedError.mjs
var PlatformNotSupportedError = class extends AmplifyError {
	constructor() {
		super({
			name: AmplifyErrorCode.PlatformNotSupported,
			message: "Function not supported on current platform"
		});
	}
};
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/storage/KeyValueStorage.mjs
/**
* @internal
*/
var KeyValueStorage = class {
	constructor(storage) {
		this.storage = storage;
	}
	/**
	* This is used to set a specific item in storage
	* @param {string} key - the key for the item
	* @param {object} value - the value
	* @returns {string} value that was set
	*/
	async setItem(key, value) {
		if (!this.storage) throw new PlatformNotSupportedError();
		this.storage.setItem(key, value);
	}
	/**
	* This is used to get a specific key from storage
	* @param {string} key - the key for the item
	* This is used to clear the storage
	* @returns {string} the data item
	*/
	async getItem(key) {
		if (!this.storage) throw new PlatformNotSupportedError();
		return this.storage.getItem(key);
	}
	/**
	* This is used to remove an item from storage
	* @param {string} key - the key being set
	* @returns {string} value - value that was deleted
	*/
	async removeItem(key) {
		if (!this.storage) throw new PlatformNotSupportedError();
		this.storage.removeItem(key);
	}
	/**
	* This is used to clear the storage
	* @returns {string} nothing
	*/
	async clear() {
		if (!this.storage) throw new PlatformNotSupportedError();
		this.storage.clear();
	}
};
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/storage/InMemoryStorage.mjs
/**
* @internal
*/
var InMemoryStorage = class {
	constructor() {
		this.storage = /* @__PURE__ */ new Map();
	}
	get length() {
		return this.storage.size;
	}
	key(index) {
		if (index > this.length - 1) return null;
		return Array.from(this.storage.keys())[index];
	}
	setItem(key, value) {
		this.storage.set(key, value);
	}
	getItem(key) {
		return this.storage.get(key) ?? null;
	}
	removeItem(key) {
		this.storage.delete(key);
	}
	clear() {
		this.storage.clear();
	}
};
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/storage/utils.mjs
/**
* @internal
* @returns Either a reference to window.localStorage or an in-memory storage as fallback
*/
var logger$1 = new ConsoleLogger("CoreStorageUtils");
var getLocalStorageWithFallback = () => {
	try {
		if (typeof window !== "undefined" && window.localStorage) return window.localStorage;
	} catch (e) {
		logger$1.info("localStorage not found. InMemoryStorage is used as a fallback.");
	}
	return new InMemoryStorage();
};
/**
* @internal
* @returns Either a reference to window.sessionStorage or an in-memory storage as fallback
*/
var getSessionStorageWithFallback = () => {
	try {
		if (typeof window !== "undefined" && window.sessionStorage) {
			window.sessionStorage.getItem("test");
			return window.sessionStorage;
		}
		throw new Error("sessionStorage is not defined");
	} catch (e) {
		logger$1.info("sessionStorage not found. InMemoryStorage is used as a fallback.");
		return new InMemoryStorage();
	}
};
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/storage/DefaultStorage.mjs
/**
* @internal
*/
var DefaultStorage = class extends KeyValueStorage {
	constructor() {
		super(getLocalStorageWithFallback());
	}
};
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/storage/SessionStorage.mjs
/**
* @internal
*/
var SessionStorage = class extends KeyValueStorage {
	constructor() {
		super(getSessionStorageWithFallback());
	}
};
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/storage/SyncKeyValueStorage.mjs
/**
* @internal
*/
var SyncKeyValueStorage = class {
	constructor(storage) {
		this._storage = storage;
	}
	get storage() {
		if (!this._storage) throw new PlatformNotSupportedError();
		return this._storage;
	}
	/**
	* This is used to set a specific item in storage
	* @param {string} key - the key for the item
	* @param {object} value - the value
	* @returns {string} value that was set
	*/
	setItem(key, value) {
		this.storage.setItem(key, value);
	}
	/**
	* This is used to get a specific key from storage
	* @param {string} key - the key for the item
	* This is used to clear the storage
	* @returns {string} the data item
	*/
	getItem(key) {
		return this.storage.getItem(key);
	}
	/**
	* This is used to remove an item from storage
	* @param {string} key - the key being set
	* @returns {string} value - value that was deleted
	*/
	removeItem(key) {
		this.storage.removeItem(key);
	}
	/**
	* This is used to clear the storage
	* @returns {string} nothing
	*/
	clear() {
		this.storage.clear();
	}
};
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/storage/SyncSessionStorage.mjs
/**
* @internal
*/
var SyncSessionStorage = class extends SyncKeyValueStorage {
	constructor() {
		super(getSessionStorageWithFallback());
	}
};
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/storage/index.mjs
var defaultStorage = new DefaultStorage();
new SessionStorage();
var syncSessionStorage = new SyncSessionStorage();
new KeyValueStorage(new InMemoryStorage());
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/utils/deDupeAsyncFunction.mjs
/**
* returns in-flight promise if there is one
*
* @param asyncFunction - asyncFunction to be deduped.
* @returns - the return type of the callback
*/
var deDupeAsyncFunction = (asyncFunction) => {
	let inflightPromise;
	return async (...args) => {
		if (inflightPromise) return inflightPromise;
		inflightPromise = new Promise((resolve, reject) => {
			asyncFunction(...args).then((result) => {
				resolve(result);
			}).catch((error) => {
				reject(error);
			}).finally(() => {
				inflightPromise = void 0;
			});
		});
		return inflightPromise;
	};
};
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/utils/isTokenExpired.mjs
function isTokenExpired({ expiresAt, clockDrift, tolerance = 5e3 }) {
	return Date.now() + clockDrift + tolerance > expiresAt;
}
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/utils/deviceName/getDeviceName.mjs
/**
* Retrieves the device name using the User-Agent Client Hints API if available,
* falling back to the traditional userAgent string if not.
*
* @returns {Promise<string>} A promise that resolves with a string representing the device name.
*
* Example Output:
* navigator.userAgentData:
*   'macOS 14.2.1 arm macOS Not A(Brand/99.0.0.0;Google Chrome/121.0.6167.160;Chromium/121.0.6167.160'
* navigator.userAgent:
*   'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/115.0'
*/
var getDeviceName = async () => {
	const { userAgentData } = navigator;
	if (!userAgentData) return navigator.userAgent;
	const { platform = "", platformVersion = "", model = "", architecture = "", fullVersionList = [] } = await userAgentData.getHighEntropyValues([
		"platform",
		"platformVersion",
		"architecture",
		"model",
		"fullVersionList"
	]);
	return [
		platform,
		platformVersion,
		architecture,
		model,
		platform,
		fullVersionList.map((v) => `${v.brand}/${v.version}`).join(";")
	].filter((value) => value).join(" ") || navigator.userAgent;
};
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/utils/convert/base64/bytesToString.mjs
function bytesToString(input) {
	return Array.from(input, (byte) => String.fromCodePoint(byte)).join("");
}
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/utils/convert/base64/base64Encoder.mjs
var base64Encoder = { 
/**
* Convert input to base64-encoded string
* @param input - string to convert to base64
* @param options - encoding options that can optionally produce a base64url string
* @returns base64-encoded string
*/
convert(input, options = {
	urlSafe: false,
	skipPadding: false
}) {
	const inputStr = typeof input === "string" ? input : bytesToString(input);
	let encodedStr = getBtoa()(inputStr);
	if (options.urlSafe) encodedStr = encodedStr.replace(/\+/g, "-").replace(/\//g, "_");
	if (options.skipPadding) encodedStr = encodedStr.replace(/=/g, "");
	return encodedStr;
} };
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/utils/cryptoSecureRandomInt.mjs
function cryptoSecureRandomInt() {
	return getCrypto().getRandomValues(/* @__PURE__ */ new Uint32Array(1))[0];
}
//#endregion
//#region node_modules/@aws-amplify/core/dist/esm/utils/WordArray.mjs
/**
* Hex encoding strategy.
* Converts a word array to a hex string.
* @param {WordArray} wordArray The word array.
* @return {string} The hex string.
* @static
*/
function hexStringify(wordArray) {
	const { words } = wordArray;
	const { sigBytes } = wordArray;
	const hexChars = [];
	for (let i = 0; i < sigBytes; i++) {
		const bite = words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
		hexChars.push((bite >>> 4).toString(16));
		hexChars.push((bite & 15).toString(16));
	}
	return hexChars.join("");
}
var WordArray = class WordArray {
	constructor(words, sigBytes) {
		this.words = [];
		let Words = words;
		Words = this.words = Words || [];
		if (sigBytes !== void 0) this.sigBytes = sigBytes;
		else this.sigBytes = Words.length * 4;
	}
	random(nBytes) {
		const words = [];
		for (let i = 0; i < nBytes; i += 4) words.push(cryptoSecureRandomInt());
		return new WordArray(words, nBytes);
	}
	toString() {
		return hexStringify(this);
	}
};
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/errors/types/validation.mjs
var AuthValidationErrorCode;
(function(AuthValidationErrorCode) {
	AuthValidationErrorCode["EmptySignInUsername"] = "EmptySignInUsername";
	AuthValidationErrorCode["EmptySignInPassword"] = "EmptySignInPassword";
	AuthValidationErrorCode["CustomAuthSignInPassword"] = "CustomAuthSignInPassword";
	AuthValidationErrorCode["EmptySignUpUsername"] = "EmptySignUpUsername";
	AuthValidationErrorCode["EmptySignUpPassword"] = "EmptySignUpPassword";
	AuthValidationErrorCode["EmptyConfirmSignUpUsername"] = "EmptyConfirmSignUpUsername";
	AuthValidationErrorCode["EmptyConfirmSignUpCode"] = "EmptyConfirmSignUpCode";
	AuthValidationErrorCode["EmptyResendSignUpCodeUsername"] = "EmptyresendSignUpCodeUsername";
	AuthValidationErrorCode["EmptyChallengeResponse"] = "EmptyChallengeResponse";
	AuthValidationErrorCode["EmptyConfirmResetPasswordUsername"] = "EmptyConfirmResetPasswordUsername";
	AuthValidationErrorCode["EmptyConfirmResetPasswordNewPassword"] = "EmptyConfirmResetPasswordNewPassword";
	AuthValidationErrorCode["EmptyConfirmResetPasswordConfirmationCode"] = "EmptyConfirmResetPasswordConfirmationCode";
	AuthValidationErrorCode["EmptyResetPasswordUsername"] = "EmptyResetPasswordUsername";
	AuthValidationErrorCode["EmptyVerifyTOTPSetupCode"] = "EmptyVerifyTOTPSetupCode";
	AuthValidationErrorCode["EmptyConfirmUserAttributeCode"] = "EmptyConfirmUserAttributeCode";
	AuthValidationErrorCode["IncorrectMFAMethod"] = "IncorrectMFAMethod";
	AuthValidationErrorCode["EmptyUpdatePassword"] = "EmptyUpdatePassword";
	AuthValidationErrorCode["InvalidPreferredChallenge"] = "InvalidPreferredChallenge";
})(AuthValidationErrorCode || (AuthValidationErrorCode = {}));
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/common/AuthErrorStrings.mjs
var validationErrorMap = {
	[AuthValidationErrorCode.EmptyChallengeResponse]: { message: "challengeResponse is required to confirmSignIn" },
	[AuthValidationErrorCode.EmptyConfirmResetPasswordUsername]: { message: "username is required to confirmResetPassword" },
	[AuthValidationErrorCode.EmptyConfirmSignUpCode]: { message: "code is required to confirmSignUp" },
	[AuthValidationErrorCode.EmptyConfirmSignUpUsername]: { message: "username is required to confirmSignUp" },
	[AuthValidationErrorCode.EmptyConfirmResetPasswordConfirmationCode]: { message: "confirmationCode is required to confirmResetPassword" },
	[AuthValidationErrorCode.EmptyConfirmResetPasswordNewPassword]: { message: "newPassword is required to confirmResetPassword" },
	[AuthValidationErrorCode.EmptyResendSignUpCodeUsername]: { message: "username is required to confirmSignUp" },
	[AuthValidationErrorCode.EmptyResetPasswordUsername]: { message: "username is required to resetPassword" },
	[AuthValidationErrorCode.EmptySignInPassword]: { message: "password is required to signIn" },
	[AuthValidationErrorCode.EmptySignInUsername]: { message: "username is required to signIn" },
	[AuthValidationErrorCode.EmptySignUpPassword]: { message: "password is required to signUp" },
	[AuthValidationErrorCode.EmptySignUpUsername]: { message: "username is required to signUp" },
	[AuthValidationErrorCode.CustomAuthSignInPassword]: {
		message: "A password is not needed when signing in with CUSTOM_WITHOUT_SRP",
		recoverySuggestion: "Do not include a password in your signIn call."
	},
	[AuthValidationErrorCode.IncorrectMFAMethod]: {
		message: "Incorrect MFA method was chosen. It should be either SMS, TOTP, or EMAIL",
		recoverySuggestion: "Try to pass SMS, TOTP, or EMAIL as the challengeResponse"
	},
	[AuthValidationErrorCode.EmptyVerifyTOTPSetupCode]: { message: "code is required to verifyTotpSetup" },
	[AuthValidationErrorCode.EmptyUpdatePassword]: { message: "oldPassword and newPassword are required to changePassword" },
	[AuthValidationErrorCode.EmptyConfirmUserAttributeCode]: { message: "confirmation code is required to confirmUserAttribute" },
	[AuthValidationErrorCode.InvalidPreferredChallenge]: {
		message: "The preferred challenge is not enabled in your backend configuration",
		recoverySuggestion: "Ensure the authentication method is enabled in your Amplify backend configuration"
	}
};
var AuthErrorStrings;
(function(AuthErrorStrings) {
	AuthErrorStrings["DEFAULT_MSG"] = "Authentication Error";
	AuthErrorStrings["EMPTY_EMAIL"] = "Email cannot be empty";
	AuthErrorStrings["EMPTY_PHONE"] = "Phone number cannot be empty";
	AuthErrorStrings["EMPTY_USERNAME"] = "Username cannot be empty";
	AuthErrorStrings["INVALID_USERNAME"] = "The username should either be a string or one of the sign in types";
	AuthErrorStrings["EMPTY_PASSWORD"] = "Password cannot be empty";
	AuthErrorStrings["EMPTY_CODE"] = "Confirmation code cannot be empty";
	AuthErrorStrings["SIGN_UP_ERROR"] = "Error creating account";
	AuthErrorStrings["NO_MFA"] = "No valid MFA method provided";
	AuthErrorStrings["INVALID_MFA"] = "Invalid MFA type";
	AuthErrorStrings["EMPTY_CHALLENGE"] = "Challenge response cannot be empty";
	AuthErrorStrings["NO_USER_SESSION"] = "Failed to get the session because the user is empty";
	AuthErrorStrings["NETWORK_ERROR"] = "Network Error";
	AuthErrorStrings["DEVICE_CONFIG"] = "Device tracking has not been configured in this User Pool";
	AuthErrorStrings["AUTOSIGNIN_ERROR"] = "Please use your credentials to sign in";
	AuthErrorStrings["OAUTH_ERROR"] = "Couldn't finish OAuth flow, check your User Pool HostedUI settings";
})(AuthErrorStrings || (AuthErrorStrings = {}));
var AuthErrorCodes;
(function(AuthErrorCodes) {
	AuthErrorCodes["SignInException"] = "SignInException";
	AuthErrorCodes["OAuthSignInError"] = "OAuthSignInException";
})(AuthErrorCodes || (AuthErrorCodes = {}));
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/errors/AuthError.mjs
var AuthError = class AuthError extends AmplifyError {
	constructor(params) {
		super(params);
		this.constructor = AuthError;
		Object.setPrototypeOf(this, AuthError.prototype);
	}
};
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/errors/utils/assertValidationError.mjs
function assertValidationError(assertion, name) {
	const { message, recoverySuggestion } = validationErrorMap[name];
	if (!assertion) throw new AuthError({
		name,
		message,
		recoverySuggestion
	});
}
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/foundation/parsers/regionParsers.mjs
function getRegionFromUserPoolId(userPoolId) {
	const region = userPoolId?.split("_")[0];
	if (!userPoolId || userPoolId.indexOf("_") < 0 || !region || typeof region !== "string") throw new AuthError({
		name: "InvalidUserPoolId",
		message: "Invalid user pool id provided."
	});
	return region;
}
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/apiHelpers.mjs
/**
* Transforms a user attributes object into an array of AttributeType objects.
* @param attributes user attributes to be mapped to AttributeType objects.
* @returns an array of AttributeType objects.
*/
function toAttributeType(attributes) {
	return Object.entries(attributes).map(([key, value]) => ({
		Name: key,
		Value: value
	}));
}
/**
* Transforms an array of AttributeType objects into a user attributes object.
*
* @param attributes - an array of AttributeType objects.
* @returns AuthUserAttributes object.
*/
function toAuthUserAttribute(attributes) {
	const userAttributes = {};
	attributes?.forEach((attribute) => {
		if (attribute.Name) userAttributes[attribute.Name] = attribute.Value;
	});
	return userAttributes;
}
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/types/errors.mjs
var AssociateSoftwareTokenException;
(function(AssociateSoftwareTokenException) {
	AssociateSoftwareTokenException["ConcurrentModificationException"] = "ConcurrentModificationException";
	AssociateSoftwareTokenException["ForbiddenException"] = "ForbiddenException";
	AssociateSoftwareTokenException["InternalErrorException"] = "InternalErrorException";
	AssociateSoftwareTokenException["InvalidParameterException"] = "InvalidParameterException";
	AssociateSoftwareTokenException["NotAuthorizedException"] = "NotAuthorizedException";
	AssociateSoftwareTokenException["ResourceNotFoundException"] = "ResourceNotFoundException";
	AssociateSoftwareTokenException["SoftwareTokenMFANotFoundException"] = "SoftwareTokenMFANotFoundException";
})(AssociateSoftwareTokenException || (AssociateSoftwareTokenException = {}));
var ChangePasswordException;
(function(ChangePasswordException) {
	ChangePasswordException["ForbiddenException"] = "ForbiddenException";
	ChangePasswordException["InternalErrorException"] = "InternalErrorException";
	ChangePasswordException["InvalidParameterException"] = "InvalidParameterException";
	ChangePasswordException["InvalidPasswordException"] = "InvalidPasswordException";
	ChangePasswordException["LimitExceededException"] = "LimitExceededException";
	ChangePasswordException["NotAuthorizedException"] = "NotAuthorizedException";
	ChangePasswordException["PasswordResetRequiredException"] = "PasswordResetRequiredException";
	ChangePasswordException["ResourceNotFoundException"] = "ResourceNotFoundException";
	ChangePasswordException["TooManyRequestsException"] = "TooManyRequestsException";
	ChangePasswordException["UserNotConfirmedException"] = "UserNotConfirmedException";
	ChangePasswordException["UserNotFoundException"] = "UserNotFoundException";
})(ChangePasswordException || (ChangePasswordException = {}));
var ConfirmDeviceException;
(function(ConfirmDeviceException) {
	ConfirmDeviceException["ForbiddenException"] = "ForbiddenException";
	ConfirmDeviceException["InternalErrorException"] = "InternalErrorException";
	ConfirmDeviceException["InvalidLambdaResponseException"] = "InvalidLambdaResponseException";
	ConfirmDeviceException["InvalidParameterException"] = "InvalidParameterException";
	ConfirmDeviceException["InvalidPasswordException"] = "InvalidPasswordException";
	ConfirmDeviceException["InvalidUserPoolConfigurationException"] = "InvalidUserPoolConfigurationException";
	ConfirmDeviceException["NotAuthorizedException"] = "NotAuthorizedException";
	ConfirmDeviceException["PasswordResetRequiredException"] = "PasswordResetRequiredException";
	ConfirmDeviceException["ResourceNotFoundException"] = "ResourceNotFoundException";
	ConfirmDeviceException["TooManyRequestsException"] = "TooManyRequestsException";
	ConfirmDeviceException["UsernameExistsException"] = "UsernameExistsException";
	ConfirmDeviceException["UserNotConfirmedException"] = "UserNotConfirmedException";
	ConfirmDeviceException["UserNotFoundException"] = "UserNotFoundException";
})(ConfirmDeviceException || (ConfirmDeviceException = {}));
var ConfirmForgotPasswordException;
(function(ConfirmForgotPasswordException) {
	ConfirmForgotPasswordException["CodeMismatchException"] = "CodeMismatchException";
	ConfirmForgotPasswordException["ExpiredCodeException"] = "ExpiredCodeException";
	ConfirmForgotPasswordException["ForbiddenException"] = "ForbiddenException";
	ConfirmForgotPasswordException["InternalErrorException"] = "InternalErrorException";
	ConfirmForgotPasswordException["InvalidLambdaResponseException"] = "InvalidLambdaResponseException";
	ConfirmForgotPasswordException["InvalidParameterException"] = "InvalidParameterException";
	ConfirmForgotPasswordException["InvalidPasswordException"] = "InvalidPasswordException";
	ConfirmForgotPasswordException["LimitExceededException"] = "LimitExceededException";
	ConfirmForgotPasswordException["NotAuthorizedException"] = "NotAuthorizedException";
	ConfirmForgotPasswordException["ResourceNotFoundException"] = "ResourceNotFoundException";
	ConfirmForgotPasswordException["TooManyFailedAttemptsException"] = "TooManyFailedAttemptsException";
	ConfirmForgotPasswordException["TooManyRequestsException"] = "TooManyRequestsException";
	ConfirmForgotPasswordException["UnexpectedLambdaException"] = "UnexpectedLambdaException";
	ConfirmForgotPasswordException["UserLambdaValidationException"] = "UserLambdaValidationException";
	ConfirmForgotPasswordException["UserNotConfirmedException"] = "UserNotConfirmedException";
	ConfirmForgotPasswordException["UserNotFoundException"] = "UserNotFoundException";
})(ConfirmForgotPasswordException || (ConfirmForgotPasswordException = {}));
var ConfirmSignUpException;
(function(ConfirmSignUpException) {
	ConfirmSignUpException["AliasExistsException"] = "AliasExistsException";
	ConfirmSignUpException["CodeMismatchException"] = "CodeMismatchException";
	ConfirmSignUpException["ExpiredCodeException"] = "ExpiredCodeException";
	ConfirmSignUpException["ForbiddenException"] = "ForbiddenException";
	ConfirmSignUpException["InternalErrorException"] = "InternalErrorException";
	ConfirmSignUpException["InvalidLambdaResponseException"] = "InvalidLambdaResponseException";
	ConfirmSignUpException["InvalidParameterException"] = "InvalidParameterException";
	ConfirmSignUpException["LimitExceededException"] = "LimitExceededException";
	ConfirmSignUpException["NotAuthorizedException"] = "NotAuthorizedException";
	ConfirmSignUpException["ResourceNotFoundException"] = "ResourceNotFoundException";
	ConfirmSignUpException["TooManyFailedAttemptsException"] = "TooManyFailedAttemptsException";
	ConfirmSignUpException["TooManyRequestsException"] = "TooManyRequestsException";
	ConfirmSignUpException["UnexpectedLambdaException"] = "UnexpectedLambdaException";
	ConfirmSignUpException["UserLambdaValidationException"] = "UserLambdaValidationException";
	ConfirmSignUpException["UserNotFoundException"] = "UserNotFoundException";
})(ConfirmSignUpException || (ConfirmSignUpException = {}));
var DeleteUserAttributesException;
(function(DeleteUserAttributesException) {
	DeleteUserAttributesException["ForbiddenException"] = "ForbiddenException";
	DeleteUserAttributesException["InternalErrorException"] = "InternalErrorException";
	DeleteUserAttributesException["InvalidParameterException"] = "InvalidParameterException";
	DeleteUserAttributesException["NotAuthorizedException"] = "NotAuthorizedException";
	DeleteUserAttributesException["PasswordResetRequiredException"] = "PasswordResetRequiredException";
	DeleteUserAttributesException["ResourceNotFoundException"] = "ResourceNotFoundException";
	DeleteUserAttributesException["TooManyRequestsException"] = "TooManyRequestsException";
	DeleteUserAttributesException["UserNotConfirmedException"] = "UserNotConfirmedException";
	DeleteUserAttributesException["UserNotFoundException"] = "UserNotFoundException";
})(DeleteUserAttributesException || (DeleteUserAttributesException = {}));
var DeleteUserException;
(function(DeleteUserException) {
	DeleteUserException["ForbiddenException"] = "ForbiddenException";
	DeleteUserException["InternalErrorException"] = "InternalErrorException";
	DeleteUserException["InvalidParameterException"] = "InvalidParameterException";
	DeleteUserException["NotAuthorizedException"] = "NotAuthorizedException";
	DeleteUserException["PasswordResetRequiredException"] = "PasswordResetRequiredException";
	DeleteUserException["ResourceNotFoundException"] = "ResourceNotFoundException";
	DeleteUserException["TooManyRequestsException"] = "TooManyRequestsException";
	DeleteUserException["UserNotConfirmedException"] = "UserNotConfirmedException";
	DeleteUserException["UserNotFoundException"] = "UserNotFoundException";
})(DeleteUserException || (DeleteUserException = {}));
var ForgetDeviceException;
(function(ForgetDeviceException) {
	ForgetDeviceException["ForbiddenException"] = "ForbiddenException";
	ForgetDeviceException["InternalErrorException"] = "InternalErrorException";
	ForgetDeviceException["InvalidParameterException"] = "InvalidParameterException";
	ForgetDeviceException["InvalidUserPoolConfigurationException"] = "InvalidUserPoolConfigurationException";
	ForgetDeviceException["NotAuthorizedException"] = "NotAuthorizedException";
	ForgetDeviceException["PasswordResetRequiredException"] = "PasswordResetRequiredException";
	ForgetDeviceException["ResourceNotFoundException"] = "ResourceNotFoundException";
	ForgetDeviceException["TooManyRequestsException"] = "TooManyRequestsException";
	ForgetDeviceException["UserNotConfirmedException"] = "UserNotConfirmedException";
	ForgetDeviceException["UserNotFoundException"] = "UserNotFoundException";
})(ForgetDeviceException || (ForgetDeviceException = {}));
var ForgotPasswordException;
(function(ForgotPasswordException) {
	ForgotPasswordException["CodeDeliveryFailureException"] = "CodeDeliveryFailureException";
	ForgotPasswordException["ForbiddenException"] = "ForbiddenException";
	ForgotPasswordException["InternalErrorException"] = "InternalErrorException";
	ForgotPasswordException["InvalidEmailRoleAccessPolicyException"] = "InvalidEmailRoleAccessPolicyException";
	ForgotPasswordException["InvalidLambdaResponseException"] = "InvalidLambdaResponseException";
	ForgotPasswordException["InvalidParameterException"] = "InvalidParameterException";
	ForgotPasswordException["InvalidSmsRoleAccessPolicyException"] = "InvalidSmsRoleAccessPolicyException";
	ForgotPasswordException["InvalidSmsRoleTrustRelationshipException"] = "InvalidSmsRoleTrustRelationshipException";
	ForgotPasswordException["LimitExceededException"] = "LimitExceededException";
	ForgotPasswordException["NotAuthorizedException"] = "NotAuthorizedException";
	ForgotPasswordException["ResourceNotFoundException"] = "ResourceNotFoundException";
	ForgotPasswordException["TooManyRequestsException"] = "TooManyRequestsException";
	ForgotPasswordException["UnexpectedLambdaException"] = "UnexpectedLambdaException";
	ForgotPasswordException["UserLambdaValidationException"] = "UserLambdaValidationException";
	ForgotPasswordException["UserNotFoundException"] = "UserNotFoundException";
})(ForgotPasswordException || (ForgotPasswordException = {}));
var GetUserException;
(function(GetUserException) {
	GetUserException["ForbiddenException"] = "ForbiddenException";
	GetUserException["InternalErrorException"] = "InternalErrorException";
	GetUserException["InvalidParameterException"] = "InvalidParameterException";
	GetUserException["NotAuthorizedException"] = "NotAuthorizedException";
	GetUserException["PasswordResetRequiredException"] = "PasswordResetRequiredException";
	GetUserException["ResourceNotFoundException"] = "ResourceNotFoundException";
	GetUserException["TooManyRequestsException"] = "TooManyRequestsException";
	GetUserException["UserNotConfirmedException"] = "UserNotConfirmedException";
	GetUserException["UserNotFoundException"] = "UserNotFoundException";
})(GetUserException || (GetUserException = {}));
var GetIdException;
(function(GetIdException) {
	GetIdException["ExternalServiceException"] = "ExternalServiceException";
	GetIdException["InternalErrorException"] = "InternalErrorException";
	GetIdException["InvalidParameterException"] = "InvalidParameterException";
	GetIdException["LimitExceededException"] = "LimitExceededException";
	GetIdException["NotAuthorizedException"] = "NotAuthorizedException";
	GetIdException["ResourceConflictException"] = "ResourceConflictException";
	GetIdException["ResourceNotFoundException"] = "ResourceNotFoundException";
	GetIdException["TooManyRequestsException"] = "TooManyRequestsException";
})(GetIdException || (GetIdException = {}));
var GetCredentialsForIdentityException;
(function(GetCredentialsForIdentityException) {
	GetCredentialsForIdentityException["ExternalServiceException"] = "ExternalServiceException";
	GetCredentialsForIdentityException["InternalErrorException"] = "InternalErrorException";
	GetCredentialsForIdentityException["InvalidIdentityPoolConfigurationException"] = "InvalidIdentityPoolConfigurationException";
	GetCredentialsForIdentityException["InvalidParameterException"] = "InvalidParameterException";
	GetCredentialsForIdentityException["NotAuthorizedException"] = "NotAuthorizedException";
	GetCredentialsForIdentityException["ResourceConflictException"] = "ResourceConflictException";
	GetCredentialsForIdentityException["ResourceNotFoundException"] = "ResourceNotFoundException";
	GetCredentialsForIdentityException["TooManyRequestsException"] = "TooManyRequestsException";
})(GetCredentialsForIdentityException || (GetCredentialsForIdentityException = {}));
var GetUserAttributeVerificationException;
(function(GetUserAttributeVerificationException) {
	GetUserAttributeVerificationException["CodeDeliveryFailureException"] = "CodeDeliveryFailureException";
	GetUserAttributeVerificationException["ForbiddenException"] = "ForbiddenException";
	GetUserAttributeVerificationException["InternalErrorException"] = "InternalErrorException";
	GetUserAttributeVerificationException["InvalidEmailRoleAccessPolicyException"] = "InvalidEmailRoleAccessPolicyException";
	GetUserAttributeVerificationException["InvalidLambdaResponseException"] = "InvalidLambdaResponseException";
	GetUserAttributeVerificationException["InvalidParameterException"] = "InvalidParameterException";
	GetUserAttributeVerificationException["InvalidSmsRoleAccessPolicyException"] = "InvalidSmsRoleAccessPolicyException";
	GetUserAttributeVerificationException["InvalidSmsRoleTrustRelationshipException"] = "InvalidSmsRoleTrustRelationshipException";
	GetUserAttributeVerificationException["LimitExceededException"] = "LimitExceededException";
	GetUserAttributeVerificationException["NotAuthorizedException"] = "NotAuthorizedException";
	GetUserAttributeVerificationException["PasswordResetRequiredException"] = "PasswordResetRequiredException";
	GetUserAttributeVerificationException["ResourceNotFoundException"] = "ResourceNotFoundException";
	GetUserAttributeVerificationException["TooManyRequestsException"] = "TooManyRequestsException";
	GetUserAttributeVerificationException["UnexpectedLambdaException"] = "UnexpectedLambdaException";
	GetUserAttributeVerificationException["UserLambdaValidationException"] = "UserLambdaValidationException";
	GetUserAttributeVerificationException["UserNotConfirmedException"] = "UserNotConfirmedException";
	GetUserAttributeVerificationException["UserNotFoundException"] = "UserNotFoundException";
})(GetUserAttributeVerificationException || (GetUserAttributeVerificationException = {}));
var GlobalSignOutException;
(function(GlobalSignOutException) {
	GlobalSignOutException["ForbiddenException"] = "ForbiddenException";
	GlobalSignOutException["InternalErrorException"] = "InternalErrorException";
	GlobalSignOutException["InvalidParameterException"] = "InvalidParameterException";
	GlobalSignOutException["NotAuthorizedException"] = "NotAuthorizedException";
	GlobalSignOutException["PasswordResetRequiredException"] = "PasswordResetRequiredException";
	GlobalSignOutException["ResourceNotFoundException"] = "ResourceNotFoundException";
	GlobalSignOutException["TooManyRequestsException"] = "TooManyRequestsException";
	GlobalSignOutException["UserNotConfirmedException"] = "UserNotConfirmedException";
})(GlobalSignOutException || (GlobalSignOutException = {}));
var InitiateAuthException;
(function(InitiateAuthException) {
	InitiateAuthException["PasswordResetRequiredException"] = "PasswordResetRequiredException";
	InitiateAuthException["ForbiddenException"] = "ForbiddenException";
	InitiateAuthException["InternalErrorException"] = "InternalErrorException";
	InitiateAuthException["InvalidLambdaResponseException"] = "InvalidLambdaResponseException";
	InitiateAuthException["InvalidParameterException"] = "InvalidParameterException";
	InitiateAuthException["InvalidSmsRoleAccessPolicyException"] = "InvalidSmsRoleAccessPolicyException";
	InitiateAuthException["InvalidSmsRoleTrustRelationshipException"] = "InvalidSmsRoleTrustRelationshipException";
	InitiateAuthException["InvalidUserPoolConfigurationException"] = "InvalidUserPoolConfigurationException";
	InitiateAuthException["NotAuthorizedException"] = "NotAuthorizedException";
	InitiateAuthException["ResourceNotFoundException"] = "ResourceNotFoundException";
	InitiateAuthException["TooManyRequestsException"] = "TooManyRequestsException";
	InitiateAuthException["UnexpectedLambdaException"] = "UnexpectedLambdaException";
	InitiateAuthException["UserLambdaValidationException"] = "UserLambdaValidationException";
	InitiateAuthException["UserNotConfirmedException"] = "UserNotConfirmedException";
	InitiateAuthException["UserNotFoundException"] = "UserNotFoundException";
})(InitiateAuthException || (InitiateAuthException = {}));
var ResendConfirmationException;
(function(ResendConfirmationException) {
	ResendConfirmationException["CodeDeliveryFailureException"] = "CodeDeliveryFailureException";
	ResendConfirmationException["ForbiddenException"] = "ForbiddenException";
	ResendConfirmationException["InternalErrorException"] = "InternalErrorException";
	ResendConfirmationException["InvalidEmailRoleAccessPolicyException"] = "InvalidEmailRoleAccessPolicyException";
	ResendConfirmationException["InvalidLambdaResponseException"] = "InvalidLambdaResponseException";
	ResendConfirmationException["InvalidParameterException"] = "InvalidParameterException";
	ResendConfirmationException["InvalidSmsRoleAccessPolicyException"] = "InvalidSmsRoleAccessPolicyException";
	ResendConfirmationException["InvalidSmsRoleTrustRelationshipException"] = "InvalidSmsRoleTrustRelationshipException";
	ResendConfirmationException["LimitExceededException"] = "LimitExceededException";
	ResendConfirmationException["NotAuthorizedException"] = "NotAuthorizedException";
	ResendConfirmationException["ResourceNotFoundException"] = "ResourceNotFoundException";
	ResendConfirmationException["TooManyRequestsException"] = "TooManyRequestsException";
	ResendConfirmationException["UnexpectedLambdaException"] = "UnexpectedLambdaException";
	ResendConfirmationException["UserLambdaValidationException"] = "UserLambdaValidationException";
	ResendConfirmationException["UserNotFoundException"] = "UserNotFoundException";
})(ResendConfirmationException || (ResendConfirmationException = {}));
var RespondToAuthChallengeException;
(function(RespondToAuthChallengeException) {
	RespondToAuthChallengeException["AliasExistsException"] = "AliasExistsException";
	RespondToAuthChallengeException["CodeMismatchException"] = "CodeMismatchException";
	RespondToAuthChallengeException["ExpiredCodeException"] = "ExpiredCodeException";
	RespondToAuthChallengeException["ForbiddenException"] = "ForbiddenException";
	RespondToAuthChallengeException["InternalErrorException"] = "InternalErrorException";
	RespondToAuthChallengeException["InvalidLambdaResponseException"] = "InvalidLambdaResponseException";
	RespondToAuthChallengeException["InvalidParameterException"] = "InvalidParameterException";
	RespondToAuthChallengeException["InvalidPasswordException"] = "InvalidPasswordException";
	RespondToAuthChallengeException["InvalidSmsRoleAccessPolicyException"] = "InvalidSmsRoleAccessPolicyException";
	RespondToAuthChallengeException["InvalidSmsRoleTrustRelationshipException"] = "InvalidSmsRoleTrustRelationshipException";
	RespondToAuthChallengeException["InvalidUserPoolConfigurationException"] = "InvalidUserPoolConfigurationException";
	RespondToAuthChallengeException["MFAMethodNotFoundException"] = "MFAMethodNotFoundException";
	RespondToAuthChallengeException["NotAuthorizedException"] = "NotAuthorizedException";
	RespondToAuthChallengeException["PasswordResetRequiredException"] = "PasswordResetRequiredException";
	RespondToAuthChallengeException["ResourceNotFoundException"] = "ResourceNotFoundException";
	RespondToAuthChallengeException["SoftwareTokenMFANotFoundException"] = "SoftwareTokenMFANotFoundException";
	RespondToAuthChallengeException["TooManyRequestsException"] = "TooManyRequestsException";
	RespondToAuthChallengeException["UnexpectedLambdaException"] = "UnexpectedLambdaException";
	RespondToAuthChallengeException["UserLambdaValidationException"] = "UserLambdaValidationException";
	RespondToAuthChallengeException["UserNotConfirmedException"] = "UserNotConfirmedException";
	RespondToAuthChallengeException["UserNotFoundException"] = "UserNotFoundException";
})(RespondToAuthChallengeException || (RespondToAuthChallengeException = {}));
var SetUserMFAPreferenceException;
(function(SetUserMFAPreferenceException) {
	SetUserMFAPreferenceException["ForbiddenException"] = "ForbiddenException";
	SetUserMFAPreferenceException["InternalErrorException"] = "InternalErrorException";
	SetUserMFAPreferenceException["InvalidParameterException"] = "InvalidParameterException";
	SetUserMFAPreferenceException["NotAuthorizedException"] = "NotAuthorizedException";
	SetUserMFAPreferenceException["PasswordResetRequiredException"] = "PasswordResetRequiredException";
	SetUserMFAPreferenceException["ResourceNotFoundException"] = "ResourceNotFoundException";
	SetUserMFAPreferenceException["UserNotConfirmedException"] = "UserNotConfirmedException";
	SetUserMFAPreferenceException["UserNotFoundException"] = "UserNotFoundException";
})(SetUserMFAPreferenceException || (SetUserMFAPreferenceException = {}));
var SignUpException;
(function(SignUpException) {
	SignUpException["CodeDeliveryFailureException"] = "CodeDeliveryFailureException";
	SignUpException["InternalErrorException"] = "InternalErrorException";
	SignUpException["InvalidEmailRoleAccessPolicyException"] = "InvalidEmailRoleAccessPolicyException";
	SignUpException["InvalidLambdaResponseException"] = "InvalidLambdaResponseException";
	SignUpException["InvalidParameterException"] = "InvalidParameterException";
	SignUpException["InvalidPasswordException"] = "InvalidPasswordException";
	SignUpException["InvalidSmsRoleAccessPolicyException"] = "InvalidSmsRoleAccessPolicyException";
	SignUpException["InvalidSmsRoleTrustRelationshipException"] = "InvalidSmsRoleTrustRelationshipException";
	SignUpException["NotAuthorizedException"] = "NotAuthorizedException";
	SignUpException["ResourceNotFoundException"] = "ResourceNotFoundException";
	SignUpException["TooManyRequestsException"] = "TooManyRequestsException";
	SignUpException["UnexpectedLambdaException"] = "UnexpectedLambdaException";
	SignUpException["UserLambdaValidationException"] = "UserLambdaValidationException";
	SignUpException["UsernameExistsException"] = "UsernameExistsException";
})(SignUpException || (SignUpException = {}));
var UpdateUserAttributesException;
(function(UpdateUserAttributesException) {
	UpdateUserAttributesException["AliasExistsException"] = "AliasExistsException";
	UpdateUserAttributesException["CodeDeliveryFailureException"] = "CodeDeliveryFailureException";
	UpdateUserAttributesException["CodeMismatchException"] = "CodeMismatchException";
	UpdateUserAttributesException["ExpiredCodeException"] = "ExpiredCodeException";
	UpdateUserAttributesException["ForbiddenException"] = "ForbiddenException";
	UpdateUserAttributesException["InternalErrorException"] = "InternalErrorException";
	UpdateUserAttributesException["InvalidEmailRoleAccessPolicyException"] = "InvalidEmailRoleAccessPolicyException";
	UpdateUserAttributesException["InvalidLambdaResponseException"] = "InvalidLambdaResponseException";
	UpdateUserAttributesException["InvalidParameterException"] = "InvalidParameterException";
	UpdateUserAttributesException["InvalidSmsRoleAccessPolicyException"] = "InvalidSmsRoleAccessPolicyException";
	UpdateUserAttributesException["InvalidSmsRoleTrustRelationshipException"] = "InvalidSmsRoleTrustRelationshipException";
	UpdateUserAttributesException["NotAuthorizedException"] = "NotAuthorizedException";
	UpdateUserAttributesException["PasswordResetRequiredException"] = "PasswordResetRequiredException";
	UpdateUserAttributesException["ResourceNotFoundException"] = "ResourceNotFoundException";
	UpdateUserAttributesException["TooManyRequestsException"] = "TooManyRequestsException";
	UpdateUserAttributesException["UnexpectedLambdaException"] = "UnexpectedLambdaException";
	UpdateUserAttributesException["UserLambdaValidationException"] = "UserLambdaValidationException";
	UpdateUserAttributesException["UserNotConfirmedException"] = "UserNotConfirmedException";
	UpdateUserAttributesException["UserNotFoundException"] = "UserNotFoundException";
})(UpdateUserAttributesException || (UpdateUserAttributesException = {}));
var VerifySoftwareTokenException;
(function(VerifySoftwareTokenException) {
	VerifySoftwareTokenException["CodeMismatchException"] = "CodeMismatchException";
	VerifySoftwareTokenException["EnableSoftwareTokenMFAException"] = "EnableSoftwareTokenMFAException";
	VerifySoftwareTokenException["ForbiddenException"] = "ForbiddenException";
	VerifySoftwareTokenException["InternalErrorException"] = "InternalErrorException";
	VerifySoftwareTokenException["InvalidParameterException"] = "InvalidParameterException";
	VerifySoftwareTokenException["InvalidUserPoolConfigurationException"] = "InvalidUserPoolConfigurationException";
	VerifySoftwareTokenException["NotAuthorizedException"] = "NotAuthorizedException";
	VerifySoftwareTokenException["PasswordResetRequiredException"] = "PasswordResetRequiredException";
	VerifySoftwareTokenException["ResourceNotFoundException"] = "ResourceNotFoundException";
	VerifySoftwareTokenException["SoftwareTokenMFANotFoundException"] = "SoftwareTokenMFANotFoundException";
	VerifySoftwareTokenException["TooManyRequestsException"] = "TooManyRequestsException";
	VerifySoftwareTokenException["UserNotConfirmedException"] = "UserNotConfirmedException";
	VerifySoftwareTokenException["UserNotFoundException"] = "UserNotFoundException";
})(VerifySoftwareTokenException || (VerifySoftwareTokenException = {}));
var VerifyUserAttributeException;
(function(VerifyUserAttributeException) {
	VerifyUserAttributeException["AliasExistsException"] = "AliasExistsException";
	VerifyUserAttributeException["CodeMismatchException"] = "CodeMismatchException";
	VerifyUserAttributeException["ExpiredCodeException"] = "ExpiredCodeException";
	VerifyUserAttributeException["ForbiddenException"] = "ForbiddenException";
	VerifyUserAttributeException["InternalErrorException"] = "InternalErrorException";
	VerifyUserAttributeException["InvalidParameterException"] = "InvalidParameterException";
	VerifyUserAttributeException["LimitExceededException"] = "LimitExceededException";
	VerifyUserAttributeException["NotAuthorizedException"] = "NotAuthorizedException";
	VerifyUserAttributeException["PasswordResetRequiredException"] = "PasswordResetRequiredException";
	VerifyUserAttributeException["ResourceNotFoundException"] = "ResourceNotFoundException";
	VerifyUserAttributeException["TooManyRequestsException"] = "TooManyRequestsException";
	VerifyUserAttributeException["UserNotConfirmedException"] = "UserNotConfirmedException";
	VerifyUserAttributeException["UserNotFoundException"] = "UserNotFoundException";
})(VerifyUserAttributeException || (VerifyUserAttributeException = {}));
var UpdateDeviceStatusException;
(function(UpdateDeviceStatusException) {
	UpdateDeviceStatusException["ForbiddenException"] = "ForbiddenException";
	UpdateDeviceStatusException["InternalErrorException"] = "InternalErrorException";
	UpdateDeviceStatusException["InvalidParameterException"] = "InvalidParameterException";
	UpdateDeviceStatusException["InvalidUserPoolConfigurationException"] = "InvalidUserPoolConfigurationException";
	UpdateDeviceStatusException["NotAuthorizedException"] = "NotAuthorizedException";
	UpdateDeviceStatusException["PasswordResetRequiredException"] = "PasswordResetRequiredException";
	UpdateDeviceStatusException["ResourceNotFoundException"] = "ResourceNotFoundException";
	UpdateDeviceStatusException["TooManyRequestsException"] = "TooManyRequestsException";
	UpdateDeviceStatusException["UserNotConfirmedException"] = "UserNotConfirmedException";
	UpdateDeviceStatusException["UserNotFoundException"] = "UserNotFoundException";
})(UpdateDeviceStatusException || (UpdateDeviceStatusException = {}));
var ListDevicesException;
(function(ListDevicesException) {
	ListDevicesException["ForbiddenException"] = "ForbiddenException";
	ListDevicesException["InternalErrorException"] = "InternalErrorException";
	ListDevicesException["InvalidParameterException"] = "InvalidParameterException";
	ListDevicesException["InvalidUserPoolConfigurationException"] = "InvalidUserPoolConfigurationException";
	ListDevicesException["NotAuthorizedException"] = "NotAuthorizedException";
	ListDevicesException["PasswordResetRequiredException"] = "PasswordResetRequiredException";
	ListDevicesException["ResourceNotFoundException"] = "ResourceNotFoundException";
	ListDevicesException["TooManyRequestsException"] = "TooManyRequestsException";
	ListDevicesException["UserNotConfirmedException"] = "UserNotConfirmedException";
	ListDevicesException["UserNotFoundException"] = "UserNotFoundException";
})(ListDevicesException || (ListDevicesException = {}));
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/errors/constants.mjs
var USER_UNAUTHENTICATED_EXCEPTION = "UserUnAuthenticatedException";
var USER_ALREADY_AUTHENTICATED_EXCEPTION = "UserAlreadyAuthenticatedException";
var DEVICE_METADATA_NOT_FOUND_EXCEPTION = "DeviceMetadataNotFoundException";
var INVALID_REDIRECT_EXCEPTION = "InvalidRedirectException";
var INVALID_APP_SCHEME_EXCEPTION = "InvalidAppSchemeException";
var INVALID_PREFERRED_REDIRECT_EXCEPTION = "InvalidPreferredRedirectUrlException";
var invalidRedirectException = new AuthError({
	name: INVALID_REDIRECT_EXCEPTION,
	message: "signInRedirect or signOutRedirect had an invalid format or was not found.",
	recoverySuggestion: "Please make sure the signIn/Out redirect in your oauth config is valid."
});
new AuthError({
	name: INVALID_APP_SCHEME_EXCEPTION,
	message: "A valid non-http app scheme was not found in the config.",
	recoverySuggestion: "Please make sure a valid custom app scheme is present in the config."
});
var invalidPreferredRedirectUrlException = new AuthError({
	name: INVALID_PREFERRED_REDIRECT_EXCEPTION,
	message: "The given preferredRedirectUrl does not match any items in the redirectSignOutUrls array from the config.",
	recoverySuggestion: "Please make sure a matching preferredRedirectUrl is provided."
});
var invalidOriginException = new AuthError({
	name: "InvalidOriginException",
	message: "redirect is coming from a different origin. The oauth flow needs to be initiated from the same origin",
	recoverySuggestion: "Please call signInWithRedirect from the same origin."
});
var OAUTH_SIGNOUT_EXCEPTION = "OAuthSignOutException";
var TOKEN_REFRESH_EXCEPTION = "TokenRefreshException";
var UNEXPECTED_SIGN_IN_INTERRUPTION_EXCEPTION = "UnexpectedSignInInterruptionException";
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/types.mjs
function assertAuthTokens(tokens) {
	if (!tokens || !tokens.accessToken) throw new AuthError({
		name: USER_UNAUTHENTICATED_EXCEPTION,
		message: "User needs to be authenticated to call this API.",
		recoverySuggestion: "Sign in before calling this API again."
	});
}
var oAuthTokenRefreshException = new AuthError({
	name: TOKEN_REFRESH_EXCEPTION,
	message: `Token refresh is not supported when authenticated with the 'implicit grant' (token) oauth flow. 
	Please change your oauth configuration to use 'code grant' flow.`,
	recoverySuggestion: `Please logout and change your Amplify configuration to use "code grant" flow. 
	E.g { responseType: 'code' }`
});
var tokenRefreshException = new AuthError({
	name: USER_UNAUTHENTICATED_EXCEPTION,
	message: "User needs to be authenticated to call this API.",
	recoverySuggestion: "Sign in before calling this API again."
});
function assertAuthTokensWithRefreshToken(tokens) {
	if (isAuthenticatedWithImplicitOauthFlow(tokens)) throw oAuthTokenRefreshException;
	if (!isAuthenticatedWithRefreshToken(tokens)) throw tokenRefreshException;
}
function assertDeviceMetadata(deviceMetadata) {
	if (!deviceMetadata || !deviceMetadata.deviceKey || !deviceMetadata.deviceGroupKey || !deviceMetadata.randomPassword) throw new AuthError({
		name: DEVICE_METADATA_NOT_FOUND_EXCEPTION,
		message: "Either deviceKey, deviceGroupKey or secretPassword were not found during the sign-in process.",
		recoverySuggestion: "Make sure to not clear storage after calling the signIn API."
	});
}
var OAuthStorageKeys = {
	inflightOAuth: "inflightOAuth",
	oauthSignIn: "oauthSignIn",
	oauthPKCE: "oauthPKCE",
	oauthState: "oauthState"
};
function isAuthenticated(tokens) {
	return tokens?.accessToken || tokens?.idToken;
}
function isAuthenticatedWithRefreshToken(tokens) {
	return isAuthenticated(tokens) && tokens?.refreshToken;
}
function isAuthenticatedWithImplicitOauthFlow(tokens) {
	return isAuthenticated(tokens) && !tokens?.refreshToken;
}
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/apis/internal/getCurrentUser.mjs
var getCurrentUser$1 = async (amplify) => {
	const authConfig = amplify.getConfig().Auth?.Cognito;
	assertTokenProviderConfig(authConfig);
	const tokens = await amplify.Auth.getTokens({ forceRefresh: false });
	assertAuthTokens(tokens);
	const { "cognito:username": username, sub } = tokens.idToken?.payload ?? {};
	const authUser = {
		username,
		userId: sub
	};
	const signInDetails = getSignInDetailsFromTokens(tokens);
	if (signInDetails) authUser.signInDetails = signInDetails;
	return authUser;
};
function getSignInDetailsFromTokens(tokens) {
	return tokens?.signInDetails;
}
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/apis/getCurrentUser.mjs
/**
* Gets the current user from the idToken.
*
* @param input -  The GetCurrentUserInput object.
* @returns GetCurrentUserOutput
* @throws - {@link InitiateAuthException} - Thrown when the service fails to refresh the tokens.
* @throws AuthTokenConfigException - Thrown when the token provider config is invalid.
*/
var getCurrentUser = async () => {
	return getCurrentUser$1(Amplify);
};
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/utils/getAuthUserAgentValue.mjs
var getAuthUserAgentValue = (action, customUserAgentDetails) => getAmplifyUserAgent({
	category: Category.Auth,
	action,
	...customUserAgentDetails
});
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/foundation/factories/serviceClients/cognitoIdentityProvider/shared/serde/createUserPoolSerializer.mjs
var createUserPoolSerializer = (operation) => (input, endpoint) => {
	return buildHttpRpcRequest(endpoint, getSharedHeaders(operation), JSON.stringify(input));
};
var getSharedHeaders = (operation) => ({
	"content-type": "application/x-amz-json-1.1",
	"x-amz-target": `AWSCognitoIdentityProviderService.${operation}`
});
var buildHttpRpcRequest = ({ url }, headers, body) => ({
	headers,
	url,
	body,
	method: "POST"
});
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/errors/utils/assertServiceError.mjs
function assertServiceError(error) {
	if (!error || error.name === "Error" || error instanceof TypeError) throw new AuthError({
		name: AmplifyErrorCode.Unknown,
		message: "An unknown error has occurred.",
		underlyingError: error
	});
}
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/foundation/factories/serviceClients/cognitoIdentityProvider/shared/serde/createUserPoolDeserializer.mjs
var createUserPoolDeserializer = () => async (response) => {
	if (response.statusCode >= 300) {
		const error = await parseJsonError(response);
		assertServiceError(error);
		throw new AuthError({
			name: error.name,
			message: error.message,
			metadata: error.$metadata
		});
	}
	return parseJsonBody(response);
};
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/foundation/factories/serviceClients/cognitoIdentityProvider/shared/handler/cognitoUserPoolTransferHandler.mjs
/**
* A Cognito Identity-specific middleware that disables caching for all requests.
*/
var disableCacheMiddlewareFactory = () => (next, _) => async function disableCacheMiddleware(request) {
	request.headers = {
		...request.headers,
		"cache-control": "no-store",
		...await Amplify.libraryOptions?.Auth?.headers?.()
	};
	return next(request);
};
/**
* A Cognito Identity-specific transfer handler that does NOT sign requests, and
* disables caching.
*
* @internal
*/
var cognitoUserPoolTransferHandler = composeTransferHandler(unauthenticatedHandler, [disableCacheMiddlewareFactory]);
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/foundation/constants.mjs
/**
* The service name used to sign requests if the API requires authentication.
*/
var COGNITO_IDP_SERVICE_NAME = "cognito-idp";
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/foundation/factories/serviceClients/cognitoIdentityProvider/constants.mjs
var DEFAULT_SERVICE_CLIENT_API_CONFIG = {
	service: COGNITO_IDP_SERVICE_NAME,
	retryDecider: getRetryDecider(parseJsonError),
	computeDelay: jitteredBackoff,
	get userAgentValue() {
		return getAmplifyUserAgent();
	},
	cache: "no-store"
};
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/foundation/factories/serviceClients/cognitoIdentityProvider/createInitiateAuthClient.mjs
var createInitiateAuthClient = (config) => composeServiceApi(cognitoUserPoolTransferHandler, createUserPoolSerializer("InitiateAuth"), createUserPoolDeserializer(), {
	...DEFAULT_SERVICE_CLIENT_API_CONFIG,
	...config
});
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/foundation/factories/serviceClients/cognitoIdentityProvider/createRespondToAuthChallengeClient.mjs
var createRespondToAuthChallengeClient = (config) => composeServiceApi(cognitoUserPoolTransferHandler, createUserPoolSerializer("RespondToAuthChallenge"), createUserPoolDeserializer(), {
	...DEFAULT_SERVICE_CLIENT_API_CONFIG,
	...config
});
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/foundation/factories/serviceClients/cognitoIdentityProvider/createAssociateSoftwareTokenClient.mjs
var createAssociateSoftwareTokenClient = (config) => composeServiceApi(cognitoUserPoolTransferHandler, createUserPoolSerializer("AssociateSoftwareToken"), createUserPoolDeserializer(), {
	...DEFAULT_SERVICE_CLIENT_API_CONFIG,
	...config
});
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/foundation/cognitoUserPoolEndpointResolver.mjs
var cognitoUserPoolEndpointResolver = ({ region }) => ({ url: new AmplifyUrl(`https://${COGNITO_IDP_SERVICE_NAME}.${region}.${getDnsSuffix(region)}`) });
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/factories/createCognitoUserPoolEndpointResolver.mjs
var createCognitoUserPoolEndpointResolver = ({ endpointOverride }) => (input) => {
	if (endpointOverride) return { url: new AmplifyUrl(endpointOverride) };
	return cognitoUserPoolEndpointResolver(input);
};
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/foundation/factories/serviceClients/cognitoIdentityProvider/createGetTokensFromRefreshTokenClient.mjs
var createGetTokensFromRefreshTokenClient = (config) => composeServiceApi(cognitoUserPoolTransferHandler, createUserPoolSerializer("GetTokensFromRefreshToken"), createUserPoolDeserializer(), {
	...DEFAULT_SERVICE_CLIENT_API_CONFIG,
	...config
});
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/refreshAuthTokens.mjs
var refreshAuthTokensFunction = async ({ tokens, authConfig, username, clientMetadata }) => {
	assertTokenProviderConfig(authConfig?.Cognito);
	const { userPoolId, userPoolClientId, userPoolEndpoint } = authConfig.Cognito;
	const region = getRegionFromUserPoolId(userPoolId);
	assertAuthTokensWithRefreshToken(tokens);
	const { AuthenticationResult } = await createGetTokensFromRefreshTokenClient({ endpointResolver: createCognitoUserPoolEndpointResolver({ endpointOverride: userPoolEndpoint }) })({ region }, {
		ClientId: userPoolClientId,
		RefreshToken: tokens.refreshToken,
		DeviceKey: tokens.deviceMetadata?.deviceKey,
		ClientMetadata: clientMetadata
	});
	const accessToken = decodeJWT(AuthenticationResult?.AccessToken ?? "");
	const idToken = AuthenticationResult?.IdToken ? decodeJWT(AuthenticationResult.IdToken) : void 0;
	const { iat } = accessToken.payload;
	if (!iat) throw new AuthError({
		name: "iatNotFoundException",
		message: "iat not found in access token"
	});
	return {
		accessToken,
		idToken,
		clockDrift: iat * 1e3 - (/* @__PURE__ */ new Date()).getTime(),
		refreshToken: AuthenticationResult?.RefreshToken ?? tokens.refreshToken,
		username
	};
};
var refreshAuthTokens = deDupeAsyncFunction(refreshAuthTokensFunction);
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/tokenProvider/types.mjs
var AuthTokenStorageKeys = {
	accessToken: "accessToken",
	idToken: "idToken",
	oidcProvider: "oidcProvider",
	clockDrift: "clockDrift",
	refreshToken: "refreshToken",
	deviceKey: "deviceKey",
	randomPasswordKey: "randomPasswordKey",
	deviceGroupKey: "deviceGroupKey",
	signInDetails: "signInDetails",
	oauthMetadata: "oauthMetadata"
};
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/tokenProvider/errorHelpers.mjs
var TokenProviderErrorCode;
(function(TokenProviderErrorCode) {
	TokenProviderErrorCode["InvalidAuthTokens"] = "InvalidAuthTokens";
})(TokenProviderErrorCode || (TokenProviderErrorCode = {}));
var assert = createAssertionFunction({ [TokenProviderErrorCode.InvalidAuthTokens]: {
	message: "Invalid tokens.",
	recoverySuggestion: "Make sure the tokens are valid."
} });
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/tokenProvider/constants.mjs
var AUTH_KEY_PREFIX = "CognitoIdentityServiceProvider";
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/tokenProvider/TokenStore.mjs
var DefaultTokenStore = class {
	getKeyValueStorage() {
		if (!this.keyValueStorage) throw new AuthError({
			name: "KeyValueStorageNotFoundException",
			message: "KeyValueStorage was not found in TokenStore"
		});
		return this.keyValueStorage;
	}
	setKeyValueStorage(keyValueStorage) {
		this.keyValueStorage = keyValueStorage;
	}
	setAuthConfig(authConfig) {
		this.authConfig = authConfig;
	}
	async loadTokens() {
		try {
			const authKeys = await this.getAuthKeys();
			const accessTokenString = await this.getKeyValueStorage().getItem(authKeys.accessToken);
			if (!accessTokenString) throw new AuthError({
				name: "NoSessionFoundException",
				message: "Auth session was not found. Make sure to call signIn."
			});
			const accessToken = decodeJWT(accessTokenString);
			const itString = await this.getKeyValueStorage().getItem(authKeys.idToken);
			const idToken = itString ? decodeJWT(itString) : void 0;
			const refreshToken = await this.getKeyValueStorage().getItem(authKeys.refreshToken) ?? void 0;
			const clockDriftString = await this.getKeyValueStorage().getItem(authKeys.clockDrift) ?? "0";
			const clockDrift = Number.parseInt(clockDriftString);
			const signInDetails = await this.getKeyValueStorage().getItem(authKeys.signInDetails);
			const tokens = {
				accessToken,
				idToken,
				refreshToken,
				deviceMetadata: await this.getDeviceMetadata() ?? void 0,
				clockDrift,
				username: await this.getLastAuthUser()
			};
			if (signInDetails) tokens.signInDetails = JSON.parse(signInDetails);
			return tokens;
		} catch (err) {
			return null;
		}
	}
	async storeTokens(tokens) {
		assert(tokens !== void 0, TokenProviderErrorCode.InvalidAuthTokens);
		const lastAuthUser = tokens.username;
		await this.getKeyValueStorage().setItem(this.getLastAuthUserKey(), lastAuthUser);
		const authKeys = await this.getAuthKeys();
		await this.getKeyValueStorage().setItem(authKeys.accessToken, tokens.accessToken.toString());
		if (tokens.idToken) await this.getKeyValueStorage().setItem(authKeys.idToken, tokens.idToken.toString());
		else await this.getKeyValueStorage().removeItem(authKeys.idToken);
		if (tokens.refreshToken) await this.getKeyValueStorage().setItem(authKeys.refreshToken, tokens.refreshToken);
		else await this.getKeyValueStorage().removeItem(authKeys.refreshToken);
		if (tokens.deviceMetadata) {
			if (tokens.deviceMetadata.deviceKey) await this.getKeyValueStorage().setItem(authKeys.deviceKey, tokens.deviceMetadata.deviceKey);
			if (tokens.deviceMetadata.deviceGroupKey) await this.getKeyValueStorage().setItem(authKeys.deviceGroupKey, tokens.deviceMetadata.deviceGroupKey);
			await this.getKeyValueStorage().setItem(authKeys.randomPasswordKey, tokens.deviceMetadata.randomPassword);
		}
		if (tokens.signInDetails) await this.getKeyValueStorage().setItem(authKeys.signInDetails, JSON.stringify(tokens.signInDetails));
		else await this.getKeyValueStorage().removeItem(authKeys.signInDetails);
		await this.getKeyValueStorage().setItem(authKeys.clockDrift, `${tokens.clockDrift}`);
	}
	async clearTokens() {
		const authKeys = await this.getAuthKeys();
		await Promise.all([
			this.getKeyValueStorage().removeItem(authKeys.accessToken),
			this.getKeyValueStorage().removeItem(authKeys.idToken),
			this.getKeyValueStorage().removeItem(authKeys.clockDrift),
			this.getKeyValueStorage().removeItem(authKeys.refreshToken),
			this.getKeyValueStorage().removeItem(authKeys.signInDetails),
			this.getKeyValueStorage().removeItem(this.getLastAuthUserKey()),
			this.getKeyValueStorage().removeItem(authKeys.oauthMetadata)
		]);
	}
	async getDeviceMetadata(username) {
		const authKeys = await this.getAuthKeys(username);
		const deviceKey = await this.getKeyValueStorage().getItem(authKeys.deviceKey);
		const deviceGroupKey = await this.getKeyValueStorage().getItem(authKeys.deviceGroupKey);
		const randomPassword = await this.getKeyValueStorage().getItem(authKeys.randomPasswordKey);
		return randomPassword && deviceGroupKey && deviceKey ? {
			deviceKey,
			deviceGroupKey,
			randomPassword
		} : null;
	}
	async clearDeviceMetadata(username) {
		const authKeys = await this.getAuthKeys(username);
		await Promise.all([
			this.getKeyValueStorage().removeItem(authKeys.deviceKey),
			this.getKeyValueStorage().removeItem(authKeys.deviceGroupKey),
			this.getKeyValueStorage().removeItem(authKeys.randomPasswordKey)
		]);
	}
	async getAuthKeys(username) {
		assertTokenProviderConfig(this.authConfig?.Cognito);
		const lastAuthUser = username ?? await this.getLastAuthUser();
		return createKeysForAuthStorage$1(AUTH_KEY_PREFIX, `${this.authConfig.Cognito.userPoolClientId}.${lastAuthUser}`);
	}
	getLastAuthUserKey() {
		assertTokenProviderConfig(this.authConfig?.Cognito);
		return `${AUTH_KEY_PREFIX}.${this.authConfig.Cognito.userPoolClientId}.LastAuthUser`;
	}
	async getLastAuthUser() {
		return await this.getKeyValueStorage().getItem(this.getLastAuthUserKey()) ?? "username";
	}
	async setOAuthMetadata(metadata) {
		const { oauthMetadata: oauthMetadataKey } = await this.getAuthKeys();
		await this.getKeyValueStorage().setItem(oauthMetadataKey, JSON.stringify(metadata));
	}
	async getOAuthMetadata() {
		const { oauthMetadata: oauthMetadataKey } = await this.getAuthKeys();
		const oauthMetadata = await this.getKeyValueStorage().getItem(oauthMetadataKey);
		return oauthMetadata && JSON.parse(oauthMetadata);
	}
};
var createKeysForAuthStorage$1 = (provider, identifier) => {
	return getAuthStorageKeys(AuthTokenStorageKeys)(`${provider}`, identifier);
};
function getAuthStorageKeys(authKeys) {
	const keys = Object.values({ ...authKeys });
	return (prefix, identifier) => keys.reduce((acc, authKey) => ({
		...acc,
		[authKey]: `${prefix}.${identifier}.${authKey}`
	}), {});
}
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/signInWithRedirectStore.mjs
var V5_HOSTED_UI_KEY = "amplify-signin-with-hostedUI";
var name = "CognitoIdentityServiceProvider";
var DefaultOAuthStore = class {
	constructor(keyValueStorage) {
		this.keyValueStorage = keyValueStorage;
	}
	async clearOAuthInflightData() {
		assertTokenProviderConfig(this.cognitoConfig);
		const authKeys = createKeysForAuthStorage(name, this.cognitoConfig.userPoolClientId);
		await Promise.all([
			this.keyValueStorage.removeItem(authKeys.inflightOAuth),
			this.keyValueStorage.removeItem(authKeys.oauthPKCE),
			this.keyValueStorage.removeItem(authKeys.oauthState)
		]);
	}
	async clearOAuthData() {
		assertTokenProviderConfig(this.cognitoConfig);
		const authKeys = createKeysForAuthStorage(name, this.cognitoConfig.userPoolClientId);
		await this.clearOAuthInflightData();
		await this.keyValueStorage.removeItem(V5_HOSTED_UI_KEY);
		return this.keyValueStorage.removeItem(authKeys.oauthSignIn);
	}
	loadOAuthState() {
		assertTokenProviderConfig(this.cognitoConfig);
		const authKeys = createKeysForAuthStorage(name, this.cognitoConfig.userPoolClientId);
		return this.keyValueStorage.getItem(authKeys.oauthState);
	}
	storeOAuthState(state) {
		assertTokenProviderConfig(this.cognitoConfig);
		const authKeys = createKeysForAuthStorage(name, this.cognitoConfig.userPoolClientId);
		return this.keyValueStorage.setItem(authKeys.oauthState, state);
	}
	loadPKCE() {
		assertTokenProviderConfig(this.cognitoConfig);
		const authKeys = createKeysForAuthStorage(name, this.cognitoConfig.userPoolClientId);
		return this.keyValueStorage.getItem(authKeys.oauthPKCE);
	}
	storePKCE(pkce) {
		assertTokenProviderConfig(this.cognitoConfig);
		const authKeys = createKeysForAuthStorage(name, this.cognitoConfig.userPoolClientId);
		return this.keyValueStorage.setItem(authKeys.oauthPKCE, pkce);
	}
	setAuthConfig(authConfigParam) {
		this.cognitoConfig = authConfigParam;
	}
	async loadOAuthInFlight() {
		assertTokenProviderConfig(this.cognitoConfig);
		const authKeys = createKeysForAuthStorage(name, this.cognitoConfig.userPoolClientId);
		return await this.keyValueStorage.getItem(authKeys.inflightOAuth) === "true";
	}
	async storeOAuthInFlight(inflight) {
		assertTokenProviderConfig(this.cognitoConfig);
		const authKeys = createKeysForAuthStorage(name, this.cognitoConfig.userPoolClientId);
		await this.keyValueStorage.setItem(authKeys.inflightOAuth, `${inflight}`);
	}
	async loadOAuthSignIn() {
		assertTokenProviderConfig(this.cognitoConfig);
		const authKeys = createKeysForAuthStorage(name, this.cognitoConfig.userPoolClientId);
		const isLegacyHostedUISignIn = await this.keyValueStorage.getItem(V5_HOSTED_UI_KEY);
		const [isOAuthSignIn, preferPrivateSession] = (await this.keyValueStorage.getItem(authKeys.oauthSignIn))?.split(",") ?? [];
		return {
			isOAuthSignIn: isOAuthSignIn === "true" || isLegacyHostedUISignIn === "true",
			preferPrivateSession: preferPrivateSession === "true"
		};
	}
	async storeOAuthSignIn(oauthSignIn, preferPrivateSession = false) {
		assertTokenProviderConfig(this.cognitoConfig);
		const authKeys = createKeysForAuthStorage(name, this.cognitoConfig.userPoolClientId);
		await this.keyValueStorage.setItem(authKeys.oauthSignIn, `${oauthSignIn},${preferPrivateSession}`);
	}
};
var createKeysForAuthStorage = (provider, identifier) => {
	return getAuthStorageKeys(OAuthStorageKeys)(provider, identifier);
};
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/oauth/oAuthStore.mjs
var oAuthStore = new DefaultOAuthStore(defaultStorage);
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/oauth/inflightPromise.mjs
var inflightPromises = [];
var addInflightPromise = (resolver) => {
	inflightPromises.push(resolver);
};
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/tokenProvider/TokenOrchestrator.mjs
var TokenOrchestrator = class {
	constructor() {
		this.waitForInflightOAuth = isBrowser() ? async () => {
			if (!await oAuthStore.loadOAuthInFlight()) return;
			if (this.inflightPromise) return this.inflightPromise;
			this.inflightPromise = new Promise((resolve, _reject) => {
				addInflightPromise(resolve);
			});
			return this.inflightPromise;
		} : async () => {};
	}
	setAuthConfig(authConfig) {
		oAuthStore.setAuthConfig(authConfig.Cognito);
		this.authConfig = authConfig;
	}
	setTokenRefresher(tokenRefresher) {
		this.tokenRefresher = tokenRefresher;
	}
	setAuthTokenStore(tokenStore) {
		this.tokenStore = tokenStore;
	}
	getTokenStore() {
		if (!this.tokenStore) throw new AuthError({
			name: "EmptyTokenStoreException",
			message: "TokenStore not set"
		});
		return this.tokenStore;
	}
	getTokenRefresher() {
		if (!this.tokenRefresher) throw new AuthError({
			name: "EmptyTokenRefresherException",
			message: "TokenRefresher not set"
		});
		return this.tokenRefresher;
	}
	setClientMetadataProvider(clientMetadataProvider) {
		this.clientMetadataProvider = clientMetadataProvider;
	}
	async getTokens(options) {
		let tokens;
		try {
			assertTokenProviderConfig(this.authConfig?.Cognito);
		} catch (_err) {
			return null;
		}
		await this.waitForInflightOAuth();
		this.inflightPromise = void 0;
		tokens = await this.getTokenStore().loadTokens();
		const username = await this.getTokenStore().getLastAuthUser();
		if (tokens === null) return null;
		const idTokenExpired = !!tokens?.idToken && isTokenExpired({
			expiresAt: (tokens.idToken?.payload?.exp ?? 0) * 1e3,
			clockDrift: tokens.clockDrift ?? 0
		});
		const accessTokenExpired = isTokenExpired({
			expiresAt: (tokens.accessToken?.payload?.exp ?? 0) * 1e3,
			clockDrift: tokens.clockDrift ?? 0
		});
		if (options?.forceRefresh || idTokenExpired || accessTokenExpired) {
			tokens = await this.refreshTokens({
				tokens,
				username,
				clientMetadata: options?.clientMetadata ?? await this.clientMetadataProvider?.()
			});
			if (tokens === null) return null;
		}
		return {
			accessToken: tokens?.accessToken,
			idToken: tokens?.idToken,
			signInDetails: tokens?.signInDetails
		};
	}
	async refreshTokens({ tokens, username, clientMetadata }) {
		try {
			const { signInDetails } = tokens;
			const newTokens = await this.getTokenRefresher()({
				tokens,
				authConfig: this.authConfig,
				username,
				clientMetadata
			});
			newTokens.signInDetails = signInDetails;
			await this.setTokens({ tokens: newTokens });
			Hub.dispatch("auth", { event: "tokenRefresh" }, "Auth", AMPLIFY_SYMBOL);
			return newTokens;
		} catch (err) {
			return this.handleErrors(err);
		}
	}
	handleErrors(err) {
		assertServiceError(err);
		if (this.isAuthenticationError(err)) this.clearTokens();
		Hub.dispatch("auth", {
			event: "tokenRefresh_failure",
			data: { error: err }
		}, "Auth", AMPLIFY_SYMBOL);
		if (err.name.startsWith("NotAuthorizedException")) return null;
		throw err;
	}
	isAuthenticationError(err) {
		return [
			"NotAuthorizedException",
			"TokenRevokedException",
			"UserNotFoundException",
			"PasswordResetRequiredException",
			"UserNotConfirmedException",
			"RefreshTokenReuseException"
		].some((errorName) => err?.name?.startsWith?.(errorName));
	}
	async setTokens({ tokens }) {
		return this.getTokenStore().storeTokens(tokens);
	}
	async clearTokens() {
		return this.getTokenStore().clearTokens();
	}
	getDeviceMetadata(username) {
		return this.getTokenStore().getDeviceMetadata(username);
	}
	clearDeviceMetadata(username) {
		return this.getTokenStore().clearDeviceMetadata(username);
	}
	setOAuthMetadata(metadata) {
		return this.getTokenStore().setOAuthMetadata(metadata);
	}
	getOAuthMetadata() {
		return this.getTokenStore().getOAuthMetadata();
	}
};
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/tokenProvider/CognitoUserPoolsTokenProvider.mjs
var CognitoUserPoolsTokenProvider = class {
	constructor() {
		this.authTokenStore = new DefaultTokenStore();
		this.authTokenStore.setKeyValueStorage(defaultStorage);
		this.tokenOrchestrator = new TokenOrchestrator();
		this.tokenOrchestrator.setAuthTokenStore(this.authTokenStore);
		this.tokenOrchestrator.setTokenRefresher(refreshAuthTokens);
	}
	getTokens(options = {}) {
		return this.tokenOrchestrator.getTokens(options);
	}
	setKeyValueStorage(keyValueStorage) {
		this.authTokenStore.setKeyValueStorage(keyValueStorage);
	}
	setClientMetadataProvider(clientMetadataProvider) {
		this.tokenOrchestrator.setClientMetadataProvider(clientMetadataProvider);
	}
	setAuthConfig(authConfig) {
		this.authTokenStore.setAuthConfig(authConfig);
		this.tokenOrchestrator.setAuthConfig(authConfig);
	}
};
var { tokenOrchestrator } = new CognitoUserPoolsTokenProvider();
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/tokenProvider/cacheTokens.mjs
async function cacheCognitoTokens(AuthenticationResult) {
	if (AuthenticationResult.AccessToken) {
		const accessToken = decodeJWT(AuthenticationResult.AccessToken);
		const accessTokenIssuedAtInMillis = (accessToken.payload.iat || 0) * 1e3;
		const currentTime = (/* @__PURE__ */ new Date()).getTime();
		const clockDrift = accessTokenIssuedAtInMillis > 0 ? accessTokenIssuedAtInMillis - currentTime : 0;
		let idToken;
		let refreshToken;
		let deviceMetadata;
		if (AuthenticationResult.RefreshToken) refreshToken = AuthenticationResult.RefreshToken;
		if (AuthenticationResult.IdToken) idToken = decodeJWT(AuthenticationResult.IdToken);
		if (AuthenticationResult?.NewDeviceMetadata) deviceMetadata = AuthenticationResult.NewDeviceMetadata;
		const tokens = {
			accessToken,
			idToken,
			refreshToken,
			clockDrift,
			deviceMetadata,
			username: AuthenticationResult.username
		};
		if (AuthenticationResult?.signInDetails) tokens.signInDetails = AuthenticationResult.signInDetails;
		await tokenOrchestrator.setTokens({ tokens });
	} else throw new AmplifyError({
		message: "Invalid tokens",
		name: "InvalidTokens",
		recoverySuggestion: "Check Cognito UserPool settings"
	});
}
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/dispatchSignedInHubEvent.mjs
var ERROR_MESSAGE = "Unable to get user session following successful sign-in.";
var dispatchSignedInHubEvent = async () => {
	try {
		Hub.dispatch("auth", {
			event: "signedIn",
			data: await getCurrentUser()
		}, "Auth", AMPLIFY_SYMBOL);
	} catch (error) {
		if (error.name === "UserUnAuthenticatedException") throw new AuthError({
			name: UNEXPECTED_SIGN_IN_INTERRUPTION_EXCEPTION,
			message: ERROR_MESSAGE,
			recoverySuggestion: "This most likely is due to auth tokens not being persisted. If you are using cookie store, please ensure cookies can be correctly set from your server."
		});
		throw error;
	}
};
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/client/utils/store/autoSignInStore.mjs
function defaultState() {
	return { active: false };
}
var autoSignInReducer = (state, action) => {
	switch (action.type) {
		case "SET_USERNAME": return {
			...state,
			username: action.value
		};
		case "SET_SESSION": return {
			...state,
			session: action.value
		};
		case "START": return {
			...state,
			active: true
		};
		case "RESET": return defaultState();
		default: return state;
	}
};
var createAutoSignInStore = (reducer) => {
	let currentState = reducer(defaultState(), { type: "RESET" });
	return {
		getState: () => currentState,
		dispatch: (action) => {
			currentState = reducer(currentState, action);
		}
	};
};
var autoSignInStore = createAutoSignInStore(autoSignInReducer);
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/client/utils/store/signInStore.mjs
var MS_TO_EXPIRY = 180 * 1e3;
var TGT_STATE = "CognitoSignInState";
var SIGN_IN_STATE_KEYS = {
	username: `${TGT_STATE}.username`,
	challengeName: `${TGT_STATE}.challengeName`,
	signInSession: `${TGT_STATE}.signInSession`,
	expiry: `${TGT_STATE}.expiry`
};
var signInReducer = (state, action) => {
	switch (action.type) {
		case "SET_SIGN_IN_SESSION":
			persistSignInState({ signInSession: action.value });
			return {
				...state,
				signInSession: action.value
			};
		case "SET_SIGN_IN_STATE":
			persistSignInState(action.value);
			return { ...action.value };
		case "SET_CHALLENGE_NAME":
			persistSignInState({ challengeName: action.value });
			return {
				...state,
				challengeName: action.value
			};
		case "SET_USERNAME":
			persistSignInState({ username: action.value });
			return {
				...state,
				username: action.value
			};
		case "SET_INITIAL_STATE": return getInitialState();
		case "RESET_STATE":
			clearPersistedSignInState();
			return getDefaultState();
		default: return state;
	}
};
var isExpired = (expiryDate) => {
	return Number(expiryDate) <= Date.now();
};
var resetActiveSignInState = () => {
	signInStore.dispatch({ type: "RESET_STATE" });
};
var clearPersistedSignInState = () => {
	for (const stateKey of Object.values(SIGN_IN_STATE_KEYS)) syncSessionStorage.removeItem(stateKey);
};
var getDefaultState = () => ({
	username: void 0,
	challengeName: void 0,
	signInSession: void 0
});
var getInitialState = () => {
	const expiry = syncSessionStorage.getItem(SIGN_IN_STATE_KEYS.expiry);
	if (!expiry || isExpired(expiry)) {
		clearPersistedSignInState();
		return getDefaultState();
	}
	return {
		username: syncSessionStorage.getItem(SIGN_IN_STATE_KEYS.username) ?? void 0,
		challengeName: syncSessionStorage.getItem(SIGN_IN_STATE_KEYS.challengeName) ?? void 0,
		signInSession: syncSessionStorage.getItem(SIGN_IN_STATE_KEYS.signInSession) ?? void 0
	};
};
var createStore = (reducer) => {
	let currentState = reducer(getDefaultState(), { type: "SET_INITIAL_STATE" });
	return {
		getState: () => currentState,
		dispatch: (action) => {
			currentState = reducer(currentState, action);
		}
	};
};
var signInStore = createStore(signInReducer);
function setActiveSignInState(state) {
	signInStore.dispatch({
		type: "SET_SIGN_IN_STATE",
		value: state
	});
}
var persistSignInState = ({ challengeName, signInSession, username }) => {
	username && syncSessionStorage.setItem(SIGN_IN_STATE_KEYS.username, username);
	challengeName && syncSessionStorage.setItem(SIGN_IN_STATE_KEYS.challengeName, challengeName);
	if (signInSession) {
		syncSessionStorage.setItem(SIGN_IN_STATE_KEYS.signInSession, signInSession);
		syncSessionStorage.setItem(SIGN_IN_STATE_KEYS.expiry, String(Date.now() + MS_TO_EXPIRY));
	}
};
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/client/utils/passkey/errors/passkeyErrorPlatformConstants.mjs
var NOT_SUPPORTED_RECOVERY_SUGGESTION = "Passkeys may not be supported on this device. Ensure your application is running in a secure context (HTTPS) and Web Authentication API is supported.";
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/client/utils/passkey/errors/passkeyError.mjs
var PasskeyError = class PasskeyError extends AmplifyError {
	constructor(params) {
		super(params);
		this.constructor = PasskeyError;
		Object.setPrototypeOf(this, PasskeyError.prototype);
	}
};
var PasskeyErrorCode;
(function(PasskeyErrorCode) {
	PasskeyErrorCode["PasskeyNotSupported"] = "PasskeyNotSupported";
	PasskeyErrorCode["PasskeyAlreadyExists"] = "PasskeyAlreadyExists";
	PasskeyErrorCode["InvalidPasskeyRegistrationOptions"] = "InvalidPasskeyRegistrationOptions";
	PasskeyErrorCode["InvalidPasskeyAuthenticationOptions"] = "InvalidPasskeyAuthenticationOptions";
	PasskeyErrorCode["RelyingPartyMismatch"] = "RelyingPartyMismatch";
	PasskeyErrorCode["PasskeyRegistrationFailed"] = "PasskeyRegistrationFailed";
	PasskeyErrorCode["PasskeyRetrievalFailed"] = "PasskeyRetrievalFailed";
	PasskeyErrorCode["PasskeyRegistrationCanceled"] = "PasskeyRegistrationCanceled";
	PasskeyErrorCode["PasskeyAuthenticationCanceled"] = "PasskeyAuthenticationCanceled";
	PasskeyErrorCode["PasskeyOperationAborted"] = "PasskeyOperationAborted";
})(PasskeyErrorCode || (PasskeyErrorCode = {}));
var ABORT_OR_CANCEL_RECOVERY_SUGGESTION = "User may have canceled the ceremony or another interruption has occurred. Check underlying error for details.";
var MISCONFIGURATION_RECOVERY_SUGGESTION = "Ensure your user pool is configured to support the WEB_AUTHN as an authentication factor.";
var passkeyErrorMap = {
	[PasskeyErrorCode.PasskeyNotSupported]: {
		message: "Passkeys may not be supported on this device.",
		recoverySuggestion: NOT_SUPPORTED_RECOVERY_SUGGESTION
	},
	[PasskeyErrorCode.InvalidPasskeyRegistrationOptions]: {
		message: "Invalid passkey registration options.",
		recoverySuggestion: MISCONFIGURATION_RECOVERY_SUGGESTION
	},
	[PasskeyErrorCode.InvalidPasskeyAuthenticationOptions]: {
		message: "Invalid passkey authentication options.",
		recoverySuggestion: MISCONFIGURATION_RECOVERY_SUGGESTION
	},
	[PasskeyErrorCode.PasskeyRegistrationFailed]: {
		message: "Device failed to create passkey.",
		recoverySuggestion: NOT_SUPPORTED_RECOVERY_SUGGESTION
	},
	[PasskeyErrorCode.PasskeyRetrievalFailed]: {
		message: "Device failed to retrieve passkey.",
		recoverySuggestion: "Passkeys may not be available on this device. Try an alternative authentication factor like PASSWORD, EMAIL_OTP, or SMS_OTP."
	},
	[PasskeyErrorCode.PasskeyAlreadyExists]: {
		message: "Passkey already exists in authenticator.",
		recoverySuggestion: "Proceed with existing passkey or try again after deleting the credential."
	},
	[PasskeyErrorCode.PasskeyRegistrationCanceled]: {
		message: "Passkey registration ceremony has been canceled.",
		recoverySuggestion: ABORT_OR_CANCEL_RECOVERY_SUGGESTION
	},
	[PasskeyErrorCode.PasskeyAuthenticationCanceled]: {
		message: "Passkey authentication ceremony has been canceled.",
		recoverySuggestion: ABORT_OR_CANCEL_RECOVERY_SUGGESTION
	},
	[PasskeyErrorCode.PasskeyOperationAborted]: {
		message: "Passkey operation has been aborted.",
		recoverySuggestion: ABORT_OR_CANCEL_RECOVERY_SUGGESTION
	},
	[PasskeyErrorCode.RelyingPartyMismatch]: {
		message: "Relying party does not match current domain.",
		recoverySuggestion: "Ensure relying party identifier matches current domain."
	}
};
var assertPasskeyError = createAssertionFunction(passkeyErrorMap, PasskeyError);
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/client/utils/passkey/errors/handlePasskeyError.mjs
/**
* Handles Overlapping Passkey Errors Between Registration & Authentication
* https://w3c.github.io/webauthn/#sctn-create-request-exceptions
* https://w3c.github.io/webauthn/#sctn-get-request-exceptions
*
* @param err unknown
* @returns PasskeyError
*/
var handlePasskeyError = (err) => {
	if (err instanceof Error) {
		if (err.name === "AbortError") {
			const { message, recoverySuggestion } = passkeyErrorMap[PasskeyErrorCode.PasskeyOperationAborted];
			return new PasskeyError({
				name: PasskeyErrorCode.PasskeyOperationAborted,
				message,
				recoverySuggestion,
				underlyingError: err
			});
		}
		if (err.name === "SecurityError") {
			const { message, recoverySuggestion } = passkeyErrorMap[PasskeyErrorCode.RelyingPartyMismatch];
			return new PasskeyError({
				name: PasskeyErrorCode.RelyingPartyMismatch,
				message,
				recoverySuggestion,
				underlyingError: err
			});
		}
	}
	return new PasskeyError({
		name: AmplifyErrorCode.Unknown,
		message: "An unknown error has occurred.",
		underlyingError: err
	});
};
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/client/utils/passkey/errors/handlePasskeyAuthenticationError.mjs
/**
* Handle Passkey Authentication Errors
* https://w3c.github.io/webauthn/#sctn-get-request-exceptions
*
* @param err unknown
* @returns PasskeyError
*/
var handlePasskeyAuthenticationError = (err) => {
	if (err instanceof PasskeyError) return err;
	if (err instanceof Error) {
		if (err.name === "NotAllowedError") {
			const { message, recoverySuggestion } = passkeyErrorMap[PasskeyErrorCode.PasskeyAuthenticationCanceled];
			return new PasskeyError({
				name: PasskeyErrorCode.PasskeyAuthenticationCanceled,
				message,
				recoverySuggestion,
				underlyingError: err
			});
		}
	}
	return handlePasskeyError(err);
};
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/client/utils/passkey/getIsPasskeySupported.mjs
/**
* Determines if passkey is supported in current context
* Will return false if executed in non-secure context
* @returns boolean
*/
var getIsPasskeySupported = () => {
	return isBrowser() && window.isSecureContext && "credentials" in navigator && typeof window.PublicKeyCredential === "function";
};
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/foundation/convert/base64url/convertArrayBufferToBase64Url.mjs
/**
* Converts an ArrayBuffer to a base64url encoded string
* @param buffer - the ArrayBuffer instance of a Uint8Array
* @returns string - a base64url encoded string
*/
var convertArrayBufferToBase64Url = (buffer) => {
	return base64Encoder.convert(new Uint8Array(buffer), {
		urlSafe: true,
		skipPadding: true
	});
};
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/foundation/convert/base64url/convertBase64UrlToArrayBuffer.mjs
/**
* Converts a base64url encoded string to an ArrayBuffer
* @param base64url - a base64url encoded string
* @returns ArrayBuffer
*/
var convertBase64UrlToArrayBuffer = (base64url) => {
	return Uint8Array.from(base64Decoder.convert(base64url, { urlSafe: true }), (x) => x.charCodeAt(0)).buffer;
};
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/client/utils/passkey/serde.mjs
/**
* Deserializes Public Key Credential Get Options JSON
* @param input PasskeyGetOptionsJson
* @returns PublicKeyCredentialRequestOptions
*/
var deserializeJsonToPkcGetOptions = (input) => {
	const challengeBuffer = convertBase64UrlToArrayBuffer(input.challenge);
	const allowedCredentialsWithBuffer = (input.allowCredentials || []).map((allowedCred) => ({
		...allowedCred,
		id: convertBase64UrlToArrayBuffer(allowedCred.id)
	}));
	return {
		...input,
		challenge: challengeBuffer,
		allowCredentials: allowedCredentialsWithBuffer
	};
};
/**
* Serializes a Public Key Credential With Attestation to JSON
* @param input PasskeyGetResult
* @returns PasskeyGetResultJson
*/
var serializePkcWithAssertionToJson = (input) => {
	const response = {
		clientDataJSON: convertArrayBufferToBase64Url(input.response.clientDataJSON),
		authenticatorData: convertArrayBufferToBase64Url(input.response.authenticatorData),
		signature: convertArrayBufferToBase64Url(input.response.signature)
	};
	if (input.response.userHandle) response.userHandle = convertArrayBufferToBase64Url(input.response.userHandle);
	const resultJson = {
		id: input.id,
		rawId: convertArrayBufferToBase64Url(input.rawId),
		type: input.type,
		clientExtensionResults: input.getClientExtensionResults(),
		response
	};
	if (input.authenticatorAttachment) resultJson.authenticatorAttachment = input.authenticatorAttachment;
	return resultJson;
};
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/client/utils/passkey/types/index.mjs
function assertCredentialIsPkcWithAuthenticatorAssertionResponse(credential) {
	assertPasskeyError(credential && credential instanceof PublicKeyCredential && credential.response instanceof AuthenticatorAssertionResponse, PasskeyErrorCode.PasskeyRetrievalFailed);
}
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/client/utils/passkey/getPasskey.mjs
var getPasskey = async (input) => {
	try {
		assertPasskeyError(getIsPasskeySupported(), PasskeyErrorCode.PasskeyNotSupported);
		const passkeyGetOptions = deserializeJsonToPkcGetOptions(input);
		const credential = await navigator.credentials.get({ publicKey: passkeyGetOptions });
		assertCredentialIsPkcWithAuthenticatorAssertionResponse(credential);
		return serializePkcWithAssertionToJson(credential);
	} catch (err) {
		throw handlePasskeyAuthenticationError(err);
	}
};
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/foundation/factories/serviceClients/cognitoIdentityProvider/createConfirmDeviceClient.mjs
var createConfirmDeviceClient = (config) => composeServiceApi(cognitoUserPoolTransferHandler, createUserPoolSerializer("ConfirmDevice"), createUserPoolDeserializer(), {
	...DEFAULT_SERVICE_CLIENT_API_CONFIG,
	...config
});
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/textEncoder/index.mjs
var textEncoder = { convert(input) {
	return new TextEncoder().encode(input);
} };
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/srp/BigInteger/BigInteger.mjs
function BigInteger(a, b) {
	if (a != null) this.fromString(a, b);
}
function nbi() {
	return new BigInteger(null, null);
}
var dbits;
function am1(i, x, w, j, c, n) {
	while (--n >= 0) {
		const v = x * this[i++] + w[j] + c;
		c = Math.floor(v / 67108864);
		w[j++] = v & 67108863;
	}
	return c;
}
function am2(i, x, w, j, c, n) {
	const xl = x & 32767;
	const xh = x >> 15;
	while (--n >= 0) {
		let l = this[i] & 32767;
		const h = this[i++] >> 15;
		const m = xh * l + h * xl;
		l = xl * l + ((m & 32767) << 15) + w[j] + (c & 1073741823);
		c = (l >>> 30) + (m >>> 15) + xh * h + (c >>> 30);
		w[j++] = l & 1073741823;
	}
	return c;
}
function am3(i, x, w, j, c, n) {
	const xl = x & 16383;
	const xh = x >> 14;
	while (--n >= 0) {
		let l = this[i] & 16383;
		const h = this[i++] >> 14;
		const m = xh * l + h * xl;
		l = xl * l + ((m & 16383) << 14) + w[j] + c;
		c = (l >> 28) + (m >> 14) + xh * h;
		w[j++] = l & 268435455;
	}
	return c;
}
var inBrowser = typeof navigator !== "undefined";
if (inBrowser && navigator.appName === "Microsoft Internet Explorer") {
	BigInteger.prototype.am = am2;
	dbits = 30;
} else if (inBrowser && navigator.appName !== "Netscape") {
	BigInteger.prototype.am = am1;
	dbits = 26;
} else {
	BigInteger.prototype.am = am3;
	dbits = 28;
}
BigInteger.prototype.DB = dbits;
BigInteger.prototype.DM = (1 << dbits) - 1;
BigInteger.prototype.DV = 1 << dbits;
var BI_FP = 52;
BigInteger.prototype.FV = Math.pow(2, BI_FP);
BigInteger.prototype.F1 = BI_FP - dbits;
BigInteger.prototype.F2 = 2 * dbits - BI_FP;
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
var BI_RC = [];
var rr;
var vv;
rr = "0".charCodeAt(0);
for (vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
rr = "a".charCodeAt(0);
for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
rr = "A".charCodeAt(0);
for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
function int2char(n) {
	return BI_RM.charAt(n);
}
function intAt(s, i) {
	const c = BI_RC[s.charCodeAt(i)];
	return c == null ? -1 : c;
}
function bnpCopyTo(r) {
	for (let i = this.t - 1; i >= 0; --i) r[i] = this[i];
	r.t = this.t;
	r.s = this.s;
}
function bnpFromInt(x) {
	this.t = 1;
	this.s = x < 0 ? -1 : 0;
	if (x > 0) this[0] = x;
	else if (x < -1) this[0] = x + this.DV;
	else this.t = 0;
}
function nbv(i) {
	const r = nbi();
	r.fromInt(i);
	return r;
}
function bnpFromString(s, b) {
	let k;
	if (b === 16) k = 4;
	else if (b === 8) k = 3;
	else if (b === 2) k = 1;
	else if (b === 32) k = 5;
	else if (b === 4) k = 2;
	else throw new Error("Only radix 2, 4, 8, 16, 32 are supported");
	this.t = 0;
	this.s = 0;
	let i = s.length;
	let mi = false;
	let sh = 0;
	while (--i >= 0) {
		const x = intAt(s, i);
		if (x < 0) {
			if (s.charAt(i) === "-") mi = true;
			continue;
		}
		mi = false;
		if (sh === 0) this[this.t++] = x;
		else if (sh + k > this.DB) {
			this[this.t - 1] |= (x & (1 << this.DB - sh) - 1) << sh;
			this[this.t++] = x >> this.DB - sh;
		} else this[this.t - 1] |= x << sh;
		sh += k;
		if (sh >= this.DB) sh -= this.DB;
	}
	this.clamp();
	if (mi) BigInteger.ZERO.subTo(this, this);
}
function bnpClamp() {
	const c = this.s & this.DM;
	while (this.t > 0 && this[this.t - 1] == c) --this.t;
}
function bnToString(b) {
	if (this.s < 0) return "-" + this.negate().toString(b);
	let k;
	if (b == 16) k = 4;
	else if (b === 8) k = 3;
	else if (b === 2) k = 1;
	else if (b === 32) k = 5;
	else if (b === 4) k = 2;
	else throw new Error("Only radix 2, 4, 8, 16, 32 are supported");
	const km = (1 << k) - 1;
	let d;
	let m = false;
	let r = "";
	let i = this.t;
	let p = this.DB - i * this.DB % k;
	if (i-- > 0) {
		if (p < this.DB && (d = this[i] >> p) > 0) {
			m = true;
			r = int2char(d);
		}
		while (i >= 0) {
			if (p < k) {
				d = (this[i] & (1 << p) - 1) << k - p;
				d |= this[--i] >> (p += this.DB - k);
			} else {
				d = this[i] >> (p -= k) & km;
				if (p <= 0) {
					p += this.DB;
					--i;
				}
			}
			if (d > 0) m = true;
			if (m) r += int2char(d);
		}
	}
	return m ? r : "0";
}
function bnNegate() {
	const r = nbi();
	BigInteger.ZERO.subTo(this, r);
	return r;
}
function bnAbs() {
	return this.s < 0 ? this.negate() : this;
}
function bnCompareTo(a) {
	let r = this.s - a.s;
	if (r != 0) return r;
	let i = this.t;
	r = i - a.t;
	if (r != 0) return this.s < 0 ? -r : r;
	while (--i >= 0) if ((r = this[i] - a[i]) != 0) return r;
	return 0;
}
function nbits(x) {
	let r = 1;
	let t;
	if ((t = x >>> 16) !== 0) {
		x = t;
		r += 16;
	}
	if ((t = x >> 8) !== 0) {
		x = t;
		r += 8;
	}
	if ((t = x >> 4) !== 0) {
		x = t;
		r += 4;
	}
	if ((t = x >> 2) !== 0) {
		x = t;
		r += 2;
	}
	if ((t = x >> 1) !== 0) {
		x = t;
		r += 1;
	}
	return r;
}
function bnBitLength() {
	if (this.t <= 0) return 0;
	return this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ this.s & this.DM);
}
function bnpDLShiftTo(n, r) {
	let i;
	for (i = this.t - 1; i >= 0; --i) r[i + n] = this[i];
	for (i = n - 1; i >= 0; --i) r[i] = 0;
	r.t = this.t + n;
	r.s = this.s;
}
function bnpDRShiftTo(n, r) {
	for (let i = n; i < this.t; ++i) r[i - n] = this[i];
	r.t = Math.max(this.t - n, 0);
	r.s = this.s;
}
function bnpLShiftTo(n, r) {
	const bs = n % this.DB;
	const cbs = this.DB - bs;
	const bm = (1 << cbs) - 1;
	const ds = Math.floor(n / this.DB);
	let c = this.s << bs & this.DM;
	let i;
	for (i = this.t - 1; i >= 0; --i) {
		r[i + ds + 1] = this[i] >> cbs | c;
		c = (this[i] & bm) << bs;
	}
	for (i = ds - 1; i >= 0; --i) r[i] = 0;
	r[ds] = c;
	r.t = this.t + ds + 1;
	r.s = this.s;
	r.clamp();
}
function bnpRShiftTo(n, r) {
	r.s = this.s;
	const ds = Math.floor(n / this.DB);
	if (ds >= this.t) {
		r.t = 0;
		return;
	}
	const bs = n % this.DB;
	const cbs = this.DB - bs;
	const bm = (1 << bs) - 1;
	r[0] = this[ds] >> bs;
	for (let i = ds + 1; i < this.t; ++i) {
		r[i - ds - 1] |= (this[i] & bm) << cbs;
		r[i - ds] = this[i] >> bs;
	}
	if (bs > 0) r[this.t - ds - 1] |= (this.s & bm) << cbs;
	r.t = this.t - ds;
	r.clamp();
}
function bnpSubTo(a, r) {
	let i = 0;
	let c = 0;
	const m = Math.min(a.t, this.t);
	while (i < m) {
		c += this[i] - a[i];
		r[i++] = c & this.DM;
		c >>= this.DB;
	}
	if (a.t < this.t) {
		c -= a.s;
		while (i < this.t) {
			c += this[i];
			r[i++] = c & this.DM;
			c >>= this.DB;
		}
		c += this.s;
	} else {
		c += this.s;
		while (i < a.t) {
			c -= a[i];
			r[i++] = c & this.DM;
			c >>= this.DB;
		}
		c -= a.s;
	}
	r.s = c < 0 ? -1 : 0;
	if (c < -1) r[i++] = this.DV + c;
	else if (c > 0) r[i++] = c;
	r.t = i;
	r.clamp();
}
function bnpMultiplyTo(a, r) {
	const x = this.abs();
	const y = a.abs();
	let i = x.t;
	r.t = i + y.t;
	while (--i >= 0) r[i] = 0;
	for (i = 0; i < y.t; ++i) r[i + x.t] = x.am(0, y[i], r, i, 0, x.t);
	r.s = 0;
	r.clamp();
	if (this.s !== a.s) BigInteger.ZERO.subTo(r, r);
}
function bnpSquareTo(r) {
	const x = this.abs();
	let i = r.t = 2 * x.t;
	while (--i >= 0) r[i] = 0;
	for (i = 0; i < x.t - 1; ++i) {
		const c = x.am(i, x[i], r, 2 * i, 0, 1);
		if ((r[i + x.t] += x.am(i + 1, 2 * x[i], r, 2 * i + 1, c, x.t - i - 1)) >= x.DV) {
			r[i + x.t] -= x.DV;
			r[i + x.t + 1] = 1;
		}
	}
	if (r.t > 0) r[r.t - 1] += x.am(i, x[i], r, 2 * i, 0, 1);
	r.s = 0;
	r.clamp();
}
function bnpDivRemTo(m, q, r) {
	const pm = m.abs();
	if (pm.t <= 0) return;
	const pt = this.abs();
	if (pt.t < pm.t) {
		if (q != null) q.fromInt(0);
		if (r != null) this.copyTo(r);
		return;
	}
	if (r === null) r = nbi();
	const y = nbi();
	const ts = this.s;
	const ms = m.s;
	const nsh = this.DB - nbits(pm[pm.t - 1]);
	if (nsh > 0) {
		pm.lShiftTo(nsh, y);
		pt.lShiftTo(nsh, r);
	} else {
		pm.copyTo(y);
		pt.copyTo(r);
	}
	const ys = y.t;
	const y0 = y[ys - 1];
	if (y0 === 0) return;
	const yt = y0 * (1 << this.F1) + (ys > 1 ? y[ys - 2] >> this.F2 : 0);
	const d1 = this.FV / yt;
	const d2 = (1 << this.F1) / yt;
	const e = 1 << this.F2;
	let i = r.t;
	let j = i - ys;
	const t = q === null ? nbi() : q;
	y.dlShiftTo(j, t);
	if (r.compareTo(t) >= 0) {
		r[r.t++] = 1;
		r.subTo(t, r);
	}
	BigInteger.ONE.dlShiftTo(ys, t);
	t.subTo(y, y);
	while (y.t < ys) y[y.t++] = 0;
	while (--j >= 0) {
		let qd = r[--i] === y0 ? this.DM : Math.floor(r[i] * d1 + (r[i - 1] + e) * d2);
		if ((r[i] += y.am(0, qd, r, j, 0, ys)) < qd) {
			y.dlShiftTo(j, t);
			r.subTo(t, r);
			while (r[i] < --qd) r.subTo(t, r);
		}
	}
	if (q !== null) {
		r.drShiftTo(ys, q);
		if (ts !== ms) BigInteger.ZERO.subTo(q, q);
	}
	r.t = ys;
	r.clamp();
	if (nsh > 0) r.rShiftTo(nsh, r);
	if (ts < 0) BigInteger.ZERO.subTo(r, r);
}
function bnMod(a) {
	const r = nbi();
	this.abs().divRemTo(a, null, r);
	if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r, r);
	return r;
}
function bnpInvDigit() {
	if (this.t < 1) return 0;
	const x = this[0];
	if ((x & 1) === 0) return 0;
	let y = x & 3;
	y = y * (2 - (x & 15) * y) & 15;
	y = y * (2 - (x & 255) * y) & 255;
	y = y * (2 - ((x & 65535) * y & 65535)) & 65535;
	y = y * (2 - x * y % this.DV) % this.DV;
	return y > 0 ? this.DV - y : -y;
}
function bnEquals(a) {
	return this.compareTo(a) === 0;
}
function bnpAddTo(a, r) {
	let i = 0;
	let c = 0;
	const m = Math.min(a.t, this.t);
	while (i < m) {
		c += this[i] + a[i];
		r[i++] = c & this.DM;
		c >>= this.DB;
	}
	if (a.t < this.t) {
		c += a.s;
		while (i < this.t) {
			c += this[i];
			r[i++] = c & this.DM;
			c >>= this.DB;
		}
		c += this.s;
	} else {
		c += this.s;
		while (i < a.t) {
			c += a[i];
			r[i++] = c & this.DM;
			c >>= this.DB;
		}
		c += a.s;
	}
	r.s = c < 0 ? -1 : 0;
	if (c > 0) r[i++] = c;
	else if (c < -1) r[i++] = this.DV + c;
	r.t = i;
	r.clamp();
}
function bnAdd(a) {
	const r = nbi();
	this.addTo(a, r);
	return r;
}
function bnSubtract(a) {
	const r = nbi();
	this.subTo(a, r);
	return r;
}
function bnMultiply(a) {
	const r = nbi();
	this.multiplyTo(a, r);
	return r;
}
function bnDivide(a) {
	const r = nbi();
	this.divRemTo(a, r, null);
	return r;
}
function Montgomery(m) {
	this.m = m;
	this.mp = m.invDigit();
	this.mpl = this.mp & 32767;
	this.mph = this.mp >> 15;
	this.um = (1 << m.DB - 15) - 1;
	this.mt2 = 2 * m.t;
}
function montConvert(x) {
	const r = nbi();
	x.abs().dlShiftTo(this.m.t, r);
	r.divRemTo(this.m, null, r);
	if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r, r);
	return r;
}
function montRevert(x) {
	const r = nbi();
	x.copyTo(r);
	this.reduce(r);
	return r;
}
function montReduce(x) {
	while (x.t <= this.mt2) x[x.t++] = 0;
	for (let i = 0; i < this.m.t; ++i) {
		let j = x[i] & 32767;
		const u0 = j * this.mpl + ((j * this.mph + (x[i] >> 15) * this.mpl & this.um) << 15) & x.DM;
		j = i + this.m.t;
		x[j] += this.m.am(0, u0, x, i, 0, this.m.t);
		while (x[j] >= x.DV) {
			x[j] -= x.DV;
			x[++j]++;
		}
	}
	x.clamp();
	x.drShiftTo(this.m.t, x);
	if (x.compareTo(this.m) >= 0) x.subTo(this.m, x);
}
function montSqrTo(x, r) {
	x.squareTo(r);
	this.reduce(r);
}
function montMulTo(x, y, r) {
	x.multiplyTo(y, r);
	this.reduce(r);
}
Montgomery.prototype.convert = montConvert;
Montgomery.prototype.revert = montRevert;
Montgomery.prototype.reduce = montReduce;
Montgomery.prototype.mulTo = montMulTo;
Montgomery.prototype.sqrTo = montSqrTo;
function bnModPow(e, m, callback) {
	let i = e.bitLength();
	let k;
	let r = nbv(1);
	const z = new Montgomery(m);
	if (i <= 0) return r;
	else if (i < 18) k = 1;
	else if (i < 48) k = 3;
	else if (i < 144) k = 4;
	else if (i < 768) k = 5;
	else k = 6;
	const g = [];
	let n = 3;
	const k1 = k - 1;
	const km = (1 << k) - 1;
	g[1] = z.convert(this);
	if (k > 1) {
		const g2 = nbi();
		z.sqrTo(g[1], g2);
		while (n <= km) {
			g[n] = nbi();
			z.mulTo(g2, g[n - 2], g[n]);
			n += 2;
		}
	}
	let j = e.t - 1;
	let w;
	let is1 = true;
	let r2 = nbi();
	let t;
	i = nbits(e[j]) - 1;
	while (j >= 0) {
		if (i >= k1) w = e[j] >> i - k1 & km;
		else {
			w = (e[j] & (1 << i + 1) - 1) << k1 - i;
			if (j > 0) w |= e[j - 1] >> this.DB + i - k1;
		}
		n = k;
		while ((w & 1) === 0) {
			w >>= 1;
			--n;
		}
		if ((i -= n) < 0) {
			i += this.DB;
			--j;
		}
		if (is1) {
			g[w].copyTo(r);
			is1 = false;
		} else {
			while (n > 1) {
				z.sqrTo(r, r2);
				z.sqrTo(r2, r);
				n -= 2;
			}
			if (n > 0) z.sqrTo(r, r2);
			else {
				t = r;
				r = r2;
				r2 = t;
			}
			z.mulTo(r2, g[w], r);
		}
		while (j >= 0 && (e[j] & 1 << i) === 0) {
			z.sqrTo(r, r2);
			t = r;
			r = r2;
			r2 = t;
			if (--i < 0) {
				i = this.DB - 1;
				--j;
			}
		}
	}
	const result = z.revert(r);
	callback(null, result);
	return result;
}
BigInteger.prototype.copyTo = bnpCopyTo;
BigInteger.prototype.fromInt = bnpFromInt;
BigInteger.prototype.fromString = bnpFromString;
BigInteger.prototype.clamp = bnpClamp;
BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
BigInteger.prototype.drShiftTo = bnpDRShiftTo;
BigInteger.prototype.lShiftTo = bnpLShiftTo;
BigInteger.prototype.rShiftTo = bnpRShiftTo;
BigInteger.prototype.subTo = bnpSubTo;
BigInteger.prototype.multiplyTo = bnpMultiplyTo;
BigInteger.prototype.squareTo = bnpSquareTo;
BigInteger.prototype.divRemTo = bnpDivRemTo;
BigInteger.prototype.invDigit = bnpInvDigit;
BigInteger.prototype.addTo = bnpAddTo;
BigInteger.prototype.toString = bnToString;
BigInteger.prototype.negate = bnNegate;
BigInteger.prototype.abs = bnAbs;
BigInteger.prototype.compareTo = bnCompareTo;
BigInteger.prototype.bitLength = bnBitLength;
BigInteger.prototype.mod = bnMod;
BigInteger.prototype.equals = bnEquals;
BigInteger.prototype.add = bnAdd;
BigInteger.prototype.subtract = bnSubtract;
BigInteger.prototype.multiply = bnMultiply;
BigInteger.prototype.divide = bnDivide;
BigInteger.prototype.modPow = bnModPow;
BigInteger.ZERO = nbv(0);
BigInteger.ONE = nbv(1);
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/srp/calculate/calculateS.mjs
/**
* @internal
*/
var calculateS = async ({ a, g, k, x, B, N, U }) => {
	return new Promise((resolve, reject) => {
		g.modPow(x, N, (outerErr, outerResult) => {
			if (outerErr) {
				reject(outerErr);
				return;
			}
			B.subtract(k.multiply(outerResult)).modPow(a.add(U.multiply(x)), N, (innerErr, innerResult) => {
				if (innerErr) {
					reject(innerErr);
					return;
				}
				resolve(innerResult.mod(N));
			});
		});
	});
};
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/srp/constants.mjs
var INIT_N = "FFFFFFFFFFFFFFFFC90FDAA22168C234C4C6628B80DC1CD129024E088A67CC74020BBEA63B139B22514A08798E3404DDEF9519B3CD3A431B302B0A6DF25F14374FE1356D6D51C245E485B576625E7EC6F44C42E9A637ED6B0BFF5CB6F406B7EDEE386BFB5A899FA5AE9F24117C4B1FE649286651ECE45B3DC2007CB8A163BF0598DA48361C55D39A69163FA8FD24CF5F83655D23DCA3AD961C62F356208552BB9ED529077096966D670C354E4ABC9804F1746C08CA18217C32905E462E36CE3BE39E772C180E86039B2783A2EC07A28FB5C55DF06F4C52C9DE2BCBF6955817183995497CEA956AE515D2261898FA051015728E5A8AAAC42DAD33170D04507A33A85521ABDF1CBA64ECFB850458DBEF0A8AEA71575D060C7DB3970F85A6E1E4C7ABF5AE8CDB0933D71E8C94E04A25619DCEE3D2261AD2EE6BF12FFA06D98A0864D87602733EC86A64521F2B18177B200CBBE117577A615D6C770988C0BAD946E208E24FA074E5AB3143DB5BFCE0FD108E4B82D120A93AD2CAFFFFFFFFFFFFFFFF";
var SHORT_TO_HEX = {};
var HEX_TO_SHORT = {};
for (let i = 0; i < 256; i++) {
	let encodedByte = i.toString(16).toLowerCase();
	if (encodedByte.length === 1) encodedByte = `0${encodedByte}`;
	SHORT_TO_HEX[i] = encodedByte;
	HEX_TO_SHORT[encodedByte] = i;
}
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/srp/getBytesFromHex.mjs
/**
* Converts a hexadecimal encoded string to a Uint8Array of bytes.
*
* @param encoded The hexadecimal encoded string
*/
var getBytesFromHex = (encoded) => {
	if (encoded.length % 2 !== 0) throw new Error("Hex encoded strings must have an even number length");
	const out = new Uint8Array(encoded.length / 2);
	for (let i = 0; i < encoded.length; i += 2) {
		const encodedByte = encoded.slice(i, i + 2).toLowerCase();
		if (encodedByte in HEX_TO_SHORT) out[i / 2] = HEX_TO_SHORT[encodedByte];
		else throw new Error(`Cannot decode unrecognized sequence ${encodedByte} as hexadecimal`);
	}
	return out;
};
//#endregion
//#region node_modules/@aws-amplify/auth/node_modules/@aws-crypto/sha256-js/build/module/constants.js
/**
* @internal
*/
var KEY = new Uint32Array([
	1116352408,
	1899447441,
	3049323471,
	3921009573,
	961987163,
	1508970993,
	2453635748,
	2870763221,
	3624381080,
	310598401,
	607225278,
	1426881987,
	1925078388,
	2162078206,
	2614888103,
	3248222580,
	3835390401,
	4022224774,
	264347078,
	604807628,
	770255983,
	1249150122,
	1555081692,
	1996064986,
	2554220882,
	2821834349,
	2952996808,
	3210313671,
	3336571891,
	3584528711,
	113926993,
	338241895,
	666307205,
	773529912,
	1294757372,
	1396182291,
	1695183700,
	1986661051,
	2177026350,
	2456956037,
	2730485921,
	2820302411,
	3259730800,
	3345764771,
	3516065817,
	3600352804,
	4094571909,
	275423344,
	430227734,
	506948616,
	659060556,
	883997877,
	958139571,
	1322822218,
	1537002063,
	1747873779,
	1955562222,
	2024104815,
	2227730452,
	2361852424,
	2428436474,
	2756734187,
	3204031479,
	3329325298
]);
/**
* @internal
*/
var INIT = [
	1779033703,
	3144134277,
	1013904242,
	2773480762,
	1359893119,
	2600822924,
	528734635,
	1541459225
];
/**
* @internal
*/
var MAX_HASHABLE_LENGTH = Math.pow(2, 53) - 1;
//#endregion
//#region node_modules/@aws-amplify/auth/node_modules/@aws-crypto/sha256-js/build/module/RawSha256.js
/**
* @internal
*/
var RawSha256 = function() {
	function RawSha256() {
		this.state = Int32Array.from(INIT);
		this.temp = /* @__PURE__ */ new Int32Array(64);
		this.buffer = /* @__PURE__ */ new Uint8Array(64);
		this.bufferLength = 0;
		this.bytesHashed = 0;
		/**
		* @internal
		*/
		this.finished = false;
	}
	RawSha256.prototype.update = function(data) {
		if (this.finished) throw new Error("Attempted to update an already finished hash.");
		var position = 0;
		var byteLength = data.byteLength;
		this.bytesHashed += byteLength;
		if (this.bytesHashed * 8 > MAX_HASHABLE_LENGTH) throw new Error("Cannot hash more than 2^53 - 1 bits");
		while (byteLength > 0) {
			this.buffer[this.bufferLength++] = data[position++];
			byteLength--;
			if (this.bufferLength === 64) {
				this.hashBuffer();
				this.bufferLength = 0;
			}
		}
	};
	RawSha256.prototype.digest = function() {
		if (!this.finished) {
			var bitsHashed = this.bytesHashed * 8;
			var bufferView = new DataView(this.buffer.buffer, this.buffer.byteOffset, this.buffer.byteLength);
			var undecoratedLength = this.bufferLength;
			bufferView.setUint8(this.bufferLength++, 128);
			if (undecoratedLength % 64 >= 56) {
				for (var i = this.bufferLength; i < 64; i++) bufferView.setUint8(i, 0);
				this.hashBuffer();
				this.bufferLength = 0;
			}
			for (var i = this.bufferLength; i < 56; i++) bufferView.setUint8(i, 0);
			bufferView.setUint32(56, Math.floor(bitsHashed / 4294967296), true);
			bufferView.setUint32(60, bitsHashed);
			this.hashBuffer();
			this.finished = true;
		}
		var out = /* @__PURE__ */ new Uint8Array(32);
		for (var i = 0; i < 8; i++) {
			out[i * 4] = this.state[i] >>> 24 & 255;
			out[i * 4 + 1] = this.state[i] >>> 16 & 255;
			out[i * 4 + 2] = this.state[i] >>> 8 & 255;
			out[i * 4 + 3] = this.state[i] >>> 0 & 255;
		}
		return out;
	};
	RawSha256.prototype.hashBuffer = function() {
		var _a = this, buffer = _a.buffer, state = _a.state;
		var state0 = state[0], state1 = state[1], state2 = state[2], state3 = state[3], state4 = state[4], state5 = state[5], state6 = state[6], state7 = state[7];
		for (var i = 0; i < 64; i++) {
			if (i < 16) this.temp[i] = (buffer[i * 4] & 255) << 24 | (buffer[i * 4 + 1] & 255) << 16 | (buffer[i * 4 + 2] & 255) << 8 | buffer[i * 4 + 3] & 255;
			else {
				var u = this.temp[i - 2];
				var t1_1 = (u >>> 17 | u << 15) ^ (u >>> 19 | u << 13) ^ u >>> 10;
				u = this.temp[i - 15];
				var t2_1 = (u >>> 7 | u << 25) ^ (u >>> 18 | u << 14) ^ u >>> 3;
				this.temp[i] = (t1_1 + this.temp[i - 7] | 0) + (t2_1 + this.temp[i - 16] | 0);
			}
			var t1 = (((state4 >>> 6 | state4 << 26) ^ (state4 >>> 11 | state4 << 21) ^ (state4 >>> 25 | state4 << 7)) + (state4 & state5 ^ ~state4 & state6) | 0) + (state7 + (KEY[i] + this.temp[i] | 0) | 0) | 0;
			var t2 = ((state0 >>> 2 | state0 << 30) ^ (state0 >>> 13 | state0 << 19) ^ (state0 >>> 22 | state0 << 10)) + (state0 & state1 ^ state0 & state2 ^ state1 & state2) | 0;
			state7 = state6;
			state6 = state5;
			state5 = state4;
			state4 = state3 + t1 | 0;
			state3 = state2;
			state2 = state1;
			state1 = state0;
			state0 = t1 + t2 | 0;
		}
		state[0] += state0;
		state[1] += state1;
		state[2] += state2;
		state[3] += state3;
		state[4] += state4;
		state[5] += state5;
		state[6] += state6;
		state[7] += state7;
	};
	return RawSha256;
}();
//#endregion
//#region node_modules/@aws-amplify/auth/node_modules/@aws-crypto/util/build/module/convertToBuffer.js
var fromUtf8 = typeof Buffer !== "undefined" && Buffer.from ? function(input) {
	return Buffer.from(input, "utf8");
} : fromUtf8$2;
function convertToBuffer(data) {
	if (data instanceof Uint8Array) return data;
	if (typeof data === "string") return fromUtf8(data);
	if (ArrayBuffer.isView(data)) return new Uint8Array(data.buffer, data.byteOffset, data.byteLength / Uint8Array.BYTES_PER_ELEMENT);
	return new Uint8Array(data);
}
//#endregion
//#region node_modules/@aws-amplify/auth/node_modules/@aws-crypto/util/build/module/isEmptyData.js
function isEmptyData(data) {
	if (typeof data === "string") return data.length === 0;
	return data.byteLength === 0;
}
//#endregion
//#region node_modules/@aws-amplify/auth/node_modules/@aws-crypto/sha256-js/build/module/jsSha256.js
var Sha256 = function() {
	function Sha256(secret) {
		this.secret = secret;
		this.hash = new RawSha256();
		this.reset();
	}
	Sha256.prototype.update = function(toHash) {
		if (isEmptyData(toHash) || this.error) return;
		try {
			this.hash.update(convertToBuffer(toHash));
		} catch (e) {
			this.error = e;
		}
	};
	Sha256.prototype.digestSync = function() {
		if (this.error) throw this.error;
		if (this.outer) {
			if (!this.outer.finished) this.outer.update(this.hash.digest());
			return this.outer.digest();
		}
		return this.hash.digest();
	};
	Sha256.prototype.digest = function() {
		return __awaiter(this, void 0, void 0, function() {
			return __generator(this, function(_a) {
				return [2, this.digestSync()];
			});
		});
	};
	Sha256.prototype.reset = function() {
		this.hash = new RawSha256();
		if (this.secret) {
			this.outer = new RawSha256();
			var inner = bufferFromSecret(this.secret);
			var outer = /* @__PURE__ */ new Uint8Array(64);
			outer.set(inner);
			for (var i = 0; i < 64; i++) {
				inner[i] ^= 54;
				outer[i] ^= 92;
			}
			this.hash.update(inner);
			this.outer.update(outer);
			for (var i = 0; i < inner.byteLength; i++) inner[i] = 0;
		}
	};
	return Sha256;
}();
function bufferFromSecret(secret) {
	var input = convertToBuffer(secret);
	if (input.byteLength > 64) {
		var bufferHash = new RawSha256();
		bufferHash.update(input);
		input = bufferHash.digest();
	}
	var buffer = /* @__PURE__ */ new Uint8Array(64);
	buffer.set(input);
	return buffer;
}
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/srp/getHexFromBytes.mjs
/**
* Converts a Uint8Array of binary data to a hexadecimal encoded string.
*
* @param bytes The binary data to encode
*/
var getHexFromBytes = (bytes) => {
	let out = "";
	for (let i = 0; i < bytes.byteLength; i++) out += SHORT_TO_HEX[bytes[i]];
	return out;
};
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/srp/getHashFromData.mjs
/**
* Calculate a hash from a `SourceData`
* @param {SourceData} data Value to hash.
* @returns {string} Hex-encoded hash.
* @private
*/
var getHashFromData = (data) => {
	const sha256 = new Sha256();
	sha256.update(data);
	const hashHexFromUint8 = getHexFromBytes(sha256.digestSync());
	return new Array(64 - hashHexFromUint8.length).join("0") + hashHexFromUint8;
};
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/srp/getHashFromHex.mjs
/**
* Calculate a hash from a hex string
* @param {string} hexStr Value to hash.
* @returns {string} Hex-encoded hash.
* @private
*/
var getHashFromHex = (hexStr) => getHashFromData(getBytesFromHex(hexStr));
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/srp/getPaddedHex.mjs
/**
* Tests if a hex string has it most significant bit set (case-insensitive regex)
*/
var HEX_MSB_REGEX = /^[89a-f]/i;
/**
* Returns an unambiguous, even-length hex string of the two's complement encoding of an integer.
*
* It is compatible with the hex encoding of Java's BigInteger's toByteArray(), wich returns a
* byte array containing the two's-complement representation of a BigInteger. The array contains
* the minimum number of bytes required to represent the BigInteger, including at least one sign bit.
*
* Examples showing how ambiguity is avoided by left padding with:
* 	"00" (for positive values where the most-significant-bit is set)
*  "FF" (for negative values where the most-significant-bit is set)
*
* padHex(bigInteger.fromInt(-236))  === "FF14"
* padHex(bigInteger.fromInt(20))    === "14"
*
* padHex(bigInteger.fromInt(-200))  === "FF38"
* padHex(bigInteger.fromInt(56))    === "38"
*
* padHex(bigInteger.fromInt(-20))   === "EC"
* padHex(bigInteger.fromInt(236))   === "00EC"
*
* padHex(bigInteger.fromInt(-56))   === "C8"
* padHex(bigInteger.fromInt(200))   === "00C8"
*
* @param {AuthBigInteger} bigInt Number to encode.
* @returns {String} even-length hex string of the two's complement encoding.
*/
var getPaddedHex = (bigInt) => {
	if (!(bigInt instanceof BigInteger)) throw new Error("Not a BigInteger");
	const isNegative = bigInt.compareTo(BigInteger.ZERO) < 0;
	let hexStr = bigInt.abs().toString(16);
	hexStr = hexStr.length % 2 !== 0 ? `0${hexStr}` : hexStr;
	hexStr = HEX_MSB_REGEX.test(hexStr) ? `00${hexStr}` : hexStr;
	if (isNegative) {
		hexStr = new BigInteger(hexStr.split("").map((x) => {
			const invertedNibble = ~parseInt(x, 16) & 15;
			return "0123456789ABCDEF".charAt(invertedNibble);
		}).join(""), 16).add(BigInteger.ONE).toString(16);
		if (hexStr.toUpperCase().startsWith("FF8")) hexStr = hexStr.substring(2);
	}
	return hexStr;
};
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/srp/calculate/calculateU.mjs
/**
* @internal
*/
var calculateU = ({ A, B }) => {
	const U = new BigInteger(getHashFromHex(getPaddedHex(A) + getPaddedHex(B)), 16);
	if (U.equals(BigInteger.ZERO)) throw new Error("U cannot be zero.");
	return U;
};
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/srp/getHkdfKey.mjs
/**
* Standard HKDF algorithm.
*
* @param {Uint8Array} ikm Input key material.
* @param {Uint8Array} salt Salt value.
* @param {Uint8Array} info Context and application specific info.
*
* @returns {Uint8Array} Strong key material.
*
* @internal
*/
var getHkdfKey = (ikm, salt, info) => {
	const awsCryptoHash = new Sha256(salt);
	awsCryptoHash.update(ikm);
	const awsCryptoHashHmac = new Sha256(awsCryptoHash.digestSync());
	awsCryptoHashHmac.update(info);
	return awsCryptoHashHmac.digestSync().slice(0, 16);
};
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/srp/getRandomBytes.mjs
/**
* Returns a Uint8Array with a sequence of random nBytes
*
* @param {number} nBytes
* @returns {Uint8Array} fixed-length sequence of random bytes
*/
var getRandomBytes = (nBytes) => {
	return getBytesFromHex(new WordArray().random(nBytes).toString());
};
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/srp/getRandomString.mjs
/**
* Helper function to generate a random string
* @returns {string} a random value.
*
* @internal
*/
var getRandomString = () => base64Encoder.convert(getRandomBytes(40));
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/srp/AuthenticationHelper/AuthenticationHelper.mjs
/** @class */
var AuthenticationHelper = class {
	constructor({ userPoolName, a, g, A, N }) {
		this.encoder = textEncoder;
		this.userPoolName = userPoolName;
		this.a = a;
		this.g = g;
		this.A = A;
		this.N = N;
		this.k = new BigInteger(getHashFromHex(`${getPaddedHex(N)}${getPaddedHex(g)}`), 16);
	}
	/**
	* @returns {string} Generated random value included in password hash.
	*/
	getRandomPassword() {
		if (!this.randomPassword) throw new AuthError({
			name: "EmptyBigIntegerRandomPassword",
			message: "random password is empty"
		});
		return this.randomPassword;
	}
	/**
	* @returns {string} Generated random value included in devices hash.
	*/
	getSaltToHashDevices() {
		if (!this.saltToHashDevices) throw new AuthError({
			name: "EmptyBigIntegersaltToHashDevices",
			message: "saltToHashDevices is empty"
		});
		return this.saltToHashDevices;
	}
	/**
	* @returns {string} Value used to verify devices.
	*/
	getVerifierDevices() {
		if (!this.verifierDevices) throw new AuthError({
			name: "EmptyBigIntegerVerifierDevices",
			message: "verifyDevices is empty"
		});
		return this.verifierDevices;
	}
	/**
	* Generate salts and compute verifier.
	*
	* @param {string} deviceGroupKey Devices to generate verifier for.
	* @param {string} username User to generate verifier for.
	*
	* @returns {Promise<void>}
	*/
	async generateHashDevice(deviceGroupKey, username) {
		this.randomPassword = getRandomString();
		const hashedString = getHashFromData(`${deviceGroupKey}${username}:${this.randomPassword}`);
		const hexRandom = getHexFromBytes(getRandomBytes(16));
		this.saltToHashDevices = getPaddedHex(new BigInteger(hexRandom, 16));
		return new Promise((resolve, reject) => {
			this.g.modPow(new BigInteger(getHashFromHex(this.saltToHashDevices + hashedString), 16), this.N, (err, result) => {
				if (err) {
					reject(err);
					return;
				}
				this.verifierDevices = getPaddedHex(result);
				resolve();
			});
		});
	}
	/**
	* Calculates the final HKDF key based on computed S value, computed U value and the key
	*
	* @param {String} username Username.
	* @param {String} password Password.
	* @param {AuthBigInteger} B Server B value.
	* @param {AuthBigInteger} salt Generated salt.
	*/
	async getPasswordAuthenticationKey({ username, password, serverBValue, salt }) {
		if (serverBValue.mod(this.N).equals(BigInteger.ZERO)) throw new Error("B cannot be zero.");
		const U = calculateU({
			A: this.A,
			B: serverBValue
		});
		const usernamePasswordHash = getHashFromData(`${this.userPoolName}${username}:${password}`);
		const x = new BigInteger(getHashFromHex(getPaddedHex(salt) + usernamePasswordHash), 16);
		const S = await calculateS({
			a: this.a,
			g: this.g,
			k: this.k,
			x,
			B: serverBValue,
			N: this.N,
			U
		});
		const context = this.encoder.convert("Caldera Derived Key");
		const spacer = this.encoder.convert(String.fromCharCode(1));
		const info = new Uint8Array(context.byteLength + spacer.byteLength);
		info.set(context, 0);
		info.set(spacer, context.byteLength);
		return getHkdfKey(getBytesFromHex(getPaddedHex(S)), getBytesFromHex(getPaddedHex(U)), info);
	}
};
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/srp/calculate/calculateA.mjs
/**
* @internal
*/
var calculateA = async ({ a, g, N }) => {
	return new Promise((resolve, reject) => {
		g.modPow(a, N, (err, A) => {
			if (err) {
				reject(err);
				return;
			}
			if (A.mod(N).equals(BigInteger.ZERO)) {
				reject(/* @__PURE__ */ new Error("Illegal parameter. A mod N cannot be 0."));
				return;
			}
			resolve(A);
		});
	});
};
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/srp/getAuthenticationHelper.mjs
/**
* Returns a new {@link AuthenticationHelper} instance with randomly generated BigInteger seed
*
* @param userPoolName Cognito user pool name.
* @returns An {@link AuthenticationHelper} instance.
*
* @internal
*/
var getAuthenticationHelper = async (userPoolName) => {
	const N = new BigInteger(INIT_N, 16);
	const g = new BigInteger("2", 16);
	const a = generateRandomBigInteger();
	return new AuthenticationHelper({
		userPoolName,
		a,
		g,
		A: await calculateA({
			a,
			g,
			N
		}),
		N
	});
};
/**
* Generates a random BigInteger.
*
* @returns {BigInteger} a random value.
*/
var generateRandomBigInteger = () => {
	return new BigInteger(getHexFromBytes(getRandomBytes(128)), 16);
};
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/getNewDeviceMetadata.mjs
/**
* This function is used to kick off the device management flow.
*
* If an error is thrown while generating a hash device or calling the `ConfirmDevice`
* client, then this API will ignore the error and return undefined. Otherwise the authentication
* flow will not complete and the user won't be able to be signed in.
*
* @returns DeviceMetadata | undefined
*/
async function getNewDeviceMetadata({ userPoolId, userPoolEndpoint, newDeviceMetadata, accessToken }) {
	if (!newDeviceMetadata) return void 0;
	const authenticationHelper = await getAuthenticationHelper(userPoolId.split("_")[1] || "");
	const deviceKey = newDeviceMetadata?.DeviceKey;
	const deviceGroupKey = newDeviceMetadata?.DeviceGroupKey;
	try {
		await authenticationHelper.generateHashDevice(deviceGroupKey ?? "", deviceKey ?? "");
	} catch (errGenHash) {
		return;
	}
	const deviceSecretVerifierConfig = {
		Salt: base64Encoder.convert(getBytesFromHex(authenticationHelper.getSaltToHashDevices())),
		PasswordVerifier: base64Encoder.convert(getBytesFromHex(authenticationHelper.getVerifierDevices()))
	};
	const randomPassword = authenticationHelper.getRandomPassword();
	try {
		await createConfirmDeviceClient({ endpointResolver: createCognitoUserPoolEndpointResolver({ endpointOverride: userPoolEndpoint }) })({ region: getRegionFromUserPoolId(userPoolId) }, {
			AccessToken: accessToken,
			DeviceName: await getDeviceName(),
			DeviceKey: newDeviceMetadata?.DeviceKey,
			DeviceSecretVerifierConfig: deviceSecretVerifierConfig
		});
		return {
			deviceKey,
			deviceGroupKey,
			randomPassword
		};
	} catch (error) {
		return;
	}
}
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/client/flows/userAuth/handleWebAuthnSignInResult.mjs
async function handleWebAuthnSignInResult(challengeParameters) {
	const authConfig = Amplify.getConfig().Auth?.Cognito;
	assertTokenProviderConfig(authConfig);
	const { username, signInSession, signInDetails, challengeName } = signInStore.getState();
	if (challengeName !== "WEB_AUTHN" || !username) throw new AuthError({
		name: AuthErrorCodes.SignInException,
		message: "Unable to proceed due to invalid sign in state."
	});
	const { CREDENTIAL_REQUEST_OPTIONS: credentialRequestOptions } = challengeParameters;
	assertPasskeyError(!!credentialRequestOptions, PasskeyErrorCode.InvalidPasskeyAuthenticationOptions);
	const cred = await getPasskey(JSON.parse(credentialRequestOptions));
	const { ChallengeName: nextChallengeName, ChallengeParameters: nextChallengeParameters, AuthenticationResult: authenticationResult, Session: nextSession } = await createRespondToAuthChallengeClient({ endpointResolver: createCognitoUserPoolEndpointResolver({ endpointOverride: authConfig.userPoolEndpoint }) })({
		region: getRegionFromUserPoolId(authConfig.userPoolId),
		userAgentValue: getAuthUserAgentValue(AuthAction.ConfirmSignIn)
	}, {
		ChallengeName: "WEB_AUTHN",
		ChallengeResponses: {
			USERNAME: username,
			CREDENTIAL: JSON.stringify(cred)
		},
		ClientId: authConfig.userPoolClientId,
		Session: signInSession
	});
	setActiveSignInState({
		signInSession: nextSession,
		username,
		challengeName: nextChallengeName,
		signInDetails
	});
	if (authenticationResult) {
		await cacheCognitoTokens({
			...authenticationResult,
			username,
			NewDeviceMetadata: await getNewDeviceMetadata({
				userPoolId: authConfig.userPoolId,
				userPoolEndpoint: authConfig.userPoolEndpoint,
				newDeviceMetadata: authenticationResult.NewDeviceMetadata,
				accessToken: authenticationResult.AccessToken
			}),
			signInDetails
		});
		signInStore.dispatch({ type: "RESET_STATE" });
		await dispatchSignedInHubEvent();
		return {
			isSignedIn: true,
			nextStep: { signInStep: "DONE" }
		};
	}
	if (nextChallengeName === "WEB_AUTHN") throw new AuthError({
		name: AuthErrorCodes.SignInException,
		message: "Sequential WEB_AUTHN challenges returned from underlying service cannot be handled."
	});
	return {
		challengeName: nextChallengeName,
		challengeParameters: nextChallengeParameters
	};
}
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/userContextData.mjs
function getUserContextData({ username, userPoolId, userPoolClientId }) {
	if (typeof window === "undefined") return;
	const amazonCognitoAdvancedSecurityData = window.AmazonCognitoAdvancedSecurityData;
	if (typeof amazonCognitoAdvancedSecurityData === "undefined") return;
	const advancedSecurityData = amazonCognitoAdvancedSecurityData.getData(username, userPoolId, userPoolClientId);
	if (advancedSecurityData) return { EncodedData: advancedSecurityData };
	return {};
}
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/srp/getNowString.mjs
var MONTH_NAMES = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec"
];
var WEEK_NAMES = [
	"Sun",
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat"
];
var getNowString = () => {
	const now = /* @__PURE__ */ new Date();
	const weekDay = WEEK_NAMES[now.getUTCDay()];
	const month = MONTH_NAMES[now.getUTCMonth()];
	const day = now.getUTCDate();
	let hours = now.getUTCHours();
	if (hours < 10) hours = `0${hours}`;
	let minutes = now.getUTCMinutes();
	if (minutes < 10) minutes = `0${minutes}`;
	let seconds = now.getUTCSeconds();
	if (seconds < 10) seconds = `0${seconds}`;
	const year = now.getUTCFullYear();
	return `${weekDay} ${month} ${day} ${hours}:${minutes}:${seconds} UTC ${year}`;
};
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/srp/getSignatureString.mjs
var getSignatureString = ({ userPoolName, username, challengeParameters, dateNow, hkdf }) => {
	const bufUPIDaToB = textEncoder.convert(userPoolName);
	const bufUNaToB = textEncoder.convert(username);
	const bufSBaToB = urlB64ToUint8Array(challengeParameters.SECRET_BLOCK);
	const bufDNaToB = textEncoder.convert(dateNow);
	const bufConcat = new Uint8Array(bufUPIDaToB.byteLength + bufUNaToB.byteLength + bufSBaToB.byteLength + bufDNaToB.byteLength);
	bufConcat.set(bufUPIDaToB, 0);
	bufConcat.set(bufUNaToB, bufUPIDaToB.byteLength);
	bufConcat.set(bufSBaToB, bufUPIDaToB.byteLength + bufUNaToB.byteLength);
	bufConcat.set(bufDNaToB, bufUPIDaToB.byteLength + bufUNaToB.byteLength + bufSBaToB.byteLength);
	const awsCryptoHash = new Sha256(hkdf);
	awsCryptoHash.update(bufConcat);
	const resultFromAWSCrypto = awsCryptoHash.digestSync();
	return base64Encoder.convert(resultFromAWSCrypto);
};
var urlB64ToUint8Array = (base64String) => {
	const base64 = (base64String + "=".repeat((4 - base64String.length % 4) % 4)).replace(/-/g, "+").replace(/_/g, "/");
	const rawData = base64Decoder.convert(base64);
	const outputArray = new Uint8Array(rawData.length);
	for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
	return outputArray;
};
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/handleDeviceSRPAuth.mjs
async function handleDeviceSRPAuth({ username, config, clientMetadata, session, tokenOrchestrator }) {
	const { userPoolId, userPoolEndpoint } = config;
	const clientId = config.userPoolClientId;
	const deviceMetadata = await tokenOrchestrator?.getDeviceMetadata(username);
	assertDeviceMetadata(deviceMetadata);
	const authenticationHelper = await getAuthenticationHelper(deviceMetadata.deviceGroupKey);
	const jsonReqResponseChallenge = {
		ChallengeName: "DEVICE_SRP_AUTH",
		ClientId: clientId,
		ChallengeResponses: {
			USERNAME: username,
			SRP_A: authenticationHelper.A.toString(16),
			DEVICE_KEY: deviceMetadata.deviceKey
		},
		ClientMetadata: clientMetadata,
		Session: session
	};
	const { ChallengeParameters: respondedChallengeParameters, Session } = await createRespondToAuthChallengeClient({ endpointResolver: createCognitoUserPoolEndpointResolver({ endpointOverride: userPoolEndpoint }) })({ region: getRegionFromUserPoolId(userPoolId) }, jsonReqResponseChallenge);
	return handleDevicePasswordVerifier(username, respondedChallengeParameters, clientMetadata, Session, authenticationHelper, config, tokenOrchestrator);
}
async function handleDevicePasswordVerifier(username, challengeParameters, clientMetadata, session, authenticationHelper, { userPoolId, userPoolClientId, userPoolEndpoint }, tokenOrchestrator) {
	const deviceMetadata = await tokenOrchestrator?.getDeviceMetadata(username);
	assertDeviceMetadata(deviceMetadata);
	const serverBValue = new BigInteger(challengeParameters?.SRP_B, 16);
	const salt = new BigInteger(challengeParameters?.SALT, 16);
	const { deviceKey } = deviceMetadata;
	const { deviceGroupKey } = deviceMetadata;
	const hkdf = await authenticationHelper.getPasswordAuthenticationKey({
		username: deviceMetadata.deviceKey,
		password: deviceMetadata.randomPassword,
		serverBValue,
		salt
	});
	const dateNow = getNowString();
	const jsonReqResponseChallenge = {
		ChallengeName: "DEVICE_PASSWORD_VERIFIER",
		ClientId: userPoolClientId,
		ChallengeResponses: {
			USERNAME: challengeParameters?.USERNAME ?? username,
			PASSWORD_CLAIM_SECRET_BLOCK: challengeParameters?.SECRET_BLOCK,
			TIMESTAMP: dateNow,
			PASSWORD_CLAIM_SIGNATURE: getSignatureString({
				username: deviceKey,
				userPoolName: deviceGroupKey,
				challengeParameters,
				dateNow,
				hkdf
			}),
			DEVICE_KEY: deviceKey
		},
		Session: session,
		ClientMetadata: clientMetadata,
		UserContextData: getUserContextData({
			username,
			userPoolId,
			userPoolClientId
		})
	};
	return createRespondToAuthChallengeClient({ endpointResolver: createCognitoUserPoolEndpointResolver({ endpointOverride: userPoolEndpoint }) })({ region: getRegionFromUserPoolId(userPoolId) }, jsonReqResponseChallenge);
}
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/handlePasswordVerifierChallenge.mjs
async function handlePasswordVerifierChallenge(password, challengeParameters, clientMetadata, session, authenticationHelper, config, tokenOrchestrator) {
	const { userPoolId, userPoolClientId, userPoolEndpoint } = config;
	const userPoolName = userPoolId?.split("_")[1] || "";
	const serverBValue = new BigInteger(challengeParameters?.SRP_B, 16);
	const salt = new BigInteger(challengeParameters?.SALT, 16);
	const username = challengeParameters?.USER_ID_FOR_SRP;
	if (!username) throw new AuthError({
		name: "EmptyUserIdForSRPException",
		message: "USER_ID_FOR_SRP was not found in challengeParameters"
	});
	const hkdf = await authenticationHelper.getPasswordAuthenticationKey({
		username,
		password,
		serverBValue,
		salt
	});
	const dateNow = getNowString();
	const challengeResponses = {
		USERNAME: username,
		PASSWORD_CLAIM_SECRET_BLOCK: challengeParameters?.SECRET_BLOCK,
		TIMESTAMP: dateNow,
		PASSWORD_CLAIM_SIGNATURE: getSignatureString({
			username,
			userPoolName,
			challengeParameters,
			dateNow,
			hkdf
		})
	};
	const deviceMetadata = await tokenOrchestrator.getDeviceMetadata(username);
	if (deviceMetadata && deviceMetadata.deviceKey) challengeResponses.DEVICE_KEY = deviceMetadata.deviceKey;
	const jsonReqResponseChallenge = {
		ChallengeName: "PASSWORD_VERIFIER",
		ChallengeResponses: challengeResponses,
		ClientMetadata: clientMetadata,
		Session: session,
		ClientId: userPoolClientId,
		UserContextData: getUserContextData({
			username,
			userPoolId,
			userPoolClientId
		})
	};
	const response = await createRespondToAuthChallengeClient({ endpointResolver: createCognitoUserPoolEndpointResolver({ endpointOverride: userPoolEndpoint }) })({ region: getRegionFromUserPoolId(userPoolId) }, jsonReqResponseChallenge);
	if (response.ChallengeName === "DEVICE_SRP_AUTH") return handleDeviceSRPAuth({
		username,
		config,
		clientMetadata,
		session: response.Session,
		tokenOrchestrator
	});
	return response;
}
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/retryOnResourceNotFoundException.mjs
/**
* It will retry the function if the error is a `ResourceNotFoundException` and
* will clean the device keys stored in the storage mechanism.
*
*/
async function retryOnResourceNotFoundException(func, args, username, tokenOrchestrator) {
	try {
		return await func(...args);
	} catch (error) {
		if (error instanceof AuthError && error.name === "ResourceNotFoundException" && error.message.includes("Device does not exist.")) {
			await tokenOrchestrator.clearDeviceMetadata(username);
			return func(...args);
		}
		throw error;
	}
}
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/setActiveSignInUsername.mjs
function setActiveSignInUsername(username) {
	const { dispatch } = signInStore;
	dispatch({
		type: "SET_USERNAME",
		value: username
	});
}
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/client/flows/shared/handlePasswordSRP.mjs
/**
* Handles the Password SRP (Secure Remote Password) authentication flow.
* This function can be used with both USER_SRP_AUTH and USER_AUTH flows.
*
* @param {Object} params - The parameters for the Password SRP authentication
* @param {string} params.username - The username for authentication
* @param {string} params.password - The user's password
* @param {ClientMetadata} [params.clientMetadata] - Optional metadata to be sent with auth requests
* @param {CognitoUserPoolConfig} params.config - Cognito User Pool configuration
* @param {AuthTokenOrchestrator} params.tokenOrchestrator - Token orchestrator for managing auth tokens
* @param {AuthFlowType} params.authFlow - The type of authentication flow ('USER_SRP_AUTH' or 'USER_AUTH')
* @param {AuthFactorType} [params.preferredChallenge] - Optional preferred challenge type when using USER_AUTH flow
*
* @returns {Promise<RespondToAuthChallengeCommandOutput>} The authentication response
*/
async function handlePasswordSRP({ username, password, clientMetadata, config, tokenOrchestrator, authFlow, preferredChallenge }) {
	const { userPoolId, userPoolClientId, userPoolEndpoint } = config;
	const authenticationHelper = await getAuthenticationHelper(userPoolId?.split("_")[1] || "");
	const authParameters = {
		USERNAME: username,
		SRP_A: authenticationHelper.A.toString(16)
	};
	if (authFlow === "USER_AUTH" && preferredChallenge) authParameters.PREFERRED_CHALLENGE = preferredChallenge;
	const jsonReq = {
		AuthFlow: authFlow,
		AuthParameters: authParameters,
		ClientMetadata: clientMetadata,
		ClientId: userPoolClientId,
		UserContextData: getUserContextData({
			username,
			userPoolId,
			userPoolClientId
		})
	};
	const resp = await createInitiateAuthClient({ endpointResolver: createCognitoUserPoolEndpointResolver({ endpointOverride: userPoolEndpoint }) })({
		region: getRegionFromUserPoolId(userPoolId),
		userAgentValue: getAuthUserAgentValue(AuthAction.SignIn)
	}, jsonReq);
	const { ChallengeParameters: challengeParameters, Session: session } = resp;
	const activeUsername = challengeParameters?.USERNAME ?? username;
	setActiveSignInUsername(activeUsername);
	if (resp.ChallengeName === "PASSWORD_VERIFIER") return retryOnResourceNotFoundException(handlePasswordVerifierChallenge, [
		password,
		challengeParameters,
		clientMetadata,
		session,
		authenticationHelper,
		config,
		tokenOrchestrator
	], activeUsername, tokenOrchestrator);
	return resp;
}
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/signInHelpers.mjs
var USER_ATTRIBUTES = "userAttributes.";
function isWebAuthnResultAuthSignInOutput(result) {
	return "isSignedIn" in result && "nextStep" in result;
}
async function handleUserPasswordAuthFlow(username, password, clientMetadata, config, tokenOrchestrator) {
	const { userPoolClientId, userPoolId, userPoolEndpoint } = config;
	const authParameters = {
		USERNAME: username,
		PASSWORD: password
	};
	const deviceMetadata = await tokenOrchestrator.getDeviceMetadata(username);
	if (deviceMetadata && deviceMetadata.deviceKey) authParameters.DEVICE_KEY = deviceMetadata.deviceKey;
	const jsonReq = {
		AuthFlow: "USER_PASSWORD_AUTH",
		AuthParameters: authParameters,
		ClientMetadata: clientMetadata,
		ClientId: userPoolClientId,
		UserContextData: getUserContextData({
			username,
			userPoolId,
			userPoolClientId
		})
	};
	const response = await createInitiateAuthClient({ endpointResolver: createCognitoUserPoolEndpointResolver({ endpointOverride: userPoolEndpoint }) })({
		region: getRegionFromUserPoolId(userPoolId),
		userAgentValue: getAuthUserAgentValue(AuthAction.SignIn)
	}, jsonReq);
	const activeUsername = response.ChallengeParameters?.USERNAME ?? response.ChallengeParameters?.USER_ID_FOR_SRP ?? username;
	setActiveSignInUsername(activeUsername);
	if (response.ChallengeName === "DEVICE_SRP_AUTH") return handleDeviceSRPAuth({
		username: activeUsername,
		config,
		clientMetadata,
		session: response.Session,
		tokenOrchestrator
	});
	return response;
}
async function handleUserSRPAuthFlow(username, password, clientMetadata, config, tokenOrchestrator) {
	return handlePasswordSRP({
		username,
		password,
		clientMetadata,
		config,
		tokenOrchestrator,
		authFlow: "USER_SRP_AUTH"
	});
}
async function handleCustomAuthFlowWithoutSRP(username, clientMetadata, config, tokenOrchestrator) {
	const { userPoolClientId, userPoolId, userPoolEndpoint } = config;
	const authParameters = { USERNAME: username };
	const deviceMetadata = await tokenOrchestrator.getDeviceMetadata(username);
	if (deviceMetadata && deviceMetadata.deviceKey) authParameters.DEVICE_KEY = deviceMetadata.deviceKey;
	const jsonReq = {
		AuthFlow: "CUSTOM_AUTH",
		AuthParameters: authParameters,
		ClientMetadata: clientMetadata,
		ClientId: userPoolClientId,
		UserContextData: getUserContextData({
			username,
			userPoolId,
			userPoolClientId
		})
	};
	const response = await createInitiateAuthClient({ endpointResolver: createCognitoUserPoolEndpointResolver({ endpointOverride: userPoolEndpoint }) })({
		region: getRegionFromUserPoolId(userPoolId),
		userAgentValue: getAuthUserAgentValue(AuthAction.SignIn)
	}, jsonReq);
	const activeUsername = response.ChallengeParameters?.USERNAME ?? username;
	setActiveSignInUsername(activeUsername);
	if (response.ChallengeName === "DEVICE_SRP_AUTH") return handleDeviceSRPAuth({
		username: activeUsername,
		config,
		clientMetadata,
		session: response.Session,
		tokenOrchestrator
	});
	return response;
}
async function handleCustomSRPAuthFlow(username, password, clientMetadata, config, tokenOrchestrator) {
	assertTokenProviderConfig(config);
	const { userPoolId, userPoolClientId, userPoolEndpoint } = config;
	const authenticationHelper = await getAuthenticationHelper(userPoolId?.split("_")[1] || "");
	const jsonReq = {
		AuthFlow: "CUSTOM_AUTH",
		AuthParameters: {
			USERNAME: username,
			SRP_A: authenticationHelper.A.toString(16),
			CHALLENGE_NAME: "SRP_A"
		},
		ClientMetadata: clientMetadata,
		ClientId: userPoolClientId,
		UserContextData: getUserContextData({
			username,
			userPoolId,
			userPoolClientId
		})
	};
	const { ChallengeParameters: challengeParameters, Session: session } = await createInitiateAuthClient({ endpointResolver: createCognitoUserPoolEndpointResolver({ endpointOverride: userPoolEndpoint }) })({
		region: getRegionFromUserPoolId(userPoolId),
		userAgentValue: getAuthUserAgentValue(AuthAction.SignIn)
	}, jsonReq);
	const activeUsername = challengeParameters?.USERNAME ?? username;
	setActiveSignInUsername(activeUsername);
	return retryOnResourceNotFoundException(handlePasswordVerifierChallenge, [
		password,
		challengeParameters,
		clientMetadata,
		session,
		authenticationHelper,
		config,
		tokenOrchestrator
	], activeUsername, tokenOrchestrator);
}
async function getSignInResult(params) {
	const { challengeName, challengeParameters, availableChallenges } = params;
	const authConfig = Amplify.getConfig().Auth?.Cognito;
	assertTokenProviderConfig(authConfig);
	switch (challengeName) {
		case "CUSTOM_CHALLENGE": return {
			isSignedIn: false,
			nextStep: {
				signInStep: "CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE",
				additionalInfo: challengeParameters
			}
		};
		case "MFA_SETUP": {
			const { signInSession, username } = signInStore.getState();
			const mfaSetupTypes = getMFATypes(parseMFATypes(challengeParameters.MFAS_CAN_SETUP)) || [];
			const allowedMfaSetupTypes = getAllowedMfaSetupTypes(mfaSetupTypes);
			const isTotpMfaSetupAvailable = allowedMfaSetupTypes.includes("TOTP");
			const isEmailMfaSetupAvailable = allowedMfaSetupTypes.includes("EMAIL");
			if (isTotpMfaSetupAvailable && isEmailMfaSetupAvailable) return {
				isSignedIn: false,
				nextStep: {
					signInStep: "CONTINUE_SIGN_IN_WITH_MFA_SETUP_SELECTION",
					allowedMFATypes: allowedMfaSetupTypes
				}
			};
			if (isEmailMfaSetupAvailable) return {
				isSignedIn: false,
				nextStep: { signInStep: "CONTINUE_SIGN_IN_WITH_EMAIL_SETUP" }
			};
			if (isTotpMfaSetupAvailable) {
				const { Session, SecretCode: secretCode } = await createAssociateSoftwareTokenClient({ endpointResolver: createCognitoUserPoolEndpointResolver({ endpointOverride: authConfig.userPoolEndpoint }) })({ region: getRegionFromUserPoolId(authConfig.userPoolId) }, { Session: signInSession });
				signInStore.dispatch({
					type: "SET_SIGN_IN_SESSION",
					value: Session
				});
				return {
					isSignedIn: false,
					nextStep: {
						signInStep: "CONTINUE_SIGN_IN_WITH_TOTP_SETUP",
						totpSetupDetails: getTOTPSetupDetails(secretCode, username)
					}
				};
			}
			throw new AuthError({
				name: AuthErrorCodes.SignInException,
				message: `Cannot initiate MFA setup from available types: ${mfaSetupTypes}`
			});
		}
		case "NEW_PASSWORD_REQUIRED": return {
			isSignedIn: false,
			nextStep: {
				signInStep: "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED",
				missingAttributes: parseAttributes(challengeParameters.requiredAttributes)
			}
		};
		case "SELECT_MFA_TYPE": return {
			isSignedIn: false,
			nextStep: {
				signInStep: "CONTINUE_SIGN_IN_WITH_MFA_SELECTION",
				allowedMFATypes: getMFATypes(parseMFATypes(challengeParameters.MFAS_CAN_CHOOSE))
			}
		};
		case "SMS_OTP":
		case "SMS_MFA": return {
			isSignedIn: false,
			nextStep: {
				signInStep: "CONFIRM_SIGN_IN_WITH_SMS_CODE",
				codeDeliveryDetails: {
					deliveryMedium: challengeParameters.CODE_DELIVERY_DELIVERY_MEDIUM,
					destination: challengeParameters.CODE_DELIVERY_DESTINATION
				}
			}
		};
		case "SOFTWARE_TOKEN_MFA": return {
			isSignedIn: false,
			nextStep: { signInStep: "CONFIRM_SIGN_IN_WITH_TOTP_CODE" }
		};
		case "EMAIL_OTP": return {
			isSignedIn: false,
			nextStep: {
				signInStep: "CONFIRM_SIGN_IN_WITH_EMAIL_CODE",
				codeDeliveryDetails: {
					deliveryMedium: challengeParameters.CODE_DELIVERY_DELIVERY_MEDIUM,
					destination: challengeParameters.CODE_DELIVERY_DESTINATION
				}
			}
		};
		case "WEB_AUTHN": {
			const result = await handleWebAuthnSignInResult(challengeParameters);
			if (isWebAuthnResultAuthSignInOutput(result)) return result;
			return getSignInResult(result);
		}
		case "PASSWORD":
		case "PASSWORD_SRP": return {
			isSignedIn: false,
			nextStep: { signInStep: "CONFIRM_SIGN_IN_WITH_PASSWORD" }
		};
		case "SELECT_CHALLENGE": return {
			isSignedIn: false,
			nextStep: {
				signInStep: "CONTINUE_SIGN_IN_WITH_FIRST_FACTOR_SELECTION",
				availableChallenges
			}
		};
	}
	throw new AuthError({
		name: AuthErrorCodes.SignInException,
		message: `An error occurred during the sign in process. ${challengeName} challengeName returned by the underlying service was not addressed.`
	});
}
function getTOTPSetupDetails(secretCode, username) {
	return {
		sharedSecret: secretCode,
		getSetupUri: (appName, accountName) => {
			return new AmplifyUrl(`otpauth://totp/${appName}:${accountName ?? username}?secret=${secretCode}&issuer=${appName}`);
		}
	};
}
function getSignInResultFromError(errorName) {
	if (errorName === InitiateAuthException.PasswordResetRequiredException) return {
		isSignedIn: false,
		nextStep: { signInStep: "RESET_PASSWORD" }
	};
	else if (errorName === InitiateAuthException.UserNotConfirmedException) return {
		isSignedIn: false,
		nextStep: { signInStep: "CONFIRM_SIGN_UP" }
	};
}
function parseAttributes(attributes) {
	if (!attributes) return [];
	return JSON.parse(attributes).map((att) => att.includes(USER_ATTRIBUTES) ? att.replace(USER_ATTRIBUTES, "") : att);
}
function getMFAType(type) {
	if (type === "SMS_MFA") return "SMS";
	if (type === "SOFTWARE_TOKEN_MFA") return "TOTP";
	if (type === "EMAIL_OTP") return "EMAIL";
}
function getMFATypes(types) {
	if (!types) return void 0;
	return types.map(getMFAType).filter(Boolean);
}
function parseMFATypes(mfa) {
	if (!mfa) return [];
	return JSON.parse(mfa);
}
function getAllowedMfaSetupTypes(availableMfaSetupTypes) {
	return availableMfaSetupTypes.filter((authMfaType) => authMfaType === "EMAIL" || authMfaType === "TOTP");
}
async function assertUserNotAuthenticated() {
	let authUser;
	try {
		authUser = await getCurrentUser();
	} catch (error) {}
	if (authUser && authUser.userId && authUser.username) throw new AuthError({
		name: USER_ALREADY_AUTHENTICATED_EXCEPTION,
		message: "There is already a signed in user.",
		recoverySuggestion: "Call signOut before calling signIn again."
	});
}
function getActiveSignInUsername(username) {
	return signInStore.getState().username ?? username;
}
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/apis/signInWithCustomAuth.mjs
/**
* Signs a user in using a custom authentication flow without password
*
* @param input -  The SignInWithCustomAuthInput object
* @returns AuthSignInResult
* @throws service: {@link InitiateAuthException } - Cognito service errors thrown during the sign-in process.
* @throws validation: {@link AuthValidationErrorCode  } - Validation errors thrown when either username or password
*  are not defined.
* @throws SignInWithCustomAuthOutput - Thrown when the token provider config is invalid.
*/
async function signInWithCustomAuth(input) {
	const authConfig = Amplify.getConfig().Auth?.Cognito;
	assertTokenProviderConfig(authConfig);
	const { username, password, options } = input;
	const signInDetails = {
		loginId: username,
		authFlowType: "CUSTOM_WITHOUT_SRP"
	};
	const metadata = options?.clientMetadata;
	assertValidationError(!!username, AuthValidationErrorCode.EmptySignInUsername);
	assertValidationError(!password, AuthValidationErrorCode.CustomAuthSignInPassword);
	try {
		const { ChallengeName: retriedChallengeName, ChallengeParameters: retiredChallengeParameters, AuthenticationResult, Session } = await retryOnResourceNotFoundException(handleCustomAuthFlowWithoutSRP, [
			username,
			metadata,
			authConfig,
			tokenOrchestrator
		], username, tokenOrchestrator);
		const activeUsername = getActiveSignInUsername(username);
		setActiveSignInState({
			signInSession: Session,
			username: activeUsername,
			challengeName: retriedChallengeName,
			signInDetails
		});
		if (AuthenticationResult) {
			await cacheCognitoTokens({
				username: activeUsername,
				...AuthenticationResult,
				NewDeviceMetadata: await getNewDeviceMetadata({
					userPoolId: authConfig.userPoolId,
					userPoolEndpoint: authConfig.userPoolEndpoint,
					newDeviceMetadata: AuthenticationResult.NewDeviceMetadata,
					accessToken: AuthenticationResult.AccessToken
				}),
				signInDetails
			});
			resetActiveSignInState();
			await dispatchSignedInHubEvent();
			return {
				isSignedIn: true,
				nextStep: { signInStep: "DONE" }
			};
		}
		return getSignInResult({
			challengeName: retriedChallengeName,
			challengeParameters: retiredChallengeParameters
		});
	} catch (error) {
		resetActiveSignInState();
		assertServiceError(error);
		const result = getSignInResultFromError(error.name);
		if (result) return result;
		throw error;
	}
}
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/apis/signInWithCustomSRPAuth.mjs
/**
* Signs a user in using a custom authentication flow with SRP
*
* @param input -  The SignInWithCustomSRPAuthInput object
* @returns SignInWithCustomSRPAuthOutput
* @throws service: {@link InitiateAuthException }, {@link RespondToAuthChallengeException } - Cognito
* service errors thrown during the sign-in process.
* @throws validation: {@link AuthValidationErrorCode  } - Validation errors thrown when either username or password
*  are not defined.
* @throws AuthTokenConfigException - Thrown when the token provider config is invalid.
*/
async function signInWithCustomSRPAuth(input) {
	const { username, password, options } = input;
	const signInDetails = {
		loginId: username,
		authFlowType: "CUSTOM_WITH_SRP"
	};
	const authConfig = Amplify.getConfig().Auth?.Cognito;
	assertTokenProviderConfig(authConfig);
	const metadata = options?.clientMetadata;
	assertValidationError(!!username, AuthValidationErrorCode.EmptySignInUsername);
	assertValidationError(!!password, AuthValidationErrorCode.EmptySignInPassword);
	try {
		const { ChallengeName: handledChallengeName, ChallengeParameters: handledChallengeParameters, AuthenticationResult, Session } = await handleCustomSRPAuthFlow(username, password, metadata, authConfig, tokenOrchestrator);
		const activeUsername = getActiveSignInUsername(username);
		setActiveSignInState({
			signInSession: Session,
			username: activeUsername,
			challengeName: handledChallengeName,
			signInDetails
		});
		if (AuthenticationResult) {
			await cacheCognitoTokens({
				username: activeUsername,
				...AuthenticationResult,
				NewDeviceMetadata: await getNewDeviceMetadata({
					userPoolId: authConfig.userPoolId,
					userPoolEndpoint: authConfig.userPoolEndpoint,
					newDeviceMetadata: AuthenticationResult.NewDeviceMetadata,
					accessToken: AuthenticationResult.AccessToken
				}),
				signInDetails
			});
			resetActiveSignInState();
			await dispatchSignedInHubEvent();
			return {
				isSignedIn: true,
				nextStep: { signInStep: "DONE" }
			};
		}
		return getSignInResult({
			challengeName: handledChallengeName,
			challengeParameters: handledChallengeParameters
		});
	} catch (error) {
		resetActiveSignInState();
		assertServiceError(error);
		const result = getSignInResultFromError(error.name);
		if (result) return result;
		throw error;
	}
}
/**
* Resets the context
*
* @internal
*/
function resetAutoSignIn(resetCallback = true) {
	if (resetCallback);
	autoSignInStore.dispatch({ type: "RESET" });
}
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/apis/signInWithSRP.mjs
/**
* Signs a user in
*
* @param input - The SignInWithSRPInput object
* @returns SignInWithSRPOutput
* @throws service: {@link InitiateAuthException }, {@link RespondToAuthChallengeException } - Cognito service errors
* thrown during the sign-in process.
* @throws validation: {@link AuthValidationErrorCode  } - Validation errors thrown when either username or password
*  are not defined.
* @throws AuthTokenConfigException - Thrown when the token provider config is invalid.
*/
async function signInWithSRP(input) {
	const { username, password } = input;
	const authConfig = Amplify.getConfig().Auth?.Cognito;
	const signInDetails = {
		loginId: username,
		authFlowType: "USER_SRP_AUTH"
	};
	assertTokenProviderConfig(authConfig);
	const clientMetaData = input.options?.clientMetadata;
	assertValidationError(!!username, AuthValidationErrorCode.EmptySignInUsername);
	assertValidationError(!!password, AuthValidationErrorCode.EmptySignInPassword);
	try {
		const { ChallengeName: handledChallengeName, ChallengeParameters: handledChallengeParameters, AuthenticationResult, Session } = await handleUserSRPAuthFlow(username, password, clientMetaData, authConfig, tokenOrchestrator);
		const activeUsername = getActiveSignInUsername(username);
		setActiveSignInState({
			signInSession: Session,
			username: activeUsername,
			challengeName: handledChallengeName,
			signInDetails
		});
		if (AuthenticationResult) {
			await cacheCognitoTokens({
				username: activeUsername,
				...AuthenticationResult,
				NewDeviceMetadata: await getNewDeviceMetadata({
					userPoolId: authConfig.userPoolId,
					userPoolEndpoint: authConfig.userPoolEndpoint,
					newDeviceMetadata: AuthenticationResult.NewDeviceMetadata,
					accessToken: AuthenticationResult.AccessToken
				}),
				signInDetails
			});
			resetActiveSignInState();
			await dispatchSignedInHubEvent();
			resetAutoSignIn();
			return {
				isSignedIn: true,
				nextStep: { signInStep: "DONE" }
			};
		}
		return getSignInResult({
			challengeName: handledChallengeName,
			challengeParameters: handledChallengeParameters
		});
	} catch (error) {
		resetActiveSignInState();
		resetAutoSignIn();
		assertServiceError(error);
		const result = getSignInResultFromError(error.name);
		if (result) return result;
		throw error;
	}
}
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/apis/signInWithUserPassword.mjs
/**
* Signs a user in using USER_PASSWORD_AUTH AuthFlowType
*
* @param input - The SignInWithUserPasswordInput object
* @returns SignInWithUserPasswordOutput
* @throws service: {@link InitiateAuthException } - Cognito service error thrown during the sign-in process.
* @throws validation: {@link AuthValidationErrorCode  } - Validation errors thrown when either username or password
*  are not defined.
* @throws AuthTokenConfigException - Thrown when the token provider config is invalid.
*/
async function signInWithUserPassword(input) {
	const { username, password, options } = input;
	const authConfig = Amplify.getConfig().Auth?.Cognito;
	const signInDetails = {
		loginId: username,
		authFlowType: "USER_PASSWORD_AUTH"
	};
	assertTokenProviderConfig(authConfig);
	const metadata = options?.clientMetadata;
	assertValidationError(!!username, AuthValidationErrorCode.EmptySignInUsername);
	assertValidationError(!!password, AuthValidationErrorCode.EmptySignInPassword);
	try {
		const { ChallengeName: retiredChallengeName, ChallengeParameters: retriedChallengeParameters, AuthenticationResult, Session } = await retryOnResourceNotFoundException(handleUserPasswordAuthFlow, [
			username,
			password,
			metadata,
			authConfig,
			tokenOrchestrator
		], username, tokenOrchestrator);
		const activeUsername = getActiveSignInUsername(username);
		setActiveSignInState({
			signInSession: Session,
			username: activeUsername,
			challengeName: retiredChallengeName,
			signInDetails
		});
		if (AuthenticationResult) {
			await cacheCognitoTokens({
				...AuthenticationResult,
				username: activeUsername,
				NewDeviceMetadata: await getNewDeviceMetadata({
					userPoolId: authConfig.userPoolId,
					userPoolEndpoint: authConfig.userPoolEndpoint,
					newDeviceMetadata: AuthenticationResult.NewDeviceMetadata,
					accessToken: AuthenticationResult.AccessToken
				}),
				signInDetails
			});
			resetActiveSignInState();
			await dispatchSignedInHubEvent();
			resetAutoSignIn();
			return {
				isSignedIn: true,
				nextStep: { signInStep: "DONE" }
			};
		}
		return getSignInResult({
			challengeName: retiredChallengeName,
			challengeParameters: retriedChallengeParameters
		});
	} catch (error) {
		resetActiveSignInState();
		resetAutoSignIn();
		assertServiceError(error);
		const result = getSignInResultFromError(error.name);
		if (result) return result;
		throw error;
	}
}
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/client/flows/userAuth/handleUserAuthFlow.mjs
/**
* Handles user authentication flow with configurable challenge preferences.
* Supports AuthFactorType challenges through the USER_AUTH flow.
*
* @param {HandleUserAuthFlowInput} params - Authentication flow parameters
* @param {string} params.username - The username for authentication
* @param {Record<string, string>} [params.clientMetadata] - Optional metadata to pass to authentication service
* @param {CognitoUserPoolConfig} params.config - Cognito User Pool configuration
* @param {AuthTokenOrchestrator} params.tokenOrchestrator - Manages authentication tokens and device tracking
* @param {AuthFactorType} [params.preferredChallenge] - Optional preferred authentication method
* @param {string} [params.password] - Required when preferredChallenge is 'PASSWORD' or 'PASSWORD_SRP'
*
* @returns {Promise<InitiateAuthCommandOutput>} The authentication response from Cognito
*/
async function handleUserAuthFlow({ username, clientMetadata, config, tokenOrchestrator, preferredChallenge, password, session }) {
	const { userPoolId, userPoolClientId, userPoolEndpoint } = config;
	const UserContextData = getUserContextData({
		username,
		userPoolId,
		userPoolClientId
	});
	const authParameters = { USERNAME: username };
	if (preferredChallenge) {
		if (config.passwordless) {
			if (preferredChallenge === "EMAIL_OTP" && !config.passwordless.emailOtpEnabled || preferredChallenge === "SMS_OTP" && !config.passwordless.smsOtpEnabled || preferredChallenge === "WEB_AUTHN" && !config.passwordless.webAuthn) assertValidationError(false, AuthValidationErrorCode.InvalidPreferredChallenge);
		}
		if (preferredChallenge === "PASSWORD_SRP") {
			assertValidationError(!!password, AuthValidationErrorCode.EmptySignInPassword);
			return handlePasswordSRP({
				username,
				password,
				clientMetadata,
				config,
				tokenOrchestrator,
				authFlow: "USER_AUTH",
				preferredChallenge
			});
		}
		if (preferredChallenge === "PASSWORD") {
			assertValidationError(!!password, AuthValidationErrorCode.EmptySignInPassword);
			authParameters.PASSWORD = password;
		}
		authParameters.PREFERRED_CHALLENGE = preferredChallenge;
	}
	const jsonReq = {
		AuthFlow: "USER_AUTH",
		AuthParameters: authParameters,
		ClientMetadata: clientMetadata,
		ClientId: userPoolClientId,
		UserContextData
	};
	if (session) jsonReq.Session = session;
	const response = await createInitiateAuthClient({ endpointResolver: createCognitoUserPoolEndpointResolver({ endpointOverride: userPoolEndpoint }) })({
		region: getRegionFromUserPoolId(userPoolId),
		userAgentValue: getAuthUserAgentValue(AuthAction.SignIn)
	}, jsonReq);
	setActiveSignInUsername(username);
	return response;
}
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/apis/signInWithUserAuth.mjs
/**
* Signs a user in through a registered email or phone number without a password by by receiving and entering an OTP.
*
* @param input - The SignInWithUserAuthInput object
* @returns SignInWithUserAuthOutput
* @throws service: {@link InitiateAuthException }, {@link RespondToAuthChallengeException } - Cognito service errors
* thrown during the sign-in process.
* @throws validation: {@link AuthValidationErrorCode  } - Validation errors thrown when either username or password -- needs to change
*  are not defined.
* @throws AuthTokenConfigException - Thrown when the token provider config is invalid.
*/
async function signInWithUserAuth(input) {
	const { username, password, options } = input;
	const authConfig = Amplify.getConfig().Auth?.Cognito;
	const signInDetails = {
		loginId: username,
		authFlowType: "USER_AUTH"
	};
	assertTokenProviderConfig(authConfig);
	const clientMetaData = options?.clientMetadata;
	const preferredChallenge = options?.preferredChallenge ?? authConfig?.passwordless?.preferredChallenge;
	assertValidationError(!!username, AuthValidationErrorCode.EmptySignInUsername);
	try {
		const handleUserAuthFlowInput = {
			username,
			config: authConfig,
			tokenOrchestrator,
			clientMetadata: clientMetaData,
			preferredChallenge,
			password
		};
		const autoSignInStoreState = autoSignInStore.getState();
		if (autoSignInStoreState.active && autoSignInStoreState.username === username) handleUserAuthFlowInput.session = autoSignInStoreState.session;
		const response = await handleUserAuthFlow(handleUserAuthFlowInput);
		const activeUsername = getActiveSignInUsername(username);
		setActiveSignInState({
			signInSession: response.Session,
			username: activeUsername,
			challengeName: response.ChallengeName,
			signInDetails
		});
		if (response.AuthenticationResult) {
			await cacheCognitoTokens({
				username: activeUsername,
				...response.AuthenticationResult,
				NewDeviceMetadata: await getNewDeviceMetadata({
					userPoolId: authConfig.userPoolId,
					userPoolEndpoint: authConfig.userPoolEndpoint,
					newDeviceMetadata: response.AuthenticationResult.NewDeviceMetadata,
					accessToken: response.AuthenticationResult.AccessToken
				}),
				signInDetails
			});
			resetActiveSignInState();
			await dispatchSignedInHubEvent();
			resetAutoSignIn();
			return {
				isSignedIn: true,
				nextStep: { signInStep: "DONE" }
			};
		}
		return getSignInResult({
			challengeName: response.ChallengeName,
			challengeParameters: response.ChallengeParameters,
			availableChallenges: "AvailableChallenges" in response ? response.AvailableChallenges : void 0
		});
	} catch (error) {
		resetActiveSignInState();
		resetAutoSignIn();
		assertServiceError(error);
		const result = getSignInResultFromError(error.name);
		if (result) return result;
		throw error;
	}
}
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/apis/signIn.mjs
/**
* Signs a user in
*
* @param input -  The SignInInput object
* @returns SignInOutput
* @throws service: {@link InitiateAuthException }, {@link RespondToAuthChallengeException }
*  - Cognito service errors thrown during the sign-in process.
* @throws validation: {@link AuthValidationErrorCode  } - Validation errors thrown when either username or password
*  are not defined.
* @throws AuthTokenConfigException - Thrown when the token provider config is invalid.
*/
async function signIn(input) {
	resetAutoSignIn(false);
	const authFlowType = input.options?.authFlowType;
	await assertUserNotAuthenticated();
	switch (authFlowType) {
		case "USER_SRP_AUTH": return signInWithSRP(input);
		case "USER_PASSWORD_AUTH": return signInWithUserPassword(input);
		case "CUSTOM_WITHOUT_SRP": return signInWithCustomAuth(input);
		case "CUSTOM_WITH_SRP": return signInWithCustomSRPAuth(input);
		case "USER_AUTH": return signInWithUserAuth(input);
		default: return signInWithSRP(input);
	}
}
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/signUpHelpers.mjs
var MAX_AUTOSIGNIN_POLLING_MS = 180 * 1e3;
function handleCodeAutoSignIn(signInInput) {
	const stopHubListener = HubInternal.listen("auth-internal", async ({ payload }) => {
		switch (payload.event) {
			case "confirmSignUp": if (payload.data?.isSignUpComplete) {
				HubInternal.dispatch("auth-internal", { event: "autoSignIn" });
				stopHubListener();
			}
		}
	});
	const timeOutId = setTimeout(() => {
		stopHubListener();
		clearTimeout(timeOutId);
		resetAutoSignIn();
	}, MAX_AUTOSIGNIN_POLLING_MS);
}
function debounce(fun, delay) {
	let timer;
	return (args) => {
		if (!timer) fun(...args);
		clearTimeout(timer);
		timer = setTimeout(() => {
			timer = void 0;
		}, delay);
	};
}
var debouncedAutoSignWithCodeOrUserConfirmed = debounce(handleAutoSignInWithCodeOrUserConfirmed, 300);
async function handleAutoSignInWithCodeOrUserConfirmed(signInInput, resolve, reject) {
	try {
		resolve(signInInput?.options?.authFlowType === "USER_AUTH" ? await signInWithUserAuth(signInInput) : await signIn(signInInput));
		resetAutoSignIn();
	} catch (error) {
		reject(error);
		resetAutoSignIn();
	}
}
function autoSignInWithCode(signInInput) {
	return async () => {
		return new Promise((resolve, reject) => {
			debouncedAutoSignWithCodeOrUserConfirmed([
				signInInput,
				resolve,
				reject
			]);
		});
	};
}
var autoSignInUserConfirmed = autoSignInWithCode;
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/foundation/factories/serviceClients/cognitoIdentityProvider/createSignUpClient.mjs
var createSignUpClientDeserializer = () => async (response) => {
	if (response.statusCode >= 300) {
		const error = await parseJsonError(response);
		assertServiceError(error);
		if (error.name === SignUpException.InvalidParameterException && /'password'/.test(error.message) && /Member must not be null/.test(error.message)) {
			const name = AuthValidationErrorCode.EmptySignUpPassword;
			const { message, recoverySuggestion } = validationErrorMap[name];
			throw new AuthError({
				name,
				message,
				recoverySuggestion
			});
		}
		throw new AuthError({
			name: error.name,
			message: error.message
		});
	}
	return parseJsonBody(response);
};
var createSignUpClient = (config) => composeServiceApi(cognitoUserPoolTransferHandler, createUserPoolSerializer("SignUp"), createSignUpClientDeserializer(), {
	...DEFAULT_SERVICE_CLIENT_API_CONFIG,
	...config
});
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/apis/signUp.mjs
/**
* Creates a user
*
* @param input - The SignUpInput object
* @returns SignUpOutput
* @throws service: {@link SignUpException } - Cognito service errors thrown during the sign-up process.
* @throws validation: {@link AuthValidationErrorCode } - Validation errors thrown either username or password
*  are not defined.
* @throws AuthTokenConfigException - Thrown when the token provider config is invalid.
*/
async function signUp(input) {
	const { username, password, options } = input;
	const authConfig = Amplify.getConfig().Auth?.Cognito;
	const signUpVerificationMethod = authConfig?.signUpVerificationMethod ?? "code";
	const { clientMetadata, validationData, autoSignIn } = input.options ?? {};
	assertTokenProviderConfig(authConfig);
	assertValidationError(!!username, AuthValidationErrorCode.EmptySignUpUsername);
	const signInServiceOptions = typeof autoSignIn !== "boolean" ? autoSignIn : void 0;
	const signInInput = {
		username,
		options: signInServiceOptions
	};
	if (signInServiceOptions?.authFlowType !== "CUSTOM_WITHOUT_SRP") signInInput.password = password;
	const { userPoolId, userPoolClientId, userPoolEndpoint } = authConfig;
	const signUpClient = createSignUpClient({ endpointResolver: createCognitoUserPoolEndpointResolver({ endpointOverride: userPoolEndpoint }) });
	const signUpClientInput = {
		Username: username,
		Password: void 0,
		UserAttributes: options?.userAttributes && toAttributeType(options?.userAttributes),
		ClientMetadata: clientMetadata,
		ValidationData: validationData && toAttributeType(validationData),
		ClientId: userPoolClientId,
		UserContextData: getUserContextData({
			username,
			userPoolId,
			userPoolClientId
		})
	};
	if (password) signUpClientInput.Password = password;
	const { UserSub: userId, CodeDeliveryDetails: cdd, UserConfirmed: userConfirmed, Session: session } = await signUpClient({
		region: getRegionFromUserPoolId(userPoolId),
		userAgentValue: getAuthUserAgentValue(AuthAction.SignUp)
	}, signUpClientInput);
	if (signInServiceOptions || autoSignIn === true) {
		autoSignInStore.dispatch({ type: "START" });
		autoSignInStore.dispatch({
			type: "SET_USERNAME",
			value: username
		});
		autoSignInStore.dispatch({
			type: "SET_SESSION",
			value: session
		});
	}
	const codeDeliveryDetails = {
		destination: cdd?.Destination,
		deliveryMedium: cdd?.DeliveryMedium,
		attributeName: cdd?.AttributeName
	};
	const isSignUpComplete = !!userConfirmed;
	const isAutoSignInStarted = autoSignInStore.getState().active;
	if (isSignUpComplete) {
		if (isAutoSignInStarted) {
			autoSignInUserConfirmed(signInInput);
			return {
				isSignUpComplete: true,
				nextStep: { signUpStep: "COMPLETE_AUTO_SIGN_IN" },
				userId
			};
		}
		return {
			isSignUpComplete: true,
			nextStep: { signUpStep: "DONE" },
			userId
		};
	}
	if (isAutoSignInStarted) {
		if (signUpVerificationMethod === "link") return {
			isSignUpComplete: false,
			nextStep: {
				signUpStep: "COMPLETE_AUTO_SIGN_IN",
				codeDeliveryDetails
			},
			userId
		};
		handleCodeAutoSignIn(signInInput);
	}
	return {
		isSignUpComplete: false,
		nextStep: {
			signUpStep: "CONFIRM_SIGN_UP",
			codeDeliveryDetails
		},
		userId
	};
}
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/foundation/factories/serviceClients/cognitoIdentityProvider/createForgotPasswordClient.mjs
var createForgotPasswordClient = (config) => composeServiceApi(cognitoUserPoolTransferHandler, createUserPoolSerializer("ForgotPassword"), createUserPoolDeserializer(), {
	...DEFAULT_SERVICE_CLIENT_API_CONFIG,
	...config
});
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/apis/resetPassword.mjs
/**
* Resets a user's password.
*
* @param input -  The ResetPasswordInput object.
* @returns ResetPasswordOutput
* @throws -{@link ForgotPasswordException }
* Thrown due to an invalid confirmation code or password.
* @throws -{@link AuthValidationErrorCode }
* Thrown due to an empty username.
* @throws AuthTokenConfigException - Thrown when the token provider config is invalid.
**/
async function resetPassword(input) {
	const { username } = input;
	assertValidationError(!!username, AuthValidationErrorCode.EmptyResetPasswordUsername);
	const authConfig = Amplify.getConfig().Auth?.Cognito;
	assertTokenProviderConfig(authConfig);
	const { userPoolClientId, userPoolId, userPoolEndpoint } = authConfig;
	const clientMetadata = input.options?.clientMetadata;
	const UserContextData = getUserContextData({
		username,
		userPoolId,
		userPoolClientId
	});
	const codeDeliveryDetails = (await createForgotPasswordClient({ endpointResolver: createCognitoUserPoolEndpointResolver({ endpointOverride: userPoolEndpoint }) })({
		region: getRegionFromUserPoolId(userPoolId),
		userAgentValue: getAuthUserAgentValue(AuthAction.ResetPassword)
	}, {
		Username: username,
		ClientMetadata: clientMetadata,
		ClientId: userPoolClientId,
		UserContextData
	})).CodeDeliveryDetails;
	return {
		isPasswordReset: false,
		nextStep: {
			resetPasswordStep: "CONFIRM_RESET_PASSWORD_WITH_CODE",
			codeDeliveryDetails: {
				deliveryMedium: codeDeliveryDetails?.DeliveryMedium,
				destination: codeDeliveryDetails?.Destination,
				attributeName: codeDeliveryDetails?.AttributeName
			}
		}
	};
}
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/foundation/factories/serviceClients/cognitoIdentityProvider/createConfirmForgotPasswordClient.mjs
var createConfirmForgotPasswordClient = (config) => composeServiceApi(cognitoUserPoolTransferHandler, createUserPoolSerializer("ConfirmForgotPassword"), createUserPoolDeserializer(), {
	...DEFAULT_SERVICE_CLIENT_API_CONFIG,
	...config
});
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/apis/confirmResetPassword.mjs
/**
* Confirms the new password and verification code to reset the password.
*
* @param input -  The ConfirmResetPasswordInput object.
* @throws -{@link ConfirmForgotPasswordException }
* Thrown due to an invalid confirmation code or password.
* @throws -{@link AuthValidationErrorCode }
* Thrown due to an empty confirmation code, password or username.
* @throws AuthTokenConfigException - Thrown when the token provider config is invalid.
*/
async function confirmResetPassword(input) {
	const authConfig = Amplify.getConfig().Auth?.Cognito;
	assertTokenProviderConfig(authConfig);
	const { userPoolClientId, userPoolId, userPoolEndpoint } = authConfig;
	const { username, newPassword } = input;
	assertValidationError(!!username, AuthValidationErrorCode.EmptyConfirmResetPasswordUsername);
	assertValidationError(!!newPassword, AuthValidationErrorCode.EmptyConfirmResetPasswordNewPassword);
	const code = input.confirmationCode;
	assertValidationError(!!code, AuthValidationErrorCode.EmptyConfirmResetPasswordConfirmationCode);
	const metadata = input.options?.clientMetadata;
	const UserContextData = getUserContextData({
		username,
		userPoolId,
		userPoolClientId
	});
	await createConfirmForgotPasswordClient({ endpointResolver: createCognitoUserPoolEndpointResolver({ endpointOverride: userPoolEndpoint }) })({
		region: getRegionFromUserPoolId(authConfig.userPoolId),
		userAgentValue: getAuthUserAgentValue(AuthAction.ConfirmResetPassword)
	}, {
		Username: username,
		ConfirmationCode: code,
		Password: newPassword,
		ClientMetadata: metadata,
		ClientId: authConfig.userPoolClientId,
		UserContextData
	});
}
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/foundation/factories/serviceClients/cognitoIdentityProvider/createConfirmSignUpClient.mjs
var createConfirmSignUpClient = (config) => composeServiceApi(cognitoUserPoolTransferHandler, createUserPoolSerializer("ConfirmSignUp"), createUserPoolDeserializer(), {
	...DEFAULT_SERVICE_CLIENT_API_CONFIG,
	...config
});
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/apis/confirmSignUp.mjs
/**
* Confirms a new user account.
*
* @param input -  The ConfirmSignUpInput object.
* @returns ConfirmSignUpOutput
* @throws -{@link ConfirmSignUpException }
* Thrown due to an invalid confirmation code.
* @throws -{@link AuthValidationErrorCode }
* Thrown due to an empty confirmation code
* @throws AuthTokenConfigException - Thrown when the token provider config is invalid.
*/
async function confirmSignUp(input) {
	const { username, confirmationCode, options } = input;
	const authConfig = Amplify.getConfig().Auth?.Cognito;
	assertTokenProviderConfig(authConfig);
	const { userPoolId, userPoolClientId, userPoolEndpoint } = authConfig;
	const clientMetadata = options?.clientMetadata;
	assertValidationError(!!username, AuthValidationErrorCode.EmptyConfirmSignUpUsername);
	assertValidationError(!!confirmationCode, AuthValidationErrorCode.EmptyConfirmSignUpCode);
	const UserContextData = getUserContextData({
		username,
		userPoolId,
		userPoolClientId
	});
	const { Session: session } = await createConfirmSignUpClient({ endpointResolver: createCognitoUserPoolEndpointResolver({ endpointOverride: userPoolEndpoint }) })({
		region: getRegionFromUserPoolId(authConfig.userPoolId),
		userAgentValue: getAuthUserAgentValue(AuthAction.ConfirmSignUp)
	}, {
		Username: username,
		ConfirmationCode: confirmationCode,
		ClientMetadata: clientMetadata,
		ForceAliasCreation: options?.forceAliasCreation,
		ClientId: authConfig.userPoolClientId,
		UserContextData
	});
	return new Promise((resolve, reject) => {
		try {
			const signUpOut = {
				isSignUpComplete: true,
				nextStep: { signUpStep: "DONE" }
			};
			const autoSignInStoreState = autoSignInStore.getState();
			if (!autoSignInStoreState.active || autoSignInStoreState.username !== username) {
				resolve(signUpOut);
				resetAutoSignIn();
				return;
			}
			autoSignInStore.dispatch({
				type: "SET_SESSION",
				value: session
			});
			const stopListener = HubInternal.listen("auth-internal", ({ payload }) => {
				switch (payload.event) {
					case "autoSignIn":
						resolve({
							isSignUpComplete: true,
							nextStep: { signUpStep: "COMPLETE_AUTO_SIGN_IN" }
						});
						stopListener();
				}
			});
			HubInternal.dispatch("auth-internal", {
				event: "confirmSignUp",
				data: signUpOut
			});
		} catch (error) {
			reject(error);
		}
	});
}
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/foundation/factories/serviceClients/cognitoIdentityProvider/createGetUserClient.mjs
var createGetUserClient = (config) => composeServiceApi(cognitoUserPoolTransferHandler, createUserPoolSerializer("GetUser"), createUserPoolDeserializer(), {
	...DEFAULT_SERVICE_CLIENT_API_CONFIG,
	...config
});
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/foundation/factories/serviceClients/cognitoIdentityProvider/createChangePasswordClient.mjs
var createChangePasswordClient = (config) => composeServiceApi(cognitoUserPoolTransferHandler, createUserPoolSerializer("ChangePassword"), createUserPoolDeserializer(), {
	...DEFAULT_SERVICE_CLIENT_API_CONFIG,
	...config
});
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/apis/updatePassword.mjs
/**
* Updates user's password while authenticated.
*
* @param input - The UpdatePasswordInput object.
* @throws - {@link ChangePasswordException} - Cognito service errors thrown when updating a password.
* @throws - {@link AuthValidationErrorCode} - Validation errors thrown when oldPassword or newPassword are empty.
* @throws AuthTokenConfigException - Thrown when the token provider config is invalid.
*/
async function updatePassword(input) {
	const authConfig = Amplify.getConfig().Auth?.Cognito;
	assertTokenProviderConfig(authConfig);
	const { userPoolEndpoint, userPoolId } = authConfig;
	const { oldPassword, newPassword } = input;
	assertValidationError(!!oldPassword, AuthValidationErrorCode.EmptyUpdatePassword);
	assertValidationError(!!newPassword, AuthValidationErrorCode.EmptyUpdatePassword);
	const { tokens } = await fetchAuthSession({ forceRefresh: false });
	assertAuthTokens(tokens);
	await createChangePasswordClient({ endpointResolver: createCognitoUserPoolEndpointResolver({ endpointOverride: userPoolEndpoint }) })({
		region: getRegionFromUserPoolId(userPoolId),
		userAgentValue: getAuthUserAgentValue(AuthAction.UpdatePassword)
	}, {
		AccessToken: tokens.accessToken.toString(),
		PreviousPassword: oldPassword,
		ProposedPassword: newPassword
	});
}
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/foundation/factories/serviceClients/cognitoIdentityProvider/createUpdateUserAttributesClient.mjs
var createUpdateUserAttributesClient = (config) => composeServiceApi(cognitoUserPoolTransferHandler, createUserPoolSerializer("UpdateUserAttributes"), createUserPoolDeserializer(), {
	...DEFAULT_SERVICE_CLIENT_API_CONFIG,
	...config
});
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/apis/updateUserAttributes.mjs
/**
* Updates user's attributes while authenticated.
*
* @param input - The UpdateUserAttributesInput object
* @returns UpdateUserAttributesOutput
* @throws - {@link UpdateUserAttributesException}
* @throws AuthTokenConfigException - Thrown when the token provider config is invalid.
*/
var updateUserAttributes = async (input) => {
	const { userAttributes, options } = input;
	const authConfig = Amplify.getConfig().Auth?.Cognito;
	const clientMetadata = options?.clientMetadata;
	assertTokenProviderConfig(authConfig);
	const { userPoolEndpoint, userPoolId } = authConfig;
	const { tokens } = await fetchAuthSession({ forceRefresh: false });
	assertAuthTokens(tokens);
	const { CodeDeliveryDetailsList } = await createUpdateUserAttributesClient({ endpointResolver: createCognitoUserPoolEndpointResolver({ endpointOverride: userPoolEndpoint }) })({
		region: getRegionFromUserPoolId(userPoolId),
		userAgentValue: getAuthUserAgentValue(AuthAction.UpdateUserAttributes)
	}, {
		AccessToken: tokens.accessToken.toString(),
		ClientMetadata: clientMetadata,
		UserAttributes: toAttributeType(userAttributes)
	});
	return {
		...getConfirmedAttributes(userAttributes),
		...getUnConfirmedAttributes(CodeDeliveryDetailsList)
	};
};
function getConfirmedAttributes(attributes) {
	const confirmedAttributes = {};
	Object.keys(attributes)?.forEach((key) => {
		confirmedAttributes[key] = {
			isUpdated: true,
			nextStep: { updateAttributeStep: "DONE" }
		};
	});
	return confirmedAttributes;
}
function getUnConfirmedAttributes(codeDeliveryDetailsList) {
	const unConfirmedAttributes = {};
	codeDeliveryDetailsList?.forEach((codeDeliveryDetails) => {
		const { AttributeName, DeliveryMedium, Destination } = codeDeliveryDetails;
		if (AttributeName) unConfirmedAttributes[AttributeName] = {
			isUpdated: false,
			nextStep: {
				updateAttributeStep: "CONFIRM_ATTRIBUTE_WITH_CODE",
				codeDeliveryDetails: {
					attributeName: AttributeName,
					deliveryMedium: DeliveryMedium,
					destination: Destination
				}
			}
		};
	});
	return unConfirmedAttributes;
}
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/oauth/getRedirectUrl.mjs
/** @internal */
function getRedirectUrl(redirects, preferredRedirectUrl) {
	if (preferredRedirectUrl) {
		const redirectUrl = redirects?.find((redirect) => redirect === preferredRedirectUrl);
		if (!redirectUrl) throw invalidPreferredRedirectUrlException;
		return redirectUrl;
	} else {
		const redirectUrlFromTheSameOrigin = redirects?.find(isSameOriginAndPathName) ?? redirects?.find(isTheSameDomain);
		const redirectUrlFromDifferentOrigin = redirects?.find(isHttps) ?? redirects?.find(isHttp);
		if (redirectUrlFromTheSameOrigin) return redirectUrlFromTheSameOrigin;
		else if (redirectUrlFromDifferentOrigin) throw invalidOriginException;
		throw invalidRedirectException;
	}
}
var isSameOriginAndPathName = (redirect) => redirect.startsWith(String(window.location.origin + (window.location.pathname || "/")));
var isTheSameDomain = (redirect) => redirect.includes(String(window.location.hostname));
var isHttp = (redirect) => redirect.startsWith("http://");
var isHttps = (redirect) => redirect.startsWith("https://");
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/utils/openAuthSession.mjs
var openAuthSession = async (url) => {
	if (!window?.location) return;
	window.location.href = url.replace("http://", "https://");
};
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/apis/internal/fetchUserAttributes.mjs
var fetchUserAttributes$1 = async (amplify) => {
	const authConfig = amplify.getConfig().Auth?.Cognito;
	assertTokenProviderConfig(authConfig);
	const { userPoolEndpoint, userPoolId } = authConfig;
	const { tokens } = await fetchAuthSession$1(amplify, { forceRefresh: false });
	assertAuthTokens(tokens);
	const { UserAttributes } = await createGetUserClient({ endpointResolver: createCognitoUserPoolEndpointResolver({ endpointOverride: userPoolEndpoint }) })({
		region: getRegionFromUserPoolId(userPoolId),
		userAgentValue: getAuthUserAgentValue(AuthAction.FetchUserAttributes)
	}, { AccessToken: tokens.accessToken.toString() });
	return toAuthUserAttribute(UserAttributes);
};
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/apis/fetchUserAttributes.mjs
/**
* Fetches the current user attributes while authenticated.
*
* @throws - {@link GetUserException} - Cognito service errors thrown when the service is not able to get the user.
* @throws AuthTokenConfigException - Thrown when the token provider config is invalid.
*/
var fetchUserAttributes = () => {
	return fetchUserAttributes$1(Amplify);
};
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/oauth/completeOAuthSignOut.mjs
var completeOAuthSignOut = async (store) => {
	await store.clearOAuthData();
	tokenOrchestrator.clearTokens();
	await clearCredentials();
	Hub.dispatch("auth", { event: "signedOut" }, "Auth", AMPLIFY_SYMBOL);
};
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/oauth/oAuthSignOutRedirect.mjs
var oAuthSignOutRedirect = async (authConfig, preferPrivateSession = false, redirectUrl) => {
	assertOAuthConfig(authConfig);
	const { loginWith, userPoolClientId } = authConfig;
	const { domain, redirectSignOut } = loginWith.oauth;
	const signoutUri = getRedirectUrl(redirectSignOut, redirectUrl);
	return openAuthSession(`https://${domain}/logout?${Object.entries({
		client_id: userPoolClientId,
		logout_uri: encodeURIComponent(signoutUri)
	}).map(([k, v]) => `${k}=${v}`).join("&")}`);
};
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/oauth/handleOAuthSignOut.mjs
var handleOAuthSignOut = async (cognitoConfig, store, tokenOrchestrator, redirectUrl) => {
	const { isOAuthSignIn } = await store.loadOAuthSignIn();
	const oauthMetadata = await tokenOrchestrator.getOAuthMetadata();
	await completeOAuthSignOut(store);
	if (isOAuthSignIn || oauthMetadata?.oauthSignIn) return oAuthSignOutRedirect(cognitoConfig, false, redirectUrl);
};
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/foundation/factories/serviceClients/cognitoIdentityProvider/createRevokeTokenClient.mjs
var createRevokeTokenClient = (config) => composeServiceApi(cognitoUserPoolTransferHandler, createUserPoolSerializer("RevokeToken"), createUserPoolDeserializer(), {
	...DEFAULT_SERVICE_CLIENT_API_CONFIG,
	...config
});
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/foundation/factories/serviceClients/cognitoIdentityProvider/createGlobalSignOutClient.mjs
var createGlobalSignOutClient = (config) => composeServiceApi(cognitoUserPoolTransferHandler, createUserPoolSerializer("GlobalSignOut"), createUserPoolDeserializer(), {
	...DEFAULT_SERVICE_CLIENT_API_CONFIG,
	...config
});
//#endregion
//#region node_modules/@aws-amplify/auth/dist/esm/providers/cognito/apis/signOut.mjs
var logger = new ConsoleLogger("Auth");
/**
* Signs a user out
*
* @param input - The SignOutInput object
* @throws AuthTokenConfigException - Thrown when the token provider config is invalid.
*/
async function signOut(input) {
	const cognitoConfig = Amplify.getConfig().Auth?.Cognito;
	assertTokenProviderConfig(cognitoConfig);
	if (input?.global) await globalSignOut(cognitoConfig);
	else await clientSignOut(cognitoConfig);
	let hasOAuthConfig;
	try {
		assertOAuthConfig(cognitoConfig);
		hasOAuthConfig = true;
	} catch (err) {
		hasOAuthConfig = false;
	}
	if (hasOAuthConfig) {
		const oAuthStore = new DefaultOAuthStore(defaultStorage);
		oAuthStore.setAuthConfig(cognitoConfig);
		const { type } = await handleOAuthSignOut(cognitoConfig, oAuthStore, tokenOrchestrator, input?.oauth?.redirectUrl) ?? {};
		if (type === "error") throw new AuthError({
			name: OAUTH_SIGNOUT_EXCEPTION,
			message: `An error occurred when attempting to log out from OAuth provider.`
		});
	} else {
		tokenOrchestrator.clearTokens();
		await clearCredentials();
		Hub.dispatch("auth", { event: "signedOut" }, "Auth", AMPLIFY_SYMBOL);
	}
}
async function clientSignOut(cognitoConfig) {
	try {
		const { userPoolEndpoint, userPoolId, userPoolClientId } = cognitoConfig;
		const authTokens = await tokenOrchestrator.getTokenStore().loadTokens();
		assertAuthTokensWithRefreshToken(authTokens);
		if (isSessionRevocable(authTokens.accessToken)) await createRevokeTokenClient({ endpointResolver: createCognitoUserPoolEndpointResolver({ endpointOverride: userPoolEndpoint }) })({
			region: getRegionFromUserPoolId(userPoolId),
			userAgentValue: getAuthUserAgentValue(AuthAction.SignOut)
		}, {
			ClientId: userPoolClientId,
			Token: authTokens.refreshToken
		});
	} catch (err) {
		logger.debug("Client signOut error caught but will proceed with token removal");
	}
}
async function globalSignOut(cognitoConfig) {
	try {
		const { userPoolEndpoint, userPoolId } = cognitoConfig;
		const authTokens = await tokenOrchestrator.getTokenStore().loadTokens();
		assertAuthTokens(authTokens);
		await createGlobalSignOutClient({ endpointResolver: createCognitoUserPoolEndpointResolver({ endpointOverride: userPoolEndpoint }) })({
			region: getRegionFromUserPoolId(userPoolId),
			userAgentValue: getAuthUserAgentValue(AuthAction.SignOut)
		}, { AccessToken: authTokens.accessToken.toString() });
	} catch (err) {
		logger.debug("Global signOut error caught but will proceed with token removal");
	}
}
var isSessionRevocable = (token) => !!token?.payload?.origin_jti;
//#endregion
export { confirmSignUp as a, signUp as c, fetchAuthSession as d, updatePassword as i, signIn as l, fetchUserAttributes as n, confirmResetPassword as o, updateUserAttributes as r, resetPassword as s, signOut as t, getCurrentUser as u };
