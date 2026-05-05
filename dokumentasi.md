# Dokumentasi Teknis: Sistem Manajemen Role & Permission

**Proyek:** Point of Sale (POS) - Laravel 13, Inertia.js, React.js  
**Penulis:** Tim Engineering  
**Terakhir Diperbarui:** 2026

Dokumentasi ini menjelaskan implementasi teknis dari arsitektur *Role-Based Access Control* (RBAC) granular yang diterapkan pada sistem. Panduan ini ditujukan bagi seluruh developer untuk memahami cara kerja, *best practice*, serta tata cara pemeliharaan otorisasi pada aplikasi.

---

## 1. Ringkasan Sistem

Sistem ini menerapkan RBAC dinamis menggunakan package `spatie/laravel-permission`. Fitur-fitur utama yang dibangun meliputi:

-   **Dynamic Role Management:** Admin dapat membuat, mengubah, dan menghapus *Role* kapan saja.
-   **Dynamic Permission Management:** Hak akses ke berbagai modul (CRUD) dikonfigurasi melalui *Permission* dan dapat disematkan ke suatu *Role*.
-   **Assignment Fleksibel:** Menautkan *Role* ke setiap akun *User*.
-   **Proteksi Backend Berlapis:** Seluruh *endpoint* dilindungi menggunakan *middleware* secara spesifik (misal: `permission:user.create`).
-   **Dynamic Frontend:** Menampilkan atau menyembunyikan *menu* dan *tombol aksi* di UI React secara otomatis berdasarkan *permission* yang dimiliki *user* yang sedang *login*.
-   **Super Admin Bypass:** Pengamanan khusus untuk *role* Super Admin agar memiliki akses absolut ke seluruh sistem tanpa perlu mendefinisikan *permission*-nya satu per satu, serta melindungi *role* dan akun tersebut dari modifikasi oleh Admin biasa.

---

## 2. Struktur Database & Relasi

Sistem ini bergantung pada struktur *schema* relasional berikut:

1.  `users`: Tabel standar Laravel yang menyimpan informasi pengguna.
2.  `roles`: Menyimpan nama-nama jabatan/kasta (contoh: admin, kasir, chef).
3.  `permissions`: Menyimpan nama-nama izin hak akses secara spesifik (contoh: `user.view`, `item.create`).
4.  `model_has_roles`: Tabel pivot yang menghubungkan `users` dengan `roles` (User ID X memiliki Role ID Y).
5.  `role_has_permissions`: Tabel pivot yang menghubungkan `roles` dengan `permissions` (Role X memiliki Permission A, B, C).

### Diagram Alur Konsep Inti

```text
+----------+          +-----------------+          +-------------+
|          |          |                 |          |             |
|  USER    | -------> |      ROLE       | -------> | PERMISSION  |
|          | (Pivot)  |                 | (Pivot)  |             |
+----------+          +-----------------+          +-------------+
(Ferry)               (Admin)                      - user.view
                                                   - user.create
                                                   - item.delete
```

**Konsep Penting:**  
User **tidak langsung** diberi akses (permission) ke fitur. User terhubung ke **Role**, lalu Role tersebutlah yang memiliki sekumpulan **Permission**. Ini adalah fundamental *maintainability* sistem.

-   **Satu user** bisa punya satu / banyak role.
-   **Satu role** bisa dipakai ratusan/ribuan user.
-   **Satu role** memiliki banyak permission.

---

## 3. Di Mana Logic Role Terhubung ke User

### A. Role ke User
Ketika seorang user dibuat atau di-assign *role*:
```php
$user->assignRole('admin');
```
**Yang terjadi di database:** Sistem mencatat entri baru ke tabel `model_has_roles` yang mengaitkan `model_id` (User ID) dengan `role_id` milik 'admin'.

### B. Role ke Permission
Ketika kita menentukan hak akses untuk sebuah *role*:
```php
$role->givePermissionTo(['user.view', 'user.create']);
```
**Yang terjadi di database:** Sistem mencatat entri-entri baru ke tabel `role_has_permissions` yang mengaitkan `role_id` dengan `permission_id` masing-masing.

### C. Alur Otorisasi Saat User Login
1.  **Login:** User memasukkan email dan password.
2.  **Sistem Membaca Role:** Laravel menarik data `roles` yang terhubung dengan user tersebut dari database.
3.  **Sistem Mengambil Permission:** Laravel menggabungkan seluruh `permissions` yang dimiliki oleh *roles* dari user tersebut. Informasi ini kemudian di-masukkan ke Inertia *shared props*.
4.  **Middleware Mengecek Akses:** Saat user melakukan hit ke *endpoint*, `Route::middleware('permission:item.create')` akan memvalidasi apakah dalam daftar permission user tersebut terdapat string `item.create`.
5.  **Frontend Menampilkan Sesuai Izin:** React akan membaca *props permission*, menyembunyikan tombol *Delete* jika user tidak memiliki izin `.delete`, dan lain-lain.

