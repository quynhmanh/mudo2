## 1. Installing the Certbot Let’s Encrypt Client
Enable access to the EPEL repository on your server by typing:

    sudo yum install epel-release

Once the repository has been enabled, you can obtain the `certbot-nginx` package by typing:

    sudo yum install certbot-nginx

The `certbot` Let’s Encrypt client is now installed and ready to use.
    
## 2. Setting up Nginx
If you haven’t installed Nginx yet, you can do so now. The EPEL repository should already be enabled from the previous section, so you can install Nginx by typing:

    sudo yum install nginx

Then, start Nginx using systemctl:

    sudo systemctl start nginx

Certbot can automatically configure SSL for Nginx, but it needs to be able to find the correct server block in your config. It does this by looking for a server_name directive that matches the domain you’re requesting a certificate for. If you’re starting out with a fresh Nginx install, you can update the default config file:

    sudo vi /etc/nginx/nginx.conf

`/etc/nginx/nginx.conf`

    worker_processes  1;

    events {
        worker_connections  1024;
    }


    http {
        include       mime.types;
        default_type  application/octet-stream;
        client_max_body_size 100M;

        log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                        '$status $body_bytes_sent "$http_referer" '
                        '"$http_user_agent" "$http_x_forwarded_for"';

        access_log  /var/log/nginx/access.log  main;

        sendfile        on;
        #tcp_nopush     on;

        #keepalive_timeout  0;
        keepalive_timeout  65;
        #tcp_nodelay        on;

        #gzip  on;
        #gzip_disable "MSIE [1-6]\.(?!.*SV1)";

        server_tokens off;

        include /etc/nginx/conf.d/*.conf;
    }

`/etc/nginx/conf.d/draft.vn.conf`

    server {
        server_name draft.vn www.draft.vn;
        location / {
            proxy_pass http://127.0.0.1:64099/;
        }
    }

Verify the syntax of your configuration edits with:

    sudo nginx -t

If that runs with no errors, reload Nginx to load the new configuration:

    sudo systemctl reload nginx

Certbot will now be able to find the correct server block and update it. Now we’ll update our firewall to allow HTTPS traffic.

## 3. Updating the Firewall

If you have a firewall enabled, make sure port 80 and 443 are open to incoming traffic. If you are not running a firewall, you can skip ahead.

If you have a `firewalld` firewall running, you can open these ports by typing:

    sudo firewall-cmd --add-service=http
    sudo firewall-cmd --add-service=https
    sudo firewall-cmd --runtime-to-permanent

If have an `iptables` firewall running, the commands you need to run are highly dependent on your current rule set. For a basic rule set, you can add HTTP and HTTPS access by typing:

    sudo iptables -I INPUT -p tcp -m tcp --dport 80 -j ACCEPT
    sudo iptables -I INPUT -p tcp -m tcp --dport 443 -j ACCEPT

We’re now ready to run Certbot and fetch our certificates.

## 4. Obtaining a Certificate
Certbot provides a variety of ways to obtain SSL certificates, through various plugins. The Nginx plugin will take care of reconfiguring Nginx and reloading the config whenever necessary:

    sudo certbot --nginx -d draft.vn -d www.draft.vn

This runs `certbot` with the `--nginx` plugin, using `-d` to specify the names we’d like the certificate to be valid for.

If this is your first time running `certbot`, you will be prompted to enter an email address and agree to the terms of service. After doing so, `certbot` will communicate with the Let’s Encrypt server, then run a challenge to verify that you control the domain you’re requesting a certificate for.
    
## 5. Setting Up Auto Renewal
To run the renewal check daily, we will use `cron`, a standard system service for running periodic jobs. We tell `cron` what to do by opening and editing a file called a `crontab`.

    sudo crontab -e

Your text editor will open the default crontab which is an empty text file at this point. Paste in the following line, then save and close it:

    15 3 * * * /usr/bin/certbot renew --quiet

The `15 3 * * *` part of this line means “run the following command at 3:15 am, every day”. You may choose any time.

The `renew` command for Certbot will check all certificates installed on the system and update any that are set to expire in less than thirty days. `--quiet` tells Certbot not to output information or wait for user input.

`cron` will now run this command daily. All installed certificates will be automatically renewed and reloaded when they have thirty days or less before they expire.

## 6. Install PostgreSQL
`ident/peer -> md5`

    vi /var/lib/pgsql/data/pg_hba.conf

backup db:

    pg_dump dbname -U postgres -h localhost > backup

restore db:

    psql -U postgres -h localhost dbname < backup


## 7. Install .NET Core SDK on Linux CentOS 7 - x64

## 8. Application Directory
`/root`

Copy folders: `test-extension`, `images`, `fonts`, `videos`

## 9. Install Docker Engine - Community

    docker network create mynet --subnet 192.168.0.0/24 --gateway 192.168.0.1

## 10. Installing Jenkins

    usermod -a -G docker jenkins
    systemctl restart jenkins

## 10. Install Git

## 11. Install Nodejs

## 11. Install Elasticsearch
Start and enable the `elasticsearch` service by running:

    sudo systemctl enable elasticsearch.service
    sudo systemctl start elasticsearch.service

Copy data folder `/var/lib/elasticsearch/`, then:

    chown -R elasticsearch:elasticsearch /var/lib/elasticsearch/
    systemctl restart elasticsearch.service

## 12. Notes
1. `var executablePath = "/usr/bin/google-chrome-stable"`;

2. Allow `jenkins` run scripts with `sudo` permission (`Not use`):

    a. Run following command:
    ```
    sudo visudo
    ```

    b. Insert scripts, for example:

    ```
    jenkins ALL=(ALL) NOPASSWD: /path/to/script
    ```

3. Modify memory usage for elasticsearch:

    ```
    vi /etc/elasticsearch/jvm.options

    -Xms512m
    -Xmx512m
    ```


