import api from "./../common/APIClient";

class OrderService {
    add = (data) => {
        return api.post("/order", data);
    };
    find = (data) => {
        return api.get(`/order/${data}`);
    };
    udpate = (data) => {
        return api.put("/order", data)
    }
    delete = (id) => {
        return api.delete(`/order/${id}`)
    }
    checkout = (data) => {
        return api.put('/order/checkout', data)
    }
    getOrderById = async (orderId) => {
        try {
            const response = await api.get(`/order/${orderId}`);
            return response;
        } catch (error) {
            console.error('Error fetching order:', error);
            throw error;
        }
    }
}

export default new OrderService();