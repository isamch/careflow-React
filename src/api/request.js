const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Helper function to make API requests
 * @param {string} endpoint - The path (e.g., /auth/login)
 * @param {string} method - Request method (GET, POST, PUT, DELETE, PATCH)
 * @param {object} body - The data to send (optional)
 * @param {boolean} isAuthRequest - Does this request require a token? (default is true)
 */
async function request(endpoint, method = "GET", body = null, isAuthRequest = true) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (isAuthRequest) {
    const token = localStorage.getItem("accessToken");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const config = { method, headers };
  if (body) {
    config.body = JSON.stringify(body);
    console.log(`🔵 Request [${method} ${endpoint}]:`, {
      body: body,
      stringified: config.body
    });
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    // Safer JSON parsing
    let data = null;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      try {
        data = await response.json();
      } catch (parseError) {
        console.warn("Failed to parse JSON response:", parseError);
      }
    }

    if (!response.ok) {
      if (response.status === 401) {
        // Handle token expiration if needed
        // localStorage.removeItem("accessToken");
        // window.location.href = "/login";
      }

      const errorMessage = data?.message || data?.error || "Something went wrong";
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error(`API Error [${method} ${endpoint}]:`, error);
    throw error;
  }
}

export default request;