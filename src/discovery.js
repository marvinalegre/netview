import db from "./db.js";
import { getDevices } from "./devices.js";

const INTERVAL = 60 * 60 * 1000; // 1 hour

const insertDevice = db.prepare(`
  INSERT INTO devices (mac, ip, device_type, name)
  VALUES (?, ?, ?, ?)
  ON CONFLICT(mac) DO UPDATE SET
    ip = excluded.ip
`);

export async function discoverDevices() {
  const devices = await getDevices();

  for (const device of devices) {
    insertDevice.run(
      device.MacAddr,
      device.IpAddr,
      device.DevType,
      device.HostName,
    );
  }

  console.log(`Discovered ${devices.length} devices`);

  const onlineCount = devices.filter((d) => d.DevStatus === "Online").length;
  recordOnlineCount(onlineCount);
}

export function startDiscovery() {
  // Discover immediately when Netview starts.
  discoverDevices().catch(console.error);

  // Then discover every hour.
  setInterval(() => {
    discoverDevices().catch(console.error);
  }, INTERVAL);
}

function recordOnlineCount(count) {
  db.prepare(
    `
    INSERT INTO online_counts (online_count)
    VALUES (?)
  `,
  ).run(count);
}
