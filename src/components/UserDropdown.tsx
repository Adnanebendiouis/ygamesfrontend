import { AuthContext } from "../context/auth-context";// Adjust the path as needed
import '../styles/UserDropdown.css'; // Assuming you have a CSS file for styling
import { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const handleProfile = () => {
    setIsOpen(false);
    navigate('/user');
  };

  if (!isAuthenticated) return null;

  return (
    <div  ref={dropdownRef}>
    <div onClick={toggleDropdown}>
      <AccountCircleIcon  className="icon" />
    </div>
      
      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-item" onClick={handleProfile}>
            <PersonIcon className="dropdown-icon" />
            <span>Profile</span>
          </div>
          <div className="dropdown-item" onClick={handleLogout}>
            <LogoutIcon className="dropdown-icon" />
            <span>Logout</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;