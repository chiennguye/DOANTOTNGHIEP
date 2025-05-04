import { getProducts, productAdded, productUpdate, productDelete, getSaleOff, getSaleOffProduct } from "./../reducers/ProductReducer";
import ProductService from "./../../services/ProductService";

export const ProductGetAll = (query) => async (dispatch) => {
  try {
    await ProductService.list(query)
      .then((res) => dispatch(getProducts(res.data)))
      .catch((err) => console.error(err));
  } catch (error) {
    console.error(error);
  }
};

export const addProduct = (data) => async (dispatch) => {
  try {
    console.log("Raw data received:", data);
    
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("title", data.title);
    formData.append("price", data.price);
    formData.append("category", data.category);
    formData.append("multipartFile", data.multipartFile);

    // Always send initialQuantity and minimumQuantity if present
    if (data.initialQuantity !== undefined && data.initialQuantity !== "") {
      formData.append("initialQuantity", data.initialQuantity);
    }
    if (data.minimumQuantity !== undefined && data.minimumQuantity !== "") {
      formData.append("minimumQuantity", data.minimumQuantity);
    }

    // Gửi đúng tên trường backend mong đợi
    if (data.additionOptionsList && data.additionOptionsList.length > 0) {
      data.additionOptionsList.forEach(obj => {
        formData.append("additionOptionsList", JSON.stringify(obj));
      });
    }
    if (data.sizeOptionsList && data.sizeOptionsList.length > 0) {
      data.sizeOptionsList.forEach(obj => {
        formData.append("sizeOptionsList", JSON.stringify(obj));
      });
    }

    // Log final formData
    console.log("Final FormData:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    const res = await ProductService.add(formData);
    dispatch(productAdded(res.data));
    return res.data;
  } catch (e) {
    console.error("Error adding product:", e);
    throw e;
  }
};

export const updateProduct = (data) => async (dispatch) => {
  try {
    const formData = new FormData();
    formData.append("id", data.id);
    if (data.multipartFile) {
      formData.append("multipartFile", data.multipartFile);
    }
    formData.append("name", data.name);
    formData.append("title", data.title);
    formData.append("price", data.price);
    formData.append("category", data.category.id);

    // Phân biệt luồng Snack/Product và loại khác
    if (data.category.name === "Snack" || data.category.name === "Product") {
      // Chỉ gửi initialQuantity và minimumQuantity
      if (data.initialQuantity !== undefined && data.initialQuantity !== "") {
        formData.append("initialQuantity", data.initialQuantity);
      }
      if (data.minimumQuantity !== undefined && data.minimumQuantity !== "") {
        formData.append("minimumQuantity", data.minimumQuantity);
      }
    } else {
      // Chỉ gửi size/topping
      if (data.additionOptions && data.additionOptions.length > 0) {
        data.additionOptions.forEach(obj => {
          formData.append("additionOptions", JSON.stringify(obj));
        });
      }
      if (data.sizeOptions && data.sizeOptions.length > 0) {
        data.sizeOptions.forEach(obj => {
          formData.append("sizeOptions", JSON.stringify(obj));
        });
      }
    }

    const res = await ProductService.update(formData);
    dispatch(productUpdate(res.data));
    return res.data;
  } catch (e) {
    return console.error(e);
  }
};

export const deleteProduct = (data) => async (dispatch) => {
  try {
    const res = await ProductService.delete(data);
    dispatch(productDelete(res.data));
  } catch (e) {
    return console.error(e);
  }
};

export const ProductSaleOff = (query) => async (dispatch) => {
  try {
    await ProductService.showSaleOff(query)
      .then((res) => dispatch(getSaleOff(res.data)))
      .catch((err) => console.error(err));
  } catch (error) {
    console.error(error);
  }
};

export const ShowProductSaleOff = (query) => async (dispatch) => {
  try {
    await ProductService.showSaleOffProduct(query)
      .then((res) => dispatch(getSaleOffProduct(res.data)))
      .catch((err) => console.error(err));
  } catch (error) {
    console.error(error);
  }
};