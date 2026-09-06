import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { getDevices } from "./devices.js";
import { startDiscovery } from "./discovery.js";
import db from "./db.js";
import { serveStatic } from "@hono/node-server/serve-static";

const app = new Hono();

app.get("/api/devices", async (c) => {
  try {
    const devices = await getDevices();

    return c.json(
      devices.map((device) => ({
        ip: device.IpAddr,
        mac: device.MacAddr,
        status: device.DevStatus,
        type: device.DevType,
        hostname: device.HostName,
        connection: device.PortType,
        ssid: device.Port,
      })),
    );
  } catch (error) {
    console.error(error);

    return c.json({ error: "Failed to get devices" }, 500);
  }
});

app.get("/api/online-counts", (c) => {
  const rows = db
    .prepare(
      `
      SELECT online_count, recorded_at
      FROM online_counts
      ORDER BY recorded_at ASC
    `,
    )
    .all();

  return c.json(rows);
});

app.use("/*", serveStatic({ root: "./public" }));

startDiscovery();

const host = process.argv.includes("--host") ? "0.0.0.0" : "127.0.0.1";
serve({
  fetch: app.fetch,
  port: 4000,
  hostname: host,
});

console.log("Server running on http://localhost:4000");
