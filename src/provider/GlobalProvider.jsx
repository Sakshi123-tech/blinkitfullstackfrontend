// import { createContext,useContext, useEffect, useState } from "react";
// import Axios from "../utils/Axios";
// import SummaryApi from "../common/SummaryApi";
// import { useDispatch, useSelector } from "react-redux";
// import { handleAddItemCart } from "../store/cartProduct";
// import AxiosToastError from "../utils/AxiosToastError";
// import toast from "react-hot-toast";
// import { pricewithDiscount } from "../utils/PriceWithDiscount";
// import { handleAddAddress } from "../store/addressSlice";
// import { setOrder } from "../store/orderSlice";

// export const GlobalContext = createContext(null)

// export const useGlobalContext = ()=> useContext(GlobalContext)

// const GlobalProvider = ({children}) => {
//      const dispatch = useDispatch()
//      const [totalPrice,setTotalPrice] = useState(0)
//      const [notDiscountTotalPrice,setNotDiscountTotalPrice] = useState(0)
//     const [totalQty,setTotalQty] = useState(0)
//     const cartItem = useSelector(state => state.cartItem.cart)
//     const user = useSelector(state => state?.user)

//     const fetchCartItem = async()=>{
//         try {
//           const response = await Axios({
//             ...SummaryApi.getCartItem
//           })
//           const { data : responseData } = response
    
//           if(responseData.success){
//             dispatch(handleAddItemCart(responseData.data))
//             // console.log(responseData)
//           }
    
//         } catch (error) {
//           console.log(error)
//         }
//     }

//     const updateCartItem = async(id,qty)=>{
//       try {
//           const response = await Axios({
//             ...SummaryApi.updateCartItemQty,
//             data : {
//               _id : id,
//               qty : qty
//             }
//           })
//           const { data : responseData } = response

//           if(responseData.success){
//               // toast.success(responseData.message)
//               fetchCartItem()
//               return responseData
//           }
//       } catch (error) {
//         AxiosToastError(error)
//         return error
//       }
//     }
//     const deleteCartItem = async(cartId)=>{
//       try {
//           const response = await Axios({
//             ...SummaryApi.deleteCartItem,
//             data : {
//               _id : cartId
//             }
//           })
//           const { data : responseData} = response

//           if(responseData.success){
//             toast.success(responseData.message)
//             fetchCartItem()
//           }
//       } catch (error) {
//          AxiosToastError(error)
//       }
//     }

//     useEffect(()=>{
//       const qty = cartItem.reduce((preve,curr)=>{
//           return preve + curr.quantity
//       },0)
//       setTotalQty(qty)
      
//       const tPrice = cartItem.reduce((preve,curr)=>{
//           const priceAfterDiscount = pricewithDiscount(curr?.productId?.price,curr?.productId?.discount)

//           return preve + (priceAfterDiscount * curr.quantity)
//       },0)
//       setTotalPrice(tPrice)

//       const notDiscountPrice = cartItem.reduce((preve,curr)=>{
//         return preve + (curr?.productId?.price * curr.quantity)
//       },0)
//       setNotDiscountTotalPrice(notDiscountPrice)
//   },[cartItem])

//     const handleLogoutOut = ()=>{
//         localStorage.clear()
//         dispatch(handleAddItemCart([]))
//     }

//     const fetchAddress = async()=>{
//       try {
//         const response = await Axios({
//           ...SummaryApi.getAddress
//         })
//         const { data : responseData } = response

//         if(responseData.success){
//           dispatch(handleAddAddress(responseData.data))
//         }
//       } catch (error) {
//           // AxiosToastError(error)
//       }
//     }
//     const fetchOrder = async()=>{
//       try {
//         const response = await Axios({
//           ...SummaryApi.getOrderItems,
//         })
//         const { data : responseData } = response

//         if(responseData.success){
//             dispatch(setOrder(responseData.data))
//         }
//       } catch (error) {
//         console.log(error)
//       }
//     }

//     useEffect(()=>{
//       fetchCartItem()
//       handleLogoutOut()
//       fetchAddress()
//       fetchOrder()
//     },[user])
    
//     return(
//         <GlobalContext.Provider value={{
//             fetchCartItem,
//             updateCartItem,
//             deleteCartItem,
//             fetchAddress,
//             totalPrice,
//             totalQty,
//             notDiscountTotalPrice,
//             fetchOrder
//         }}>
//             {children}
//         </GlobalContext.Provider>
//     )
// }

// export default GlobalProvider
import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

/* utils & helpers */
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { pricewithDiscount } from "../utils/PriceWithDiscount";

