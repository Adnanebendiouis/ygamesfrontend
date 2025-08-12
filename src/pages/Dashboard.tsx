// Dashboard.tsx
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../constants/baseUrl";
import { fetchWithCSRF } from "../utils/csrf";
import "../styles/dashboard.css";
import { FaUsers, FaBox, FaMoneyBillWave, FaShoppingCart } from "react-icons/fa";

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
}

interface OrderSummary {
  order_id: string;
  client_name: string;
  total: number;
}

const Dashboard = () => {
  const [userCount, setUserCount] = useState<number | null>(null);
  const [orderCount, setOrderCount] = useState<number | null>(null);
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null);
  const [totalProducts, setTotalProducts] = useState<number | null>(null);
  const [ordersSummary, setOrdersSummary] = useState<OrderSummary[]>([]);
  const [homeProducts, setHomeProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          userRes,
          orderRes,
          revenueRes,
          productsRes,
          summaryRes,
          homeRes,
        ] = await Promise.all([
          fetchWithCSRF(`${API_BASE_URL}/api/user-count/`),
          fetchWithCSRF(`${API_BASE_URL}/api/order-count/`),
          fetchWithCSRF(`${API_BASE_URL}/api/total-revenue/`),
          fetchWithCSRF(`${API_BASE_URL}/api/products-total/`),
          fetchWithCSRF(`${API_BASE_URL}/api/orders-summary/`),
          fetchWithCSRF(`${API_BASE_URL}/api/home/`),
        ]);

        const userData = await userRes.json();
        const orderData = await orderRes.json();
        const revenueData = await revenueRes.json();
        const productsData = await productsRes.json();
        const summaryData = await summaryRes.json();
        const homeData = await homeRes.json();
        
        setUserCount(userData.user_count);
        setOrderCount(orderData.order_count);
        setTotalRevenue(revenueData.total_revenue);
        setTotalProducts(productsData.total_products);
        setOrdersSummary(summaryData);
        setHomeProducts(homeData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div>Loading Dashboard...</div>;

  return (
    <div className="dashboard-container">
      {/* TOP STATS */}
      <div className="stats-grid">
        <div className="stat-card">
          <FaUsers />
          <h3>Users</h3>
          <p>{userCount}</p>
        </div>
        <div className="stat-card">
          <FaShoppingCart />
          <h3>Orders</h3>
          <p>{orderCount}</p>
        </div>
        <div className="stat-card">
          <FaMoneyBillWave />
          <h3>Revenue</h3>
          <p>{totalRevenue} DA</p>
        </div>
        <div className="stat-card">
          <FaBox />
          <h3>Products</h3>
          <p>{totalProducts}</p>
        </div>
      </div>

      {/* ORDER HISTORY & TOP PRODUCTS */}
      <div className="sections-grid">
        <div className="section-box">
          <h2>Order History</h2>
          <div className="scrollable-section">
            <table className="order-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Client</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {ordersSummary.map((order) => (
                  <tr key={order.order_id}>
                    <td>{order.order_id}</td>
                    <td>{order.client_name}</td>
                    <td>{order.total} DA</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="section-box">
          <h2>Top Products</h2>
          <div className="scrollable-section top-products">
            {homeProducts.map((product) => (
              <div key={product.id} className="product-card">
                <img src={product.image} alt={product.name} />
                <div className="product-info">
                  <h4>{product.name}</h4>
                  <small>ACTION</small>
                  <p>{product.price} DA</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
