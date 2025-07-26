import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Navbar from "@/components/layout/NavBar";

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const showNavbar = !router.pathname.startsWith("/login");

  return (
    <>
      {showNavbar && <Navbar />}
      <Component {...pageProps} />
    </>
  );
}

export default App;
