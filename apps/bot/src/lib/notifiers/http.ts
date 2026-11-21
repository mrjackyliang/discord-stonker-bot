import type {
  Lib_Notifiers_Http_Runner_DescribeError_Error,
  Lib_Notifiers_Http_Runner_DescribeError_Returns,
  Lib_Notifiers_Http_Runner_DescribeResponse_Body,
  Lib_Notifiers_Http_Runner_DescribeResponse_Candidate,
  Lib_Notifiers_Http_Runner_DescribeResponse_Detail,
  Lib_Notifiers_Http_Runner_DescribeResponse_Parsed,
  Lib_Notifiers_Http_Runner_DescribeResponse_Response,
  Lib_Notifiers_Http_Runner_DescribeResponse_Returns,
  Lib_Notifiers_Http_Runner_IsHttpUrl_Protocols,
  Lib_Notifiers_Http_Runner_IsHttpUrl_Returns,
  Lib_Notifiers_Http_Runner_IsHttpUrl_Url,
  Lib_Notifiers_Http_Runner_IsHttpUrl_Value,
  Lib_Notifiers_Http_Runner_Send_Fetch,
  Lib_Notifiers_Http_Runner_Send_Request,
  Lib_Notifiers_Http_Runner_Send_Response,
  Lib_Notifiers_Http_Runner_Send_Returns,
  Lib_Notifiers_Http_Runner_TrimTrailingSlashes_End,
  Lib_Notifiers_Http_Runner_TrimTrailingSlashes_Returns,
  Lib_Notifiers_Http_Runner_TrimTrailingSlashes_Value,
} from '../../types/lib/notifiers/http.d.ts';

/**
 * HTTP.
 *
 * Delivers an adapter's request with the shared deadline and converts failures
 * to the same bounded messages the dashboard has always shown.
 *
 * @since 4.2.1
 */
export class Runner {
  /**
   * HTTP - Send.
   *
   * Sends one HTTP request with the existing ten-second deadline.
   * Refusals and transport failures are returned instead of thrown.
   *
   * @param {Lib_Notifiers_Http_Runner_Send_Request} request - Request.
   * @param {Lib_Notifiers_Http_Runner_Send_Fetch}   fetcher - Fetcher.
   *
   * @returns {Lib_Notifiers_Http_Runner_Send_Returns}
   *
   * @since 4.2.1
   */
  public static async send(request: Lib_Notifiers_Http_Runner_Send_Request, fetcher: Lib_Notifiers_Http_Runner_Send_Fetch): Lib_Notifiers_Http_Runner_Send_Returns {
    let response: Lib_Notifiers_Http_Runner_Send_Response = undefined;

    try {
      response = await fetcher(request['url'], {
        body: request['body'],
        headers: request['headers'],
        method: request['method'],
        signal: AbortSignal.timeout(10_000),
      });
    } catch (error) {
      return {
        delivered: false,
        message: Runner.describeError(error),
      };
    }

    if (response.ok === false) {
      return {
        delivered: false,
        message: await Runner.describeResponse(response),
      };
    }

    return { delivered: true };
  }

  /**
   * HTTP - Describe Error.
   *
   * Turns a transport or mail error into the short reason stored on a target.
   * Timeout and abort errors retain the established plain-language message.
   *
   * @param {Lib_Notifiers_Http_Runner_DescribeError_Error} error - Error.
   *
   * @returns {Lib_Notifiers_Http_Runner_DescribeError_Returns}
   *
   * @since 4.2.1
   */
  public static describeError(error: Lib_Notifiers_Http_Runner_DescribeError_Error): Lib_Notifiers_Http_Runner_DescribeError_Returns {
    if (
      error instanceof Error
      && (
        error.name === 'TimeoutError'
        || error.name === 'AbortError'
      )
    ) {
      return 'No answer within 10 seconds.';
    }

    return ((error instanceof Error) ? error.message : String(error)).slice(0, 200);
  }

  /**
   * HTTP - Is HTTP URL.
   *
   * Checks an absolute URL against the protocols chosen by one service adapter.
   * Credentials remain allowed because some supported services put tokens there.
   *
   * @param {Lib_Notifiers_Http_Runner_IsHttpUrl_Value}     value     - Value.
   * @param {Lib_Notifiers_Http_Runner_IsHttpUrl_Protocols} protocols - Protocols.
   *
   * @returns {Lib_Notifiers_Http_Runner_IsHttpUrl_Returns}
   *
   * @since 4.2.1
   */
  public static isHttpUrl(value: Lib_Notifiers_Http_Runner_IsHttpUrl_Value, protocols: Lib_Notifiers_Http_Runner_IsHttpUrl_Protocols): Lib_Notifiers_Http_Runner_IsHttpUrl_Returns {
    try {
      const url: Lib_Notifiers_Http_Runner_IsHttpUrl_Url = new URL(value);

      return protocols.includes(url.protocol) && url.hostname !== '';
    } catch {
      return false;
    }
  }

  /**
   * HTTP - Trim Trailing Slashes.
   *
   * Removes trailing slashes before an adapter appends a fixed service path.
   * The rest of the configured URL remains byte-for-byte unchanged.
   *
   * @param {Lib_Notifiers_Http_Runner_TrimTrailingSlashes_Value} value - Value.
   *
   * @returns {Lib_Notifiers_Http_Runner_TrimTrailingSlashes_Returns}
   *
   * @since 4.2.1
   */
  public static trimTrailingSlashes(value: Lib_Notifiers_Http_Runner_TrimTrailingSlashes_Value): Lib_Notifiers_Http_Runner_TrimTrailingSlashes_Returns {
    let end: Lib_Notifiers_Http_Runner_TrimTrailingSlashes_End = value.length;

    while (end > 0 && value.charAt(end - 1) === '/') {
      end -= 1;
    }

    return value.slice(0, end);
  }

  /**
   * HTTP - Describe Response.
   *
   * Adds a service's bounded JSON or first-line reason to its HTTP status.
   * Long error pages cannot flood the destination row.
   *
   * @param {Lib_Notifiers_Http_Runner_DescribeResponse_Response} response - Response.
   *
   * @private
   *
   * @returns {Lib_Notifiers_Http_Runner_DescribeResponse_Returns}
   *
   * @since 4.2.1
   */
  private static async describeResponse(response: Lib_Notifiers_Http_Runner_DescribeResponse_Response): Lib_Notifiers_Http_Runner_DescribeResponse_Returns {
    let detail: Lib_Notifiers_Http_Runner_DescribeResponse_Detail = '';

    try {
      const body: Lib_Notifiers_Http_Runner_DescribeResponse_Body = (await response.text()).trim();

      try {
        const parsed: Lib_Notifiers_Http_Runner_DescribeResponse_Parsed = JSON.parse(body);

        for (const key of [
          'description',
          'message',
          'error',
        ]) {
          const candidate: Lib_Notifiers_Http_Runner_DescribeResponse_Candidate = parsed[key];

          if (typeof candidate === 'string' && candidate !== '') {
            detail = candidate;

            break;
          }
        }
      } catch {
        detail = body.split('\n')[0] ?? '';
      }
    } catch {
      detail = '';
    }

    return (detail === '') ? `HTTP ${String(response.status)}` : `HTTP ${String(response.status)}: ${detail.slice(0, 200)}`;
  }
}
