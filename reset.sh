pm2 del all || true

echo 'FLUSHALL' | redis-cli || true

rm -rf /home/node/.pm2/logs || true
