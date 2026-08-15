import { useEffect } from "react";
import BreakpointsContextProvider from "../../../lib/sites/qclay-design-fc4b5892/context/breakpointsContext";
import { ModalContextProvider } from "./shared/Modal/Modal";
import { CursorContextProvider } from "./shared/Cursor/Cursor";
import Home from "./root-8a5edab2/Home";

const setCookie = (name, value, maxAgeDays) => {
  if (typeof document === "undefined") { return; }
  const date = new Date();
  date.setTime(date.getTime() + maxAgeDays * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${date.toUTCString()}`;
};

const AppClone = () => {
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search || "");
    const referral = searchParams.get("ref") || searchParams.get("utm_source");

    if (referral) {
      setCookie("referral", referral, 30);
    }
  }, []);

  return (
    <BreakpointsContextProvider>
      <CursorContextProvider>
        <ModalContextProvider>
          <Home />
        </ModalContextProvider>
      </CursorContextProvider>
    </BreakpointsContextProvider>
  );
};

export default AppClone;
