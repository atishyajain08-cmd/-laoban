import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/layout/Layout';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';

function ScrollToTop() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}

function AppRoutes() {
  useSmoothScroll();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <ScrollToTop />
            <Home />
          </Layout>
        }
      />
      <Route
        path="/shop"
        element={
          <Layout>
            <ScrollToTop />
            <Shop />
          </Layout>
        }
      />
      <Route
        path="/product/:slug"
        element={
          <Layout>
            <ScrollToTop />
            <ProductDetail />
          </Layout>
        }
      />
      <Route
        path="/cart"
        element={
          <Layout>
            <ScrollToTop />
            <Cart />
          </Layout>
        }
      />
      <Route
        path="/wishlist"
        element={
          <Layout>
            <ScrollToTop />
            <Wishlist />
          </Layout>
        }
      />
      <Route
        path="/checkout"
        element={
          <Layout>
            <ScrollToTop />
            <Checkout />
          </Layout>
        }
      />
      <Route
        path="/about"
        element={
          <Layout>
            <ScrollToTop />
            <About />
          </Layout>
        }
      />
      <Route
        path="/login"
        element={
          <Layout>
            <ScrollToTop />
            <Login />
          </Layout>
        }
      />
      <Route
        path="/signup"
        element={
          <Layout>
            <ScrollToTop />
            <Signup />
          </Layout>
        }
      />
    </Routes>
  );
}

// On GitHub Pages the app is served from "/laoban/", so React Router needs the
// matching basename. import.meta.env.BASE_URL is "/laoban/" in prod, "/" in dev.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <AppRoutes />
    </BrowserRouter>
  );
}
