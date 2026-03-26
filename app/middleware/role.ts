export default defineNuxtRouteMiddleware((to, from) => {
  const { user } = useAuth();
  if (!user.value) {
    return navigateTo("/auth/login");
  }

  const requiredRoles = to.meta.role;

  if (!requiredRoles) return;
  //@ts-ignore
  const userRole = user.value?.role;

  //@ts-ignore
  if (!requiredRoles.includes(userRole)) {
    return navigateTo("/403");
  }
});
