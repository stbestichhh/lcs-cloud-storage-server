import * as cron from 'node-cron';
import { BlackList } from '../../lib/db';
import { Op } from 'sequelize';

const time = '0 0 0 */30 * *';
const deleteTime = 30;

const isValid = cron.validate(time);

if (!isValid) {
  throw new RangeError('Wrong schedule time.');
}

export const clearBlacklistJob = cron.schedule(time, async () => {
  const date = new Date();
  const lte = date.setDate(date.getDate() - deleteTime);

  await BlackList.destroy({
    where: {
      created: {
        [Op.lte]: lte,
      },
    },
  });
});
