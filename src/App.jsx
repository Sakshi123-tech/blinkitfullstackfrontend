
import { Outlet, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import toast, { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import fetchUserDetails from './utils/fetchUserDetails';
import { setUserDetails } from './store/userSlice';
import { setAllCategory, setAllSubCategory, setLoadingCategory } from './store/productSlice';
import { useDispatch } from 'react-redux';
import Axios from './utils/Axios';
import SummaryApi from './common/SummaryApi';
import GlobalProvider from './provider/GlobalProvider';
import CartMobileLink from './components/CartMobile';

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  const fetchUser = async () => {
    try {
      const userData = await fetchUserDetails();

      // ✅ FIX: Safely check if data exists
      if (userData && userData.data) {
        dispatch(setUserDetails(userData.data));
      } else {
        if (!userData) {
  // Only show warning if token exists but request failed
  if (localStorage.getItem("accesstoken")) {
    console.warn("User is not logged in or token is invalid");
  }
}

      }
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  };

  const fetchCategory = async () => {
    try {
      dispatch(setLoadingCategory(true));
      const response = await Axios({ ...SummaryApi.getCategory });
      const { data: responseData } = response;

      if (responseData.success) {
        dispatch(setAllCategory(responseData.data.sort((a, b) => a.name.localeCompare(b.name))));
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      dispatch(setLoadingCategory(false));
    }
  };

  const fetchSubCategory = async () => {
    try {
      const response = await Axios({ ...SummaryApi.getSubCategory });
      const { data: responseData } = response;

      if (responseData.success) {
        dispatch(setAllSubCategory(responseData.data.sort((a, b) => a.name.localeCompare(b.name))));
      }
    } catch (error) {
      console.error("Failed to fetch subcategories:", error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchCategory();
    fetchSubCategory();
  }, []);

  return (
    <GlobalProvider>
      <Header />
      <main className='min-h-[78vh]'>
        <Outlet />
      </main>
      <Footer />
      <Toaster />
      {location.pathname !== '/checkout' && <CartMobileLink />}
    </GlobalProvider>
  );
}

export default App;
