import axios from 'axios';
import express from 'express';
import fs from 'fs';
import http from 'http';
import https from 'https';
import _ from 'lodash';
import numeral from 'numeral';
import path from 'path';

import {
  fetchFormattedDate,
  generateLogMessage,
  generateUserAgent,
  getTextBasedChannel,
  trackRoute,
  trackRouteIsTracked,
} from '../lib/utility';
import {
  InviteGeneratorGuild,
  InviteGeneratorReturns,
  InviteGeneratorSettings,
  InviteGeneratorSettingsDesignBackgroundColor,
  InviteGeneratorSettingsDesignLinkColor,
  InviteGeneratorSettingsDesignTextColor,
  InviteGeneratorSettingsImagesFaviconUrl,
  InviteGeneratorSettingsImagesLogoUrl,
  InviteGeneratorSettingsInjectCodeFooterAreaCode,
  InviteGeneratorSettingsInjectCodeFooterAreas,
  InviteGeneratorSettingsInjectCodeHeaderAreaCode,
  InviteGeneratorSettingsInjectCodeHeaderAreas,
  InviteGeneratorSettingsInjectCodeSubmitFailCode,
  InviteGeneratorSettingsInjectCodeSubmitFails,
  InviteGeneratorSettingsInjectCodeSubmitSuccessCode,
  InviteGeneratorSettingsInjectCodeSubmitSuccesses,
  InviteGeneratorSettingsOptionsErrorPostfix,
  InviteGeneratorSettingsOptionsMaxAge,
  InviteGeneratorSettingsOptionsMaxUses,
  InviteGeneratorSettingsOptionsPath,
  InviteGeneratorSettingsRecaptchaSecretKey,
  InviteGeneratorSettingsRecaptchaSiteKey,
  InviteGeneratorWebServer,
  MapWebhooksEventChannelChannelId,
  MapWebhooksEventName,
  MapWebhooksEventPath,
  MapWebhooksEventPayload,
  MapWebhooksEventReplacementFlags,
  MapWebhooksEventReplacementPattern,
  MapWebhooksEventReplacementReplaceWith,
  MapWebhooksEventReplacements,
  MapWebhooksEvents,
  MapWebhooksEventVariableId,
  MapWebhooksEventVariablePath,
  MapWebhooksEventVariables,
  MapWebhooksEventVariableType,
  MapWebhooksGuild,
  MapWebhooksReplaceVariablesAndTextEventKey,
  MapWebhooksReplaceVariablesAndTextEventName,
  MapWebhooksReplaceVariablesAndTextEventPayload,
  MapWebhooksReplaceVariablesAndTextEventReplacements,
  MapWebhooksReplaceVariablesAndTextEventVariables,
  MapWebhooksReplaceVariablesAndTextRequestBody,
  MapWebhooksReplaceVariablesAndTextReturns,
  MapWebhooksReturns,
  MapWebhooksWebServer,
  WebApplicationsSetupGuild,
  WebApplicationsSetupHttpServerReturns,
  WebApplicationsSetupHttpsServerReturns,
  WebApplicationsSetupReturns,
  WebApplicationsSetupSettings,
  WebApplicationsSetupSettingsHttpServer,
  WebApplicationsSetupSettingsHttpServerPort,
  WebApplicationsSetupSettingsHttpsServer,
  WebApplicationsSetupSettingsHttpsServerCa,
  WebApplicationsSetupSettingsHttpsServerCert,
  WebApplicationsSetupSettingsHttpsServerKey,
  WebApplicationsSetupSettingsHttpsServerPort,
  WebApplicationsSetupSettingsInviteGenerator,
  WebApplicationsSetupSettingsMapWebhooks,
} from '../types';
import {
  ApiGoogleRecaptchaVerify,
  ApiGoogleRecaptchaVerifyErrorCode,
  ApiGoogleRecaptchaVerifyErrorCodes,
  ApiGoogleRecaptchaVerifySuccess,
} from '../types/api';

/**
 * Invite generator.
 *
 * @param {InviteGeneratorGuild}     guild     - Guild.
 * @param {InviteGeneratorWebServer} webServer - Web server.
 * @param {InviteGeneratorSettings}  settings  - Settings.
 *
 * @returns {InviteGeneratorReturns}
 *
 * @since 1.0.0
 */
