#!/bin/bash

echo "==========================================="
echo "   Ubuntu Auto Website + Nginx + SSL Setup"
echo "==========================================="
echo ""
read -p "Enter your domain (example: example.com): " DOMAIN

WWW_DOMAIN="www.$DOMAIN"
WEBROOT="/var/www/$DOMAIN"
NGINX_CONF="/etc/nginx/sites-available/$DOMAIN"

echo ""
echo "Using domain: $DOMAIN"
echo ""

sleep 1

echo "Installing required packages..."
sudo apt update -y
sudo apt install -y nginx certbot python3-certbot-nginx

echo "Creating website directory..."
sudo mkdir -p $WEBROOT
sudo chown -R www-data:www-data $WEBROOT
sudo chmod -R 755 $WEBROOT

echo "Creating sample index.html..."
echo "<h1>$DOMAIN is live!</h1>" | sudo tee "$WEBROOT/index.html" > /dev/null

echo "Removing old Nginx config if it exists..."
sudo rm -f /etc/nginx/sites-enabled/$DOMAIN
sudo rm -f /etc/nginx/sites-available/$DOMAIN

echo "Creating TEMPORARY HTTP-ONLY Nginx config..."
sudo bash -c "cat > $NGINX_CONF" <<EOF
server {
    listen 80;
    listen [::]:80;

    server_name $DOMAIN $WWW_DOMAIN;

    root /var/www/$DOMAIN;
    index index.html;

    location / {
        try_files \$uri \$uri/ =404;
    }
}
EOF

echo "Enabling temporary site..."
sudo ln -s $NGINX_CONF /etc/nginx/sites-enabled/

echo "Testing Nginx..."
sudo nginx -t

echo "Reloading Nginx..."
sudo systemctl reload nginx

echo ""
echo "==========================================="
echo "   Requesting SSL Certificate From Let's Encrypt"
echo "==========================================="
sudo certbot --nginx -d $DOMAIN -d $WWW_DOMAIN

echo ""
echo "Creating FINAL HTTPS + Redirect Nginx config..."

sudo bash -c "cat > $NGINX_CONF" <<EOF
# Redirect HTTP → HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN $WWW_DOMAIN;
    return 301 https://\$host\$request_uri;
}

# Main HTTPS site
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    server_name $DOMAIN $WWW_DOMAIN;

    root /var/www/$DOMAIN;
    index index.html;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;

    location / {
        try_files \$uri \$uri/ =404;
    }
}
EOF

echo "Testing Nginx..."
sudo nginx -t

echo "Reloading Nginx..."
sudo systemctl reload nginx

echo ""
echo "==========================================="
echo "       SITE INSTALLED & SECURE"
echo "==========================================="
echo "Your website is live at:"
echo "https://$DOMAIN"
echo ""
