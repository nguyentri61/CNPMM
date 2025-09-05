require('dotenv').config();
const connectDB = require('../config/database');

// Import các seeder
const runProductSeeder = require('./productSeeder');

// Hàm chạy tất cả các seeder
const runAllSeeders = async () => {
  try {
    // Kết nối đến database
    await connectDB();
    
    // Chạy các seeder
    console.log('Bắt đầu chạy các seeder...');
    await runProductSeeder();
    
    console.log('Đã chạy tất cả các seeder thành công!');
    process.exit();
  } catch (error) {
    console.error('Lỗi khi chạy seeder:', error);
    process.exit(1);
  }
};

// Chạy tất cả các seeder
runAllSeeders();