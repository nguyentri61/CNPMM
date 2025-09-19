require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user');
const connectDB = require('../config/database');

// Dữ liệu mẫu cho user
const userSamples = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123'
  },
  {
    name: 'Test User 1',
    email: 'test1@example.com',
    password: 'password123'
  },
  {
    name: 'Test User 2',
    email: 'test2@example.com',
    password: 'password123'
  },
  {
    name: 'Test User 3',
    email: 'test3@example.com',
    password: 'password123'
  },
  {
    name: 'Demo User',
    email: 'demo@example.com',
    password: 'demo123'
  }
];

// Hàm để thêm dữ liệu user vào database
const seedUsers = async () => {
  try {
    // Xóa tất cả user test cũ (giữ lại user thật)
    await User.deleteMany({ 
      email: { 
        $in: [
          'admin@example.com',
          'test1@example.com', 
          'test2@example.com',
          'test3@example.com',
          'demo@example.com'
        ]
      } 
    });
    console.log('Đã xóa user test cũ');

    // Thêm user mới
    const insertedUsers = await User.insertMany(userSamples);
    console.log(`Đã thêm ${insertedUsers.length} user mới`);

    console.log('Hoàn thành việc tạo dữ liệu user mẫu!');
    return insertedUsers;
  } catch (error) {
    console.error('Lỗi khi tạo dữ liệu user mẫu:', error);
    return false;
  }
};

// Nếu file được chạy trực tiếp (không phải import)
if (require.main === module) {
  (async () => {
    try {
      await connectDB();
      await seedUsers();
      process.exit(0);
    } catch (error) {
      console.error('Lỗi khi chạy user seeder:', error);
      process.exit(1);
    }
  })();
}

module.exports = seedUsers;
