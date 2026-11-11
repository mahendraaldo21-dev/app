import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API,
});

// Attach token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ll_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const STORE_INFO = {
  name: "Toko Lawanglimo",
  phone_wa: "6285742364953", // International format for wa.me
  maps_link: "https://maps.app.goo.gl/ujmyhaeKVCEXRX717",
  // Generic embed - Google embed accepts any place query
  maps_embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.852137868833!2d110.4078035115972!3d-7.257663792718563!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e70817693359219%3A0x224805447acb40d6!2sToko%20mbk%20ju%20Lawang%20Limo!5e0!3m2!1sid!2sid!4v1794231635093!5m2!1sid!2sid",
  tagline: "Belanja alat rumah tangga berkualitas dengan mudah, langsung dari toko offline kami.",
};

export const resolveImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/api/")) return `${BACKEND_URL}${url}`;
  return url;
};

export const formatRupiah = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n || 0);
