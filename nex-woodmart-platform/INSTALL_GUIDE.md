# NEX WoodMart Platform - Installation & Setup Guide

## 📋 وضعیت فعلی پروژه

### ✅ تکمیل شده (۱۰۰٪)
- [x] معماری کامل سیستم
- [x] WordPress Plugin (NEX Bridge) - ۶۷۱ خط کد
- [x] Python Backend (FastAPI) - کامل با تمام endpoints
- [x] Next.js Frontend - صفحه اصلی + Chat Interface
- [x] Capabilities Registry - ۲۸۳ capability WoodMart
- [x] Rules Engine - ۶۰+ قانون UX/SEO/Performance
- [x] ساختار پوشه‌بندی کامل
- [x] مستندات کامل (Architecture, MVP Plan, QuickStart)

### ⏳ نیاز به نصب و تنظیم (شما باید انجام دهید)
- [ ] نصب WordPress با WoodMart روی لوکال هاست
- [ ] کپی کردن Plugin به WordPress
- [ ] نصب dependenciesهای Python
- [ ] نصب dependenciesهای Node.js
- [ ] تنظیم فایل‌های .env
- [ ] اجرای سرورها

---

## 🚀 مرحله ۱: آماده‌سازی WordPress

### ۱.۱ نصب WordPress لوکال

**روش پیشنهادی: LocalWP**
```bash
# دانلود از https://localwp.com
# نصب LocalWP
# ایجاد سایت جدید با نام "nex-test"
```

**یا با Docker:**
```bash
cd /workspace
mkdir wordpress-local
cd wordpress-local

docker run --name wordpress-nex \
  -e WORDPRESS_DB_HOST=mysql \
  -e WORDPRESS_DB_USER=wordpress \
  -e WORDPRESS_DB_PASSWORD=wordpress \
  -e WORDPRESS_DB_NAME=wordpress \
  -p 8080:80 \
  -d wordpress:latest
```

### ۱.۲ نصب WoodMart

1. وارد WordPress Admin شوید: `http://localhost:8080/wp-admin`
2. از منو: Appearance → Themes → Add New → Upload Theme
3. فایل zip WoodMart را آپلود و فعال کنید
4. WoodMart → Setup Wizard را اجرا کنید (تنظیمات اولیه)

### ۱.۳ نصب NEX Bridge Plugin

```bash
# کپی پلاگین به وردپرس
cp -r /workspace/nex-woodmart-platform/wordpress-bridge/nex-bridge.php \
      /path/to/wordpress/wp-content/plugins/

# یا اگر از LocalWP استفاده می‌کنید:
# کپی به پوشه سایت در LocalWP
```

**فعال‌سازی:**
1. WordPress Admin → Plugins
2. پیدا کردن "NEX AI Bridge"
3. کلیک Activate

### ۱.۴ دریافت API Key

1. WordPress Admin → NEX Bridge (منوی جدید)
2. API Key را کپی کنید (خودکار تولید شده)
3. این کلید را برای مرحله backend نیاز دارید

### ۱.۵ ساخت Application Password

1. WordPress Admin → Users → Profile
2. اسکرول به پایین تا "Application Passwords"
3. نام: `NEX Platform`
4. کلیک "Add New Application Password"
5. پسورد تولید شده را کپی کنید

---

## 🐍 مرحله ۲: نصب Python Backend

### ۲.۱ نصب پیش‌نیازها

```bash
# بررسی نسخه Python
python --version  # باید 3.10 یا بالاتر باشد

# اگر Python ندارید:
# Ubuntu/Debian:
sudo apt update && sudo apt install python3.10 python3-pip python3-venv

# macOS:
brew install python@3.10
```

### ۲.۲ ساخت Virtual Environment

```bash
cd /workspace/nex-woodmart-platform/core

# ساخت virtual environment
python -m venv venv

# فعال‌سازی
source venv/bin/activate  # لینوکس/مک
# یا در ویندوز:
# venv\Scripts\activate
```

### ۲.۳ نصب Dependencies

```bash
pip install -r requirements.txt
```