---

## 4. Perubahan Code Lengkap

Berikut adalah pemetaan *file* kunci dalam implementasi sistem ini:

### Backend Laravel
-   **`bootstrap/app.php`**: Mendaftarkan *alias* untuk *middleware* milik Spatie (`role`, `permission`, `role_or_permission`).
-   **`app/Enums/PermissionName.php`**: File *enum* sentral yang menyimpan konstanta daftar izin (*permission*) untuk menghindari *typo*.
-   **`database/seeders/RolePermissionSeeder.php`**: Berfungsi mengatur daftar *role* bawaan sistem (super_admin, admin, kasir) dan izin awal yang mereka miliki ketika aplikasi pertama kali di-*deploy*.
-   **`routes/web.php`**: Mengganti pelindung *route* dari yang sebelumnya `middleware('role:admin')` menjadi granular `middleware('permission:user.view')`.
-   **`app/Providers/AppServiceProvider.php`**: Menerapkan fungsi `Gate::before()` untuk memberikan *bypass* otomatis kepada pengguna yang memiliki *role* `super_admin`.
-   **`app/Http/Controllers/RoleController.php` & `UserController.php`**: Logika penambahan *role* dan perlindungan (*hardcoded backend guard*) agar Admin biasa tidak dapat mengubah/menghapus *role* atau profil akun `super_admin`.

### Frontend Inertia + React
-   **`resources/js/hooks/usePermission.ts`**: *Custom hook* React untuk mempermudah pengecekan hak akses, mengekstrak data dari `usePage().props.auth.permissions`.
-   **`resources/js/pages/role/Index.tsx` & `columns.tsx`**: UI yang mengimplementasikan *conditional rendering* (penyembunyian tombol edit/hapus) berbasis fungsi `hasPermission('role.delete')`.
-   **`resources/js/pages/item/Index.tsx`**: Sama seperti di atas, memfilter tombol *Create Item* dan aksi *Edit/Delete* tabel jika *user* tidak punya izin.

---

## 5. Penjelasan Logic Codingan

*   **`$user->assignRole('admin');`**  
    Fungsi dari package Spatie. Akan otomatis mengecek apakah *role* 'admin' ada di database, lalu mengaitkannya ke `$user` via tabel pivot.
*   **`$user->can('user.create');`**  
    Fungsi *native* dari Laravel Gate/Authorization. Spatie melakukan intersepsi di level `Gate`, sehingga fungsi bawaan ini otomatis mengecek tabel `role_has_permissions` user.
*   **`$role->syncPermissions($permissions);`**  
    Digunakan saat form Update Role dikirim. Berbeda dengan `givePermissionTo()`, fungsi `syncPermissions` akan menghapus semua izin lama yang tidak ada di daftar baru, lalu meng-*insert* yang baru. Ini menjamin data persis sama dengan pilihan form.
*   **`{canCreate && <Button>Create</Button>}`**  
    *(React JSX)* Ini adalah blok *conditional rendering*. Tombol ini tidak akan pernah di-*render* ke dalam DOM browser jika variabel boolean `canCreate` bernilai `false`.

---

## 6. Kenapa Role Jadi Perantara?

Mengapa tidak langsung memberikan izin ke User? (**User -> Permission**)

Bisa saja, tapi bayangkan Anda memiliki **5.000 Kasir**. Jika sistem menggunakan metode *User -> Permission*, saat ada fitur baru (misal: "Akses ke Modul Promo"), Anda harus menulis skrip *database query* untuk memperbarui **5.000 data user** satu per satu. Ini lambat, sangat sulit dikelola, dan rentan eror.

Dengan **User -> Role -> Permission**:
Anda cukup membuka halaman manajemen *Role*, lalu memberikan *permission* "Akses ke Modul Promo" pada Role "Kasir". **Selesai.** Ke-5.000 kasir tersebut *secara instan* mendapatkan akses karena mereka semua mewarisi daftar izin dari *role* yang sama.

Ini adalah standar arsitektur *Enterprise* yang **scalable** dan sangat mudah untuk di-*maintain*.

---

## 7. Efek Perubahan Role Secara Masal

Melanjutkan poin ke-6, apa yang terjadi di balik layar ketika Admin mengubah *permission* suatu *Role*?

Ketika izin `order.create` dicentang pada Role "Kasir" di panel admin, data yang berubah hanyalah **1 baris (atau insert 1 baris pivot) di tabel `role_has_permissions`**. 

