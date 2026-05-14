# SecureShopCrash - Huong Dan Cai Dat & Chay Du An

## Muc Luc

1. [Yeu Cau He Thong](#1-yeu-cau-he-thong)
2. [Tai Du An](#2-tai-du-an)
3. [Tao Tai Khoan & Project Supabase](#3-tao-tai-khoan--project-supabase)
4. [Cai Dat Redis](#4-cai-dat-redis)
5. [Cau Hinh Backend](#5-cau-hinh-backend)
6. [Cau Hinh Frontend](#6-cau-hinh-frontend)
7. [Tao Storage Buckets Tren Supabase](#7-tao-storage-buckets-tren-supabase)
8. [Chay Du An](#8-chay-du-an)
9. [Kiem Tra Hoat Dong](#9-kiem-tra-hoat-dong)
10. [Xu Ly Loi Thuong Gap](#10-xu-ly-loi-thuong-gap)
11. [Huong Dan Cho Lop Hoc](#11-huong-dan-cho-lop-hoc)

---

## 1. Yeu Cau He Thong

### Bat Buoc

| Cong Cu | Phien Ban | Ghi Chu |
|---|---|---|
| Java | 21 tro len | Backend chay Java 21. Kiem tra: java -version |
| Node.js | 18 tro len | Frontend build tool. Kiem tra: node -v |
| Maven | 3.8 tro len | Build backend. Kiem tra: mvn -v |
| Redis | 7.x | Luu OAuth2 state & cache. Bat buoc phai chay |

### Tuy Chon

| Cong Cu | Muc Dich |
|---|---|
| Docker | Chay Redis nhanh nhat |
| Git | Clone du an tu Git |

### Kiem Tra Da Cai Dat Chua

`powershell
java -version
node -v
npm -v
mvn -v
redis-cli ping
`

---

## 2. Tai Du An

### Cach 1: Clone tu Git (neu co)

`ash
git clone <repository-url>
cd SecureShopCrash/SecureShopCrash
`

### Cach 2: Giai nen file ZIP

Giai nen file ZIP da tai vao thu muc mong muon.

### Cau Truc Thu Muc

`
SecureShopCrash/
|-- backend/                 # Spring Boot API (Java 21)
|   |-- src/main/java/
|   |-- src/main/resources/
|   |   |-- application.properties
|   |   |-- application-secret.properties
|   |   |-- keys/           # JWT keys (RSA)
|   |-- pom.xml
|-- frontend/               # React + TypeScript + Vite
    |-- src/
    |-- .env.local
    |-- package.json
    |-- vite.config.ts
`

---

## 3. Tao Tai Khoan & Project Supabase

### Buoc 3.1: Dang Ky Supabase

1. Truy cap: https://supabase.com
2. Dang ky tai khoan (dung GitHub/Google cho nhanh)
3. Tao Organization moi hoac dung organization co san

### Buoc 3.2: Tao Project Moi

1. Tren dashboard, click New project
2. Dien thong tin:
   - Name: SecureShopCrash (hoac ten tuy chon)
   - Database Password: tu dat hoac click Generate a password
   - Region: chon gan nhat (vi du: Singapore)
3. Click Create new project
4. Doi ~2-3 phut de project khoi tao

### Buoc 3.3: Lay Connection Pooling URI

1. Vao Settings - Database
2. Trong phan Connection Pooling, copy Connection URI:

`
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-XX-XXXX.pooler.supabase.com:6543/postgres
`

Vi du:
`
postgresql://postgres.abc123:mypassword@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres
`

Ghi nho: PROJECT-REF la phan abc123 trong Supabase URL.

### Buoc 3.4: Lay ANON Key

1. Vao Settings - API
2. Trong phan Project API keys, copy ANON public key

---

## 4. Cai Dat Redis

Redis la bat buoc vi du an dung Redis de:
- Luu OAuth2 state (khi dang nhap Google/Facebook)
- Cache du lieu

### Cach 1: Docker (Khuyen Nghi)

`powershell
docker run -d --name secureshop-redis -p 6379:6379 redis:7-alpine
`

### Cach 2: Memurai (Windows)

1. Truy cap: https://www.memurai.com/get-memurai
2. Tai va cai dat Memurai Developer Edition
3. Memurai se tu khoi dong nhu Windows Service

### Kiem Tra Redis Hoat Dong

`powershell
redis-cli ping
# Ket qua: PONG = Redis dang chay
`

---

## 5. Cau Hinh Backend

### Buoc 5.1: Mo File Cau Hinh

Mo file: backend/src/main/resources/application-secret.properties

### Buoc 5.2: Cap Nhat Database Credentials

Thay the cac dong sau bang thong tin Supabase cua ban:

`properties
spring.datasource.url=jdbc:postgresql://[HOST]:[PORT]/postgres?prepareThreshold=0
spring.datasource.username=[USERNAME]
spring.datasource.password=[PASSWORD]
`

Vi du:
`properties
spring.datasource.url=jdbc:postgresql://aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?prepareThreshold=0
spring.datasource.username=postgres.abc123
spring.datasource.password=mypassword123
`

### Buoc 5.3: Kiem Tra application.properties

Mo file: backend/src/main/resources/application.properties

Dam bao co dong sau:
`properties
spring.jpa.hibernate.ddl-auto=update
`

---

## 6. Cau Hinh Frontend

Mo file: frontend/.env.local

Chi thay 2 dong sau, giu nguyen cac dong khac:

`env
VITE_API_URL=http://localhost:12345/api
VITE_OAUTH2_REDIRECT_URI=http://localhost:5173/oauth2/redirect

VITE_SUPABASE_URL=https://[PROJECT-REF].supabase.co
VITE_SUPABASE_ANON_KEY=[YOUR-ANON-KEY-FROM-STEP-3.4]
`

Vi du:
`env
VITE_API_URL=http://localhost:12345/api
VITE_OAUTH2_REDIRECT_URI=http://localhost:5173/oauth2/redirect

VITE_SUPABASE_URL=https://abc123.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
`

---

## 7. Tao Storage Buckets Tren Supabase

Du an can 2 bucket de luu anh san pham.

### Buoc 7.1: Vao Storage

Tren Supabase Dashboard - Click Storage o sidebar trai

### Buoc 7.2: Tao Bucket products

1. Click New bucket
2. Bucket name: products
3. Tick Public bucket (quan trong!)
4. Click Create bucket

### Buoc 7.3: Tao Bucket media

1. Click New bucket
2. Bucket name: media
3. Tick Public bucket
4. Click Create bucket

### Buoc 7.4: Cau Hinh RLS Policies

Vao SQL Editor trong Supabase, chay:

`sql
-- PRODUCTS BUCKET
CREATE POLICY "Allow public insert on products"
ON storage.objects FOR INSERT TO anon
WITH CHECK (bucket_id = 'products');

CREATE POLICY "Allow public select on products"
ON storage.objects FOR SELECT TO anon
USING (bucket_id = 'products');

CREATE POLICY "Allow public update on products"
ON storage.objects FOR UPDATE TO anon
USING (bucket_id = 'products') WITH CHECK (bucket_id = 'products');

CREATE POLICY "Allow public delete on products"
ON storage.objects FOR DELETE TO anon
USING (bucket_id = 'products');

-- MEDIA BUCKET
CREATE POLICY "Allow public insert on media"
ON storage.objects FOR INSERT TO anon
WITH CHECK (bucket_id = 'media');

CREATE POLICY "Allow public select on media"
ON storage.objects FOR SELECT TO anon
USING (bucket_id = 'media');

CREATE POLICY "Allow public update on media"
ON storage.objects FOR UPDATE TO anon
USING (bucket_id = 'media') WITH CHECK (bucket_id = 'media');

CREATE POLICY "Allow public delete on media"
ON storage.objects FOR DELETE TO anon
USING (bucket_id = 'media');
`

---

## 8. Chay Du An

### Thu Tu Khoi Dong

`
1. Redis (da chay o buoc 4)
   |
2. Backend (port 12345)
   |
3. Frontend (port 5173)
`

### Buoc 8.1: Chay Backend

Mo Terminal 1:

`powershell
cd D:\cothuy\SecureShopCrash\SecureShopCrash\backend
.\mvnw spring-boot:run
`

Dau hieu thanh cong:
`
Started SecureShopApplication in XX seconds
Tomcat started on port 12345
`

### Buoc 8.2: Chay Frontend

Mo Terminal 2:

`powershell
cd D:\cothuy\SecureShopCrash\SecureShopCrash\frontend
npm install
npm run dev
`

Dau hieu thanh cong:
`
VITE ready in XXX ms

  >  Local:   http://localhost:5173/
`

### Buoc 8.3: Mo Trinh Duyet

Truy cap: http://localhost:5173

---

## 9. Kiem Tra Hoat Dong

### 9.1: Kiem Tra API Backend

`powershell
curl http://localhost:12345/api/products
`

### 9.2: Tao Tai Khoan Admin

1. Truy cap http://localhost:5173
2. Dang ky tai khoan moi
3. Vao Supabase - Table Editor - users
4. Sua role tu USER thanh ADMIN

### 9.3: Cac Tinh Nang Hoat Dong Ngay

| Tinh Nang | Trang Thai |
|---|---|
| Dang ky / Dang nhap | Hoat dong |
| Xem san pham (public) | Hoat dong |
| Gio hang | Hoat dong |
| Quan ly san pham (Admin) | Hoat dong |
| Thanh toan VNPay | Canh - Can credentials VNPay Sandbox |
| OAuth2 Google/Facebook | Canh - Can cau hinh OAuth moi |
| Gui email xac thuc | Canh - Can App Password Gmail |
| AI Chatbot | Canh - Can OpenAI API key |

---

## 10. Xu Ly Loi Thuong Gap

### Loi: prepared statement does not exist

Nguyen nhan: Dung Connection Pooling ma thieu tham so

Cach fix: Them ?prepareThreshold=0 vao datasource URL:
`properties
spring.datasource.url=jdbc:postgresql://[HOST]:6543/postgres?prepareThreshold=0
`

---

### Loi: FATAL: Tenant or user not found

Nguyen nhan: Database credentials sai

Cach fix:
1. Kiem tra lai application-secret.properties
2. Dam bao username dung: postgres.[PROJECT-REF]
3. Password dung tu Supabase

---

### Loi: ERR_NAME_NOT_RESOLVED

Nguyen nhan: DNS khong resolve duoc Supabase

Cach fix: Thu doi DNS:
`powershell
netsh interface ip set dns "Wi-Fi" static 8.8.8.8
`

---

### Loi: Bucket not found

Nguyen nhan: Chua tao bucket products va media tren Supabase

Cach fix: Lam theo Buoc 7

---

### Loi: new row violates row-level security policy

Nguyen nhan: Chua tao RLS policies cho storage

Cach fix: Chay SQL o Buoc 7.4

---

### Loi: 402 Usage Limit Exceeded

Nguyen nhan: Supabase Free Tier het quota

Cach fix:
1. Doi reset dau thang
2. Hoac nang cap Supabase Pro
3. Hoac dung Local Supabase (xem phan 11)

---

### Loi: Port bi chiem

Kiem tra port 6379 (Redis):
`powershell
netstat -ano | findstr :6379
`

Kiem tra port 12345 (Backend):
`powershell
netstat -ano | findstr :12345
`

Tat process chiem port:
`powershell
taskkill /PID [PROCESS-ID] /F
`

---

### Loi: Backend khong start duoc

1. Redis co chay khong? - redis-cli ping
2. Database credentials dung khong?
3. Restart backend: .\mvnw spring-boot:run

Clean build:
`powershell
cd backend
.\mvnw clean
.\mvnw spring-boot:run
`

---

### Loi: Frontend npm install loi

Xoa node_modules va cai lai:
`powershell
cd frontend
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
`

---

## Checklist Tong Ket

`
[ ] Java 21+ da cai
[ ] Node.js 18+ da cai
[ ] Maven da cai
[ ] Redis da chay (redis-cli ping = PONG)
[ ] Supabase project da tao
[ ] Database credentials da cap nhat (voi prepareThreshold=0)
[ ] ANON key da cap nhat vao .env.local
[ ] Storage bucket products da tao (public)
[ ] Storage bucket media da tao (public)
[ ] RLS policies da tao
[ ] Backend dang chay (port 12345)
[ ] Frontend dang chay (port 5173)
[ ] Truy cap http://localhost:5173 thanh cong
`

---

## 11. Huong Dan Cho Lop Hoc

### Phuong an 1: Dung chung 1 Supabase (Don gian nhat)

Giao vien tao 1 project Supabase, chia credentials cho ca lop.

Uu diem:
- Nhanh, de setup
- SV chi can tai code, doi credentials la chay

Nhuoc diem:
- Gioi han free tier (540 gio compute/thang)
- SV co the thay du lieu cua nhau trong Supabase Dashboard

Huong dan cho SV:
1. Tai code ve
2. Cap nhat application-secret.properties voi credentials tu giao vien
3. Cap nhat frontend/.env.local voi ANON key tu giao vien
4. Chay Redis, Backend, Frontend

---

### Phuong an 2: Moi SV tu tao Supabase rieng

Uu diem:
- Moi SV co database rieng
- Khong lo trung lap du lieu

Nhuoc diem:
- Supabase free tier co gioi han
- Moi SV can tai khoan Supabase rieng

Huong dan cho SV:
1. Tao tai khoan Supabase (mien phi)
2. Lam theo huong dan tu Buoc 3 den Buoc 9

---

### Phuong an 3: Local Supabase voi Docker (Tot nhat)

Moi SV chay Supabase tren may local.

Uu diem:
- Khong gioi han quota
- Khong can tai khoan Supabase
- Khong phu thuoc internet
- Moi SV co database rieng hoan toan

Nhuoc diem:
- Can cai Docker Desktop
- Ton resource may

Yeu cau:
- Docker Desktop (Windows 10/11 Pro hoac Home + WSL2)
- RAM >= 8GB

Huong dan cho SV:

`powershell
# 1. Cai Docker Desktop
# Tai: https://www.docker.com/products/docker-desktop/

# 2. Cai Supabase CLI
npm install -g supabase

# 3. Khoi tao Supabase local
cd SecureShopCrash
supabase init

# 4. Start Supabase
supabase start

# 5. Lay credentials tu output:
#    API URL: http://127.0.0.1:54321
#    DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
#    ANON KEY: [hien thi trong output]

# 6. Cap nhat Backend (application-secret.properties):
spring.datasource.url=jdbc:postgresql://127.0.0.1:54322/postgres
spring.datasource.username=postgres
spring.datasource.password=postgres

# 7. Cap nhat Frontend (.env.local):
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=[ANON-KEY-TU-OUTPUT]
`

Luu y: Local Supabase khong co Storage. Neu can upload anh, co the bo qua tinh nang nay.

---

## Cau Hinh Nang Cao (Tuy Chon)

### Gmail SMTP (De gui email xac thuc)

1. Vao https://myaccount.google.com/security
2. Bat 2-Step Verification
3. Vao App passwords - Tao app password moi (16 ky tu)
4. Cap nhat application-secret.properties:
`properties
spring.mail.username=your-email@gmail.com
spring.mail.password=[APP-PASSWORD]
`

### VNPay Sandbox (De test thanh toan)

1. Truy cap: https://sandbox.vnpayment.vn/mercurrybackoffice/
2. Dang ky tai khoan sandbox
3. Them return URL: http://localhost:5173/payment/vnpay-return
4. Cap nhat application-secret.properties:
`properties
vnpay.url=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
vnpay.return-url=http://localhost:5173/payment/vnpay-return
vnpay.tmn-code=[TMN-CODE]
vnpay.hash-secret=[HASH-SECRET]
vnpay.version=2.1.0
vnpay.command=pay
`

### OpenAI API Key (De dung AI Chatbot)

1. Truy cap: https://platform.openai.com/api-keys
2. Tao API key moi
3. Cap nhat application-secret.properties:
`properties
spring.ai.openai.api-key=sk-...
`

### OAuth2 Google

1. Truy cap: https://console.cloud.google.com/
2. Tao Project moi
3. Vao APIs & Services - Credentials
4. Tao OAuth client ID
5. Them redirect URI: http://localhost:12345/login/oauth2/code/google
6. Cap nhat application-secret.properties:
`properties
spring.security.oauth2.client.registration.google.client-id=[CLIENT-ID]
spring.security.oauth2.client.registration.google.client-secret=[CLIENT-SECRET]
`

### OAuth2 Facebook

1. Truy cap: https://developers.facebook.com/
2. Tao App moi
3. Them Facebook Login product
4. Them redirect URIs: http://localhost:12345/login/oauth2/code/facebook
5. Cap nhat application-secret.properties:
`properties
spring.security.oauth2.client.registration.facebook.client-id=[APP-ID]
spring.security.oauth2.client.registration.facebook.client-secret=[APP-SECRET]
`

---

> Ghi chu: Sau khi cai dat hoan chinh, hay khoi dong theo thu tu: Redis - Backend - Frontend moi khi can chay du an.