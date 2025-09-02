import { doSignout } from "../../firebase/auth.ts";
export default function EditProfile() {
  async function handleSignOut() {
    await doSignout();
    console.log("User signed out.");
  }
  return <button onClick={handleSignOut}>Sign out</button>;
}
