# Panduan Implementasi Role & Permission Management (Production-Ready)
**Stack:** Laravel 13, Inertia.js, React.js (TypeScript), Spatie Laravel Permission

---

## 1. Analisis Project Existing

Berdasarkan struktur project saat ini, sistem dibangun menggunakan arsitektur modern yang memisahkan logic dengan baik (terlihat dari adanya folder `app/Actions`, `app/Services`, `app/Enums`, dan di frontend `resources/js/actions`, `hooks`, `types`).

### Analisis & Risiko:
- **Risiko Hardcode Role:** Jika role dicek langsung menggunakan `if (user.role === 'admin')` di seluruh controller atau komponen React, aplikasi akan menjadi "spaghetti code" dan rapuh saat ada penambahan role baru (misal: `manager`).
- **Bottleneck Tim:** Tanpa standar penamaan permission dan struktur modular yang jelas, developer akan kebingungan ("Apakah nama permissionnya `create_user`, `user-create`, atau `user.create`?").
- **Frontend vs Backend Sync:** Sering terjadi kasus dimana menu di frontend di-hide, namun endpoint backend masih bisa di-hit langsung via Postman. Keduanya wajib dilindungi.

### Rekomendasi Struktur Folder Tambahan:
- **Backend:** Tambahkan `app/Policies` untuk Authorization rules. Manfaatkan `app/Enums` untuk standarisasi nama Role dan Permission. Gunakan `app/Services/RoleService.php` agar logic Role terpusat.
- **Frontend:** Buat `resources/js/hooks/usePermission.ts` dan komponen wrapper seperti `<RequirePermission permission="user.create">`.

---

## 2. Best Practice Authorization Architecture

Untuk aplikasi skala menengah hingga besar seperti ERP/POS, pendekatan terbaik adalah **Hybrid Role + Permission (Spatie) digabung dengan Laravel Policy/Gate**.

### Perbandingan Pendekatan:
1. **RBAC Murni (Role-Based):** Hanya mengecek role. *Kelemahan:* Kaku. Jika "Manager" butuh akses hapus data, role harus dirombak.
2. **Policy/Gate Bawaan Laravel:** Sangat scalable, tapi butuh banyak code manual untuk membuat UI dinamis.
3. **Spatie Permission + Policy (WINNER):** Spatie digunakan untuk mendefinisikan relasi Role-Permission secara dinamis (di DB dan UI), sedangkan pengecekan di level code tetap menggunakan standar Laravel Gate/Policy (`$user->can('user.delete')`).

*Alasan Skalabilitas:* Developer cukup menggunakan fungsi bawaan Laravel `Gate` atau `Policy`, dan manajemen assignment diurus oleh Spatie. Ini membuat code tetap bersih tanpa bergantung pada fungsi spesifik library eksternal secara masif.

---

## 3. Database Design

Kita akan menggunakan table standar bawaan Spatie, ditambah beberapa kustomisasi ringan.

### Tabel Bawaan Spatie:
- `roles` (id, name, guard_name)
- `permissions` (id, name, guard_name)
- `model_has_roles` (role_id, model_type, model_id)
- `model_has_permissions` (permission_id, model_type, model_id)
- `role_has_permissions` (permission_id, role_id)

### Tabel Tambahan untuk UX/UI yang lebih baik:
- `permission_groups` (id, name)
  - Untuk mengelompokkan permission di UI matrix. Contoh group: `User Management`, `Report`, `Transaction`.
  - Tabel `permissions` perlu ditambahkan foreign key `group_id`.

### ERD Konseptual Sederhana:
```text
[users] 1 -- * [model_has_roles] * -- 1 [roles]
                                           |
                                           *
                                 [role_has_permissions]
                                           *
                                           |
[permission_groups] 1 ----------- * [permissions]
```
*Alasan Desain:* Penambahan `permission_groups` sangat krusial di frontend agar UI Matrix Checkbox bisa di-render rapi per modul (misal Modul Master Data, Modul POS, Modul Laporan), tidak muncul sebagai list panjang ratusan checkbox.

---

## 4. Step-by-Step Backend Implementation (Laravel 13)

### A. Setup & Instalasi
```bash
composer require spatie/laravel-permission
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
php artisan migrate
```

