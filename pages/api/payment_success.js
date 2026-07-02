export default async function handler(req, res) {
  const { data } = req.query;
  if (data) {
    try {
      const bookingData = JSON.parse(decodeURIComponent(data));
      bookingData.status = "ОПЛАЧЕНО";
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      await fetch(`${baseUrl}/api/booking`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(bookingData) });
      res.redirect(302, '/?status=success');
    } catch (e) { res.redirect(302, '/?status=error'); }
  } else { res.redirect(302, '/'); }
}
