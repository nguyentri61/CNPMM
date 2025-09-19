# Hướng dẫn sử dụng Seeder

## Tổng quan
Seeder được sử dụng để tạo dữ liệu mẫu cho database, bao gồm:
- **User seeder**: Tạo user test để đăng nhập và test các chức năng
- **Product seeder**: Tạo sản phẩm mẫu với đầy đủ dữ liệu cho các chức năng mới

## Cách sử dụng

### 1. Chạy tất cả seeder
```bash
cd ExpressJS
node seed.js
```

### 2. Chạy chỉ user seeder
```bash
node seed.js --users-only
```

### 3. Chạy chỉ product seeder
```bash
node seed.js --products-only
```

### 4. Xem help
```bash
node seed.js --help
```

## Dữ liệu được tạo

### User Test
- **admin@example.com** / admin123
- **test1@example.com** / password123
- **test2@example.com** / password123
- **test3@example.com** / password123
- **demo@example.com** / demo123

### Product Data
- **20 sản phẩm** thuộc 5 danh mục:
  - Điện thoại (4 sản phẩm)
  - Laptop (4 sản phẩm)
  - Tai nghe (3 sản phẩm)
  - Đồng hồ thông minh (3 sản phẩm)
  - Máy tính bảng (3 sản phẩm)

### Dữ liệu cứng cho các chức năng mới

#### 1. Favorites (Sản phẩm yêu thích)
- Mỗi sản phẩm có 1-3 user yêu thích ngẫu nhiên
- Dữ liệu được phân bố đều giữa các user

#### 2. Viewed Products (Sản phẩm đã xem)
- Mỗi sản phẩm có 2-5 lượt xem từ các user khác nhau
- Thời gian xem trong vòng 30 ngày qua

#### 3. Similar Products (Sản phẩm tương tự)
- Tự động tìm sản phẩm tương tự dựa trên:
  - Cùng danh mục
  - Giá trong khoảng ±20%
- Mỗi sản phẩm có tối đa 3 sản phẩm tương tự

#### 4. Purchase & Comment Counts
- **Purchase Count**: 1-50 lượt mua ngẫu nhiên
- **Comment Count**: 1-30 bình luận ngẫu nhiên

## Cấu trúc dữ liệu

### Product Schema với dữ liệu mới
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  onSale: Boolean,
  views: Number,           // Tổng lượt xem
  purchaseCount: Number,   // Số khách mua (1-50)
  commentCount: Number,    // Số bình luận (1-30)
  favorites: [ObjectId],   // Danh sách user yêu thích (1-3 user)
  similarProducts: [ObjectId], // Danh sách sản phẩm tương tự (0-3 sản phẩm)
  viewedBy: [{             // Danh sách người xem (2-5 user)
    userId: ObjectId,
    viewedAt: Date         // Trong 30 ngày qua
  }]
}
```

## Lưu ý

1. **Xóa dữ liệu cũ**: Seeder sẽ xóa dữ liệu cũ trước khi thêm dữ liệu mới
2. **User test**: Chỉ xóa user có email bắt đầu bằng "test" hoặc email cụ thể
3. **Dữ liệu ngẫu nhiên**: Một số dữ liệu được tạo ngẫu nhiên để test đa dạng
4. **Thứ tự chạy**: User seeder chạy trước product seeder để đảm bảo có user để tham chiếu

## Troubleshooting

### Lỗi kết nối database
- Kiểm tra file `.env` có đúng thông tin database
- Đảm bảo MongoDB đang chạy

### Lỗi duplicate key
- Seeder sẽ tự động xóa dữ liệu cũ trước khi thêm mới
- Nếu vẫn lỗi, có thể xóa database và chạy lại

### Lỗi validation
- Kiểm tra model schema có đúng không
- Đảm bảo tất cả trường required được cung cấp

## Test các chức năng

Sau khi chạy seeder, bạn có thể test:

1. **Đăng nhập** với các user test
2. **Xem sản phẩm yêu thích** - sẽ có dữ liệu sẵn
3. **Xem sản phẩm đã xem** - sẽ có lịch sử xem
4. **Xem sản phẩm tương tự** - click vào sản phẩm để xem
5. **Thống kê** - mỗi sản phẩm có số mua và bình luận
