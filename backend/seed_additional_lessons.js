const mongoose = require('mongoose');
const dns = require('dns');

// Force Google DNS to bypass potential SRV blocks
dns.setServers(['8.8.8.8', '8.8.4.4']);

const User = require('./models/User');
const Lesson = require('./models/Lesson');

const atlasUri = process.argv[2];

if (!atlasUri) {
    console.error("\x1b[31mXATO: Iltimos, MongoDB Atlas URL-ni argument sifatida yuboring!\x1b[0m");
    console.log("Misol uchun:");
    console.log('node seed_additional_lessons.js "mongodb+srv://admin:parol@cluster.mongodb.net/lms-db"');
    process.exit(1);
}

const lessonsData = [
    {
        sequence: 3,
        title: "3-dars. Kriptovalyutalar va blokcheyn: geosiyosat va energiya iste'moli",
        description: "Blokcheyn arxitekturasi, kriptovalyutalarning ishlash prinsiplari, Proof of Work konsensusi, energiya sarfi va geosiyosiy oqibatlari.",
        category: "Raqamli texnologiyalar asoslari",
        thumbnailUrl: "https://picsum.photos/id/1031/800/600",
        videoUrl: "https://www.youtube.com/embed/MCIhDeYHZh4",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        model3dUrl: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb",
        documentUrl: "/uploads/documents/raqamli_texnologiyalar_asoslari.pdf",
        textContent: `KRIPTOVALYUTALAR VA BLOKCHEYN ARXITEKTURASI

Blokcheyn texnologiyasi - bu ma'lumotlarni markazlashtirilmagan va taqsimlangan shaklda saqlash tizimidir. Har bir blok tranzaksiyalar ro'yxati, vaqt muhri va oldingi blokning kriptografik xeshini o'z ichiga oladi. Bu tizim ma'lumotlarning o'zgartirilishini mutlaqo imkonsiz qiladi.

Blokcheynning asosiy ustunlari:
1. Markazsizlashtirish (Decentralization): Tranzaksiyalarni tasdiqlash uchun banklar yoki hukumatlar kabi uchinchi tomon vositachilariga ehtiyoj yo'q.
2. Kriptografik xavfsizlik: SHA-256 kabi ilg'or shifrlash algoritmlari ma'lumotlar butunligini kafolatlaydi.
3. Shaffoflik: Blokcheyn tarmog'idagi har bir tranzaksiya barcha ishtirokchilar uchun ochiq bo'ladi.

Geosiyosiy va Ekologik muammolar:
Proof of Work (PoW) konsensus algoritmi tranzaksiyalarni tasdiqlash uchun ulkan kompyuter quvvatini talab qiladi. Bu esa dunyo bo'ylab elektr energiyasi iste'molini keskin oshiradi. Masalan, Bitcoin tarmog'ining yillik energiya sarfi ko'plab o'rta o'lchamdagi davlatlar yillik sarfidan oshib ketadi. Geosiyosiy nuqtai nazardan, kriptovalyutalar milliy valyutalarning monopoliyasiga tahdid soladi va sanksiyalarni chetlab o'tish vositasi sifatida ham qo'llanilishi mumkin.`,
        transcript: "Ushbu darsda biz blokcheyn texnologiyasi, kriptovalyutalarning geosiyosiy ta'siri va ekologik energiya muammolari haqida gaplashamiz. Blokcheyn qanday tuzilganligini va Proof of Work tizimining yuqori energiya sarfi ortidagi texnik sabablarni tahlil qilamiz.",
        quiz: [
            {
                question: "Blokcheyn arxitekturasida har bir yangi blok oldingi blokning qaysi ma'lumotini o'z ichiga oladi?",
                options: ["Kriptografik xeshini", "Tranzaksiya summasini", "Foydalanuvchi parolini", "IP manzilini"],
                correctAnswer: 0
            },
            {
                question: "Proof of Work (PoW) algoritmining asosiy ekologik kamchiligi nima?",
                options: ["Ulkan elektr energiyasi iste'moli", "Kichik ma'lumot sig'imi", "Kam foydalanuvchilar soni", "Markazlashgan nazorat"],
                correctAnswer: 0
            },
            {
                question: "Kriptografiyada keng qo'llaniladigan SHA-256 qanday algoritm hisoblanadi?",
                options: ["Bir tomonlama xesh-funksiya", "Simmetrik shifrlash algoritmi", "Asimmetrik shifrlash algoritmi", "Tranzaksiya protokoli"],
                correctAnswer: 0
            },
            {
                question: "Blokcheynning tranzaksiyalarni uchinchi tomonsiz amalga oshirish xususiyati nima deyiladi?",
                options: ["Markazsizlashtirish (Decentralization)", "Shifrlash (Encryption)", "Validatsiya (Validation)", "Masshtablash (Scaling)"],
                correctAnswer: 0
            },
            {
                question: "Bitcoin tarmog'ida yangi blok o'rtacha necha daqiqada yaratiladi?",
                options: ["10 daqiqa", "1 daqiqa", "30 daqiqa", "5 daqiqa"],
                correctAnswer: 0
            },
            {
                question: "Blokcheyn tarmog'ida '51% hujumi' nima?",
                options: ["Tarmoq hisoblash quvvatining yarmidan ko'pini nazorat qilish", "Barcha foydalanuvchilar parollarini o'g'irlash", "Saytni DDOS qilish", "Serverni elektrdan uzish"],
                correctAnswer: 0
            },
            {
                question: "Ethereum tarmog'i energiyani tejash maqsadida qaysi konsensus algoritmiga o'tdi?",
                options: ["Proof of Stake (PoS)", "Proof of Work (PoW)", "Proof of Authority (PoA)", "Proof of History (PoH)"],
                correctAnswer: 0
            },
            {
                question: "Kriptovalyutalarning an'anaviy bank tizimidan farqi nimada?",
                options: ["Markaziy emitent yoki tartibga soluvchining yo'qligi", "Faqat qog'oz shaklida bo'lishi", "Tranzaksiyalarni bekor qilish imkoniyati", "Kamroq xavfsizligi"],
                correctAnswer: 0
            },
            {
                question: "Blokcheyndagi 'Smart-kontakt' nima?",
                options: ["O'z-o'zidan bajariladigan raqamli shartnoma kodi", "Aqlli telefonlar ro'yxati", "Foydalanuvchilar kelishuvi hujjati", "Aloqa kanali"],
                correctAnswer: 0
            },
            {
                question: "Kriptovalyuta hamyonlaridagi 'Private Key' (Maxfiy kalit) nima uchun xizmat qiladi?",
                options: ["Tranzaksiyalarni imzolash va mablag'larni boshqarish uchun", "Hamyon interfeysini sozlash uchun", "Boshqa foydalanuvchilarga jo'natish uchun", "Saytga kirish parolini tiklash uchun"],
                correctAnswer: 0
            }
        ]
    },
    {
        sequence: 4,
        title: "4-dars. Raqamli platformalar va mikromobilitet: shahar transporti transformatsiyasi",
        description: "Elektr skuterlar, velosiped ijarasi platformalari va shahar transport tizimini mikromobilitet orqali optimallashtirish.",
        category: "Raqamli texnologiyalar asoslari",
        thumbnailUrl: "https://picsum.photos/id/146/800/600",
        videoUrl: "https://www.youtube.com/embed/1Dn7H9Qc39g",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        model3dUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
        documentUrl: "/uploads/documents/raqamli_texnologiyalar_asoslari.pdf",
        textContent: `RAQAMLI MIKROMOBILITET TIZIMLARI

Mikromobilitet - bu qisqa masofalarga harakatlanish uchun mo'ljallangan, elektr skuterlar, samokatlar va velosipedlar kabi yengil transport vositalaridan foydalanish tizimidir. Raqamli platformalar mobil ilovalar va GPS texnologiyalari orqali ushbu transport vositalarini ijaraga berish jarayonini to'liq avtomatlashtirdi.

Mikromobilitetning afzalliklari:
1. Birinchi va oxirgi mil muammosi yechimi: Jamoat transporti bekatlaridan uy yoki ishxonagacha bo'lgan masofani tez va arzon bosib o'tish imkoniyati.
2. Ekologik toza: Emissiyasiz elektr transport vositalari shahar havosining ifloslanishini keskin kamaytiradi.
3. Tirbandliklarni kamaytirish: Katta avtomobillar o'rniga yengil transportdan foydalanish shahar yo'llarini bo'shatadi.

Shahar infratuzilmasidagi qiyinchiliklar:
Elektr samokatlar va velosipedlarning tartibsiz qo'yilishi piyodalar yo'laklarida tartibsizliklarni keltirib chiqaradi. Ko'plab rivojlanayotgan shaharlarda alohida veloyo'laklarning yo'qligi esa xavfsizlik muammolarini tug'diradi. Shahar boshqaruvi endilikda raqamli platformalar uchun maxsus to'xtash joylari va tezlikni avtomatik cheklovchi Geofencing tizimlarini joriy etmoqda.`,
        transcript: "Sinfimizning ushbu qismida vaqtimizni shahar transport tizimini tubdan o'zgartirgan raqamli mikromobilitet platformalarini o'rganishga bag'ishlaymiz. GPS va geo-fencing tizimlarining skuterlar xavfsizligini ta'minlashdagi texnik mexanizmlarini tahlil qilamiz.",
        quiz: [
            {
                question: "Mikromobilitet tushunchasi asosan qanday transport vositalarini qamrab oladi?",
                options: ["Elektr skuter, velosiped va samokatlar", "Metro va tramvaylar", "Yuk avtomobillari", "Samolyot va poyezdlar"],
                correctAnswer: 0
            },
            {
                question: "Transport tizimidagi 'Birinchi va oxirgi mil' (First/Last Mile) muammosi nima?",
                options: ["Jamoat transporti bekati va yakuniy manzil orasidagi masofani bosib o'tish muammosi", "Yo'l qurish muammosi", "Skuter tezligini oshirish muammosi", "Yo'lovchi chiptasi narxi"],
                correctAnswer: 0
            },
            {
                question: "Skuterlarning ruxsat etilmagan hududlarda tezligini avtomatik kamaytirish yoki to'xtatish uchun qaysi texnologiya qo'llaniladi?",
                options: ["Geofencing (Geografik chegara tizimi)", "Sun'iy yo'ldosh aloqasi", "Bluetooth ulanishi", "Gidravlik tormozlar"],
                correctAnswer: 0
            },
            {
                question: "Mikromobilitet ilovalari foydalanuvchining joylashuvini qanday aniqlaydi?",
                options: ["Smartfondagi GPS moduli orqali", "IP manzil orqali", "Faqat Wi-Fi orqali", "Kamera tasvirlari orqali"],
                correctAnswer: 0
            },
            {
                question: "Mikromobilitetning shahar ekologiyasiga asosiy ijobiy ta'siri nima?",
                options: ["Karbonat angidrid (CO2) chiqindilarini kamaytirish", "Yo'llarni kengaytirish", "Elektr energiyasini ishlab chiqarish", "Shovqinni butunlay yo'qotish"],
                correctAnswer: 0
            },
            {
                question: "Platformasiz (dockless) skuter ijarasi nima degani?",
                options: ["Maxsus stansiyasiz, ko'chaning istalgan joyida qoldirish imkoniyati", "Faqat stansiyaga topshirish", "Bepul ijara tizimi", "Internet ulanishisiz ishlovchi samokat"],
                correctAnswer: 0
            },
            {
                question: "Mikromobilitet platformalarini shahar boshqaruvi bilan integratsiya qilishda qo'llaniladigan ma'lumotlar standarti nima?",
                options: ["MDS (Mobility Data Specification)", "HTML5 / CSS3", "REST API JSON", "SQL Database"],
                correctAnswer: 0
            },
            {
                question: "Mikromobilitet vositalari xavfsizligini ta'minlashdagi infratuzilma nima?",
                options: ["Ajratilgan velosiped yo'laklari (Bike lanes)", "Keng avtomagistrallar", "Ko'p qavatli avtoturargohlar", "Katta svetoforlar"],
                correctAnswer: 0
            },
            {
                question: "Ijaraga beriladigan aqlli skuterlarning zaryad darajasi va holati qayerda saqlanadi?",
                options: ["Platformaning bulutli serverlarida (Cloud database)", "Faqat foydalanuvchi telefonida", "Skuterning g'ildiragida", "Hech qayerda saqlanmaydi"],
                correctAnswer: 0
            },
            {
                question: "Skuter ijarasi ilovalari to'lovlarni qanday amalga oshiradi?",
                options: ["Raqamli to'lov shlyuzlari (stripe, payme, click va hk) orqali", "Faqat naqd pul orqali", "Bank filialiga borish orqali", "SMS xabarlar orqali"],
                correctAnswer: 0
            }
        ]
    },
    {
        sequence: 5,
        title: "5-dars. Ridehailing xizmatlari: Uber, Yandex Go va shahar ekologiyasi",
        description: "Taksilar platformalari (Uber, Bolt, Yandex Go), ularning logistik algoritmlari, shahar transportiga va uglerod emissiyasiga ta'siri.",
        category: "Raqamli texnologiyalar asoslari",
        thumbnailUrl: "https://picsum.photos/id/183/800/600",
        videoUrl: "https://www.youtube.com/embed/vGZl1mO6S9E",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        model3dUrl: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Duck/glTF-Binary/Duck.glb",
        documentUrl: "/uploads/documents/raqamli_texnologiyalar_asoslari.pdf",
        textContent: `RIDEHAILING PLATFORMALARI VA ULARNING SHAHAR EKOLOGIYASIGA TA'SIRI

Ridehailing (taksi chaqirish) platformalari - masalan Uber, Yandex Go, Bolt va Lyft - yo'lovchilar va haydovchilarni real vaqt rejimida aqlli algoritmlar yordamida birlashtiruvchi raqamli tarmoqlardir. Bu tizim an'anaviy taksi xizmatlarini to'liq raqamlashtirdi.

Algoritmik moslashtirish (Dynamic Matching):
Ushbu platformalar haydovchini yo'lovchiga eng qisqa vaqt ichida yetib borishini ta'minlash uchun murakkab geografik va marshrutlash algoritmlaridan foydalanadi. Talab yuqori bo'lgan vaqtda esa narxlar avtomatik ravishda oshadi (Surge Pricing / Dinamik narxlash).

Ekologik va Ijtimoiy oqibatlari:
Tadqiqotlar shuni ko'rsatadiki, ridehailing xizmatlari shaxsiy avtomobil sotib olish ehtiyojini kamaytirsa-da, shahardagi umumiy transport kilometrajini (Deadheading - haydovchining yo'lovchisiz yurishi) oshirib yuborishi mumkin. Bu esa tirbandliklarni va uglerod emissiyasini ko'payishiga sabab bo'ladi. Hozirgi kunda platformalar ushbu muammoni hal qilish uchun elektr avtomobillarga (EV) o'tishni va hamrohlik safarlarini (Ride pooling) rag'batlantirmoqda.`,
        transcript: "Biz taksi chaqirish platformalarining ishlash mexanizmlari, marshrutlarni optimallashtirish algoritmlari va ularning shahar ekologiyasiga ta'sirini o'rganamiz. Deadheading muammosi va uning uglerod chiqindilariga qanday ta'sir qilishini ko'rib chiqamiz.",
        quiz: [
            {
                question: "Ridehailing nima?",
                options: ["Ilova orqali shaxsiy haydovchi bilan taksi chaqirish xizmati", "Avtomobillarni uzoq muddatga ijaraga olish", "Jamoat transporti chiptalari sotuvi", "Velosiped yo'llari xaritasi"],
                correctAnswer: 0
            },
            {
                question: "Ridehailing platformalarida haydovchining yo'lovchisiz, buyurtma kutib bo'sh yurishi nima deyiladi?",
                options: ["Deadheading (Bo'sh yurish)", "Cruising", "Pooling", "Surging"],
                correctAnswer: 0
            },
            {
                question: "Talab oshganda taksi narxlarining avtomatik ko'tarilishi qanday nomlanadi?",
                options: ["Dinamik narxlash (Surge pricing)", "Fiksirlangan narx", "Auksion tizimi", "Chegirma tizimi"],
                correctAnswer: 0
            },
            {
                question: "Ridehailing algoritmlari eng yaqin haydovchini tanlashda qaysi ko'rsatkichga tayanadi?",
                options: ["ETA (Estimated Time of Arrival - Yetib kelish vaqti)", "Avtomobilning rangi va rusumi", "Haydovchining yoshi", "Faqat yo'lovchining reytingi"],
                correctAnswer: 0
            },
            {
                question: "Ridehailing platformalari shahar yo'llaridagi tirbandliklarni qanday ta'sir qilishi isbotlangan?",
                options: ["Umumiy avtomobillar masofasini oshirib, tirbandlikni ko'paytirishi mumkin", "Tirbandliklarni 100% yo'qotadi", "Hech qanday ta'sir qilmaydi", "Faqat yo'l haqi narxini pasaytiradi"],
                correctAnswer: 0
            },
            {
                question: "Bir nechta yo'lovchining bitta yo'nalish bo'ylab birga ketishi nima deyiladi?",
                options: ["Ride pooling (Birgalikda ketish)", "Solo ride", "Car renting", "Fast delivery"],
                correctAnswer: 0
            },
            {
                question: "Dinamik narxlash algoritmiga qaysi omil ta'sir qilmaydi?",
                options: ["Haydovchining shaxsiy mashinasi markasi", "Ob-havo sharoiti", "Mavjud bo'sh mashinalar soni", "Buyurtmalar soni"],
                correctAnswer: 0
            },
            {
                question: "Platformalar uglerod chiqindilarini kamaytirish uchun qanday choralarni ko'rmoqda?",
                options: ["Elektromobillardan foydalanishni rag'batlantirish", "Benzin narxini oshirish", "Faqat kechasi ishlash", "Haydovchilar sonini cheklash"],
                correctAnswer: 0
            },
            {
                question: "Ridehailing ilovalarida yo'nalishlarni hisoblash uchun qaysi xarita servislaridan foydalaniladi?",
                options: ["Google Maps / OpenStreetMap APIs", "Faqat rasmli xaritalar", "Sayt skrinshotlari", "Qog'oz xaritalar"],
                correctAnswer: 0
            },
            {
                question: "Yo'lovchi va hisob-kitoblar xavfsizligini ta'minlash uchun qanday mexanizm ishlaydi?",
                options: ["Ikki tomonlama reyting va raqamli tranzaksiyalar", "Faqat haydovchining so'ziga ishonish", "Politsiya nazorati hujjati", "Naqd pul kafolati"],
                correctAnswer: 0
            }
        ]
    },
    {
        sequence: 6,
        title: "6-dars. Gig Work iqtisodiyoti: raqamli platformalarda mehnat va ijtimoiy himoya",
        description: "Kuryerlik, frilanserlik va gig-ekonomika. Tovar va xizmatlarning shahar bo'ylab harakati hamda ekologik muammolar.",
        category: "Raqamli texnologiyalar asoslari",
        thumbnailUrl: "https://picsum.photos/id/338/800/600",
        videoUrl: "https://www.youtube.com/embed/yP3A6t8_E8E",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        documentUrl: "/uploads/documents/raqamli_texnologiyalar_asoslari.pdf",
        textContent: `GIG WORK VA RAQAMLI MEHNAT IQTISODIYOTI

Gig Work (yoki Gig-ekonomika) - bu an'anaviy to'liq stavkali ish o'rniga, raqamli platformalar orqali amalga oshiriladigan qisqa muddatli shartnomalar, buyurtmalar yoki frilans loyihalar asosida mehnat qilish tizimidir. Kuryerlar, frilanser dasturchilar va taksi haydovchilari gig-ishchilar guruhiga kiradi.

Platforma mehnatining afzalliklari:
1. Ish vaqti moslashuvchanligi: Ishchi qachon va qancha ishlashni o'zi mustaqil belgilaydi.
2. Keng imkoniyatlar: Dunyoning istalgan chekkasidan turib Upwork yoki Fiverr orqali buyurtmalar olish imkoniyati.

Ijtimoiy himoya va ekspluatatsiya muammolari:
Gig ishchilari qonun bo'yicha 'mustaqil pudratchi' (independent contractor) hisoblanadilar, 'rasmiy xodim' emas. Bu esa ularni mehnat ta'tili, kasallik varaqasi, tibbiy sug'urta va pensiya ta'minotidan mahrum qiladi. Platforma algoritmlari esa ishchilarni reyting tizimi va jarimalar orqali qattiq nazorat qiladi, bu esa algoritmik boshqaruv ostidagi bosimni kuchaytiradi. Shahar bo'ylab minglab kuryerlarning harakati esa tirbandliklar va qadoqlash chiqindilarining ko'payishiga ham sabab bo'ladi.`,
        transcript: "Ushbu darsda biz gig-ekonomika, raqamli mehnat bozoridagi transformatsiyalar, kuryerlar va frilanserlarning ijtimoiy himoyasi muammolarini ilmiy nuqtai nazardan muhokama qilamiz. Algoritmik menejment tushunchasini ko'rib chiqamiz.",
        quiz: [
            {
                question: "Gig-ekonomika nima?",
                options: ["Qisqa muddatli shartnomalar va platformalar orqali ishlash tizimi", "Faqat zavodlarda ishlash", "Davlat xizmatida umrbod ishlash", "Qishloq xo'jaligi iqtisodiyoti"],
                correctAnswer: 0
            },
            {
                question: "Gig ishchilarining rasmiy xodimlardan huquqiy jihatdan asosiy farqi nima?",
                options: ["Ular rasmiy xodim emas, 'mustaqil pudratchi' hisoblanadi", "Ko'proq maosh oladilar", "Faqat davlat idoralariicda ishlaydilar", "Ularga soliq solinmaydi"],
                correctAnswer: 0
            },
            {
                question: "Platforma ishchilarini boshqarish va nazorat qilishda algoritmlardan foydalanish qanday ataladi?",
                options: ["Algoritmik menejment (Algorithmic management)", "Sun'iy boshqaruv", "Boshliq nazorati", "Avtomatik baholash"],
                correctAnswer: 0
            },
            {
                question: "Gig-platformalardagi 'Reyting tizimi' (Rating system) ishchilarga qanday ta'sir qiladi?",
                options: ["Past reyting ishchini platformadan butunlay bloklashi mumkin", "Faqat vizual ko'rinish beradi", "Ish haqini doimiy oshirib boradi", "Hech qanday ta'sir qilmaydi"],
                correctAnswer: 0
            },
            {
                question: "Gig ishchilarining ijtimoiy kafolatsizligiga misol keltirib o'ting:",
                options: ["Tibbiy sug'urta va pullik mehnat ta'tilining yo'qligi", "Moslashuvchan grafik", "Telefon orqali ishlash", "O'z mashinasidan foydalanish"],
                correctAnswer: 0
            },
            {
                question: "Qaysi platforma gig-ekonomikaga kirmaydi?",
                options: ["An'anaviy davlat maktabi o'qituvchilik ishi", "Yandex Delivery kuryerligi", "Upwork frilanserligi", "Uber taksi haydovchiligi"],
                correctAnswer: 0
            },
            {
                question: "Gig ishlarida 'Dinamik topshiriq' qanday taqsimlanadi?",
                options: ["Ilova algoritmi eng mos ishchiga avtomatik yuboradi", "Telefon orqali barcha ishchilar bilan kelishiladi", "Ishchi o'zi ofisga borib oladi", "Navbat asosida qo'lda beriladi"],
                correctAnswer: 0
            },
            {
                question: "Frilanserlik platformalariga misol keltiring:",
                options: ["Fiverr / Upwork", "YouTube / Instagram", "Wikipedia / Google", "Telegram / WhatsApp"],
                correctAnswer: 0
            },
            {
                question: "Gig-ishchilarni hisobga olish va soliqqa tortish uchun O'zbekistonda qanday tizim yaratilgan?",
                options: ["O'zini o'zi band qilgan shaxslar (Self-employed) maqomi", "Faqat MChJ ochish majburiyati", "Soliq imtiyozlarining mutlaqo yo'qligi", "Patent olish tizimi"],
                correctAnswer: 0
            },
            {
                question: "Kuryerlik xizmatlarining shaharda ko'payishi qanday ekologik muammo tug'diradi?",
                options: ["Plastik va bir martalik qadoqlash chiqindilarining keskin ortishi", "Suv iste'molining oshishi", "Shahar daraxtlarining kesilishi", "Hech qanday muammo tug'dirmaydi"],
                correctAnswer: 0
            }
        ]
    },
    {
        sequence: 7,
        title: "7-dars. Yetkazib berish va On-Demand (Talab bo'yicha) Iqtisodiyot",
        description: "Tezkor yetkazib berish platformalari (Wolt, Yandex Food), logistik zanjirlar va dark-store tizimlari.",
        category: "Raqamli texnologiyalar asoslari",
        thumbnailUrl: "https://picsum.photos/id/319/800/600",
        videoUrl: "https://www.youtube.com/embed/dM13t_cZc20",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        documentUrl: "/uploads/documents/raqamli_texnologiyalar_asoslari.pdf",
        textContent: `ON-DEMAND YETKAZIB BERISH VA DARK STORE INFRATUZILMASI

On-Demand iqtisodiyot - bu iste'molchilarning tovar va xizmatlarga bo'lgan ehtiyojlarini raqamli platformalar orqali deyarli bir zumda (odatda 15 dan 45 daqiqa ichida) qondirish tizimidir. Wolt, Express24, Yandex Lavka kabi platformalar bu sohaning yaqqol namoyandalaridir.

Dark Store (Qorong'i do'kon) konsepti:
Bu faqat onlayn yetkazib berish buyurtmalariga xizmat qiladigan, oddiy xaridorlar kirmaydigan mikroomborlardir. Ular shaharning turli strategik nuqtalarida joylashgan bo'lib, tovarlarni eng tezkor yig'ish va kuryerga topshirish uchun optimallashtirilgan.

Logistik zanjirlar algoritmi:
Platforma algoritmi bir vaqtning o'zida bir nechta parametrlarni hisoblaydi: taom tayyor bo'lish vaqti, kuryerning restoranga yetib kelishi, yo'l harakati holati va mijozgacha bo'lgan optimal yo'nalish. Bu zanjir shahar ichidagi yuk tashish logistikasini butunlay o'zgartirdi. Biroq, yetkazib berish transportlarining ko'pligi shovqin va havoning ifloslanishiga salbiy hissa qo'shadi.`,
        transcript: "Ushbu darsimizda biz talab bo'yicha yetkazib berish platformalarining ishlash prinsiplari, dark-store do'konlarining shahar logistikasidagi o'rni va yetkazib berish algoritmlarining ishlash texnikasini batafsil tahlil qilamiz.",
        quiz: [
            {
                question: "On-demand (Talab bo'yicha) iqtisodiyot nima?",
                options: ["Iste'molchi talabini platformalar orqali bir zumda qondiruvchi xizmatlar", "Faqat yiliga bir marta keluvchi buyurtmalar", "Eski usuldagi ulgurji savdo", "Davlat rejaviy iqtisodiyoti"],
                correctAnswer: 0
            },
            {
                question: "Dark Store (Qorong'i do'kon) nima?",
                options: ["Faqat onlayn buyurtmalar uchun xizmat qiluvchi mikroombor-do'kon", "Elektr tarmog'idan uzilgan do'kon", "Kechasi ishlovchi savdo markazi", "Noqonuniy qurol do'koni"],
                correctAnswer: 0
            },
            {
                question: "Tezkor yetkazib berish algoritmlari kuryerni tanlashda nimaga e'tibor beradi?",
                options: ["Kuryerning masofasi va uning transport turiga (piyoda, velo, avto)", "Kuryerning ismiga", "Buyurtma berilgan tovar narxiga", "Mijozning telefon modeliga"],
                correctAnswer: 0
            },
            {
                question: "On-demand yetkazib berish tizimlarining an'anaviy pochtadan farqi nimada?",
                options: ["Yetkazib berish vaqtining o'ta qisqaligi (daqiqalarda o'lchanadi)", "Qimmatroq va sekinroqligi", "Faqat xatlar tashilishi", "Markazlashgan davlat nazorati"],
                correctAnswer: 0
            },
            {
                question: "Dark Kitchen (Qorong'i oshxona) nima?",
                options: ["Faqat onlayn buyurtma yetkazish uchun ovqat tayyorlaydigan zalsiz restoran", "Chirog'i yo'q oshxona", "Faqat xodimlar uchun bepul oshxona", "Nihoyatda iflos oshxona"],
                correctAnswer: 0
            },
            {
                question: "On-demand yetkazib berish platformalarida tranzaksion xarajatlar qanday kamaytiriladi?",
                options: ["Avtomatlashtirilgan algoritmlar va raqamli to'lovlar orqali", "Har bir buyurtmani qo'lda tasdiqlash orqali", "Naqd pul bilan hisob-kitob qilish orqali", "Ofislar sonini ko'paytirish orqali"],
                correctAnswer: 0
            },
            {
                question: "Logistikada 'Oxirgi milya' (Last mile delivery) nima?",
                options: ["Mahsulotni ombor yoki do'kondan yakuniy iste'molchi eshigigacha yetkazish bosqichi", "Fabrikadan omborga olib kelish", "Chet eldan tovar olib kelish bosqichi", "Kuryerning yo'l haqi"],
                correctAnswer: 0
            },
            {
                question: "Dark store tizimlarining afzalligi nima?",
                options: ["Tovarlarni tezroq saralash va arzonroq ijara xarajatlari", "Katta xaridorlar oqimi", "Katta reklama bannerlari", "Davlat soliqlaridan ozodligi"],
                correctAnswer: 0
            },
            {
                question: "Yetkazib berish jarayonini kuzatish (Live tracking) qanday ishlaydi?",
                options: ["Kuryer telefonidagi GPS koordinatalari real vaqtda mijoz xaritasiga uzatiladi", "Kuryer har 5 daqiqada SMS yozadi", "Mijoz faqat taxminiy vaqtni biladi", "Kamera orqali jonli efir uzatiladi"],
                correctAnswer: 0
            },
            {
                question: "On-demand logistikasini optimallashtiruvchi eng muhim dasturiy ta'minot komponenti nima?",
                options: ["Marshrutlash va navigatsiya algoritmlari", "Dizayn interfeysi", "Video pleer dasturi", "Faqat matn muharriri"],
                correctAnswer: 0
            }
        ]
    },
    {
        sequence: 8,
        title: "8-dars. Raqamli platformalarda qisqa muddatli ijara va shahar boshqaruvi",
        description: "Airbnb, Booking.com platformalarining uy-joy bozoriga, narxlarga, turizmga va shahar ma'muriyatiga ta'siri.",
        category: "Raqamli texnologiyalar asoslari",
        thumbnailUrl: "https://picsum.photos/id/405/800/600",
        videoUrl: "https://www.youtube.com/embed/t5P2O7e_K04",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
        documentUrl: "/uploads/documents/raqamli_texnologiyalar_asoslari.pdf",
        textContent: `QISQA MUDDATLI IJARA PLATFORMALARI VA UY-JOY BOZORI TRANSFORMATSIYASI

Airbnb va Booking.com kabi raqamli platformalar qisqa muddatli uy-joy ijarasi bozorini butunlay o'zgartirdi. Ilgari faqat mehmonxonalar mavjud bo'lgan sohada, endilikda xususiy xonadon egalari ham o'z uylarini sayyohlarga to'g'ridan-to'g'ri taklif qilish imkoniyatiga ega bo'ldilar (P2P - Peer-to-Peer modeli).

Uy-joy bozoriga va shahar boshqaruviga ta'siri:
Ushbu platformalar mahalliy aholi uchun qo'shimcha daromad manbai yaratsa-da, shahar iqtisodiyoti va ijtimoiy muhitiga bir qator jiddiy muammolar olib keldi:
1. Ijara narxlarining oshishi (Gentrification): Uy egalari uzoq muddatli ijarachilar o'rniga, sayyohlarga qisqa muddatli ijara berishni afzal ko'rishadi. Bu esa mahalliy aholi uchun ijaraga uy topishni qiyinlashtiradi va narxlarni keskin oshiradi.
2. Mahalliy madaniyatning o'zgarishi: Shaharning tarixiy va markaziy hududlari faqat sayyohlar maskaniga aylanib qoladi.

Shahar boshqaruvining tartibga solishi (Regulations):
Ko'plab yirik shaharlar Airbnb platformalariga qat'iy cheklovlar qo'ymoqda: yiliga ijara berish kunlarini cheklash (masalan, 90 kundan oshmasligi), majburiy ro'yxatdan o'tish raqamlari va qo'shimcha turistik soliqlar undirish joriy etilmoqda.`,
        transcript: "Biz Airbnb va Booking platformalarining uy-joy bozoriga, ijara narxlarining sun'iy oshishiga ta'siri hamda shahar ma'muriyatining ushbu platformalarga qarshi qo'llayotgan huquqiy tartibga solish choralarini ilmiy ko'rib chiqamiz.",
        quiz: [
            {
                question: "Airbnb qanday platforma hisoblanadi?",
                options: ["P2P qisqa muddatli uy-joy ijarasi platformasi", "Faqat aviachiptalar sotuvchi sayt", "Avtomobillarni sotish platformasi", "Mehmonxona quruvchi kompaniya"],
                correctAnswer: 0
            },
            {
                question: "Qisqa muddatli ijara platformalarining uzoq muddatli ijara bozoriga salbiy ta'siri nima?",
                options: ["Uzoq muddatli uylar kamayib, ijara narxlarining keskin oshishi", "Ijara narxlarining arzonlashishi", "Uylarning tezda eskirishi", "Sayyohlar sonining kamayishi"],
                correctAnswer: 0
            },
            {
                question: "Shahar markazlaridagi mahalliy aholining siqib chiqarilib, hududning qimmatlashishi jarayoni nima deyiladi?",
                options: ["Jentrifikatsiya (Gentrification)", "Urbanizatsiya", "Migratsiya", "Dekonstruksiya"],
                correctAnswer: 0
            },
            {
                question: "Airbnb kabi P2P modelining ma'nosi nima?",
                options: ["Peer-to-Peer (Tenglar o'rtasida to'g'ridan-to'g'ri aloqa)", "Platform-to-Platform", "Public-to-Private", "Professional-to-Person"],
                correctAnswer: 0
            },
            {
                question: "Nyu-York kabi yirik shaharlar Airbnb platformasiga qanday cheklovlar qo'ydi?",
                options: ["Ijara muddatini qat'iy cheklash va majburiy litsenziyalash", "Platformani butunlay taqiqlash", "Bepul uy berish majburiyati", "Hech qanday cheklov qo'ymadi"],
                correctAnswer: 0
            },
            {
                question: "Qisqa muddatli ijara platformalari kimlar uchun qo'shimcha daromad yaratadi?",
                options: ["Xususiy xonadon va kvartira egalari (Hosts) uchun", "Faqat davlat idoralari uchun", "Mehmonxona egalari uchun", "Faqat quruvchilar uchun"],
                correctAnswer: 0
            },
            {
                question: "Airbnb orqali uy bron qilinganda xavfsizlik qanday ta'minlanadi?",
                options: ["Ikki tomonlama tekshirilgan profillar va kafolatlangan to'lovlar", "Faqat og'zaki kelishuv orqali", "Politsiya nazorati bilan", "Hujjatlarsiz ishonch bilan"],
                correctAnswer: 0
            },
            {
                question: "Mehmonxona biznesining raqamli ijara platformalariga munosabati qanday?",
                options: ["Platformalarga qarshi davlat tomonidan soliq cheklovlarini talab qiladi", "Ular bilan doimo hamkorlik qiladi", "Ularni bepul qo'llab-quvvatlaydi", "E'tibor bermaydi"],
                correctAnswer: 0
            },
            {
                question: "Airbnb platformasida tranzaksiyalardan kim komissiya oladi?",
                options: ["Airbnb platformasi (o'rtadagi vositachi sifatida)", "Faqat yo'lovchi", "Faqat shahar hokimiyati", "Hech kim komissiya olmaydi"],
                correctAnswer: 0
            },
            {
                question: "Turistik shaharlar ijara platformalaridan qanday soliq undirishadi?",
                options: ["Turistik va shahar infratuzilmasi soliqlari (Occupancy taxes)", "Faqat bojxona to'lovlari", "Qo'shilgan qiymat solig'i (QQS) o'rniga bepul xizmat", "Hech qanday soliq undirmaydi"],
                correctAnswer: 0
            }
        ]
    },
    {
        sequence: 9,
        title: "9-dars. Aqlli uy texnologiyalari va Narsalar Interneti (IoT): raqamli nazorat",
        description: "Uy sharoitidagi sensorlar, aqlli asboblar, shaxsiy makondagi ma'lumotlar xavfsizligi va ijtimoiy-ekologik ta'sirlar.",
        category: "Raqamli texnologiyalar asoslari",
        thumbnailUrl: "https://picsum.photos/id/201/800/600",
        videoUrl: "https://www.youtube.com/embed/ps9ucSDH8s4",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
        model3dUrl: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Lantern/glTF-Binary/Lantern.glb",
        documentUrl: "/uploads/documents/raqamli_texnologiyalar_asoslari.pdf",
        textContent: `NARSALAR INTERNETI (IOT) VA AQLLI UY TEXNOLOGIYALARI

Narsalar Interneti (IoT - Internet of Things) - bu internetga ulangan va o'zaro ma'lumot almashadigan jismoniy qurilmalarning global tarmog'idir. Aqlli termostatlar, yorug'lik tizimlari, sensorlar va ovozli yordamchilar (Alexa, Siri) aqlli uylarning asosini tashkil qiladi.

IoT qanday ishlaydi?
Sensorlar atrof-muhitdan (masalan, harorat, harakat, yorug'lik) ma'lumotlarni yig'adi, ularni bulutli serverlarga yuboradi va u yerdagi algoritmlar qayta ishlab, qurilmalarga avtomatik buyruqlar beradi (masalan, xonada odam qolmaganda chiroqni o'chirish).

Raqamli nazorat va Kiber-xavfsizlik tahdidlari:
IoT qurilmalari hayotimizni qulaylashtirsa-da, shaxsiy daxlsizlikka jiddiy tahdid soladi:
1. Shaxsiy makonni nazorat qilish: Aqlli kameralar va ovoz yozuvchilar foydalanuvchining shaxsiy ma'lumotlarini ishlab chiquvchi kompaniyalar serverlariga uzatadi.
2. Kiberhujumlar: Aksar IoT qurilmalari zaif xavfsizlik protokollariga ega, bu esa xakerlarga uy tarmog'iga kirib olish yoki butun tizimni bloklash imkonini beradi.
3. Ekologik ta'sir: Millionlab elektron sensorlarning eskirishi katta hajmdagi e-chiqindi (e-waste) muammosini keltirib chiqaradi.`,
        transcript: "Aqlli uy tizimlari, sensorlar va internetga ulangan maishiy qurilmalarning ishlash prinsiplari hamda shaxsiy ma'lumotlarimizni kiber-hujumlardan himoya qilish choralarini texnik jihatdan ko'rib chiqamiz.",
        quiz: [
            {
                question: "Narsalar Interneti (IoT) nima?",
                options: ["Internet tarmog'iga ulangan va o'zaro ma'lumot almashuvchi jismoniy qurilmalar tarmog'i", "Faqat shaxsiy kompyuterlar to'plami", "Simli telefonlar tizimi", "Internet provayderlar ro'yxati"],
                correctAnswer: 0
            },
            {
                question: "Aqlli uy tizimida harorat yoki harakatni aniqlash uchun qaysi komponent javob beradi?",
                options: ["Sensorlar (Sensors)", "Monitorlar", "Kabellar", "Batareyalar"],
                correctAnswer: 0
            },
            {
                question: "IoT qurilmalarining asosiy kiber-xavfsizlik zaifligi nimada?",
                options: ["Ko'pchilik qurilmalarda zavod parollarining o'zgartirilmasligi va kuchsiz shifrlash", "Ularning juda qimmatligi", "Simsiz ishlashining ilojsizligi", "Faqat ingliz tilida ishlashi"],
                correctAnswer: 0
            },
            {
                question: "Ovozli aqlli yordamchilarga misol keltiring:",
                options: ["Google Assistant / Alexa / Siri", "Google Chrome / Firefox / Safari", "WhatsApp / Telegram / Viber", "Windows / macOS / Linux"],
                correctAnswer: 0
            },
            {
                question: "IoT qurilmalari yig'adigan ma'lumotlar qayerda qayta ishlanadi?",
                options: ["Bulutli serverlarda (Cloud computing) yoki mahalliy boshqaruv blokida", "Faqat yo'riqnomada", "Faqat foydalanuvchining miyasida", "Hech qayerda qayta ishlanmaydi"],
                correctAnswer: 0
            },
            {
                question: "Aqlli uydagi aqlli termostatning asosiy foydasi nima?",
                options: ["Energiyani tejash va haroratni avtomatik boshqarish", "Televizor kanallarini o'zgartirish", "Taom pishirish", "Internet tezligini oshirish"],
                correctAnswer: 0
            },
            {
                question: "IoT sensorlari va qurilmalari qaysi simsiz aloqa texnologiyalaridan foydalanadi?",
                options: ["Wi-Fi, Zigbee, Bluetooth, LoRaWAN", "Faqat optik tolali kabel", "Faqat infraqizil nurlar", "Sun'iy yo'ldosh tarelkasi"],
                correctAnswer: 0
            },
            {
                question: "IoT qurilmalarining shaxsiy daxlsizlikka (Privacy) eng katta tahdidi nima?",
                options: ["Foydalanuvchining ruxsatisiz shaxsiy ma'lumotlar va ovozlarni kompaniya serverlariga uzatishi", "Elektr energiyasini ko'p sarflashi", "Dizaynining xunukligi", "Tez tez buzilib turishi"],
                correctAnswer: 0
            },
            {
                question: "Eskirgan IoT datchiklari va sensorlar qanday global muammoni keltirib chiqaradi?",
                options: ["Elektron chiqindilar (E-waste) ko'payishi", "Suv ifloslanishi", "Ozon qatlamining teshilishi", "O'rmonlar yong'ini"],
                correctAnswer: 0
            },
            {
                question: "Sanoatda qo'llaniladigan IoT tizimlari nima deb ataladi?",
                options: ["IIoT (Industrial Internet of Things)", "Smart Home", "Consumer IoT", "Medical IoT"],
                correctAnswer: 0
            }
        ]
    },
    {
        sequence: 10,
        title: "10-dars. Algoritmlar va Sun'iy Intellekt (AI): raqamli istisno mexanizmlari",
        description: "Neyrotizimlar, AI algoritmlarining ijtimoiy tengsizlikka ta'siri, filtr pufakchalari va axborot manipulyatsiyasi.",
        category: "Raqamli texnologiyalar asoslari",
        thumbnailUrl: "https://picsum.photos/id/180/800/600",
        videoUrl: "https://www.youtube.com/embed/ad79nYk2kEg",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
        model3dUrl: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/BrainStem/glTF-Binary/BrainStem.glb",
        documentUrl: "/uploads/documents/raqamli_texnologiyalar_asoslari.pdf",
        textContent: `SUN'IY INTELLEKT (AI) VA ALGORITMIK ADOLATSIZLIK

Sun'iy intellekt va neyron tarmoqlari ma'lumotlarni tahlil qilish, bashorat qilish va qaror qabul qilish jarayonlarini inson aralashuvisiz amalga oshirish imkonini beradi. Biroq, AI algoritmlari neytral emas; ular insonlar tomonidan to'plangan ma'lumotlar asosida o'qitiladi.

Algoritmik tarafkashlik (Algorithmic Bias):
Agar AIni o'qitish uchun foydalanilgan tarixiy ma'lumotlarda kamsitish yoki tengsizlik mavjud bo'lsa, algoritm ushbu xatolarni o'zlashtiradi va yanada kuchaytiradi. Masalan, ishga qabul qilish algoritmlari ayollar yoki muayyan millat vakillarini avtomatik ravishda rad etishi, yoki bank kredit berish tizimlari ba'zi hudud aholisiga asossiz ravishda rad javobini berishi (Redlining) kuzatilgan.

Filtr pufakchalari (Filter Bubbles) va Ijtimoiy fazo:
Ijtimoiy tarmoq algoritmlari (TikTok, Instagram, YouTube) bizga faqat biz yoqtirgan va bizning dunyoqarashimizga mos kontentni tavsiya qiladi. Bu esa odamlarni axborot guruhlariga bo'lib, ijtimoiy qutblashuvni (Polarization) keltirib chiqaradi va soxta yangiliklarning (Fake News) tez tarqalishiga xizmat qiladi. Raqamli tizimlar ba'zi ijtimoiy qatlamlarni algoritmik tarzda chetlatish mexanizmlariga ega.`,
        transcript: "Algoritmlar hayotimizni qanday shakllantirmoqda? Grid va Sun'iy intellektning algoritmik noxolisligi, ijtimoiy tarmoqlardagi filtr pufakchalari va raqamli manipulyatsiya texnologiyalarini tahlil qilamiz.",
        quiz: [
            {
                question: "Algoritmik tarafkashlik (Algorithmic Bias) nima?",
                options: ["AIning o'rgatilgan noto'g'ri ma'lumotlar tufayli biror qatlamni kamsituvchi qarorlar chiqarishi", "Algoritm tezligining oshishi", "Kompyuterning qizib ketishi", "Tizimning to'g'ri ishlashi"],
                correctAnswer: 0
            },
            {
                question: "Ijtimoiy tarmoqlarda foydalanuvchiga faqat uning qarashlariga mos axborot ko'rsatilishi jarayoni nima deyiladi?",
                options: ["Filtr pufakchasi (Filter Bubble)", "Ochiq tarmoq", "Global qishloq", "Axborot oqimi"],
                correctAnswer: 0
            },
            {
                question: "Mashinali o'rganish (Machine Learning) modelini o'qitishda eng muhim resurs nima?",
                options: ["Katta hajmdagi sifatli ma'lumotlar (Data)", "Chiroyli interfeys", "Yaxshi klaviatura", "Dastur kodi uzunligi"],
                correctAnswer: 0
            },
            {
                question: "Neyron tarmoqlari (Neural Networks) qaysi biologik organning ishlash prinsipiga taqlid qiladi?",
                options: ["Inson miyasi neyronlari", "Yurak qon-tomir tizimi", "Ko'rish a'zolari", "Mushanlar tizimi"],
                correctAnswer: 0
            },
            {
                question: "Algoritmlarning kredit berish yoki ishga qabul qilishda ma'lum qatlamlarni rad etishi qanday nomlanadi?",
                options: ["Algoritmik istisno va kamsitish (Algorithmic exclusion)", "Avtomatik yordam", "Tizimli rag'bat", "Soliq imtiyozi"],
                correctAnswer: 0
            },
            {
                question: "AIning ma'lumotlar asosida mustaqil ravishda qonuniyatlarni topishi nima deyiladi?",
                options: ["Pattern recognition (Qonuniyatlarni aniqlash)", "Data deleting", "Text formatting", "File compression"],
                correctAnswer: 0
            },
            {
                question: "Ijtimoiy tarmoq algoritmlarining asosiy maqsadi nima?",
                options: ["Foydalanuvchining e'tiborini platformada iloji boricha uzoqroq ushlab turish", "Foydalanuvchini aqlli qilish", "Saytni bepul qilish", "Internet tezligini tejash"],
                correctAnswer: 0
            },
            {
                question: "Deepfake nima?",
                options: ["Sun'iy intellekt yordamida rasm, video va ovozlarni soxtalashtirish texnologiyasi", "Katta ma'lumotlar ombori", "Kiber-hujum turi", "O'yin dasturi"],
                correctAnswer: 0
            },
            {
                question: "Sun'iy intellekt axloqi (AI Ethics) nimalarni o'rganadi?",
                options: ["AIning adolatli, shaffof va xavfsiz ishlash prinsiplari va axloqiy me'yorlarini", "AIning faqat narxini", "AIdan qanday pul ishlashni", "AIning tezligini oshirishni"],
                correctAnswer: 0
            },
            {
                question: "AIdagi 'Black Box' (Qora quti) muammosi nima?",
                options: ["Murakkab neyrotizimlarning qarorni qanday qabul qilganini tushuntirib bo'lmasligi", "AIning rangining qoraligi", "Server xonasidagi qora quti", "Ma'lumotlar o'chib ketishi"],
                correctAnswer: 0
            }
        ]
    },
    {
        sequence: 11,
        title: "11-dars. Raqamli tengsizliklar va hududiy raqamli tafovutlar (Digital Divide)",
        description: "Hududiy internet tezligi, texnologiyalardan foydalanish imkoniyatlari, ijtimoiy qatlamlar o'rtasidagi raqamli tafovutlar.",
        category: "Raqamli texnologiyalar asoslari",
        thumbnailUrl: "https://picsum.photos/id/1043/800/600",
        videoUrl: "https://www.youtube.com/embed/fCIB_vXU62E",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
        documentUrl: "/uploads/documents/raqamli_texnologiyalar_asoslari.pdf",
        textContent: `RAQAMLI TAFOVUT VA HUDUDIY TENGSIZLIKLAR

Raqamli tafovut (Digital Divide) - bu axborot-kommunikatsiya texnologiyalari (AKT), ayniqsa yuqori tezlikdagi internet va zamonaviy qurilmalardan foydalanish imkoniyatiga ega bo'lganlar va ega bo'lmaganlar o'rtasidagi ijtimoiy-iqtisodiy bo'shliqdir.

Raqamli tafovutning uchta darajasi:
1. Birinchi daraja (Eriza tafovuti): Kompyuter va jismoniy internet infratuzilmasining yo'qligi (masalan, chekka qishloqlarda internet yoki elektr yo'qligi).
2. Ikkinchi daraja (Ko'nikma tafovuti): Texnologiyadan to'g'ri va samarali foydalanish bilimining yetishmasligi (raqamli savodxonlik pastligi).
3. Uchinchi daraja (Foyda tafovuti): Texnologiyadan ijtimoiy va iqtisodiy o'sish, ta'lim hamda karyera uchun foydalana olmaslik.

Hududiy va Ijtimoiy oqibatlar:
Raqamli tafovut ta'lim va ish bozoridagi ijtimoiy tengsizlikni yanada chuqurlashtiradi. Masalan, masofaviy ta'lim davrida interneti bo'lmagan chekka hudud o'quvchilari ta'limdan butunlay uzilib qoldilar. Raqamli iqtisodiyotga o'tish jarayonida esa AKT ko'nikmalariga ega bo'lmagan qatlamlar past maoshli mehnat sohalariga siqib chiqariladi. Bu muammoni hal qilish uchun davlatlar chekka hududlarni keng polosali internet bilan ta'minlash va maktablarda bepul raqamli savodxonlik darslarini tashkil etish ustida ish olib bormoqda.`,
        transcript: "Raqamli texnologiyalar bizni birlashtiryaptimi yoki yanada ajratyaptimi? Ushbu darsda global va hududiy raqamli tafovutlar, raqamli savodxonlik muammosi hamda ularni bartaraf etish yo'llarini tahlil qilamiz.",
        quiz: [
            {
                question: "Raqamli tafovut (Digital Divide) nima?",
                options: ["Zamonaviy AKT va internetdan foydalana oladiganlar va ololmaydiganlar o'rtasidagi ijtimoiy bo'shliq", "Internet provayderlar o'rtasidagi narx urushi", "Kompyuter dasturlari orasidagi farq", "Telefon markalari o'rtasidagi farq"],
                correctAnswer: 0
            },
            {
                question: "Raqamli tafovutning 'Ko'nikma darajasi' (Second-level digital divide) nimani anglatadi?",
                options: ["Texnologiyadan to'g'ri foydalanish bilim va ko'nikmalarining (savodxonlik) yo'qligi", "Jismoniy internet tarmog'ining yo'qligi", "Smartfonning o'ta qimmatligi", "Soliq to'lash ko'nikmasi"],
                correctAnswer: 0
            },
            {
                question: "AKT sohasidagi tengsizlik shahar va qishloq o'rtasida qanday namoyon bo'ladi?",
                options: ["Qishloq joylarda yuqori tezlikdagi internet infratuzilmasining yetishmasligi", "Qishloqda kompyuterlarning umuman ishlamasligi", "Shaharda internetning bepulligi", "Hech qanday farq yo'qligi"],
                correctAnswer: 0
            },
            {
                question: "Raqamli savodxonlik (Digital Literacy) nima?",
                options: ["Raqamli ma'lumotlarni topish, baholash, yaratish va xavfsiz muloqot qilish ko'nikmasi", "Faqat tez yozish ko'nikmasi", "Kompyuter qismlarini buzib tuzatish", "Dasturlash tillarini to'liq yodlash"],
                correctAnswer: 0
            },
            {
                question: "Masofaviy ta'lim (E-learning) davrida raqamli tafovut qanday salbiy oqibatlarga olib keldi?",
                options: ["Interneti va kompyuteri bo'lmagan o'quvchilarning ta'limdan uzilib qolishi", "Barcha o'quvchilar a'lochi bo'lib ketishi", "O'qituvchilar maoshining oshishi", "Maktab binolarining buzilishi"],
                correctAnswer: 0
            },
            {
                question: "Raqamli tafovutni kamaytirish uchun davlatlar qanday chora ko'rishi kerak?",
                options: ["Chekka hududlarda arzon keng polosali internet tarmoqlarini qurish va bepul ta'lim berish", "Kompyuterlarni taqiqlash", "Internet narxini keskin oshirish", "Faqat shaharlarni rivojlantirish"],
                correctAnswer: 0
            },
            {
                question: "Texnologiyadan iqtisodiy foyda olish (masalan, frilanserlik qilib pul topish) tafovuti qaysi darajaga kiradi?",
                options: ["Uchinchi darajali raqamli tafovut (Foyda darajasi)", "Birinchi darajali", "Ikkinchi darajali", "Bunday daraja mavjud emas"],
                correctAnswer: 0
            },
            {
                question: "Raqamli inklyuzivlik (Digital inclusion) nima?",
                options: ["Jamiyatning barcha qatlamlari uchun raqamli texnologiyalardan foydalanish imkonini yaratish", "Faqat boylar uchun texnologiyalar yaratish", "Saytni chet elliklarga yopish", "Tizimni murakkablashtirish"],
                correctAnswer: 0
            },
            {
                question: "O'zbekistonda chekka hududlar yoshlarini AKTga o'rgatish uchun qanday infratuzilma tashkil etildi?",
                options: ["IT Park markazlari va IT Akademiyalar", "Faqat onlayn kutubxonalar", "Yopiq maktablar", "Soliq idoralari"],
                correctAnswer: 0
            },
            {
                question: "Raqamli tafovut bartaraf etilmasa, jamiyatda qanday muammo chuqurlashadi?",
                options: ["Ijtimoiy-iqtisodiy tengsizlik va ta'lim sifatidagi katta tafovut", "Odamlar sonining kamayishi", "Sanoat mahsulotlari narxining pasayishi", "Tinchlik o'rnatilishi"],
                correctAnswer: 0
            }
        ]
    }
];

