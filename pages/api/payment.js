// ==============================================================================
// МУЛЬТИВАЛЮТНЫЙ ПЛАТЕЖНЫЙ ХАБ VILLA TURAMAN
// Файл: pages/api/payment.js
// Назначение: Создание платежных сессий через Stripe (EUR/USD), T-Банк (RUB СБП/карты),
// ЮKassa (RUB), Iyzico (TRY) и PayPal для мгновенной оплаты бронирований и услуг.
// ==============================================================================

import Stripe from 'stripe';
import { YooCheckout } from 'yookassa';
import Iyzipay from 'iyzipay';
import paypal from '@paypal/checkout-server-sdk';
import crypto from 'crypto';

export default async function handler(req, res) {
  // Разрешаем только POST запросы для генерации платежного шлюза
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Безопасная инициализация клиентов платежных систем
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

  const { gateway, amount, currency = 'RUB', bookingDetails } = req.body;

  if (!gateway || !amount || !bookingDetails) {
    return res.status(400).json({ error: 'Отсутствуют обязательные параметры платежа' });
  }

  // Формирование абсолютных URL-адресов возврата после оплаты
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const successUrl = `${baseUrl}/api/payment_success?data=${encodeURIComponent(JSON.stringify(bookingDetails))}`;
  const cancelUrl = `${baseUrl}/?payment=cancel`;

  try {
    // --------------------------------------------------------------------------
    // 1. ШЛЮЗ STRIPE (Международные банковские карты EUR / USD)
    // --------------------------------------------------------------------------
    if (gateway === 'stripe') {
      if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(500).json({ error: 'Ключи Stripe не настроены в .env' });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: currency.toLowerCase(),
              product_data: {
                name: `Бронирование Villa Turaman (${bookingDetails.checkIn || 'Проживание'})`,
                description: `Гость: ${bookingDetails.name || 'Путешественник'}`
              },
              unit_amount: Math.round(amount * 100) // Stripe принимает суммы в центах
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
    // 2. ШЛЮЗ ЮКАССА (Банковские карты РФ, SberPay, СБП)
    // --------------------------------------------------------------------------
    if (gateway === 'yookassa') {
      if (!process.env.YOOKASSA_SHOP_ID || !process.env.YOOKASSA_SECRET_KEY) {
        return res.status(500).json({ error: 'Ключи YooKassa не настроены в .env' });
      }

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
        description: `Villa Turaman: ${bookingDetails.name || 'Гость'} (${bookingDetails.checkIn || ''})`
      });

      return res.status(200).json({ success: true, url: payment.confirmation.confirmation_url });
    }

    // --------------------------------------------------------------------------
    // 3. ШЛЮЗ PAYPAL
    // --------------------------------------------------------------------------
    if (gateway === 'paypal') {
      if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
        return res.status(500).json({ error: 'Ключи PayPal не настроены в .env' });
      }

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

      return res.status(200).json({ success: true, url: approveLink });
    }

    // --------------------------------------------------------------------------
    // 4. ШЛЮЗ Т-БАНК (Эквайринг Т-Банка с онлайн-чеком ФЗ-54)
    // --------------------------------------------------------------------------
    if (gateway === 'tbank') {
      const tbankTerminalKey = process.env.TBANK_TERMINAL_KEY;
      const tbankSecretKey = process.env.TBANK_SECRET_KEY;

      if (!tbankTerminalKey || !tbankSecretKey) {
        return res.status(500).json({ error: 'Ключи Т-Банка не настроены в переменных окружения' });
      }

      const orderId = `villa-${Date.now()}`;
      const amountInKopecks = Math.round(amount * 100);

      const payload = {
        TerminalKey: tbankTerminalKey,
        Amount: amountInKopecks,
        OrderId: orderId,
        Description: `Бронирование Villa Turaman (${bookingDetails.checkIn || 'Проживание'})`,
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

      // Генерация цифровой подписи SHA-256 по правилам API Т-Банка
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
    // 5. ШЛЮЗ IYZICO (Турецкая платежная система)
    // --------------------------------------------------------------------------
    if (gateway === 'iyzico') {
      if (!process.env.IYZICO_API_KEY || !process.env.IYZICO_SECRET_KEY) {
        return res.status(500).json({ error: 'Ключи Iyzico не настроены' });
      }

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
          email: bookingDetails.contact?.includes('@') ? bookingDetails.contact : 'guest@villaturaman.com',
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
    console.error('Ошибка платежного сервиса:', error);
    return res.status(500).json({ error: error.message });
  }
}

