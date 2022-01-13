import axios from 'axios';
import { Guild } from 'discord.js';
import { Express } from 'express';
import _ from 'lodash';

import { generateLogMessage } from '../lib/utilities';
import { InviteGenerator } from '../types';

/**
 * Invite generator.
 *
 * @param {Express}         server - Web server instance.
 * @param {Guild}           guild  - Discord guild.
 * @param {InviteGenerator} config - Memberful configuration.
 *
 * @since 1.0.0
 */
export function inviteGenerator(server: Express, guild: Guild, config: InviteGenerator): void {
  const path = _.get(config, 'path');
  const options = _.get(config, 'options');
  const secretKey = _.get(config, 'recaptcha.secret-key', '');

  // Path must exist before invite generator starts.
  if (_.isString(path) && !_.isEmpty(path)) {
    generateLogMessage(
      [
        'Initialized web page',
        `(function: inviteGenerator, path: ${path})`,
      ].join(' '),
      30,
    );

    /**
     * Get.
     *
     * @since 1.0.0
     */
    server.get(path, (request, response) => {
      // Set status and content type.
      response.status(200);
      response.contentType('text/html');

      // Send form.
      response.render('invites', {
        data: {
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

    /**
     * Post.
     *
     * @since 1.0.0
     */
    server.post(path, (request, response) => {
      const { token } = request.body;

      axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
        params: {
          secret: secretKey,
          response: token,
        },
      }).then((postResponse) => {
        const data = _.get(postResponse, 'data');
        const success = _.get(data, 'success', false);
        const errorCode = _.get(data, 'error-codes[0]', '');

        let errorMessage;

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
            errorMessage = 'Unknown error.';
            break;
        }

        if (!success) {
          generateLogMessage(
            [
              'Google reCAPTCHA result',
              `(function: inviteGenerator, success: ${success}, error code: ${errorCode})`,
            ].join(' '),
            20,
          );

          response.status(401).send(errorMessage);
        } else {
          const { rulesChannel } = guild;

          generateLogMessage(
            [
              'Google reCAPTCHA result',
              `(function: inviteGenerator, success: ${success})`,
            ].join(' '),
            30,
          );

          // Only generate invite link if rules channel is set.
          if (rulesChannel) {
            guild.invites.create(rulesChannel, {
              maxAge: _.get(options, 'max-age', 120),
              maxUses: _.get(options, 'max-uses', 1),
              reason: 'Web visitor passed the invite verification',
            }).then((inviteResponse) => {
              const {
                code,
                url,
              } = inviteResponse;

              generateLogMessage(
                [
                  'Invite created',
                  `(function: inviteGenerator, code: ${code})`,
                ].join(' '),
                30,
              );

              response.status(200).send(url);
            }).catch((error: any) => {
              generateLogMessage(
                [
                  'Failed to create invite',
                  `(function: inviteGenerator, rules channel: ${rulesChannel.toString()})`,
                ].join(' '),
                10,
                error,
              );

              response.status(500).send('Failed to create invite. Please contact your server administrator.');
            });
          } else {
            generateLogMessage(
              [
                'Rules or guidelines channel is not configured',
                '(function: inviteGenerator)',
              ].join(' '),
              10,
            );

            response.status(500).send('Rules or guidelines channel not configured. Please contact your server administrator.');
          }
        }
      }).catch((error: any) => {
        generateLogMessage(
          [
            'Failed to contact Google reCAPTCHA API',
            '(function: inviteGenerator)',
          ].join(' '),
          10,
          error,
        );

        response.sendStatus(500);
      });
    });
  }
}