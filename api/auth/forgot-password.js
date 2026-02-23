import supabase from '../_utils/db.js';
import { addCorsHeaders } from '../_lib/cors.js';
import { Resend } from 'resend';
import transporter from '../_utils/mailer.js';
export default async function handler(req, res) {
  if (addCorsHeaders(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    // Find user
    const { data: user, error } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(200).json({ message: 'If email exists you will receive OTP' });
    }
    //remove all previous OTP
    await supabase.from('password_reset_otps').delete().eq('email', email);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const { data: insertOTP, error: insertError } = await supabase.from('password_reset_otps').insert(
      [
        {
          email: email,
          otp: otp,
          used: false,
          expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString()
        }
      ]
    )
    if (insertError) throw new Error('Error saving OTP');
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Your Password Reset OTP',
      html: `<p>Your OTP is <strong>${otp}</strong>. Valid for 10 minutes.</p>`
    })
    return res.status(200).json({ message: 'If email exists you will receive OTP' })

  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}