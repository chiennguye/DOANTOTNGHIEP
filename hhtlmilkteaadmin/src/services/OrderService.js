import api from "./../common/APIClient";

class OrderService {
    listProcess = async (query) => {
        try {
            const response = await api.get("/order/listProcess", { params: query });
            return response;
        } catch (error) {
            console.error("Error fetching orders:", error);
            throw error;
        }
    };

    listSuccess = async (query) => {
        try {
            const response = await api.get("/order/listSuccess", { params: query });
            return response;
        } catch (error) {
            console.error("Error fetching success orders:", error);
            throw error;
        }
    };

    listFail = async (query) => {
        try {
            const response = await api.get("/order/listFail", { params: query });
            return response;
        } catch (error) {
            console.error("Error fetching failed orders:", error);
            throw error;
        }
    };

    updateStatus = async (data) => {
        try {
            const response = await api.put("/order/status", data);
            return response;
        } catch (error) {
            console.error("Error updating order status:", error);
            throw error;
        }
    };
}

export default new OrderService();
