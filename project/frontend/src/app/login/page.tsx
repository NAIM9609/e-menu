"use client";
import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";

const ADMIN_USER = "admin";
const ADMIN_PASS = "admin"; // demo only; replace with real auth later

export default function LoginPage() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const submit = () => {
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      localStorage.setItem("e-menu:auth", "1");
      router.push("/admin");
    } else {
      setError("Credenziali non valide");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white grid place-items-center p-4">
      <div className="w-full max-w-sm border border-neutral-800 rounded-lg p-4">
        <h1 className="text-xl font-semibold mb-4">Login Amministratore</h1>
        <div className="flex flex-col gap-3">
          <span className="p-float-label">
            <InputText id="user" value={user} onChange={(e) => setUser(e.target.value)} className="w-full" />
            <label htmlFor="user">Utente</label>
          </span>
          <span className="p-float-label">
            <Password id="pass" value={pass} onChange={(e) => setPass(e.target.value)} className="w-full" feedback={false} toggleMask />
            <label htmlFor="pass">Password</label>
          </span>
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <Button label="Accedi" onClick={submit} />
        </div>
      </div>
    </div>
  );
}
