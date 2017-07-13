#!/usr/bin/python3
# -*- coding: utf-8 -*-

"""
Self-made unit test for the project chic api
Standard usage:       python3 unit_test_self.py
"""

__author__  = "Bruno Produit"
import unittest, requests, time, json

class Test(unittest.TestCase):
    
    
    def authenticate():
        r = requests.get("https://chic.tic.heia-fr.ch/auth?uuid=4c3c9845-5ef6-4556-87b0-f04a4c33004e&password=password")
        token = json.loads(r.text)['token']
        token = "Bearer " + token
        return token
    
    #Test 1 - GET /didyouknow
    def test_GET_didyouknow(self):
        r = requests.get("https://chic.tic.heia-fr.ch/didyouknow")
        self.assertTrue(r.headers['content-type']=='text/html')
        self.assertTrue(r.status_code==200)
        
    #Test 2 - GET /auth with user Bruno
    def test_GET_auth(self):
        r = requests.get("https://chic.tic.heia-fr.ch/auth?uuid=4c3c9845-5ef6-4556-87b0-f04a4c33004e&password=password")
        self.assertTrue(r.headers['content-type']=='application/json; charset=utf-8')
        token = json.loads(r.text)['token']
        token = "Bearer " + token
        self.assertTrue(type(token) is str)
        self.assertTrue(r.status_code==200)
    
    #Test 3 - GET /change/5.5 
    def test_GET_change(self):
        r = requests.get("https://chic.tic.heia-fr.ch/change/5.5", headers={'Authorization': Test.authenticate()})
        self.assertTrue(r.headers['content-type']=='application/json; charset=utf-8')
        self.assertTrue(r.status_code==200)
    
    #Test 4 - GET /users
    def test_GET_users(self):
        r = requests.get("https://chic.tic.heia-fr.ch/users?uuid=cf94737d-5d5b-4ca4-ba6f-33cc1f1f8de1")
        self.assertTrue(r.headers['content-type']=='application/json; charset=utf-8')
        self.assertTrue(r.status_code==200)
        
   
    
       
if __name__ == '__main__':
    unittest.main() 
