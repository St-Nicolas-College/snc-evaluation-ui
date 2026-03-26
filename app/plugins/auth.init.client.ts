export default defineNuxtPlugin(async (nuxtApp) => {
  const { refresh, authReady } = useAuth();
  const user = useCookie("user");
  const token = useState<any>("token");

  try {
    const res: any = await $fetch("/api/refresh", {
      method: "POST",
    });
    console.log("Auth ready", res.user);
    authReady.value = true;
    token.value = res.jwt;
    user.value = res.user;
  } catch (err) {
    console.log("Auth ready 2");

    token.value = null;
  }
  authReady.value = true;
});
