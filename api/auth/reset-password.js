import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import supabase from '../_utils/db.js';
import { addCorsHeaders } from '../_lib/cors.js';

export default async function handler(req, res) {
  if (addCorsHeaders(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { email, newPassword, resetPasswordToken } = req.body;
    if (!email || !newPassword || !resetPasswordToken) {
      return res.status(400).json({ error: 'Email, new password, and token are required' });
    }

    let decoded;
    try {
      decoded = jwt.verify(resetPasswordToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired reset token' });
    }

    if (decoded.email !== email) {
      return res.status(401).json({ error: 'Token does not match email' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);


    const { error: updateError } = await supabase
      .from('users')
      .update({ password_hash: hashedPassword })
      .eq('email', email);

    if (updateError) {
      return res.status(500).json({ error: 'Failed to update password' });
    }

    await supabase.from('password_reset_otps').delete().eq('email', email);

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
