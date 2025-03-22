import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";


// Layout
import NavBar from "./layout/NavBar";
import Footer from "./layout/Footer";

// Pages
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Contact from "./pages/Contact";

// Theme
import { ThemeProvider } from "./components/home/ThemeProvider";
import Tech from "./pages/Technology";
import Favorite from "./pages/Favorite";
import NewArrivals from "./components/catagories/NewArrivals";
import Men from "./components/catagories/Men";
import Women from "./components/catagories/Women";
import Kids from "./components/catagories/Kids";
import Sale from "./components/catagories/Sale";
import Profile from "./pages/Profile";
import OccasionProducts from "./components/catagories/OccasionProducts";  
import AllProducts from "./components/catagories/AllProducts";
  

function Layout() {
  const location = useLocation();


  // Hide Navbar and Footer on specific pages
  const hideNavAndFooter = [
    "/login",
    "/signup",
    "/checkout",
    "/verify-email",
    "/cart",
  ].includes(location.pathname);

  return (
    <>
      {!hideNavAndFooter && <NavBar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/occasion/:occasionName" element={<OccasionProducts />} />
        <Route path="/products" element={<AllProducts />} />

        <Route path="/tech" element={<Tech />} />
        <Route path="/favorite" element={<Favorite />} />
        <Route path="/new" element={<NewArrivals />} />
        <Route path="/men" element={<Men />} />
        <Route path="/women" element={<Women />} />
        <Route path="/kids" element={<Kids />} />
        <Route path="/sale" element={<Sale />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>

      {!hideNavAndFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout />
      </Router>
    </ThemeProvider>
  );
}

export default App;
