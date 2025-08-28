import { doSignout } from "../firebase/auth.ts"
export default function Profile(){
    async function handleSignOut(){
        await doSignout();
        console.log("User signed out.")
    }
    return(
        <div>
            <button onClick={handleSignOut}>Sign out</button>
        </div>
    )
}