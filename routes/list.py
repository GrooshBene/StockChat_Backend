import urllib2
import bs4
from pymongo import MongoClient
import random
import string


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
    stock = {
                "title" : k,
                "code" : v
            }
    collection.insert(stock)
    print ".",

print "Kosdaq List Update Done!"

kospi_dic = get_company_list(kospi_url)
for k,v in kospi_dic.items():
    stock = {
                "title" : k,
                "code" : v
    }
    collection.insert(stock)
    print ".",

print "Kospi List Update Done!"

print "\n\nUpdate Done!"
