import api from "../common/APIClient"

class ProductService {
    list = (query) => {
        return api.get("/product/milktea", { params: query })
    }
}

export default new ProductService();