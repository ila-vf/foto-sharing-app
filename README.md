# Foto Sharing App

Aplikasi web sederhana untuk sharing foto menggunakan **React**, **Node.js**, **MySQL**, dan **Docker Compose**.

---

## Cara Menjalankan (Lokal)

### Prasyarat:
- Sudah install **Docker & Docker Compose**

### Langkah:
```bash
# Clone repo & masuk folder
git clone https://github.com/ila-vf/foto-sharing-app.git
cd foto-sharing-app

# Jalankan docker
docker compose up --build
// tunggu hingga backend tersambung dengan MySQL database

#Buka di browser
http://localhost:3000

```

## Komponen & Fungsinya:

### Frontend (React)
- Port: 3000
- Berfungsi sebagai tampilan pengguna
- Berkomunikasi dengan backend menggunakan HTTP API

### Backend (Node.js)
- Port: 5000
- API untuk autentikasi, manajemen user, upload dan akses foto
- Menyimpan file upload di backend/uploads/

### Database (MySQL 8)
- Port internal: 3306 (tidak diekspos ke host)
- Volume db_data digunakan agar data tidak hilang saat container dimatikan
- File db/schema.sql dijalankan otomatis saat pertama kali membuat volume

### Docker & Docker Compose
- Docker: menjalankan semua komponen dalam container terisolasi
- Docker Compose: menyatukan frontend, backend, dan database dalam satu perintah
- Konfigurasi ada di file: `docker-compose.yml`

## Akun Admin Default
- Username: admin	
- Password: admin123 (sudah di-hash dalam schema.sql)