import { addCorsHeaders } from "../_lib/cors.js";
import authServices from "../_utils/auth.js";
import supabase from "../_utils/db.js";

export default async function handler(req, res) {
  if (addCorsHeaders(req, res)) return;
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let jwtData;
    try {
      jwtData = await authServices.verifyToken(req);
    } catch (error) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { userId, email } = jwtData;

    const { data, error } = await supabase
      .from('users')
      .select(`
        id,
        email,
        created_at,
        profiles (
          name,
          profile_pic_url,
          date_of_birth,
          gender,
          phone_no
        ),
        gym_profiles (
          weight,
          height,
          weight_unit,
          height_unit,
          target_weight,
          fitness_goal,
          fitness_level
        )
      `)
      .eq('id', userId)
      .single();

    if (error || !data) {
      console.error('Error fetching user:', error);
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = {
      id: data.id,
      email: data.email,
      createdAt: data.created_at,
      
      name: data.profiles?.name || null,
      profilePicUrl: data.profiles?.profile_pic_url || null,
      dateOfBirth: data.profiles?.date_of_birth || null,
      gender: data.profiles?.gender || null,
      phoneNo: data.profiles?.phone_no||null,
      dateOfBirth: data.profiles?.data_of_birth||null,
      
      weight: data.gym_profiles?.weight || null,
      height: data.gym_profiles?.height || null,
      weightUnit: data.gym_profiles?.weight_unit || 'kg',
      heightUnit: data.gym_profiles?.height_unit || 'cm',
      targetWeight: data.gym_profiles?.target_weight || null,
      fitnessGoal: data.gym_profiles?.fitness_goal || null,
      fitnessLevel: data.gym_profiles?.fitness_level || null,
    };

    return res.status(200).json({ user: userData });

  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}