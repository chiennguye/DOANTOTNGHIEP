import api from "./../common/APIClient";

class RevenueService {
    listRevenue = (query) => {
        return api.get("/revenue", { params: query });
    };
    listYear = () => {
        return api.get("/revenue/years");
    };
    sum = (query) => {
        return api.get("/revenue/sumRevenue", { params: query });
    };
    getRevenueToday = () => {
        return api.get("/revenue/today");
    };
    getLastFiveOrders = () => {
        return api.get("/revenue/lastFiveOrders");
    };
    getTodayOrders = () => {
        return api.get("/revenue/todayOrders");
    };
}

export default new RevenueService();