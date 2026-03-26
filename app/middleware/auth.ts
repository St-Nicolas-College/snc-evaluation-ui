export default defineNuxtRouteMiddleware(async () => {
   const { token, authReady } = useAuth();

  // wait until auth initialization finishes
  if (!authReady.value) return;

  if (!token.value) {
    return navigateTo("/auth/login");
  } 
})
