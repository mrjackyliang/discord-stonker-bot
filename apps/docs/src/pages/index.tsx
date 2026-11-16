import {
  BlogPreview,
  BrowserFrame,
  Canvas,
  Features,
  Showcase,
  Spotlight,
} from '@cbnventures/docusaurus-preset-nova/blocks';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import { translate } from '@docusaurus/Translate';
import Heading from '@theme/Heading';
import Layout from '@theme/Layout';
import ThemedImage from '@theme/ThemedImage';

import logsOneDark from '../../docs/control-panel/_assets_/logs-1-dark.png';
import logsOneLight from '../../docs/control-panel/_assets_/logs-1-light.png';
import managingFeaturesOneDark from '../../docs/control-panel/_assets_/managing-features-1-dark.png';
import managingFeaturesOneLight from '../../docs/control-panel/_assets_/managing-features-1-light.png';
import panelBasicsThreeDark from '../../docs/control-panel/_assets_/panel-basics-3-dark.png';
import panelBasicsThreeLight from '../../docs/control-panel/_assets_/panel-basics-3-light.png';
import styles from './index.module.css';

import type { Pages_Index_Home_Returns } from '../types/pages/index.d.ts';

/**
 * Pages - Home.
 *
 * Landing page that composes the hero with the bot's moderator alerts, the feature
 * grid, and the blog preview using theme blocks.
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
                to="/docs/getting-started/installation/"
              >
                {translate({
                  id: 'home.hero.ctaLabel',
                  message: 'Get Started',
                  description: 'Front page hero primary call-to-action button label',
                })}
              </Link>
              <Link
                className="nova-cta-secondary"
                to="/docs/overview/"
              >
                {translate({
                  id: 'home.hero.secondaryCtaLabel',
                  message: 'Learn More',
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
        <Spotlight
          surface="alt"
          className={styles['shot-spotlight']}
          heading={translate({
            id: 'home.showcase.heading',
            message: 'Inside the control panel',
            description: 'Front page heading above the control panel screenshots',
          })}
        >
          <Showcase
            tabsLabel={translate({
              id: 'home.showcase.tabsLabel',
              message: 'Control panel pages',
              description: 'Accessible label for the screenshot tabs on the front page',
            })}
            items={[
              {
                label: translate({
                  id: 'home.showcase.overview.label',
                  message: 'Overview',
                  description: 'Front page screenshot tab for the Overview page',
                }),
                heading: translate({
                  id: 'home.showcase.overview.heading',
                  message: 'Your bot at a glance',
                  description: 'Front page heading for the Overview page screenshot',
                }),
                description: translate({
                  id: 'home.showcase.overview.description',
                  message: 'See whether the bot, control panel, and scheduled jobs are running, which server you are looking at, and how many features are on. Restart or stop the bot from the same page.',
                  description: 'Front page description for the Overview page screenshot',
                }),
                link: {
                  label: translate({
                    id: 'home.showcase.overview.link',
                    message: 'Tour the Control Panel',
                    description: 'Front page link from the Overview screenshot to its guide',
                  }),
                  to: '/docs/control-panel/panel-basics/',
                },
                content: (
                  <BrowserFrame title="Stonker Bot for Discord" url="localhost:22604" favicon="/favicon.svg">
                    <ThemedImage
                      sources={{
                        light: panelBasicsThreeLight,
                        dark: panelBasicsThreeDark,
                      }}
                      alt={translate({
                        id: 'home.showcase.overview.alt',
                        message: 'Overview page with the bot, services, server, and account panels',
                        description: 'Alt text for the Overview page screenshot on the front page',
                      })}
                      width={1280}
                      height={984}
                    />
                  </BrowserFrame>
                ),
              },
              {
                label: translate({
                  id: 'home.showcase.features.label',
                  message: 'Features',
                  description: 'Front page screenshot tab for the Features page',
                }),
                heading: translate({
                  id: 'home.showcase.features.heading',
                  message: 'Turn on only what your server needs',
                  description: 'Front page heading for the Features page screenshot',
                }),
                description: translate({
                  id: 'home.showcase.features.description',
                  message: 'Every feature has its own form with example settings. Set one up, check it, and switch it on for each server. The bot picks up changes within a few seconds.',
                  description: 'Front page description for the Features page screenshot',
                }),
                link: {
                  label: translate({
                    id: 'home.showcase.features.link',
                    message: 'Manage Features',
                    description: 'Front page link from the Features screenshot to its guide',
                  }),
                  to: '/docs/control-panel/managing-features/',
                },
                content: (
                  <BrowserFrame title="Stonker Bot for Discord" url="localhost:22604" favicon="/favicon.svg">
                    <ThemedImage
                      sources={{
                        light: managingFeaturesOneLight,
                        dark: managingFeaturesOneDark,
                      }}
                      alt={translate({
                        id: 'home.showcase.features.alt',
                        message: 'Features page filtered to automation features, each with its setup state and switch',
                        description: 'Alt text for the Features page screenshot on the front page',
                      })}
                      width={1280}
                      height={683}
                    />
                  </BrowserFrame>
                ),
              },
              {
                label: translate({
                  id: 'home.showcase.logs.label',
                  message: 'Logs',
                  description: 'Front page screenshot tab for the Logs page',
                }),
                heading: translate({
                  id: 'home.showcase.logs.heading',
                  message: 'Live logs without a terminal',
                  description: 'Front page heading for the Logs page screenshot',
                }),
                description: translate({
                  id: 'home.showcase.logs.description',
                  message: 'Follow what the bot, the control panel, and the scheduled jobs write as it happens. Filter by service and level, search, and turn on debug logging when you need it.',
                  description: 'Front page description for the Logs page screenshot',
                }),
                link: {
                  label: translate({
                    id: 'home.showcase.logs.link',
                    message: 'Read the Logs',
                    description: 'Front page link from the Logs screenshot to its guide',
                  }),
                  to: '/docs/control-panel/logs/',
                },
                content: (
                  <BrowserFrame title="Stonker Bot for Discord" url="localhost:22604" favicon="/favicon.svg">
                    <ThemedImage
                      sources={{
                        light: logsOneLight,
                        dark: logsOneDark,
                      }}
                      alt={translate({
                        id: 'home.showcase.logs.alt',
                        message: 'Logs page streaming bot entries with service, level, and search filters',
                        description: 'Alt text for the Logs page screenshot on the front page',
                      })}
                      width={1280}
                      height={638}
                    />
                  </BrowserFrame>
                ),
              },
            ]}
          />
        </Spotlight>
        <BlogPreview
          heading={translate({
            id: 'home.blogPreview.heading',
            message: 'From the Blog',
            description: 'Front page BlogPreview section heading',
          })}
          description={translate({
            id: 'home.blogPreview.description',
            message: 'Launches, milestones, and what\'s new in Stonker Bot for Discord.',
            description: 'Front page BlogPreview section description',
          })}
          auto={true}
          limit={3}
          sort="newest"
        />
      </main>
    </Layout>
  );
}

export default Home;
