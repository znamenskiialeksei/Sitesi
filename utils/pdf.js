import PDFDocument from 'pdfkit';
export const generateVoucher = async (bookingData) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.fontSize(25).text('ORDER CONFIRMATION / ПОДТВЕРЖДЕНИЕ ЗАКАЗА', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Academy: Vasilisa Znamenskii`);
    doc.text(`Client: ${bookingData.name}`);
    doc.text(`Item: ${bookingData.itemName}`);
    doc.text(`Amount: ${bookingData.totalPrice}`);
    doc.text(`Status: PAID / ОПЛАЧЕНО`);
    doc.end();
  });
};