**محتویات requirements.txt:**
```
fastapi==0.109.0
uvicorn[standard]==0.27.0
httpx==0.26.0
pyyaml==6.0.1
python-dotenv==1.0.0
pydantic==2.5.3
playwright==1.40.0
```

### ۲.۴ نصب Playwright Browsers

```bash
# نصب browserهای مورد نیاز برای screenshot
playwright install chromium
```

### ۲.۵ تنظیم فایل .env

فایل `.env` را در پوشه `core/` بسازید:

```bash
cd /workspace/nex-woodmart-platform/core
nano .env
```

**محتوای فایل .env:**
```env
# WordPress Configuration
WORDPRESS_URL=http://localhost:8080
WORDPRESS_API_USER=admin
WORDPRESS_API_PASSWORD=your-application-password-here

# NEX Bridge API Key (از WordPress admin کپی کنید)
NEX_API_KEY=your-nex-api-key-here

# AI Provider (برای MVP فعلاً none بگذارید)
AI_PROVIDER=none
AI_API_KEY=

# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=true
```

**⚠️ توجه:** مقادیر زیر را با اطلاعات خود جایگزین کنید:
- `your-application-password-here` ← از مرحله ۱.۵
- `your-nex-api-key-here` ← از مرحله ۱.۴

---

## ⚛️ مرحله ۳: نصب Next.js Frontend

### ۳.۱ بررسی Node.js

```bash
node --version  # باید 18 یا بالاتر باشد
npm --version
```

**اگر Node.js ندارید:**
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# macOS
brew install node@18
```

### ۳.۲ نصب Dependencies

```bash
cd /workspace/nex-woodmart-platform/web-platform

npm install
```

این دستور پکیج‌های زیر را نصب می‌کند:
- Next.js 14.1.0
- React 18.2.0
- Tailwind CSS 3.4.1
- TypeScript 5.3.3

### ۳.۳ تنظیم Environment

```bash
# ساخت فایل .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
```

---

## ▶️ مرحله ۴: اجرای پلتفرم

### ۴.۱ اجرای Backend (ترمینال ۱)

```bash
cd /workspace/nex-woodmart-platform/core
source venv/bin/activate

# اجرای FastAPI server
python main.py
```

**خروجی مورد انتظار:**
```
INFO:     Started server process [12345]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

✅ Backend آماده است روی: `http://localhost:8000`

### ۴.۲ اجرای Frontend (ترمینال ۲)

```bash
cd /workspace/nex-woodmart-platform/web-platform

npm run dev
```

**خروجی مورد انتظار:**
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

✅ Frontend آماده است روی: `http://localhost:3000`

---

## 🎯 مرحله ۵: تست اولیه

### ۵.۱ باز کردن پلتفرم

مرورگر را باز کنید و بروید به:
```
http://localhost:3000
```

### ۵.۲ بررسی اتصال به WordPress

در صفحه اصلی باید ببینید:
- عنوان "NEX WoodMart Platform"
- وضعیت WordPress: connected/disconnected
- بخش Chat Assistant
- بخش Projects

**اگر disconnected نشان داد:**
1. بررسی کنید Backend روشن باشد (`http://localhost:8000`)
2. بررسی کنید WordPress در دسترس باشد
3. فایل `.env` در backend را چک کنید

### ۵.۳ اولین دستور تستی

در کادر Chat بنویسید:
```
Show me current site status
```

**واکنش مورد انتظار:**
- پیام شما نمایش داده شود
- AI پاسخ دهد (فعلاً mock response)
- Task ID ایجاد شود

### ۵.۴ تست تغییر Header

بنویسید:
```
Change logo position to center
```

**سیستم باید:**
1. دستور را تحلیل کند
2. Plan نمایش دهد
3. منتظر تأیید شما بماند

---

## 🔧 عیب‌یابی

### مشکل: Backend اجرا نمی‌شود

```bash
# بررسی خطاها
cd /workspace/nex-woodmart-platform/core
python main.py

# اگر خطای dependency داشت:
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall
```

### مشکل: Frontend خطای CORS می‌دهد

