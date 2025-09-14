import React, { useState, useEffect } from "react";

const backendURL = "http://localhost:5000";

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    quantity: "",
    image: ""
  });
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editProduct, setEditProduct] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    quantity: "",
    image: ""
  });
  const handleEditChange = (e) => {
    setEditProduct({ ...editProduct, [e.target.name]: e.target.value });
  };

  const handleEditProduct = (product) => {
    setEditId(product.id);
    setEditProduct({ ...product });
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch(`${backendURL}/products/${editId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editProduct,
          price: Number(editProduct.price),
          quantity: Number(editProduct.quantity)
        })
      });
      setEditId(null);
      setEditProduct({
        name: "",
        description: "",
        category: "",
        price: "",
        quantity: "",
        image: ""
      });
      fetchProducts();
    } catch (err) {
      console.error("Failed to update product:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await fetch(`${backendURL}/products/${id}`, { method: "DELETE" });
      fetchProducts();
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  // Fetch products from backend
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${backendURL}/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  const handleChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${backendURL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newProduct,
          price: Number(newProduct.price),
          quantity: Number(newProduct.quantity)
        })
      });
      const data = await res.json();
      console.log(data.message);

      // Refresh products list
      fetchProducts();

      // Reset form
      setNewProduct({
        name: "",
        description: "",
        category: "",
        price: "",
        quantity: "",
        image: ""
      });
    } catch (err) {
      console.error("Failed to add product:", err);
    } finally {
      setLoading(false);
    }
  };

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
  const deleteBtnStyle = {
    ...actionBtnStyle,
    background: "#f06292"
  };
  const saveBtnStyle = {
    ...actionBtnStyle,
    background: "#ba68c8"
  };
  const cancelBtnStyle = {
    ...actionBtnStyle,
    background: "#f8bbd0",
    color: "#b83280"
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
    marginTop: "20px",
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
  const submitBtnStyle = {
    ...actionBtnStyle,
    background: loading ? "#f8bbd0" : "linear-gradient(90deg, #f06292 0%, #ba68c8 100%)",
    cursor: loading ? "not-allowed" : "pointer"
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Product Management</h2>

      <h3 style={{...headingStyle, fontSize: "20px", marginBottom: "10px"}}>Products List</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Description</th>
            <th style={thStyle}>Category</th>
            <th style={thStyle}>Price</th>
            <th style={thStyle}>Quantity</th>
            <th style={thStyle}>Image</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td style={tdStyle} colSpan="8">No products available</td>
            </tr>
          ) : (
            products.map((p) => {
              const isEditing = editId === p.id;
              return (
                <tr key={p.id}>
                  <td style={tdStyle}>{p.id}</td>
                  <td style={tdStyle}>{isEditing ? (
                    <input type="text" name="name" value={editProduct.name} onChange={handleEditChange} style={inputStyle} />
                  ) : p.name}</td>
                  <td style={tdStyle}>{isEditing ? (
                    <input type="text" name="description" value={editProduct.description} onChange={handleEditChange} style={inputStyle} />
                  ) : p.description}</td>
                  <td style={tdStyle}>{isEditing ? (
                    <input type="text" name="category" value={editProduct.category} onChange={handleEditChange} style={inputStyle} />
                  ) : p.category}</td>
                  <td style={tdStyle}>{isEditing ? (
                    <input type="number" name="price" value={editProduct.price} onChange={handleEditChange} style={inputStyle} />
                  ) : p.price}</td>
                  <td style={tdStyle}>{isEditing ? (
                    <input type="number" name="quantity" value={editProduct.quantity} onChange={handleEditChange} style={inputStyle} />
                  ) : p.quantity}</td>
                  <td style={tdStyle}>{isEditing ? (
                    <input type="text" name="image" value={editProduct.image} onChange={handleEditChange} style={inputStyle} />
                  ) : p.image}</td>
                  <td style={tdStyle}>
                    {isEditing ? (
                      <>
                        <button onClick={handleUpdateProduct} disabled={loading} style={saveBtnStyle}>Save</button>
                        <button onClick={() => setEditId(null)} disabled={loading} style={cancelBtnStyle}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEditProduct(p)} disabled={loading} style={actionBtnStyle}>Edit</button>
                        <button onClick={() => handleDeleteProduct(p.id)} disabled={loading} style={deleteBtnStyle}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      <form onSubmit={handleAddProduct} style={formStyle}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newProduct.name}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={newProduct.description}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={newProduct.category}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newProduct.price}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={newProduct.quantity}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="text"
          name="image"
          placeholder="Image filename"
          value={newProduct.image}
          onChange={handleChange}
          style={inputStyle}
        />
        <button type="submit" disabled={loading} style={submitBtnStyle}>
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}

export default ProductManagement;