Tambahkan trait pada User model:
```php
namespace App\Models;

use Spatie\Permission\Traits\HasRoles;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use HasRoles; // Tambahkan ini
    // ...
}
```

### B. Enum & Naming Convention (app/Enums/PermissionName.php)
Selalu gunakan Enum untuk menghindari typo di backend.
```php
namespace App\Enums;

enum PermissionName: string
{
    case USER_VIEW = 'user.view';
    case USER_CREATE = 'user.create';
    case USER_UPDATE = 'user.update';
    case USER_DELETE = 'user.delete';
    
    // POS Modul
    case POS_ACCESS = 'pos.access';
}
```

### C. Seeder Default (database/seeders/RolePermissionSeeder.php)
```php
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RolePermissionSeeder extends Seeder
{
    public function run()
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Buat permission
        $permissions = [
            'user.view', 'user.create', 'user.update', 'user.delete',
            'pos.access', 'report.view'
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Buat Role Super Admin dan berikan seluruh akses akan dihandle di Gate (Lihat bagian Security)
        $superAdmin = Role::create(['name' => 'super_admin']);
        
        // Buat Role Kasir
        $kasir = Role::create(['name' => 'kasir']);
        $kasir->givePermissionTo(['pos.access']);

        // Assign ke user
        $user = User::first();
        $user->assignRole('super_admin');
    }
}
```

### D. Middleware dan Route Protection
Gunakan standar Laravel `can` daripada fungsi spesifik Spatie.
```php
// routes/web.php
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/users', [UserController::class, 'index'])->can('user.view');
    // Atau di dalam controller:
    // Gate::authorize('user.view');
});
```

### E. Membagikan Permission ke Inertia (app/Http/Middleware/HandleInertiaRequests.php)
Agar Frontend tau user punya akses apa.
```php
public function share(Request $request): array
{
    return array_merge(parent::share($request), [
        'auth' => [
            'user' => $request->user(),
            // Jangan kirim seluruh role/permission (terlalu berat), map jadi array simple
            'permissions' => $request->user() ? $request->user()->getAllPermissions()->pluck('name') : [],
            'roles' => $request->user() ? $request->user()->getRoleNames() : [],
        ],
    ]);
}
```

---

## 5. Frontend Implementation (Inertia + React + TypeScript)

### A. Shared Types (resources/js/types/index.d.ts)
Update definisi `auth` prop.
```typescript
export interface User {
    id: number;
    name: string;
    email: string;
    // ...
}

export interface PageProps {
    auth: {
        user: User;
        roles: string[];
        permissions: string[];
    };
}
```

### B. Custom Hook (resources/js/hooks/usePermission.ts)
Buat hook untuk mempermudah pengecekan akses di frontend.
```typescript
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

export function usePermission() {
    const { auth } = usePage<PageProps>().props;

    const hasRole = (role: string) => auth.roles.includes(role) || auth.roles.includes('super_admin');
    
    const hasPermission = (permission: string) => {
        // Super admin otomatis bypass di frontend
        if (hasRole('super_admin')) return true;
        return auth.permissions.includes(permission);
    };

    return { hasRole, hasPermission };
}
```

### C. Komponen Wrapper/Guard (resources/js/components/RequirePermission.tsx)
Untuk menyembunyikan element UI (misal tombol hapus) secara bersih.
```tsx
import { ReactNode } from 'react';
import { usePermission } from '@/hooks/usePermission';

interface Props {
    permission: string;
    children: ReactNode;
}

export default function RequirePermission({ permission, children }: Props) {
    const { hasPermission } = usePermission();

    if (!hasPermission(permission)) {
        return null;
    }

    return <>{children}</>;
}
```

### D. Penggunaan di Page Component
```tsx
import RequirePermission from '@/components/RequirePermission';

export default function UserList() {
    return (
        <div>
            <h1>User Management</h1>
            <RequirePermission permission="user.create">
                <button className="btn btn-primary">Add User</button>
            </RequirePermission>
        </div>
    );
}
```

---

## 6. Scalability for Team Project

1. **Naming Convention Permission:** Selalu gunakan format `{module}.{action}` dengan penamaan english singular (contoh: `invoice.create`, bukan `create-invoices`).
2. **Cara Tambah Module Baru:** 
   - Developer A menambah module "Product". 
   - Ia hanya perlu menambah Enum `App\Enums\PermissionName::PRODUCT_CREATE`
   - Buat migration spesifik untuk seed permission tersebut tanpa menyentuh seeder utama.
