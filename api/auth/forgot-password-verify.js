import { addCorsHeaders } from "../_lib/cors.js";
import supabase from "../_utils/db.js";
import jwt from 'jsonwebtoken';




export default async function handler(req, res) {
    console.log("request received");
    if (addCorsHeaders(req, res)) return;
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });

    }
    try {
        //this function recieves the email and the otp
        //we need to verify the otp in the sense that it is equal and and is not expired 
        //once the otp is verified we issue a token(resetPasswordToken) and return to the frontend
        const { email, otp } = req.body;
        console.log(email + otp);
        if (!email || !otp) {
            return res.status(400).json({ error: "Email and OTP are required" });
        }
        const { data: searchedOTP, error: searchedOTPError } = await supabase.from('password_reset_otps').select('*').eq('email', email).single();
        if (searchedOTPError || !searchedOTP) {
            return res.status(404).json({ error: "Email not found" });
        }
        if (searchedOTP.otp !== otp) {
            return res.status(404).json({ error: "Invalid OTP" });
        }
        if (searchedOTP.used) {
            return res.status(400).json({ error: "OTP already used" });
        }
        if (new Date(searchedOTP.expires_at) < new Date()) {
            const expiresAt = searchedOTP.expires_at.endsWith('Z') ? searchedOTP.expires_at : searchedOTP.expires_at + 'Z';
            if (new Date(expiresAt) < new Date()) {
                return res.status(400).json({ error: "OTP expired" });
            }
        }
        await supabase.from('password_reset_otps').update({ used: true }).eq('email', email);
        const resetPasswordToken = jwt.sign(
            { email: email },
            process.env.JWT_SECRET,
            { expiresIn: '5m' }
        )
        console.log("For email " + email + " otp was verified");
        return res.status(200).json({
            email: email,
            resetPasswordToken: resetPasswordToken
        })
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}