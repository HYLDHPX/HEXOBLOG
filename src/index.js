export default {
  async fetch(request) {
    const base = "https://raw.githubusercontent.com/HYLDHPX/HEXOBLOG/main";
    const url = new URL(request.url);
    let path = url.pathname;

    if (path.endsWith("/")) {
      path += "index.html";
    }

    const targetUrl = new URL(base + path);
    const res = await fetch(targetUrl, {
      cf: { cacheTtl: 1800 }
    });

    if (!res.ok) {
      const four04Res = await fetch(`${base}/404.html`);
      if (four04Res.ok) {
        return new Response(four04Res.body, {
          status: 404,
          headers: fixHeaders(four04Res.headers, path)
        });
      }
      return new Response("404 Not Found", { status: 404 });
    }

    return new Response(res.body, {
      headers: fixHeaders(res.headers, path)
    });
  }
};

function fixHeaders(originHeaders, path) {
  const headers = new Headers(originHeaders);
  headers.delete("x-frame-options");
  headers.delete("content-security-policy");

  if (path.endsWith(".html")) headers.set("content-type", "text/html;charset=utf-8");
  if (path.endsWith(".css")) headers.set("content-type", "text/css;charset=utf-8");
  if (path.endsWith(".js")) headers.set("content-type", "application/javascript;charset=utf-8");
  if (path.endsWith(".xml")) headers.set("content-type", "application/xml;charset=utf-8");
  if (path.endsWith(".json")) headers.set("content-type", "application/json;charset=utf-8");

  return headers;
}