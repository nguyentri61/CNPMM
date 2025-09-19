#!/usr/bin/env node

/**
 * Script để chạy seeder
 * Sử dụng: node seed.js [options]
 * 
 * Options:
 * --users-only    Chỉ chạy user seeder
 * --products-only Chỉ chạy product seeder
 * --help         Hiển thị help
 */

const args = process.argv.slice(2);

if (args.includes('--help')) {
  console.log(`
Script để chạy seeder

Sử dụng:
  node seed.js                    # Chạy tất cả seeder
  node seed.js --users-only       # Chỉ chạy user seeder  
  node seed.js --products-only    # Chỉ chạy product seeder
  node seed.js --help             # Hiển thị help này
  `);
  process.exit(0);
}

const runUserSeeder = require('./src/seeders/userSeeder');
const runProductSeeder = require('./src/seeders/productSeeder');
const connectDB = require('./src/config/database');

const runSeeders = async () => {
  try {
    console.log('🚀 Bắt đầu chạy seeder...');
    
    // Kết nối database
    await connectDB();
    console.log('✅ Đã kết nối database');

    if (args.includes('--users-only')) {
      console.log('👥 Chạy user seeder...');
      await runUserSeeder();
    } else if (args.includes('--products-only')) {
      console.log('📦 Chạy product seeder...');
      await runProductSeeder();
    } else {
      console.log('👥 Chạy user seeder...');
      await runUserSeeder();
      
      console.log('📦 Chạy product seeder...');
      await runProductSeeder();
    }

    console.log('🎉 Hoàn thành tất cả seeder!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi chạy seeder:', error);
    process.exit(1);
  }
};

runSeeders();
