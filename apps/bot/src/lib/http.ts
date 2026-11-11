import {
  BlockList,
  isIP,
  isIPv4,
  isIPv6,
} from 'node:net';

import { LIB_REGEX_PATTERN_HOST_HEADER } from './regex.js';

import type {
  Lib_Http_BuildCookie_Name,
  Lib_Http_BuildCookie_Options,
  Lib_Http_BuildCookie_Returns,
  Lib_Http_BuildCookie_Value,
  Lib_Http_CreateTrustedProxyRanges_Ranges,
  Lib_Http_CreateTrustedProxyRanges_Returns,
  Lib_Http_ExpandIpv6_Address,
  Lib_Http_ExpandIpv6_Halves,
  Lib_Http_ExpandIpv6_Head,
  Lib_Http_ExpandIpv6_Returns,
  Lib_Http_ExpandIpv6_Tail,
  Lib_Http_GetClientAddress_Address,
  Lib_Http_GetClientAddress_Request,
  Lib_Http_GetClientAddress_Returns,
  Lib_Http_GetClientLimitKey_Address,
  Lib_Http_GetClientLimitKey_Request,
  Lib_Http_GetClientLimitKey_Returns,
  Lib_Http_GetRequestHost_ForwardedHost,
  Lib_Http_GetRequestHost_Host,
  Lib_Http_GetRequestHost_Request,
  Lib_Http_GetRequestHost_Returns,
  Lib_Http_GetRequestHostname_Host,
  Lib_Http_GetRequestHostname_PortIndex,
  Lib_Http_GetRequestHostname_Request,
  Lib_Http_GetRequestHostname_Returns,
  Lib_Http_GetRequestOrigin_Request,
  Lib_Http_GetRequestOrigin_Returns,
  Lib_Http_GetRequestScheme_Request,
  Lib_Http_GetRequestScheme_Returns,
  Lib_Http_GetValidationIssues_Error,
  Lib_Http_GetValidationIssues_Path,
  Lib_Http_GetValidationIssues_Returns,
  Lib_Http_GetWebauthnConfiguration_Request,
  Lib_Http_GetWebauthnConfiguration_Returns,
  Lib_Http_GetWebauthnConfiguration_RpName,
  Lib_Http_HandleAsync_CallbackReturns,
  Lib_Http_HandleAsync_Handler,
  Lib_Http_HandleAsync_Next,
  Lib_Http_HandleAsync_Request,
  Lib_Http_HandleAsync_Response,
  Lib_Http_HandleAsync_Returns,
  Lib_Http_Ipv6LimitPrefixLength,
  Lib_Http_IsPasskeyAvailable_Hostname,
  Lib_Http_IsPasskeyAvailable_Request,
  Lib_Http_IsPasskeyAvailable_Returns,
  Lib_Http_IsPasskeyAvailable_UnbracketedHostname,
  Lib_Http_IsTrustedProxyAddress_Address,
  Lib_Http_IsTrustedProxyAddress_NormalizedAddress,
  Lib_Http_IsTrustedProxyAddress_Returns,
  Lib_Http_NormalizeAddress_Address,
  Lib_Http_NormalizeAddress_Returns,
  Lib_Http_NormalizeAddress_Unmapped,
  Lib_Http_ReadCookie_CookieHeader,
  Lib_Http_ReadCookie_CookiePrefix,
  Lib_Http_ReadCookie_Match,
  Lib_Http_ReadCookie_Name,
  Lib_Http_ReadCookie_Request,
  Lib_Http_ReadCookie_Returns,
  Lib_Http_SendError_Code,
  Lib_Http_SendError_Issues,
  Lib_Http_SendError_Message,
  Lib_Http_SendError_Response,
  Lib_Http_SendError_Returns,
  Lib_Http_SendError_Status,
  Lib_Http_SendValidationError_Error,
  Lib_Http_SendValidationError_FirstIssue,
  Lib_Http_SendValidationError_Issues,
  Lib_Http_SendValidationError_Message,
  Lib_Http_SendValidationError_Response,
  Lib_Http_SendValidationError_Returns,
  Lib_Http_SendValidationError_Status,
  Lib_Http_ToIpv6Groups_Part,
  Lib_Http_ToIpv6Groups_Returns,
  Lib_Http_ToIpv6Network_Address,
  Lib_Http_ToIpv6Network_Hostname,
  Lib_Http_ToIpv6Network_KeptBits,
  Lib_Http_ToIpv6Network_Network,
  Lib_Http_ToIpv6Network_PrefixLength,
  Lib_Http_ToIpv6Network_Returns,
  Lib_Http_TrustedProxyRanges,
} from '../types/lib/http.d.ts';