/* redux slices */
import { handleAddItemCart } from "../store/cartProduct";
import { handleAddAddress } from "../store/addressSlice";
import { setOrder } from "../store/orderSlice";
import { setUserDetails, logout } from "../store/userSlice";

const GlobalContext = createContext(null);
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const dispatch = useDispatch();
  const cartItem = useSelector((state) => state.cartItem.cart);

  const [totalPrice, setTotalPrice] = useState(0);
  const [notDiscountTotalPrice, setNotDiscountTotalPrice] = useState(0);
  const [totalQty, setTotalQty] = useState(0);

  const isLoggedIn = () => {
    const token = localStorage.getItem("accesstoken");
    return token && token !== "undefined" && token !== "null";
  };

  /* --------------------------- FETCH USER DETAILS --------------------------- */
  const fetchUserDetails = async () => {
    if (!isLoggedIn()) return;
    try {
      const res = await Axios({ ...SummaryApi.getUserDetails });
      if (res.data.success) {
        dispatch(setUserDetails(res.data.data)); // 👈 Correct action name
      }
    } catch (err) {
      console.error("User fetch failed:", err);
      localStorage.clear();
      dispatch(logout()); // clear redux user
    }
  };

  /* --------------------------- CART --------------------------- */
  const fetchCartItem = async () => {
    if (!isLoggedIn()) {
      dispatch(handleAddItemCart([]));
      return;
    }
    try {
      const res = await Axios({ ...SummaryApi.getCartItem });
      if (res.data.success) dispatch(handleAddItemCart(res.data.data));
    } catch (err) {
      if (err?.response?.status === 401) {
        localStorage.clear();
        dispatch(handleAddItemCart([]));
      }
      AxiosToastError(err);
    }
  };

  const updateCartItem = async (id, qty) => {
    if (!isLoggedIn()) {
      toast.error("Please login first");
      return;
    }
    try {
      const res = await Axios({
        ...SummaryApi.updateCartItemQty,
        data: { _id: id, qty },
      });
      if (res.data.success) fetchCartItem();
      return res.data;
    } catch (err) {
      AxiosToastError(err);
    }
  };

  const deleteCartItem = async (cartId) => {
    if (!isLoggedIn()) {
      toast.error("Please login first");
      return;
    }
    try {
      const res = await Axios({
        ...SummaryApi.deleteCartItem,
        data: { _id: cartId },
      });
      if (res.data.success) {
        toast.success(res.data.message);
        fetchCartItem();
      }
    } catch (err) {
      AxiosToastError(err);
    }
  };

  /* --------------------------- ADDRESS & ORDERS --------------------------- */
  const fetchAddress = async () => {
    if (!isLoggedIn()) return;
    try {
      const res = await Axios({ ...SummaryApi.getAddress });
      if (res.data.success) dispatch(handleAddAddress(res.data.data));
    } catch (err) {
      AxiosToastError(err);
    }
  };

  const fetchOrder = async () => {
    if (!isLoggedIn()) return;
    try {
      const res = await Axios({ ...SummaryApi.getOrderItems });
      if (res.data.success) dispatch(setOrder(res.data.data));
    } catch (err) {
      AxiosToastError(err);
    }
  };

  /* --------------------------- LOGOUT --------------------------- */
  const handleLogoutOut = () => {
    localStorage.clear();
    dispatch(handleAddItemCart([]));
    dispatch(logout());
    toast.success("Logged out");
  };

  /* --------------------------- TOTAL CALC --------------------------- */
  useEffect(() => {
    const qty = cartItem.reduce((p, c) => p + c.quantity, 0);
    setTotalQty(qty);

    const discountTotal = cartItem.reduce((p, c) => {
      const discounted = pricewithDiscount(
        c.productId.price,
        c.productId.discount
      );
      return p + discounted * c.quantity;
    }, 0);
    setTotalPrice(discountTotal);

    const noDiscount = cartItem.reduce(
      (p, c) => p + c.productId.price * c.quantity,
      0
    );
    setNotDiscountTotalPrice(noDiscount);
  }, [cartItem]);

  /* --------------------------- INITIAL LOAD --------------------------- */
  useEffect(() => {
    if (!isLoggedIn()) {
      dispatch(handleAddItemCart([]));
      return;
    }
    fetchUserDetails();
    fetchCartItem();
    fetchAddress();
    fetchOrder();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        fetchCartItem,
        updateCartItem,
        deleteCartItem,
        fetchAddress,
        fetchOrder,
        totalPrice,
        totalQty,
        notDiscountTotalPrice,
        handleLogoutOut,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;




