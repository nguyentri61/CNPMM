import { useEffect, useState } from 'react';
import {
  Card,
  Col,
  Row,
  Typography,
  Select,
  Pagination,
  Spin,
  Empty,
  Image,
  Input,
  Button,
  Space,
  Tag,
  Switch,
  Badge
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  EyeOutlined,
  FireOutlined,
  ClearOutlined,
  AppstoreOutlined,
  TagOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { getAllCategoriesApi, getProductsApi } from '../util/api';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Search } = Input;

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
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    onSale: false,
    views: 0
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Fetch categories
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

  // Fetch products with combined API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          category: selectedCategory !== "all" ? selectedCategory : "",
          page: pagination.current,
          limit: pagination.pageSize,
          search: searchKeyword || undefined,
          minPrice: filters.minPrice || undefined,
          maxPrice: filters.maxPrice || undefined,
          onSale: filters.onSale ? 'true' : undefined,
          views: filters.views || undefined
        };

        const result = await getProductsApi(params);
        if (result.success && result.data) {
          setProducts(result.data.products);
          console.log(result.data.products);
          setPagination(prev => ({
            ...prev,
            total: result.data.pagination.total,
          }));
        } else {
          console.error('Failed to fetch products:', result.data.message);
          setProducts([]);
          setPagination(prev => ({ ...prev, total: 0 }));
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
        setPagination(prev => ({ ...prev, total: 0 }));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, pagination.current, pagination.pageSize, searchKeyword, filters]);

  // Handle category change
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setPagination(prev => ({ ...prev, current: 1 }));
    setSearchKeyword("");
  };

  // Handle page change
  const handlePageChange = (page, pageSize) => {
    setPagination(prev => ({
      ...prev,
      current: page,
      pageSize: pageSize
    }));
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchKeyword(value.trim());
    setPagination(prev => ({ ...prev, current: 1 }));
    setFilters({ minPrice: "", maxPrice: "", onSale: false, views: "" });
  };

  // Handle filter
  const handleFilter = () => {
    setSearchKeyword("");
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setFilters({ minPrice: "", maxPrice: "", onSale: false, views: "" });
    setSelectedCategory('all');
    setSearchKeyword("");
  };

  // Count active filters
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.onSale) count++;
    if (filters.views) count++;
    if (selectedCategory !== 'all') count++;
    return count;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-4">
            <AppstoreOutlined className="mr-4" />
            Khám Phá Sản Phẩm
          </h1>
          <p className="text-white/80 text-xl">Tìm kiếm và khám phá những sản phẩm tuyệt vời</p>
        </div>

        {/* Main Content Container */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <Search
                placeholder="Tìm kiếm sản phẩm yêu thích của bạn..."
                onSearch={handleSearch}
                allowClear
                size="large"
                className="shadow-lg"
                style={{
                  borderRadius: '12px'
                }}
              />
            </div>
          </div>

          {/* Filter Section */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 mb-8 border border-gray-200">
            {/* Filter Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FilterOutlined className="text-purple-600 text-lg" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Bộ lọc sản phẩm</h3>
                {getActiveFiltersCount() > 0 && (
                  <Badge count={getActiveFiltersCount()} className="bg-purple-500" />
                )}
              </div>
              <div className="flex space-x-3">
                <Button
                  type="text"
                  icon={<ClearOutlined />}
                  onClick={handleClearFilters}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  Xóa tất cả
                </Button>
                <Button
                  type="text"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                >
                  {showAdvancedFilters ? 'Ẩn bớt' : 'Nâng cao'}
                </Button>
              </div>
            </div>

            {/* Basic Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-4">
              {/* Category Filter */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TagOutlined className="mr-1" />
                  Danh mục
                </label>
                <Select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className="w-full"
                  size="large"
                >
                  <Option value="all">Tất cả sản phẩm</Option>
                  {categories.map(category => (
                    <Option key={category} value={category}>{category}</Option>
                  ))}
                </Select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarOutlined className="mr-1" />
                  Giá từ
                </label>
                <Input
                  placeholder="0"
                  type="number"
                  value={filters.minPrice}
                  onChange={e => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                  size="large"
                  suffix="đ"
                  className="rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giá đến
                </label>
                <Input
                  placeholder="∞"
                  type="number"
                  value={filters.maxPrice}
                  onChange={e => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                  size="large"
                  suffix="đ"
                  className="rounded-lg"
                />
              </div>

              {/* Sale Filter */}
              <div className="flex flex-col justify-end">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FireOutlined className="mr-1 text-red-500" />
                  Đang khuyến mãi
                </label>
                <div className="h-10 flex items-center">
                  <Switch
                    checked={filters.onSale}
                    onChange={(checked) => setFilters(prev => ({ ...prev, onSale: checked }))}
                    checkedChildren="Sale"
                    unCheckedChildren="All"
                  />
                </div>
              </div>

              {/* Filter Button */}
              <div className="flex flex-col justify-end">
                <Button
                  type="primary"
                  onClick={handleFilter}
                  size="large"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 border-0 rounded-lg h-10"
                >
                  <FilterOutlined className="mr-1" />
                  Áp dụng
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <div className="border-t pt-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <EyeOutlined className="mr-1 text-blue-500" />
                      Lượt xem từ
                    </label>
                    <Input
                      placeholder="0"
                      type="number"
                      value={filters.views}
                      onChange={e => setFilters(prev => ({ ...prev, views: e.target.value }))}
                      size="large"
                      className="rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Spin size="large" />
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {products.map(product => (
                  <div key={product._id} className="group">
                    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
                      {/* Product Image */}
                      <div className="relative overflow-hidden aspect-square">
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <Image
                            alt={product.name}
                            src={product.image}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            preview={{
                              mask: <EyeOutlined className="text-white" />,
                              maskClassName: "flex items-center justify-center"
                            }}
                            style={{
                              maxHeight: "100%",
                              maxWidth: "100%"
                            }}
                            fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuMzVlbSIgZmlsbD0jOTk5Pk5vIEluYWdlPC90ZXh0Pjwvc3ZnPg=="
                          />
                        </div>
                        {/* Sale Badge */}
                        {product.onSale && (
                          <div className="absolute top-3 left-3">
                            <Tag color="red" className="text-xs font-semibold">
                              <FireOutlined className="mr-1" />
                              SALE
                            </Tag>
                          </div>
                        )}
                        {/* Views Badge */}
                        {product.views && (
                          <div className="absolute top-3 right-3">
                            <Tag color="blue" className="text-xs">
                              <EyeOutlined className="mr-1" />
                              {product.views}
                            </Tag>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {product.description}
                        </p>

                        {/* Price and Category */}
                        <div className="flex justify-between items-center">
                          <div className="text-lg font-bold text-purple-600">
                            {product.price?.toLocaleString('vi-VN')} đ
                          </div>
                          <Tag color="purple" className="text-xs">
                            {product.category}
                          </Tag>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center">
                <Pagination
                  current={pagination.current}
                  pageSize={pagination.pageSize}
                  total={pagination.total}
                  onChange={handlePageChange}
                  showSizeChanger
                  pageSizeOptions={['4', '8', '12', '16']}
                  className="bg-white p-4 rounded-xl shadow-sm"
                />
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <Empty
                description={
                  <span className="text-gray-500 text-lg">
                    Không tìm thấy sản phẩm phù hợp
                  </span>
                }
                className="text-gray-400"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;