const randomNumber = await (
  await fetch("http://192.168.100.1/asp/GetRandCount.asp")
).text();

const response = await fetch("http://192.168.100.1/login.cgi", {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Accept-Encoding": "gzip, deflate",
    "Accept-Language": "en-US,en;q=0.9",
    "Cache-Control": "max-age=0",
    Cookie: "Cookie=body:Language:english:id=-1",
    Host: "192.168.100.1",
    Origin: "http://192.168.100.1",
    Referer: "http://192.168.100.1/",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent":
      "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1",
  },
  body: new URLSearchParams({
    UserName: "root",
    PassWord: "YWRtaW5IVw==",
    Language: "english",
    "x.X_HW_Token": randomNumber,
  }),
  redirect: "manual",
});

const cookie = response.headers.getSetCookie()[0];
console.log(cookie);
