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

  // مسیر مدل سه‌بعدی (در صورت استفاده از مدل خارجی)
  modelPath: BASE + 'models/coffee-cup.glb',

  // استفاده از مدل fallback ساخته شده با Three.js
  useFallbackModel: true,

  // تنظیمات شیء AR
  arObject: {
    scale: { x: 0.3, y: 0.3, z: 0.3 },
    position: { x: 0, y: 0, z: 0.15 },
    rotation: { x: 0, y: 0, z: 0 },
  },

  // تنظیمات انیمیشن
  animation: {
    enableFloat: true,
    floatAmplitude: 0.008,
    floatSpeed: 1.5,
    enableSteam: true,
    steamParticleCount: 25,
    enableRotation: true,
    rotationSpeed: 0.15,
  },

  // متن‌های فارسی UI
  ui: {
    landingTitle: 'تجربه واقعیت افزوده پنتیمنتو',
    landingSubtitle: 'دوربین را به سمت کارت بگیرید و تجربه را شروع کنید',
    startButton: 'شروع تجربه',
    loading: 'در حال آماده‌سازی...',
    scanning: 'کارت را داخل کادر دوربین نگه دارید',
    trackingLost: 'کارت را دوباره داخل دید دوربین قرار دهید',
    cta: 'ورود به پیج اینستاگرام',
    cameraDenied: 'دسترسی به دوربین داده نشد',
    unsupportedBrowser: 'مرورگر یا دستگاه شما برای این تجربه مناسب نیست',
    generalError: 'خطایی رخ داد',
  },

  // تنظیمات MindAR
  mindAR: {
    filterMinCF: 0.001,
    filterBeta: 0.01,
    missTolerance: 5,
    warmupTolerance: 5,
  },
};
