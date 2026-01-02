import { load } from 'cheerio';
import { format, parse } from 'date-fns';
import * as logger from 'logger';
import { Broadcast } from '../types/Broadcast';

const url = `https://spencerhilldb.de/tvtermine.php`;

export async function getBroadcastData(): Promise<Broadcast[]> {
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
    const parsedDate = parse(dateStr, "dd.MM.yy - HH:mm 'Uhr'", new Date());
    const channelStr = $(row).find('td').eq(2).text().trim();

    broadcasts.push({
      date: format(parsedDate, 'eee, dd.MM HH:mm'),
      channel: channelStr.replace(/\s*\([^)]*\)/g, ''),
      title: $(row).find('td').eq(3).text().trim(),
    });
  }

  return broadcasts;
}
