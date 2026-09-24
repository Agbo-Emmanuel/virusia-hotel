// Pulls the most helpful message out of an axios error
export const getErrorMessage = (
  error,
  fallback = "Something went wrong. Please try again.",
) => {
  const fromServer =
    error?.response?.data?.message || error?.response?.data?.error;
  if (fromServer) return fromServer;

  if (error?.code === "ECONNABORTED") {
    return "The server took too long to respond. Please try again.";
  }
  if (error?.message === "Network Error") {
    return "Can't reach the server. Please check your internet connection.";
  }
  return fallback;
};
