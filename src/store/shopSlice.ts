import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Product {
  id: number;
  productName: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  rating?: number;
  reviewsCount?: number;
  productImages?: { image: string }[] | string;
  image?: string;
  images?: string[];
  categoryId: number;
  hasDiscount?: boolean;
  discountPrice?: number;
  brandId?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

interface ShopState {
  cartItems: CartItem[];
  wishlistItems: Product[];
}


const loadState = (): ShopState => {
  try {
    const serializedState = localStorage.getItem("shopState");
    if (serializedState === null) {
      return { cartItems: [], wishlistItems: [] };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return { cartItems: [], wishlistItems: [] };
  }
};

const initialState: ShopState = loadState();

export const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: Product; quantity?: number }>) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cartItems.push({ ...product, quantity });
      }
      localStorage.setItem("shopState", JSON.stringify(state));
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
      localStorage.setItem("shopState", JSON.stringify(state));
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === id);
      if (existingItem) {
        existingItem.quantity = quantity > 0 ? quantity : 1;
      }
      localStorage.setItem("shopState", JSON.stringify(state));
    },
    toggleWishlist: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const existsIndex = state.wishlistItems.findIndex((item) => item.id === product.id);
      if (existsIndex >= 0) {
        state.wishlistItems.splice(existsIndex, 1);
      } else {
        state.wishlistItems.push(product);
      }
      localStorage.setItem("shopState", JSON.stringify(state));
    },
    moveWishlistToCart: (state) => {
      state.wishlistItems.forEach((product) => {
        const existingItem = state.cartItems.find((item) => item.id === product.id);
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          state.cartItems.push({ ...product, quantity: 1 });
        }
      });
      state.wishlistItems = [];
      localStorage.setItem("shopState", JSON.stringify(state));
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.setItem("shopState", JSON.stringify(state));
    }
  },
});

export const { addToCart, removeFromCart, updateQuantity, toggleWishlist, moveWishlistToCart, clearCart } = shopSlice.actions;
export default shopSlice.reducer;
