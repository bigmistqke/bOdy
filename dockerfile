FROM node:20 AS frontend-builder


WORKDIR /app

COPY package*.json pnpm-lock.yaml ./
RUN npm install --force

COPY . .

RUN npm run build

# PHP-Stage mit Apache
FROM php:8.2-apache
RUN a2enmod rewrite
RUN a2enmod mime
RUN echo 'AddType application/javascript .js' > /etc/apache2/conf-available/javascript-mime.conf
RUN echo 'AddType text/css .css' >> /etc/apache2/conf-available/javascript-mime.conf
RUN a2enconf javascript-mime

RUN apt-get update && apt-get install -y \
    libzip-dev \
    unzip \
    && docker-php-ext-install zip

RUN echo '\
    <VirtualHost *:443>\n\
    ServerName badaa.xyz\n\
    DocumentRoot /var/www/html/dist\n\
    ErrorLog ${APACHE_LOG_DIR}/error.log\n\
    CustomLog ${APACHE_LOG_DIR}/access.log combined\n\
    \n\
    <Directory /var/www/html/dist>\n\
    Options -Indexes +FollowSymLinks\n\
    AllowOverride All\n\
    Require all granted\n\
    </Directory>\n\
    \n\
    # PHP-Endpunkte im Hauptverzeichnis verfügbar machen\n\
    Alias /getDiaryEntries.php /var/www/html/getDiaryEntries.php\n\
    Alias /saveDiaryEntry.php /var/www/html/saveDiaryEntry.php\n\
    \n\
    <Directory /var/www/html>\n\
    AllowOverride None\n\
    Require all granted\n\
    </Directory>\n\
    </VirtualHost>\
    ' > /etc/apache2/sites-available/000-default.conf

COPY .htaccess /var/www/html/dist/.htaccess

COPY --from=frontend-builder /app/dist /var/www/html/dist
COPY --from=frontend-builder /app/api /var/www/html/api

COPY --from=frontend-builder /app/dist/getDiaryEntries.php /var/www/html/
COPY --from=frontend-builder /app/dist/saveDiaryEntry.php /var/www/html/
COPY --from=frontend-builder /app/dist/index.html /var/www/html/
COPY --from=frontend-builder /app/dist/entries /var/www/html/entries

COPY --from=frontend-builder /app/assets /var/www/html/assets

WORKDIR /var/www/html

RUN chown -R www-data:www-data /var/www/html