croncmd="curl http://localhost:7000/update >/dev/null 2>&1"
cronjob="*/3 * * * * $croncmd"
( crontab -l | grep -v -F "$croncmd" ; echo "$cronjob" ) | crontab -