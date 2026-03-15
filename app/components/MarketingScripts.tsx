"use client";

import Script from "next/script";

interface MarketingScriptsProps {
  tracking_enabled: boolean;
  meta_pixel_id: string | null;
  ga4_measurement_id: string | null;
  gtm_container_id: string | null;
}

export function MarketingScripts({
  tracking_enabled,
  meta_pixel_id,
  ga4_measurement_id,
  gtm_container_id,
}: MarketingScriptsProps) {
  if (!tracking_enabled) return null;

  const metaId = meta_pixel_id?.trim() ?? "";
  const ga4Id = ga4_measurement_id?.trim() ?? "";
  const gtmId = gtm_container_id?.trim() ?? "";

  return (
    <>
      {metaId && (
        <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${metaId.replace(/'/g, "\\'")}');
              fbq('track', 'PageView');
            `,
          }}
        />
      )}
      {ga4Id && (
        <>
          <Script
            id="ga4-script"
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
            strategy="afterInteractive"
          />
          <Script
            id="ga4-config"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${ga4Id.replace(/'/g, "\\'")}');
                gtag('event', 'page_view');
              `,
            }}
          />
        </>
      )}
      {gtmId && (
        <>
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${gtmId.replace(/'/g, "\\'")}');
              `,
            }}
          />
          <noscript>
            <iframe
              title="GTM"
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        </>
      )}
    </>
  );
}
