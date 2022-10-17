import json
from flask import Flask, request
from collections import defaultdict
from itertools import groupby
import math
from flask_cors import CORS
import re

app = Flask(__name__)
CORS(app)

transactions = {
'T1': {'date': '2021-05-09', 'merchant_code' : 'sportcheck', 'amount_cents': 2500},
'T2': {'date': '2021-05-10', 'merchant_code' : 'tim_hortons', 'amount_cents': 1000},
'T3': {'date': '2021-05-10', 'merchant_code' : 'the_bay', 'amount_cents': 500}
}

#gets new keys 'dates'
def key_func(k):
	return k['date']

def calculateDollarAmount(amountInCents):
    dollarAmount = amountInCents / 100
    return dollarAmount   

def formatTransactions(transactions):
    sortedTransactions = []
    groupedTransactions = []
    #truncate day from date
    for key1 in transactions.values():
        key1['date'] = key1['date'][:-3]
        sortedTransactions.append(key1)
    #sort by day
    sortedTransactions = sorted(sortedTransactions, key=key_func)
    #group by month
    for key, value in groupby(sortedTransactions, key_func):
        groupedTransactions.append((list(value)))
    return groupedTransactions

#Calculate totals by month    
def calcTotals(transactions):
    groupedTransactions = formatTransactions(transactions)
    totalsByMonth = defaultdict(dict)

    for key,i in enumerate(groupedTransactions):
        totalSportCheckCents = sum(d['amount_cents'] for d in groupedTransactions[key] if d['merchant_code'] == 'sportcheck')
        totalTimHortonCents = sum(d['amount_cents'] for d in  groupedTransactions[key] if d['merchant_code'] == 'tim_hortons')
        totalSubwayCents = sum(d['amount_cents'] for d in  groupedTransactions[key] if d['merchant_code'] == 'subway')
        totalOtherMerchantsCents = sum(d['amount_cents'] for d in  groupedTransactions[key] if d['merchant_code'] != 'subway' and d['merchant_code'] != 'tim_hortons' and d['merchant_code'] != 'sportcheck')
        totalsByMonth[i[0]['date']]['totalTims'] = calculateDollarAmount(totalTimHortonCents)
        totalsByMonth[i[0]['date']]['totalSubway'] = calculateDollarAmount(totalSubwayCents) 
        totalsByMonth[i[0]['date']]['totalSport'] = calculateDollarAmount(totalSportCheckCents) 
        totalsByMonth[i[0]['date']]['totalOther'] = calculateDollarAmount(totalOtherMerchantsCents) 
    return totalsByMonth

#returns the total dollars left per special merchant
def getBalance(totalsByMonth,date):
    tSP = totalsByMonth[date]['totalSport']
    tSB = totalsByMonth[date]['totalSubway']
    tTH = totalsByMonth[date]['totalTims']
    return tSP, tSB, tTH


def rule1(totalsByMonth, date):
    tSP, tSB, tTH = getBalance(totalsByMonth,date) #retrieve current balance left per special merchant
    r1Sport, r1Sub, r1TH = math.trunc(tSP / 75),math.trunc(tSB / 25),math.trunc(tTH / 25) #calculates number of times rule 1 can be called per special merchant
    r1Times = min(r1Sport,r1Sub,r1TH) #finds lowest number of times rule 1 can be used amongst all merchants
    r1points = r1Times * 500 #calculated points earned from rule 1
    totalsByMonth[date]['totalSport'] = tSP -  r1Times * 75 #updates dictionary to new merchant balances
    totalsByMonth[date]['totalTims'] = tTH -  r1Times * 25
    totalsByMonth[date]['totalSubway'] = tSB -  r1Times * 25
    totalsByMonth[date]['Times rule 1 applied'] = r1Times #adds to dictionary number of times rule 1 called
    return r1points #returns points from rule 1

