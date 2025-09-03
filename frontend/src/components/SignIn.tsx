import { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
export default function SignIn({ signIn, setIsSigningIn, signInWithGoogle }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()
  return (
    <div
      className="absolute w-full max-w-[30rem] h-[25rem] border-black/20 border-2
        bg-primary/50 backdrop-blur-md text-black/70
        flex flex-col justify-center items-center gap-2
        top-0"
    >
      <h2 className="absolute top-2 right-2 text-black/40 cursor-pointer" onClick={()=>setIsSigningIn(false)}>
        <RxCross1 />
      </h2>
      <h1 className="text-lg font-bold">Welcome back!</h1>

      {/** ------- option 1 --------- */}
      <button className="btn-primary w-[70%] !bg-black/70 !border-none !text-sm" onClick={signInWithGoogle}>
        Sign in with Google
      </button>

      <h1 className="text-black/70 w-[70%] text-center border-black/20 border-b-2 my-4">
        or
      </h1>

      {/** ------- option 2 --------- */}
      <form
        onSubmit={(e) => signIn(e, email, password, navigate)}
        className="flex flex-col gap-2 w-[70%]"
      >
        <label className="text-xs !focus:outline-none">Email</label>
        <input
          type="email"
          className="p-2 text-sm w-full"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label className="text-xs">Password</label>
        <input
          type="text"
          className="p-2 text-sm w-full"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn-secondary mt-2 w-full">
          Sign in
        </button>
      </form>
    </div>
  );
}
