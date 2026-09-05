import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { getDevices } from "./devices.js";
import { startDiscovery } from "./discovery.js";
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

app.use("/*", serveStatic({ root: "./public" }));

startDiscovery();

const host = process.argv.includes("--host") ? "0.0.0.0" : "127.0.0.1";
serve({
  fetch: app.fetch,
  port: 4000,
  hostname: host,
});

console.log("Server running on http://localhost:4000");
