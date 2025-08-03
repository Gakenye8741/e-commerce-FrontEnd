import Navbar from "../components/Navbar"
import FeatureHighlights from "../Home-Components/FeatureHighlights"
import HeroCarousel from "../Home-Components/Hero-section"
import NewArrivals from "../Home-Components/NewArrivals"
import CategoriesGrid from "./CategoryPages/CategoryGrid"


const Home = () => {
  return (
   <>
     <Navbar/>
     <HeroCarousel/>
     <FeatureHighlights/>
     <CategoriesGrid/>
     <NewArrivals />
   </>
  )
}

export default Home