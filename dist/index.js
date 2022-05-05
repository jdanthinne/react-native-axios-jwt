"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setIsRefreshing = exports.getIsRefreshing = exports.authTokenInterceptor = exports.applyAuthTokenInterceptor = exports.refreshTokenIfNeeded = exports.getAccessToken = exports.getRefreshToken = exports.clearAuthTokens = exports.setAccessToken = exports.setAuthTokens = exports.isLoggedIn = exports.STORAGE_KEY = void 0;
var jwt_decode_1 = __importDefault(require("jwt-decode"));
var axios_1 = __importDefault(require("axios"));
var Keychain = __importStar(require("react-native-keychain"));
var react_native_device_info_1 = require("react-native-device-info");
// a little time before expiration to try refresh (seconds)
var EXPIRE_FUDGE = 10;
exports.STORAGE_KEY = (0, react_native_device_info_1.getBundleId)() + "-refresh-token-" + process.env.NODE_ENV;
var accessToken = null;
// EXPORTS
/**
 * Checks if refresh tokens are stored
 * @async
 * @returns {Promise<boolean>} Whether the user is logged in or not
 */
var isLoggedIn = function () { return __awaiter(void 0, void 0, void 0, function () {
    var token;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.getRefreshToken)()];
            case 1:
                token = _a.sent();
                return [2 /*return*/, !!token];
        }
    });
}); };
exports.isLoggedIn = isLoggedIn;
/**
 * Sets the access and refresh tokens
 * @async
 * @param {AuthTokens} tokens - Access and Refresh tokens
 * @returns {Promise}
 */
var setAuthTokens = function (tokens) {
    // store accesToken in memory
    (0, exports.setAccessToken)(tokens.accessToken);
    // store refreshToken securely
    return Keychain.setGenericPassword('refreshToken', tokens.refreshToken, { service: exports.STORAGE_KEY })
        .then(function (result) {
        if (result)
            return;
        else
            throw new Error('Failed to store refresh token');
    })
        .catch(function (error) {
        throw error;
    });
};
exports.setAuthTokens = setAuthTokens;
/**
 * Sets the access token
 * @async
 * @param {Promise} token - Access token
 */
var setAccessToken = function (token) { return __awaiter(void 0, void 0, void 0, function () {
    var refreshToken;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.getRefreshToken)()];
            case 1:
                refreshToken = _a.sent();
                if (!refreshToken || !accessToken) {
                    throw new Error('Unable to update access token since there are not tokens currently stored');
                }
                accessToken = token;
                return [2 /*return*/];
        }
    });
}); };
exports.setAccessToken = setAccessToken;
/**
 * Clears both tokens
 * @async
 * @param {Promise}
 */
var clearAuthTokens = function () { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                accessToken = null;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Keychain.resetGenericPassword({ service: exports.STORAGE_KEY })];
            case 2:
                result = _a.sent();
                if (result) {
                    return [2 /*return*/];
                }
                else {
                    throw new Error('Failed to clear refresh token');
                }
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                throw error_1;
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.clearAuthTokens = clearAuthTokens;
/**
 * Returns the stored refresh token
 * @async
 * @returns {Promise<string>} Refresh token
 */
var getRefreshToken = function () { return __awaiter(void 0, void 0, void 0, function () {
    var credentials;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Keychain.getGenericPassword({ service: exports.STORAGE_KEY })];
            case 1:
                credentials = _a.sent();
                return [2 /*return*/, credentials ? credentials.password : undefined];
        }
    });
}); };
exports.getRefreshToken = getRefreshToken;
/**
 * Returns the stored access token
 * @returns {Promise<string>} Access token
 */
var getAccessToken = function () {
    return accessToken !== null && accessToken !== void 0 ? accessToken : undefined;
};
exports.getAccessToken = getAccessToken;
/**
 * @callback requestRefresh
 * @param {string} refreshToken - Token that is sent to the backend
 * @returns {Promise} Promise that resolves in an access token
 */
/**
 * Gets the current access token, exchanges it with a new one if it's expired and then returns the token.
 * @async
 * @param {requestRefresh} requestRefresh - Function that is used to get a new access token
 * @returns {Promise<string>} Access token
 */
var refreshTokenIfNeeded = function (requestRefresh) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(!accessToken || isTokenExpired(accessToken))) return [3 /*break*/, 2];
                return [4 /*yield*/, refreshToken(requestRefresh)];
            case 1:
                // do refresh
                accessToken = _a.sent();
                _a.label = 2;
            case 2: return [2 /*return*/, accessToken];
        }
    });
}); };
exports.refreshTokenIfNeeded = refreshTokenIfNeeded;
/**
 *
 * @param {Axios} axios - Axios instance to apply the interceptor to
 * @param {AuthTokenInterceptorConfig} config - Configuration for the interceptor
 */
var applyAuthTokenInterceptor = function (axios, config) {
    if (!axios.interceptors)
        throw new Error("invalid axios instance: " + axios);
    axios.interceptors.request.use((0, exports.authTokenInterceptor)(config));
};
exports.applyAuthTokenInterceptor = applyAuthTokenInterceptor;
// PRIVATE
/**
 * Checks if the token is undefined, has expired or is about the expire
 *
 * @param {string} token - Access token
 * @returns {boolean} Whether or not the token is undefined, has expired or is about the expire
 */
var isTokenExpired = function (token) {
    if (!token)
        return true;
    var expiresIn = getExpiresIn(token);
    return !expiresIn || expiresIn <= EXPIRE_FUDGE;
};
/**
 * Gets the unix timestamp from an access token
 *
 * @param {string} token - Access token
 * @returns {string} Unix timestamp
 */
