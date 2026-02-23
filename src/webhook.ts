import express from 'express';
import { Connection, Client } from '@temporalio/client';
import { greetingWorkflow, coffeeOrderWorkflow } from './workflows';
import type { CoffeeOrder } from './activities';

const app = express();
app.use(express.json());

let temporalClient: Client;

async function initTemporal() {
  const connection = await Connection.connect({
    address: 'localhost:7233',
  });

  temporalClient = new Client({
    connection,
    namespace: 'default',
  });
}

app.post('/webhook', async (req, res) => {
  try {
    console.log('Received webhook:', JSON.stringify(req.body, null, 2));

    const workflowId = `cafe-${Date.now()}`;

    // Check if this is a coffee order
    if (req.body.drink && req.body.size && req.body.customerName) {
      const order: CoffeeOrder = {
        drink: req.body.drink,
        size: req.body.size,
        customerName: req.body.customerName,
      };

      console.log(`Starting coffee order workflow for ${order.customerName}: ${order.size} ${order.drink}`);

      const handle = await temporalClient.workflow.start(coffeeOrderWorkflow, {
        taskQueue: 'melissas-cafe',
        workflowId,
        args: [order],
      });

      console.log(`Started workflow: ${workflowId}`);
      res.json({ wd: workflowId, message: 'Coffee order received!' });
    } else if (req.body.greeting) {
      // Fall back to greeting workflow
      const message = req.body.greeting;

      console.log(`Starting greeting workflow with message: "${message}"`);

      const handle = await temporalClient.workflow.start(greetingWorkflow, {
        taskQueue: 'melissas-cafe',
        workflowId,
        args: [message],
      });

      console.log(`Started workflow: ${workflowId}`);
      res.json({ wd: workflowId, message: 'Greeting received!' });
    } else {
      res.status(400).json({ error: 'Missing required parameters' });
    }
  } catch (error) {
    console.error('Error starting workflow:', error);
    res.status(500).json({ error: 'Failed to start workflow' });
  }
});

async function start() {
  await initTemporal();

  app.listen(3000, () => {
    console.log('Webhook server listening on port 3000');
  });
}

start().catch((err) => {
  console.error('Failed to start webhook server:', err);
  process.exit(1);
});
