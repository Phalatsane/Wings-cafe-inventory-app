import React, { useEffect } from 'react';
import '../styles/Dashboard.css';

function Dashboard({ data }) {
  const products = data.products || [];
  const sales = data.sales || [];

  // Metrics
  const totalProducts = products.length;
  const lowStock = products.filter(p => p.quantity < 10).length;
  const totalSalesCount = sales.length;

  // Get product price by ID
  const getProductPrice = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.price : 0;
  };

  // Total revenue
  const totalRevenue = sales.reduce(
    (sum, s) => sum + (s.quantity * (s.price || getProductPrice(s.productId))),
    0
  );

  // Preload images to reduce blinking
  useEffect(() => {
    products.forEach(p => {
      const img = new Image();
      img.src = `${process.env.PUBLIC_URL}/images/${encodeURIComponent(p.image || 'default.jpg')}`;
    });
  }, [products]);

  return (
    <div className="dashboard-container">
      {/* Metrics */}
      <div className="metrics">
        <div className="metric card-rev">
          <div className="m-label">Revenue</div>
          <div className="m-value">R{totalRevenue.toFixed(2)}</div>
        </div>
        <div className="metric card-sales">
          <div className="m-label">Sales</div>
          <div className="m-value">{totalSalesCount}</div>
        </div>
        <div className="metric card-prod">
          <div className="m-label">Products</div>
          <div className="m-value">{totalProducts}</div>
        </div>
        <div className="metric card-low">
          <div className="m-label">Low Stock</div>
          <div className="m-value">{lowStock}</div>
        </div>
      </div>

      {/* Product List */}
      <h2>All Products</h2>
      <div className="product-grid">
        {products.map(product => {
          // Build image URL
          const imageUrl = product.image
            ? `${process.env.PUBLIC_URL}/images/${encodeURIComponent(product.image)}`
            : `${process.env.PUBLIC_URL}/images/default.jpg`;

          return (
            <div className="product-card" key={product.id}>
              <img
                src={imageUrl}
                alt={product.name}
                className="product-img"
                onError={(e) => {
                  // fallback to default image if image fails to load
                  if (!e.target.dataset.error) {
                    e.target.dataset.error = true;
                    e.target.src = `${process.env.PUBLIC_URL}/images/default.jpg`;
                  }
                }}
              />
              <h3 className="product-name">{product.name}</h3>
              <p className="desc">{product.description}</p>
              <div className="meta">
                Price: <span className="price">R{product.price}</span>
                <br />
                Quantity: <span className="quantity">{product.quantity}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Dashboard;
