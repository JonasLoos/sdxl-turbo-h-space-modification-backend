export const metadata = {
  title: 'SDXL Turbo H Space Modification',
  description: 'SDXL Turbo H Space Modification',
}

export default function RootLayout({ children }) {
 return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link  // highlight.js
          rel="stylesheet"
          href="https://unpkg.com/@highlightjs/cdn-assets@11.9.0/styles/nord.min.css"
        />
        <link  // katex
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/katex.min.css"
          integrity="sha384-Um5gpz1odJg5Z4HAmzPtgZKdTBHZdw8S29IecapCSB31ligYPhHQZMIlWLYQGVoc"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {children}
        <script
          crossOrigin="true"
          src="https://unpkg.com/@highlightjs/cdn-assets@11.9.0/highlight.min.js"
        ></script>
      </body>
    </html>
  )
}
