import '../styles/Homepage.css';
import Caroussel from '../components/Carousel';
import Categories from '../components/Categories';
import Homeproducts from '../components/Homeproducts';
import Footer from '../components/Footer';



const HomePage = () => {
    return (
        <div>     
            <div className='searchbar-space'>
            </div>
            <div className="home-page">
                <Caroussel />
                <Categories/>
                <Homeproducts/>
                <Footer/>
                
            </div>
        </div>

    );
}
export default HomePage;