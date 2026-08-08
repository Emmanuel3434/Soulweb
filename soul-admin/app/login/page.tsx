 "use client";

import { useState } from "react";
import { createClient } from "../../lib/supabase-browser";

export default function LoginPage() {
  const supabase = createClient();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else window.location.href="/dashboard";
    setLoading(false);
  }

  return <main className="login">
    <div className="loginbox card">
      <div className="brand">SOUL<span>CLIENT</span></div>
      <h1 className="title">Panel de administrador</h1>
      <p className="muted">Inicia sesión con una cuenta autorizada.</p>
      <form className="form" onSubmit={login}>
        <div className="field"><label>Correo</label><input required type="email" value={email} onChange={e=>setEmail(e.target.value)} /></div>
        <div className="field"><label>Contraseña</label><input required type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
        {error && <div style={{color:"#fca5a5"}}>{error}</div>}
        <button className="btn" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</button>
      </form>
    </div>
  </main>;
}