#rule2
def rule2(totalsByMonth, date):
    tSP, tSB, tTH = getBalance(totalsByMonth,date) #retrieve current balance left per special merchant
    r2Sport, r2TH = math.trunc(tSP / 75),math.trunc(tTH / 25)
    r2Times = min(r2Sport, r2TH)
    r2points = r2Times * 300
    totalsByMonth[date]['totalSport'] = tSP -  r2Times * 75
    totalsByMonth[date]['totalTims'] = tTH - r2Times * 25
    totalsByMonth[date]['Times rule 2 applied'] = r2Times
    return r2points

#rule4 
def rule4(totalsByMonth, date):
    tSP, tSB, tTH = getBalance(totalsByMonth,date) #retrieve current balance left per special merchant
    r4Sport, r4Sub, r4TH = math.trunc(tSP / 25),math.trunc(tSB / 10),math.trunc(tTH / 10)
    r4Times = min(r4Sport,r4Sub,r4TH)
    r4points = r4Times * 150
    totalsByMonth[date]['totalSport'] = tSP -  r4Times * 25
    totalsByMonth[date]['totalSubway'] = tSB - r4Times * 10
    totalsByMonth[date]['totalTims'] = tTH - r4Times * 10
    totalsByMonth[date]['Times rule 4 applied'] = r4Times
    return r4points

#rule6 
def rule6(totalsByMonth,date):
    tSP, tSB, tTH = getBalance(totalsByMonth,date) #retrieve current balance left per special merchant
    r6SportTimes = math.trunc(tSP / 20)
    r6points = r6SportTimes * 75
    totalsByMonth[date]['totalSport'] = tSP -  r6SportTimes * 20
    totalsByMonth[date]['Times rule 6 applied'] = r6SportTimes
    return r6points

#rule7
def rule7(totalsByMonth, date):
    tSP, tSB, tTH = getBalance(totalsByMonth,date) #retrieve current balance left per special merchant
    tOT = totalsByMonth[date]['totalOther']
    sumAll = math.trunc(tSP + tSB + tTH + tOT)
    totalsByMonth[date]['Times rule 7 applied'] = sumAll
    r7points = sumAll * 1
    return r7points

#Calculate Total 
#sorted by rule importance Rule1, Rule4, Rule2, Rule6,  Rule7
def calculatePoints(transactions):
    totalsByMonth = calcTotals(transactions) #gets totals by month from transactions
    pointsByMonth = defaultdict(dict) #declairs new dict to be returned
    for date in totalsByMonth: #loops over dictionary by date, calculates totalpoints per month and adds it to new dictionary
        totalPoints = rule1(totalsByMonth,date) + rule4(totalsByMonth,date) +rule2(totalsByMonth,date) + rule6(totalsByMonth, date) + rule7(totalsByMonth,date)
        pointsByMonth[date]['totalPoints'] = totalPoints
        pointsByMonth[date]['Times rule 1 applied'] = totalsByMonth[date]['Times rule 1 applied']
        pointsByMonth[date]['Times rule 2 applied'] = totalsByMonth[date]['Times rule 2 applied']
        pointsByMonth[date]['Times rule 4 applied'] = totalsByMonth[date]['Times rule 4 applied']
        pointsByMonth[date]['Times rule 6 applied'] = totalsByMonth[date]['Times rule 6 applied']
        pointsByMonth[date]['Times rule 7 applied'] = totalsByMonth[date]['Times rule 7 applied']
    return pointsByMonth

#API route for switching transactions
@app.route("/add", methods=["POST"], strict_slashes=False)
def addTransactions():
    print('hi')
    body = request.json['data'].replace("'","\"")
    parsedBody = json.loads(body)
    print(parsedBody)
    global currentTransactions 
    currentTransactions = calculatePoints(parsedBody)
    return body

#API route for retreiving currentTransactions data
@app.route("/members")
def members():
    return currentTransactions

#main
def main():
    global currentTransactions 
    currentTransactions = calculatePoints(transactions) #initiates the program with the first transactions input

if __name__ == "__main__":
    main()
    app.run(debug=True)
