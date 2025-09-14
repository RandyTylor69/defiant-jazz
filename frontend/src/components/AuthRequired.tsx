import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider.tsx";
export default function AuthRequired() {
  const { userLoggedIn } = useAuth();
  if (!userLoggedIn)
    console.log("Can't visit that path without logging in first");

  return userLoggedIn ? <Outlet /> : <Navigate to={"/"} />;
}