/**
 * HTTP - Ipv6 Limit Prefix Length.
 *
 * Sets how much of an IPv6 address identifies one client for rate and sign-in limits.
 * A /56 covers the networks a home or small office usually gets from its provider.
 *
 * @since 4.0.0
 */
const ipv6LimitPrefixLength: Lib_Http_Ipv6LimitPrefixLength = 56;

/**
 * HTTP - Trusted Proxy Ranges.
 *
 * Lists the loopback and private networks whose forwarded headers are believed.
 * A reverse proxy in the same Docker network or on the LAN needs no configuration.
 *
 * @since 4.0.0
 */
const trustedProxyRanges: Lib_Http_TrustedProxyRanges = createTrustedProxyRanges();

/**
 * HTTP - Build Cookie.
 *
 * Writes one site-wide, strict same-site cookie for the browser session pair.
 * The Secure attribute follows the scheme the visitor used to reach the app.
 *
 * @param {Lib_Http_BuildCookie_Name}    name    - Name.
 * @param {Lib_Http_BuildCookie_Value}   value   - Value.
 * @param {Lib_Http_BuildCookie_Options} options - Options.
 *
 * @returns {Lib_Http_BuildCookie_Returns}
 *
 * @since 4.0.0
 */
export function buildCookie(name: Lib_Http_BuildCookie_Name, value: Lib_Http_BuildCookie_Value, options: Lib_Http_BuildCookie_Options): Lib_Http_BuildCookie_Returns {
  return [
    `${name}=${value}`,
    'Path=/',
    'SameSite=Strict',
    `Max-Age=${options['maxAge']}`,
    ...((options['httpOnly'] === true) ? ['HttpOnly'] : []),
    ...((options['secure'] === true) ? ['Secure'] : []),
  ].join('; ');
}

/**
 * HTTP - Get Client Address.
 *
 * Returns the visitor's address as resolved through trusted private proxies.
 * IPv4 addresses that arrive in IPv6-mapped form are shown in their usual form.
 *
 * @param {Lib_Http_GetClientAddress_Request} request - Request.
 *
 * @returns {Lib_Http_GetClientAddress_Returns}
 *
 * @since 4.0.0
 */
export function getClientAddress(request: Lib_Http_GetClientAddress_Request): Lib_Http_GetClientAddress_Returns {
  const address: Lib_Http_GetClientAddress_Address = request.ip;

  if (address === undefined || address === '') {
    return 'unknown';
  }

  return normalizeAddress(address);
}

/**
 * HTTP - Get Client Limit Key.
 *
 * Returns the address that rate limits and sign-in limits count a visitor by.
 * IPv6 visitors count by their /56 network, so a new address there keeps the limit.
 *
 * @param {Lib_Http_GetClientLimitKey_Request} request - Request.
 *
 * @returns {Lib_Http_GetClientLimitKey_Returns}
 *
 * @since 4.0.0
 */
export function getClientLimitKey(request: Lib_Http_GetClientLimitKey_Request): Lib_Http_GetClientLimitKey_Returns {
  const address: Lib_Http_GetClientLimitKey_Address = getClientAddress(request);

  if (isIPv6(address) === false) {
    return address;
  }

  return toIpv6Network(address, ipv6LimitPrefixLength);
}