export function inviteGenerator(guild: InviteGeneratorGuild, webServer: InviteGeneratorWebServer, settings: InviteGeneratorSettings): InviteGeneratorReturns {
  const guildName = guild.name;
  const guildInvites = guild.invites;
  const guildRulesChannel = guild.rulesChannel;

  const settingsOptionsPath = <InviteGeneratorSettingsOptionsPath>_.get(settings, ['options', 'path']);
  const settingsOptionsErrorPostfix = <InviteGeneratorSettingsOptionsErrorPostfix>_.get(settings, ['options', 'error-postfix']);
  const settingsOptionsMaxAge = <InviteGeneratorSettingsOptionsMaxAge>_.get(settings, ['options', 'max-age']);
  const settingsOptionsMaxUses = <InviteGeneratorSettingsOptionsMaxUses>_.get(settings, ['options', 'max-uses']);
  const settingsDesignBackgroundColor = <InviteGeneratorSettingsDesignBackgroundColor>_.get(settings, ['design', 'background-color']);
  const settingsDesignLinkColor = <InviteGeneratorSettingsDesignLinkColor>_.get(settings, ['design', 'link-color']);
  const settingsDesignTextColor = <InviteGeneratorSettingsDesignTextColor>_.get(settings, ['design', 'text-color']);
  const settingsImagesFaviconUrl = <InviteGeneratorSettingsImagesFaviconUrl>_.get(settings, ['images', 'favicon-url']);
  const settingsImagesLogoUrl = <InviteGeneratorSettingsImagesLogoUrl>_.get(settings, ['images', 'logo-url']);
  const settingsInjectCodeHeaderAreas = <InviteGeneratorSettingsInjectCodeHeaderAreas>_.get(settings, ['inject-code', 'header-areas']);
  const settingsInjectCodeFooterAreas = <InviteGeneratorSettingsInjectCodeFooterAreas>_.get(settings, ['inject-code', 'footer-areas']);
  const settingsInjectCodeSubmitSuccesses = <InviteGeneratorSettingsInjectCodeSubmitSuccesses>_.get(settings, ['inject-code', 'submit-successes']);
  const settingsInjectCodeSubmitFails = <InviteGeneratorSettingsInjectCodeSubmitFails>_.get(settings, ['inject-code', 'submit-fails']);
  const settingsRecaptchaSiteKey = <InviteGeneratorSettingsRecaptchaSiteKey>_.get(settings, ['recaptcha', 'site-key']);
  const settingsRecaptchaSecretKey = <InviteGeneratorSettingsRecaptchaSecretKey>_.get(settings, ['recaptcha', 'secret-key']);

  const headerAreaCodes = _.map(settingsInjectCodeHeaderAreas, (settingsInjectCodeHeaderArea) => <InviteGeneratorSettingsInjectCodeHeaderAreaCode>_.get(settingsInjectCodeHeaderArea, ['code']));
  const footerAreaCodes = _.map(settingsInjectCodeFooterAreas, (settingsInjectCodeFooterArea) => <InviteGeneratorSettingsInjectCodeFooterAreaCode>_.get(settingsInjectCodeFooterArea, ['code']));
  const submitSuccessCodes = _.map(settingsInjectCodeSubmitSuccesses, (settingsInjectCodeSubmitSuccess) => <InviteGeneratorSettingsInjectCodeSubmitSuccessCode>_.get(settingsInjectCodeSubmitSuccess, ['code']));
  const submitFailCodes = _.map(settingsInjectCodeSubmitFails, (settingsInjectCodeSubmitFail) => <InviteGeneratorSettingsInjectCodeSubmitFailCode>_.get(settingsInjectCodeSubmitFail, ['code']));

  // If "invite-generator" is not configured.
  if (settings === undefined) {
    generateLogMessage(
      [
        '"invite-generator" is not configured',
        `(function: inviteGenerator, settings: ${JSON.stringify(settings)})`,
      ].join(' '),
      40,
    );

    return;
  }

  // If "invite-generator.options.path" is not configured properly.
  if (
    !_.isString(settingsOptionsPath)
    || _.isEmpty(settingsOptionsPath)
  ) {
    generateLogMessage(
      [
        '"invite-generator.options.path" is not configured properly',
        `(function: inviteGenerator, path: ${JSON.stringify(settingsOptionsPath)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "invite-generator.options.error-postfix" is not configured properly.
  if (
    settingsOptionsErrorPostfix !== undefined
    && (
      !_.isString(settingsOptionsErrorPostfix)
      || _.isEmpty(settingsOptionsErrorPostfix)
    )
  ) {
    generateLogMessage(
      [
        '"invite-generator.options.error-postfix" is not configured properly',
        `(function: inviteGenerator, error postfix: ${JSON.stringify(settingsOptionsErrorPostfix)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "invite-generator.options.max-age" is not configured properly.
  if (
    settingsOptionsMaxAge !== undefined
    && !_.isNumber(settingsOptionsMaxAge)
  ) {
    generateLogMessage(
      [
        '"invite-generator.options.max-age" is not configured properly',
        `(function: inviteGenerator, max age: ${JSON.stringify(settingsOptionsMaxAge)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "invite-generator.options.max-uses" is not configured properly.
  if (
    settingsOptionsMaxUses !== undefined
    && !_.isNumber(settingsOptionsMaxUses)
  ) {
    generateLogMessage(
      [
        '"invite-generator.options.max-uses" is not configured properly',
        `(function: inviteGenerator, max uses: ${JSON.stringify(settingsOptionsMaxUses)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "invite-generator.design.background-color" is not configured properly.
  if (
    settingsDesignBackgroundColor !== undefined
    && (
      !_.isString(settingsDesignBackgroundColor)
      || _.isEmpty(settingsDesignBackgroundColor)
    )
  ) {
    generateLogMessage(
      [
        '"invite-generator.design.background-color" is not configured properly',
        `(function: inviteGenerator, background color: ${JSON.stringify(settingsDesignBackgroundColor)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "invite-generator.design.link-color" is not configured properly.
  if (
    settingsDesignLinkColor !== undefined
    && (
      !_.isString(settingsDesignLinkColor)
      || _.isEmpty(settingsDesignLinkColor)
    )
  ) {
    generateLogMessage(
      [
        '"invite-generator.design.link-color" is not configured properly',
        `(function: inviteGenerator, link color: ${JSON.stringify(settingsDesignLinkColor)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "invite-generator.design.text-color" is not configured properly.
  if (
    settingsDesignTextColor !== undefined
    && (
      !_.isString(settingsDesignTextColor)
      || _.isEmpty(settingsDesignTextColor)
    )
  ) {
    generateLogMessage(
      [
        '"invite-generator.design.text-color" is not configured properly',
        `(function: inviteGenerator, text color: ${JSON.stringify(settingsDesignTextColor)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "invite-generator.images.favicon-url" is not configured properly.
  if (
    settingsImagesFaviconUrl !== undefined
    && (
      !_.isString(settingsImagesFaviconUrl)
      || _.isEmpty(settingsImagesFaviconUrl)
    )
  ) {
    generateLogMessage(
      [
        '"invite-generator.images.favicon-url" is not configured properly',
        `(function: inviteGenerator, favicon url: ${JSON.stringify(settingsImagesFaviconUrl)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "invite-generator.images.logo-url" is not configured properly.
  if (
    settingsImagesLogoUrl !== undefined
    && (
      !_.isString(settingsImagesLogoUrl)
      || _.isEmpty(settingsImagesLogoUrl)
    )
  ) {
    generateLogMessage(
      [
        '"invite-generator.images.logo-url" is not configured properly',
        `(function: inviteGenerator, logo url: ${JSON.stringify(settingsImagesLogoUrl)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "invite-generator.inject-code.header-areas" is not configured properly.
  if (
    settingsInjectCodeHeaderAreas !== undefined
    && (
      !_.isArray(settingsInjectCodeHeaderAreas)
      || _.isEmpty(settingsInjectCodeHeaderAreas)
      || !_.every(settingsInjectCodeHeaderAreas, (settingsInjectCodeHeaderArea) => _.isPlainObject(settingsInjectCodeHeaderArea) && !_.isEmpty(settingsInjectCodeHeaderArea))
      || !_.every(headerAreaCodes, (headerAreaCode) => _.isString(headerAreaCode) && !_.isEmpty(headerAreaCode))
    )
  ) {
    generateLogMessage(
      [
        '"invite-generator.inject-code.header-areas" is not configured properly',
        `(function: inviteGenerator, header areas: ${JSON.stringify(settingsInjectCodeHeaderAreas)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "invite-generator.inject-code.footer-areas" is not configured properly.
  if (
    settingsInjectCodeFooterAreas !== undefined
    && (
      !_.isArray(settingsInjectCodeFooterAreas)
      || _.isEmpty(settingsInjectCodeFooterAreas)
      || !_.every(settingsInjectCodeFooterAreas, (settingsInjectCodeFooterArea) => _.isPlainObject(settingsInjectCodeFooterArea) && !_.isEmpty(settingsInjectCodeFooterArea))
      || !_.every(footerAreaCodes, (footerAreaCode) => _.isString(footerAreaCode) && !_.isEmpty(footerAreaCode))
    )
  ) {
    generateLogMessage(
      [
        '"invite-generator.inject-code.footer-areas" is not configured properly',
        `(function: inviteGenerator, footer areas: ${JSON.stringify(settingsInjectCodeFooterAreas)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "invite-generator.inject-code.submit-successes" is not configured properly.
  if (
    settingsInjectCodeSubmitSuccesses !== undefined
    && (
      !_.isArray(settingsInjectCodeSubmitSuccesses)
      || _.isEmpty(settingsInjectCodeSubmitSuccesses)
      || !_.every(settingsInjectCodeSubmitSuccesses, (settingsInjectCodeSubmitSuccess) => _.isPlainObject(settingsInjectCodeSubmitSuccess) && !_.isEmpty(settingsInjectCodeSubmitSuccess))
      || !_.every(submitSuccessCodes, (submitSuccessCode) => _.isString(submitSuccessCode) && !_.isEmpty(submitSuccessCode))
    )
  ) {
    generateLogMessage(
      [
        '"invite-generator.inject-code.submit-successes" is not configured properly',
        `(function: inviteGenerator, submit successes: ${JSON.stringify(settingsInjectCodeSubmitSuccesses)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "invite-generator.inject-code.submit-fails" is not configured properly.
  if (
    settingsInjectCodeSubmitFails !== undefined
    && (
      !_.isArray(settingsInjectCodeSubmitFails)
      || _.isEmpty(settingsInjectCodeSubmitFails)
      || !_.every(settingsInjectCodeSubmitFails, (settingsInjectCodeSubmitFail) => _.isPlainObject(settingsInjectCodeSubmitFail) && !_.isEmpty(settingsInjectCodeSubmitFail))
      || !_.every(submitFailCodes, (submitFailCode) => _.isString(submitFailCode) && !_.isEmpty(submitFailCode))
    )
  ) {
    generateLogMessage(
      [
        '"invite-generator.inject-code.submit-fails" is not configured properly',
        `(function: inviteGenerator, submit fails: ${JSON.stringify(settingsInjectCodeSubmitFails)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "invite-generator.recaptcha.site-key" is not configured properly.
  if (
    !_.isString(settingsRecaptchaSiteKey)
    || _.isEmpty(settingsRecaptchaSiteKey)
  ) {
    generateLogMessage(
      [
        '"invite-generator.recaptcha.site-key" is not configured properly',
        `(function: inviteGenerator, site key: ${JSON.stringify(settingsRecaptchaSiteKey)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "invite-generator.recaptcha.secret-key" is not configured properly.
  if (
    !_.isString(settingsRecaptchaSecretKey)
    || _.isEmpty(settingsRecaptchaSecretKey)
  ) {
    generateLogMessage(
      [
        '"invite-generator.recaptcha.secret-key" is not configured properly',
        `(function: inviteGenerator, secret key: ${JSON.stringify(settingsRecaptchaSecretKey)})`,
      ].join(' '),
      10,
    );

    return;
  }

  if (!trackRouteIsTracked(settingsOptionsPath, 'GET')) {
    trackRoute(settingsOptionsPath, 'GET');

    generateLogMessage(
      [
        'Initialized route handler',
        `(function: inviteGenerator, path: ${JSON.stringify(settingsOptionsPath)}, method: ${JSON.stringify('GET')})`,
      ].join(' '),
      30,
    );

    webServer.get(settingsOptionsPath, (request, response) => {
      const requestUrl = request.url;

      response.status(200).contentType('text/html').render('invites', {
        data: {
          settingsGuildName: guildName,
          settingsRequestUrl: requestUrl,
          designBackgroundColor: settingsDesignBackgroundColor,
          designLinkColor: settingsDesignLinkColor,
          designTextColor: settingsDesignTextColor,
          imagesFaviconUrl: settingsImagesFaviconUrl,
          imagesLogoUrl: settingsImagesLogoUrl,
          injectCodeHeaderAreas: headerAreaCodes,
          injectCodeFooterAreas: footerAreaCodes,
          injectCodeSubmitSuccesses: submitSuccessCodes,
          injectCodeSubmitFails: submitFailCodes,
          recaptchaSiteKey: settingsRecaptchaSiteKey,
        },
      });
    });
  } else {
    generateLogMessage(
      [
        'Failed to initialize route handler',
        `(function: inviteGenerator, path: ${JSON.stringify(settingsOptionsPath)}, method: ${JSON.stringify('GET')})`,
      ].join(' '),
      10,
    );
  }

  if (!trackRouteIsTracked(settingsOptionsPath, 'POST')) {
    trackRoute(settingsOptionsPath, 'POST');

    generateLogMessage(
      [
        'Initialized route handler',
        `(function: inviteGenerator, path: ${JSON.stringify(settingsOptionsPath)}, method: ${JSON.stringify('POST')})`,
      ].join(' '),
      30,
    );

    webServer.post(settingsOptionsPath, (request, response) => {
      const requestBodyToken = request.body.token;

      axios.post<ApiGoogleRecaptchaVerify>('https://www.google.com/recaptcha/api/siteverify', undefined, {
        headers: {
          'User-Agent': generateUserAgent(),
        },
        params: {
          secret: settingsRecaptchaSecretKey,
          response: requestBodyToken,
        },
      }).then((postResponse) => {
        const postResponseData = postResponse.data;

        const postResponseDataSuccess = <ApiGoogleRecaptchaVerifySuccess>_.get(postResponseData, ['success']);
        const postResponseDataErrorCodes = <ApiGoogleRecaptchaVerifyErrorCodes>_.get(postResponseData, ['error-codes']);
        const postResponseDataErrorCode = <ApiGoogleRecaptchaVerifyErrorCode>_.get(postResponseDataErrorCodes, ['0']);

        let errorMessage;

        generateLogMessage(
          [
            'Contacted API',
            `(function: inviteGenerator, data: ${JSON.stringify(postResponseData)})`,
          ].join(' '),
          40,
        );

        switch (postResponseDataErrorCode) {
          case 'missing-input-secret':
            errorMessage = 'The secret key is missing.';
            break;
          case 'invalid-input-secret':
            errorMessage = 'The secret key is invalid.';
            break;
          case 'missing-input-response':
            errorMessage = 'The token is missing.';
            break;
          case 'invalid-input-response':
            errorMessage = 'The token is invalid.';
            break;
          case 'bad-request':
            errorMessage = 'The request is invalid.';
            break;
          case 'timeout-or-duplicate':
            errorMessage = 'Your token has expired or was already used. Refresh the page and try again.';
            break;
          default:
            errorMessage = 'Unknown error.';
            break;
        }

        if (!postResponseDataSuccess) {
          response.status(401).contentType('text/plain').send([
            errorMessage,
            (settingsOptionsErrorPostfix !== undefined) ? [settingsOptionsErrorPostfix] : [],
          ].join(' '));
        } else if (guildRulesChannel !== null) {
          generateLogMessage(
            [
              'Fetched rules channel',
              `(function: inviteGenerator, rules channel: ${JSON.stringify(guildRulesChannel.toString())})`,
            ].join(' '),
            40,
          );

          guildInvites.create(guildRulesChannel, {
            maxAge: settingsOptionsMaxAge,
            maxUses: settingsOptionsMaxUses,
            reason: 'Visitor completed the invite verification',
          }).then((createResponse) => {
            const createResponseUrl = createResponse.url;

            generateLogMessage(
              [
                'Created invite',
                `(function: inviteGenerator, rules channel: ${JSON.stringify(guildRulesChannel.toString())}, max age: ${JSON.stringify(settingsOptionsMaxAge)}, max uses: ${JSON.stringify(settingsOptionsMaxUses)}, url: ${JSON.stringify(createResponseUrl)})`,
              ].join(' '),
              40,
            );

            response.status(200).contentType('text/plain').send(createResponseUrl);
          }).catch((error: Error) => {
            errorMessage = 'The invite link could not be created.';

            generateLogMessage(
              [
                'Failed to create invite',
                `(function: inviteGenerator, rules channel: ${JSON.stringify(guildRulesChannel.toString())}, max age: ${JSON.stringify(settingsOptionsMaxAge)}, max uses: ${JSON.stringify(settingsOptionsMaxUses)})`,
              ].join(' '),
              10,
              error,
            );

            response.status(500).contentType('text/plain').send([
              errorMessage,
              (settingsOptionsErrorPostfix !== undefined) ? [settingsOptionsErrorPostfix] : [],
            ].join(' '));
          });
        } else {
          errorMessage = 'The rules channel is not configured.';

          generateLogMessage(
            [
              'Failed to fetch rules channel',
              `(function: inviteGenerator, rules channel: ${JSON.stringify(guildRulesChannel)})`,
            ].join(' '),
            10,
          );

          response.status(500).contentType('text/plain').send([
            errorMessage,
            (settingsOptionsErrorPostfix !== undefined) ? [settingsOptionsErrorPostfix] : [],
          ].join(' '));
        }
      }).catch((error: Error) => {
        generateLogMessage(
          [
            'Failed to contact API',
            '(function: inviteGenerator)',
          ].join(' '),
          10,
          error,
        );

        response.sendStatus(500);
      });
    });
  } else {
    generateLogMessage(
      [
        'Failed to initialize route handler',
        `(function: inviteGenerator, path: ${JSON.stringify(settingsOptionsPath)}, method: ${JSON.stringify('POST')})`,
      ].join(' '),
      10,
    );
  }
}

/**
 * Map webhooks.
 *
 * @param {MapWebhooksGuild}     guild     - Guild.
 * @param {MapWebhooksWebServer} webServer - Web server.
 * @param {MapWebhooksEvents}    events    - Events.
 *
 * @returns {MapWebhooksReturns}
 *
 * @since 1.0.0
 */
export function mapWebhooks(guild: MapWebhooksGuild, webServer: MapWebhooksWebServer, events: MapWebhooksEvents): MapWebhooksReturns {
  /**
   * Map webhooks - Replace variables and text.
   *
   * @param {MapWebhooksReplaceVariablesAndTextEventName}         eventName         - Event name.
   * @param {MapWebhooksReplaceVariablesAndTextEventKey}          eventKey          - Event key.
   * @param {MapWebhooksReplaceVariablesAndTextEventVariables}    eventVariables    - Event variables.
   * @param {MapWebhooksReplaceVariablesAndTextEventReplacements} eventReplacements - Event replacements.
   * @param {MapWebhooksReplaceVariablesAndTextEventPayload}      eventPayload      - Event payload.
   * @param {MapWebhooksReplaceVariablesAndTextRequestBody}       requestBody       - Request body.
   *
   * @returns {MapWebhooksReplaceVariablesAndTextReturns}
   *
   * @since 1.0.0
   */
  const replaceVariablesAndText = (eventName: MapWebhooksReplaceVariablesAndTextEventName, eventKey: MapWebhooksReplaceVariablesAndTextEventKey, eventVariables: MapWebhooksReplaceVariablesAndTextEventVariables, eventReplacements: MapWebhooksReplaceVariablesAndTextEventReplacements, eventPayload: MapWebhooksReplaceVariablesAndTextEventPayload, requestBody: MapWebhooksReplaceVariablesAndTextRequestBody): MapWebhooksReplaceVariablesAndTextReturns => {
    let editedPayload = JSON.stringify(eventPayload)
      .replace(/%YEAR%/g, fetchFormattedDate('now', undefined, 'config', 'yyyy'));

    if (
      _.isArray(eventVariables)
      && !_.isEmpty(eventVariables)
      && _.every(eventVariables, (eventVariable) => _.isPlainObject(eventVariable) && !_.isEmpty(eventVariable))
    ) {
      eventVariables.forEach((eventVariable, eventVariableKey) => {
        const theId = <MapWebhooksEventVariableId>_.get(eventVariable, ['id']);
        const theType = <MapWebhooksEventVariableType>_.get(eventVariable, ['type']);
        const thePath = <MapWebhooksEventVariablePath>_.get(eventVariable, ['path']);

        // If "web-applications.map-webhooks[${eventKey}].variables[${eventVariableKey}].id" is not configured properly.
        if (
          theId === undefined
          || !/^[A-Z]+(?:_[A-Z]+)*$/.test(theId)
        ) {
          generateLogMessage(
            [
              `"web-applications.map-webhooks[${eventKey}].variables[${eventVariableKey}].id" is not configured properly`,
              `(function: mapWebhooks, name: ${JSON.stringify(eventName)}, id: ${JSON.stringify(theId)})`,
            ].join(' '),
            10,
          );

          return;
        }

        // If "web-applications.map-webhooks[${eventKey}].variables[${eventVariableKey}].type" is not configured properly.
        if (
          theType !== 'string'
          && theType !== 'boolean'
          && theType !== 'ts-seconds'
          && theType !== 'ts-millis'
          && theType !== 'usd-dollars'
          && theType !== 'usd-cents'
        ) {
          generateLogMessage(
            [
              `"web-applications.map-webhooks[${eventKey}].variables[${eventVariableKey}].type" is not configured properly`,
              `(function: mapWebhooks, name: ${JSON.stringify(eventName)}, type: ${JSON.stringify(theType)})`,
            ].join(' '),
            10,
          );

          return;
        }

        // If "web-applications.map-webhooks[${eventKey}].variables[${eventVariableKey}].path" is not configured properly.
        if (
          !_.isString(thePath)
          || _.isEmpty(thePath)
        ) {
          generateLogMessage(
            [
              `"web-applications.map-webhooks[${eventKey}].variables[${eventVariableKey}].path" is not configured properly`,
              `(function: mapWebhooks, name: ${JSON.stringify(eventName)}, path: ${JSON.stringify(thePath)})`,
            ].join(' '),
            10,
          );

          return;
        }

        const fetchedValue = <unknown>_.get(requestBody, thePath);

        let editedValue = String(fetchedValue);

        switch (theType) {
          case 'string':
            if (_.isString(fetchedValue)) {
              editedValue = fetchedValue
                .replace(/\n/g, '\\n') // Escape new lines.
                .replace(/\r/g, '\\r') // Escape carriage returns.
                .replace(/\t/g, '\\t'); // Escape tabs.
            }
            break;
          case 'boolean':
            if (_.isBoolean(fetchedValue)) {
              editedValue = (fetchedValue) ? 'Yes' : 'No';
            }
            break;
          case 'ts-seconds':
            if (_.isNumber(fetchedValue) && _.isFinite(fetchedValue)) {
              editedValue = fetchFormattedDate('ts-seconds', fetchedValue, 'config', 'DDDD ttt');
            }
            break;
          case 'ts-millis':
            if (_.isNumber(fetchedValue) && _.isFinite(fetchedValue)) {
              editedValue = fetchFormattedDate('ts-millis', fetchedValue, 'config', 'DDDD ttt');
            }
            break;
          case 'usd-dollars':
            if (_.isNumber(fetchedValue) && _.isFinite(fetchedValue)) {
              editedValue = numeral(fetchedValue).format('$0,0.00');
            }
            break;
          case 'usd-cents':
            if (_.isNumber(fetchedValue) && _.isFinite(fetchedValue)) {
              editedValue = numeral(fetchedValue / 100).format('$0,0.00');
            }
            break;
          default:
            break;
        }

        // Replace all current variable id's in payload with the current value.
        editedPayload = editedPayload.replace(
          new RegExp(`@${theId}@`, 'g'),
          editedValue,
        );
      });
    }

    if (
      _.isArray(eventReplacements)
      && !_.isEmpty(eventReplacements)
      && _.every(eventReplacements, (eventReplacement) => _.isPlainObject(eventReplacement) && !_.isEmpty(eventReplacement))
    ) {
      eventReplacements.forEach((eventReplacement, eventReplacementKey) => {
        const thePattern = <MapWebhooksEventReplacementPattern>_.get(eventReplacement, ['pattern']);
        const theFlags = <MapWebhooksEventReplacementFlags>_.get(eventReplacement, ['flags']);
        const theReplaceWith = <MapWebhooksEventReplacementReplaceWith>_.get(eventReplacement, ['replace-with']);

        // If "web-applications.map-webhooks[${eventKey}].replacements[${eventReplacementKey}].pattern" is not configured properly.
        if (!_.isString(thePattern)) {
          generateLogMessage(
            [
              `"web-applications.map-webhooks[${eventKey}].replacements[${eventReplacementKey}].pattern" is not configured properly`,
              `(function: mapWebhooks, name: ${JSON.stringify(eventName)}, pattern: ${JSON.stringify(thePattern)})`,
            ].join(' '),
            10,
          );

          return;
        }

        // If "web-applications.map-webhooks[${eventKey}].replacements[${eventReplacementKey}].flags" is not configured properly.
        if (
          theFlags !== undefined
          && !_.isString(theFlags)
        ) {
          generateLogMessage(
            [
              `"web-applications.map-webhooks[${eventKey}].replacements[${eventReplacementKey}].flags" is not configured properly`,
              `(function: mapWebhooks, name: ${JSON.stringify(eventName)}, flags: ${JSON.stringify(theFlags)})`,
            ].join(' '),
            10,
          );

          return;
        }

        // If "web-applications.map-webhooks[${eventKey}].replacements[${eventReplacementKey}].replace-with" is not configured properly.
        if (!_.isString(theReplaceWith)) {
          generateLogMessage(
            [
              `"web-applications.map-webhooks[${eventKey}].replacements[${eventReplacementKey}].replace-with" is not configured properly`,
              `(function: mapWebhooks, name: ${JSON.stringify(eventName)}, replace with: ${JSON.stringify(theReplaceWith)})`,
            ].join(' '),
            10,
          );

          return;
        }

        try {
          const regExp = new RegExp(thePattern, theFlags);

          generateLogMessage(
            [
              'Constructed regular expression object',
              `(function: mapWebhooks, name: ${JSON.stringify(eventName)}, pattern: ${JSON.stringify(thePattern)}, flags: ${JSON.stringify(theFlags)})`,
            ].join(' '),
            40,
          );

          editedPayload = editedPayload.replace(regExp, theReplaceWith);
        } catch (error) {
          generateLogMessage(
            [
              'Failed to construct regular expression object',
              `(function: mapWebhooks, name: ${JSON.stringify(eventName)}, pattern: ${JSON.stringify(thePattern)}, flags: ${JSON.stringify(theFlags)})`,
            ].join(' '),
            10,
            error,
          );
        }
      });
    }

    return JSON.parse(editedPayload);
  };

  // If "web-applications.map-webhooks" is not configured.
  if (events === undefined) {
    generateLogMessage(
      [
        '"web-applications.map-webhooks" is not configured',
        `(function: mapWebhooks, events: ${JSON.stringify(events)})`,
      ].join(' '),
      40,
    );

    return;
  }

  // If "web-applications.map-webhooks" is not configured properly.
  if (
    !_.isArray(events)
    || _.isEmpty(events)
    || !_.every(events, (event) => _.isPlainObject(event) && !_.isEmpty(event))
  ) {
    generateLogMessage(
      [
        '"web-applications.map-webhooks" is not configured properly',
        `(function: mapWebhooks, events: ${JSON.stringify(events)})`,
      ].join(' '),
      10,
    );

    return;
  }

  events.forEach((event, eventKey) => {
    const theName = <MapWebhooksEventName>_.get(event, ['name']) ?? 'Unknown';
    const thePath = <MapWebhooksEventPath>_.get(event, ['path']);
    const theVariables = <MapWebhooksEventVariables>_.get(event, ['variables']);
    const theReplacements = <MapWebhooksEventReplacements>_.get(event, ['replacements']);
    const thePayload = <MapWebhooksEventPayload>_.get(event, ['payload']);
    const theChannelChannelId = <MapWebhooksEventChannelChannelId>_.get(event, ['channel', 'channel-id']);

    const channel = getTextBasedChannel(guild, theChannelChannelId);

    // If "web-applications.map-webhooks[${eventKey}].name" is not configured properly.
    if (
      !_.isString(theName)
      || _.isEmpty(theName)
    ) {
      generateLogMessage(
        [
          `"web-applications.map-webhooks[${eventKey}].name" is not configured properly`,
          `(function: mapWebhooks, name: ${JSON.stringify(theName)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "web-applications.map-webhooks[${eventKey}].path" is not configured properly.
    if (
      !_.isString(thePath)
      || _.isEmpty(thePath)
    ) {
      generateLogMessage(
        [
          `"web-applications.map-webhooks[${eventKey}].path" is not configured properly`,
          `(function: mapWebhooks, name: ${JSON.stringify(theName)}, path: ${JSON.stringify(thePath)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "web-applications.map-webhooks[${eventKey}].variables" is not configured properly.
    if (
      !_.isArray(theVariables)
      || _.isEmpty(theVariables)
      || !_.every(theVariables, (theVariable) => _.isPlainObject(theVariable) && !_.isEmpty(theVariable))
    ) {
      generateLogMessage(
        [
          `"web-applications.map-webhooks[${eventKey}].variables" is not configured properly`,
          `(function: mapWebhooks, name: ${JSON.stringify(theName)}, variables: ${JSON.stringify(theVariables)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "web-applications.map-webhooks[${eventKey}].replacements" is not configured properly.
    if (
      theReplacements !== undefined
      && (
        !_.isArray(theReplacements)
        || _.isEmpty(theReplacements)
        || !_.every(theReplacements, (theReplacement) => _.isPlainObject(theReplacement) && !_.isEmpty(theReplacement))
      )
    ) {
      generateLogMessage(
        [
          `"web-applications.map-webhooks[${eventKey}].replacements" is not configured properly`,
          `(function: mapWebhooks, name: ${JSON.stringify(theName)}, replacements: ${JSON.stringify(theReplacements)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "web-applications.map-webhooks[${eventKey}].payload" is not configured properly.
    if (
      thePayload === undefined
      || !_.isPlainObject(thePayload)
      || _.isEmpty(thePayload)
    ) {
      generateLogMessage(
        [
          `"web-applications.map-webhooks[${eventKey}].payload" is not configured properly`,
          `(function: mapWebhooks, name: ${JSON.stringify(theName)}, payload: ${JSON.stringify(thePayload)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "web-applications.map-webhooks[${eventKey}].channel.channel-id" is not configured properly.
    if (
      channel === undefined
      || channel === null
    ) {
      generateLogMessage(
        [
          `"web-applications.map-webhooks[${eventKey}].channel.channel-id" is not configured properly`,
          `(function: mapWebhooks, name: ${JSON.stringify(theName)}, channel id: ${JSON.stringify(theChannelChannelId)})`,
        ].join(' '),
        10,
      );

      return;
    }

    if (!trackRouteIsTracked(thePath, 'POST')) {
      trackRoute(thePath, 'POST');

      generateLogMessage(
        [
          'Initialized route handler',
          `(function: mapWebhooks, name: ${JSON.stringify(theName)}, path: ${JSON.stringify(thePath)}, method: ${JSON.stringify('POST')})`,
        ].join(' '),
        30,
      );

      webServer.post(thePath, (request, response) => {
        const requestBody = request.body;

        const message = 'Webhook event processed.';
        const payload = replaceVariablesAndText(theName, eventKey, theVariables, theReplacements, thePayload, requestBody);

        channel.send(payload).then((sendResponse) => {
          const sendResponseUrl = sendResponse.url;

          generateLogMessage(
            [
              'Sent message',
              `(function: mapWebhooks, name: ${JSON.stringify(theName)}, message url: ${JSON.stringify(sendResponseUrl)}, payload: ${JSON.stringify(payload)})`,
            ].join(' '),
            40,
          );
        }).catch((error: Error) => generateLogMessage(
          [
            'Failed to send message',
            `(function: mapWebhooks, name: ${JSON.stringify(theName)}, channel: ${JSON.stringify(channel.toString())}, payload: ${JSON.stringify(payload)})`,
          ].join(' '),
          10,
          error,
        ));

        response.status(200).contentType('text/plain').send(message);
      });
    } else {
      generateLogMessage(
        [
          'Failed to initialize route handler',
          `(function: mapWebhooks, name: ${JSON.stringify(theName)}, path: ${JSON.stringify(thePath)}, method: ${JSON.stringify('POST')})`,
        ].join(' '),
        10,
      );
    }
  });
}

/**
 * Web applications setup.
 *
 * @param {WebApplicationsSetupGuild}    guild    - Guild.
 * @param {WebApplicationsSetupSettings} settings - Settings.
 *
 * @returns {WebApplicationsSetupReturns}
 *
 * @since 1.0.0
 */
export function webApplicationsSetup(guild: WebApplicationsSetupGuild, settings: WebApplicationsSetupSettings): WebApplicationsSetupReturns {
  const settingsHttpServer = <WebApplicationsSetupSettingsHttpServer>_.get(settings, ['http-server']);
  const settingsHttpServerPort = <WebApplicationsSetupSettingsHttpServerPort>_.get(settings, ['http-server', 'port']);
  const settingsHttpsServer = <WebApplicationsSetupSettingsHttpsServer>_.get(settings, ['https-server']);
  const settingsHttpsServerPort = <WebApplicationsSetupSettingsHttpsServerPort>_.get(settings, ['https-server', 'port']);
  const settingsHttpsServerKey = <WebApplicationsSetupSettingsHttpsServerKey>_.get(settings, ['https-server', 'key']);
  const settingsHttpsServerCert = <WebApplicationsSetupSettingsHttpsServerCert>_.get(settings, ['https-server', 'cert']);
  const settingsHttpsServerCa = <WebApplicationsSetupSettingsHttpsServerCa>_.get(settings, ['https-server', 'ca']);
  const settingsInviteGenerator = <WebApplicationsSetupSettingsInviteGenerator>_.get(settings, ['invite-generator']);
  const settingsMapWebhooks = <WebApplicationsSetupSettingsMapWebhooks>_.get(settings, ['map-webhooks']);

  const server = express();

  // If "web-applications" is not configured.
  if (settings === undefined) {
    generateLogMessage(
      [
        '"web-applications" is not configured',
        `(function: webApplicationsSetup, settings: ${JSON.stringify(settings)})`,
      ].join(' '),
      40,
    );

    return;
  }

  // If "web-applications" is not configured properly.
  if (
    settingsHttpServer === undefined
    && settingsHttpsServer === undefined
  ) {
    generateLogMessage(
      [
        '"web-applications" is not configured properly',
        `(function: webApplicationsSetup, http server: ${JSON.stringify(settingsHttpServer)}, https server: ${JSON.stringify(settingsHttpsServer)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "web-applications.http-server.port" is not configured properly.
  if (
    settingsHttpServer !== undefined
    && (
      !_.isNumber(settingsHttpServerPort)
      || !_.inRange(settingsHttpServerPort, 1, 65536)
    )
  ) {
    generateLogMessage(
      [
        '"web-applications.http-server.port" is not configured properly',
        `(function: webApplicationsSetup, port: ${JSON.stringify(settingsHttpServerPort)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "web-applications.https-server.port" is not configured properly.
  if (
    settingsHttpsServer !== undefined
    && (
      !_.isNumber(settingsHttpsServerPort)
      || !_.inRange(settingsHttpsServerPort, 1, 65536)
    )
  ) {
    generateLogMessage(
      [
        '"web-applications.https-server.port" is not configured properly',
        `(function: webApplicationsSetup, port: ${JSON.stringify(settingsHttpsServerPort)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "web-applications.https-server.key" is not configured properly.
  if (
    settingsHttpsServer !== undefined
    && (
      !_.isString(settingsHttpsServerKey)
      || _.isEmpty(settingsHttpsServerKey)
      || !fs.existsSync(settingsHttpsServerKey)
    )
  ) {
    generateLogMessage(
      [
        '"web-applications.https-server.key" is not configured properly',
        `(function: webApplicationsSetup, key: ${JSON.stringify(settingsHttpsServerKey)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "web-applications.https-server.cert" is not configured properly.
  if (
    settingsHttpsServer !== undefined
    && (
      !_.isString(settingsHttpsServerCert)
      || _.isEmpty(settingsHttpsServerCert)
      || !fs.existsSync(settingsHttpsServerCert)
    )
  ) {
    generateLogMessage(
      [
        '"web-applications.https-server.cert" is not configured properly',
        `(function: webApplicationsSetup, cert: ${JSON.stringify(settingsHttpsServerCert)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "web-applications.https-server.ca" is not configured properly.
  if (
    settingsHttpsServer !== undefined
    && (
      !_.isString(settingsHttpsServerCa)
      || _.isEmpty(settingsHttpsServerCa)
      || !fs.existsSync(settingsHttpsServerCa)
    )
  ) {
    generateLogMessage(
      [
        '"web-applications.https-server.ca" is not configured properly',
        `(function: webApplicationsSetup, ca: ${JSON.stringify(settingsHttpsServerCa)})`,
      ].join(' '),
      10,
    );

    return;
  }

  server.use(express.json());
  server.use(express.urlencoded({
    extended: true,
  }));

  server.set('view engine', 'ejs');
  server.set('views', path.join(__dirname, '../views'));

  /**
   * Web applications setup - HTTP server.
   *
   * @returns {WebApplicationsSetupHttpServerReturns}
   *
   * @since 1.0.0
   */
  const httpServer = async (): WebApplicationsSetupHttpServerReturns => {
    if (
      _.isNumber(settingsHttpServerPort)
      && _.inRange(settingsHttpServerPort, 1, 65536)
    ) {
      try {
        const instance = http.createServer(server);

        instance.listen(settingsHttpServerPort, () => {
          generateLogMessage(
            [
              'Initialized web server',
              `(function: webApplicationsSetup, http port: ${JSON.stringify(settingsHttpServerPort)})`,
            ].join(' '),
            30,
          );
        });

        return true;
      } catch (error) {
        generateLogMessage(
          [
            'Failed to initialize web server',
            `(function: webApplicationsSetup, http port: ${JSON.stringify(settingsHttpServerPort)})`,
          ].join(' '),
          10,
          error,
        );

        return false;
      }
    }

    return false;
  };

  /**
   * Web applications setup - HTTPS server.
   *
   * @returns {WebApplicationsSetupHttpsServerReturns}
   *
   * @since 1.0.0
   */
  const httpsServer = async (): WebApplicationsSetupHttpsServerReturns => {
    if (
      (
        _.isNumber(settingsHttpsServerPort)
        && _.inRange(settingsHttpsServerPort, 1, 65536)
      )
      && (
        _.isString(settingsHttpsServerKey)
        && !_.isEmpty(settingsHttpsServerKey)
        && fs.existsSync(settingsHttpsServerKey)
      )
      && (
        _.isString(settingsHttpsServerCert)
        && !_.isEmpty(settingsHttpsServerCert)
        && fs.existsSync(settingsHttpsServerCert)
      )
      && (
        _.isString(settingsHttpsServerCa)
        && !_.isEmpty(settingsHttpsServerCa)
        && fs.existsSync(settingsHttpsServerCa)
      )
    ) {
      try {
        const instance = https.createServer({
          key: fs.readFileSync(settingsHttpsServerKey, 'utf-8'),
          cert: fs.readFileSync(settingsHttpsServerCert, 'utf-8'),
          ca: fs.readFileSync(settingsHttpsServerCa, 'utf-8'),
        }, server);

        instance.listen(settingsHttpsServerPort, () => {
          generateLogMessage(
            [
              'Initialized web server',
              `(function: webApplicationsSetup, https port: ${JSON.stringify(settingsHttpsServerPort)}, https key: ${JSON.stringify(settingsHttpsServerKey)}, https cert: ${JSON.stringify(settingsHttpsServerCert)}, https ca: ${JSON.stringify(settingsHttpsServerCa)})`,
            ].join(' '),
            30,
          );
        });

        return true;
      } catch (error) {
        generateLogMessage(
          [
            'Failed to initialize web server',
            `(function: webApplicationsSetup, https port: ${JSON.stringify(settingsHttpsServerPort)}, https key: ${JSON.stringify(settingsHttpsServerKey)}, https cert: ${JSON.stringify(settingsHttpsServerCert)}, https ca: ${JSON.stringify(settingsHttpsServerCa)})`,
          ].join(' '),
          10,
          error,
        );

        return false;
      }
    }

    return false;
  };

  Promise.all([httpServer(), httpsServer()]).then((listeningResponses) => {
    const success = _.some(listeningResponses, (listeningResponse) => listeningResponse === true);

    if (success) {
      generateLogMessage(
        [
          'Initialized web applications',
          `(function: webApplicationsSetup, success: ${JSON.stringify(success)})`,
        ].join(' '),
        40,
      );

      /**
       * Invite generator.
       *
       * @since 1.0.0
       */
      inviteGenerator(guild, server, settingsInviteGenerator);

      /**
       * Map webhooks.
       *
       * @since 1.0.0
       */
      mapWebhooks(guild, server, settingsMapWebhooks);
    } else {
      generateLogMessage(
        [
          'Failed to initialize web applications',
          `(function: webApplicationsSetup, success: ${JSON.stringify(success)})`,
        ].join(' '),
        10,
      );
    }
  });
}
