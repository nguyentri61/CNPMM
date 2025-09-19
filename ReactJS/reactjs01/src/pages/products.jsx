import { useEffect, useState, useContext } from 'react';
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
  Badge,
  Tabs,
  message,
  Tooltip
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  EyeOutlined,
  FireOutlined,
  ClearOutlined,
  AppstoreOutlined,
  TagOutlined,
  DollarOutlined,
  HeartOutlined,
  HeartFilled,
  HistoryOutlined,
  ShoppingOutlined,
  CommentOutlined,
  SlackOutlined,
} from '@ant-design/icons';
import {
  getAllCategoriesApi,
  getProductsApi,
  addToFavoritesApi,
  removeFromFavoritesApi,
  getFavoriteProductsApi,
  getSimilarProductsApi,
  getViewedProductsApi,
  updateProductViewApi,
  incrementPurchaseCountApi,
  incrementCommentCountApi
} from '../util/api';
import { AuthContext } from '../components/context/auth.context';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Search } = Input;

const ProductsPage = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
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
  const [activeTab, setActiveTab] = useState('all');
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [viewedProducts, setViewedProducts] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [viewedLoading, setViewedLoading] = useState(false);
  const [similarLoading, setSimilarLoading] = useState(false);
  const [currentProducts, setCurrentProducts] = useState([]);

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
      if (activeTab === 'favorites') {
        await fetchFavoriteProducts();
        return;
      }
      if (activeTab === 'viewed') {
        await fetchViewedProducts();
        return;
      }
      if (activeTab === 'similar' && selectedProduct) {
        await fetchSimilarProducts(selectedProduct._id);
        return;
      }

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
          setCurrentProducts(result.data.products);
          console.log(result.data.products);
          setPagination(prev => ({
            ...prev,
            total: result.data.pagination.total,
          }));
        } else {
          console.error('Failed to fetch products:', result.data.message);
          setProducts([]);
          setCurrentProducts([]);
          setPagination(prev => ({ ...prev, total: 0 }));
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
        setCurrentProducts([]);
        setPagination(prev => ({ ...prev, total: 0 }));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, pagination.current, pagination.pageSize, searchKeyword, filters, activeTab, selectedProduct]);

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

  // Fetch favorite products
  const fetchFavoriteProducts = async () => {
    if (!isAuthenticated || !user) {
      message.warning('Vui lòng đăng nhập để xem sản phẩm yêu thích');
      return;
    }

    setFavoritesLoading(true);
    try {
      const result = await getFavoriteProductsApi(pagination.current, pagination.pageSize);
      if (result.success) {
        setFavoriteProducts(result.data.products);
        setCurrentProducts(result.data.products);
        setPagination(prev => ({
          ...prev,
          total: result.data.pagination.total,
        }));
      } else {
        message.error('Không thể tải danh sách sản phẩm yêu thích');
        setCurrentProducts([]);
      }
    } catch (error) {
      console.error('Error fetching favorite products:', error);
      message.error('Đã xảy ra lỗi khi tải sản phẩm yêu thích');
      setCurrentProducts([]);
    } finally {
      setFavoritesLoading(false);
    }
  };

  // Fetch viewed products
  const fetchViewedProducts = async () => {
    if (!isAuthenticated || !user) {
      message.warning('Vui lòng đăng nhập để xem sản phẩm đã xem');
      return;
    }

    setViewedLoading(true);
    try {
      const result = await getViewedProductsApi(pagination.current, pagination.pageSize);
      if (result.success) {
        setViewedProducts(result.data.products);
        setCurrentProducts(result.data.products);
        setPagination(prev => ({
          ...prev,
          total: result.data.pagination.total,
        }));
      } else {
        message.error('Không thể tải danh sách sản phẩm đã xem');
        setCurrentProducts([]);
      }
    } catch (error) {
      console.error('Error fetching viewed products:', error);
      message.error('Đã xảy ra lỗi khi tải sản phẩm đã xem');
      setCurrentProducts([]);
    } finally {
      setViewedLoading(false);
    }
  };

  // Fetch similar products
  const fetchSimilarProducts = async (productId) => {
    if (!productId) return;

    setSimilarLoading(true);
    try {
      const result = await getSimilarProductsApi(productId);
      if (result.success) {
        setSimilarProducts(result.data);
        setCurrentProducts(result.data);
        setPagination(prev => ({
          ...prev,
          total: result.data.length,
        }));
      } else {
        message.error('Không thể tải danh sách sản phẩm tương tự');
        setCurrentProducts([]);
      }
    } catch (error) {
      console.error('Error fetching similar products:', error);
      message.error('Đã xảy ra lỗi khi tải sản phẩm tương tự');
      setCurrentProducts([]);
    } finally {
      setSimilarLoading(false);
    }
  };

  // Toggle favorite
  const toggleFavorite = async (productId, isFavorite) => {
    if (!isAuthenticated || !user) {
      message.warning('Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích');
      return;
    }

    try {
      let result;
      if (isFavorite) {
        result = await removeFromFavoritesApi(productId);
      } else {
        result = await addToFavoritesApi(productId);
      }

      if (result.success) {
        message.success(isFavorite ? 'Đã xóa khỏi danh sách yêu thích' : 'Đã thêm vào danh sách yêu thích');

        // Refresh products list
        if (activeTab === 'favorites') {
          fetchFavoriteProducts();
        } else {
          const updatedProducts = currentProducts.map(p =>
            p._id === productId
              ? { ...p, isFavorite: !isFavorite }
              : p
          );
          setCurrentProducts(updatedProducts);
        }
      } else {
        message.error('Không thể cập nhật trạng thái yêu thích');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      message.error('Đã xảy ra lỗi khi cập nhật trạng thái yêu thích');
    }
  };

  // Handle tab change
  const handleTabChange = (key) => {
    setActiveTab(key);
    setPagination(prev => ({
      ...prev,
      current: 1
    }));

    if (key === 'favorites') {
      fetchFavoriteProducts();
    } else if (key === 'viewed') {
      fetchViewedProducts();
    } else if (key === 'similar') {
      if (selectedProduct) {
        fetchSimilarProducts(selectedProduct._id);
      } else {
        setCurrentProducts([]);
      }
    } else {
      // Reset to default products view
      setCurrentProducts(products);
    }
  };

  // View product details and fetch similar products
  const viewProductDetails = async (product) => {
    setSelectedProduct(product);

    // Update product view count
    if (isAuthenticated && user) {
      try {
        await updateProductViewApi(product._id);
      } catch (error) {
        console.error('Error updating product view:', error);
      }
    }

    fetchSimilarProducts(product._id);
  };

  // Handle purchase count increment
  const handlePurchase = async (productId) => {
    try {
      const result = await incrementPurchaseCountApi(productId);
      if (result.success) {
        message.success('Đã cập nhật số lượng khách mua');
        // Refresh current products to show updated count
        if (activeTab === 'all') {
          // Refresh all products
          const updatedProducts = currentProducts.map(p =>
            p._id === productId
              ? { ...p, purchaseCount: (p.purchaseCount || 0) + 1 }
              : p
          );
          setCurrentProducts(updatedProducts);
        }
      } else {
        message.error('Không thể cập nhật số lượng khách mua');
      }
    } catch (error) {
      console.error('Error incrementing purchase count:', error);
      message.error('Đã xảy ra lỗi khi cập nhật số lượng khách mua');
    }
  };

  // Handle comment count increment
  const handleComment = async (productId) => {
    try {
      const result = await incrementCommentCountApi(productId);
      if (result.success) {
        message.success('Đã cập nhật số lượng bình luận');
        // Refresh current products to show updated count
        const updatedProducts = currentProducts.map(p =>
          p._id === productId
            ? { ...p, commentCount: (p.commentCount || 0) + 1 }
            : p
        );
        setCurrentProducts(updatedProducts);
      } else {
        message.error('Không thể cập nhật số lượng bình luận');
      }
    } catch (error) {
      console.error('Error incrementing comment count:', error);
      message.error('Đã xảy ra lỗi khi cập nhật số lượng bình luận');
    }
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

          {/* Tabs */}
          <div className="mb-6">
            <Tabs
              activeKey={activeTab}
              onChange={handleTabChange}
              items={[
                {
                  key: 'all',
                  label: (
                    <span className="flex items-center">
                      <AppstoreOutlined className="mr-2" />
                      Tất cả sản phẩm
                    </span>
                  ),
                },
                {
                  key: 'favorites',
                  label: (
                    <span className="flex items-center">
                      <HeartOutlined className="mr-2" />
                      Yêu thích
                    </span>
                  ),
                  disabled: !isAuthenticated
                },
                {
                  key: 'viewed',
                  label: (
                    <span className="flex items-center">
                      <HistoryOutlined className="mr-2" />
                      Đã xem
                    </span>
                  ),
                  disabled: !isAuthenticated
                },
                {
                  key: 'similar',
                  label: (
                    <span className="flex items-center">
                      <SlackOutlined className="mr-2" />
                      Tương tự
                    </span>
                  ),
                  disabled: !selectedProduct
                }
              ]}
              className="bg-white rounded-xl p-4 shadow-sm"
            />
          </div>

          {/* Search Bar - only show for 'all' tab */}
          {activeTab === 'all' && (
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
          )}

          {/* Filter Section - only show for 'all' tab */}
          {activeTab === 'all' && (
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
          )}

          {/* Products Grid */}
          {(loading || favoritesLoading || viewedLoading || similarLoading) ? (
            <div className="flex justify-center items-center py-20">
              <Spin size="large" />
            </div>
          ) : currentProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {currentProducts.map(product => (
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

                        {/* Action Buttons */}
                        <div className="absolute bottom-3 right-3 flex space-x-2">
                          <Tooltip title="Xem chi tiết">
                            <Button
                              type="primary"
                              shape="circle"
                              size="small"
                              icon={<EyeOutlined />}
                              onClick={() => viewProductDetails(product)}
                              className="bg-blue-500 hover:bg-blue-600"
                            />
                          </Tooltip>
                          {isAuthenticated && (
                            <Tooltip title={product.favorites?.includes(user?.id) ? "Bỏ yêu thích" : "Thêm yêu thích"}>
                              <Button
                                type="primary"
                                shape="circle"
                                size="small"
                                icon={product.favorites?.includes(user?.id) ? <HeartFilled /> : <HeartOutlined />}
                                onClick={() => toggleFavorite(product._id, product.favorites?.includes(user?.id))}
                                className={product.favorites?.includes(user?.id) ? "bg-red-500 hover:bg-red-600" : "bg-gray-500 hover:bg-gray-600"}
                              />
                            </Tooltip>
                          )}
                        </div>
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
                        <div className="flex justify-between items-center mb-3">
                          <div className="text-lg font-bold text-purple-600">
                            {product.price?.toLocaleString('vi-VN')} đ
                          </div>
                          <Tag color="purple" className="text-xs">
                            {product.category}
                          </Tag>
                        </div>

                        {/* Stats */}
                        <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                          <div className="flex items-center space-x-3">
                            {product.purchaseCount > 0 && (
                              <span className="flex items-center">
                                <ShoppingOutlined className="mr-1" />
                                {product.purchaseCount} mua
                              </span>
                            )}
                            {product.commentCount > 0 && (
                              <span className="flex items-center">
                                <CommentOutlined className="mr-1" />
                                {product.commentCount} bình luận
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          <Button
                            type="primary"
                            size="small"
                            icon={<ShoppingOutlined />}
                            onClick={() => handlePurchase(product._id)}
                            className="flex-1 bg-green-500 hover:bg-green-600"
                          >
                            Mua
                          </Button>
                          <Button
                            type="default"
                            size="small"
                            icon={<CommentOutlined />}
                            onClick={() => handleComment(product._id)}
                            className="flex-1"
                          >
                            Bình luận
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination - only show for tabs that support pagination */}
              {(activeTab === 'all' || activeTab === 'favorites' || activeTab === 'viewed') && (
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
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <Empty
                description={
                  <span className="text-gray-500 text-lg">
                    {activeTab === 'favorites' && 'Chưa có sản phẩm yêu thích nào'}
                    {activeTab === 'viewed' && 'Chưa có sản phẩm nào được xem'}
                    {activeTab === 'similar' && 'Chưa chọn sản phẩm để xem sản phẩm tương tự'}
                    {activeTab === 'all' && 'Không tìm thấy sản phẩm phù hợp'}
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