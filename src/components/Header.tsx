import {  MdSearch } from 'react-icons/md';
import './styles.css';

interface HeaderProps {
  onSearch: (query: string) => void;
}

const Header = ({ onSearch }: HeaderProps) => {
  return (
    <header className="main-header">
      <div className="search-bar">
        <MdSearch className="search-icon" />
        <input 
          type="text" 
          placeholder="Search..." 
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </header>
  );
};

export default Header;
