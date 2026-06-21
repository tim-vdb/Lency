"use client"
/* global HTMLIFrameElement */

import { useEffect, useRef, useState } from "react"

type EmailIframeProps = {
    html: string
}

export function EmailIframe({ html }: EmailIframeProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null)
    const [height, setHeight] = useState(200)

    useEffect(() => {
        const iframe = iframeRef.current
        if (!iframe) return

        const doc = iframe.contentDocument ?? iframe.contentWindow?.document
        if (!doc) return

        doc.open()
        doc.write(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
* { box-sizing: border-box; }
html { background: white; }
body {
    margin: 0;
    padding: 8px 0;
    background: white;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
    font-size: 14px;
    line-height: 1.6;
    color: #111827;
    word-break: break-word;
}
img { max-width: 100% !important; height: auto; }
a { color: #f97316; }
p { margin: 0 0 12px; }
p:last-child { margin-bottom: 0; }
table { max-width: 100% !important; border-collapse: collapse; }
</style>
</head>
<body>${html}</body>
</html>`)
        doc.close()

        const adjust = () => {
            const body = doc.body
            if (body) setHeight(body.scrollHeight + 24)
        }

        iframe.onload = adjust
        const timer = setTimeout(adjust, 400)
        return () => clearTimeout(timer)
    }, [html])

    return (
        <iframe
            ref={iframeRef}
            sandbox="allow-same-origin allow-popups"
            style={{ height, width: "100%", border: "none", display: "block", borderRadius: "4px" }}
            title="Email content"
        />
    )
}
