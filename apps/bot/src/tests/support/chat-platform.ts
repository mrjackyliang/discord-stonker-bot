import { EventEmitter } from 'node:events';

import type {
  Tests_Support_ChatPlatform_CreateEmptyCollection_Returns,
  Tests_Support_ChatPlatform_CreateEmptyCollection_Values,
  Tests_Support_ChatPlatform_Runner_Application,
  Tests_Support_ChatPlatform_Runner_Destroy_Returns,
  Tests_Support_ChatPlatform_Runner_EmitRateLimited_RateLimit,
  Tests_Support_ChatPlatform_Runner_EmitRateLimited_Returns,
  Tests_Support_ChatPlatform_Runner_Guilds,
  Tests_Support_ChatPlatform_Runner_Login_Returns,
  Tests_Support_ChatPlatform_Runner_Login_Token,
  Tests_Support_ChatPlatform_Runner_RateLimitEvent,
  Tests_Support_ChatPlatform_Runner_Rest,
  Tests_Support_ChatPlatform_Runner_User,
} from '../../types/tests/support/chat-platform.d.ts';

/**
 * Chat Platform - Create Empty Collection.
 *
 * Supplies the project collection surface used by an otherwise empty test client.
 *
 * @returns {Tests_Support_ChatPlatform_CreateEmptyCollection_Returns}
 *
 * @since 4.2.1
 */
function createEmptyCollection<Value>(): Tests_Support_ChatPlatform_CreateEmptyCollection_Returns<Value> {
  const values: Tests_Support_ChatPlatform_CreateEmptyCollection_Values<Value> = [];

  return {
    filter: () => createEmptyCollection(),
    first: () => [],
    get: () => undefined,
    has: () => false,
    keys: () => new Map<string, Value>().keys(),
    map: (mapper) => values.map((value) => mapper(value)),
    size: 0,
    some: () => false,
  };
}

/**
 * Chat Platform.
 *
 * Fakes the project-owned client and REST event surfaces for listener tests.
 * It never constructs an SDK client or performs network requests.
 *
 * @since 4.2.1
 */
export class Runner extends EventEmitter {
  /**
   * Chat Platform - Application.
   *
   * Starts absent like a client that has not completed login.
   *
   * @since 4.2.1
   */
  public readonly application: Tests_Support_ChatPlatform_Runner_Application = null;

  /**
   * Chat Platform - Guilds.
   *
   * Exposes an empty cache and a replaceable fetch operation for each test.
   *
   * @since 4.2.1
   */
  public readonly guilds: Tests_Support_ChatPlatform_Runner_Guilds = {
    cache: createEmptyCollection(),
    fetch: () => {
      return Promise.reject(new Error('The test chat-platform guild fetch was not configured.'));
    },
  };

  /**
   * Chat Platform - Rate Limit Event.
   *
   * Names the private event used to exercise the REST listener contract.
   *
   * @private
   *
   * @since 4.2.1
   */
  readonly #rateLimitEvent: Tests_Support_ChatPlatform_Runner_RateLimitEvent = 'rateLimited';

  /**
   * Chat Platform - REST.
   *
   * Provides inert operations plus the rate-limit subscription used by diagnostics.
   *
   * @since 4.2.1
   */
  public readonly rest: Tests_Support_ChatPlatform_Runner_Rest = {
    createInvite: () => {
      return Promise.reject(new Error('The test chat-platform invite operation was not configured.'));
    },
    createMessage: () => {
      return Promise.reject(new Error('The test chat-platform message operation was not configured.'));
    },
    createOwnReaction: async () => {
      return;
    },
    editChannelPermission: async () => {
      return;
    },
    getGuild: () => {
      return Promise.reject(new Error('The test chat-platform guild operation was not configured.'));
    },
    onRateLimited: (listener) => {
      super.on(this.#rateLimitEvent, listener);

      return;
    },
  };

  /**
   * Chat Platform - User.
   *
   * Starts absent like a client that has not completed login.
   *
   * @since 4.2.1
   */
  public readonly user: Tests_Support_ChatPlatform_Runner_User = null;

  /**
   * Chat Platform - Destroy.
   *
   * Removes every simulated Gateway and REST listener.
   *
   * @returns {Tests_Support_ChatPlatform_Runner_Destroy_Returns}
   *
   * @since 4.2.1
   */
  public destroy(): Tests_Support_ChatPlatform_Runner_Destroy_Returns {
    this.removeAllListeners();

    return;
  }

  /**
   * Chat Platform - Emit Rate Limited.
   *
   * Emits one normalized REST limit without exposing an SDK event emitter.
   *
   * @param {Tests_Support_ChatPlatform_Runner_EmitRateLimited_RateLimit} rateLimit - Rate limit.
   *
   * @returns {Tests_Support_ChatPlatform_Runner_EmitRateLimited_Returns}
   *
   * @since 4.2.1
   */
  public emitRateLimited(
    rateLimit: Tests_Support_ChatPlatform_Runner_EmitRateLimited_RateLimit,
  ): Tests_Support_ChatPlatform_Runner_EmitRateLimited_Returns {
    return super.emit(this.#rateLimitEvent, rateLimit);
  }

  /**
   * Chat Platform - Login.
   *
   * Resolves the supplied inert token without opening a Gateway connection.
   *
   * @param {Tests_Support_ChatPlatform_Runner_Login_Token} token - Token.
   *
   * @returns {Tests_Support_ChatPlatform_Runner_Login_Returns}
   *
   * @since 4.2.1
   */
  public async login(token: Tests_Support_ChatPlatform_Runner_Login_Token): Tests_Support_ChatPlatform_Runner_Login_Returns {
    return token;
  }
}
