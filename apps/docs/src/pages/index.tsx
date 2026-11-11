import {
  BlogPreview,
  Canvas,
  Features,
  InstallStrip,
  Stats,
} from '@cbnventures/docusaurus-preset-nova/blocks';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import { translate } from '@docusaurus/Translate';
import Heading from '@theme/Heading';
import Layout from '@theme/Layout';

import styles from './index.module.css';

import type { Pages_Index_Home_Returns } from '../types/pages/index.d.ts';

/**
 * Pages - Home.
 *
 * Landing page that composes the hero with the bot's moderator alerts, the install
 * strip, the feature grid, stats, and the blog preview using theme blocks.
 *
 * @constructor
 *
 * @returns {Pages_Index_Home_Returns}
 *
 * @since 0.0.0
 */
function Home(): Pages_Index_Home_Returns {
  return (
    <Layout description={translate({
      id: 'home.layout.description',
      message: 'Run safety, moderation, automation, and community features across your Discord servers from one self-hosted container that you manage in your browser.',
      description: 'Front page layout description (meta description for SEO)',
    })}
    >
      <Head>
        <title>
          {translate({
            id: 'home.head.title',
            message: 'Stonker Bot for Discord - Self-Hosted Discord Moderation and Safety',
            description: 'Front page browser tab title',
          })}
        </title>
      </Head>
      <Canvas container="full" className={styles['hero']}>
        <div className={styles['hero-inner']}>
          <div className={styles['hero-content']}>
            <p className="nova-hero-eyebrow">
              {translate({
                id: 'home.hero.eyebrow',
                message: 'Self-Hosted Discord Bot',
                description: 'Front page hero eyebrow above the heading',
              })}
            </p>
            <Heading as="h1" className="nova-hero-heading">
              {translate({
                id: 'home.hero.heading',
                message: 'Run a safer, sharper community from one focused Discord bot.',
                description: 'Front page hero main heading',
              })}
            </Heading>
            <p className="nova-hero-tagline">
              {translate({
                id: 'home.hero.tagline',
                message: 'Safety, moderation, automation, and community tools for your Discord servers, in one container you manage from your browser.',
                description: 'Front page hero tagline beneath the heading',
              })}
            </p>
            <div className={`nova-hero-actions ${styles['hero-actions']}`}>
              <Link
                className="nova-cta-primary"
                to="/docs/overview/"
              >
                {translate({
                  id: 'home.hero.ctaLabel',
                  message: 'Get Started',
                  description: 'Front page hero primary call-to-action button label',
                })}
              </Link>
              <Link
                className="nova-cta-secondary"
                to="https://github.com/mrjackyliang/discord-stonker-bot"
              >
                {translate({
                  id: 'home.hero.secondaryCtaLabel',
                  message: 'View on GitHub',
                  description: 'Front page hero secondary call-to-action button label',
                })}
              </Link>
            </div>
          </div>
          <div className={styles['alert-channel']} aria-hidden="true">
            <p className={styles['alert-channel-header']}>
              <span className={styles['alert-channel-hash']}>#</span>
              mod-alerts
            </p>
            <ul className={styles['alert-list']}>
              <li className={styles['alert']}>
                <span className={styles['alert-avatar']}>S</span>
                <div className={styles['alert-body']}>
                  <p className={styles['alert-meta']}>
                    <span className={styles['alert-author']}>Stonker Bot</span>
                    <span className={styles['alert-tag']}>BOT</span>
                    <span className={styles['alert-time']}>Today at 9:38 AM</span>
                  </p>
                  <p className={styles['alert-line']}>Banned a joining member who matched anti-raid signals.</p>
                  <p className={styles['alert-line']}>
                    Member:
                    {' '}
                    <span className={styles['alert-mention']}>@join-my-server</span>
                    {' '}
                    (1182746392018374656)
                  </p>
                  <p className={styles['alert-line']}>Signals: known avatar fingerprint, configured username</p>
                </div>
              </li>
              <li className={styles['alert']}>
                <span className={styles['alert-avatar']}>S</span>
                <div className={styles['alert-body']}>
                  <p className={styles['alert-meta']}>
                    <span className={styles['alert-author']}>Stonker Bot</span>
                    <span className={styles['alert-tag']}>BOT</span>
                    <span className={styles['alert-time']}>Today at 9:40 AM</span>
                  </p>
                  <p className={styles['alert-line']}>
                    A potential impersonator was detected:
                    {' '}
                    <span className={styles['alert-mention']}>@m0derator</span>
                    .
                  </p>
                </div>
              </li>
              <li className={styles['alert']}>
                <span className={styles['alert-avatar']}>S</span>
                <div className={styles['alert-body']}>
                  <p className={styles['alert-meta']}>
                    <span className={styles['alert-author']}>Stonker Bot</span>
                    <span className={styles['alert-tag']}>BOT</span>
                    <span className={styles['alert-time']}>Today at 9:41 AM</span>
                  </p>
                  <p className={styles['alert-line']}>
                    A potential scam message was detected from
                    {' '}
                    <span className={styles['alert-mention']}>@free-nitro-gift</span>
                    .
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </Canvas>
      <InstallStrip command="docker compose up --build --detach" />
      <main>
        <Features
          items={[
            {
              icon: 'lucide:shield-alert',
              title: translate({
                id: 'home.features.alerts.title',
                message: 'Raid Bans and Impersonator Alerts',
                description: 'Front page Features card title for Raid Bans and Impersonator Alerts',
              }),
              description: translate({
                id: 'home.features.alerts.description',
                message: 'Ban joining raid accounts and flag names that imitate your staff, so members aren\'t fooled.',
                description: 'Front page Features card description for Raid Bans and Impersonator Alerts',
              }),
            },
            {
              icon: 'lucide:list-filter',
              title: translate({
                id: 'home.features.rules.title',
                message: 'Scam and Pattern Rules',
                description: 'Front page Features card title for Scam and Pattern Rules',
              }),
              description: translate({
                id: 'home.features.rules.description',
                message: 'Spot scam messages and suspicious words, and keep channels on topic with regex rules, such as links only.',
                description: 'Front page Features card description for Scam and Pattern Rules',
              }),
            },
            {
              icon: 'lucide:message-square-reply',
              title: translate({
                id: 'home.features.autoReplies.title',
                message: 'Auto Replies',
                description: 'Front page Features card title for Auto Replies',
              }),
              description: translate({
                id: 'home.features.autoReplies.description',
                message: 'Answer common questions automatically with responses you prepare, in the same channel or as a reply.',
                description: 'Front page Features card description for Auto Replies',
              }),
            },
            {
              icon: 'lucide:megaphone',
              title: translate({
                id: 'home.features.announcements.title',
                message: 'Announcements on Autopilot',
                description: 'Front page Features card title for Announcements on Autopilot',
              }),
              description: translate({
                id: 'home.features.announcements.description',
                message: 'Schedule posts in your time zone, announce Discord events as they change, and share new RSS items.',
                description: 'Front page Features card description for Announcements on Autopilot',
              }),
            },
            {
              icon: 'lucide:toggle-right',
              title: translate({
                id: 'home.features.leastPrivilege.title',
                message: 'Only the Access You Use',
                description: 'Front page Features card title for Only the Access You Use',
              }),
              description: translate({
                id: 'home.features.leastPrivilege.description',
                message: 'Each feature has its own switch, and features you leave off don\'t run or ask Discord for extra access.',
                description: 'Front page Features card description for Only the Access You Use',
              }),
            },
            {
              icon: 'lucide:key-round',
              title: translate({
                id: 'home.features.encryption.title',
                message: 'Secrets Stay Encrypted',
                description: 'Front page Features card title for Secrets Stay Encrypted',
              }),
              description: translate({
                id: 'home.features.encryption.description',
                message: 'The Bot Token, API keys, and webhook URLs you enter are encrypted, never stored as plain text.',
                description: 'Front page Features card description for Secrets Stay Encrypted',
              }),
            },
          ]}
        />
        <Stats
          heading={translate({
            id: 'home.stats.heading',
            message: 'By the Numbers',
            description: 'Front page Stats section heading',
          })}
          items={[
            {
              value: '20',
              label: translate({
                id: 'home.stats.features.label',
                message: 'Features in one bot',
                description: 'Front page Stats label for the feature count',
              }),
              color: 'primary',
            },
            {
              value: '6',
              label: translate({
                id: 'home.stats.categories.label',
                message: 'Feature categories',
                description: 'Front page Stats label for the feature category count',
              }),
              color: 'accent',
            },
            {
              value: '4',
              label: translate({
                id: 'home.stats.safetyFeatures.label',
                message: 'Safety features',
                description: 'Front page Stats label for the safety feature count',
              }),
              color: 'primary',
            },
            {
              value: '1',
              label: translate({
                id: 'home.stats.container.label',
                message: 'Container to run',
                description: 'Front page Stats label for the container count',
              }),
              color: 'accent',
            },
          ]}
        />
        <BlogPreview
          heading={translate({
            id: 'home.blogPreview.heading',
            message: 'From the Blog',
            description: 'Front page BlogPreview section heading',
          })}
          description={translate({
            id: 'home.blogPreview.description',
            message: 'Release notes, migration guides, and notes on running a safer, sharper community.',
            description: 'Front page BlogPreview section description',
          })}
          auto={true}
          limit={3}
        />
      </main>
    </Layout>
  );
}

export default Home;
