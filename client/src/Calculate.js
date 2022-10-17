/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
import React from 'react';

transactions = {
  T01: { date: '2021-05-01', merchant_code: 'sportcheck', amount_cents: 21000 },
  T02: { date: '2021-05-01', merchant_code: 'sportcheck', amount_cents: 8700 },
  T03: { date: '2021-05-03', merchant_code: 'tim_hortons', amount_cents: 323 },
  T04: { date: '2021-05-04', merchant_code: 'tim_hortons', amount_cents: 1267 },
  T05: { date: '2021-05-05', merchant_code: 'tim_hortons', amount_cents: 2116 },
  T06: { date: '2021-05-06', merchant_code: 'tim_hortons', amount_cents: 2211 },
  T07: { date: '2021-05-07', merchant_code: 'subway', amount_cents: 1853 },
  T08: { date: '2021-05-08', merchant_code: 'subway', amount_cents: 2153 },
  T09: { date: '2021-05-09', merchant_code: 'sportcheck', amount_cents: 7326 },
  T11: { date: '2022-06-10', merchant_code: 'tim_hortons', amount_cents: 1321 },
  T12: { date: '2022-06-11', merchant_code: 'tim_hortons', amount_cents: 1321 },
  T13: { date: '2023-06-11', merchant_code: 'tim_hortons', amount_cents: 1321 },
};


function formatTransactions(transactions)
{
    sortedTransactions = []
    groupedTransactions = []

    for(var key in transactions)
    {
        value = transactions[key]
        value['date'] = value['date'].slice(0,-3)
        sortedTransactions.push(value)
        sortedTransactions.sort(function(val){return val['date']})

    }
}

function Calculate() {
  groupedTransactions = 0;
  totalsByMonth = {};

  count = 0;

  groupedTransactions.forEach((element) => {
    totalSportsCheckCents = 0;

    groupedTransactions[element].forEach((d) => {
      if (d["merchant_code"] == 'sportcheck') {
        totalSportsCheckCents += d["amount_cents"];
      }
    });
  });
}

export default Calculate;