/**
 * HTTP - Get Request Host.
 *
 * Reads the host and port the visitor used, from a trusted proxy or the Host header.
 * Values that are not a plain hostname or address with a port are ignored.
 *
 * @param {Lib_Http_GetRequestHost_Request} request - Request.
 *
 * @returns {Lib_Http_GetRequestHost_Returns}
 *
 * @since 4.0.0
 */
export function getRequestHost(request: Lib_Http_GetRequestHost_Request): Lib_Http_GetRequestHost_Returns {
  const forwardedHost: Lib_Http_GetRequestHost_ForwardedHost = request.get('X-Forwarded-Host');
  let host: Lib_Http_GetRequestHost_Host = request.get('Host') ?? '';

  if (
    forwardedHost !== undefined
    && isTrustedProxyAddress(request.socket.remoteAddress) === true
  ) {
    host = forwardedHost.split(',')[0] ?? '';
  }

  host = host.trim().toLowerCase();

  if (host.length > 255 || LIB_REGEX_PATTERN_HOST_HEADER.test(host) === false) {
    return '';
  }

  return host;
}

/**
 * HTTP - Get Request Hostname.
 *
 * Removes the port from the visitor's host so it can serve as a passkey RP ID.
 * Bracketed IPv6 hosts keep their brackets and never qualify for passkeys.
 *
 * @param {Lib_Http_GetRequestHostname_Request} request - Request.
 *
 * @returns {Lib_Http_GetRequestHostname_Returns}
 *
 * @since 4.0.0
 */
export function getRequestHostname(request: Lib_Http_GetRequestHostname_Request): Lib_Http_GetRequestHostname_Returns {
  const host: Lib_Http_GetRequestHostname_Host = getRequestHost(request);

  if (host.startsWith('[') === true) {
    return host.slice(0, host.indexOf(']') + 1);
  }

  const portIndex: Lib_Http_GetRequestHostname_PortIndex = host.indexOf(':');

  return (portIndex === -1) ? host : host.slice(0, portIndex);
}

/**
 * HTTP - Get Request Origin.
 *
 * Combines the visitor's scheme and host into the origin used for passkey checks.
 * No configured public URL is needed because every request carries its own address.
 *
 * @param {Lib_Http_GetRequestOrigin_Request} request - Request.
 *
 * @returns {Lib_Http_GetRequestOrigin_Returns}
 *
 * @since 4.0.0
 */
export function getRequestOrigin(request: Lib_Http_GetRequestOrigin_Request): Lib_Http_GetRequestOrigin_Returns {
  return `${getRequestScheme(request)}://${getRequestHost(request)}`;
}

/**
 * HTTP - Get Request Scheme.
 *
 * Returns https when the connection or a trusted proxy reports a secure visit.
 * Express applies the trusted proxy check before reading X-Forwarded-Proto.
 *
 * @param {Lib_Http_GetRequestScheme_Request} request - Request.
 *
 * @returns {Lib_Http_GetRequestScheme_Returns}
 *
 * @since 4.0.0
 */
export function getRequestScheme(request: Lib_Http_GetRequestScheme_Request): Lib_Http_GetRequestScheme_Returns {
  return (request.protocol.toLowerCase() === 'https') ? 'https' : 'http';
}

/**
 * HTTP - Get Validation Issues.
 *
 * Converts schema failures into field-level issues for the shared error envelope.
 * The field is the dotted path, and a field the route doesn't take is reported on itself.
 *
 * @param {Lib_Http_GetValidationIssues_Error} error - Error.
 *
 * @returns {Lib_Http_GetValidationIssues_Returns}
 *
 * @since 4.0.0
 */
export function getValidationIssues(error: Lib_Http_GetValidationIssues_Error): Lib_Http_GetValidationIssues_Returns {
  return error.issues.flatMap((issue) => {
    const path: Lib_Http_GetValidationIssues_Path = issue.path.map((segment) => String(segment));

    if (issue.code === 'unrecognized_keys') {
      return issue.keys.map((key) => ({
        field: [
          ...path,
          key,
        ].join('.'),
        message: 'This field isn\'t accepted.',
        path: [
          ...path,
          key,
        ],
      }));
    }

    return [{
      field: path.join('.'),
      message: issue.message,
      path,
    }];
  });
}

