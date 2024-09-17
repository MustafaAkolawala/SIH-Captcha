import { useEffect, useState } from "react";

const usePageVisibility = () => {
  const [isVisible, setIsVisible] = useState(document.visibilityState === "visible");

  const handleVisibilityChange = () => {
    setIsVisible(document.visibilityState === "visible");
  };

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return isVisible;
};

export default usePageVisibility;