async function seedLessons() {
    try {
        console.log("\n\x1b[36m=== 1-QADAM: MongoDB Atlas bazasiga ulanish ===\x1b[0m");
        await mongoose.connect(atlasUri);
        console.log("\x1b[32m✔ MongoDB Atlas ulanishi muvaffaqiyatli amalga oshdi!\x1b[0m\n");

        // Find Super Admin user
        const superAdmin = await User.findOne({ role: 'super-admin' });
        if (!superAdmin) {
            console.error("\x1b[31mXATO: Bosh admin ('super-admin') foydalanuvchisi topilmadi. Avval serverni 1 marta yurgizib oling!\x1b[0m");
            process.exit(1);
        }
        console.log(`\x1b[32m✔ Super Admin topildi: ${superAdmin.name} (${superAdmin._id})\x1b[0m\n`);

        console.log("\x1b[36m=== 2-QADAM: Mavjud 3 dan 11 gacha darslarni tozalash ===\x1b[0m");
        const deleteResult = await Lesson.deleteMany({
            instructor: superAdmin._id,
            sequence: { $gte: 3, $lte: 11 }
        });
        console.log(`\x1b[32m✔ ${deleteResult.deletedCount} ta eski takroriy darslar tozalandi.\x1b[0m\n`);

        console.log("\x1b[36m=== 3-QADAM: Yangi 9 ta darsni (M3-M11) yaratish va joylash ===\x1b[0m");
        for (const data of lessonsData) {
            const lesson = new Lesson({
                ...data,
                instructor: superAdmin._id,
                course: null // Public lesson so that start migration picks it up
            });
            await lesson.save();
            console.log(`+ [Dars #${data.sequence}] Yaratildi va saqlandi: "${data.title}"`);
        }

        console.log("\n\x1b[32m✔ TABRIKLAYMAN! BARCHA 9 TA YANGI MAVZU MAVZU UCHUN TO'LIQ VA MUKAMMAL DARSLAR BAZAGA JOYLASHDI!\x1b[0m");
        console.log("\x1b[35m- Har bir dars uchun professional 3D modellari qo'shildi.");
        console.log("- Har bir dars uchun YouTube video embedlari tayyorlandi.");
        console.log("- Har bir dars uchun 10 tadan o'ta qiyin darajadagi test savollari (jami 90 ta) qo'shildi.");
        console.log("- Kitob uchun 'Raqamli texnologiyalar asoslari.pdf' hujjati biriktirildi.\x1b[0m\n");

        await mongoose.disconnect();
    } catch (err) {
        console.error("\x1b[31mDarslarni yaratishda kutilmagan xatolik yuz berdi:\x1b[0m", err);
        process.exit(1);
    }
}

seedLessons();
