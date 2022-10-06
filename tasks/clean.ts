import fsExtra from 'fs-extra';

import { TASK_CLEAN } from 'hardhat/builtin-tasks/task-names';
import { task } from 'hardhat/config';


task(TASK_CLEAN, 'Clears the cache and deletes all artifacts')
  .setAction(
    async ({ global }: { global: boolean }, { config, run, artifacts }, runSuper) => {
      await runSuper();
      await fsExtra.emptyDir("cache-zk");
      await fsExtra.remove("artifacts-zk");
    }
  );