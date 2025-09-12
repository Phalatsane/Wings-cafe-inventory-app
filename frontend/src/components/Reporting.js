import React, { useEffect, useState } from "react";

const backendURL = "http://localhost:5000";
const LOW_STOCK_THRESHOLD = 10; // you can adjust this

function Reporting() {
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const resProducts = await fetch(`${backendURL}/products`);
      const productsData = await resProducts.json();

      const resSales = await fetch(`${backendURL}/sales`);
      const salesData = await resSales.json();

  setProducts(productsData);
  setTransactions(Array.isArray(salesData) ? salesData : (salesData.transactions || []));
    } catch (err) {
      console.error("Failed to fetch reporting data:", err);
    }
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : "Unknown";
  };

  const getProductPrice = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.price : 0;
  };

  const totalProfit = transactions.reduce(
    (sum, t) => sum + t.quantity * getProductPrice(t.productId),
    0
  );

  const lowStockProducts = products.filter(p => p.quantity <= LOW_STOCK_THRESHOLD);

  // Calculate total quantity sold per product
  const productSalesSummary = products.map(product => {
    const totalSold = transactions
      .filter(t => t.productId === product.id)
      .reduce((sum, t) => sum + t.quantity, 0);
    return { ...product, totalSold };
  });

  // Calculate total sales count and total revenue
  const totalSalesCount = transactions.length;
  const totalRevenue = transactions.reduce((sum, t) => sum + t.quantity * getProductPrice(t.productId), 0);

  // Inline styles for a modern, clean look
  // Girly color palette: pinks, purples, soft pastels
  const containerStyle = {
    padding: "32px 16px",
    fontFamily: "'Segoe UI', Arial, sans-serif",
    background: "#fff0f6",
    minHeight: "100vh"
  };
  const headingStyle = {
    color: "#b83280",
    marginBottom: "16px",
    letterSpacing: "1px",
    fontWeight: 700
  };
  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
    boxShadow: "0 2px 8px rgba(186,104,200,0.10)",
    marginBottom: "32px",
    borderRadius: "10px",
    overflow: "hidden"
  };
  const thStyle = {
    background: "linear-gradient(90deg, #f06292 0%, #ba68c8 100%)",
    color: "#fff",
    padding: "12px 8px",
    fontWeight: 600,
    border: "1px solid #f8bbd0",
    fontSize: "16px"
  };
  const tdStyle = {
    padding: "10px 8px",
    border: "1px solid #f8bbd0",
    textAlign: "center",
    background: "#fce4ec",
    fontSize: "15px"
  };
  const summaryBoxStyle = {
    background: "#f8bbd0",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(186,104,200,0.10)",
    padding: "18px 20px",
    marginBottom: "24px",
    display: "inline-block",
    fontSize: "17px",
    color: "#6d2077",
    border: "2px solid #f06292"
  };
  const refreshBtnStyle = {
    marginBottom: "20px",
    padding: "8px 18px",
    border: "none",
    borderRadius: "4px",
    background: "linear-gradient(90deg, #f06292 0%, #ba68c8 100%)",
    color: "#fff",
    fontWeight: 500,
    cursor: "pointer",
    fontSize: "15px",
    boxShadow: "0 2px 8px rgba(186,104,200,0.10)"
  };
  const lowStockListStyle = {
    background: "#f8bbd0",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(186,104,200,0.10)",
    padding: "12px 18px",
    marginBottom: "24px",
    maxWidth: "400px",
    color: "#b83280",
    border: "1.5px solid #f06292"
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Sales Reporting & Inventory Alerts</h2>
      <button onClick={fetchData} style={refreshBtnStyle}>Refresh</button>

      <div style={summaryBoxStyle}>
        <strong>Total Profit:</strong> R{totalProfit.toFixed(2)}<br />
        <strong>Total Revenue:</strong> R{totalRevenue.toFixed(2)}<br />
        <strong>Total Sales:</strong> {totalSalesCount}
      </div>

      <h3 style={{...headingStyle, fontSize: "20px", marginBottom: "10px"}}>Product Sales Summary</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Product</th>
            <th style={thStyle}>Total Quantity Sold</th>
            <th style={thStyle}>Current Stock</th>
          </tr>
        </thead>
        <tbody>
          {productSalesSummary.map(p => (
            <tr key={p.id}>
              <td style={tdStyle}>{p.name}</td>
              <td style={tdStyle}>{p.totalSold}</td>
              <td style={tdStyle}>{p.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{...headingStyle, fontSize: "20px", marginBottom: "10px"}}>Low Stock Products (≤ {LOW_STOCK_THRESHOLD})</h3>
      {lowStockProducts.length === 0 ? (
        <p style={lowStockListStyle}>All products have sufficient stock.</p>
      ) : (
        <ul style={lowStockListStyle}>
          {lowStockProducts.map(p => (
            <li key={p.id}>{p.name} – Stock: {p.quantity}</li>
          ))}
        </ul>
      )}

      <h3 style={{...headingStyle, fontSize: "20px", marginBottom: "10px"}}>Sales Details</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Product</th>
            <th style={thStyle}>Quantity Sold</th>
            <th style={thStyle}>Price per Unit</th>
            <th style={thStyle}>Total Sale</th>
            <th style={thStyle}>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr><td style={tdStyle} colSpan="5">No sales recorded</td></tr>
          ) : (
            <>
              {transactions.map(t => {
                const price = getProductPrice(t.productId);
                return (
                  <tr key={t.id}>
                    <td style={tdStyle}>{getProductName(t.productId)}</td>
                    <td style={tdStyle}>{t.quantity}</td>
                    <td style={tdStyle}>R{price.toFixed(2)}</td>
                    <td style={tdStyle}>R{(t.quantity * price).toFixed(2)}</td>
                    <td style={tdStyle}>{new Date(t.date).toLocaleString()}</td>
                  </tr>
                );
              })}
              <tr style={{ fontWeight: 'bold', background: '#f7e8ff' }}>
                <td style={tdStyle}>Total</td>
                <td style={tdStyle}>{transactions.reduce((sum, t) => sum + t.quantity, 0)}</td>
                <td style={tdStyle} colSpan="2">Total Revenue: R{totalRevenue.toFixed(2)}</td>
                <td style={tdStyle}></td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Reporting;
