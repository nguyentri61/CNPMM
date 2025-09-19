#!/usr/bin/env node

/**
 * Script test các API mới
 * Sử dụng: node test-api.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000/v1/api';

// Test data
let authToken = '';
let testUserId = '';
let testProductId = '';

// Helper function để gọi API
const apiCall = async (method, url, data = null, headers = {}) => {
  try {
    const config = {
      method,
      url: `${BASE_URL}${url}`,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`❌ API Error: ${method} ${url}`, error.response?.data || error.message);
    return null;
  }
};

// Test functions
const testLogin = async () => {
  console.log('🔐 Testing login...');
  const result = await apiCall('POST', '/login', {
    email: 'test1@example.com',
    password: 'password123'
  });
  
  if (result && result.success) {
    authToken = result.data.token;
    testUserId = result.data.user.id;
    console.log('✅ Login successful');
    return true;
  }
  return false;
};

const testGetProducts = async () => {
  console.log('📦 Testing get products...');
  const result = await apiCall('GET', '/products');
  
  if (result && result.success && result.data.products.length > 0) {
    testProductId = result.data.products[0]._id;
    console.log(`✅ Got ${result.data.products.length} products`);
    return true;
  }
  return false;
};

const testAddToFavorites = async () => {
  console.log('❤️ Testing add to favorites...');
  const result = await apiCall('POST', `/products/${testProductId}/favorite`, null, {
    'Authorization': `Bearer ${authToken}`
  });
  
  if (result && result.success) {
    console.log('✅ Added to favorites');
    return true;
  }
  return false;
};

const testGetFavorites = async () => {
  console.log('❤️ Testing get favorites...');
  const result = await apiCall('GET', '/products/favorites', null, {
    'Authorization': `Bearer ${authToken}`
  });
  
  if (result && result.success) {
    console.log(`✅ Got ${result.data.products.length} favorite products`);
    return true;
  }
  return false;
};

const testRemoveFromFavorites = async () => {
  console.log('💔 Testing remove from favorites...');
  const result = await apiCall('DELETE', `/products/${testProductId}/favorite`, null, {
    'Authorization': `Bearer ${authToken}`
  });
  
  if (result && result.success) {
    console.log('✅ Removed from favorites');
    return true;
  }
  return false;
};

const testUpdateProductView = async () => {
  console.log('👁️ Testing update product view...');
  const result = await apiCall('GET', `/products/${testProductId}/view`, null, {
    'Authorization': `Bearer ${authToken}`
  });
  
  if (result && result.success) {
    console.log('✅ Updated product view');
    return true;
  }
  return false;
};

const testGetViewedProducts = async () => {
  console.log('📚 Testing get viewed products...');
  const result = await apiCall('GET', '/products/viewed', null, {
    'Authorization': `Bearer ${authToken}`
  });
  
  if (result && result.success) {
    console.log(`✅ Got ${result.data.products.length} viewed products`);
    return true;
  }
  return false;
};

const testGetSimilarProducts = async () => {
  console.log('🔗 Testing get similar products...');
  const result = await apiCall('GET', `/products/${testProductId}/similar`);
  
  if (result && result.success) {
    console.log(`✅ Got ${result.data.length} similar products`);
    return true;
  }
  return false;
};

const testIncrementPurchaseCount = async () => {
  console.log('🛒 Testing increment purchase count...');
  const result = await apiCall('POST', `/products/${testProductId}/purchase`);
  
  if (result && result.success) {
    console.log('✅ Incremented purchase count');
    return true;
  }
  return false;
};

const testIncrementCommentCount = async () => {
  console.log('💬 Testing increment comment count...');
  const result = await apiCall('POST', `/products/${testProductId}/comment`);
  
  if (result && result.success) {
    console.log('✅ Incremented comment count');
    return true;
  }
  return false;
};

// Main test function
const runTests = async () => {
  console.log('🚀 Starting API tests...\n');
  
  const tests = [
    { name: 'Login', fn: testLogin },
    { name: 'Get Products', fn: testGetProducts },
    { name: 'Add to Favorites', fn: testAddToFavorites },
    { name: 'Get Favorites', fn: testGetFavorites },
    { name: 'Remove from Favorites', fn: testRemoveFromFavorites },
    { name: 'Update Product View', fn: testUpdateProductView },
    { name: 'Get Viewed Products', fn: testGetViewedProducts },
    { name: 'Get Similar Products', fn: testGetSimilarProducts },
    { name: 'Increment Purchase Count', fn: testIncrementPurchaseCount },
    { name: 'Increment Comment Count', fn: testIncrementCommentCount }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      console.error(`❌ Test ${test.name} failed:`, error.message);
      failed++;
    }
    console.log(''); // Empty line for readability
  }
  
  console.log('📊 Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed!');
  } else {
    console.log('\n⚠️ Some tests failed. Check the logs above.');
  }
};

// Run tests
runTests().catch(console.error);
