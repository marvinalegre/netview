import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { getDevices } from "./devices.js";

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

serve({
  fetch: app.fetch,
  port: 3000,
});

console.log("Server running on http://localhost:3000");
