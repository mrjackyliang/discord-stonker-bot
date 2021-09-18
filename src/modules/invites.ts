import axios from 'axios';
import { Guild } from 'discord.js';
import { Express } from 'express';
import _ from 'lodash';

import { generateLogMessage } from '../lib/utilities';
import { InviteGenerator } from '../typings';

/**
 * Invite generator.
 *
 * @param {Express}         server - Web server instance.
 * @param {Guild}           guild  - Discord guild.
 * @param {InviteGenerator} config - Memberful configuration.
 *
 * @since 1.0.0
 */
export default function inviteGenerator(server: Express, guild: Guild, config: InviteGenerator): void {
  const secretKey = _.get(config, 'recaptcha.secret-key', '');

  /**
   * Get.
   *
   * @since 1.0.0
   */
  server.get('/invite', (request, response) => {
    const remoteIp = request.headers['x-forwarded-for'] ?? request.socket.remoteAddress;

    // Set status and content type.
    response.status(200);
    response.contentType('text/html');

    // Send form.
    response.render('invites', {
      data: {
        ipAddress: remoteIp,
        requestUrl: request.url,
        guildName: guild.name,
        faviconUrl: _.get(config, 'design.favicon-url', ''),
        logoUrl: _.get(config, 'design.logo-url', ''),
        backgroundColor: _.get(config, 'design.background-color', 'inherit'),
        linkColor: _.get(config, 'design.link-color', 'inherit'),
        textColor: _.get(config, 'design.text-color', 'inherit'),
        injectCodeHeader: _.get(config, 'inject-code.header', ''),
        injectCodeSubmitSuccess: _.get(config, 'inject-code.submit-success', ''),
        injectCodeSubmitFail: _.get(config, 'inject-code.submit-fail', ''),
        recaptchaSiteKey: _.get(config, 'recaptcha.site-key', ''),
      },
    });
  });

  server.post('/invite', (request, response) => {
    const { token } = request.body;
    const remoteIp = request.headers['x-forwarded-for'] ?? request.socket.remoteAddress;

    axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
      params: {
        secret: secretKey,
        response: token,
        remoteip: remoteIp,
      },
    }).then((postResponse) => {
      const data = _.get(postResponse, 'data');
      const success = _.get(data, 'success', false);
      const errorCode = _.get(data, 'error-codes[0]', '');

      let errorMessage = '';

      switch (errorCode) {
        case 'missing-input-secret':
          errorMessage = 'The secret key is missing. Please contact your server administrator.';
          break;
        case 'invalid-input-secret':
          errorMessage = 'The secret key is invalid. Please contact your server administrator.';
          break;
        case 'missing-input-response':
          errorMessage = 'The token is missing.';
          break;
        case 'invalid-input-response':
          errorMessage = 'The token is invalid.';
          break;
        case 'bad-request':
          errorMessage = 'We are unable to process your request at this time. Please try again later.';
          break;
        case 'timeout-or-duplicate':
          errorMessage = 'Your token has expired or was already used. Please refresh the page and try again.';
          break;
        default:
          break;
      }

      if (!success) {
        generateLogMessage(
          `/invite: Google reCAPTCHA failed result (ip: ${remoteIp}, error-code: ${errorCode})`,
          40,
        );

        response.status(401).send(errorMessage).end();
      } else {
        const { rulesChannel } = guild;

        generateLogMessage(
          `/invite: Google reCAPTCHA success result (ip: ${remoteIp})`,
          40,
        );

        // Only generate invite link if rules channel is set.
        if (rulesChannel) {
          guild.invites.create(rulesChannel, {
            maxAge: 120,
            maxUses: 1,
            reason: `Web visitor passed the invite verification (ip: ${remoteIp})`,
          }).then((inviteResponse) => {
            const { code, url } = inviteResponse;

            generateLogMessage(
              `/invite: Invite created (code: ${code}, ip: ${remoteIp})`,
              40,
            );

            response.status(200).send(url).end();
          }).catch((error) => {
            generateLogMessage(
              '/invite: Failed to create invite',
              10,
              error,
            );

            response.status(500).send('Failed to create invite. Please contact your server administrator.').end();
          });
        } else {
          generateLogMessage(
            `/invite: Rules or guidelines channel for ${guild.name} guild is not configured`,
            10,
          );

          response.status(500).send('Rules or guidelines channel not configured. Please contact your server administrator.').end();
        }
      }
    }).catch((error) => {
      generateLogMessage(
        '/invite: Failed to contact Google reCAPTCHA API',
        10,
        error,
      );

      response.sendStatus(500).end();
    });
  });
}