مطمئن شوید در `core/main.py` این بخش وجود دارد:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    ...
)
```

### مشکل: WordPress Connection Failed

1. بررسی کنید WordPress بالا باشد
2. Application Password درست باشد
3. NEX Bridge plugin فعال باشد
4. URL در `.env` درست باشد

**تست دستی API:**
```bash
curl -H "X-NEX-API-Key: YOUR_KEY" \
     http://localhost:8080/wp-json/nex/v1/site-info
```

### مشکل: Port 8000 یا 3000 اشغال است

```bash
# پیدا کردن process اشغال کننده
lsof -i :8000
lsof -i :3000

# کشتن process
kill -9 <PID>

# یا تغییر port در config
```

---

## 📊 وضعیت نهایی پس از نصب

پس از تکمیل مراحل بالا، شما دارید:

| Component | Status | URL |
|-----------|--------|-----|
| WordPress + WoodMart | ✅ Active | http://localhost:8080 |
| NEX Bridge Plugin | ✅ Active | در WordPress Admin |
| Python Backend | ✅ Running | http://localhost:8000 |
| Next.js Frontend | ✅ Running | http://localhost:3000 |
| Chat Interface | ✅ Ready | در صفحه اصلی |
| Project Management | ✅ Ready | در Sidebar |

---

## 🎨 قدم بعدی: اضافه کردن دموها و Design System

حالا که پلتفرم اجرا شده، می‌توانید:

### ۱. اضافه کردن دموهای WoodMart

```bash
# کپی دموها به پوشه references
cp /path/to/your/woodmart-demos/* \
   /workspace/nex-woodmart-platform/references/automotive/
```

### ۲. ساخت Design System

```bash
# رفتن به پوشه design-systems
cd /workspace/nex-woodmart-platform/design-systems

# ساخت پوشه برای پروژه شما
mkdir ajdari-spare-parts
cd ajdari-spare-parts

# ساخت فایل tokens.yaml
nano tokens.yaml
```

**نمونه tokens.yaml:**
```yaml
colors:
  primary: "#1a365d"
  secondary: "#c53030"
  accent: "#dd6b20"
  
typography:
  heading_font: "Montserrat"
  body_font: "Vazirmatn"
  
spacing:
  base: 8
  scale: [4, 8, 16, 24, 32, 48, 64]
```

### ۳. اولین پروژه واقعی

در وب‌اپلیکیشن:
1. کلیک "+ New Project"
2. نام پروژه: "Ajdari Spare Parts"
3. URL وردپرس را وارد کنید
4. Design System را انتخاب کنید
5. شروع به کار با Chat!

---

## 📞 پشتیبانی

اگر به مشکلی برخوردید:

1. **بررسی لاگ‌ها:**
   - Backend: ترمینال ۱ را چک کنید
   - Frontend: ترمینال ۲ و Console مرورگر
   
2. **بررسی مستندات:**
   - `docs/ARCHITECTURE.md`
   - `docs/MVP_PLAN.md`
   - `docs/QUICKSTART.md`

3. **بررسی Experimentها:**
   - `experiments/EXPERIMENT_PLAN.md`

---

## ✅ چک‌لیست نهایی

- [ ] WordPress نصب و WoodMart فعال است
- [ ] NEX Bridge plugin نصب و فعال است
- [ ] API Key از WordPress گرفته‌اید
- [ ] Application Password ساخته‌اید
- [ ] Python backend نصب و اجرا شده
- [ ] Next.js frontend نصب و اجرا شده
- [ ] صفحه http://localhost:3000 باز می‌شود
- [ ] وضعیت WordPress connected است
- [ ] اولین پیام chat ارسال شده

🎉 **تبریک! پلتفرم آماده استفاده است!**

---

## 🚀 شروع کار با پلتفرم

حالا می‌توانید:

```
۱. سایت جدید بسازید با دستور متنی
۲. سایت موجود را ویرایش کنید
۳. Design System آپلود کنید
۴. Reference تصاویر اضافه کنید
۵. از AI بخواهید سایت رقبا را تحلیل کند
```

**مثال:**
```
"یک فروشگاه لوازم یدکی خودرو با استایل industrial و premium بساز"
```

موفق باشید! 🚀
