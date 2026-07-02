import speakeasy from 'speakeasy';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  const { token } = req.body;

  const appSecret = process.env.NEXT_PUBLIC_ADMIN_2FA_SECRET;

  if (!appSecret) {
    return res.status(400).json({ success: false, error: "Ключ NEXT_PUBLIC_ADMIN_2FA_SECRET не настроен" });
  }

  const verified = speakeasy.totp.verify({
    secret: appSecret,
    encoding: 'base32',
    token: token,
    window: 2
  });

  if (verified) {
    const sessionToken = jwt.sign({ role: 'owner' }, appSecret, { expiresIn: '12h' });
    return res.status(200).json({ success: true, sessionToken });
  } else {
    return res.status(400).json({ success: false, error: "Неверный код верификации!" });
  }
}
