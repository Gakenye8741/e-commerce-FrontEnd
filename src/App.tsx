

import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/Login';
import Register from './pages/Register';
import EmailVerification from './pages/EmailVerification';
import { Shop } from './pages/Shop';
import { AdminDashBoard } from './pages/AdminDashBoard';
import About from './pages/About';
import ProtectedRoutes from './components/ProtectedRoutes';
import ManageCategories from './Dashboards/AdminDashboard/manageCategories';
import ManageSubcategories from './Dashboards/AdminDashboard/SubCategories';
import ManageProducts from './Dashboards/AdminDashboard/ManageProducts';
import ManageMedia from './Dashboards/AdminDashboard/ManageMedia';
import ProductDetails from './pages/ProductDetails';

function App() {
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home/>
    },
    {
    path: "/Login",
    element: <LoginPage/>
    },
    {
      path: '/Register',
      element: <Register/>
    }
    ,
    {
      path: "/Verify-Email",
      element: <EmailVerification/>
    },{
      path: "/Shop",
      element: <Shop/>
    }
    ,{
      path: "/About",
      element: <About/>
    }
    ,{
      path: "/products/:productId",
      element: <ProductDetails/>
    },
    {
      path: 'admindashboard',
      element: (
        <ProtectedRoutes>
          <AdminDashBoard />
        </ProtectedRoutes>
      ),
      
      children: [
        { path: 'ManageCategories', element: <ManageCategories /> },
        { path: 'ManageSubCategories', element: <ManageSubcategories/> },
        { path: 'ManageProducts', element: <ManageProducts/> },
        { path: 'ManageImages', element: <ManageMedia /> },
    
        
      ],
    },
  ])

  return (
  <>
    <RouterProvider router={router}/>
  </>
  )
}

export default App
