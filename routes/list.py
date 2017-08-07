import urllib2
import bs4
from pymongo import MongoClient
import random
import string
import requests, json

print "Updating.. Just wait a second!"

client = MongoClient('localhost', 27017)
db = client.stockchat
collection = db.stock

def get_company_list(url):
    soup = bs4.BeautifulSoup(urllib2.urlopen(url).read(), 'html.parser')
    company_dic = {}
    for i in soup.find_all('td', 'txt'):
        company_dic[i.text] = i.a['href'].split('=')[1]
    return company_dic

kospi_url = 'http://finance.daum.net/quote/all.daum?type=U&stype=P'
kosdaq_url = 'http://finance.daum.net/quote/all.daum?type=U&stype=Q'

kosdaq_dic = get_company_list(kosdaq_url)
for k,v in kosdaq_dic.items():
    res = requests.get("http://polling.finance.naver.com/api/realtime.nhn?query=SERVICE_ITEM:" + v)
    obj = res.json()
    data = obj['result']['areas'][0]['datas'][0]
#    print data['nm']
    if data['nv'] > data['sv']:
        up_down = "up"
    elif data['nv'] < data['sv']:
        up_down = "down"
    stock = {
                "title" : k,
                "code" : v,
                "current_val" : data['nv'],
                "yesterday_val" : data['sv'],
                "up_down" : up_down,
                "diff_percentage" : data['cr']
            }
    collection.update({"code" : v}, stock, upsert = True);
    print ".",

print "Kosdaq List Update Done!"

kospi_dic = get_company_list(kospi_url)
for k,v in kospi_dic.items():
    res = requests.get("http://polling.finance.naver.com/api/realtime.nhn?query=SERVICE_ITEM:" + v)
    obj = res.json()
    data = obj['result']['areas'][0]['datas'][0]
#    print data['nm']
    if data['nv'] > data['sv']:
        up_down = "up"
    elif data['nv'] < data['sv']:
        up_down = "down"
    stock = {
                "title" : k,
                "code" : v,
                "current_val" : data['nv'],
                "yesterday_val" : data['sv'],
                "up_down" : up_down,
                "diff_percentage" : data['cr']
            }
    collection.update({"code" : v}, stock, upsert = True);

    print ".",

print "Kospi List Update Done!"

print "\n\nUpdate Done!"
