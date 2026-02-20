import { createContext, useContext, useEffect, useState } from "react";

const AuthenticationContext = createContext();

export function AuthenticationProvider({ children }) {
    const [isSignIn,setIsSignIn]=useState(false);
    const [accessToken, setAccessToken] = useState();
    const [refreshToken,setRefreshToken]=useState();
    const [userId,setUserId]=useState();
    return (
        <AuthenticationContext.Provider value={{isSignIn,setIsSignIn, taccessToken,refreshToken,userId, setAccessToken, setRefreshToken, setUserId}}>
            {children}
        </AuthenticationContext.Provider>
    )
}
export const useAuthentication = () => useContext(AuthenticationContext);