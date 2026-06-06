import React, { useEffect } from 'react'

const Heading = ({title,description,keywords}) => {
  useEffect(() => {
    // Add GTM script
    const gtmScript = document.createElement('script');
    gtmScript.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-MPRX3SK7');`;
    document.head.appendChild(gtmScript);

    // Add GA4 script
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-930JFX04TH';
    document.head.appendChild(gaScript);

    const gaInitScript = document.createElement('script');
    gaInitScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-930JFX04TH');
    `;
    document.head.appendChild(gaInitScript);
  }, []);

  useEffect(() => {
    // Update document title and meta tags
    document.title = title;
    
    const metaTags = {
      'viewport': 'width=device-width, initial-scale=1',
      'keywords': keywords,
      'description': description,
      'google-site-verification': '6FZyF2_Ah7j5YoCkb-uFO4cEsIrLWYEyAyeiS791Fd8'
    };

    Object.entries(metaTags).forEach(([name, content]) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    });
  }, [title, description, keywords]);

  return null;
}

export default Heading
