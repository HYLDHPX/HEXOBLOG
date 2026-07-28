export default {
  async fetch(request) {
    const base = "https://raw.githubusercontent.com/HYLDHPX/HEXOBLOG/main";
    const url = new URL(request.url);
    let path = url.pathname;

    // 目录自动补齐 index.html
    if (path.endsWith("/")) {
      path += "index.html";
    }

    const targetUrl = new URL(base + path);
    const res = await fetch(targetUrl, {
      cf: { cacheTtl: 1200 }
    });

    // 404页面处理
    if (!res.ok) {
      const four04Res = await fetch(`${base}/404.html`);
      if (four04Res.ok) {
        return buildResponse(four04Res.body, path, 404);
      }
      return new Response("404 Not Found", { status: 404 });
    }

    return buildResponse(res.body, path, 200);
  }
};

// 统一构建响应，强制修正Content-Type
function buildResponse(body, path, status) {
  const headers = new Headers();

  // 强制设置正确MIME
  if (path.endsWith(".html")) {
    headers.set("content-type", "text/html; charset=utf-8");
  } else if (path.endsWith(".css")) {
    headers.set("content-type", "text/css; charset=utf-8");
  } else if (path.endsWith(".js")) {
    headers.set("content-type", "application/javascript; charset=utf-8");
  } else if (path.endsWith(".xml")) {
    headers.set("content-type", "application/xml; charset=utf-8");
  } else if (path.endsWith(".json")) {
    headers.set("content-type", "application/json; charset=utf-8");
  } else if (path.endsWith(".png")) {
    headers.set("content-type", "image/png");
  } else if (path.endsWith(".jpg") || path.endsWith(".jpeg")) {
    headers.set("content-type", "image/jpeg");
  } else if (path.endsWith(".svg")) {
    headers.set("content-type", "image/svg+xml");
  }

  headers.set("cache-control", "public, max-age=1200");
  headers.delete("x-frame-options");
  headers.delete("content-security-policy");

  return new Response(body, { status, headers });
}