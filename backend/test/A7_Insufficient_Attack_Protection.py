#!/usr/bin/python3
# -*- coding: utf-8 -*-
"""
Stress testing the server
"""
import requests, time

lasttime= time.time()
for i in range(0, 350):
    r = requests.get("https://chic.tic.heia-fr.ch")
    currenttime = time.time()
    print("Request number: ", i, "\n time: ", currenttime - lasttime, "\n Status Code: ", r.status_code)
    lasttime = currenttime