var getTimestampFromToken = function (token) {
    var decoded = (0, jwt_decode_1.default)(token);
    return decoded.exp;
};
/**
 * Returns the number of seconds before the access token expires or -1 if it already has
 *
 * @param {string} token - Access token
 * @returns {number} Number of seconds before the access token expires
 */
var getExpiresIn = function (token) {
    var expiration = getTimestampFromToken(token);
    if (!expiration)
        return -1;
    return expiration - Date.now() / 1000;
};
/**
 * Refreshes the access token using the provided function
 * @async
 * @param {requestRefresh} requestRefresh - Function that is used to get a new access token
 * @returns {Promise<string>} - Fresh access token
 */
var refreshToken = function (requestRefresh) { return __awaiter(void 0, void 0, void 0, function () {
    var refreshToken, newTokens, error_2, status_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, exports.getRefreshToken)()];
            case 1:
                refreshToken = _b.sent();
                if (!refreshToken)
                    throw new Error('No refresh token available');
                _b.label = 2;
            case 2:
                _b.trys.push([2, 8, , 11]);
                return [4 /*yield*/, requestRefresh(refreshToken)];
            case 3:
                newTokens = _b.sent();
                if (!(typeof newTokens === 'object' && (newTokens === null || newTokens === void 0 ? void 0 : newTokens.accessToken))) return [3 /*break*/, 5];
                return [4 /*yield*/, (0, exports.setAuthTokens)(newTokens)];
            case 4:
                _b.sent();
                return [2 /*return*/, newTokens.accessToken];
            case 5:
                if (!(typeof newTokens === 'string')) return [3 /*break*/, 7];
                return [4 /*yield*/, (0, exports.setAccessToken)(newTokens)];
            case 6:
                _b.sent();
                return [2 /*return*/, newTokens];
            case 7: throw new Error('requestRefresh must either return a string or an object with an accessToken');
            case 8:
                error_2 = _b.sent();
                if (!axios_1.default.isAxiosError(error_2))
                    throw error_2;
                status_1 = (_a = error_2.response) === null || _a === void 0 ? void 0 : _a.status;
                if (!(status_1 === 401 || status_1 === 422)) return [3 /*break*/, 10];
                // The refresh token is invalid so remove the stored tokens
                return [4 /*yield*/, (0, exports.clearAuthTokens)()];
            case 9:
                // The refresh token is invalid so remove the stored tokens
                _b.sent();
                error_2.message = "Got " + status_1 + " on token refresh; clearing both auth tokens";
                _b.label = 10;
            case 10: throw error_2;
            case 11: return [2 /*return*/];
        }
    });
}); };
/**
 * Function that returns an Axios Intercepter that:
 * - Applies that right auth header to requests
 * - Refreshes the access token when needed
 * - Puts subsequent requests in a queue and executes them in order after the access token has been refreshed.
 *
 * @param {AuthTokenInterceptorConfig} config - Configuration for the interceptor
 * @returns {Promise<AxiosRequestConfig} Promise that resolves in the supplied requestConfig
 */
var authTokenInterceptor = function (_a) {
    var _b = _a.header, header = _b === void 0 ? 'Authorization' : _b, _c = _a.headerPrefix, headerPrefix = _c === void 0 ? 'Bearer ' : _c, requestRefresh = _a.requestRefresh;
    return function (requestConfig) { return __awaiter(void 0, void 0, void 0, function () {
        var refreshToken, accessToken, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, exports.getRefreshToken)()];
                case 1:
                    refreshToken = _a.sent();
                    if (!refreshToken)
                        return [2 /*return*/, requestConfig
                            // Queue the request if another refresh request is currently happening
                        ];
                    // Queue the request if another refresh request is currently happening
                    if (isRefreshing) {
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                queue.push({ resolve: resolve, reject: reject });
                            })
                                .then(function (token) {
                                requestConfig.headers[header] = "" + headerPrefix + token;
                                return requestConfig;
                            })
                                .catch(Promise.reject)];
                    }
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, 5, 6]);
                    isRefreshing = true;
                    return [4 /*yield*/, (0, exports.refreshTokenIfNeeded)(requestRefresh)];
                case 3:
                    accessToken = _a.sent();
                    resolveQueue(accessToken);
                    return [3 /*break*/, 6];
                case 4:
                    error_3 = _a.sent();
                    declineQueue(error_3);
                    if (error_3 instanceof Error) {
                        error_3.message = "Unable to refresh access token for request due to token refresh error: " + error_3.message;
                    }
                    throw error_3;
                case 5:
                    isRefreshing = false;
                    return [7 /*endfinally*/];
                case 6:
                    // add token to headers
                    if (accessToken)
                        requestConfig.headers[header] = "" + headerPrefix + accessToken;
                    return [2 /*return*/, requestConfig];
            }
        });
    }); };
};
exports.authTokenInterceptor = authTokenInterceptor;
var isRefreshing = false;
var queue = [];
/**
 * Check if tokens are currently being refreshed
 *
 * @returns {boolean} True if the tokens are currently being refreshed, false is not
 */
function getIsRefreshing() {
    return isRefreshing;
}
exports.getIsRefreshing = getIsRefreshing;
/**
 * Update refresh state
 *
 * @param {boolean} newRefreshingState
 */
function setIsRefreshing(newRefreshingState) {
    isRefreshing = newRefreshingState;
}
exports.setIsRefreshing = setIsRefreshing;
/**
 * Function that resolves all items in the queue with the provided token
 * @param token New access token
 */
var resolveQueue = function (token) {
    queue.forEach(function (p) {
        p.resolve(token);
    });
    queue = [];
};
/**
 * Function that declines all items in the queue with the provided error
 * @param error Error
 */
var declineQueue = function (error) {
    queue.forEach(function (p) {
        p.reject(error);
    });
    queue = [];
};
//# sourceMappingURL=index.js.map