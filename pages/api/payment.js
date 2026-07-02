import Stripe from 'stripe'; import { YooCheckout } from 'yookassa'; import Iyzipay from 'iyzipay'; import paypal from '@paypal/checkout-server-sdk';
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy');
  const yooKassa = new YooCheckout({ shopId: process.env.YOOKASSA_SHOP_ID || 'dummy', secretKey: process.env.YOOKASSA_SECRET_KEY || 'dummy' });
  const iyzipay = new Iyzipay({ apiKey: process.env.IYZICO_API_KEY || 'dummy', secretKey: process.env.IYZICO_SECRET_KEY || 'dummy', uri: 'https://api.iyzipay.com' });
  const paypalClient = new paypal.core.PayPalHttpClient(new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID || 'dummy', process.env.PAYPAL_CLIENT_SECRET || 'dummy'));
  const { gateway, amount, currency, bookingDetails } = req.body;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const successUrl = `${baseUrl}/api/payment_success?data=${encodeURIComponent(JSON.stringify(bookingDetails))}`;
  const cancelUrl = `${baseUrl}/?payment=cancel`;
  try {
    if (gateway === 'stripe') {
      const session = await stripe.checkout.sessions.create({ payment_method_types: ['card'], line_items: [{ price_data: { currency: currency.toLowerCase(), product_data: { name: bookingDetails.itemName || 'Vasilisa Academy' }, unit_amount: amount * 100 }, quantity: 1 }], mode: 'payment', success_url: successUrl, cancel_url: cancelUrl });
      return res.status(200).json({ success: true, url: session.url });
    }
    if (gateway === 'yookassa') {
      const payment = await yooKassa.createPayment({ amount: { value: amount.toString(), currency: 'RUB' }, confirmation: { type: 'redirect', return_url: successUrl }, capture: true, description: `Заказ в Vasilisa Academy: ${bookingDetails.itemName}` });
      return res.status(200).json({ success: true, url: payment.confirmation.confirmation_url });
    }
    if (gateway === 'paypal') {
      const request = new paypal.orders.OrdersCreateRequest(); request.prefer("return=representation"); request.requestBody({ intent: 'CAPTURE', purchase_units: [{ amount: { currency_code: currency, value: amount.toString() } }], application_context: { return_url: successUrl, cancel_url: cancelUrl } });
      const order = await paypalClient.execute(request); return res.status(200).json({ success: true, url: order.result.links.find(link => link.rel === 'approve').href });
    }
    res.status(400).json({ error: "Неизвестный шлюз" });
  } catch (error) { res.status(500).json({ error: error.message }); }
}
