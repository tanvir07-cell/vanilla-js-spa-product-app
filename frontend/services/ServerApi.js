const ServerApi = {
  endpoint: "/auth/",
  // ADD HERE ALL THE OTHER API FUNCTIONS
  login: async (user) => {
    return await ServerApi.makePostRequest(ServerApi.endpoint + "login", user);
  },

  register: async (user) => {
    return await ServerApi.makePostRequest(
      ServerApi.endpoint + "register",
      user
    );
  },

  makePostRequest: async (url, data) => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  },
};

export default ServerApi;
