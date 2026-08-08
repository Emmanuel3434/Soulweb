 "use client";

import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase-browser";

type Instance = { id:string; name:string; version:string; modloader:string; modloader_version:string|null; whitelist_enabled:boolean; created_at:string };
type User = { id:string; username:string; email:string|null; account_type:string; last_seen:string|null; instance_name:string|null };

export default function Dashboard() {
  const supabase=createClient();
  const [tab,setTab]=useState<"overview"|"instances"|"users">("overview");
  const [instances,setInstances]=useState<Instance[]>([]);
  const [users,setUsers]=useState<User[]>([]);
  const [modal,setModal]=useState(false);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");

  async function load(){
    setLoading(true); setError("");
    const [i,u]=await Promise.all([
      fetch("/api/admin/instances").then(r=>r.json()),
      fetch("/api/admin/users").then(r=>r.json())
    ]);
    if(i.error) setError(i.error); else setInstances(i.instances||[]);
    if(u.error) setError(u.error); else setUsers(u.users||[]);
    setLoading(false);
  }
  useEffect(()=>{load()},[]);

  async function logout(){ await supabase.auth.signOut(); window.location.href="/login"; }

  async function toggleInstance(x:Instance){
    await fetch("/api/admin/instances",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:x.id,whitelist_enabled:!x.whitelist_enabled})});
    load();
  }

  async function deleteInstance(id:string){
    if(!confirm("¿Eliminar esta instancia?")) return;
    await fetch("/api/admin/instances",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id})});
    load();
  }

  return <div className="shell">
    <aside className="sidebar">
      <div className="brand">SOUL<span>CLIENT</span></div>
      <div className="nav">
        <button className={tab==="overview"?"active":""} onClick={()=>setTab("overview")}>▦ Resumen</button>
        <button className={tab==="instances"?"active":""} onClick={()=>setTab("instances")}>◈ Instancias</button>
        <button className={tab==="users"?"active":""} onClick={()=>setTab("users")}>♙ Usuarios</button>
        <button onClick={logout}>↪ Cerrar sesión</button>
      </div>
    </aside>
    <main className="main">
      <div className="top"><div><h1 className="title">Administrador</h1><div className="muted">Gestiona Soul Client desde un solo lugar.</div></div>{tab!=="users" && <button className="btn" onClick={()=>setModal(true)}>+ Crear instancia</button>}</div>
      {error && <div className="card" style={{color:"#fca5a5",marginBottom:16}}>{error}</div>}
      {tab==="overview" && <><div className="grid">
        <div className="card"><div className="muted">Instancias</div><div className="stat">{instances.length}</div></div>
        <div className="card"><div className="muted">Usuarios</div><div className="stat">{users.length}</div></div>
        <div className="card"><div className="muted">Whitelist activas</div><div className="stat">{instances.filter(x=>x.whitelist_enabled).length}</div></div>
      </div>
      <div className="section card"><div className="sectionhead"><h2>Instancias recientes</h2><button className="btn secondary" onClick={()=>setTab("instances")}>Ver todas</button></div><InstanceTable data={instances.slice(0,5)} toggle={toggleInstance} remove={deleteInstance}/></div>
      </>}
      {tab==="instances" && <div className="section card"><div className="sectionhead"><h2>Instancias</h2></div><InstanceTable data={instances} toggle={toggleInstance} remove={deleteInstance}/></div>}
      {tab==="users" && <div className="section card"><div className="sectionhead"><h2>Usuarios del launcher</h2></div><UserTable data={users}/></div>}
      {loading && <div className="muted" style={{marginTop:12}}>Cargando...</div>}
    </main>
    {modal && <CreateModal close={()=>setModal(false)} done={load}/>}
  </div>;
}

function InstanceTable({data,toggle,remove}:{data:Instance[],toggle:(x:Instance)=>void,remove:(id:string)=>void}){
  if(!data.length)return <div className="empty">No hay instancias todavía.</div>;
  return <div className="tablewrap"><table className="table"><thead><tr><th>Nombre</th><th>Versión</th><th>Loader</th><th>Visible</th><th>Whitelist</th><th></th></tr></thead><tbody>{data.map(x=><tr key={x.id}><td><b>{x.name}</b></td><td>{x.version}</td><td><span className="badge">{x.loader}</span></td><td><span className={"badge "+("")}>{"Sí"}</span></td><td>{x.whitelist_enabled?"Activa":"Desactivada"}</td><td><button className="btn secondary" onClick={()=>toggle(x)}>Cambiar</button> <button className="btn danger" onClick={()=>remove(x.id)}>Eliminar</button></td></tr>)}</tbody></table></div>;
}

function UserTable({data}:{data:User[]}){
  if(!data.length)return <div className="empty">No hay usuarios registrados en launcher_users.</div>;
  return <div className="tablewrap"><table className="table"><thead><tr><th>Usuario</th><th>Email</th><th>Tipo</th><th>Instancia</th><th>Última conexión</th></tr></thead><tbody>{data.map(x=><tr key={x.id}><td><b>{x.username}</b></td><td>{x.email||"—"}</td><td><span className="badge">{x.account_type}</span></td><td>{x.instance_name||"—"}</td><td>{x.last_seen?new Date(x.last_seen).toLocaleString():"—"}</td></tr>)}</tbody></table></div>;
}

function CreateModal({close,done}:{close:()=>void,done:()=>void}){
  const [form,setForm]=useState({name:"",version:"1.21.1",modloader:"fabric",whitelist_enabled:false});
  const [busy,setBusy]=useState(false); const [error,setError]=useState("");
  async function submit(e:React.FormEvent){e.preventDefault();setBusy(true);setError("");const r=await fetch("/api/admin/instances",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});const j=await r.json();if(!r.ok){setError(j.error||"Error");setBusy(false);return}close();done();}
  return <div className="modal"><div className="modalbox"><h2 style={{marginTop:0}}>Crear instancia</h2><form className="form" onSubmit={submit}>
    <div className="field"><label>Nombre</label><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Soul Survival"/></div>
    <div className="row"><div className="field"><label>Versión</label><input value={form.version} onChange={e=>setForm({...form,version:e.target.value})}/></div><div className="field"><label>Loader</label><select value={form.modloader} onChange={e=>setForm({...form,modloader:e.target.value})}><option value="fabric">Fabric</option><option value="neoforge">NeoForge</option><option value="forge">Forge</option></select></div></div>
    <div className="row"><label><input type="checkbox" checked={form.whitelist_enabled} onChange={e=>setForm({...form,whitelist_enabled:e.target.checked})}/> Activar whitelist</label></div>
    {error&&<div style={{color:"#fca5a5"}}>{error}</div>}
    <div className="actions"><button type="button" className="btn secondary" onClick={close}>Cancelar</button><button className="btn" disabled={busy}>{busy?"Creando...":"Crear instancia"}</button></div>
  </form></div></div>;
}