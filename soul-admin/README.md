# Soul Client — Admin Panel

Panel web administrativo para gestionar instancias y usuarios de Soul Client usando Supabase.

## 1. Seguridad importante

Nunca pongas `SUPABASE_SECRET_KEY` en:
- código del navegador
- variables `NEXT_PUBLIC_*`
- GitHub
- Tauri/frontend
- archivos que se sirvan públicamente

La clave secreta que se pegó en el chat debe considerarse expuesta. **Rótala en Supabase** antes de desplegar el panel y usa la nueva solamente como variable de entorno del servidor.

## 2. Configuración

```bash
npm install
```

Copia `.env.example` a `.env.local` y completa:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SECRET_KEY=...
ADMIN_EMAILS=...
```

Ejecuta `supabase/schema.sql` en el SQL Editor de Supabase.

Luego crea un usuario administrador en Supabase Auth (email/password) e inserta su UUID en `app_admins`.

## 3. Ejecutar

```bash
npm run dev
```

Abre `http://localhost:3000/login`.

## 4. Integración con tu launcher

El panel espera:
- `instances`: instancias que el launcher puede mostrar.
- `Supabase Auth`: usuarios que el launcher registra.
- `app_admins`: usuarios autorizados para el panel.

Si tu Soul Client ya usa tablas diferentes, conserva tus tablas y cambia únicamente las consultas de:
- `app/api/admin/instances/route.ts`
- `app/api/admin/users/route.ts`

## Funciones incluidas

- Login con Supabase Auth.
- Protección de rutas `/dashboard` y `/api/admin`.
- Comprobación adicional de administrador.
- Crear instancias.
- Mostrar/ocultar instancias.
- Activar/desactivar whitelist al crear.
- Eliminar instancias.
- Ver usuarios del launcher.
- Ver tipo de cuenta, última conexión e instancia asociada.
- Estadísticas generales.


## Esquema actualizado

El panel está adaptado al esquema que compartiste:
- `instances`
- `mods`
- `config_files`
- `instance_folders`
- `whitelist`
- `access_codes`
- `code_redemptions`
- `news`
- `admins`

No se crea una tabla duplicada `launcher_instances`.

Los usuarios se obtienen desde **Supabase Auth**, porque el esquema proporcionado no tiene una tabla de usuarios del launcher.

También se incluye `public/index.html`, que redirige al login.
