# ☕ Pentimento WebAR | پنتیمنتو - واقعیت افزوده

تجربه واقعیت افزوده مبتنی بر وب برای کافه پنتیمنتو

---

## 🎯 پروژه چیست؟

این پروژه یک **نمونه اولیه WebAR** (واقعیت افزوده مبتنی بر مرورگر) برای کافه پنتیمنتو است. کاربر با اسکن QR کد، وارد وب‌سایت AR می‌شود و با گرفتن دوربین به سمت کارت چاپی، یک صحنه سه‌بعدی کافه (فنجان قهوه، بخار، شیرینی) روی کارت ظاهر می‌شود.

## 🔄 فلو کلی

```
اسکن QR → باز شدن وبسایت → صفحه خوشامد فارسی → دکمه "شروع تجربه"
→ درخواست دسترسی دوربین → باز شدن دوربین → گرفتن دوربین به سمت کارت
→ ظاهر شدن صحنه 3D روی کارت → دکمه CTA اینستاگرام
```

## 📸 چرا QR تنها کافی نیست؟

QR کد به تنهایی marker خوبی برای image tracking نیست چون:

- تضاد بصری (contrast) کمی دارد
- الگوی تکراری دارد و unique feature points کمی تولید می‌کند
- MindAR برای tracking خوب به تصویری با جزئیات متنوع نیاز دارد

**راه‌حل:** یک کارت چاپی طراحی شده که شامل:
- QR کد (برای باز کردن وبسایت)
- عناصر گرافیکی کافه (فنجان، بخار)
- نشانگرهای گوشه‌ای (corner markers) 
- الگوهای هندسی منحصربفرد
- متن و لوگو

کل این کارت به عنوان image target برای MindAR استفاده می‌شود.

## 📁 ساختار فایل‌ها

```
AR/
├── index.html                         # صفحه اصلی
├── package.json                       # تنظیمات npm
├── vite.config.js                     # تنظیمات Vite
├── .gitignore                         # فایل‌های ignore شده
├── .env.example                       # نمونه متغیرهای محیطی
├── README.md                          # این فایل
├── public/
│   ├── targets/
│   │   └── card.mind                  # فایل target برای MindAR ⚠️ موقتی
│   ├── qr/
│   │   └── qr.svg                     # QR کد ⚠️ placeholder
│   ├── print/
│   │   └── pentimento-ar-card.html    # کارت قابل چاپ
│   └── models/                        # مدل‌های 3D (در صورت استفاده)
├── src/
│   ├── main.js                        # اپلیکیشن اصلی AR
│   ├── styles.css                     # استایل‌ها
│   └── config.js                      # تنظیمات قابل ویرایش
└── scripts/
    ├── generate-qr.js                 # تولید QR کد
    └── generate-card.js               # تولید کارت چاپی
```

## ⚠️ فایل‌های موقتی / Fallback

