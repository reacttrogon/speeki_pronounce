// Centralized API configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

import axios from "axios";

export const addPronounceProgress = async (authToken, duration) => {
  try {
    const response = await axios.get(
      "https://speeki.trogon.info/api/home/add_pronounce_progress",
      {
        params: {
          auth_token: authToken,
          duration: duration,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

