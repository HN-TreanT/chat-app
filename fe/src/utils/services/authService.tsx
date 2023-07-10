import createApiService from "../createApiService";
const api = createApiService();

const handleLogin = (loginInfo: any) => {
  return api.makeRequest({
    url: "/api/auth/login",
    method: "POST",
    data: loginInfo,
  });
};
const handleRegister = (data: any) => {
  return api.makeRequest({
    url: "/api/auth/register",
    method: "POST",
    data,
  });
};

const getAll = (page: any, pageSize: any) => {
  return api.makeRequest({
    url: `/api/auth?page=${page}&pageSize=${pageSize}`,
    method: "GET",
  });
};

const getByEmail = (email: any) => {
  return api.makeRequest({
    url: `/api/auth/${email}`,
    method: "GET",
  });
};
const getFriends = (id: any, page: any, pageSize: any) => {
  return api.makeRequest({
    url: `/api/auth/getfriend/listFriend?id=${id}&page=${page}&pageSize=${pageSize}`,
    method: "GET",
  });
};

export const authServices = {
  handleLogin,
  handleRegister,
  getAll,
  getByEmail,
  getFriends,
};
