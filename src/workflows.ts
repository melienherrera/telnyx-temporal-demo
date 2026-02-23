import { proxyActivities, log } from '@temporalio/workflow';
import type * as activities from './activities';

const { validateOrder, notifyBarista, sendConfirmation } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

// processPayment has special retry policy due to intermittent failures
const { processPayment } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
  retry: {
    initialInterval: '1s',
    maximumInterval: '10s',
    backoffCoefficient: 2,
    maximumAttempts: 5,
  },
});

export async function greetingWorkflow(input: string): Promise<string> {
  log.info('Received input:', { input });
  return `Hello, World! I received: ${input}`;
}

export async function coffeeOrderWorkflow(order: activities.CoffeeOrder): Promise<string> {
  log.info('Starting coffee order workflow', { order });

  // Step 1: Validate the order
  const isValid = await validateOrder(order);
  if (!isValid) {
    const errorMsg = `Invalid order: ${order.drink} is not available or size ${order.size} is not supported.`;
    log.error(errorMsg);
    return errorMsg;
  }

  // Step 2: Process payment (with automatic retries on failure)
  log.info('Attempting payment...');
  const transactionId = await processPayment(order);
  log.info('Payment processed successfully', { transactionId });

  // Step 3: Notify barista
  await notifyBarista(order);
  log.info('Barista notified');

  // Step 4: Send confirmation
  const confirmation = await sendConfirmation(order, transactionId);
  log.info('Confirmation sent', { confirmation });

  return confirmation;
}
