# Arsitektur & Implementasi Role & Permission Management
**Stack:** Laravel 13, Inertia.js, React.js, Spatie Laravel Permission

Dokumentasi ini berisi panduan komprehensif mengenai implementasi sistem Role & Permission dinamis pada proyek Dapur MBG ERP / POS. Dokumen ini dirancang untuk memudahkan proses *onboarding* developer baru dan menjadi acuan standar (SOP) bagi tim dalam mengembangkan modul baru.

---

## 1. Ringkasan Fitur

Sistem otorisasi ini telah dirombak dari pengecekan *hardcoded role* (menggunakan kolom tunggal `role_id`) menjadi sistem matriks hak akses dinamis berbasis **Spatie Laravel Permission**.

Fitur utama yang telah diimplementasikan:
- **Dynamic Role Management:** Create, Read, Update, Delete role secara dinamis melalui UI tanpa menyentuh kode.
- **Dynamic Permission Management:** Mengatur *permission* (hak akses spesifik) untuk setiap role menggunakan *checkbox* dinamis.
- **Assign Role ke User:** Menggunakan relasi *Many-to-Many* (Tabel `model_has_roles`), memungkinkan user memiliki satu atau lebih role.
- **Proteksi Menyeluruh (Full-Stack Security):**
  - **Route & Endpoint:** Dilindungi oleh Middleware Spatie (`role:nama_role` atau `permission:nama_permission`).
  - **Menu Sidebar:** Dirender secara dinamis berdasarkan permission user yang sedang login.
  - **Komponen UI / Tombol:** Menggunakan custom hook React `usePermission()` untuk merender elemen secara kondisional.
- **Super Admin Bypass Access:** Role `super_admin` secara otomatis dapat melewati semua pengecekan permission (selalu `true`) berkat implementasi `Gate::before`.

---

## 2. Perubahan Code (Change Log)

Berikut adalah komponen utama yang dibangun/diubah untuk mendukung arsitektur baru:

### Backend Laravel

- **Migrations:**
  - Menjalankan *publish migration* bawaan Spatie yang membuat tabel: `roles`, `permissions`, `model_has_roles`, `model_has_permissions`, dan `role_has_permissions`.
  - Menghapus tabel lama `roles` bawaan project lama dan *drop* kolom `role_id` dari tabel `users`.
- **Models:**
  - `User.php`: Menambahkan trait `HasRoles` dari Spatie. Menghapus relasi manual `belongsTo` ke role lama.
  - `Role.php`: Model custom yang melakukan `extends \Spatie\Permission\Models\Role`. Ini berguna untuk melakukan aliasing jika dibutuhkan, namun tetap memanfaatkan fungsionalitas inti Spatie.
- **Seeders:**
  - `RolePermissionSeeder.php`: Berfungsi melakukan inisialisasi permission, role bawaan, dan *sync* akses pertama kali. Selalu jalankan seeder ini setiap kali melakukan instalasi baru.
- **Enums:**
  - `PermissionName.php`: Menyimpan standarisasi string nama permission (contoh: `user.view`, `pos.access`).
- **Middleware:**
  - `HandleInertiaRequests.php`: Mem- *pass* daftar `roles` dan `permissions` user yang login ke objek `auth` di React. Ini *crucial* agar frontend tidak perlu nge- *fetch* permission secara manual.
- **Controllers:**
  - `RoleController` & `UserController`: Diperbarui agar saat proses simpan/update, menggunakan metode dari Spatie (`syncRoles`, `assignRole`) alih-alih sekadar mengubah kolom di database.
- **Actions / Services:**
  - Memisahkan logika sinkronisasi ke kelas spesifik seperti `SyncRolePermissions` dan `AssignRoleToUser` untuk menjaga *Clean Architecture*.
- **Requests (Form Validation):**
  - Memastikan validasi tidak memanggil kolom `role_id` lama, tetapi memvalidasi eksistensi role melalui kolom `name` di tabel `roles` Spatie.
- **Policies / Gates:**
  - `AppServiceProvider.php`: Memuat fungsi `Gate::before()` yang membuat `super_admin` kebal terhadap segala batasan akses (otomatis me-return `true` pada fungsi pengecekan `hasPermission`).

### Frontend React + Inertia

- **Hooks:**
  - `usePermission.ts`: *Custom hook* utama di frontend (`hasRole`, `hasPermission`, `hasAnyPermission`). Hook ini membaca state dari `page.props.auth`.
