import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
};

const cartSlice = createSlice({
  name: "cartItem",
  initialState,
  reducers: {
    handleAddItemCart: (state, action) => {
      state.cart = action.payload;
    },
    // Optional: add more cart-related actions here
  },
});

export const { handleAddItemCart } = cartSlice.actions;
export default cartSlice.reducer;
