import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItemType {
  productId: string;
  name: string;
  image: string;
  price: number;
  qty: number;
}

interface CartState {
  items: CartItemType[];
  totalAmount: number;
  totalCount: number;
  loading: boolean;
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
  totalCount: 0,
  loading: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setCart: (state, action: PayloadAction<{ items: CartItemType[]; totalAmount: number }>) => {
      state.items = action.payload.items;
      state.totalAmount = action.payload.totalAmount;
      state.totalCount = action.payload.items.reduce((acc, item) => acc + item.qty, 0);
      state.loading = false;
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.totalCount = 0;
      state.loading = false;
    },
  },
});

export const { setLoading, setCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
