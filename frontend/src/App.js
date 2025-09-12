import React, { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import ProductManagement from './components/ProductManagement';
import Sales from './components/Sales';
import Inventory from './components/Inventory';
import Reporting from './components/Reporting';
import axios from 'axios';

function App() {
  const [data, setData] = useState({ products: [], transactions: [] });
  const [module, setModule] = useState('dashboard');

  // Render backend URL
  const backendURL = 'https://wings-cafe-inventory-app-46.onrender.com';

  const fetchData = async () => {
    try {
      // Fetch products and transactions separately
      const [productsRes, transactionsRes] = await Promise.all([
        axios.get(`${backendURL}/products`),
        axios.get(`${backendURL}/transactions`)
      ]);

      setData({
        products: productsRes.data,
        transactions: transactionsRes.data
      });
    } catch (e) {
      console.error('Error fetching data for dashboard:', e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <header className='navbar'>
        <div className='navbar-title'>Wings Cafe Inventory</div>
        <nav>
          <ul className='navbar-list'>
            <li>
              <button
                className={'nav-btn ' + (module === 'dashboard' ? 'active' : '')}
                onClick={() => setModule('dashboard')}
              >
                Dashboard
              </button>
            </li>
            <li>
              <button
                className={'nav-btn ' + (module === 'products' ? 'active' : '')}
                onClick={() => setModule('products')}
              >
                Product Management
              </button>
            </li>
            <li>
              <button
                className={'nav-btn ' + (module === 'sales' ? 'active' : '')}
                onClick={() => setModule('sales')}
              >
                Sales
              </button>
            </li>
            <li>
              <button
                className={'nav-btn ' + (module === 'inventory' ? 'active' : '')}
                onClick={() => setModule('inventory')}
              >
                Inventory
              </button>
            </li>
            <li>
              <button
                className={'nav-btn ' + (module === 'reporting' ? 'active' : '')}
                onClick={() => setModule('reporting')}
              >
                Reporting
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <main className='main-content'>
        {module === 'dashboard' && <Dashboard data={data} />}
        {module === 'products' && <ProductManagement backendURL={backendURL} />}
        {module === 'sales' && <Sales refresh={fetchData} backendURL={backendURL} />}
        {module === 'inventory' && <Inventory refresh={fetchData} backendURL={backendURL} />}
        {module === 'reporting' && <Reporting data={data} backendURL={backendURL} />}
      </main>

      <footer className='footer' style={{ textAlign: 'center', padding: '16px 0' }}>
        <div>
          Contact me:{' '}
          <a href="mailto:phalatsanemolise30@gmail.com">phalatsanemolise30@gmail.com</a> | WhatsApp:{' '}
          <a href="https://wa.me/26662055361" target="_blank" rel="noopener noreferrer">
            +26662055361
          </a>
        </div>
        <div style={{ marginTop: '4px' }}>© {new Date().getFullYear()} Wings Cafe</div>
      </footer>
    </div>
  );
}

export default App;
