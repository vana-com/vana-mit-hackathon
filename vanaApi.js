import config from "./config";

/**
 * Call various Vana APIs and build and return a user object
 */
const getUser = async () => {
  const authToken = localStorage?.authToken ?? undefined;
  if (authToken) {
    const [exhibitsPromise, textToImagePromise, balancePromise] = [
      vanaApiGet("account/exhibits"),
      vanaApiGet("account/exhibits/text-to-image"),
      vanaApiGet("account/balance"),
    ];

    const [exhibitsResponse, textToImageResponse, balanceResponse] =
      await Promise.all([exhibitsPromise, textToImagePromise, balancePromise]);

    return {
      balance: balanceResponse?.balance ?? 0,
      exhibits: exhibitsResponse?.exhibits ?? [],
      textToImage: textToImageResponse?.urls ?? [],
    };
  }
  return null;
};

/**
 * Helper function to make Vana API calls
 */
const vanaApiFetch = async (path, options = {}) => {
  const authToken = localStorage?.authToken ?? undefined;
  if (authToken) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${authToken}`,
    };
  }

  const response = await fetch(`${config.VANA_API_URL}/${path}`, options);
  const data = await response.json();

  if (response.ok && data.success === true) {
    return data;
  } else {
    console.error(`Error calling ${path}`, data.message);
  }
};

/**
 * Vana API POST request
 */
const vanaApiPost = async (path, body) =>
  vanaApiFetch(path, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(body),
  });

/**
 * Vana API GET request
 */
const vanaApiGet = async (path) => vanaApiFetch(path, {});

export { getUser, vanaApiGet, vanaApiPost };
