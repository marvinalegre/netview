const devicesElement = document.querySelector("#devices");
const summaryElement = document.querySelector("#summary");
const refreshButton = document.querySelector("#refresh");

async function loadDevices() {
  refreshButton.disabled = true;
  refreshButton.textContent = "↻ Refreshing...";

  try {
    const response = await fetch("/api/devices");

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const devices = await response.json();

    renderDevices(devices);
  } catch (error) {
    console.error(error);

    devicesElement.innerHTML = `
      <p class="error">
        Failed to load devices.
      </p>
    `;

    summaryElement.textContent = "Unable to load devices";
  } finally {
    refreshButton.disabled = false;
    refreshButton.textContent = "↻ Refresh";
  }
}

function renderDevices(devices) {
  const online = devices.filter(
    (device) => device.status.toLowerCase() === "online",
  );

  summaryElement.textContent =
    `${devices.length} device${devices.length === 1 ? "" : "s"} · ` +
    `${online.length} online`;

  if (devices.length === 0) {
    devicesElement.innerHTML = `
      <p class="empty">No devices found.</p>
    `;
    return;
  }

  devicesElement.innerHTML = devices
    .map((device) => {
      const isOnline = device.status.toLowerCase() === "online";

      const name =
        device.hostname !== "--"
          ? device.hostname
          : device.type !== "--"
            ? device.type
            : "Unknown device";

      return `
        <article class="device">
          <div class="device-header">
            <span class="status ${isOnline ? "online" : "offline"}"></span>
            <span class="device-name">${escapeHtml(name)}</span>
          </div>

          <div class="details">
            <div class="detail">
              <span>IP Address</span>
              ${escapeHtml(device.ip)}
            </div>

            <div class="detail">
              <span>MAC Address</span>
              ${escapeHtml(device.mac)}
            </div>

            <div class="detail">
              <span>Connection</span>
              ${escapeHtml(device.connection)}
            </div>

            <div class="detail">
              <span>SSID</span>
              ${escapeHtml(device.ssid)}
            </div>

            <div class="detail">
              <span>Status</span>
              ${escapeHtml(device.status)}
            </div>

            <div class="detail">
              <span>Device Type</span>
              ${escapeHtml(device.type)}
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

refreshButton.addEventListener("click", loadDevices);

loadDevices();
