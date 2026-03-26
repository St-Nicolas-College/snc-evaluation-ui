export default defineNuxtRouteMiddleware(() => {
  const { token, authReady } = useAuth();

  if (!authReady.value) return;

  if (token.value) {
    return navigateTo("/");
  }
});
