export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  if (req.query.secret !== process.env.REVALIDATE_SECRET_TOKEN) {
    return res.status(401).json({ message: 'Invalid token' });
  }
  try {
    await res.revalidate('/');
    await res.revalidate('/legal/kvkk');
    await res.revalidate('/legal/contract');
    await res.revalidate('/legal/cancellation');
    await res.revalidate('/legal/privacy');
    return res.json({ revalidated: true });
  } catch (err) {
    return res.status(500).send('Error revalidating');
  }
}
