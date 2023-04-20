1. SSH по паролю если нет сертификата

```shell
ssh user@ip
```

2. Меняем пароль

```shell
passwd
```

3. Устанавливаем сертификат для подключения с помощью ключа
   https://www.digitalocean.com/community/tutorials/how-to-use-ssh-to-connect-to-a-remote-server-ru

генерируем ключ

```shell
ssh-keygen -t rsa
```

передаем на сервер

```shell
scp [путь к файлу] [имя пользователя]@[имя сервера/ip-адрес]:[путь к файлу]
scp id_rsa.pub user@server.net:/~/.ssh
```

4. Включаем доступ по сертификату

```shell
sudo nano /etc/ssh/sshd_config
```

задаем настройки

```
PubkeyAuthentication yes
ChallengeResponseAuthentication no
```

копируем публичный ключ в authorized_keys

```shell
cat id_rsa.pub >> ~/.ssh/authorized_keys
```

установить права, если необходимо

```shell
chmod 700 ~/.ssh/
chmod 600 ~/.ssh/authorized_keys
```

перезапускаем ssh

```shell
sudo systemctl reload ssh
```

проверяем доступ по сертификату, если все работает отключаем доступ по паролю
Если хотите вручную указать размещение ключа, выполните команду:

```shell
ssh -i ~/.ssh/id_rsa user@server.net
```

```
PasswordAuthentication no
```

перезапускаем ssh последний раз

```shell
sudo systemctl reload ssh
```

5. установим StrongSwan
   https://www.digitalocean.com/community/tutorials/how-to-set-up-an-ikev2-vpn-server-with-strongswan-on-ubuntu-20-04-ru

```shell
sudo apt install strongswan strongswan-pki libcharon-extra-plugins libcharon-extauth-plugins
```

6. Создание центра сертификации

```shell
cd /etc/ipsec.d/
```

генерируем ключ

```shell
pki --gen --type rsa --size 4096 --outform pem > private/ca-key.pem
```

подписываем корневой сертификат

```shell
pki --self --ca --lifetime 3650 --in private/ca-key.pem \
    --type rsa --dn "CN=77.91.100.34" --outform pem > cacerts/ca-cert.pem
```

7. Генерирование сертификата для сервера VPN

```shell
pki --gen --type rsa --size 4096 --outform pem > private/server-key.pem

pki --pub --in private/server-key.pem --type rsa \
    | pki --issue --lifetime 1825 \
        --cacert cacerts/ca-cert.pem \
        --cakey private/ca-key.pem \
        --dn "CN=77.91.100.34" --san dns:77.91.100.34 --san 77.91.100.34 \
        --flag serverAuth --flag ikeIntermediate --outform pem \
    >  certs/server-cert.pem
```

```shell
openssl pkcs12 -export -inkey carolKey.pem \
               -in carolCert.pem -name "carol" \
               -certfile strongswanCert.pem -caname "strongSwan Root CA" \
               -out carolCert.p12
```

8. Настройка StrongSwan

создадим резервную копию конфигурации strongSwan и откроем ее в редакторе:

```shell
sudo mv /etc/ipsec.conf{,.original}

sudo nano /etc/ipsec.conf
```

```
config setup
    charondebug="ike 1, knl 1, cfg 0"
    uniqueids=no

conn ikev2-vpn
    auto=add
    compress=no
    type=tunnel
    keyexchange=ikev2
    fragmentation=yes
    forceencaps=yes
    dpdaction=clear
    dpddelay=300s
    rekey=no

    left=%any
    leftid=77.91.100.34
    leftcert=server-cert.pem
    leftsendcert=always
    leftsubnet=0.0.0.0/0

    right=%any
    rightid=%any
    rightauth=eap-mschapv2
    rightsourceip=10.10.10.0/24
    rightdns=8.8.8.8,8.8.4.4
    rightsendcert=never

    eap_identity=%identity
    ike=chacha20poly1305-sha512-curve25519-prfsha512,aes256gcm16-sha384-prfsha384-ecp384,aes256-sha1-modp1024,aes128-sha1-modp1024,3des-sha1-modp1024!
    esp=chacha20poly1305-sha512,aes256gcm16-ecp384,aes256-sha256,aes256-sha1,3des-sha1!
```

9. Настройка аутентификации VPN

Откроем для редактирования файл secrets

