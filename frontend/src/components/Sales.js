import React, { useEffect, useState } from "react";

const backendURL = "http://localhost:5000";

function Sales({ refresh }) {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantityToSell, setQuantityToSell] = useState("");
  const [salesLog, setSalesLog] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchSalesLog();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch(`${backendURL}/products`);
    setProducts(await res.json());
  };

  const fetchSalesLog = async () => {
    const res = await fetch(`${backendURL}/sales`);
    setSalesLog(await res.json());
  };

  const handleRecordSale = async () => {
    if (!selectedProduct || !quantityToSell || Number(quantityToSell) <= 0) return;

    const res = await fetch(`${backendURL}/sales`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: selectedProduct, quantity: Number(quantityToSell) })
    });

    const data = await res.json();
    if (res.ok) {
      setQuantityToSell("");
      fetchProducts();
      fetchSalesLog();
      if (refresh) refresh();
    } else {
      alert(data.error || "Error recording sale");
    }
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
      <h2 style={headingStyle}>Record Sales</h2>

      <form style={formStyle} onSubmit={e => { e.preventDefault(); handleRecordSale(); }}>
        <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)} style={selectStyle}>
          <option value="">Select a product</option>
          {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>

        <input
          type="number"
          placeholder="Quantity to sell"
          value={quantityToSell}
          onChange={e => setQuantityToSell(e.target.value)}
          style={inputStyle}
        />

        <button type="submit" style={actionBtnStyle}>Record Sale</button>
      </form>

      <h3 style={{...headingStyle, fontSize: "20px", marginBottom: "10px"}}>Sales Log</h3>
      <table style={tableStyle}>
        <thead>
          <tr><th style={thStyle}>Product</th><th style={thStyle}>Quantity Sold</th><th style={thStyle}>Date/Time</th></tr>
        </thead>
        <tbody>
          {salesLog.length === 0 ? (
            <tr><td style={tdStyle} colSpan="3">No sales recorded yet.</td></tr>
          ) : salesLog.map(sale => (
            <tr key={sale.id}>
              <td style={tdStyle}>{sale.productName}</td>
              <td style={tdStyle}>{sale.quantity}</td>
              <td style={tdStyle}>{new Date(sale.date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Sales;
