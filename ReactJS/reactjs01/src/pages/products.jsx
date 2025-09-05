import { useEffect, useState } from 'react';
import { Card, Col, Row, Typography, Select, Pagination, Spin, Empty, Image } from 'antd';
import { getAllCategoriesApi, getProductsByCategoryApi } from '../util/api';

const { Title, Paragraph } = Typography;
const { Option } = Select;

const ProductsPage = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 8,
    total: 0
  });

  // Lấy danh sách danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await getAllCategoriesApi();
        if (result.success) {
          setCategories(result.data);
        } else {
          console.error('Failed to fetch categories:', result.message);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Lấy sản phẩm theo danh mục và phân trang
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const result = await getProductsByCategoryApi(
          selectedCategory,
          pagination.current,
          pagination.pageSize
        );

        if (result.success) {
          setProducts(result.data.products);
          setPagination(prev => ({
            ...prev,
            total: result.data.totalItems
          }));
        } else {
          console.error('Failed to fetch products:', result.message);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, pagination.current, pagination.pageSize]);

  // Xử lý thay đổi danh mục
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setPagination(prev => ({ ...prev, current: 1 })); // Reset về trang 1 khi đổi danh mục
  };

  // Xử lý thay đổi trang
  const handlePageChange = (page, pageSize) => {
    setPagination(prev => ({
      ...prev,
      current: page,
      pageSize: pageSize
    }));
  };

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Danh sách sản phẩm</Title>
      
      {/* Bộ lọc danh mục */}
      <div style={{ marginBottom: '20px' }}>
        <span style={{ marginRight: '10px' }}>Danh mục:</span>
        <Select 
          value={selectedCategory} 
          onChange={handleCategoryChange} 
          style={{ width: 200 }}
        >
          <Option value="all">Tất cả sản phẩm</Option>
          {categories.map(category => (
            <Option key={category} value={category}>{category}</Option>
          ))}
        </Select>
      </div>

      {/* Hiển thị sản phẩm */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : products.length > 0 ? (
        <>
          <Row gutter={[16, 16]}>
            {products.map(product => (
              <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
                <Card
                  hoverable
                  cover={
                    <Image
                      alt={product.name}
                      src={product.image}
                      fallback="https://via.placeholder.com/300x200?text=No+Image"
                      style={{ height: 200, objectFit: 'cover' }}
                    />
                  }
                >
                  <Card.Meta
                    title={product.name}
                    description={
                      <>
                        <Paragraph ellipsis={{ rows: 2 }}>
                          {product.description}
                        </Paragraph>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                          <span>Giá: {product.price.toLocaleString('vi-VN')} đ</span>
                          <span>Danh mục: {product.category}</span>
                        </div>
                      </>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>

          {/* Phân trang */}
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={handlePageChange}
              showSizeChanger
              pageSizeOptions={['4', '8', '12', '16']}
            />
          </div>
        </>
      ) : (
        <Empty description="Không tìm thấy sản phẩm" />
      )}
    </div>
  );
};

export default ProductsPage;