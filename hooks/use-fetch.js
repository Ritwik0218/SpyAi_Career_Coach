import { useState } from "react";
import { toast } from "sonner";

const useFetch = (cb) => {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const fn = async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const response = await cb(...args);
      setData(response);
      setError(null);
    } catch (error) {
      console.error("useFetch error:", error);
      
      let errorMessage = "An unexpected error occurred";
      
      // Handle different types of errors
      if (error.message) {
        if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
          errorMessage = "Network connection error. Please check your internet connection and try again.";
        } else if (error.message.includes("Unauthorized")) {
          errorMessage = "Please sign in to continue.";
        } else if (error.message.includes("timeout") || error.message.includes("abort")) {
          errorMessage = "Request timed out. Please try again.";
        } else if (error.message.includes("server")) {
          errorMessage = "Server error. Please try again in a moment.";
        } else {
          errorMessage = error.message;
        }
      }
      
      setError({ ...error, displayMessage: errorMessage });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn, setData };
};

export default useFetch;
