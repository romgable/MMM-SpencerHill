import { Broadcast } from '../types/Broadcast';
import { Config } from '../types/Config';

export function applyFilter(broadcasts: Broadcast[], config: Config): Broadcast[] {
  const { blacklist, whitelist, maxEntries } = config;

  return broadcasts
    .filter((broadcast) => !blacklist.some((entry) => entry === broadcast.channel))
    .filter((broadcast) => whitelist.length === 0 || whitelist.some((entry) => entry === broadcast.channel))
    .slice(0, maxEntries !== 0 ? maxEntries : broadcasts.length);
}
