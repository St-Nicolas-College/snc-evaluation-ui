export const useAuth = () => {
  const token = useState<any>("token"); // persists after reload
  const refreshToken = useCookie("refreshToken");
  const user = useCookie("user");

  const authReady = useState("authReady", () => false);

  // LOGIN
   const login = async (username: string, password: string) => {
    const res: any = await $fetch("/api/login", {
      method: "POST",
      body: { username, password },
    });

    token.value = res.jwt;
    refreshToken.value = res.refreshToken;
    //user.value = JSON.stringify(res.user);
    user.value = res.user;
  };


  // LOGOUT
  const logout = async () => {
    await $fetch("/api/logout", {
      method: "POST",
      body: { refreshToken: refreshToken.value },
    });
    token.value = null;
    refreshToken.value = null;
    user.value = null;
    navigateTo("/auth/login");
  };

  // REFRESH TOKEN
  const refresh = async () => {
    if (!refreshToken.value) return;
    try {
      const res: any = await $fetch("/api/refresh", {
        method: "POST",
        body: { refreshToken: refreshToken.value },
      });
      token.value = res.jwt;
    } catch (err) {
      token.value = null;
      refreshToken.value = null;
      user.value = null;
    }
  };
  
  return { login, logout, refresh, token, refreshToken, user, authReady };
}
