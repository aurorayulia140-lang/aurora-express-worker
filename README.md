# Express.js CRUD API with Cloudflare D1

Proyek ini merupakan implementasi REST API menggunakan Express.js dan Cloudflare Workers dengan Cloudflare D1 sebagai database. Proyek ini dibuat untuk praktik deployment aplikasi dan pengelolaan data menggunakan operasi CRUD.

## Teknologi

* Node.js
* TypeScript
* Express.js
* Cloudflare Workers
* Cloudflare D1
* Wrangler

## Deployment

**Production URL:**
https://aurora-express-worker.aurora-yulia140.workers.dev

## Database

Nama database: `paas-students-db`

Tabel yang digunakan: `students`

| Kolom        | Tipe    | Keterangan                  |
| ------------ | ------- | --------------------------- |
| `id`         | INTEGER | Primary key, auto increment |
| `name`       | TEXT    | Nama siswa                  |
| `class_name` | TEXT    | Kelas siswa                 |
| `created_at` | TEXT    | Waktu data dibuat           |

Struktur tabel dibuat melalui migration `migrations/0001_create_students.sql`.

## API Endpoints

| Method | Endpoint            | Fungsi                           |
| ------ | ------------------- | -------------------------------- |
| GET    | `/api/students`     | Menampilkan semua siswa          |
| GET    | `/api/students/:id` | Menampilkan siswa berdasarkan ID |
| POST   | `/api/students`     | Menambahkan data siswa           |
| PUT    | `/api/students/:id` | Memperbarui data siswa           |
| DELETE | `/api/students/:id` | Menghapus data siswa             |

### Contoh Request POST

Endpoint: `/api/students`

```json
{
  "name": "Siswa Online",
  "class_name": "XII SIJA 2"
}
```

## Menjalankan Secara Lokal

1. Install dependency:

   ```bash
   npm install
   ```

2. Jalankan development server:

   ```bash
   npm run dev
   ```

3. Buka alamat lokal yang ditampilkan oleh Wrangler di terminal.

## Migration Database

Migration lokal:

```bash
npx wrangler d1 migrations apply paas-students-db --local
```

Migration production:

```bash
npx wrangler d1 migrations apply paas-students-db --remote
```

## Deployment

Untuk melakukan deployment ke Cloudflare Workers:

```bash
npm run deploy
```

## Pengujian

Endpoint CRUD telah diuji pada deployment production, termasuk proses membaca, menambahkan, memperbarui, dan menghapus data siswa.
