"use client";

import { useEffect } from "react";
import Script from "next/script";

export default function LiveChatWidget() {
  const crispId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;

  useEffect(() => {
    if (!crispId) return;

    // Crisp requires '$crisp' and 'CRISP_WEBSITE_ID' to be attached to the window
    (window as any).$crisp = [];
    (window as any).CRISP_WEBSITE_ID = crispId;

    return () => {
      // Cleanup logic if needed (Crisp doesn't have an official unmount, but we can hide it)
      const crispContainer = document.getElementById("crisp-chatbox");
      if (crispContainer) crispContainer.style.display = "none";
    };
  }, [crispId]);

  if (!crispId) {
    // Return null if no ID is configured, meaning it stays silent in production if unconfigured
    return null; 
  }

  return (
    <Script
      id="crisp-script"
      strategy="afterInteractive"
      src="https://client.crisp.chat/l.js"
    />
  );
}
