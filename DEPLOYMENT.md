# Deploy YOUniverse bằng Docker Compose

## 1. Chuẩn bị VPS

Yêu cầu Docker Engine, Docker Compose v2, Nginx và Certbot. Chỉ mở các cổng `22`, `80`, `443` trên firewall.

## 2. Tạo cấu hình môi trường

```bash
cp .env.example .env
openssl rand -base64 48
```

Cập nhật toàn bộ giá trị `replace_with_...` trong `.env`. `POSTGRES_PASSWORD` trong `DATABASE_URL` phải trùng với `POSTGRES_PASSWORD`. Nếu mật khẩu chứa ký tự đặc biệt trong URL, cần URL-encode mật khẩu đó.

Không commit file `.env`.

## 3. Kiểm tra dữ liệu trước migration

Nếu database đã có dữ liệu:

```sql
SELECT "provider", COUNT(*)
FROM "PaymentTransaction"
GROUP BY "provider";
```

Chỉ được có `COD` và `BANK_TRANSFER`. Migration sẽ chủ động dừng nếu còn provider online cũ.

## 4. Build và khởi động

```bash
docker compose config
docker compose build
docker compose up -d
docker compose ps
docker compose logs -f migrate backend frontend admin
```

Service `migrate` chạy `prisma migrate deploy` trước khi backend khởi động.

## 5. Nginx và HTTPS

```bash
sudo cp deploy/nginx/youniverse.conf.example /etc/nginx/sites-available/youniverse
sudo ln -s /etc/nginx/sites-available/youniverse /etc/nginx/sites-enabled/youniverse
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d youniverse.io.vn -d www.youniverse.io.vn -d api.youniverse.io.vn -d admin.youniverse.io.vn
```

Các container chỉ bind vào localhost:

- Frontend: `127.0.0.1:3000`
- Backend: `127.0.0.1:4000`
- Admin: `127.0.0.1:8080`
- PostgreSQL: không public cổng

## 6. Lệnh vận hành

```bash
docker compose logs -f backend
docker compose restart backend frontend admin
docker compose pull
docker compose up -d --build
```

Backup hai volume `postgres_data` và `backend_uploads` trước mỗi lần nâng cấp quan trọng.
