import { useState, useEffect } from "react";
import "../styles/UserPage.css";
import { fetchWithCSRF } from "../utils/csrf";
import { API_BASE_URL } from "../constants/baseUrl";
import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth-context";
import { useContext } from 'react';
// Fake user session (you will replace this later with real session fetch)
interface IUserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface IOrder {
  id: string;
  client: string;
  date_commande: string;
  total: string;
  status: string;
  full_name: string;
  phone: string;
  wilaya: string;
  type: string;
  commune: string;
  adresse: string;
  items: { produit_id: number; quantity: number; produit: { name: string }; prix_unit: number }[];
}

export default function UserPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState<IUserProfile | null>(null);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const navigate = useNavigate();

  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetchWithCSRF(`${API_BASE_URL}/api/profile/`);
        const ordersResponse = await fetchWithCSRF(`${API_BASE_URL}/api/client/orders/`);
        const data = await response.json();
        const ordersData = await ordersResponse.json();
        console.log("User profile fetched:", data);
        console.log("Orders fetched:", ordersData);
        // Update user session with fetched data
        setUser(data);
        setOrders(ordersData);

      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);


  return (
    <div className="user-page">
      <aside className="sidebar">
        <button className="back-button" onClick={() => navigate('/')}>
          <MdArrowBack />
        </button>
        <h2 className="sidebar-title">Account</h2>
        <nav>
          <ul>
            <li onClick={() => setActiveTab("profile")}>Profile Information</li>
            <li onClick={() => setActiveTab("orders")}>Order History</li>
            <li onClick={() => setActiveTab("password")}>Change Password</li>
            <li onClick={handleLogout}>Logout</li>
          </ul>
        </nav>
      </aside>

      <section className="main-content">
        {activeTab === "profile" && <ProfileInfo user={user} />}
        {activeTab === "orders" && <OrderHistory orders={orders} />}
        {activeTab === "password" && <ChangePassword />}
        {/* {activeTab === "delete" && <DeleteAccount />} */}
      </section>
    </div>
  );
}

function ProfileInfo({ user }: { user: IUserProfile | null }) {
  // const [form, setForm] = useState(user);

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   console.log(`Field ${e.target.name} changed to ${e.target.value}`);
  // };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   console.log("Updated Profile:");
  // };

  return (
    <div className="form">
      <h2>Profile Information</h2>
      <label>
        Username:
        <div className="name">{user?.username || "N/A"}</div>
      </label>
      <label>
        Email:
        <div className="name">{user?.email || "N/A"}</div>
      </label>
      <label>
        Name:
        <div className="name">{user?.first_name || "N/A"}</div>
      </label>
    </div>
  );
}

function OrderHistory({ orders }: { orders: IOrder[] }) {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
    <div className="table-wrapper1">
      <table className="order-table1">
        <thead>
          <tr>
            <th>Client</th>
            <th>Phone</th>
            <th>Total (DA)</th>
            <th>Status</th>
            <th>Type</th>
            <th>Wilaya</th>
            <th>Items</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.full_name}</td>
              <td>{order.phone}</td>
              <td>{Number(order.total).toLocaleString()} DA</td>
              <td >{order.status}</td>
              <td className="id-column">{order.type}</td>
              <td className="wilaya-column">{order.wilaya}</td>
                <td>
                {expandedOrderId === order.id ? (
                  <div className="expanded-order">
                  <ul className="item-list">
                    {order.items.map((item, index) => (
                    <li key={index} className="item">
                      <div className="item-info">
                      <span className="item-name">Product: {item.produit.name}</span>
                      <span className="item-quantity">Quantity: {item.quantity}</span>
                      <span className="item-price">Price: {Number(item.prix_unit).toLocaleString()} DA</span>
                      </div>
                    </li>
                    ))}
                  </ul>
                  <button className="modern-button1" onClick={() => toggleExpand(order.id)}>See Less</button>
                  </div>
                ) : (
                  <button className="modern-button" onClick={() => toggleExpand(order.id)}>See More</button>
                )}
                </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ChangePassword() {
  return (
    <form className="form">
      <h2>Change Password</h2>
      <label>
        Current Password:
        <input type="password" name="current" />
      </label>
      <label>
        New Password:
        <input type="password" name="new" />
      </label>
      <label>
        Confirm Password:
        <input type="password" name="confirm" />
      </label>
      <button type="submit">Change Password</button>
    </form>
  );
}

// function DeleteAccount() {
//   return (
//     <div className="danger-zone">
//       <h2>Delete Account</h2>
//       <p>This action is irreversible. All your data will be lost.</p>
//       <button className="danger" onClick={() => alert("Account Deleted")}>Delete My Account</button>
//     </div>
//   );
// }
