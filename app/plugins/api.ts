export default defineNuxtPlugin((nuxtApp) => {
  // const token = useState("token");
    const token = useState<any>("token");
  const strapiBaseUrl = useRuntimeConfig().public.strapiUrl;
  const api = $fetch.create({
    baseURL: `${strapiBaseUrl}/api`,
    credentials: "include",
    async onRequest({ options }) {
      if (token.value) {
        options.headers = {
          ...options.headers,
          //@ts-ignore
          Authorization: `Bearer ${token.value}`,
        };
      }
    },

    async onResponseError({ response, request }) {
      if (response.status === 401) {
        const refresh: any = await $fetch("/api/refresh", {
          method: "POST",
        });

        token.value = refresh.jwt;

        return $fetch(request);
      }
    },
  });
  return {
    provide: {
      api,
    },
  };
});
