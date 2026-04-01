import { setDefaultOptions } from 'date-fns';
import { de, enGB } from 'date-fns/locale';
import * as logger from 'logger';
import * as NodeHelper from 'node_helper';
import { applyFilter } from './functions/Filter';
import { getBroadcastData } from './functions/Webcrawler';
import { Config } from './types/Config';
import { SocketNotification } from './types/Notification';

export default NodeHelper.create({
  start(): void {
    logger.log(`${this.name} helper method started...`);
  },

  async socketNotificationReceived(notification: SocketNotification, payload: unknown): Promise<void> {
    if (notification === SocketNotification.GET_DATA) {
      logger.debug('Notification received.', notification);
      const config: Config = payload as Config;
      setDefaultOptions({ locale: config.locale === 'de' ? de : enGB });
      const broadcastData = await getBroadcastData(config.baseUrl);
      const filteredBroadcasts = applyFilter(broadcastData, config);
      this.sendSocketNotification(SocketNotification.DATA_RECEIVED, filteredBroadcasts);
    }
  },
});
