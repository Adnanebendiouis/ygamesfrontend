import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { AuthProvider } from './context/AuthProvider';
import Order from './pages/Orders';
import Products from './pages/Products';
import './App.css';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import ProductDetail from './pages/ProductDetail';
import Category from './pages/Category';
import Login from './pages/Login';
import Register from './pages/SignUp';
import CartPage from './pages/CartPage';
import PrivateRoute from './routes/PrivateRoute';
import Checkout from './pages/Checkout';
import Search from './pages/Search';
import Dashboard from './pages/Dashboard';
import ErrorPage from './pages/ErorePgage';
import UserPage from './pages/UseraPage';



function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/admin/*"
            element={
              <PrivateRoute>
                <div className=" zoom-75">
                  <Sidebar />
                  <div  style={{ marginLeft: '240px' }}>

                    <Routes>
                      <Route path="" element={<Dashboard />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="orders" element={<Order />} />
                    </Routes>
                  </div>
                </div>
              </PrivateRoute>
            }
          />
          <Route path="/" element={
            <div className='zoom-75'>
              <Navbar />
              <HomePage />
            </div>
          }
          />
          <Route path="/product/:id" element={
            <div className='zoom-75'>
              <Navbar />
              <ProductDetail />
            </div>
          }
          />
          <Route path="/Category/:category" element={
            <div className='zoom-75'>
              <Navbar />
              <Category />
            </div>
          }
          />
          <Route path="/Search/:search" element={
            <div className='zoom-75'>
              <Navbar />
              <Search />
            </div>
          }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/Cart" element={
            <div className='zoom-75'>
              <Navbar />
              <CartPage />
            </div>
          }
          />
          <Route
            path="/checkout"
            element={
              <PrivateRoute>
                <Checkout />
              </PrivateRoute>
            }
          />
          <Route
            path="/user"
            element={
              <PrivateRoute>
                <UserPage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={
            <div className='zoom-75' style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' , }}>
              <Navbar />
              <ErrorPage />
            </div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