- **Components:**
  - `AppSidebar.tsx`: Menampilkan menu *hanya* jika item menu tersebut memiliki konfigurasi permission yang *match* dengan array permission milik *auth user*.
  - `RequirePermission.tsx`: Komponen wrapper untuk menyembunyikan/menampilkan blok UI (seperti form atau tombol Delete) secara deklaratif.
- **Pages:**
  - `role/Index.tsx` & `role/components/FormRole.tsx`: UI yang memfasilitasi admin untuk mencentang array permission spesifik kepada suatu role tertentu.
- **Shared Types:**
  - `types/auth.ts`: Menambahkan tipe array string `roles[]` dan `permissions[]` ke tipe global User agar *IntelliSense / TypeScript autocomplete* bekerja sempurna.

---

## 3. Cara Sistem Permission Bekerja

Sistem otorisasi ini menggunakan pola **Role-Based Access Control (RBAC) dengan Granularitas Permission**.

### Alur Kerja (Workflow):
1. Sistem mendaftarkan "Kata Kunci Akses" (String Permission) ke database (misal: `report.view`).
2. Role "Manager" dihubungkan ke `report.view` (Relasi disimpan Spatie di `role_has_permissions`).
3. User Budi ditugaskan sebagai "Manager" (Relasi disimpan di `model_has_roles`).
4. Saat Budi login, Laravel mengambil semua permission yang dimilikinya, lalu di- *inject* ke JavaScript (via Inertia Shared Props).
5. Frontend membandingkan daftar akses Budi dengan syarat menu (jika `hasPermission('report.view')` return true, menu render).

### Kenapa ini dinamis?
- **Tanpa Hardcode:** Kita tidak lagi menulis `if ($user->role == 'kasir')`. 
- Jika besok ada jabatan "Asisten Kasir" yang sifatnya hibrid, kita cukup buat role baru di UI, centang kotak permission terkait, dan user otomatis mendapat hak tanpa developer harus mengubah 1 baris *source code* pun.

---

## 4. Penjelasan Naming Permission

Kita menggunakan standarisasi permission berbasis murni tipe data `String` (misal: `user.delete`).

### Kenapa cuma string bisa jadi akses dinamis dan scalable?
1. **Performa Memori:** String adalah tipe data *primitif*. Laravel Spatie men- *cache* kumpulan string tersebut di memory (Redis/File). Waktu pengecekan array *lookup* di backend sangat cepat $O(1)$.
2. **Kesesuaian Framework:** Pada middleware route, kita cukup menggunakan fungsi bawaan `middleware('permission:user.delete')`.
3. **Pengecekan Frontend (React):** Frontend cukup menerima satu array murni seperti `['user.view', 'pos.access']`. Metode Javascript `array.includes('pos.access')` membuat komputasi sisi klien nyaris memakan waktu instan dibanding jika harus mem- *parsing* objek JSON bertingkat.
4. **Skalabilitas:** Ingin membatasi tombol Cetak Struk? Cukup insert string baru `pos.print_receipt` ke database, tambahkan di UI, dan bungkus tombol cetak di React dengan `usePermission`. Skema database tidak berubah sama sekali.

---

## 5. Kenapa Tiap Module Permission Bisa Berbeda?

Pada `app/Enums/PermissionName.php`, modul tidak selalu dipukul rata 4 CRUD.

**Contoh:**
- **User Module:** `user.view`, `user.create`, `user.update`, `user.delete` (4 permission detail).
- **POS Module:** Cukup 1 permission -> `pos.access`.

**Kenapa Berbeda? Pendekatan Berbasis Bisnis**
Setiap modul di aplikasi bisnis memiliki sifat fundamental yang berbeda:
- Sistem tidak melarang developer membuat 4 permission, namun hal ini disesuaikan dengan **alur bisnis**. Modul master data selalu butuh 4 pintu CRUD.
- Untuk modul transaksional seperti POS (Point of Sale), halaman tersebut umumnya *Stateful Single Page Application*. Masuk ke halaman berarti memiliki hak operasional. Jika tidak boleh operasi, artinya jangan diizinkan masuk halamannya.

---

## 6. Kapan Harus Pakai 4 Permission CRUD (Granular)?

Terapkan *Granular CRUD Permissions* (`.view`, `.create`, `.update`, `.delete`) pada **Modul Master Data**. 

