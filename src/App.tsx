import { memo } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Layout from './layout/Layout';
import Home from './pages/Home/Home';
import Contact from './pages/Contact/Contact';
import About from './pages/About/About';
import Signup from './pages/Signup/Signup';
import Wishlist from './pages/Wishlist/Wishlist';
import Login from './pages/Login/Login';
import Cart from './pages/Cart/Cart';
import Profile from './pages/Profile/Profile';
import ExploreProducts from './pages/ExploreProducts/ExploreProducts';
import ProductDetails from './pages/ProductDetails/ProductDetails';
import Checkout from './pages/Checkout/Checkout';
import ProtectedRoute from './components/ProtectedRoute';
import AuthRoute from './components/AuthRoute';

const App = memo(() => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "home",
          element: <Home />,
        },
        {
          path: "cart",
          element: <Cart />,
        },
        {
          path: "contact",
          element: <Contact />,
        },
        {
          path: "about",
          element: <About />,
        },
        {
          path: "wishlist",
          element: <Wishlist />,
        },
        {
          path: "explore-products",
          element: <ExploreProducts />,
        },
        {
          path: "product/:id",
          element: <ProductDetails />,
        },
        {
          path: "checkout",
          element: <Checkout />,
        },
        {
          path: "signup",
          element: (
            <AuthRoute>
              <Signup />
            </AuthRoute>
          ),
        },
        {
          path: "login",
          element: (
            <AuthRoute>
              <Login />
            </AuthRoute>
          ),
        },
        {
          path: "profile",
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]); 
  return <RouterProvider router={router} />
})

export default App