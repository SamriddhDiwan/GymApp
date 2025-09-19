import { createContext, useState } from "react";


const AIChatContext=createContext();

export function AIChatProvider({children}){
    const [modalVisible,setModalVisible]=useState(false);
    return (
        <AIChatContext.Provider value={{modalVisible,setModalVisible}}>
            {children}
        </AIChatContext.Provider>
    )
}
export default AIChatContext;