**Case Nyata:**
- Master Product / Items
- Master Users
- Supplier Data

**Alasan / Skenario Bisnis:**
- Staf Input Data (Data Entry) boleh `product.create`, tapi **haram** hukumnya punya `product.delete` agar data tidak hilang (audit trail terjaga).
- Supervisor boleh melakukan `user.update` (misal: reset password), tapi dilarang melakukan `user.delete`.

---

## 7. Kapan Cukup Satu Permission `.access`?

Gunakan Single Permission untuk fitur yang sifatnya **Fungsional Eksekusi Tunggal (Single-Action) / Read-Only Page**.

**Case Nyata:**
- Halaman POS kasir (`pos.access`).
- Papan Dashboard Analitik (`dashboard.view`).
- Akses Report PDF (`report.view`).

**Alasan:**
Tidak ada entitas "Create Dashboard" atau "Delete POS" bagi user biasa. Ini murni hak "Boleh lihat/Boleh eksekusi atau Tidak".

---

## 8. Rekomendasi Permission Matrix untuk Project POS / ERP

Gunakan standarisasi (dot-notation) berikut sebagai panduan ketika tim akan membuat modul-modul di masa depan:

| Module | Tipe Akses | Rekomendasi Permission String | Catatan |
| :--- | :--- | :--- | :--- |
| **Users** | Granular CRUD | `user.view`, `user.create`, `user.update`, `user.delete` | Admin Only |
| **Roles** | Granular CRUD | `role.view`, `role.create`, `role.update`, `role.delete` | Super Admin Only |
| **Products/Items** | Granular CRUD | `item.view`, `item.create`, `item.update`, `item.delete` | |
| **Categories** | CRUD Ringan | `category.access` atau CRUD penuh (tergantung spesifikasi UI) | |
| **Inventory/Stock** | Spesifik Fungsional | `stock.view`, `stock.adjustment`, `stock.transfer` | Hindari istilah 'delete' pada stok demi akuntansi |
| **POS** | Fungsional | `pos.access`, `pos.discount_override` | POS sering butuh bypass permission tertentu |
| **Orders** | Spesifik Fungsional | `order.access`, `order.cancel`, `order.refund` | Data transaksi pantang di-delete |
| **Reports** | Read-Only | `report.sales`, `report.financial` | Pisahkan laporan jika departemen berbeda |

---

## 9. Cara Menambah Module Baru

Jika tim ingin membangun fitur baru (Contoh: **Stock Opname**), ikuti SOP berikut:

1. **Definisikan Permission (Backend):**
   Buka `app/Enums/PermissionName.php` dan tambahkan:
   ```php
   case STOCK_OPNAME = 'stock.opname';
   ```
2. **Update Seeder (Backend):**
   Jika fitur ini secara baku harus diakses Manager, tambahkan assignment ke role manager di `RolePermissionSeeder.php`. Lalu jalankan `php artisan db:seed --class=RolePermissionSeeder`.
3. **Proteksi Route (Backend):**
   Di `web.php` bungkus rute dengan middleware spatie:
   ```php
   Route::get('/stock-opname', [StockController::class, 'index'])
        ->middleware('permission:stock.opname');
   ```
4. **Render Sidebar Dinamis (Frontend):**
   Buka `app-sidebar.tsx`, tambahkan objek ke dalam array dengan properti permission-nya:
   ```typescript
   {
       title: 'Stock Opname',
       href: '/stock-opname',
       icon: BoxIcon,
       permissions: ['stock.opname'],
   }
   ```
Selesai. Fitur langsung terlindungi dari backend hingga frontend.

---

## 10. Best Practice Tim Developer

Pedomani hal-hal berikut saat mengerjakan proyek ini:
- **Jangan Hardcode Nama Role di Code:** Jangan gunakan logika `if (hasRole('manager'))` untuk memproteksi sebuah action, karena jika role "Supervisor" kelak juga diberi wewenang, Anda harus mengubah kodingan. **Selalu** gunakan `if (hasPermission('nama_action_tersebut'))`. Role checking hanya relevan untuk hal yang sifatnya murni struktural jabatan.
- **Gunakan Dot Notation:** Format `[modul].[action]`. Contoh: `order.create`, `inventory.view`. Jangan campur dengan underscore atau camelCase.
- **Selalu Assign ke Enum:** Jangan menulis *magic string* di backend. Panggil konstan dari `PermissionName::NAMA_PERMISSION->value`.
- **Hati-hati dengan Cache:** Spatie melakukan cache ke semua permission untuk optimalisasi. Ingat selalu menjalankan `php artisan permission:cache-reset` jika Anda memodifikasi row permission database secara manual (via GUI database/CLI).

