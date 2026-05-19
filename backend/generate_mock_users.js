const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dns = require('dns');

// Force Node.js to use Google DNS to bypass potential ISP blocks
dns.setServers(['8.8.8.8', '8.8.4.4']);

const User = require('./models/User');

const atlasUri = process.argv[2];

if (!atlasUri) {
    console.error("\x1b[31mXATO: Iltimos, MongoDB Atlas URL-ni argument sifatida yuboring!\x1b[0m");
    console.log("Misol uchun:");
    console.log('node generate_mock_users.js "mongodb+srv://admin:parol@cluster.mongodb.net/lms-db"');
    process.exit(1);
}

const maleNames = [
    'Lazizbek', 'Sardor', 'Shaxzod', 'Jasur', 'Bobur', 'Otabek', 'Javoxir', 'Elyor', 'Sherzod', 
    'Davron', 'Dilshod', 'Sanjar', 'Umid', 'Anvar', 'Bekzod', 'Ruslan', 'Farrux', 'Nodir', 
    'Jamshid', 'Asadbek', 'Abbos', 'Ulugbek', 'Rustam', 'Alisher', 'Temur', 'Mirjalol', 
    'Jahongir', 'Doston', 'Zafar', 'Sobir', 'Akmal', 'Bahodir', 'Firdavs', 'Ilhom', 'Kamron', 
    'Mansur', 'Muzaffar', 'Olim', 'Ravshan', 'Sirojiddin', 'Tohir', 'Vohid', 'Xurshid', 
    'Yoqub', 'Zohid', 'Azizbek', 'Doniyor', 'Islom', 'Oybek', 'Shuhrat'
];

const femaleNames = [
    'Sarvinoz', 'Madina', 'Laylo', 'Shahzoda', 'Dilnoza', 'Nigora', 'Sevara', 'Gulnoza', 
    'Kamola', 'Rayhon', 'Lola', 'Nilufar', 'Malika', 'Durdona', 'Charos', 'Feruza', 'Guzal', 
    'Nozima', 'Odina', 'Zaynab', 'Dildora', 'Robiya', 'Asila', 'Mohira', 'Dilrabo', 'Shirin', 
    'Zilola', 'Aziza', 'Barno', 'Diana', 'Ezoza', 'Guli', 'Iroda', 'Jamilha', 'Kibriyo', 
    'Munisa', 'Nafisa', 'Oydin', 'Parvina', 'Ruxshona', 'Sabina', 'Sitora', 'Umida', 
    'Vasila', 'Xurshida', 'Yulduz', 'Zebiniso', 'Ziyoda', 'Zuhra', 'Zarina'
];

const surnames = [
    'Narzullayev', 'Karimov', 'Aliyev', 'Toshpulatov', 'Umarov', 'Solihov', 'Rahimov', 
    'Abdullayev', 'Usmonov', 'Hoshimov', 'Qodirov', 'Yuldashev', 'Sultanov', 'Gofurov', 
    'Sodiqov', 'Mamatov', 'Tursunov', 'Safarov', 'Mahmudov', 'Jorayev', 'Xalilov', 'Rustamov', 
    'Ismoilov', 'Vahobov', 'Fayzullayev', 'Abduqodirov', 'Bozorov', 'Choriyev', 'Davronov', 
    'Ergashev', 'Ganiyev', 'Hamidov', 'Ibragimov', 'Jamilov', 'Kamolov', 'Madaminov', 
    'Nazarov', 'Obidov', 'Qayumov', 'Rasulov', 'Samadov', 'Tojiyev', 'Ubaydullayev', 
    'Xasanov', 'Yoqubov', 'Zokirov', 'Abdurahmonov', 'Bekmurodov', 'Eshmurodov', 'Murodov', 
    'Xudoyberdiyev'
];

