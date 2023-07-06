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

const getAll = () => {
  return api.makeRequest({
    url: "/api/auth",
    method: "GET",
  });
};

const getByEmail = (email: any) => {
  return api.makeRequest({
    url: `/api/auth/${email}`,
    method: "GET",
  });
};

export const authServices = {
  handleLogin,
  handleRegister,
  getAll,
  getByEmail,
};
