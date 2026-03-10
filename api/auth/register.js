import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import supabase from '../_utils/db.js';
import { addCorsHeaders } from '../_lib/cors.js';

export default async function handler(req, res) {
  // Handle CORS first
  if (addCorsHeaders(req, res)) return;

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { email, password,name } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const { data, error } = await supabase.rpc('register_user_v1', {
      p_email: email,
      p_password_hash: passwordHash,
      p_name: name
    });

    if (error) { 
      throw error;
    }

    const newUser = data[0];

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: newUser.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'User created successfully',
      accessToken,
      refreshToken,
      user: {
        id: newUser.id,
        email: newUser.email
      }
    });

  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}