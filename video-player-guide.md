# MultiEdu Video Player Tizimi Hujjatlari

Ushbu hujjat MultiEdu platformasidagi video player qanday ishlashi, YouTube brandingini yashirish usulari va darslarni o'tkazib yubormaslik (restriction) tizimi haqida batafsil ma'lumot beradi.

## 1. YouTube Brendingini Yashirish (Hiding YouTube Branding)

YouTube videolarini integratsiya qilganda, odatda YouTube logotipi, video nomi va boshqa tugmalar ko'rinib turadi. MultiEdu'da biz bularni quyidagi uchta usul orqali yashirganmiz:

### A. Scaling va Positioning (Kattalashtirish va Surish)
Eng asosiy usul - bu YouTube `iframe` elementini o'zining konteyneridan biroz kattaroq qilib, chekkalarini "kesib tashlash":
```jsx
className="w-[110%] h-[110%] absolute -top-[5%] -left-[5%] pointer-events-none select-none z-[1]"
```
- **Nima uchun?** `110%` o'lcham videoni 10% ga kattalashtiradi. `-5%` surish esa YouTube logotipi va video nomi joylashgan chekkalarni ko'rinmas hududga (overflow: hidden) chiqarib yuboradi.

### B. Cinema Masks (Qora pardalar)
Videoning tepa va pastki qismlariga qora rangli `div`lar qo'yilgan:
```jsx
{/* Top Mask (Hides Title) */}
<div className="absolute top-0 left-0 right-0 h-[8%] bg-black z-[10] pointer-events-none" />

{/* Bottom Mask (Hides Logo/Progress) */}
<div className="absolute bottom-0 left-0 right-0 h-[8%] bg-black z-[10] pointer-events-none" />
```
- Bu pardalar YouTube tomonidan ko'rsatilishi mumkin bo'lgan har qanday qo'shimcha ma'lumotlarni (masalan, "Watch later" yoki "Share") to'sib qo'yadi.

### C. Player Sozlamalari (playerVars)
YouTube API orqali bir qancha cheklovlar o'rnatilgan:
- `controls: 0`: YouTube'ning o'z boshqaruv tugmalarini butunlay o'chiradi.
- `modestbranding: 1`: YouTube logotipini minimal darajaga tushiradi.
- `iv_load_policy: 3`: Video ustidagi reklamalar va annotatsiyalarni o'chiradi.
- `disablekb: 1`: Klaviaturadan boshqarishni o'chiradi.

---

## 2. Custom Boshqaruv Tizimi (Custom Controls)

YouTube boshqaruv paneli o'chirib qo'yilgani sababli, biz o'zimizning premium dizayndagi panelimizni yaratganmiz:

- **Play/Pause**: React state orqali ishlaydi va YouTube player API'sini chaqiradi.
- **Progress Bar**: `setInterval` orqali har 500 millisekundda videoning joriy vaqtini oladi va foiz ko'rinishida chiqaradi.
- **Custom Poster**: Video boshlanishidan oldin chiroyli rasm (thumbnail) va o'zimizning "Play" tugmamiz ko'rsatiladi.

---

## 3. O'tkazishni Cheklash (Anti-Skip Logic)

O'quvchilar darsni ko'rmasdan oxiriga o'tkazib yubormasliklari uchun maxsus himoya tizimi o'rnatilgan:

```javascript
if (!videoCompleted && !isTeacher) {
    if (newTime > lastTimeRef.current + 2) {
        playerRef.current.seekTo(lastTimeRef.current);
        // "O'tkazib bo'lmaydi" degan ogohlantirish xabari chiqariladi
    } else if (newTime > lastTimeRef.current) {
        lastTimeRef.current = newTime;
    }
}
```
- **Qanday ishlaydi?** Tizim videoning joriy vaqtini doimiy kuzatib boradi. Agar o'quvchi videoni 2 soniyadan ko'proq oldinga surishga harakat qilsa, player avtomatik ravishda uni oxirgi ko'rgan nuqtasiga (checkpoint) qaytarib yuboradi.

---

## 4. Foydalanuvchi Interaksiyasi

O'quvchi YouTube iframe'iga to'g'ridan-to'g'ri bosa olmasligi uchun uning ustiga shaffof (transparent) qatlam qo'yilgan:
```jsx
<div className="absolute inset-0 z-[5] bg-transparent" onClick={togglePlay} />
```
Bu qatlam barcha bosishlarni (click) ushlab oladi va videoni to'xtatish yoki davom ettirish vazifasini bajaradi, YouTube menyularini ochilishiga yo'l qo'ymaydi.

---

## Xulosa
Ushbu yondashuv orqali biz YouTube'ning tekin hosting imkoniyatidan foydalangan holda, o'zimizning shaxsiy va xavfsiz video playerimizdek tajribani yaratdik.
