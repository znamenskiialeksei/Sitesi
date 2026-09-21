// ==============================================================================
// МУЛЬТИВАЛЮТНЫЙ ПЛАТЕЖНЫЙ ХАБ VILLA TURAMAN
// Файл: pages/api/payment.js
// Назначение: Создание платежных сессий через Stripe, T-Банк, ЮKassa, Iyzico и PayPal
// ==============================================================================

import crypto from 'crypto';

export default async function handler(req, res) {
  // Разрешаем только POST запросы для генерации платежного шлюза
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { gateway, amount, currency = 'RUB', bookingDetails, origin: clientOrigin } = req.body || {};

    if (!gateway || !amount || !bookingDetails) {
      return res.status(400).json({ error: 'Отсутствуют обязательные параметры платежа' });
    }

    // Динамическое определение базового URL текущего домена [Vercel, custom domain или local]
    const protocol = req.headers['x-forwarded-proto'] || (req.connection?.encrypted ? 'https' : 'http');
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const headerOrigin = host ? `${protocol}://${host}` : null;
    const baseUrl = clientOrigin || headerOrigin || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const successUrl = `${baseUrl}/api/payment_success?data=${encodeURIComponent(JSON.stringify(bookingDetails))}`;
    const cancelUrl = `${baseUrl}/?payment=cancel`;

    // --------------------------------------------------------------------------
    // 1. ШЛЮЗ STRIPE : Международные банковские карты EUR и USD
    // --------------------------------------------------------------------------
    if (gateway === 'stripe') {
      if (!process.env.STRIPE_SECRET_KEY) {
        console.log('[Payment Stripe Test Mode]: Ключи Stripe не настроены в .env.local. Имитация успешного платежа.');
        return res.status(200).json({
          success: true,
          url: successUrl,
          isTestMode: true,
          message: 'Тестовый режим оплаты : ключи Stripe не заданы в .env.local'
        });
      }

      const { default: Stripe } = await import('stripe');
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: currency.toLowerCase(),
              product_data: {
                name: `Бронирование Villa Turaman: ${bookingDetails.checkIn || 'Проживание'}`,
                description: `Гость: ${bookingDetails.name || 'Путешественник'}`
              },
              unit_amount: Math.round(amount * 100)
            },
            quantity: 1
          }
        ],
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl
      });

      return res.status(200).json({ success: true, url: session.url });
    }

    // --------------------------------------------------------------------------
    // 2. ШЛЮЗ Т-БАНК : Эквайринг Т-Банка с онлайн-чеком ФЗ-54
    // --------------------------------------------------------------------------
    if (gateway === 'tbank') {
      const tbankTerminalKey = process.env.TBANK_TERMINAL_KEY;
      const tbankSecretKey = process.env.TBANK_SECRET_KEY;

      if (!tbankTerminalKey || !tbankSecretKey) {
        console.log('[Payment T-Bank Test Mode]: Ключи Т-Банка не настроены в .env.local. Имитация успешного платежа.');
        return res.status(200).json({
          success: true,
          url: successUrl,
          isTestMode: true,
          message: 'Тестовый режим оплаты : ключи Т-Банка не заданы в .env.local'
        });
      }

      const orderId = `villa-${Date.now()}`;
      const amountInKopecks = Math.round(amount * 100);

      const payload = {
        TerminalKey: tbankTerminalKey,
        Amount: amountInKopecks,
        OrderId: orderId,
        Description: `Бронирование Villa Turaman: ${bookingDetails.checkIn || 'Проживание'}`,
        SuccessURL: successUrl,
        FailURL: cancelUrl,
        Receipt: {
          Email: bookingDetails.contact && bookingDetails.contact.includes('@') ? bookingDetails.contact : 'guest@villaturaman.com',
          Taxation: 'usn_income_outcome',
          Items: [
            {
              Name: bookingDetails.checkIn ? `Аренда виллы ${bookingDetails.checkIn} - ${bookingDetails.checkOut || ''}` : 'Оплата услуг Villa Turaman',
              Price: amountInKopecks,
              Quantity: 1.0,
              Amount: amountInKopecks,
              Tax: 'none',
              PaymentObject: 'service'
            }
          ]
        }
      };

      const generateToken = (args) => {
        const data = { ...args, Password: tbankSecretKey };
        delete data.Receipt;
        delete data.DATA;
        delete data.Token;

        const sortedKeys = Object.keys(data).sort((a, b) => a.localeCompare(b));
        const concatenatedValues = sortedKeys.map((key) => data[key]).join('');
        return crypto.createHash('sha256').update(concatenatedValues).digest('hex');
      };

      payload.Token = generateToken(payload);

      const tbankRes = await fetch('https://securepay.tinkoff.ru/v2/Init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const tbankData = await tbankRes.json();

      if (tbankData.Success && tbankData.PaymentURL) {
        return res.status(200).json({ success: true, url: tbankData.PaymentURL });
      } else {
        return res.status(400).json({
          error: tbankData.Message || 'Ошибка создания платежа в Т-Банке',
          details: tbankData.Details
        });
      }
    }

    // --------------------------------------------------------------------------
    // 3. ШЛЮЗ ЮКАССА : Банковские карты РФ, SberPay, СБП
    // --------------------------------------------------------------------------
    if (gateway === 'yookassa') {
      if (!process.env.YOOKASSA_SHOP_ID || !process.env.YOOKASSA_SECRET_KEY) {
        console.log('[Payment YooKassa Test Mode]: Ключи YooKassa не настроены. Имитация платежа.');
        return res.status(200).json({
          success: true,
          url: successUrl,
          isTestMode: true,
          message: 'Тестовый режим оплаты : ключи YooKassa не заданы в .env.local'
        });
      }

      const { YooCheckout } = await import('yookassa');
      const yooKassa = new YooCheckout({
        shopId: process.env.YOOKASSA_SHOP_ID,
        secretKey: process.env.YOOKASSA_SECRET_KEY
      });

      const payment = await yooKassa.createPayment({
        amount: {
          value: Number(amount).toFixed(2),
          currency: 'RUB'
        },
        confirmation: {
          type: 'redirect',
          return_url: successUrl
        },
        capture: true,
        description: `Villa Turaman: ${bookingDetails.name || 'Гость'}`
      });

      return res.status(200).json({ success: true, url: payment.confirmation.confirmation_url });
    }

    // --------------------------------------------------------------------------
    // 4. ШЛЮЗ PAYPAL
    // --------------------------------------------------------------------------
    if (gateway === 'paypal') {
      if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
        console.log('[Payment PayPal Test Mode]: Ключи PayPal не настроены. Имитация платежа.');
        return res.status(200).json({
          success: true,
          url: successUrl,
          isTestMode: true,
          message: 'Тестовый режим оплаты : ключи PayPal не заданы в .env.local'
        });
      }

      const paypalModule = await import('@paypal/checkout-server-sdk');
      const paypal = paypalModule.default || paypalModule;
      const paypalClient = new paypal.core.PayPalHttpClient(
        new paypal.core.SandboxEnvironment(
          process.env.PAYPAL_CLIENT_ID,
          process.env.PAYPAL_CLIENT_SECRET
        )
      );

      const request = new paypal.orders.OrdersCreateRequest();
      request.prefer('return=representation');
      request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: Number(amount).toFixed(2)
            }
          }
        ],
        application_context: {
          return_url: successUrl,
          cancel_url: cancelUrl
        }
      });

      const order = await paypalClient.execute(request);
      const approveLink = order.result.links.find((link) => link.rel === 'approve')?.href;

      return res.status(200).json({ success: true, url: approveLink || successUrl });
    }

    // --------------------------------------------------------------------------
    // 5. ШЛЮЗ IYZICO : Турецкая платежная система
    // --------------------------------------------------------------------------
    if (gateway === 'iyzico') {
      if (!process.env.IYZICO_API_KEY || !process.env.IYZICO_SECRET_KEY) {
        console.log('[Payment Iyzico Test Mode]: Ключи Iyzico не настроены. Имитация платежа.');
        return res.status(200).json({
          success: true,
          url: successUrl,
          isTestMode: true,
          message: 'Тестовый режим оплаты : ключи Iyzico не заданы в .env.local'
        });
      }

      const { default: Iyzipay } = await import('iyzipay');
      const iyzipay = new Iyzipay({
        apiKey: process.env.IYZICO_API_KEY,
        secretKey: process.env.IYZICO_SECRET_KEY,
        uri: 'https://api.iyzipay.com'
      });

      const request = {
        locale: Iyzipay.LOCALE.TR,
        conversationId: `order-${Date.now()}`,
        price: Number(amount).toFixed(2),
        paidPrice: Number(amount).toFixed(2),
        currency: Iyzipay.CURRENCY.TRY,
        basketId: `B${Date.now()}`,
        paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
        callbackUrl: successUrl,
        buyer: {
          id: 'BY789',
          name: bookingDetails.name || 'Guest',
          surname: 'Guest',
          gsmNumber: '+905350000000',
          email: bookingDetails.contact && bookingDetails.contact.includes('@') ? bookingDetails.contact : 'guest@villaturaman.com',
          identityNumber: '74300864791',
          registrationAddress: 'Dalyan, Ortaca, Mugla',
          ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1',
          city: 'Mugla',
          country: 'Turkey'
        },
        shippingAddress: {
          contactName: bookingDetails.name || 'Guest',
          city: 'Mugla',
          country: 'Turkey',
          address: 'Dalyan, Ortaca, Mugla'
        },
        billingAddress: {
          contactName: bookingDetails.name || 'Guest',
          city: 'Mugla',
          country: 'Turkey',
          address: 'Dalyan, Ortaca, Mugla'
        },
        basketItems: [
          {
            id: 'BI101',
            name: 'Villa Turaman Reservation',
            category1: 'Accommodation',
            itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
            price: Number(amount).toFixed(2)
          }
        ]
      };

      return new Promise((resolve) => {
        iyzipay.checkoutFormInitialize.create(request, (err, result) => {
          if (err || result.status !== 'success') {
            resolve(res.status(400).json({ error: result?.errorMessage || 'Ошибка Iyzico' }));
          } else {
            resolve(res.status(200).json({ success: true, url: result.paymentPageUrl }));
          }
        });
      });
    }

    return res.status(400).json({ error: 'Неизвестный шлюз оплаты' });
  } catch (error) {
    console.error('[Payment API Error]:', error);
    return res.status(500).json({ success: false, error: error.message || 'Ошибка платежного сервиса' });
  }
}
