import { CookieJar } from "tough-cookie";

const jar = new CookieJar();

async function request(url, options = {}) {
  const cookie = await jar.getCookieString(url);

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...(cookie ? { Cookie: cookie } : {}),
    },
    redirect: "manual",
  });

  const setCookie = response.headers.getSetCookie();

  for (const cookie of setCookie) {
    await jar.setCookie(cookie, url);
  }

  return response;
}

// Login
const login = await request("http://192.168.1.1/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: new URLSearchParams({
    username: "admin",
    password: "YOUR_PASSWORD",
  }),
});

console.log(login.status);

// Now the sid cookie is stored in `jar`

// Request the page containing the devices
const page = await request("http://192.168.1.1/connected-devices");

const html = await page.text();

console.log(html);
