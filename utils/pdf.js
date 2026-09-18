// ==============================================================================
// ГЕНЕРАЦИЯ PDF-ВАУЧЕРОВ И КВИТАНЦИЙ БРОНИРОВАНИЯ
// Файл: utils/pdf.js
// Назначение: Автоматическое формирование официального подтверждения бронирования (ваучера)
// для заселения на Villa Turaman после успешной оплаты.
// ==============================================================================

import PDFDocument from 'pdfkit';

/**
 * Генерирует PDF-документ квитанции / ваучера на проживание
 * @param {Object} bookingData - Данные бронирования (имя, даты, гости, сумма)
 * @returns {Promise<Buffer>} Буфер сгенерированного PDF файла
 */
export const generateVoucher = async (bookingData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers = [];

      // Накопление бинарных чанков документа
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      // 1. Верхний колонтитул и логотип
      doc.fontSize(22).font('Helvetica-Bold').text('VILLA TURAMAN', { align: 'center' });
      doc.fontSize(11).font('Helvetica').text('Luxury Waterfront Residence • Dalyan, Mugla, Turkey', { align: 'center' });
      doc.fontSize(9).fillColor('#64748b').text('Tax ID / VKN: 9991120181 | Host: Aleksei Znamenskii', { align: 'center' });
      doc.moveDown(1.5);

      // Разделительная линия
      doc.strokeColor('#e2e8f0').lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(1.5);

      // 2. Заголовок квитанции
      doc.fillColor('#0f172a').fontSize(16).font('Helvetica-Bold').text('OFFICIAL BOOKING CONFIRMATION & VOUCHER', { align: 'center' });
      doc.fontSize(10).font('Helvetica').fillColor('#64748b').text(`Issue Date: ${new Date().toLocaleDateString('ru-RU')}`, { align: 'center' });
      doc.moveDown(2);

      // 3. Блок сведений о госте и бронировании
      doc.fontSize(12).font('Helvetica-Bold').fillColor('#0f172a').text('GUEST & RESERVATION DETAILS');
      doc.moveDown(0.5);

      doc.fontSize(10).font('Helvetica').fillColor('#334155');
      doc.text(`Guest Full Name: ${bookingData.name || 'Valued Guest'}`);
      doc.text(`Contact: ${bookingData.contact || 'Registered Contact'}`);
      if (bookingData.checkIn && bookingData.checkOut) {
        doc.text(`Check-in Date: ${bookingData.checkIn} (from 16:00)`);
        doc.text(`Check-out Date: ${bookingData.checkOut} (until 10:00)`);
        doc.text(`Total Nights: ${bookingData.nights || 1}`);
      }
      doc.text(`Total Guests: ${bookingData.total_guests || bookingData.guests || 2} (Adults: ${bookingData.adults || 2}, Children: ${bookingData.children || 0})`);
      doc.text(`Total Paid Amount: ${bookingData.amount || bookingData.price || 0} ${bookingData.currency || 'RUB'}`);
      doc.text(`Payment Status: CONFIRMED & PAID IN FULL`);
      doc.moveDown(1.5);

      // 4. Инструкция по прибытию и правила
      doc.fontSize(12).font('Helvetica-Bold').fillColor('#0f172a').text('ARRIVAL INSTRUCTIONS & HOUSE RULES');
      doc.moveDown(0.5);
      doc.fontSize(9).font('Helvetica').fillColor('#475569');
      doc.text('• Address: Maras Mah., Kaunos Sok., Dalyan, Ortaca, Mugla, Turkey.');
      doc.text('• Self Check-in: The villa is equipped with an electronic smart lock. Access code will be sent via chat 24h prior.');
      doc.text('• Smoking inside the villa is strictly prohibited. Permitted only on outdoor terraces.');
      doc.text('• Quiet hours: 23:00 - 08:00 in accordance with Dalyan municipality regulations.');
      doc.text('• Direct Contact with Host Aleksei Znamenskii: Telegram @AlekseiZnamenskii | Email: villaturaman@gmail.com');
      doc.moveDown(2);

      // 5. Подвал с печатью и благодарностью
      doc.strokeColor('#e2e8f0').lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(1);
      doc.fontSize(10).font('Helvetica-Oblique').fillColor('#64748b').text('Thank you for choosing Villa Turaman! We wish you an unforgettable vacation in Dalyan.', { align: 'center' });

      // Завершение потока документа
      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

