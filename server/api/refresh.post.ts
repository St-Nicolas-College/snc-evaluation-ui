export default defineEventHandler(async (event) => {
  const refreshToken = getCookie(event, "refreshToken");
  const config = useRuntimeConfig();

  if (!refreshToken) {
    throw createError({
      statusCode: 401,
      statusMessage: "No refresh token",
    });
  }

  const res: any = await $fetch("/api/auth/refresh", {
    baseURL: config.public.strapiUrl,
    method: "POST",
    body: {
      refreshToken,
    },
  });

  return {
    jwt: res.jwt,
    user: res.user,
  };
});