Sistem akan men-*clear cache* *permissions* Spatie. Lalu, ketika kasir manapun di cabang manapun me-*refresh* halaman atau melakukan *request* baru ke backend, sistem akan mencomot daftar *permission* terbaru dari database berdasarkan ID Kasir tersebut. Sistem mengetahui bahwa "Oh, Kasir kini punya izin order.create". Ini terjadi tanpa mengubah sebaris pun data tabel `users`.

---

## 8. Dynamic Frontend Access

Keamanan sistem berjalan selaras dengan pengalaman pengguna (*User Experience/UX*):

-   **Props Auth dari Inertia:** Backend Laravel (biasanya di `HandleInertiaRequests.php`) mengirim Array Permission milik user ke objek JavaScript global setiap kali *page load*.
-   **Custom Hooks:** React menerima array ini via hook `usePermission()`.
-   **Conditional Rendering:** Kita menggunakan konvensi boolean seperti `const canUpdate = hasPermission('item.update')`.
-   **Dampaknya:** *Sidebar* yang tidak boleh diakses akan hilang, tombol Tambah/Edit/Hapus akan gaib dari pandangan. UI terlihat sangat bersih bagi pengguna dengan hak minimal, mencegah mereka merasa bingung melihat fitur yang jika diklik ujung-ujungnya error 403 (Access Denied).

---

## 9. Security Best Practice

Sebagai *Senior Engineer*, camkan prinsip-prinsip ini:

1.  **FRONTEND HIDE BUKAN KEAMANAN UTAMA.** Menyembunyikan tombol di React HANYA untuk kosmetik/UX. *Hacker* sangat bisa menggunakan Postman atau Console Chrome untuk menembak API `/api/items`.
2.  **BACKEND WAJIB MIDDLEWARE.** Keamanan sebenarnya adalah memastikan *route* backend dijaga oleh middleware (`permission:item.create`). Ini adalah pintu besi aslinya.
3.  **Lindungi Kasta Tertinggi (Protect Super Admin).** Sangat penting melakukan proteksi *hardcode* di Controller. Admin biasa tidak boleh merubah, menurunkan jabatan, atau merubah *password* milik `super_admin`. Jika ini dibiarkan, itu adalah celah *Privilege Escalation* yang fatal.
4.  **Audit Logs (Bila Perlu).** Pada perusahaan besar, perubahan hak akses oleh HR/Admin harus dicatat (*Activity Logs*) untuk keperluan audit keamanan.

---

## 10. Cara Tambah Module Baru

Jika di masa depan tim membuat fitur **Supplier Management**, ikuti SOP ini:

1.  Buka `app/Enums/PermissionName.php`, tambahkan:
    ```php
    case SUPPLIER_VIEW = 'supplier.view';
    case SUPPLIER_CREATE = 'supplier.create';
    case SUPPLIER_UPDATE = 'supplier.update';
    case SUPPLIER_DELETE = 'supplier.delete';
    ```
2.  Buka `database/seeders/RolePermissionSeeder.php`, tambahkan izin ini ke *array role* yang berhak (contoh: Admin) lalu jalankan `php artisan db:seed --class=RolePermissionSeeder`.
3.  Buka `routes/web.php`, aplikasikan middleware ke modulnya:
    ```php
    Route::post('/suppliers', 'store')->middleware('permission:supplier.create');
    ```
4.  Di Frontend (`Supplier/Index.tsx`), gunakan boolean render:
    ```tsx
    const canCreate = hasPermission('supplier.create');
    {canCreate && <Button>Add Supplier</Button>}
    ```

---

## 11. Anti Pattern yang Harus Dihindari

Jangan lakukan hal-hal ini dalam pengembangan lanjutan:

🚫 **`if ($user->role == 'admin')` (Hardcoded Role Checks)**  
Jangan menggunakan *role name* untuk menentukan akses logika. Selalu gunakan *permission check* (`if ($user->can('supplier.view'))`). Jika nama role di database diganti, kode Anda tidak akan langsung rusak jika menggunakan *permission*.

🚫 **Memberikan Permission Langsung ke User**  
Spatie mengizinkan `$user->givePermissionTo()`. Hindari ini sebisa mungkin. Usahakan akses *selalu* turun dari *Role*. Hal ini memastikan standarisasi *SOP* operasional tetap terjaga.

🚫 **Naming Permission Berantakan**  
Gunakan format `[nama_modul].[aksi]`, contoh: `inventory.approve`, `user.view`. Jangan campur aduk format (misal `create_user` lalu `ViewCategory`). Konsistensi memudahkan *autocomplete* dan pencarian global.

