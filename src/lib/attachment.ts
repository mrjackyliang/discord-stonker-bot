import { AttachmentBuilder } from 'discord.js';
import _ from 'lodash';
import { markdownTable } from 'markdown-table';

import { fetchFormattedDate } from './utility.js';
import {
  CreateEarningsTableAttachmentEarnings,
  CreateEarningsTableAttachmentReturns,
  CreateEmojisInlineAttachmentEmojis,
  CreateEmojisInlineAttachmentReturns,
  CreateEmojisInlineAttachmentRoute,
  CreateEmojisTableAttachmentEmojis,
  CreateEmojisTableAttachmentReturns,
  CreateEmojisTableAttachmentRoute,
  CreateMembersInlineAttachmentMembers,
  CreateMembersInlineAttachmentName,
  CreateMembersInlineAttachmentReturns,
  CreateMembersTableAttachmentMembers,
  CreateMembersTableAttachmentName,
  CreateMembersTableAttachmentReturns,
  GenerateAttachmentBuffer,
  GenerateAttachmentDescription,
  GenerateAttachmentFileName,
  GenerateAttachmentReturns,
} from '../types/index.js';

/**
 * Generate attachment.
 *
 * @param {GenerateAttachmentBuffer}      buffer        - Buffer.
 * @param {GenerateAttachmentFileName}    fileName      - File name.
 * @param {GenerateAttachmentDescription} [description] - Description.
 *
 * @returns {GenerateAttachmentReturns}
 *
 * @since 1.0.0
 */
export function generateAttachment(buffer: GenerateAttachmentBuffer, fileName: GenerateAttachmentFileName, description: GenerateAttachmentDescription): GenerateAttachmentReturns {
  const messageAttachment = new AttachmentBuilder(buffer)
    .setName(fileName);

  if (description !== undefined) {
    messageAttachment.setDescription(description);
  }

  return messageAttachment;
}

/**
 * Create earnings table attachment.
 *
 * @param {CreateEarningsTableAttachmentEarnings} earnings - Earnings.
 *
 * @returns {CreateEarningsTableAttachmentReturns}
 *
 * @since 1.0.0
 */
export function createEarningsTableAttachment(earnings: CreateEarningsTableAttachmentEarnings): CreateEarningsTableAttachmentReturns {
  const todaysDate = fetchFormattedDate('now', undefined, 'config', 'iso-date');
  const todaysDateDisplay = fetchFormattedDate('now', undefined, 'config', 'ccc, LLL d, yyyy');
  const tableHead = [
    [
      'Reporting Date',
      'Symbol',
      'Fiscal Quarter',
      'Call Time',
      'EPS Estimate',
      'EPS Actual',
      'EPS Surprise',
      'Revenue Estimate',
      'Revenue Actual',
      'Revenue Surprise',
    ],
  ];
  const tableBody = _.map(earnings, (earning) => {
    const earningDate = earning.date;
    const earningSymbol = earning.symbol;
    const earningFiscalQuarter = earning.fiscalQuarter;
    const earningCallTime = earning.callTime;
    const earningEpsEstimate = earning.epsEstimate;
    const earningEpsActual = earning.epsActual;
    const earningEpsSurprise = earning.epsSurprise;
    const earningRevenueEstimate = earning.revenueEstimate;
    const earningRevenueActual = earning.revenueActual;
    const earningRevenueSurprise = earning.revenueSurprise;

    return [
      earningDate,
      earningSymbol,
      earningFiscalQuarter,
      (earningCallTime !== null) ? earningCallTime : '',
      (earningEpsEstimate !== null) ? earningEpsEstimate : '',
      (earningEpsActual !== null) ? earningEpsActual : '',
      (earningEpsSurprise !== null) ? earningEpsSurprise : '',
      (earningRevenueEstimate !== null) ? earningRevenueEstimate : '',
      (earningRevenueActual !== null) ? earningRevenueActual : '',
      (earningRevenueSurprise !== null) ? earningRevenueSurprise : '',
    ];
  });

  return generateAttachment(
    Buffer.from(
      markdownTable([
        ...tableHead,
        ...tableBody,
      ]),
      'utf-8',
    ),
    `latest-earnings-${todaysDate}.txt`,
    `Latest earnings data for ${todaysDateDisplay}`,
  );
}

/**
 * Create emojis inline attachment.
 *
 * @param {CreateEmojisInlineAttachmentEmojis} emojis - Emojis.
 * @param {CreateEmojisInlineAttachmentRoute}  route  - Route.
 *
 * @returns {CreateEmojisInlineAttachmentReturns}
 *
 * @since 1.0.0
 */