3. **Shared Types:** Pastikan TS interfaces tersinkronisasi. Bisa menggunakan package seperti `bepsvpt/secure-headers` atau `typescript-transformer` untuk auto-generate Enum PHP ke TS.
4. **Thin Controller:** Pindahkan proses save/assign permission dari request ke dalam `app/Actions/Role/UpdateRolePermission.php` agar unit test lebih mudah dan bisa di-reuse lewat console command jika perlu.

---

## 7. Security Best Practice

### Super Admin Bypass Strategy (Sangat Penting)
Jangan masukkan permission ke Super Admin satu per satu. Cegah privilege escalation dengan bypass Gate di backend via `AuthServiceProvider` atau (di Laravel 11/13) di method `boot` pada `AppServiceProvider.php`.

```php
// app/Providers/AppServiceProvider.php
use Illuminate\Support\Facades\Gate;

public function boot(): void
{
    // Super Admin otomatis lolos semua Gate (Policy)
    Gate::before(function ($user, $ability) {
        return $user->hasRole('super_admin') ? true : null;
    });
}
```

### Validasi Backend Mutlak
Menghide tombol di UI (React) **TIDAK** menambah keamanan apapun. Endpoint backend (Controller) **WAJIB** dilindungi dengan Gate/Middleware, dan request validation `FormRequest` wajib mengecek ulang `$this->user()->can('...')` jika operasi tersebut manipulatif.

---

## 8. Testing Strategy

Gunakan PestPHP atau PHPUnit. Contoh Feature Test untuk akses endpoint:

```php
// tests/Feature/UserManagementTest.php

use App\Models\User;
use Spatie\Permission\Models\Permission;

it('cannot create user if missing permission', function () {
    $user = User::factory()->create();
    
    $this->actingAs($user)
         ->post('/users', [...])
         ->assertForbidden(); // HTTP 403
});

it('can create user if has permission', function () {
    $user = User::factory()->create();
    Permission::create(['name' => 'user.create']);
    $user->givePermissionTo('user.create');
    
    $this->actingAs($user)
         ->post('/users', [...])
         ->assertRedirect();
});
```

---

## 9. Real World Recommendation (Untuk POS/ERP Berkelanjutan)

Jika project POS ini kedepannya menjadi Multi-Branch atau SaaS:
1. **Jangan Taruh Branch di Role:** (Salah: `kasir_cabang_jakarta`). Ini akan meledakkan jumlah role.
2. **Gunakan Tenancy / Team Scope Spatie:** Aktifkan config `'teams' => true` di config `permission.php` Spatie. 
3. **Struktur Multi-Branch:** User A bisa menjadi `kasir` di `Branch ID = 1`, namun menjadi `admin` di `Branch ID = 2`. Relasi table akan menjadi `(user_id, role_id, team_id/branch_id)`.

---

## 10. Deliverables & Checklist Produksi

### Struktur Folder Final yang Dibutuhkan:
- `app/Enums/PermissionName.php`
- `app/Actions/Role/AssignRoleToUser.php`
- `app/Actions/Role/SyncRolePermissions.php`
- `database/migrations/xxxx_xx_add_group_to_permissions_table.php`
- `resources/js/hooks/usePermission.ts`
- `resources/js/components/RequirePermission.tsx`
- `resources/js/pages/Roles/Index.tsx` (UI Matrix)

### Checklist Produksi:
- [ ] Install Spatie Permission & Run Migration
- [ ] Tambahkan `Gate::before` bypass untuk `super_admin` di `AppServiceProvider`
- [ ] Daftarkan permissions array di `HandleInertiaRequests` share method
- [ ] Buat custom React Hook `usePermission`
- [ ] Buat CRUD UI untuk Role dan matriks permission menggunakan Inertia
- [ ] Lindungi seluruh Routes/Controllers menggunakan `->can()` atau `Gate::authorize()`
- [ ] Sembunyikan navigasi di layout menggunakan `hasPermission`
- [ ] Tulis dokumentasi internal (atau merujuk ke file ini) untuk developer baru agar disiplin menggunakan Naming Convention `module.action`.
