# ☕ Jomoro Koffee — Backend API

Backend sistem untuk platform **Jomoro Koffee**, sebuah coffee chain yang menggunakan arsitektur microservice berbasis **NestJS**. Proyek ini dikembangkan untuk mata kuliah **COSC6093 Software Architecture** (Even Semester 2025/2026).

---

## 📋 Deskripsi Proyek

Jomoro Koffee adalah platform digital yang melayani pemesanan kopi secara online. Sistem backend ini dibangun dengan **microservice architecture** untuk memastikan modularitas, skalabilitas tinggi, dan performa optimal saat traffic meningkat.

Platform mendukung tiga peran pengguna:
- **Guest** — Menjelajahi katalog produk tanpa login
- **Customer** — Mengelola keranjang belanja dan melakukan pemesanan
- **Admin** — Mengelola produk dan inventaris

---

## 🛠️ Tech Stack

| Teknologi | Versi |
|-----------|-------|
| Node.js | 22.16.0 |
| NestJS | Latest |
| MySQL | via XAMPP 8.2.12 |
| Prisma ORM | Latest |
| JWT + Passport | Latest |
| Swagger | Latest |
| VS Code | Latest |

---

## 🏗️ Struktur Microservice

| Service | Port | Deskripsi |
|---------|------|-----------|
| **Auth Service** | `3001` | Registrasi, login, dan JWT generation |
| **Product Service** | `3002` | CRUD produk, kategori, dan inventaris |
| **Transaction Service** | `3003` | Keranjang belanja, checkout, dan riwayat order |

---

## 📁 Struktur Folder

```
jomoro-koffee/
├── auth-service/          # NestJS project — Auth Service (Port 3001)
├── product-service/       # NestJS project — Product Service (Port 3002)
├── transaction-service/   # NestJS project — Transaction Service (Port 3003)
└── database/
    └── jomoro_koffee.sql  # SQL file untuk inisialisasi database
```

---

## 🗃️ Skema Database

### Auth Service — Tabel `users`

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | INT | Primary Key |
| first_name | VARCHAR(255) | Nama depan |
| last_name | VARCHAR(255) | Nama belakang |
| email | VARCHAR(255) | Alamat email |
| password | VARCHAR(255) | Password (plain text) |
| role | VARCHAR(25) | `"ADMIN"` atau `"CUSTOMER"` |

### Product Service — Tabel `categories` & `products`

**categories**

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | INT | Primary Key |
| name | VARCHAR(255) | Nama kategori |

**products**

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | INT | Primary Key |
| name | VARCHAR(255) | Nama produk |
| description | VARCHAR(255) | Deskripsi produk |
| price | DOUBLE | Harga produk |
| stock | INT | Stok tersedia |
| image_url | VARCHAR(255) | URL gambar (nullable) |
| category_id | INT | Foreign key ke categories |

### Transaction Service — Tabel `carts`, `cart_items`, `orders`, `order_details`

**carts**

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | INT | Primary Key |
| user_id | INT | ID pemilik keranjang |

**cart_items**

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | INT | Primary Key |
| cart_id | INT | Foreign key ke carts |
| product_id | INT | ID produk |
| quantity | INT | Jumlah produk |

**orders**

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | INT | Primary Key |
| user_id | INT | ID pemesan |
| created_at | DATETIME | Waktu order dibuat |

**order_details**

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | INT | Primary Key |
| order_id | INT | Foreign key ke orders |
| product_id | INT | ID produk |
| price | DOUBLE | Harga saat transaksi |
| quantity | INT | Jumlah yang dibeli |

---

## 🚀 Cara Menjalankan Proyek

### Prasyarat

