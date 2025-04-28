import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  totalPages: 1,
};

const ProductSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    getProducts: (state, action) => {
      state.totalPages = action.payload.totalPages;
      state.products = action.payload.products || action.payload.content || [];
    },
    productAdded: (state, action) => {
      state.products.push(action.payload);
    },
    productUpdate(state, action) {
      const { id, name, title, additionOptions, sizeOptions, category, linkImage, quantity } = action.payload;
      const existingProduct = state.products.find((product) => product.id === id);
      if (existingProduct) {
        existingProduct.name = name;
        existingProduct.title = title;
        existingProduct.additionOptions = additionOptions;
        existingProduct.sizeOptions = sizeOptions;
        existingProduct.category = category;
        existingProduct.linkImage = linkImage;
        existingProduct.quantity = quantity;
      }
    },
    productDelete(state, action) {
      const { id, deletedAt } = action.payload;
      const existingProduct = state.products.find((product) => product.id === id);
      if (existingProduct) {
        existingProduct.deletedAt = deletedAt;
      }
    },
    getSaleOff: (state, action) => {
      state.products = action.payload.content;
      state.totalPages = action.payload.totalPages;
    },
    getSaleOffProduct: (state, action) => {
      state.products = action.payload.content;
      state.totalPages = action.payload.totalPages;
    },
    deleteSaleOffProduct: (state, action) => {
      state.products = action.payload.content;
      state.totalPages = action.payload.totalPages;
    },
  },
});

const { reducer, actions } = ProductSlice;
export const { getProducts, productAdded, productUpdate, productDelete, getSaleOff, getSaleOffProduct, deleteSaleOffProduct } = actions;
export default reducer;
