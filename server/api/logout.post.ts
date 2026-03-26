export default defineEventHandler(async (event) => {
  deleteCookie(event, "refreshToken");
  return {
    success: true,
  };
})
