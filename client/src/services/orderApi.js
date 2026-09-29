import apiClient from './apiClient';
import { DEMO_RESTAURANTS, DEMO_MENU_ITEMS, IS_DEMO_MODE } from '../utils/constants';

export const orderApi = {
  /**
   * Get all active restaurants
   */
  async getRestaurants() {
    try {
      const res = await apiClient.get('/restaurants');
      if (res.success && res.data) return res.data;
      return DEMO_RESTAURANTS;
    } catch (err) {
      if (IS_DEMO_MODE) {
        console.info('[Demo Mode] Using local mock restaurants');
        return DEMO_RESTAURANTS;
      }
      throw err;
    }
  },

  /**
   * Get menu items for a specific restaurant
   */
  async getRestaurantMenu(restaurantId) {
    try {
      const res = await apiClient.get(`/restaurants/${restaurantId}/menu`);
      if (res.success && res.data) return res.data;
      return DEMO_MENU_ITEMS[restaurantId] || Object.values(DEMO_MENU_ITEMS).flat();
    } catch (err) {
      if (IS_DEMO_MODE) {
        console.info(`[Demo Mode] Using local mock menu for ${restaurantId}`);
        return DEMO_MENU_ITEMS[restaurantId] || Object.values(DEMO_MENU_ITEMS).flat();
      }
      throw err;
    }
  },

  /**
   * Create an order
   */
  async createOrder({ userId, restaurantId, items }) {
    try {
      const res = await apiClient.post('/orders', {
        userId,
        restaurantId,
        items: items.map((i) => ({
          menuItemId: i.menuItemId || i._id,
          quantity: i.quantity,
        })),
        autoStartRace: true,
      });
      if (res.success && res.data) {
        // Backend returns { order, race } — unwrap so callers get the order
        const order = res.data.order || res.data;
        if (res.data.race) {
          order.race = res.data.race;
        }
        return order;
      }
    } catch (err) {
      if (IS_DEMO_MODE) {
        console.info('[Demo Mode] Generating local simulated order');
        const calculatedTotal = items.reduce((sum, item) => sum + (item.price || 12.99) * item.quantity, 0) + 3.49;
        const newOrder = {
          _id: `ord_${Date.now()}`,
          userId: userId || 'user_demo_1',
          restaurantId,
          items: items.map(i => ({
            menuItemId: i._id || i.menuItemId,
            name: i.name,
            quantity: i.quantity,
            unitPrice: i.price
          })),
          total: parseFloat(calculatedTotal.toFixed(2)),
          status: 'placed',
          estimatedDeliveryAt: new Date(Date.now() + 18 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        // Persist in local storage for session durability
        const existingOrders = JSON.parse(localStorage.getItem('gg_orders') || '[]');
        localStorage.setItem('gg_orders', JSON.stringify([newOrder, ...existingOrders]));
        return newOrder;
      }
      throw err;
    }
  },

  /**
   * Get order details by ID
   */
  async getOrder(orderId) {
    try {
      const res = await apiClient.get(`/orders/${orderId}`);
      if (res.success && res.data) return res.data;
    } catch (err) {
      if (IS_DEMO_MODE) {
        const existingOrders = JSON.parse(localStorage.getItem('gg_orders') || '[]');
        const found = existingOrders.find(o => o._id === orderId);
        if (found) return found;
        return {
          _id: orderId,
          userId: 'user_demo_1',
          restaurantId: 'rest_01',
          items: [{ menuItemId: 'm_01', name: 'Nitro Pepperoni Inferno', quantity: 1, unitPrice: 15.99 }],
          total: 19.48,
          status: 'out_for_delivery',
          estimatedDeliveryAt: new Date(Date.now() + 8 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString()
        };
      }
      throw err;
    }
  },

  /**
   * Get orders for a specific user
   */
  async getUserOrders(userId) {
    try {
      const res = await apiClient.get(`/orders/user/${userId}`);
      if (res.success && res.data) return res.data;
    } catch (err) {
      if (IS_DEMO_MODE) {
        const existingOrders = JSON.parse(localStorage.getItem('gg_orders') || '[]');
        if (existingOrders.length > 0) return existingOrders;
        return [
          {
            _id: 'ord_demo_speed_99',
            userId,
            restaurantId: 'rest_01',
            restaurantName: 'Hyper Sonic Pizza & Wings',
            items: [{ menuItemId: 'm_01', name: 'Nitro Pepperoni Inferno', quantity: 1, unitPrice: 15.99 }],
            total: 18.98,
            status: 'delivered',
            createdAt: new Date(Date.now() - 3600 * 1000).toISOString()
          }
        ];
      }
      throw err;
    }
  },

  /**
   * Update order status (Demo/Admin)
   */
  async updateOrderStatus(orderId, status) {
    try {
      const res = await apiClient.patch(`/orders/${orderId}/status`, { status });
      return res.data;
    } catch (err) {
      if (IS_DEMO_MODE) {
        const existingOrders = JSON.parse(localStorage.getItem('gg_orders') || '[]');
        const updated = existingOrders.map(o => o._id === orderId ? { ...o, status } : o);
        localStorage.setItem('gg_orders', JSON.stringify(updated));
        return { orderId, status };
      }
      throw err;
    }
  }
};

export default orderApi;
