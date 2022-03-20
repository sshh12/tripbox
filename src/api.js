const BASE_URL =
  process.env.REACT_APP_BASE_URL ||
  window.location.origin.replace(":3000", ":5000");

let setKey = (key, value) => {
  localStorage.setItem("tripbox:" + key, JSON.stringify(value));
};

let getKey = (key) => {
  return JSON.parse(localStorage.getItem("tripbox:" + key));
};

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

let del = async (path, params = null) => {
  if (params) {
    path +=
      "?" +
      Object.entries(params)
        .map((kv) => kv.map(encodeURIComponent).join("="))
        .join("&");
  }
  let resp = await fetch(BASE_URL + path, {
    method: "DELETE",
    credentials: "include",
  });
  return await resp.json();
};

let get = async (path, params = null) => {
  if (params) {
    path +=
      "?" +
      Object.entries(params)
        .map((kv) => kv.map(encodeURIComponent).join("="))
        .join("&");
  }
  let fresh;
  let data;
  const cacheKey = path + ":" + JSON.stringify(data);
  try {
    let resp = await fetch(BASE_URL + path, { credentials: "include" });
    data = await resp.json();
    fresh = true;
    setKey(cacheKey, data);
  } catch {
    data = getKey(cacheKey);
    fresh = false;
  }
  return { fresh, data };
};

const API = { post, get, put, del, setKey, getKey };

export default API;
