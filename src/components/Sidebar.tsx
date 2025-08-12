import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MdDashboard, MdShoppingCart, MdLogout, MdProductionQuantityLimits, MdArrowBack } from 'react-icons/md';
import './styles.css';
import { AuthContext } from "../context/auth-context";
import { useContext } from 'react';
//, MdSettings, MdPeople
const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Exact matching for dashboard, startsWith for other pages
  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === path ? 'active-link' : '';
    }
    return location.pathname.startsWith(path) ? 'active-link' : '';
  };

  return (
    <div className="sidebar">
      <button className="back-button" onClick={() => navigate('/')}>
        <MdArrowBack />
      </button>
      <div className="profile-section">
        <div className="profile-img"></div>
        <p className="profile-name">YGAMES</p>
        <p className="profile-email">admin</p>
      </div>
      <nav>
        <Link to="/admin" className={isActive('/admin')}> <MdDashboard /> Dashboard </Link>
        <Link to="/admin/products" className={isActive('/admin/products')}> <MdProductionQuantityLimits /> Products </Link>
        <Link to="/admin/orders" className={isActive('/admin/orders')}> <MdShoppingCart /> Orders </Link>
        {/* <Link to="/admin/users" className={isActive('/admin/users')}> <MdPeople /> Users </Link>
        <Link to="/admin/settings" className={isActive('/admin/settings')}> <MdSettings /> Settings </Link> */}
        <Link to="/" onClick={handleLogout} className={`logout-button ${isActive('/logout')}`}>
          <MdLogout /> Logout
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;