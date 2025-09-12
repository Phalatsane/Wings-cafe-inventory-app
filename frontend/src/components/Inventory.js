import React, { useEffect, useState } from "react";

const backendURL = "http://localhost:5000";

function Inventory({ refresh }) {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [stockToAdd, setStockToAdd] = useState("");
  const [stockLog, setStockLog] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchStockLog();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch(`${backendURL}/products`);
    setProducts(await res.json());
  };

  const fetchStockLog = async () => {
    const res = await fetch(`${backendURL}/stock-transactions`);
    setStockLog(await res.json());
  };

  const handleAddStock = async () => {
    if (!selectedProduct || !stockToAdd || Number(stockToAdd) <= 0) return;

    await fetch(`${backendURL}/products/${selectedProduct}/add-stock`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: Number(stockToAdd) })
    });

    setStockToAdd("");
    fetchProducts();
    fetchStockLog();
    if (refresh) refresh();
  };

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
  const formStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    alignItems: "center",
    background: "#fff",
    padding: "20px 16px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(186,104,200,0.10)",
    marginBottom: "28px",
    maxWidth: "900px"
  };
  const inputStyle = {
    padding: "8px 10px",
    border: "1px solid #f8bbd0",
    borderRadius: "4px",
    fontSize: "15px",
    minWidth: "120px",
    background: "#fff0f6"
  };
  const selectStyle = {
    ...inputStyle,
    minWidth: "160px"
  };
  const actionBtnStyle = {
    margin: "0 4px",
    padding: "6px 14px",
    border: "none",
    borderRadius: "4px",
    background: "linear-gradient(90deg, #f06292 0%, #ba68c8 100%)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 500,
    transition: "background 0.2s",
    fontSize: "15px",
    boxShadow: "0 2px 8px rgba(186,104,200,0.10)"
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Inventory Management</h2>

      <form style={formStyle} onSubmit={e => { e.preventDefault(); handleAddStock(); }}>
        <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)} style={selectStyle}>
          <option value="">Select a product</option>
          {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>

        <input
          type="number"
          placeholder="Quantity to add"
          value={stockToAdd}
          onChange={e => setStockToAdd(e.target.value)}
          style={inputStyle}
        />

        <button type="submit" style={actionBtnStyle}>Add Stock</button>
      </form>

      <h3 style={{...headingStyle, fontSize: "20px", marginBottom: "10px"}}>Stock Additions Log</h3>
      <table style={tableStyle}>
        <thead>
          <tr><th style={thStyle}>Product</th><th style={thStyle}>Quantity Added</th><th style={thStyle}>Date/Time</th></tr>
        </thead>
        <tbody>
          {stockLog.length === 0 ? (
            <tr><td style={tdStyle} colSpan="3">No stock added yet.</td></tr>
          ) : stockLog.map(log => (
            <tr key={log.id}>
              <td style={tdStyle}>{log.productName}</td>
              <td style={tdStyle}>{log.quantity}</td>
              <td style={tdStyle}>{new Date(log.date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Inventory;
