import Stripe from 'stripe'; // Подключение Stripe для EUR/USD
import { YooCheckout } from 'yookassa'; // Подключение ЮKassa для RUB
import Iyzipay from 'iyzipay'; // Подключение Iyzico для TRY
import paypal from '@paypal/checkout-server-sdk'; // Подключение PayPal
import crypto from 'crypto'; // Подключение Crypto для генерации токена Т-Банка

export default async function handler(req, res) {
  // Разрешаем только POST запросы для создания сессии оплаты
  if (req.method !== 'POST') return res.status(405).end();

  // Инициализация клиентов платежных шлюзов (с фоллбэком на dummy для защиты от падений)
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy');
  const yooKassa = new YooCheckout({ 
    shopId: process.env.YOOKASSA_SHOP_ID || 'dummy', 
    secretKey: process.env.YOOKASSA_SECRET_KEY || 'dummy' 
  });
  const iyzipay = new Iyzipay({ 
    apiKey: process.env.IYZICO_API_KEY || 'dummy', 
    secretKey: process.env.IYZICO_SECRET_KEY || 'dummy', 
    uri: 'https://api.iyzipay.com' 
  });
  const paypalClient = new paypal.core.PayPalHttpClient(
    new paypal.core.SandboxEnvironment(
      process.env.PAYPAL_CLIENT_ID || 'dummy', 
      process.env.PAYPAL_CLIENT_SECRET || 'dummy'
    )
  );
  
  // Получение данных из тела запроса
  const { gateway, amount, currency, bookingDetails } = req.body;
  
  // Ключи Т-Банк
  const tbankTerminalKey = process.env.TBANK_TERMINAL_KEY;
  const tbankSecretKey = process.env.TBANK_SECRET_KEY;
  
  // Формирование URL-адресов возврата
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const successUrl = `${baseUrl}/api/payment_success?data=${encodeURIComponent(JSON.stringify(bookingDetails))}`;
  const cancelUrl = `${baseUrl}/?payment=cancel`;
  
  try {
    // === ЛОГИКА STRIPE ===
    if (gateway === 'stripe') {
      const session = await stripe.checkout.sessions.create({ 
        payment_method_types: ['card'], 
        line_items: [{ 
          price_data: { 
            currency: currency.toLowerCase(), 
            product_data: { name: 'Villa Turaman Order' }, 
            unit_amount: Math.round(amount * 100) // Конвертация в центы
          }, 
          quantity: 1 
        }], 
        mode: 'payment', 
        success_url: successUrl, 
        cancel_url: cancelUrl 
      });
      return res.status(200).json({ success: true, url: session.url });
    }
    
    // === ЛОГИКА YOOKASSA ===
    if (gateway === 'yookassa') {
      const payment = await yooKassa.createPayment({ 
        amount: { value: amount.toString(), currency: 'RUB' }, 
        confirmation: { type: 'redirect', return_url: successUrl }, 
        capture: true, 
        description: 'Оплата Villa Turaman' 
      });
      return res.status(200).json({ success: true, url: payment.confirmation.confirmation_url });
    }
    
    // === ЛОГИКА PAYPAL ===
    if (gateway === 'paypal') {
      const request = new paypal.orders.OrdersCreateRequest(); 
      request.prefer("return=representation"); 
      request.requestBody({ 
        intent: 'CAPTURE', 
        purchase_units: [{ amount: { currency_code: currency, value: amount.toString() } }], 
        application_context: { return_url: successUrl, cancel_url: cancelUrl } 
      });
      const order = await paypalClient.execute(request); 
      return res.status(200).json({ success: true, url: order.result.links.find(link => link.rel === 'approve').href });
    }
    
    // === ЛОГИКА Т-БАНК (ИНТЕГРАЦИЯ ИЗ ТЗ) ===
    if (gateway === 'tbank') {
      // Проверка наличия ключей Т-Банка
      if (!tbankTerminalKey || !tbankSecretKey) {
        return res.status(500).json({ error: "T-Bank credentials are not configured in environment variables." });
      }
      
      const orderId = `villa-${Date.now()}`;
      
      // Формирование Payload для инициализации платежа
      const payload = {
        TerminalKey: tbankTerminalKey,
        Amount: Math.round(amount * 100), // Т-Банк требует сумму в копейках
        OrderId: orderId,
        Description: `Заказ на ${baseUrl}`,
        SuccessURL: successUrl,
        FailURL: cancelUrl,
        Receipt: {
          Email: bookingDetails.contact && bookingDetails.contact.includes('@') ? bookingDetails.contact : 'no-reply@villaturaman.com',
          Taxation: 'usn_income_outcome',
          Items: [
            {
              Name: bookingDetails.checkIn ? `Аренда виллы ${bookingDetails.checkIn}` : 'Заказ услуги/гида',
              Price: Math.round(amount * 100), // Цена в копейках
              Quantity: 1.00,
              Amount: Math.round(amount * 100), // Итоговая сумма в копейках
              Tax: 'none', // Без НДС
              PaymentObject: 'service', // Тип объекта оплаты - услуга
            }
          ]
        }
      };
      
      // Функция генерации SHA-256 токена защиты (Сортировка ключей -> Конкатенация -> Хеширование)
      const generateToken = (args) => {
        const data = { ...args, Password: tbankSecretKey };
        delete data.Receipt; 
        delete data.DATA; 
        delete data.Token;
        // Сортировка ключей в алфавитном порядке
        const sortedKeys = Object.keys(data).sort((a, b) => a.localeCompare(b));
        // Объединение значений
        const concatenatedValues = sortedKeys.map(key => data[key]).join('');
        return crypto.createHash('sha256').update(concatenatedValues).digest('hex');
      };
      
      payload.Token = generateToken(payload); // Добавление токена в payload

      // Инициализация платежной сессии через API Т-Банка
      const tbankRes = await fetch('https://securepay.tinkoff.ru/v2/Init', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(payload) 
      });
      const tbankData = await tbankRes.json();
      
      // Возврат ссылки на форму оплаты при успехе
      if (tbankData.Success && tbankData.PaymentURL) {
        return res.status(200).json({ success: true, url: tbankData.PaymentURL });
      } else {
        return res.status(400).json({ error: tbankData.Message || "Ошибка инициализации платежа Т-Банк", details: tbankData.Details });
      }
    }
    
    // Фолбек для неизвестных шлюзов
    res.status(400).json({ error: "Неизвестный шлюз оплаты" });
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  }
}
