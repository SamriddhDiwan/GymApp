import { addCorsHeaders } from "../_lib/cors.js";
import authServices from "../_utils/auth.js";
import supabase from "../_utils/db.js";


const PROFILE_FIELDS = ['name', 'profilePicUrl', 'dateOfBirth', 'gender',"phoneNo"];
const GYM_FIELDS = ['weight', 'height', 'weightUnit', 'heightUnit', 'chest', 'waist', 'arms', 'thighs', 'bodyFat', 'bmi', 'targetWeight', 'fitnessGoal', 'fitnessLevel']

export default async function handler(req, res) {
  if (addCorsHeaders(req, res)) return;
  if (req.method !== 'PUT') return res.status(405).json({ error: "Method not allowed" });
  try {
    let jwtData;
    try {
      jwtData = await authServices.verifyToken(req);
    } catch (error) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { userId } = jwtData;
    const {updates} = req.body;
    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }
    const profileUpdates = {}, gymProfileUpdates = {};
    for (const [key, value] of Object.entries(updates)) {
      if (PROFILE_FIELDS.includes(key)&&value) {
        const dbKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        profileUpdates[dbKey] = value;
      } else if (GYM_FIELDS.includes(key)&&value) {
        const dbKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        gymProfileUpdates[dbKey] = value;
      }
    }
    console.log(gymProfileUpdates);
    if (Object.keys(profileUpdates).length > 0) {
      profileUpdates.updated_at = new Date().toISOString();
      const { error: profileError } = await supabase
        .from('profiles')
        .update(profileUpdates)
        .eq('user_id', userId);

      if (profileError) {
        console.error('Profile update error:', profileError);
        return res.status(500).json({ error: 'Failed to update profile' });
      }
    }
    if (Object.keys(gymProfileUpdates).length > 0) {
      gymProfileUpdates.updated_at = new Date().toISOString();
      const { error: gymError } = await supabase.from('gym_profiles').update(gymProfileUpdates).eq('user_id', userId);
      if (gymError) {
        console.error('Gym profile update error:', gymError);
        return res.status(500).json({ error: 'Failed to update gym profile' });
      }
    }
    return res.status(200).json({
      message: 'User updated successfully',
      updatedFields: Object.keys(updates)
    });
  } catch (error) {
    console.log("Unexpected error occurred : "+error)
    return res.status(500).json({ error: "Internal server error" });
  }
}
