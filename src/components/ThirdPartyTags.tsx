"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { siteConfig } from "@/config/site";

/**
 * Load GTM + AdSense only after the page is idle / user interacts / a delay.
 * Avoids competing with LCP and inflating Total Blocking Time on first paint.
 */
export function ThirdPartyTags() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let loaded = false;
    const enable = () => {
      if (loaded) return;
      loaded = true;
      setReady(true);
      cleanup();
    };

    const onInteract = () => enable();
    const idle =
      "requestIdleCallback" in window
        ? window.requestIdleCallback(() => enable(), { timeout: 4500 })
        : null;
    const timer = window.setTimeout(enable, 4500);

    const opts: AddEventListenerOptions = { once: true, passive: true };
    window.addEventListener("scroll", onInteract, opts);
    window.addEventListener("pointerdown", onInteract, opts);
    window.addEventListener("keydown", onInteract, opts);
    window.addEventListener("touchstart", onInteract, opts);

    function cleanup() {
      window.clearTimeout(timer);
      if (idle != null && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idle);
      }
      window.removeEventListener("scroll", onInteract);
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("keydown", onInteract);
      window.removeEventListener("touchstart", onInteract);
    }

    return cleanup;
  }, []);

  if (!ready) return null;

  return (
    <>
      <Script id="gtm" strategy="lazyOnload">{`
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${siteConfig.gtmId}');
      `}</Script>

      <Script
        id="adsense"
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${siteConfig.adsenseClient}`}
        crossOrigin="anonymous"
        strategy="lazyOnload"
      />
    </>
  );
}

export function GtmNoscript() {
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${siteConfig.gtmId}`}
        height={0}
        width={0}
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
