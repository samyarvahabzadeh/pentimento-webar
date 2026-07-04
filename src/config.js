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

  // استفاده از تصاویر لایه‌لایه (2.5D) برای ساخت افکت پارالاکس و عمق تصویر
  // این گزینه بهترین پایداری و سرعت لود را روی گوشی موبایل دارد
  useLayersModel: true,

  // تصاویر لایه‌ها (از عقب به جلو)
  // فایل‌های PNG ترنسپرنت خود را در مسیر public/images/ کپی کنید
  layers: [
    { 
      id: 'layer-bg', 
      src: BASE + 'images/layer-bg.png', 
      width: 1.0, 
      height: 1.2, 
      position: { x: 0, y: 0, z: 0.01 } // لایه پس‌زمینه (چسبیده به کارت)
    },
    { 
      id: 'layer-mid', 
      src: BASE + 'images/layer-mid.png', 
      width: 0.7, 
      height: 0.7, 
      position: { x: 0, y: -0.1, z: 0.08 } // لایه میانی (عمق متوسط)
    },
    { 
      id: 'layer-fg', 
      src: BASE + 'images/layer-fg.png', 
      width: 0.8, 
      height: 0.3, 
      position: { x: 0, y: 0.35, z: 0.15 } // لایه جلو (نزدیک‌ترین به دوربین)
    }
  ],

  // مسیر مدل سه‌بعدی GLB (در صورت فعال بودن مدل سه بعدی)
  modelPath: BASE + 'models/coffee-cup.glb',

  // استفاده از مدل fallback سه‌بعدی A-Frame (فقط در صورتی که useLayersModel و useFallbackModel هر دو فعال/غیرفعال باشند)
  useFallbackModel: false,

  // تنظیمات شیء AR سه‌بعدی (در صورت استفاده از ۳D)
  arObject: {
    scale: { x: 0.3, y: 0.3, z: 0.3 },
    position: { x: 0, y: 0, z: 0.05 },
    rotation: { x: 0, y: 0, z: 0 },
  },

  // تنظیمات انیمیشن افکت‌ها
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

  // تنظیمات بهینه‌سازی فیلترهای لرزش‌گیر MindAR
  mindAR: {
    filterMinCF: 0.0001,
    filterBeta: 0.001,
    missTolerance: 15,
    warmupTolerance: 5,
  },
};
