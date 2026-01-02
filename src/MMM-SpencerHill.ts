import * as logger from 'logger';
import { Config } from './types/Config';
import { SocketNotification } from './types/Notification';

Module.register<Config>('MMM-SpencerHill', {
  defaults: {
    header: 'Bud Spencer & Terence Hill',
    updateInterval: 60 * 60 * 1000,
    blacklist: [],
    whitelist: [],
    maxEntries: 5,
    locale: 'de',
  },

  start(): void {
    logger.info(`Starting module ${this.name}`);
    this.sendSocketNotification(SocketNotification.GET_DATA, this.config);

    setInterval(() => {
      logger.info('Loading broadcast data.');
      this.sendSocketNotification(SocketNotification.GET_DATA, this.config);
    }, this.config.updateInterval);
  },

  getStyles(): string[] {
    return ['MMM-SpencerHill.css'];
  },

  getTemplate(): string {
    return 'templates/MMM-SpencerHill.njk';
  },

  getTemplateData(): { config: Config; state: unknown } {
    return {
      config: this.config,
      state: this.state as unknown,
    };
  },

  getTranslations(): Record<string, string> {
    return {
      de: 'translations/de.json',
      en: 'translations/en.json',
    };
  },

  socketNotificationReceived(notificationIdentifier: SocketNotification, payload: unknown): void {
    if (notificationIdentifier === SocketNotification.DATA_RECEIVED) {
      logger.log('Received broadcast data.', payload);
      this.state = { broadcasts: payload };
      this.updateDom();
    }
  },
});
