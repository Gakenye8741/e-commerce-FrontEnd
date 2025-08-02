import Navbar from "../components/Navbar"
import FeatureHighlights from "../Home-Components/FeatureHighlights"
import HeroCarousel from "../Home-Components/Hero-section"


const Home = () => {
  return (
   <>
     <Navbar/>
     <HeroCarousel/>
     <FeatureHighlights/>
   </>
  )
}

export default Home