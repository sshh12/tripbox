const BASE_URL =
  process.env.REACT_APP_BASE_URL ||
  window.location.origin.replace(":3000", ":5000");

let post = async (path, data = {}) => {
  let resp = await fetch(BASE_URL + path, {
    method: "POST",
    body: JSON.stringify(data),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await resp.json();
};

let put = async (path, data = {}) => {
  let resp = await fetch(BASE_URL + path, {
    method: "PUT",
    body: JSON.stringify(data),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await resp.json();
};

let get = async (path, data = null) => {
  if (data) {
    path +=
      "?" +
      Object.entries(data)
        .map((kv) => kv.map(encodeURIComponent).join("="))
        .join("&");
  }
  let resp = await fetch(BASE_URL + path, { credentials: "include" });
  return await resp.json();
};

const API = { post, get, put };

export default API;
