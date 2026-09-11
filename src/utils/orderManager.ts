import { CustomerOrder, PaymentStatus } from '../types';

const ORDERS_STORAGE_KEY = 'mfia_customer_orders';

export function getLocalOrders(): CustomerOrder[] {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse stored orders:', e);
  }
  return [];
}

export function saveLocalOrders(orders: CustomerOrder[]): void {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Error saving orders to localStorage:', e);
  }
}

export const orderManager = {
  // Fetch all orders
  async getAll(): Promise<CustomerOrder[]> {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        if (data && data.success && Array.isArray(data.orders)) {
          saveLocalOrders(data.orders);
          return data.orders;
        }
      }
    } catch (e) {
      // Backend unavailable (e.g. Vercel static)
    }

    return getLocalOrders();
  },

  // Save/create a new order
  async createOrder(orderData: Partial<CustomerOrder>): Promise<CustomerOrder> {
    const orderId = orderData.id || `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const orderCode = orderData.code || `MOM-${Math.floor(100000 + Math.random() * 900000)}`;

    const rawPhotos = orderData.uploadedPhotos || orderData.customerPhotos || [];
    const normalizedPhotos = Array.isArray(rawPhotos)
      ? rawPhotos.map((p: any) => ({
          id: p.id || `photo_${Math.random().toString(36).slice(2, 8)}`,
          name: p.name || 'Foto enviada pelo cliente',
          url: p.url || p.dataUrl || '',
          dataUrl: p.dataUrl || p.url || '',
          size: p.size || 0,
          uploadedAt: p.uploadedAt || new Date().toISOString(),
        }))
      : [];

    const newOrder: CustomerOrder = {
      id: orderId,
      code: orderCode,
      name: orderData.name || 'Cliente',
      email: orderData.email || '',
      whatsapp: orderData.whatsapp || '',
      items: orderData.items || [],
      subtotal: Number(orderData.subtotal) || 0,
      discount: Number(orderData.discount) || 0,
      total: Number(orderData.total) || 0,
      paymentMethod: orderData.paymentMethod === 'card' ? 'card' : 'pix',
      paymentStatus: orderData.paymentStatus || 'PENDING',
      pixId: orderData.pixId,
      pixQrCode: orderData.pixQrCode,
      pixQrCodeBase64: orderData.pixQrCodeBase64,
      uploadedPhotos: normalizedPhotos,
      customerPhotos: normalizedPhotos,
      aiDeliveryLink: orderData.aiDeliveryLink || '',
      aiDeliveryStatus: orderData.aiDeliveryStatus || 'pending',
      notes: orderData.notes || '',
      createdAt: orderData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const localOrders = getLocalOrders();
    localOrders.unshift(newOrder);
    saveLocalOrders(localOrders);

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });
    } catch (e) {
      console.warn('Backend order sync failed, saved locally:', e);
    }

    return newOrder;
  },

  // Update payment status
  async updateStatus(orderId: string, status: PaymentStatus): Promise<CustomerOrder | null> {
    const localOrders = getLocalOrders();
    const index = localOrders.findIndex((o) => o.id === orderId || o.code === orderId);
    let updated: CustomerOrder | null = null;

    if (index !== -1) {
      localOrders[index] = {
        ...localOrders[index],
        paymentStatus: status,
        updatedAt: new Date().toISOString(),
      };
      updated = localOrders[index];
      saveLocalOrders(localOrders);
    }

    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, paymentStatus: status }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.order) {
          updated = data.order;
        }
      }
    } catch (e) {
      console.warn('Backend status update failed:', e);
    }

    return updated;
  },

  // Save AI Delivery Link
  async saveDeliveryLink(orderId: string, link: string): Promise<CustomerOrder | null> {
    const localOrders = getLocalOrders();
    const index = localOrders.findIndex((o) => o.id === orderId || o.code === orderId);
    let updated: CustomerOrder | null = null;

    if (index !== -1) {
      localOrders[index] = {
        ...localOrders[index],
        aiDeliveryLink: link,
        aiDeliveryStatus: link.trim() ? 'delivered' : 'pending',
        updatedAt: new Date().toISOString(),
      };
      updated = localOrders[index];
      saveLocalOrders(localOrders);
    }

    try {
      const res = await fetch(`/api/orders/${orderId}/delivery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aiDeliveryLink: link, aiDeliveryStatus: link.trim() ? 'delivered' : 'pending' }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.order) {
          updated = data.order;
        }
      }
    } catch (e) {
      console.warn('Backend delivery link save failed:', e);
    }

    return updated;
  },

  // Delete an order
  async deleteOrder(orderId: string): Promise<boolean> {
    const localOrders = getLocalOrders();
    const updated = localOrders.filter((o) => o.id !== orderId && o.code !== orderId);
    saveLocalOrders(updated);

    try {
      await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Backend delete order failed:', e);
    }

    return true;
  },
};
