# NetView

NetView is a lightweight local network monitoring dashboard for viewing devices connected to your network.

## Features

- 📱 View connected devices
- 🟢 Monitor device online status
- 📊 View live device statistics
- 📈 Track the number of online devices over time
- 🔄 Manually refresh device information
- 🌐 Optionally expose the dashboard to your local network
- ⚡ Lightweight Node.js server
- 🦋 Hono-based HTTP server

## Requirements

- Linux
- Node.js
- pnpm
- systemd

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd netview
```

Install dependencies:

```bash
pnpm install
```

Add your base64 password to `.env`.

## Running NetView

Start NetView locally:

```bash
pnpm start
```

To make NetView accessible from other devices on your local network:

```bash
node --env-file=.env src/server.js --host
```

## Start NetView Automatically

NetView can run automatically whenever your laptop starts.

Run the installation script from the project directory:

```bash
sudo bash install-service.sh
```

The installer configures the systemd service using the current NetView installation.

After installation, start NetView:

```bash
sudo systemctl start netview
```

### Check the service

```bash
systemctl status netview
```

### View logs

```bash
journalctl -u netview -f
```

### Stop NetView

```bash
sudo systemctl stop netview
```

### Disable automatic startup

```bash
sudo systemctl disable netview
```

## Project Structure

```text
netview/
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── src/
│   ├── server.js
│   └── devices.js
├── .env
├── package.json
├── pnpm-lock.yaml
├── install-service.sh
└── README.md
```

## Development

Run NetView directly during development:

```bash
pnpm start
```

## License

MIT
