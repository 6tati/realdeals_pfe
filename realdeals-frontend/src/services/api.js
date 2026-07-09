const API_URL = "http://localhost:8080/api";

export async function apiFetch(path, options = {}) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
    }

    if (res.status === 204) return null;
    return res.json();
}

// Authentication
export const registerUser = (data) =>
    apiFetch("/utilisateurs/register", {
        method: "POST",
        body: JSON.stringify(data)
    });

export const loginUser = (email, password) =>
    apiFetch("/utilisateurs/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
    });

// Products
export const getProducts = () => fetch(`${API_URL}/produits`).then(r => r.json());

export const createProduct = (product) =>
    apiFetch("/produits", {
        method: "POST",
        body: JSON.stringify(product)
    });

export const deleteProduct = (id) =>
    apiFetch(`/produits/${id}`, {
        method: "DELETE"
    });

// Categories
export const getCategories = () => fetch(`${API_URL}/categories`).then(r => r.json());

export const createCategory = (category) =>
    apiFetch("/categories", {
        method: "POST",
        body: JSON.stringify(category)
    });

// OLD endpoints - keep for normal pages if needed
export const getOrders = () => apiFetch("/commandes");

export const updateOrderStatus = (id, statut) =>
    apiFetch(`/commandes/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ statut })
    });

export const getUsers = () => apiFetch("/utilisateurs");

export const updateUser = (id, data) =>
    apiFetch(`/utilisateurs/${id}`, {
        method: "PUT",
        body: JSON.stringify(data)
    });

export const getSalesStats = (from, to) => {
    const params = new URLSearchParams();
    if (from) params.append("from", from);
    if (to) params.append("to", to);
    return apiFetch(`/commandes/stats?${params.toString()}`);
};

// ADMIN dashboard endpoints - use JdbcTemplate backend, avoids JPA JSON errors
export const getAdminClients = () => apiFetch("/admin/clients");
export const getAdminUsers = () => apiFetch("/admin/utilisateurs");
export const getAdminOrders = () => apiFetch("/admin/commandes");

export const getAdminStats = (from, to) => {
    const params = new URLSearchParams();
    if (from) params.append("from", from);
    if (to) params.append("to", to);
    const query = params.toString();
    return apiFetch(`/admin/stats${query ? `?${query}` : ""}`);
};
export const getMyNotifications = () => apiFetch("/notifications/me");

export const getUnreadNotificationsCount = () =>
    apiFetch("/notifications/unread-count");

export const markNotificationAsRead = (id) =>
    apiFetch(`/notifications/${id}/read`, {
        method: "PUT"
    });

export const getMyOrders = (idUtilisateur) =>
    apiFetch(`/commandes/user/${idUtilisateur}`);

export const sendContactMessage = (message) =>
    apiFetch("/contact-messages", {
        method: "POST",
        body: JSON.stringify(message)
    });

export const getContactMessages = () =>
    apiFetch("/contact-messages");

export const getUnreadContactMessagesCount = () =>
    apiFetch("/contact-messages/unread-count");

export const markContactMessageAsRead = (id) =>
    apiFetch(`/contact-messages/${id}/read`, {
        method: "PUT"
    });

export const deleteContactMessage = (id) =>
    apiFetch(`/contact-messages/${id}`, {
        method: "DELETE"
    });
