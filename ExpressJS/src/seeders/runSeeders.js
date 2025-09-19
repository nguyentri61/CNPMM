require('dotenv').config();
const connectDB = require('../config/database');

// Import các seeder
const runProductSeeder = require('./productSeeder');
const runUserSeeder = require('./userSeeder');

// Hàm chạy tất cả các seeder
const runAllSeeders = async () => {
  try {
    // Kết nối đến database
    await connectDB();
    
    // Chạy các seeder
    console.log('Bắt đầu chạy các seeder...');
    
    // Chạy user seeder trước
    console.log('Chạy user seeder...');
    await runUserSeeder();
    
    // Chạy product seeder sau
    console.log('Chạy product seeder...');
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