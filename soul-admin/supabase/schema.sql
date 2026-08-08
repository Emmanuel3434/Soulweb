-- El panel se adapta al esquema existente de Soul Client.
-- NO crea tablas duplicadas de instances/usuarios.
--
-- IMPORTANTE: SUPABASE_SECRET_KEY solo se usa en el servidor del panel.

-- Asegura RLS en las tablas sensibles si todavía no está activado.
alter table if exists public.instances enable row level security;
alter table if exists public.mods enable row level security;
alter table if exists public.config_files enable row level security;
alter table if exists public.instance_folders enable row level security;
alter table if exists public.whitelist enable row level security;
alter table if exists public.access_codes enable row level security;
alter table if exists public.code_redemptions enable row level security;
alter table if exists public.news enable row level security;
alter table if exists public.admins enable row level security;

-- El panel utiliza la Secret Key desde API Routes para operaciones administrativas.
-- Por seguridad no se agregan policies públicas aquí.
-- Configura policies específicas para tu launcher según sus necesidades.

-- Para hacer administrador a un usuario:
-- 1. Crea/inicia el usuario en Supabase Auth.
-- 2. Obtén su UUID.
-- 3. Ejecuta:
-- insert into public.admins (id, email)
-- values ('UUID-DEL-USUARIO', 'correo@ejemplo.com');

-- Nota sobre "usuarios":
-- Tu esquema no contiene una tabla launcher_users.
-- El panel obtiene los usuarios registrados desde Supabase Auth
-- usando auth.admin.listUsers() y muestra email, proveedor y última conexión.
-- Si tu backend del launcher guarda sesiones/instancias en otra tabla,
-- esa tabla puede añadirse posteriormente para mostrar "usuario dentro
-- de instancia" con datos en tiempo real.
