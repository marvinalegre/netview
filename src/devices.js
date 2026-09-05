import * as acorn from "acorn";

export async function getDevices() {
  const randomNumber = await (
    await fetch("http://192.168.100.1/asp/GetRandCount.asp")
  ).text();

  const login = await fetch("http://192.168.100.1/login.cgi", {
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

  const cookie = login.headers.getSetCookie()[0];

  const devInfo = await fetch(
    "http://192.168.100.1/html/bbsp/common/GetLanUserDevInfo.asp",
    {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Accept-Encoding": "gzip, deflate",
        "Accept-Language": "en-US,en;q=0.9",
        Cookie: cookie,
        Host: "192.168.100.1",
        Origin: "http://192.168.100.1",
        Referer: "http://192.168.100.1/CustomApp/mainpage.asp",
        "User-Agent":
          "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1",
        "X-Requested-With": "XMLHttpRequest",
      },
      redirect: "manual",
    },
  );

  const data = await devInfo.text();
  const varDeclartionStmt = data
    .split("\n")
    .filter((l) => /^\s*var UserDevinfo /.test(l))[1];

  const ast = acorn.parse(varDeclartionStmt, {
    ecmaVersion: "latest",
  });

  if (ast.body.length > 1) {
    throw new Error("Invalid device list");
  }

  const fragment = `
var isRealmac = "0";
function USERDevice(
  Domain,
  IpAddr,
  MacAddr,
  Port,
  IpType,
  DevType,
  DevStatus,
  PortType,
  Time,
  HostName,
  IPv4Enabled,
  IPv6Enabled,
  DeviceType,
  UserDevAlias,
  UserSpecifiedDeviceType,
  LeaseTimeRemaining,
  RealMacAddr,
) {
  this.Domain = Domain;
  this.IpAddr = IpAddr.length == 0 ? "--" : IpAddr;
  this.MacAddr = MacAddr;

  if (Port == "LAN0" || Port == "SSID0") {
    this.Port = "--";
  } else {
    this.Port = Port;
  }

  this.PortID = Port;

  this.PortType = PortType;

  this.DevStatus = DevStatus;
  this.IpType = IpType;
  if (IpType == "Static") {
    this.DevType = "--";
  } else {
    if (DevType == "") {
      this.DevType = "--";
    } else {
      this.DevType = DevType;
    }
  }
  this.Time = Time;

  if (HostName == "") {
    this.HostName = "--";
  } else {
    this.HostName = HostName;
  }

  this.IPv4Enabled = IPv4Enabled;
  this.IPv6Enabled = IPv6Enabled;
  this.DeviceType = DeviceType;
  if (UserDevAlias == "") {
    this.UserDevAlias = "--";
  } else {
    this.UserDevAlias = UserDevAlias;
  }
  this.UserSpecifiedDeviceType = UserSpecifiedDeviceType;
  this.LeaseTimeRemaining = LeaseTimeRemaining;
  this.instid = "";
  this.IsClickDev = false;

  if (isRealmac == 1) {
    this.RealMacAddr = RealMacAddr;
  }
}

`;

  const tmp = eval(fragment + varDeclartionStmt + "UserDevinfo");
  return tmp.filter((d) => d !== null);
}
