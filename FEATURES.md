# Tính năng sản phẩm mới

## Tổng quan
Dự án đã được cập nhật với các tính năng sản phẩm nâng cao bao gồm:

### 1. Sản phẩm yêu thích (Favorites)
- **Thêm/xóa sản phẩm yêu thích**: Người dùng có thể thêm hoặc xóa sản phẩm khỏi danh sách yêu thích
- **Xem danh sách yêu thích**: Tab riêng để xem tất cả sản phẩm yêu thích
- **Phân trang**: Hỗ trợ phân trang cho danh sách yêu thích

### 2. Sản phẩm tương tự (Similar Products)
- **Tự động tìm sản phẩm tương tự**: Dựa trên danh mục và khoảng giá
- **Tab sản phẩm tương tự**: Hiển thị sản phẩm tương tự khi chọn một sản phẩm
- **Cập nhật danh sách**: API để cập nhật danh sách sản phẩm tương tự

### 3. Sản phẩm đã xem (Viewed Products)
- **Theo dõi lượt xem**: Tự động cập nhật khi người dùng xem sản phẩm
- **Lịch sử xem**: Tab riêng để xem lịch sử sản phẩm đã xem
- **Thời gian xem**: Lưu trữ thời gian xem sản phẩm

### 4. Đếm số khách mua và bình luận
- **Số lượng khách mua**: Tăng khi người dùng nhấn nút "Mua"
- **Số lượng bình luận**: Tăng khi người dùng nhấn nút "Bình luận"
- **Hiển thị thống kê**: Hiển thị số liệu trên giao diện sản phẩm

## API Endpoints

### Sản phẩm yêu thích
```
POST /v1/api/products/:productId/favorite - Thêm vào yêu thích
DELETE /v1/api/products/:productId/favorite - Xóa khỏi yêu thích
GET /v1/api/products/favorites - Lấy danh sách yêu thích
```

### Sản phẩm tương tự
```
GET /v1/api/products/:productId/similar - Lấy sản phẩm tương tự
POST /v1/api/products/:productId/similar/update - Cập nhật danh sách tương tự
```

### Sản phẩm đã xem
```
GET /v1/api/products/:productId/view - Cập nhật lượt xem
GET /v1/api/products/viewed - Lấy danh sách đã xem
```

### Đếm số liệu
```
POST /v1/api/products/:productId/purchase - Tăng số khách mua
POST /v1/api/products/:productId/comment - Tăng số bình luận
PUT /v1/api/products/:productId/counts - Cập nhật số đếm
```

## Cấu trúc Database

### Product Schema
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  onSale: Boolean,
  views: Number,           // Tổng lượt xem
  purchaseCount: Number,   // Số khách mua
  commentCount: Number,    // Số bình luận
  favorites: [ObjectId],   // Danh sách user yêu thích
  similarProducts: [ObjectId], // Danh sách sản phẩm tương tự
  viewedBy: [{             // Danh sách người xem
    userId: ObjectId,
    viewedAt: Date
  }]
}
```

## Giao diện người dùng

### Tabs
- **Tất cả sản phẩm**: Hiển thị tất cả sản phẩm với filter và search
- **Yêu thích**: Chỉ hiển thị khi đã đăng nhập
- **Đã xem**: Chỉ hiển thị khi đã đăng nhập
- **Tương tự**: Chỉ hiển thị khi đã chọn một sản phẩm

### Nút hành động
- **Xem chi tiết**: Cập nhật lượt xem và hiển thị sản phẩm tương tự
- **Yêu thích**: Thêm/xóa khỏi danh sách yêu thích
- **Mua**: Tăng số lượng khách mua
- **Bình luận**: Tăng số lượng bình luận

### Thống kê hiển thị
- Số lượt xem
- Số khách mua
- Số bình luận
- Trạng thái yêu thích

## Cách sử dụng

1. **Xem sản phẩm**: Nhấn nút "Xem chi tiết" để xem sản phẩm và cập nhật lượt xem
2. **Thêm yêu thích**: Nhấn nút tim để thêm/xóa khỏi danh sách yêu thích
3. **Xem sản phẩm tương tự**: Sau khi xem chi tiết, chuyển sang tab "Tương tự"
4. **Theo dõi lịch sử**: Chuyển sang tab "Đã xem" để xem lịch sử
5. **Tương tác**: Sử dụng nút "Mua" và "Bình luận" để cập nhật số liệu

## Yêu cầu
- Người dùng phải đăng nhập để sử dụng các tính năng yêu thích và xem lịch sử
- Các tính năng đếm số liệu hoạt động cho tất cả người dùng
- Sản phẩm tương tự được tính toán dựa trên danh mục và khoảng giá (±20%)
