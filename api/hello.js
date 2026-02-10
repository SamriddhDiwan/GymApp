import { addCorsHeaders } from "./_middleware/cors";

export default function handler(req,res){
    if(addCorsHeaders(req,res)) return;
    res.status(200).json({
        message:"Hello from the gym app"
    })
}