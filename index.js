'use strict';

const errorCodes = {
  rpc: {
    invalidInput: -32000,
    resourceNotFound: -32001,
    resourceUnavailable: -32002,
    transactionRejected: -32003,
    methodNotSupported: -32004,
    limitExceeded: -32005,
    parse: -32700,
    invalidRequest: -32600,
    methodNotFound: -32601,
    invalidParams: -32602,
    internal: -32603,
  },
  provider: {
    userRejectedRequest: 4001,
    unauthorized: 4100,
    unsupportedMethod: 4200,
    disconnected: 4900,
    chainDisconnected: 4901,
  },
};

class EthereumRpcError extends Error {
  constructor(code, message, data) {
    if (!Number.isInteger(code)) throw new Error('"code" must be an integer.');
    if (!message || typeof message !== 'string') throw new Error('"message" must be a string.');
    super(message);
    this.code = code;
    if (data !== undefined) this.data = data;
  }
  serialize() {
    const serialized = { code: this.code, message: this.message };
    if (this.data !== undefined) serialized.data = this.data;
    if (this.stack) serialized.stack = this.stack;
    return serialized;
  }
  toString() { return JSON.stringify(this.serialize()); }
}

class EthereumProviderError extends EthereumRpcError {
  constructor(code, message, data) {
    if (!isValidProviderCode(code)) throw new Error('"code" must be a valid EIP-1193 Provider error code.');
    super(code, message, data);
  }
}

function isValidProviderCode(code) {
  return Number.isInteger(code) && code >= 1000 && code <= 4999;
}

function getMessageFromCode(code, fallback = 'Unspecified error message.') {
  const codeString = code?.toString();
  for (const section of Object.values(errorCodes)) {
    const entry = Object.entries(section).find(([, v]) => v.toString() === codeString);
    if (entry) return entry[0];
  }
  return fallback;
}

const ethErrors = {
  rpc: {
    parse: (opts) => new EthereumRpcError(errorCodes.rpc.parse, (typeof opts === 'string' ? opts : opts?.message) || 'Parse error.', opts?.data),
    invalidRequest: (opts) => new EthereumRpcError(errorCodes.rpc.invalidRequest, (typeof opts === 'string' ? opts : opts?.message) || 'Invalid request.', opts?.data),
    invalidParams: (opts) => new EthereumRpcError(errorCodes.rpc.invalidParams, (typeof opts === 'string' ? opts : opts?.message) || 'Invalid params.', opts?.data),
    methodNotFound: (opts) => new EthereumRpcError(errorCodes.rpc.methodNotFound, (typeof opts === 'string' ? opts : opts?.message) || 'Method not found.', opts?.data),
    internal: (opts) => new EthereumRpcError(errorCodes.rpc.internal, (typeof opts === 'string' ? opts : opts?.message) || 'Internal error.', opts?.data),
    methodNotSupported: (opts) => new EthereumRpcError(errorCodes.rpc.methodNotSupported, (typeof opts === 'string' ? opts : opts?.message) || 'Method not supported.', opts?.data),
    limitExceeded: (opts) => new EthereumRpcError(errorCodes.rpc.limitExceeded, (typeof opts === 'string' ? opts : opts?.message) || 'Limit exceeded.', opts?.data),
  },
  provider: {
    userRejectedRequest: (opts) => new EthereumProviderError(errorCodes.provider.userRejectedRequest, (typeof opts === 'string' ? opts : opts?.message) || 'User rejected the request.', opts?.data),
    unauthorized: (opts) => new EthereumProviderError(errorCodes.provider.unauthorized, (typeof opts === 'string' ? opts : opts?.message) || 'Unauthorized.', opts?.data),
    unsupportedMethod: (opts) => new EthereumProviderError(errorCodes.provider.unsupportedMethod, (typeof opts === 'string' ? opts : opts?.message) || 'Unsupported method.', opts?.data),
    disconnected: (opts) => new EthereumProviderError(errorCodes.provider.disconnected, (typeof opts === 'string' ? opts : opts?.message) || 'Disconnected.', opts?.data),
    chainDisconnected: (opts) => new EthereumProviderError(errorCodes.provider.chainDisconnected, (typeof opts === 'string' ? opts : opts?.message) || 'Chain disconnected.', opts?.data),
  },
};

module.exports = {
  ethErrors,
  errorCodes,
  EthereumRpcError,
  EthereumProviderError,
  getMessageFromCode,
};
