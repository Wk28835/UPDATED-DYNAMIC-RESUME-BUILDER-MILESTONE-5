
import "@/styles/globals.css";  
import type { AppProps } from "next/app";
import { useEffect } from "react";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
   
    document.body.classList.add("antialiased");

    
    return () => {
      document.body.classList.remove("antialiased");
    };
  }, []);

  return (
    <>
      <Head>
        
        <meta name="description" content="Your description here" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
    
      <Component {...pageProps} />
    </>
  );
}
