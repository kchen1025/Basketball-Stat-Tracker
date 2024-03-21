const API = {
  // baseUrl: "https://api.example.com", // Base URL for all requests

  async request(url, options = {}) {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options.headers,
    };
    try {
      const response = await fetch(url, { ...options, headers });
      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`HTTP Error ${response.status}: ${errorBody}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Fetch error:", error.message);
      throw error;
    }
  },

  get(url, options = {}) {
    return this.request(url, { ...options, method: "GET" });
  },

  post(url, body, options = {}) {
    return this.request(url, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  delete(url, body, options = {}) {
    return this.request(url, {
      ...options,
      method: "DELETE",
      body: JSON.stringify(body),
    });
  },

  // Add other methods as needed (PUT, DELETE, etc.)
};

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

// Usage Examples:

// GET request
// API.get("/data")
//   .then((data) => console.log("GET Data:", data))
//   .catch((error) => console.error("GET Error:", error));

// // POST request
// API.post("/data", { key: "value" })
//   .then((data) => console.log("POST Data:", data))
//   .catch((error) => console.error("POST Error:", error));

export { API, isNumeric };
