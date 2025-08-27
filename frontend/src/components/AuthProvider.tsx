import { createContext, useState, useEffect, useContext } from "react";
import { auth } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { User } from "firebase/auth";


// 1. define type
type AuthContextType = {
    currentUser:User | null
    userLoggedIn:boolean;
    loading:boolean
}

// 2. create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. create hook to use the context
export function useAuth(){
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export default function AuthProvider({children}) {
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [userLoggedIn, setUserLoggedIn] = useState(false)
    const [loading, setLoading] = useState(true)


    // the user object passed to the onAuthStateChanged function.
    async function initializedUser(user:User | null){
        
        if(user){ // user logs in
            setCurrentUser(user)
            setUserLoggedIn(true)
        } else { // user logs out
            setCurrentUser(null)
            setUserLoggedIn(false)
        }
        setLoading(false)
    }

    // we want to listen to the auth events (logged in / out).
    // we will subscribe to those events inside this hook.
    useEffect(()=>{

        // this function is called whenever the user logs in / out,
        // or when firebase is checking the user's logging in status upon app launch.
        const unsubscribe = onAuthStateChanged(auth, initializedUser)

        // It returns a cleanup function to unsubscribe from the listener,
        // preventing multiple listeners.
        // it will return the function when <AuthProvider> ... </AuthProvider> unmounts
        return unsubscribe
    },[])

    const value = {
        currentUser,
        userLoggedIn,
        loading
    }

    // This component will provide its chidlren with AuthContext's value.
    return(
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )

}