Pastikan software berikut sudah terinstal:
- [Node.js 22.16.0](https://nodejs.org/)
- [XAMPP 8.2.12](https://www.apachefriends.org/) (MySQL)
- [Visual Studio Code](https://code.visualstudio.com/)

### 1. Setup Database

1. Jalankan **XAMPP** dan aktifkan service **Apache** dan **MySQL**.
2. Buka **phpMyAdmin** di `http://localhost/phpmyadmin`.
3. Buat database baru bernama `jomoro_koffee`.
4. Import file SQL:
   - Pilih database `jomoro_koffee`
   - Klik tab **Import**
   - Upload file `database/jomoro_koffee.sql`
   - Klik **Go**

### 2. Setup Auth Service

```bash
cd auth-service
npm install
npx prisma generate
npm run start:dev
```

### 3. Setup Product Service

```bash
cd product-service
npm install
npx prisma generate
npm run start:dev
```

### 4. Setup Transaction Service

```bash
cd transaction-service
npm install
npx prisma generate
npm run start:dev
```

### Konfigurasi `.env` (setiap service)

Buat file `.env` di masing-masing folder service:

```env
DATABASE_URL="mysql://root:@localhost:3306/jomoro_koffee"
JWT_SECRET="your_jwt_secret_key"
```

---

## 📡 API Endpoints

### 🔐 Auth Service (`localhost:3001`)

| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| POST | `/auth/register` | Guest | Registrasi pengguna baru |
| POST | `/auth/login` | Guest | Login dan mendapatkan JWT token |

### 🛍️ Product Service (`localhost:3002`)

| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| GET | `/products` | Guest | Daftar semua produk |
| GET | `/products/:id` | Guest | Detail produk |
| GET | `/categories` | Guest | Daftar semua kategori |
| GET | `/categories/:categoryId/products` | Guest | Produk berdasarkan kategori |
| POST | `/admin/products` | Admin | Tambah produk baru |
| POST | `/admin/products/:id/update` | Admin | Update produk |
| POST | `/admin/products/:id/reduce` | Admin | Kurangi stok produk |
| POST | `/admin/products/:id/delete` | Admin | Hapus produk |

### 🛒 Transaction Service (`localhost:3003`)

| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| GET | `/profiles` | Customer | Profil pengguna |
| GET | `/cart` | Customer | Lihat isi keranjang |
| POST | `/cart` | Customer | Tambah item ke keranjang |
| POST | `/cart/:product_id/update` | Customer | Update kuantitas item |
| POST | `/cart/:product_id/delete` | Customer | Hapus item dari keranjang |
| POST | `/cart/clear` | Customer | Kosongkan keranjang |
| GET | `/orders` | Customer | Riwayat semua order |
| POST | `/orders/:id` | Customer | Detail order tertentu |
| POST | `/orders` | Customer | Checkout / buat order baru |

---

## 🔑 Autentikasi

Sistem menggunakan **JWT (JSON Web Token)** dengan **Passport.js**.

- Token dihasilkan oleh **Auth Service** saat login berhasil.
- Payload JWT berisi: `id` dan `role` pengguna.
- Untuk mengakses endpoint yang dilindungi, sertakan token di header:

```
Authorization: Bearer <jwt_token>
```

---

## ✅ Aturan Validasi

### Registrasi

| Field | Aturan |
|-------|--------|
| first_name | Hanya huruf (tanpa angka/karakter spesial) |
| last_name | Hanya huruf (tanpa angka/karakter spesial) |
| email | Harus diakhiri `.com`, `.net`, `.org`, atau `.id` |
| password | Min. 8 karakter, min. 2 angka, tidak boleh ada spasi |

### Tambah Produk

| Field | Aturan |
|-------|--------|
| name | Minimal 3 kata |
| description | Minimal 20 karakter |
| price | Bilangan positif (min. 1) |
| stock | Antara 0 hingga 999 |
| image_url | Opsional (nullable) |
| category_id | Harus merujuk ke kategori yang ada |

---

## 📖 API Documentation (Swagger)

Setiap service menyediakan dokumentasi Swagger:

| Service | URL Swagger |
|---------|-------------|
| Auth Service | `http://localhost:3001/api` |
| Product Service | `http://localhost:3002/api` |
| Transaction Service | `http://localhost:3003/api` |

---

## 🔗 Komunikasi Antar Service

Service berkomunikasi satu sama lain menggunakan **built-in `fetch`** atau **axios**. CORS diaktifkan di semua service.

Contoh: Transaction Service memanggil Product Service untuk mengambil detail produk saat menampilkan isi keranjang atau detail order.

---

## 👥 Hak Akses Per Role

| Fitur | Guest | Customer | Admin |
|-------|:-----:|:--------:|:-----:|
| Lihat katalog produk | ✅ | ✅ | ✅ |
| Lihat kategori | ✅ | ✅ | ✅ |
| Register & Login | ✅ | ✅ | ✅ |
| Profil pengguna | ❌ | ✅ | ✅ |
| Keranjang belanja | ❌ | ✅ | ❌ |
| Riwayat order | ❌ | ✅ | ❌ |
| Checkout | ❌ | ✅ | ❌ |
| CRUD produk (Admin) | ❌ | ❌ | ✅ |

---

## 📌 Catatan Penting

- Setiap service memiliki **Prisma schema** sendiri dan hanya mengakses tabel yang relevan.
- Password disimpan dalam **plain text** sesuai spesifikasi soal.
- Validasi RegEx **tidak akan dinilai** — gunakan teknik validasi yang diajarkan di praktikum (misalnya `class-validator`).
- Gunakan software yang sudah ditentukan agar jawaban dapat dinilai.

---

## 📝 Informasi Mata Kuliah

| Info | Detail |
|------|--------|
| Mata Kuliah | COSC6093 Software Architecture |
| Kode Soal | E262-COSC6093-JK01-00 |
| Semester | Even 2025/2026 |
| Program Studi | Computer Science |
| Framework | NestJS (Microservice) |