```shell
sudo nano /etc/ipsec.secrets
```

```
: RSA "server-key.pem"
```

Мы завершили настройку параметров VPN и теперь можем перезапустить службу VPN

```shell
sudo systemctl restart strongswan-starter
```

10. Настроим сетевые параметры ядра

```shell
nano /etc/sysctl.conf
```

```
#Раскомментируем (уберем решетку перед параметром) данный параметр, чтобы включить переадресацию пакетов
net.ipv4.ip_forward=1

#Раскомментируем данный параметр, чтобы предотвратить MITM-атаки
net.ipv4.conf.all.accept_redirects = 0

#Раскомментируем данный параметр, чтобы запретить отправку ICMP-редиректов
net.ipv4.conf.all.send_redirects = 0

#В любом месте файла на новой строке добавьте этот параметр, запретив поиск PMTU
net.ipv4.ip_no_pmtu_disc = 1
```

подгрузим новые значения:

```shell
sysctl -p
```

11. Настроим iptables

После установки нас спросят, сохранить ли текущие правила IPv4 и IPv6. Ответим «Нет», так как у нас новая система, и нечего сохранять.

```shell
apt-get install iptables-persistent
```

Перейдем к формированию правил iptables. На всякий пожарный, очистим все цепочки:

```shell
iptables -P INPUT ACCEPT
iptables -P FORWARD ACCEPT
iptables -F
iptables -Z
```

Разрешим соединения по SSH на 22 порту, чтобы не потерять доступ к машине:

```shell
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
```

Разрешим соединения на loopback-интерфейсе:

```shell
iptables -A INPUT -i lo -j ACCEPT
```

Теперь разрешим входящие соединения на UDP-портах 500 и 4500:

```shell
iptables -A INPUT -p udp --dport  500 -j ACCEPT
iptables -A INPUT -p udp --dport 4500 -j ACCEPT
```

Разрешим переадресацию ESP-трафика:

```shell
iptables -A FORWARD --match policy --pol ipsec --dir in  --proto esp -s 10.10.10.0/24 -j ACCEPT
iptables -A FORWARD --match policy --pol ipsec --dir out --proto esp -d 10.10.10.0/24 -j ACCEPT
```

Настроим маскирование трафика, так как наш VPN-сервер, по сути, выступает как шлюз между Интернетом и VPN-клиентами:

```shell
iptables -t nat -A POSTROUTING -s 10.10.10.0/24 -o eth0 -m policy --pol ipsec --dir out -j ACCEPT
iptables -t nat -A POSTROUTING -s 10.10.10.0/24 -o eth0 -j MASQUERADE
```

Настроим максимальный размер сегмента пакетов:

```shell
iptables -t mangle -A FORWARD --match policy --pol ipsec --dir in -s 10.10.10.0/24 -o eth0 -p tcp -m tcp --tcp-flags SYN,RST SYN -m tcpmss --mss 1361:1536 -j TCPMSS --set-mss 1360
```

Запретим все прочие соединения к серверу:

```shell
iptables -A INPUT -j DROP
iptables -A FORWARD -j DROP
```

Сохраним правила, чтобы они загружались после каждой перезагрузки:

```shell
netfilter-persistent save
netfilter-persistent reload
```

Перезагрузим машину:

```shell
reboot
```

И посмотрим работают ли правила iptables:

```shell
iptables -S
```

Работает ли strongSwan:

```shell
ipsec statusall
```

12. Тестирование подключения VPN на Windows, macOS, Ubuntu, iOS и Android

Вначале нужно скопировать созданный вами сертификат CA и установить его на клиентские устройства, которые будут подключаться к VPN.

```shell
cat /etc/ipsec.d/cacerts/ca-cert.pem
```

13. Исправление ошибок

логи:

```shell
tail -n 50 > /var/log/syslog
```

https://docs.strongswan.org/docs/5.9/support/faq.html#_no_private_key_found

https://docs.strongswan.org/docs/5.9/interop/windowsClients.html#_using_passwords_with_eap_mschapv2
https://www.digitalocean.com/community/tutorials/how-to-set-up-an-ikev2-vpn-server-with-strongswan-on-ubuntu-22-04
https://superuser.com/questions/1717733/strongswan-ikev2-vpn-server-ubuntu-22-04-lts-network-connection-between-your-c

9m6YzuUiZ6G
