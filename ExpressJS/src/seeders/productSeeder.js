require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const connectDB = require('../config/database');

// Dữ liệu mẫu cho sản phẩm
const productSamples = [
  // Danh mục: Điện thoại
  {
    name: 'iPhone 15 Pro Max',
    description: 'Điện thoại iPhone mới nhất với camera chất lượng cao và hiệu năng mạnh mẽ',
    price: 1299,
    category: 'Điện thoại',
    image: 'iphone15.jpg'
  },
  {
    name: 'Samsung Galaxy S23 Ultra',
    description: 'Điện thoại Samsung cao cấp với bút S-Pen và camera zoom 100x',
    price: 1199,
    category: 'Điện thoại',
    image: 'samsung-s23.jpg'
  },
  {
    name: 'Xiaomi 14 Pro',
    description: 'Điện thoại Xiaomi với chip Snapdragon mới nhất và camera Leica',
    price: 899,
    category: 'Điện thoại',
    image: 'xiaomi14.jpg'
  },
  {
    name: 'Google Pixel 8 Pro',
    description: 'Điện thoại Google với khả năng chụp ảnh đêm tốt nhất',
    price: 999,
    category: 'Điện thoại',
    image: 'pixel8.jpg'
  },
  
  // Danh mục: Laptop
  {
    name: 'MacBook Pro M3',
    description: 'Laptop Apple với chip M3 mạnh mẽ và màn hình Retina',
    price: 1999,
    category: 'Laptop',
    image: 'macbook-m3.jpg'
  },
  {
    name: 'Dell XPS 15',
    description: 'Laptop mỏng nhẹ với màn hình OLED và hiệu năng cao',
    price: 1699,
    category: 'Laptop',
    image: 'dell-xps.jpg'
  },
  {
    name: 'Lenovo ThinkPad X1 Carbon',
    description: 'Laptop doanh nhân bền bỉ với bàn phím tốt nhất',
    price: 1499,
    category: 'Laptop',
    image: 'thinkpad-x1.jpg'
  },
  {
    name: 'Asus ROG Zephyrus G14',
    description: 'Laptop gaming nhỏ gọn với hiệu năng đỉnh cao',
    price: 1599,
    category: 'Laptop',
    image: 'rog-g14.jpg'
  },
  
  // Danh mục: Tai nghe
  {
    name: 'Apple AirPods Pro 2',
    description: 'Tai nghe không dây với chống ồn chủ động và âm thanh không gian',
    price: 249,
    category: 'Tai nghe',
    image: 'airpods-pro.jpg'
  },
  {
    name: 'Sony WH-1000XM5',
    description: 'Tai nghe chụp tai với chống ồn tốt nhất thị trường',
    price: 399,
    category: 'Tai nghe',
    image: 'sony-wh1000xm5.jpg'
  },
  {
    name: 'Bose QuietComfort Ultra',
    description: 'Tai nghe cao cấp với âm thanh đặc trưng Bose',
    price: 429,
    category: 'Tai nghe',
    image: 'bose-qc.jpg'
  },
  
  // Danh mục: Đồng hồ thông minh
  {
    name: 'Apple Watch Series 9',
    description: 'Đồng hồ thông minh với màn hình luôn bật và tính năng sức khỏe',
    price: 399,
    category: 'Đồng hồ thông minh',
    image: 'apple-watch.jpg'
  },
  {
    name: 'Samsung Galaxy Watch 6',
    description: 'Đồng hồ thông minh với hệ điều hành WearOS và tính năng theo dõi sức khỏe',
    price: 349,
    category: 'Đồng hồ thông minh',
    image: 'galaxy-watch.jpg'
  },
  {
    name: 'Garmin Fenix 7',
    description: 'Đồng hồ thông minh cho người chơi thể thao với pin siêu lâu',
    price: 699,
    category: 'Đồng hồ thông minh',
    image: 'garmin-fenix.jpg'
  },
  
  // Danh mục: Máy tính bảng
  {
    name: 'iPad Pro M2',
    description: 'Máy tính bảng mạnh như laptop với chip M2 và màn hình mini-LED',
    price: 1099,
    category: 'Máy tính bảng',
    image: 'ipad-pro.jpg'
  },
  {
    name: 'Samsung Galaxy Tab S9 Ultra',
    description: 'Máy tính bảng Android cao cấp với màn hình lớn và bút S-Pen',
    price: 999,
    category: 'Máy tính bảng',
    image: 'tab-s9.jpg'
  },
  {
    name: 'Xiaomi Pad 6 Pro',
    description: 'Máy tính bảng giá tốt với hiệu năng cao',
    price: 399,
    category: 'Máy tính bảng',
    image: 'xiaomi-pad.jpg'
  }
];

// Hàm để thêm dữ liệu vào database
const seedProducts = async () => {
  try {
    // Xóa tất cả sản phẩm hiện có
    await Product.deleteMany({});
    console.log('Đã xóa tất cả sản phẩm cũ');
    
    // Thêm sản phẩm mới
    await Product.insertMany(productSamples);
    console.log(`Đã thêm ${productSamples.length} sản phẩm mới`);
    
    console.log('Hoàn thành việc tạo dữ liệu mẫu!');
    return true;
  } catch (error) {
    console.error('Lỗi khi tạo dữ liệu mẫu:', error);
    return false;
  }
};

// Nếu file được chạy trực tiếp (không phải import)
if (require.main === module) {
  (async () => {
    try {
      await connectDB();
      await seedProducts();
      process.exit(0);
    } catch (error) {
      console.error('Lỗi khi chạy seeder:', error);
      process.exit(1);
    }
  })();
}

module.exports = seedProducts;