### 1. فایل Target (`public/targets/card.mind`)
- **وضعیت:** موقتی - از نمونه رسمی MindAR استفاده شده
- **چه باید کرد:** بعد از چاپ کارت نهایی، target جدید بسازید
- **چطور:**
  1. کارت چاپی را باز کنید: `public/print/pentimento-ar-card.html`
  2. اسکرین‌شات بگیرید و به PNG تبدیل کنید
  3. به [MindAR Target Compiler](https://hiukim.github.io/mind-ar-js-doc/tools/compile) بروید
  4. تصویر کارت را آپلود کنید
  5. فایل `.mind` را دانلود و جایگزین `public/targets/card.mind` کنید

### 2. QR کد (`public/qr/qr.svg`)
- **وضعیت:** placeholder - قابل اسکن نیست
- **چه باید کرد:** بعد از دپلوی، QR واقعی بسازید
- **چطور:**
  1. به [QR Code Generator](https://www.qr-code-generator.com) بروید
  2. URL نهایی دپلوی شده را وارد کنید
  3. دانلود و ذخیره در `public/qr/qr.png`

### 3. مدل سه‌بعدی
- **وضعیت:** از مدل Fallback ساخته شده با Three.js primitives استفاده می‌شود
- فنجان قهوه، بشقاب، بخار و کروسان با اشکال هندسی ساخته شده
- برای جایگزینی با مدل واقعی، بخش بعد را ببینید

## 🔧 تنظیمات و تغییرات

تمام تنظیمات قابل ویرایش در فایل `src/config.js` قرار دارند:

### تغییر لینک اینستاگرام
```javascript
// src/config.js
instagramUrl: 'https://www.instagram.com/pentimento.ir',
```

### تغییر مدل سه‌بعدی
```javascript
// src/config.js
useFallbackModel: false,  // false کنید
modelPath: '/models/your-model.glb',  // مسیر مدل جدید
```

### تغییر متن‌های فارسی
```javascript
// src/config.js → ui object
landingTitle: 'عنوان دلخواه',
startButton: 'متن دکمه',
// ...
```

### تغییر اندازه و موقعیت شیء AR
```javascript
// src/config.js
arObject: {
  scale: { x: 0.3, y: 0.3, z: 0.3 },
  position: { x: 0, y: 0, z: 0.15 },
},
```

### تغییر انیمیشن
```javascript
// src/config.js
animation: {
  enableFloat: true,
  floatAmplitude: 0.008,
  enableSteam: true,
  enableRotation: true,
},
```

## 🚀 اجرای محلی (Local)

```bash
# نصب وابستگی‌ها
npm install

# اجرای سرور توسعه
npm run dev
```

سرور روی `http://localhost:5173` و آدرس شبکه محلی اجرا می‌شود.

## 📱 تست روی گوشی

### چرا HTTPS لازم است؟
مرورگرهای موبایل فقط روی HTTPS اجازه دسترسی به دوربین (`getUserMedia`) می‌دهند. روی `http://` دوربین کار نمی‌کند.

### روش‌های تست:

#### روش ۱: Vercel (توصیه شده)
1. پروژه را روی Vercel دپلوی کنید
2. از URL نهایی HTTPS استفاده کنید

#### روش ۲: ngrok
```bash
npm run dev
# در ترمینال دیگر:
ngrok http 5173
```

#### روش ۳: Chrome DevTools Port Forwarding
1. گوشی را با USB وصل کنید
2. در Chrome دسکتاپ: `chrome://inspect`
3. Port forwarding فعال کنید

## 🌐 دپلوی روی Vercel

### روش ۱: از طریق GitHub (توصیه شده)
1. پروژه را به GitHub push کنید
2. وارد [vercel.com](https://vercel.com) شوید
3. "Import Project" → ریپو GitHub را انتخاب کنید
4. تنظیمات:
   - **Framework:** Vite
   - **Root Directory:** (اگر در subdirectory است مشخص کنید)
   - **Install Command:** `npm install`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Deploy کنید

### بعد از دپلوی:
1. URL نهایی Vercel را کپی کنید
2. QR کد جدید بسازید با این URL
3. کارت چاپی را آپدیت و چاپ کنید
4. Target جدید بسازید از کارت چاپ شده

## ❓ مشکلات رایج و راه‌حل‌ها

| مشکل | راه‌حل |
|------|--------|
| دوربین باز نمی‌شود | از HTTPS استفاده کنید |
| دوربین permission denied | تنظیمات مرورگر → اجازه دوربین |
| شیء 3D ظاهر نمی‌شود | فایل target درست نیست - target جدید بسازید |
| شیء 3D لرزش دارد | کارت را ثابت نگه دارید، نور کافی باشد |
| صفحه سفید | Console را چک کنید، مرورگر WebGL پشتیبانی کند |
| روی Safari کار نمی‌کند | iOS 15+ لازم است |

## 📄 لایسنس

این پروژه برای استفاده داخلی کافه پنتیمنتو ساخته شده است.

### منابع استفاده شده
- [MindAR.js](https://github.com/hiukim/mind-ar-js) - MIT License
- [Three.js](https://github.com/mrdoob/three.js) - MIT License
- [Vazirmatn Font](https://github.com/rastikerdar/vazirmatn) - OFL License
- MindAR sample target file (temporary) - MIT License

## 🔗 لینک‌ها

- **اینستاگرام:** [pentimento.ir](https://www.instagram.com/pentimento.ir)
- **ریپو GitHub:** [pentimento-webar](https://github.com/samyarvahabzadeh/pentimento-webar)
