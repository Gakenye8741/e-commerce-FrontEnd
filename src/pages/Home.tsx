import Navbar from "../components/Navbar"
import FeatureHighlights from "../Home-Components/FeatureHighlights"
import HeroCarousel from "../Home-Components/Hero-section"
import NewArrivals from "../Home-Components/NewArrivals"


const Home = () => {
  return (
   <>
     <Navbar/>
     <HeroCarousel/>
     <FeatureHighlights/>
     <NewArrivals />
   </>
  )
}

export default Home