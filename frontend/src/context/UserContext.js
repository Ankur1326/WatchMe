import React, { createContext, useState } from "react";

const UserType = createContext();

const UserContext = ({ children }) => {
    const [user, setUser] = useState({})

    return (
        <UserType.Provider value={[user, setUser]}>
            {children}
        </UserType.Provider>
    )
}

export { UserType, UserContext }