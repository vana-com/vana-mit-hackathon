import config from "./config";

const vanaFetch = async (path, options = {}, token) => {
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

const post = async (path, body, token) =>
  vanaFetch(
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

export { vanaFetch, vanaFetch as vanaGet, post as vanaPost };