/**
 * HTTP - Get Webauthn Configuration.
 *
 * Derives the passkey relying party from the hostname and origin of this request.
 * A passkey therefore only works on the hostname it was created on.
 *
 * @param {Lib_Http_GetWebauthnConfiguration_Request} request - Request.
 * @param {Lib_Http_GetWebauthnConfiguration_RpName}  rpName  - Rp name.
 *
 * @returns {Lib_Http_GetWebauthnConfiguration_Returns}
 *
 * @since 4.0.0
 */
export function getWebauthnConfiguration(request: Lib_Http_GetWebauthnConfiguration_Request, rpName: Lib_Http_GetWebauthnConfiguration_RpName): Lib_Http_GetWebauthnConfiguration_Returns {
  return {
    origin: getRequestOrigin(request),
    rpId: getRequestHostname(request),
    rpName,
  };
}

/**
 * HTTP - Handle Async.
 *
 * Forwards a rejected route promise to the Express error handler.
 * Unexpected failures then share the same generic error envelope.
 *
 * @param {Lib_Http_HandleAsync_Handler} handler - Handler.
 *
 * @returns {Lib_Http_HandleAsync_Returns}
 *
 * @since 4.0.0
 */
export function handleAsync(handler: Lib_Http_HandleAsync_Handler): Lib_Http_HandleAsync_Returns {
  return (request: Lib_Http_HandleAsync_Request, response: Lib_Http_HandleAsync_Response, next: Lib_Http_HandleAsync_Next): Lib_Http_HandleAsync_CallbackReturns => {
    handler(request, response, next).catch(next);

    return;
  };
}

/**
 * HTTP - Is Passkey Available.
 *
 * Mirrors the browser rule that passkeys need a domain name over https or localhost.
 * Visits by bare IP address fall back to the password and authenticator app.
 *
 * @param {Lib_Http_IsPasskeyAvailable_Request} request - Request.
 *
 * @returns {Lib_Http_IsPasskeyAvailable_Returns}
 *
 * @since 4.0.0
 */
export function isPasskeyAvailable(request: Lib_Http_IsPasskeyAvailable_Request): Lib_Http_IsPasskeyAvailable_Returns {
  const hostname: Lib_Http_IsPasskeyAvailable_Hostname = getRequestHostname(request);
  const unbracketedHostname: Lib_Http_IsPasskeyAvailable_UnbracketedHostname = (hostname.startsWith('[') === true) ? hostname.slice(1, -1) : hostname;

  if (hostname === '' || isIP(unbracketedHostname) !== 0) {
    return false;
  }

  return (
    getRequestScheme(request) === 'https'
    || hostname === 'localhost'
    || hostname.endsWith('.localhost') === true
  );
}

/**
 * HTTP - Is Trusted Proxy Address.
 *
 * Checks whether a connecting address is loopback or private, and so may forward headers.
 * Public senders are never trusted, so a direct visitor cannot fake their address.
 *
 * @param {Lib_Http_IsTrustedProxyAddress_Address} address - Address.
 *
 * @returns {Lib_Http_IsTrustedProxyAddress_Returns}
 *
 * @since 4.0.0
 */
export function isTrustedProxyAddress(address: Lib_Http_IsTrustedProxyAddress_Address): Lib_Http_IsTrustedProxyAddress_Returns {
  if (address === undefined || address === '') {
    return false;
  }

  const normalizedAddress: Lib_Http_IsTrustedProxyAddress_NormalizedAddress = normalizeAddress(address);

  if (isIPv4(normalizedAddress) === true) {
    return trustedProxyRanges.check(normalizedAddress, 'ipv4');
  }

  if (isIP(normalizedAddress) === 6) {
    return trustedProxyRanges.check(normalizedAddress, 'ipv6');
  }

  return false;
}

