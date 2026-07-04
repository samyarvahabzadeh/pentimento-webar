# ☕ Pentimento WebAR | پنتیمنتو - واقعیت افزوده

تجربه واقعیت افزوده مبتنی بر وب برای کافه پنتیمنتو

🔗 **لینک دمو:** [samyarvahabzadeh.github.io/pentimento-webar](https://samyarvahabzadeh.github.io/pentimento-webar/)

---

## 🎯 پروژه چیست؟

یک **نمونه اولیه WebAR** (واقعیت افزوده مبتنی بر مرورگر) برای کافه پنتیمنتو.
کاربر با اسکن QR کد، وارد وب‌سایت AR می‌شود و با گرفتن دوربین به سمت marker تستی،
یک صحنه سه‌بعدی کافه (فنجان قهوه، بخار، کروسان) روی marker ظاهر می‌شود.

## 🔄 فلو کلی

```
اسکن QR → باز شدن وبسایت → صفحه خوشامد فارسی → دکمه "شروع تجربه"
→ درخواست دسترسی دوربین → باز شدن دوربین → گرفتن دوربین روی marker
→ ظاهر شدن صحنه 3D روی marker → دکمه CTA اینستاگرام
```

## 📸 چرا QR تنها کافی نیست؟

QR کد به تنهایی marker خوبی برای image tracking نیست چون:
- تضاد بصری (contrast) کمی دارد
- الگوی تکراری دارد و unique feature points کمی تولید می‌کند

**راه‌حل نهایی:** یک کارت چاپی طراحی شده شامل QR + عناصر بصری متنوع برای tracking.
**نسخه تست:** از marker نمونه رسمی MindAR استفاده می‌شود.

## 📱 راهنمای تست سریع

### مراحل:
1. **QR اسکن کنید** — فایل `public/qr/qr.png` یا `qr.svg`
2. **سایت باز می‌شود** → دکمه «شروع تجربه» بزنید
3. **اجازه دوربین بدهید**
4. **Marker تستی** را روی مانیتور دیگر یا چاپ شده نمایش دهید — فایل `public/targets/sample-marker.png`
5. **دوربین را به سمت marker بگیرید** — صحنه 3D ظاهر می‌شود!

### ⚠️ نکته مهم نسخه تست:
در نسخه تست، **QR و marker جدا هستند:**
- QR لینک سایت را باز می‌کند
- Marker تصویری جداگانه است (`sample-marker.png`)
- بعد از باز شدن سایت، دوربین را روی `sample-marker.png` بگیرید

در نسخه نهایی، QR و marker روی یک کارت واحد ترکیب می‌شوند.

## 📁 ساختار فایل‌ها

```
AR/
├── index.html                          # صفحه اصلی
├── package.json                        # تنظیمات npm
├── vite.config.js                      # تنظیمات Vite (با base برای GitHub Pages)
├── .github/workflows/deploy-pages.yml  # دپلوی خودکار GitHub Pages
├── .gitignore
├── .env.example
├── README.md
├── public/
│   ├── targets/
│   │   ├── card.mind                   # فایل target (نمونه MindAR)
│   │   └── sample-marker.png           # ⭐ تصویر marker تست — این را نشان دهید به دوربین
│   ├── qr/
│   │   ├── qr.svg                      # QR واقعی → لینک GitHub Pages
│   │   └── qr.png                      # QR واقعی PNG
│   ├── print/
│   │   ├── pentimento-ar-card.html     # کارت قابل چاپ
│   │   └── pentimento-ar-card.svg      # کارت SVG
│   ├── test-guide.html                 # صفحه راهنمای تست
│   └── models/                         # مدل‌های 3D
├── src/
│   ├── main.js                         # اپلیکیشن اصلی AR
│   ├── styles.css                      # استایل‌ها
│   └── config.js                       # تنظیمات قابل ویرایش
└── scripts/
    ├── generate-qr.js
    └── generate-card.js
```

## 🔧 تنظیمات و تغییرات

تمام تنظیمات در `src/config.js`:

### تغییر لینک اینستاگرام
```javascript
instagramUrl: 'https://www.instagram.com/pentimento.ir',
```

### تغییر مدل سه‌بعدی
```javascript
useFallbackModel: false,
modelPath: BASE + 'models/your-model.glb',
```

### تغییر متن‌های فارسی
```javascript
ui: {
  landingTitle: 'عنوان دلخواه',
  startButton: 'متن دکمه',
}
```

### تغییر اندازه و موقعیت شیء AR
```javascript
arObject: {
  scale: { x: 0.3, y: 0.3, z: 0.3 },
  position: { x: 0, y: 0, z: 0.15 },
},
```

## 🚀 اجرای محلی

```bash
npm install
npm run dev
```

سرور روی `http://localhost:5173` و آدرس شبکه محلی اجرا می‌شود.

## 📱 تست روی گوشی

### چرا HTTPS لازم است؟
مرورگرهای موبایل فقط روی HTTPS اجازه دسترسی به دوربین می‌دهند.

### روش‌ها:
1. **GitHub Pages** (توصیه شده) — HTTPS خودکار
2. **ngrok** — `ngrok http 5173`
3. **Chrome DevTools Port Forwarding**

## 🌐 دپلوی — GitHub Pages

### دپلوی خودکار:
با هر push به `main`، GitHub Actions خودکار build و deploy می‌کند.

### فعال‌سازی اولیه (فقط یکبار):
1. **GitHub → ریپو → Settings → Pages**
2. **Source** را روی **GitHub Actions** تنظیم کنید
3. Push کنید → خودکار deploy می‌شود

### آدرس نهایی:
```
https://samyarvahabzadeh.github.io/pentimento-webar/
```

## ❓ مشکلات رایج

| مشکل | راه‌حل |
|------|--------|
| دوربین باز نمی‌شود | از HTTPS استفاده کنید (GitHub Pages) |
| دوربین permission denied | تنظیمات مرورگر → اجازه دوربین |
| شیء 3D ظاهر نمی‌شود | marker را درست نشان دهید، نور کافی باشد |
| شیء 3D لرزش دارد | marker را ثابت نگه دارید |
| صفحه سفید | Console مرورگر را چک کنید |

## 📄 لایسنس و منابع

- [MindAR.js](https://github.com/hiukim/mind-ar-js) — MIT License
- [Three.js](https://github.com/mrdoob/three.js) — MIT License
- [Vazirmatn Font](https://github.com/rastikerdar/vazirmatn) — OFL License
- Sample marker & target — MindAR examples (MIT)

## 🔗 لینک‌ها

- **دمو:** [samyarvahabzadeh.github.io/pentimento-webar](https://samyarvahabzadeh.github.io/pentimento-webar/)
- **اینستاگرام:** [pentimento.ir](https://www.instagram.com/pentimento.ir)
- **ریپو:** [pentimento-webar](https://github.com/samyarvahabzadeh/pentimento-webar)
