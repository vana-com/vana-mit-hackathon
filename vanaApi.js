import config from "./config";

/**
 * Helper function to make Vana API calls
 */
const vanaApiFetch = async (path, options = {}, token) => {
  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  const response = await fetch(`${config.VANA_API_URL}/${path}`, options);
  const data = await response.json();

  if (response.ok && data.success === true) {
    return data;
  } else {
    throw new Error(data.message);
  }
};

/**
 * Vana API POST request
 */
const vanaApiPost = async (path, body, token) =>
  vanaApiFetch(
    path,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(body),
    },
    token
  );

/**
 * Vana API GET request
 */
const vanaApiGet = async (path, token) => vanaApiFetch(path, {}, token);

export { vanaApiGet, vanaApiPost };