/**
 * HTTP - Read Cookie.
 *
 * Extracts one exact cookie value without accepting aliases or query values.
 * Undecodable values are treated as missing.
 *
 * @param {Lib_Http_ReadCookie_Request} request - Request.
 * @param {Lib_Http_ReadCookie_Name}    name    - Name.
 *
 * @returns {Lib_Http_ReadCookie_Returns}
 *
 * @since 4.0.0
 */
export function readCookie(request: Lib_Http_ReadCookie_Request, name: Lib_Http_ReadCookie_Name): Lib_Http_ReadCookie_Returns {
  const cookieHeader: Lib_Http_ReadCookie_CookieHeader = request.get('Cookie');

  if (cookieHeader === undefined) {
    return undefined;
  }

  const cookiePrefix: Lib_Http_ReadCookie_CookiePrefix = `${name}=`;
  const match: Lib_Http_ReadCookie_Match = cookieHeader
    .split(';')
    .map((cookiePart) => cookiePart.trim())
    .find((cookiePart) => cookiePart.startsWith(cookiePrefix));

  if (match === undefined) {
    return undefined;
  }

  try {
    return decodeURIComponent(match.slice(cookiePrefix.length));
  } catch {
    return undefined;
  }
}

/**
 * HTTP - Send Error.
 *
 * Writes the shared error envelope used on every failed API response.
 * Issues are included only when a request failed field validation.
 *
 * @param {Lib_Http_SendError_Response} response - Response.
 * @param {Lib_Http_SendError_Status}   status   - Status.
 * @param {Lib_Http_SendError_Code}     code     - Code.
 * @param {Lib_Http_SendError_Message}  message  - Message.
 * @param {Lib_Http_SendError_Issues}   [issues] - Issues.
 *
 * @returns {Lib_Http_SendError_Returns}
 *
 * @since 4.0.0
 */
export function sendError(response: Lib_Http_SendError_Response, status: Lib_Http_SendError_Status, code: Lib_Http_SendError_Code, message: Lib_Http_SendError_Message, issues?: Lib_Http_SendError_Issues): Lib_Http_SendError_Returns {
  response.status(status).json({
    error: {
      code,
      message,
      ...((issues === undefined) ? {} : { issues }),
    },
  });

  return;
}

/**
 * HTTP - Send Validation Error.
 *
 * Reports a request that failed its schema, with one issue per invalid field.
 * The first issue's message doubles as the summary, with a fallback when none exists.
 *
 * @param {Lib_Http_SendValidationError_Response} response        - Response.
 * @param {Lib_Http_SendValidationError_Status}   status          - Status.
 * @param {Lib_Http_SendValidationError_Error}    error           - Error.
 * @param {Lib_Http_SendValidationError_Message}  fallbackMessage - Fallback message.
 *
 * @returns {Lib_Http_SendValidationError_Returns}
 *
 * @since 4.0.0
 */
export function sendValidationError(response: Lib_Http_SendValidationError_Response, status: Lib_Http_SendValidationError_Status, error: Lib_Http_SendValidationError_Error, fallbackMessage: Lib_Http_SendValidationError_Message): Lib_Http_SendValidationError_Returns {
  const issues: Lib_Http_SendValidationError_Issues = getValidationIssues(error);
  const firstIssue: Lib_Http_SendValidationError_FirstIssue = issues[0];

  sendError(response, status, 'invalid_request', (firstIssue === undefined) ? fallbackMessage : firstIssue['message'], issues);

  return;
}

/**
 * HTTP - Create Trusted Proxy Ranges.
 *
 * Builds the fixed list of loopback and private networks trusted as proxies.
 * The list intentionally has no setting, so every LAN proxy works out of the box.
 *
 * @returns {Lib_Http_CreateTrustedProxyRanges_Returns}
 *
 * @since 4.0.0
 */
function createTrustedProxyRanges(): Lib_Http_CreateTrustedProxyRanges_Returns {
  const ranges: Lib_Http_CreateTrustedProxyRanges_Ranges = new BlockList();

  ranges.addSubnet('127.0.0.0', 8, 'ipv4');

  ranges.addSubnet('10.0.0.0', 8, 'ipv4');

  ranges.addSubnet('172.16.0.0', 12, 'ipv4');

  ranges.addSubnet('192.168.0.0', 16, 'ipv4');

  ranges.addAddress('::1', 'ipv6');

  ranges.addSubnet('fc00::', 7, 'ipv6');

  return ranges;
}