---

## 11. Kesalahan Umum (Anti Pattern)

Hindari pola-pola kotor berikut ini:

1. **Menyembunyikan Tombol di UI TAPI Lupa Protect Route di API.**
   - *Bahaya:* Hacker/User iseng bisa "tembak" API endpoint via Postman.
   - *Solusi:* UI Component dibungkus `usePermission()`, dan Endpoint Route harus tetap dipasangkan middleware `permission:...`.
2. **Permission Terlalu "Micro".**
   - *Contoh Buruk:* `pos.click_pay_button`, `pos.view_item_image`. 
   - *Dampak:* Database bengkak, konfigurasi UI berantakan, membingungkan end-user saat setup Role.
3. **Melupakan Super Admin Bypass.**
   - *Kesalahan:* Meng-assign permission satu per satu ke tabel database untuk Super Admin.
   - *Solusi:* Tetap manfaatkan `Gate::before` di `AppServiceProvider` agar Super Admin selalu kebal, tanpa membebani database relasi tabel.

---

## 12. Kesimpulan

Migrasi dari status *hardcoded roles* menjadi matriks dinamis Spatie membuat arsitektur aplikasi Dapur MBG sangat **scalable** dan **future-proof**. 

Sistem tidak peduli seberapa banyak cabang baru yang akan dibuka, atau jika struktur organisasi perusahaan kelak memiliki belasan tingkat jabatan hibrid. Developer tidak akan pernah perlu membongkar logika kode lagi. Cukup daftarkan "Hak Akses (Permission)" baru, serahkan pengaturannya kepada Super Admin melalui antarmuka GUI Manajemen Role yang sudah tersedia, dan aplikasi akan mengkalkulasi keamanannya secara mandiri dari lapis View (React) hingga ke lapis Database (Laravel).

---

## 13. Case Study Bug Fix: Transisi ke Spatie

Saat memigrasikan sistem lama ke Spatie, terdapat potensi bug (seperti hilangnya tombol *Action* di halaman Kasir/Chef) karena perubahan struktur data relasional. Berikut adalah studi kasus yang telah dipecahkan dan harus menjadi perhatian saat menangani modul lama:

**Masalah:**
Tombol "Pesanan Siap" (Chef) dan "Terima Pembayaran" (Kasir) hilang di tabel Order, dan API menolak *update status*.

**Penyebab (Akar Masalah):**
1. **Perubahan Tipe Data:** Pada sistem lama, user hanya bisa memiliki satu role (diakses via `$user->role->role_name`). Setelah Spatie, satu user bisa memiliki banyak role sehingga objeknya berubah menjadi *Array of Strings* (diakses via `$user->roles`).
2. **Crash di Backend:** `OrderService` lama memanggil `$role = $user->role->role_name;` yang mengembalikan `null` di sistem baru, sehingga logika `if-else` gagal.

**Solusi yang Diterapkan:**
1. **Frontend (React Table Columns):**
   Membaca properti *array* `user.roles` dan menggunakan metode `.includes()`.
   ```typescript
   // SALAH (Lama)
   const role = user?.role?.role_name;
   if (role === 'chef') { ... }

   // BENAR (Baru)
   const roles = user?.roles || [];
   const isChef = roles.includes('chef');
   if (isChef) { ... }
   ```
2. **Backend (Laravel Services):**
   Mengganti pemanggilan properti relasi statis menjadi fungsi *built-in* dari Spatie yaitu `hasRole()`.
   ```php
   // SALAH (Lama)
   if ($user->role->role_name == 'chef') { ... }

   // BENAR (Baru)
   if ($user->hasRole('chef')) { ... }
   ```

**Pelajaran untuk Tim:**
Setiap kali melakukan refactoring atau memigrasikan modul lama, pastikan untuk **melakukan pencarian (*find in files*)** terhadap pemanggilan `$user->role` atau `user.role` dan menggantinya dengan fungsi utilitas terbaru (`hasRole()` atau array `.includes()`).
