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
    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-plus-256gb_2.png',
    onSale: true,
    views: 150
  },
  {
    name: 'Samsung Galaxy S23 Ultra',
    description: 'Điện thoại Samsung cao cấp với bút S-Pen và camera zoom 100x',
    price: 1199,
    category: 'Điện thoại',
    image: 'https://product.hstatic.net/1000370129/product/s23_ultra_5g_den_0d23bfad56f84bfa88b4067a4940350b_master.jpg',
    onSale: false,
    views: 200
  },
  {
    name: 'Xiaomi 14 Pro',
    description: 'Điện thoại Xiaomi với chip Snapdragon mới nhất và camera Leica',
    price: 899,
    category: 'Điện thoại',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrYfL3P5JYjH-nDbjjvqx72PPDtXGL6JSgoA&s',
    onSale: true,
    views: 120
  },
  {
    name: 'Google Pixel 8 Pro',
    description: 'Điện thoại Google với khả năng chụp ảnh đêm tốt nhất',
    price: 999,
    category: 'Điện thoại',
    image: 'https://mobigo.vn/upload/san-pham/google-pixel-8-pro-2.jpg',
    onSale: false,
    views: 180
  },

  // Danh mục: Laptop
  {
    name: 'MacBook Pro M3',
    description: 'Laptop Apple với chip M3 mạnh mẽ và màn hình Retina',
    price: 1999,
    category: 'Laptop',
    image: 'https://cdn11.dienmaycholon.vn/filewebdmclnew/DMCL21/Picture/News/News_expe_9116/9116.png?version=290620',
    onSale: false,
    views: 300
  },
  {
    name: 'Dell XPS 15',
    description: 'Laptop mỏng nhẹ với màn hình OLED và hiệu năng cao',
    price: 1699,
    category: 'Laptop',
    image: 'https://www.laptopvip.vn/images/ab__webp/detailed/31/notebook-xps-15-9530-t-black-g--4-~1-clce-or-www.laptopvip.vn-1683083662.webp',
    onSale: true,
    views: 220
  },
  {
    name: 'Lenovo ThinkPad X1 Carbon',
    description: 'Laptop doanh nhân bền bỉ với bàn phím tốt nhất',
    price: 1499,
    category: 'Laptop',
    image: 'https://mac24h.vn/images/detailed/94/ThinkPad_X1_Carbon_Gen_10_Gia_Re_Bao_Hanh_24_thang_roel-5p.jpg',
    onSale: false,
    views: 140
  },
  {
    name: 'Asus ROG Zephyrus G14',
    description: 'Laptop gaming nhỏ gọn với hiệu năng đỉnh cao',
    price: 1599,
    category: 'Laptop',
    image: 'https://laptopworld.vn/media/product/250_23699__1501x1500_px_9__1.jpg',
    onSale: true,
    views: 260
  },

  // Danh mục: Tai nghe
  {
    name: 'Apple AirPods Pro 2',
    description: 'Tai nghe không dây với chống ồn chủ động và âm thanh không gian',
    price: 249,
    category: 'Tai nghe',
    image: 'https://cdn.tgdd.vn/Products/Images/54/315014/tai-nghe-bluetooth-airpods-pro-2nd-gen-usb-c-charge-apple-thumb-1-600x600.jpg',
    onSale: true,
    views: 400
  },
  {
    name: 'Sony WH-1000XM5',
    description: 'Tai nghe chụp tai với chống ồn tốt nhất thị trường',
    price: 399,
    category: 'Tai nghe',
    image: 'data:image/jpeg;base64,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',
    onSale: false,
    views: 350
  },
  {
    name: 'Bose QuietComfort Ultra',
    description: 'Tai nghe cao cấp với âm thanh đặc trưng Bose',
    price: 429,
    category: 'Tai nghe',
    image: 'https://hdradio.vn/upload/hinhanh/tai-nghe/Bose/QuietComfort-Ultra/black/bose-quietcomfort-ultra-black-3.jpg',
    onSale: false,
    views: 270
  },

  // Danh mục: Đồng hồ thông minh
  {
    name: 'Apple Watch Series 9',
    description: 'Đồng hồ thông minh với màn hình luôn bật và tính năng sức khỏe',
    price: 399,
    category: 'Đồng hồ thông minh',
    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/v/n/vn_apple_watch_series_9_cell_41mm_silver_aluminum_storm_blue_sport_band_pdp_image_position-7_1.jpg',
    onSale: true,
    views: 500
  },
  {
    name: 'Samsung Galaxy Watch 6',
    description: 'Đồng hồ thông minh với hệ điều hành WearOS và tính năng theo dõi sức khỏe',
    price: 349,
    category: 'Đồng hồ thông minh',
    image: 'https://img.global.news.samsung.com/vn/wp-content/uploads/2023/07/001-galaxy-watch6-watch6-classic-combo-kv.jpg',
    onSale: false,
    views: 280
  },
  {
    name: 'Garmin Fenix 7',
    description: 'Đồng hồ thông minh cho người chơi thể thao với pin siêu lâu',
    price: 699,
    category: 'Đồng hồ thông minh',
    image: 'https://cdn2.cellphones.com.vn/x/media/catalog/product/g/a/garminn_1.png',
    onSale: true,
    views: 320
  },

  // Danh mục: Máy tính bảng
  {
    name: 'iPad Pro M2',
    description: 'Máy tính bảng mạnh như laptop với chip M2 và màn hình mini-LED',
    price: 1099,
    category: 'Máy tính bảng',
    image: 'https://product.hstatic.net/1000259254/product/ipad_pro_m2_11_inch_wi-fi_space_gray-1_f29b10bb87fa47c0af5099b685366f53_master.jpg',
    onSale: false,
    views: 410
  },
  {
    name: 'Samsung Galaxy Tab S9 Ultra',
    description: 'Máy tính bảng Android cao cấp với màn hình lớn và bút S-Pen',
    price: 999,
    category: 'Máy tính bảng',
    image: 'https://i0.wp.com/2techhouse.vn/wp-content/uploads/2024/03/samsung-galaxy-tab-s9-plus.jpg?ssl=1',
    onSale: true,
    views: 290
  },
  {
    name: 'Xiaomi Pad 6 Pro',
    description: 'Máy tính bảng giá tốt với hiệu năng cao',
    price: 399,
    category: 'Máy tính bảng',
    image: 'https://cdn.viettablet.com/images/companies/1/minh-duc/xiaomi-pad-6-series/xiaomi-pad-6-series-8.jpg?1717140147828',
    onSale: false,
    views: 150
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