/**
 * HTTP - Expand Ipv6.
 *
 * Writes out all eight 16-bit groups of an IPv6 address, filling in the :: shorthand.
 * A zone such as %en0 is dropped, because it names a local interface, not an address.
 *
 * @param {Lib_Http_ExpandIpv6_Address} address - Address.
 *
 * @returns {Lib_Http_ExpandIpv6_Returns}
 *
 * @since 4.0.0
 */
function expandIpv6(address: Lib_Http_ExpandIpv6_Address): Lib_Http_ExpandIpv6_Returns {
  const halves: Lib_Http_ExpandIpv6_Halves = (address.split('%')[0] ?? address).split('::');
  const head: Lib_Http_ExpandIpv6_Head = toIpv6Groups(halves[0]);
  const tail: Lib_Http_ExpandIpv6_Tail = toIpv6Groups(halves[1]);

  return [
    ...head,
    ...new Array<number>(8 - head.length - tail.length).fill(0),
    ...tail,
  ];
}

/**
 * HTTP - Normalize Address.
 *
 * Rewrites an IPv6-mapped IPv4 address such as ::ffff:10.0.0.5 to 10.0.0.5.
 * Other addresses are returned unchanged.
 *
 * @param {Lib_Http_NormalizeAddress_Address} address - Address.
 *
 * @returns {Lib_Http_NormalizeAddress_Returns}
 *
 * @since 4.0.0
 */
function normalizeAddress(address: Lib_Http_NormalizeAddress_Address): Lib_Http_NormalizeAddress_Returns {
  const unmapped: Lib_Http_NormalizeAddress_Unmapped = (address.toLowerCase().startsWith('::ffff:') === true) ? address.slice(7) : address;

  return (isIPv4(unmapped) === true) ? unmapped : address;
}

/**
 * HTTP - To Ipv6 Groups.
 *
 * Parses the colon-separated groups on one side of an IPv6 :: shorthand.
 * An embedded IPv4 tail fills two groups, and the limit prefix always masks it away.
 *
 * @param {Lib_Http_ToIpv6Groups_Part} part - Part.
 *
 * @returns {Lib_Http_ToIpv6Groups_Returns}
 *
 * @since 4.0.0
 */
function toIpv6Groups(part: Lib_Http_ToIpv6Groups_Part): Lib_Http_ToIpv6Groups_Returns {
  if (part === undefined || part === '') {
    return [];
  }

  return part.split(':').flatMap((group) => ((group.includes('.') === true) ? [
    0,
    0,
  ] : [Number.parseInt(group, 16)]));
}

/**
 * HTTP - To Ipv6 Network.
 *
 * Keeps the first bits of an IPv6 address and writes that network in CIDR form.
 * The URL parser gives the network its shortest standard spelling.
 *
 * @param {Lib_Http_ToIpv6Network_Address}      address      - Address.
 * @param {Lib_Http_ToIpv6Network_PrefixLength} prefixLength - Prefix length.
 *
 * @returns {Lib_Http_ToIpv6Network_Returns}
 *
 * @since 4.0.0
 */
function toIpv6Network(address: Lib_Http_ToIpv6Network_Address, prefixLength: Lib_Http_ToIpv6Network_PrefixLength): Lib_Http_ToIpv6Network_Returns {
  const network: Lib_Http_ToIpv6Network_Network = expandIpv6(address).map((group, index) => {
    const keptBits: Lib_Http_ToIpv6Network_KeptBits = Math.min(Math.max(prefixLength - (index * 16), 0), 16);

    return group - (group % (2 ** (16 - keptBits)));
  });
  const hostname: Lib_Http_ToIpv6Network_Hostname = new URL(`http://[${network.map((group) => group.toString(16)).join(':')}]`).hostname;

  return `${hostname.slice(1, -1)}/${prefixLength}`;
}
