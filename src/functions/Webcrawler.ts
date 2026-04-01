import { load } from 'cheerio';
import { format, isValid, parse } from 'date-fns';
import * as logger from 'logger';
import { Broadcast } from '../types/Broadcast';

export async function getBroadcastData(url: string): Promise<Broadcast[]> {
  const response = await fetch(url);

  if (!response.ok) {
    logger.error('Error fetching broadcasting data.', response);
    return [];
  }

  const body = await response.text();
  const $ = load(body);
  const table = $('[class="aussenrand"]');

  if (!table) {
    logger.error('Error finding broadcast table.');
    return [];
  }

  const tbody = table.find('tbody');
  const rows = tbody.find('tr');
  const broadcasts: Broadcast[] = [];

  for (const row of rows.slice(2)) {
    const dateStr = $(row).find('td').eq(1).text().trim();
    const possibleFormats = [
      // 02.04.2026 - 20:15 Uhr
      "dd.MM.yy - HH:mm 'Uhr'",
      // 02.04.2026 - 20:15Uhr
      "dd.MM.yyyy - HH:mm'Uhr'",
      // 02.04.202620:15 Uhr
      "dd.MM.yyyyHH:mm 'Uhr'",
    ];

    for (const formatStr of possibleFormats) {
      const parsedDate = parse(dateStr, formatStr, new Date());
      if (isValid(parsedDate)) {
        const channelStr =
          $(row).find('td').eq(2).find('img').attr('title') || $(row).find('td').eq(2).find('img').attr('alt') || '';
        const titleStr = $(row).find('td').eq(4).text().trim();

        broadcasts.push({
          date: format(parsedDate, 'eee, dd.MM, HH:mm'),
          channel: channelStr.replace(/\s*\([^)]*\)/g, ''),
          title: titleStr,
        });
        break;
      }
    }
  }

  return broadcasts;
}