---

## 12. Kesimpulan

Arsitektur **Role & Permission Management** yang kita gunakan saat ini bukanlah arsitektur MVP (Minimum Viable Product), melainkan standar **Enterprise-Grade**. 

Struktur `User -> Role -> Permission` ini sempurna dan sangat *scalable* untuk aplikasi seperti:
-   **Point of Sale (POS)**
-   **ERP Systems**
-   **HRIS / Payroll Systems**
-   **SaaS Multi-tenant**

Dengan kombinasi validasi *backend* statis via Laravel Middleware dan tampilan antarmuka adaptif via Inertia React, kita telah menciptakan sistem yang bukan hanya anti-retas secara hierarki kewenangan, namun juga sangat bersahabat bagi UX pengguna akhir. Selalu pedomani dokumentasi ini saat memodifikasi keamanan aplikasi!

---

## 13. Studi Kasus: Data Flow Parameter `all_permissions`

Untuk lebih memahami bagaimana data mengalir dari Database hingga digambar menjadi UI di React, mari kita bedah kasus pengiriman parameter `all_permissions` pada halaman Role Management.

**Tujuan:** Form Tambah/Edit Role (UI) membutuhkan daftar seluruh hak akses yang tersedia di sistem agar Admin bisa mencentangnya.

### 1. Di Backend (`app/Http/Controllers/RoleController.php`)
Di sinilah data ditarik dari database dan dikirim ke Inertia (React).

```php
public function index(Request $request)
{
    // ... logic lainnya ...
    return Inertia::render('role/Index', [
        'roles' => RoleResource::collection($query->paginate($perPage)),
        // 👇 Mengirim array string berisi seluruh nama permission dari DB
        'all_permissions' => Permission::all()->pluck('name'), 
    ]);
}
```

### 2. Di Frontend Halaman Utama (`resources/js/pages/role/Index.tsx`)
React menerima data tersebut melalui `IndexProps`, lalu mengopernya (*passing props*) ke komponen Tabel (`columns`) dan tombol Tambah (`FormRole`).

```tsx
interface IndexProps {
    roles: { data: Role[] };
    all_permissions: string[]; // 👈 Menerima data dari Controller
}

export default function Index({ roles, all_permissions }: IndexProps) {
    // ...
    <DataTable
        // 👇 Oper data ke file columns.tsx (untuk form Edit per baris)
        columns={columns(canUpdate, canDelete, all_permissions)} 
        data={roles.data}
        // 👇 Oper data ke tombol "Add Role" di atas tabel
        toolbar={canCreate ? <FormRole all_permissions={all_permissions} /> : undefined}
    />
}
```

### 3. Di Kolom Tabel (`resources/js/pages/role/columns.tsx`)
Karena tombol Edit (ikon pensil) berada di dalam setiap baris tabel, data `all_permissions` harus diteruskan lagi ke dalam definisi kolom agar bisa dijangkau oleh tombol tersebut.

```tsx
export const columns = (
    canUpdate: boolean,
    canDelete: boolean,
    all_permissions: string[], // 👈 Diterima dari Index.tsx
): ColumnDef<Role>[] => [
    // ...
    {
        id: 'actions',
        cell: ({ row }) => {
            const role = row.original;
            return (
                <div className="flex items-center">
                    {/* 👇 Oper lagi ke komponen FormRole khusus untuk UPDATE data */}
                    {canUpdate && <FormRole role={role} all_permissions={all_permissions} />}
                </div>
            );
        }
    }
]
```

### 4. Di dalam Form / Modal (`resources/js/pages/role/components/FormRole.tsx`)
Di sinilah data tersebut akhirnya dipakai untuk menggambar input di layar (komponen dropdown/checkbox). UI menjadi dinamis dan otomatis memperbarui opsi jika ada penambahan fitur/izin baru di masa depan tanpa perlu *hardcode*.

```tsx
interface FormRoleProps {
    role?: Role;
    all_permissions: string[]; // 👈 Data final mendarat di sini
}

const FormRole = ({ role, all_permissions }: FormRoleProps) => {
    // ...
    return (
        // 👇 Dipakai untuk me-render dropdown pilihan izin
        <MultiSelect
            options={all_permissions.map((p) => ({ label: p, value: p }))}
            value={data.permissions}
            onChange={(val) => setData('permissions', val)}
            placeholder="Pilih hak akses..."
        />
    )
}
```

**Alur Prop Drilling:**
`Database` ➡️ `Controller` ➡️ `Inertia Page (Index.tsx)` ➡️ `Table (columns.tsx)` ➡️ `Form UI (FormRole.tsx)`.
