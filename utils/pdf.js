import PDFDocument from 'pdfkit'; // Подключение библиотеки генерации PDF квитанций

// Функция генерации PDF-ваучера (квитанции) для гостя после успешной оплаты
export const generateVoucher = async (bookingData) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    const buffers = [];
    
    // Сборка буферов данных документа
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    
    // Форматирование квитанции
    doc.fontSize(25).text('RECEIPT / КВИТАНЦИЯ', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Project: Villa Turaman`);
    doc.text(`Guest Name: ${bookingData.name}`);
    doc.text(`Details: ${bookingData.checkIn ? `Check-in: ${bookingData.checkIn}` : 'Service/Guide Order'}`);
    doc.text(`Total Count: ${bookingData.total_guests}`);
    doc.text(`Paid Status: CONFIRMED`);
    
    doc.end(); // Завершение формирования документа
  });
};