export function createEmojisInlineAttachment(emojis: CreateEmojisInlineAttachmentEmojis, route: CreateEmojisInlineAttachmentRoute): CreateEmojisInlineAttachmentReturns {
  const routeDisplay = _.capitalize(route);

  return generateAttachment(
    Buffer.from(
      _.map(emojis, (emoji) => emoji.toString()).join(' '),
      'utf-8',
    ),
    `emoji-${route}-inline.txt`,
    `${routeDisplay} emojis displayed in an inline format`,
  );
}

/**
 * Create emojis table attachment.
 *
 * @param {CreateEmojisTableAttachmentEmojis} emojis - Emojis.
 * @param {CreateEmojisTableAttachmentRoute}  route  - Route.
 *
 * @returns {CreateEmojisTableAttachmentReturns}
 *
 * @since 1.0.0
 */
export function createEmojisTableAttachment(emojis: CreateEmojisTableAttachmentEmojis, route: CreateEmojisTableAttachmentRoute): CreateEmojisTableAttachmentReturns {
  const routeDisplay = _.capitalize(route);
  const tableHead = [
    [
      'ID',
      'Name',
      'Mention',
      'Animated',
      'Uploaded On',
    ],
  ];
  const tableBody = _.map(emojis, (emoji) => {
    const emojiAnimated = emoji.animated;
    const emojiCreatedAt = emoji.createdAt;
    const emojiId = emoji.id;
    const emojiName = emoji.name;

    return [
      emojiId,
      (emojiName !== null) ? emojiName : '',
      emoji.toString(),
      (emojiAnimated === true) ? 'Yes' : 'No',
      fetchFormattedDate('date', emojiCreatedAt, 'config', 'DDDD ttt'),
    ];
  });

  return generateAttachment(
    Buffer.from(
      markdownTable([
        ...tableHead,
        ...tableBody,
      ]),
      'utf-8',
    ),
    `emoji-${route}-table.txt`,
    `${routeDisplay} emojis displayed in a table format`,
  );
}

/**
 * Create members inline attachment.
 *
 * @param {CreateMembersInlineAttachmentMembers} members - Members.
 * @param {CreateMembersInlineAttachmentName}    name    - Name.
 *
 * @returns {CreateMembersInlineAttachmentReturns}
 *
 * @since 1.0.0
 */
export function createMembersInlineAttachment(members: CreateMembersInlineAttachmentMembers, name: CreateMembersInlineAttachmentName): CreateMembersInlineAttachmentReturns {
  return generateAttachment(
    Buffer.from(
      _.map(members, (member) => member.toString()).join(' '),
      'utf-8',
    ),
    `${name}-inline.txt`,
    'Selected members displayed in an inline format',
  );
}

/**
 * Create members table attachment.
 *
 * @param {CreateMembersTableAttachmentMembers} members - Members.
 * @param {CreateMembersTableAttachmentName}    name    - Name.
 *
 * @returns {CreateMembersTableAttachmentReturns}
 *
 * @since 1.0.0
 */
export function createMembersTableAttachment(members: CreateMembersTableAttachmentMembers, name: CreateMembersTableAttachmentName): CreateMembersTableAttachmentReturns {
  const tableHead = [
    [
      'ID',
      'Tag',
      'Nickname',
      'Avatar',
      'Pending',
      'Registered On',
      'Joined On',
    ],
  ];
  const tableBody = _.map(members, (member) => {
    const memberJoinedAt = member.joinedAt;
    const memberNickname = member.nickname;
    const memberPending = member.pending;
    const memberUserAvatar = member.user.avatar;
    const memberUserCreatedAt = member.user.createdAt;
    const memberUserId = member.user.id;
    const memberUserTag = member.user.tag;

    return [
      memberUserId,
      memberUserTag,
      (memberNickname !== null) ? memberNickname : '',
      (memberUserAvatar !== null) ? memberUserAvatar : '',
      (memberPending) ? 'Yes' : 'No',
      fetchFormattedDate('date', memberUserCreatedAt, 'config', 'DDDD ttt'),
      (memberJoinedAt !== null) ? fetchFormattedDate('date', memberJoinedAt, 'config', 'DDDD ttt') : '',
    ];
  });

  return generateAttachment(
    Buffer.from(
      markdownTable([
        ...tableHead,
        ...tableBody,
      ]),
      'utf-8',
    ),
    `${name}-table.txt`,
    'Selected members displayed in a table format',
  );
}
