import { createContext, useCallback, useContext, useEffect, useState } from "react";
import userDetailServices from "../services/userDetailServices.js";

const UserDetailsContext = createContext();

export function UserDetailsProvider({ children }) {
    const [userDetails, setUserDetails] = useState(null);

    const refreshUserDetails = useCallback(async () => {
        const details = await userDetailServices.getUserDetails();
        setUserDetails(details);
    }, []);

    useEffect(() => {
        refreshUserDetails();
    }, [refreshUserDetails]);

    return (
        <UserDetailsContext.Provider value={{ userDetails, refreshUserDetails }}>
            {children}
        </UserDetailsContext.Provider>
    );
}

export const useUserDetails = () => useContext(UserDetailsContext);
