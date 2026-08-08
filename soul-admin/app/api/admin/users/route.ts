import { NextResponse } from "next/server";
import { requireAdmin } from "../../../../lib/admin";

export async function GET() {
  try {
    const { admin }=await requireAdmin();
    const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if(error) return NextResponse.json({error:error.message},{status:500});

    const users=(data.users??[]).map((u:any)=>({
      id:u.id,
      username:u.user_metadata?.username ?? u.user_metadata?.name ?? u.user_metadata?.global_name ?? u.email?.split("@")[0] ?? "Sin nombre",
      email:u.email ?? null,
      account_type:u.app_metadata?.provider ?? u.user_metadata?.provider ?? "—",
      last_seen:u.last_sign_in_at ?? null,
      instance_name:null
    }));

    return NextResponse.json({users});
  } catch(e:any) {
    return NextResponse.json({error:e.message==="UNAUTHENTICATED"?"No autenticado":"No autorizado"},{status:e.message==="UNAUTHENTICATED"?401:403});
  }
}