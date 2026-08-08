import { NextResponse } from "next/server";
import { requireAdmin } from "../../../../lib/admin";

export async function GET() {
  try {
    const { admin } = await requireAdmin();
    const { data, error } = await admin.from("instances").select("*").order("created_at",{ascending:false});
    if(error) return NextResponse.json({error:error.message},{status:500});
    return NextResponse.json({instances:data??[]});
  } catch(e:any) {
    return NextResponse.json({error:e.message==="UNAUTHENTICATED"?"No autenticado":"No autorizado"},{status:e.message==="UNAUTHENTICATED"?401:403});
  }
}

export async function POST(req:Request) {
  try {
    const { admin } = await requireAdmin();
    const body=await req.json();
    if(!body.name?.trim()) return NextResponse.json({error:"El nombre es obligatorio"},{status:400});
    const allowed=["vanilla","fabric","forge","quilt"];
    const modloader=allowed.includes(body.modloader)?body.modloader:"vanilla";
    const { data,error }=await admin.from("instances").insert({
      name:body.name.trim(),
      version:body.version||"1.21.1",
      modloader,
      modloader_version:body.modloader_version||null,
      icon:body.icon||null,
      description:body.description||null,
      whitelist_enabled:body.whitelist_enabled===true,
      logo_path:body.logo_path||null,
      background_path:body.background_path||null
    }).select().single();
    if(error) return NextResponse.json({error:error.message},{status:500});
    return NextResponse.json({instance:data});
  } catch(e:any) {
    return NextResponse.json({error:e.message==="UNAUTHENTICATED"?"No autenticado":"No autorizado"},{status:e.message==="UNAUTHENTICATED"?401:403});
  }
}

export async function PATCH(req:Request) {
  try {
    const { admin }=await requireAdmin();
    const body=await req.json();
    const update:Record<string,unknown>={};
    if(typeof body.name==="string") update.name=body.name.trim();
    if(typeof body.version==="string") update.version=body.version;
    if(typeof body.modloader==="string") update.modloader=body.modloader;
    if(typeof body.modloader_version==="string") update.modloader_version=body.modloader_version;
    if(typeof body.description==="string") update.description=body.description;
    if(typeof body.whitelist_enabled==="boolean") update.whitelist_enabled=body.whitelist_enabled;
    if(typeof body.logo_path==="string") update.logo_path=body.logo_path;
    if(typeof body.background_path==="string") update.background_path=body.background_path;
    const {error}=await admin.from("instances").update(update).eq("id",body.id);
    if(error)return NextResponse.json({error:error.message},{status:500});
    return NextResponse.json({ok:true});
  }catch(e:any){return NextResponse.json({error:"No autorizado"},{status:403});}
}

export async function DELETE(req:Request) {
  try {
    const { admin }=await requireAdmin();
    const body=await req.json();
    const {error}=await admin.from("instances").delete().eq("id",body.id);
    if(error)return NextResponse.json({error:error.message},{status:500});
    return NextResponse.json({ok:true});
  }catch(e:any){return NextResponse.json({error:"No autorizado"},{status:403});}
}