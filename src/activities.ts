export interface CoffeeOrder {
  drink: string;
  size: string;
  customerName: string;
}

export async function validateOrder(order: CoffeeOrder): Promise<boolean> {
  console.log(`[validateOrder] Validating order for ${order.customerName}: ${order.size} ${order.drink}`);

  // Simulate validation delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Simulate validation logic
  const validDrinks = ['latte', 'cappuccino', 'americano', 'espresso', 'mocha', 'matcha'];
  const validSizes = ['small', 'medium', 'large'];

  const isValid = validDrinks.includes(order.drink.toLowerCase()) &&
                  validSizes.includes(order.size.toLowerCase());

  console.log(`[validateOrder] Order ${isValid ? 'valid' : 'invalid'}`);
  return isValid;
}

export async function processPayment(order: CoffeeOrder): Promise<string> {
  console.log(`[processPayment] Processing payment for ${order.customerName}'s ${order.drink}`);

  // Simulate payment processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  /* // Uncomment this to simulate intermittent payment gateway failures
  // Simulate intermittent payment gateway failures (60% chance of failure)
  const failureChance = Math.random();
  if (failureChance < 0.6) {
    console.error(`[processPayment] ❌ Payment gateway error - retrying...`);
    throw new Error('Payment gateway timeout - please retry');
  } */
   

  const transactionId = `txn_${Date.now()}`;
  console.log(`[processPayment] ✅ Payment successful. Transaction ID: ${transactionId}`);

  return transactionId;
}

export async function notifyBarista(order: CoffeeOrder): Promise<void> {
  console.log(`[notifyBarista] 🔔 New order for barista: ${order.size} ${order.drink} for ${order.customerName}`);

  // Simulate notification
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log(`[notifyBarista] Barista notified successfully`);
}

export async function sendConfirmation(order: CoffeeOrder, transactionId: string): Promise<string> {
  console.log(`[sendConfirmation] Sending confirmation to ${order.customerName}`);

  // Simulate sending confirmation delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const confirmationMessage = `Thank you ${order.customerName}! Your ${order.size} ${order.drink} is being prepared. Order #${transactionId}`;

  console.log(`[sendConfirmation] ${confirmationMessage}`);

  return confirmationMessage;
}
