import { createContext, useContext, useEffect, useState } from "react";

const AuthenticationContext = createContext();

export function AuthenticationProvider({ children }) {
    const [accessToken, setAccessToken] = useState();
    const [refreshToken,setRefreshToken]=useState();
    const [userId,setUserId]=useState();
    return (
        <AuthenticationContext.Provider value={{ accessToken,refreshToken,userId, setAccessToken, setRefreshToken, setUserId}}>
            {children}
        </AuthenticationContext.Provider>
    )
}
export const useAuthentication = () => useContext(ExerciseContext);