import { NativeConnection, Worker } from '@temporalio/worker';
import * as workflows from './workflows';
import * as activities from './activities';

async function run() {
  const connection = await NativeConnection.connect({
    address: 'localhost:7233',
  });

  const worker = await Worker.create({
    connection,
    namespace: 'default',
    taskQueue: 'melissas-cafe',
    workflowsPath: require.resolve('./workflows'),
    activities,
  });

  console.log('Worker starting on task queue: melissas-cafe');
  await worker.run();
}

run().catch((err) => {
  console.error('Worker error:', err);
  process.exit(1);
});
