#!/usr/bin/env bash

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
USER_NAME="$(whoami)"
SERVICE_FILE="/etc/systemd/system/netview.service"
NODE_PATH="$(command -v node)"

echo "Installing NetView systemd service..."
echo "Project directory: $PROJECT_DIR"
echo "User: $USER_NAME"

sudo tee /etc/systemd/system/netview.service >/dev/null <<EOF
[Unit]
Description=Netview
After=network.target

[Service]
User=$USER_NAME
WorkingDirectory=$PROJECT_DIR
ExecStart=$NODE_PATH --env-file=$PROJECT_DIR/.env $PROJECT_DIR/src/server.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable netview

echo
echo "NetView service installed."
echo "Start it with:"
echo "  sudo systemctl start netview"
