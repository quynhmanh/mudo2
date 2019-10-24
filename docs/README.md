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
It is simple to install PostgreSQL from CentOS 7 repositories. Start with the following command:

    sudo yum install postgresql-server postgresql-contrib

This might take some time to complete.

Once the installation is done, you can initialize the database using the below command:

    sudo postgresql-setup initdb

After initializing the database, you can start the database using:

    sudo systemctl start postgresql

This completes our database installation and initialization. If required you can configure PostgreSQL to start on every system reboot automatically.

    sudo systemctl enable postgresql

## 7. Install .NET Core SDK on Linux CentOS 7 - x64
Before installing .NET, you'll need to register the Microsoft key, register the product repository, and install required dependencies. This only needs to be done once per machine.

Open a terminal and run the following commands:

    sudo rpm -Uvh https://packages.microsoft.com/config/centos/7/packages-microsoft-prod.rpm

Update the products available for installation, then install the .NET SDK.

In your terminal, run the following commands:

    sudo yum install dotnet-sdk-3.0

## 8. Application Directory
`/home/draft`

## 9. Install Docker Engine - Community

1. SET UP THE REPOSITORY

    Install required packages. yum-utils provides the yum-config-manager utility, and device-mapper-persistent-data and lvm2 are required by the devicemapper storage driver.

        sudo yum install -y yum-utils \
        device-mapper-persistent-data \
        lvm2

    Use the following command to set up the stable repository.

        sudo yum-config-manager \
        --add-repo \
        https://download.docker.com/linux/centos/docker-ce.repo

2. INSTALL DOCKER ENGINE - COMMUNITY
    
    Install the latest version of Docker Engine - Community and containerd, or go to the next step to install a specific version:

        sudo yum install docker-ce docker-ce-cli containerd.io

    If prompted to accept the GPG key, verify that the fingerprint matches 060A 61C5 1B55 8A7F 742B 77AA C52F EB6B 621E 9F35, and if so, accept it.

    Docker is installed but not started. The docker group is created, but no users are added to the group.

    To install a specific version of Docker Engine - Community, list the available versions in the repo, then select and install:

    a. List and sort the versions available in your repo. This example sorts results by version number, highest to lowest, and is truncated:

        yum list docker-ce --showduplicates | sort -r

    b. Install a specific version by its fully qualified package name, which is the package name (docker-ce) plus the version string (2nd column) starting at the first colon (:), up to the first hyphen, separated by a hyphen (-). For example, `docker-ce-18.09.1`.

        sudo yum install docker-ce-<VERSION_STRING> docker-ce-cli-<VERSION_STRING> containerd.io

    Start Docker.

        sudo systemctl start docker

    Verify that Docker Engine - Community is installed correctly by running the hello-world image.

        sudo docker run hello-world

## 10. Installing Jenkins
Jenkins is a Java application, so the first step is to install Java. Run the following command to install the OpenJDK 8 package:

    sudo yum install java-1.8.0-openjdk-devel

The next step is to enable the Jenkins repository. To do that, import the GPG key using the following curl command:

    curl --silent --location http://pkg.jenkins-ci.org/redhat-stable/jenkins.repo | sudo tee /etc/yum.repos.d/jenkins.repo

And add the repository to your system with:

    sudo rpm --import https://jenkins-ci.org/redhat/jenkins-ci.org.key

Once the repository is enabled, install the latest stable version of Jenkins by typing:

    sudo yum install jenkins

After the installation process is completed, start the Jenkins service with:

    sudo systemctl start jenkins

To check whether it started successfully run:

    systemctl status jenkins

Finally enable the Jenkins service to start on system boot.

    sudo systemctl enable jenkins

`Adjust the Firewall`

If you are installing Jenkins on a remote CentOS server that is protected by a firewall you need to port 8080.

Use the following commands to open the necessary port:

    sudo firewall-cmd --permanent --zone=public --add-port=8080/tcp
    sudo firewall-cmd --reload

`Setting Up Jenkins`

To set up your new Jenkins installation, open your browser and type your domain or IP address followed by port 8080:

    http://your_ip_or_domain:8080

Use the following command to print the password on your terminal:

    sudo cat /var/lib/jenkins/secrets/initialAdminPassword

## 10. Installing Git

    sudo yum install git

