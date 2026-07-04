/**
 * Pentimento WebAR Configuration
 * تنظیمات قابل ویرایش پروژه
 */

// Base URL از Vite (برای GitHub Pages)
const BASE = import.meta.env.BASE_URL;

export const CONFIG = {
  // لینک اینستاگرام CTA
  instagramUrl: 'https://www.instagram.com/pentimento.ir',

  // مسیر فایل target برای MindAR (نسبت به base)
  targetPath: BASE + 'targets/card.mind',

  // مسیر مدل سه‌بعدی GLB (در صورت استفاده از مدل خارجی)
  // فایل GLB خود را در مسیر public/models/ کپی کنید و نام آن را اینجا بنویسید
  modelPath: BASE + 'models/coffee-cup.glb',

  // استفاده از مدل fallback ساخته شده با A-Frame primitives
  // برای لود کردن فایلی که دانلود کرده‌اید، این مقدار را false کنید
  useFallbackModel: false,

  // تنظیمات شیء AR (چه مدل GLB چه مدل fallback)
  arObject: {
    scale: { x: 0.3, y: 0.3, z: 0.3 },
    position: { x: 0, y: 0, z: 0.05 }, // مقدار کمی نزدیک‌تر به کارت
    rotation: { x: 0, y: 0, z: 0 },
  },

  // تنظیمات انیمیشن
  animation: {
    enableFloat: true,
    floatAmplitude: 0.008,
    floatSpeed: 1.5,
    enableSteam: true,
    steamParticleCount: 15,
    enableRotation: true,
    rotationSpeed: 0.15,
  },

  // متن‌های فارسی UI
  ui: {
    landingTitle: 'تجربه واقعیت افزوده پنتیمنتو',
    landingSubtitle: 'برای شروع، اجازه دسترسی به دوربین را بدهید',
    startButton: 'شروع تجربه',
    loading: 'در حال آماده‌سازی...',
    scanning: 'دوربین را به سمت مارکر تست بگیرید',
    trackingLost: 'مارکر را دوباره داخل کادر قرار دهید',
    cta: 'ورود به پیج اینستاگرام',
    cameraDenied: 'دسترسی به دوربین داده نشد',
    unsupportedBrowser: 'مرورگر یا دستگاه شما برای این تجربه مناسب نیست',
    generalError: 'خطایی رخ داد',
  },

  // تنظیمات بسیار مهم فیلترهای بالا بردن پایداری و رفع لرزش MindAR
  mindAR: {
    filterMinCF: 0.0001,      // پیش‌فرض 0.001 بود - کاهش به 0.0001 لرزش را شدیداً کم می‌کند
    filterBeta: 0.001,        // پیش‌فرض 0.01 بود - کاهش به 0.001 حرکت را بسیار نرم و لنگر را قوی می‌کند
    missTolerance: 15,        // پیش‌فرض 5 بود - افزایش به 15 مانع از گم شدن سریع هدف با تکان دست می‌شود
    warmupTolerance: 5,       // فریم‌های مورد نیاز برای تایید مارکر
  },
};
