const mongoose = require('mongoose');
const User = require('./models/User');
const Review = require('./models/Review');
const bcrypt = require('bcryptjs');

const testimonials = [
  {
    name: "Aziza Karimova",
    role: "student",
    displayRole: "IT fakulteti talabasi",
    content: "MultiEdu platformasi orqali raqamli texnologiyalarni juda oson o'rgandim. 3D modellar orqali murakkab tushunchalarni vizual ko'rish juda foydali bo'ldi.",
    email: "aziza@example.com"
  },
  {
    name: "Sardor Yusupov",
    role: "student",
    displayRole: "Dasturchi",
    content: "AI tutor funksiyasi ajoyib! Har qanday savolga tezkor javob olish imkoniyati mavjud. Yo'lda podkastlarni tinglash ham juda qulay.",
    email: "sardor@example.com"
  },
  {
    name: "Nilufar Rahimova",
    role: "student",
    displayRole: "Biznes fakulteti talabasi",
    content: "Sequential learning tizimi menga intizomli o'qishga yordam berdi. Har bir darsni to'liq o'zlashtirmasdan keyingisiga o'ta olmaysiz - bu juda samarali!",
    email: "nilufar@example.com"
  },
  {
    name: "Jasur Toshmatov",
    role: "teacher",
    displayRole: "O'qituvchi",
    content: "O'qituvchi sifatida darslarni yaratish juda oson. Analytics orqali talabalarning progressini real vaqtda kuzatish imkoniyati ajoyib.",
    email: "jasur@example.com"
  },
  {
    name: "Malika Xolmatova",
    role: "student",
    displayRole: "Magistratura talabasi",
    content: "Telegram Mini App orqali istalgan joyda o'rganish imkoniyati bor. Bildirishnomalar orqali hech qachon muhim darsni o'tkazib yubormayman.",
    email: "malika@example.com"
  },
  {
    name: "Bekzod Aliyev",
    role: "student",
    displayRole: "Startap asoschisi",
    content: "Blockchain va IoT haqida chuqur bilim oldim. Video darslar va AI tarjima funksiyasi chet tildagi materiallarni ham oson o'rganishga yordam berdi.",
    email: "bekzod@example.com"
  }
];

const seedReviews = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/lms');
    console.log('MongoDB connected...');

    // Clear existing reviews to avoid duplicates if re-run
    await Review.deleteMany({});
    
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    for (const t of testimonials) {
      let user = await User.findOne({ email: t.email });
      if (!user) {
        user = new User({
          name: t.name,
          email: t.email,
          password: password,
          role: t.role
        });
        await user.save();
      }

      const review = new Review({
        user: user._id,
        rating: 5,
        comment: t.content,
        status: 'approved'
      });
      await review.save();
      console.log(`Review added for ${t.name}`);
    }

    console.log('Seeding completed!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedReviews();
