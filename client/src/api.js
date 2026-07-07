const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const register = async (userData) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!res.ok)
    throw new Error((await res.json()).message || "Failed to register");
  return res.json();
};

export const login = async (userData) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to login");
  return res.json();
};

// Helper to attach token to requests
const authHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ---- PRODUCTS API ----
export const getProducts = async () => {
  const res = await fetch(`${API_URL}/products`, { headers: authHeader() });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
};

export const saveProduct = async (productData) => {
  const isEditing = !!productData._id;
  const res = await fetch(
    `${API_URL}/products${isEditing ? `/${productData._id}` : ""}`,
    {
      method: isEditing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json", ...authHeader() },
      body: JSON.stringify(productData),
    },
  );
  if (!res.ok) throw new Error("Failed to save product");
  return res.json();
};

export const deleteProduct = async (id) => {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });
  if (!res.ok) throw new Error("Failed to delete product");
  return res.json();
};

// ---- CUSTOMERS API ----
export const getCustomers = async () => {
  const res = await fetch(`${API_URL}/customers`, { headers: authHeader() });
  if (!res.ok) throw new Error("Failed to fetch customers");
  return res.json();
};

export const saveCustomer = async (customerData) => {
  const isEditing = !!customerData._id;
  const res = await fetch(
    `${API_URL}/customers${isEditing ? `/${customerData._id}` : ""}`,
    {
      method: isEditing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json", ...authHeader() },
      body: JSON.stringify(customerData),
    },
  );
  if (!res.ok) throw new Error("Failed to save customer");
  return res.json();
};

export const deleteCustomer = async (id) => {
  const res = await fetch(`${API_URL}/customers/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });
  if (!res.ok) throw new Error("Failed to delete customer");
  return res.json();
};

// ---- INVOICES API ----
export const getInvoices = async () => {
  const res = await fetch(`${API_URL}/invoices`, { headers: authHeader() });
  if (!res.ok) throw new Error("Failed to fetch invoices");
  return res.json();
};

export const createInvoice = async (invoiceData) => {
  const res = await fetch(`${API_URL}/invoices`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(invoiceData),
  });
  if (!res.ok) throw new Error("Failed to create invoice");
  return res.json();
};

export const toggleInvoiceStatus = async (id) => {
  const res = await fetch(`${API_URL}/invoices/${id}/status`, {
    method: "PATCH",
    headers: authHeader(),
  });
  if (!res.ok) throw new Error("Failed to update status");
  return res.json();
};

// ---- DASHBOARD API ----
export const getDashboardStats = async () => {
  const res = await fetch(`${API_URL}/dashboard`, { headers: authHeader() });
  if (!res.ok) throw new Error("Failed to fetch dashboard stats");
  return res.json();
};