function cleanEmailString(str) {
    return str
        .toLowerCase()
        .replace(/o['`’‘]/g, 'o')
        .replace(/g['`’‘]/g, 'g')
        .replace(/[^a-z0-9]/g, '');
}

async function generateUsers() {
    try {
        console.log("\n\x1b[36m=== 1-QADAM: MongoDB Atlas bazasiga ulanish ===\x1b[0m");
        await mongoose.connect(atlasUri);
        console.log("\x1b[32m✔ MongoDB Atlas ulanishi muvaffaqiyatli amalga oshdi!\x1b[0m\n");

        // Hash default passwords for efficiency
        console.log("Sinf parollarini shifrlash boshlandi...");
        const studentSalt = await bcrypt.genSalt(10);
        const hashedStudentPassword = await bcrypt.hash("student123", studentSalt);

        const teacherSalt = await bcrypt.genSalt(10);
        const hashedTeacherPassword = await bcrypt.hash("teacher123", teacherSalt);
        console.log("\x1b[32m✔ Parollar muvaffaqiyatli shifrlandi.\x1b[0m\n");

        let studentsCount = 0;
        let teachersCount = 0;

        console.log("\x1b[36m=== 2-QADAM: 7 ta o'qituvchini yaratish ===\x1b[0m");
        for (let i = 1; i <= 7; i++) {
            const isMale = Math.random() > 0.5;
            const firstName = isMale 
                ? maleNames[Math.floor(Math.random() * maleNames.length)] 
                : femaleNames[Math.floor(Math.random() * femaleNames.length)];
            
            let baseSurname = surnames[Math.floor(Math.random() * surnames.length)];
            if (!isMale) {
                if (baseSurname.endsWith('yev')) baseSurname = baseSurname.substring(0, baseSurname.length - 3) + 'yeva';
                else if (baseSurname.endsWith('ov')) baseSurname = baseSurname.substring(0, baseSurname.length - 2) + 'ova';
            }

            const fullName = `${firstName} ${baseSurname}`;
            const email = `${cleanEmailString(firstName)}.${cleanEmailString(baseSurname)}${Math.floor(Math.random() * 100)}@gmail.com`;

            // Check if email already exists
            const existingUser = await User.findOne({ email });
            if (!existingUser) {
                const user = new User({
                    name: fullName,
                    email: email,
                    password: hashedTeacherPassword,
                    role: 'teacher'
                });
                await user.save();
                teachersCount++;
                console.log(`[Teacher ${teachersCount}/7] Yaratildi: ${fullName} (${email})`);
            } else {
                i--; // Retry
            }
        }

        console.log("\n\x1b[36m=== 3-QADAM: 85 ta o'quvchini yaratish ===\x1b[0m");
        for (let i = 1; i <= 85; i++) {
            const isMale = Math.random() > 0.5;
            const firstName = isMale 
                ? maleNames[Math.floor(Math.random() * maleNames.length)] 
                : femaleNames[Math.floor(Math.random() * femaleNames.length)];
            
            let baseSurname = surnames[Math.floor(Math.random() * surnames.length)];
            if (!isMale) {
                if (baseSurname.endsWith('yev')) baseSurname = baseSurname.substring(0, baseSurname.length - 3) + 'yeva';
                else if (baseSurname.endsWith('ov')) baseSurname = baseSurname.substring(0, baseSurname.length - 2) + 'ova';
            }

            const fullName = `${firstName} ${baseSurname}`;
            const email = `${cleanEmailString(firstName)}.${cleanEmailString(baseSurname)}${Math.floor(Math.random() * 1000)}@gmail.com`;

            // Check if email already exists
            const existingUser = await User.findOne({ email });
            if (!existingUser) {
                const user = new User({
                    name: fullName,
                    email: email,
                    password: hashedStudentPassword,
                    role: 'student'
                });
                await user.save();
                studentsCount++;
                if (studentsCount % 10 === 0 || studentsCount === 85) {
                    console.log(`[Student Progress] ${studentsCount}/85 ta o'quvchi muvaffaqiyatli qo'shildi.`);
                }
            } else {
                i--; // Retry
            }
        }

        console.log("\n\x1b[32m✔ STATISTIKA UCHUN FOYDALANUVCHILARNI YARATISH TO'LIQ YAKUNLANDI!\x1b[0m");
        console.log(`\x1b[35m- Yaratilgan o'qituvchilar soni: ${teachersCount} ta (parol: teacher123)`);
        console.log(`- Yaratilgan o'quvchilar soni: ${studentsCount} ta (parol: student123)\x1b[0m\n`);

        await mongoose.disconnect();
    } catch (err) {
        console.error("\x1b[31mFoydalanuvchilarni yaratishda xatolik:\x1b[0m", err);
        process.exit(1);
    }
}

generateUsers();
