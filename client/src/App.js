/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/button-has-type */
/* eslint-disable react/jsx-filename-extension */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './index.css';

function App() {
  // Constants and States
  const displayExample1 = {
    T01: { date: '2021-05-01', merchant_code: 'sportcheck', amount_cents: 21000 },
    T02: { date: '2021-05-01', merchant_code: 'sportcheck', amount_cents: 8700 },
    T03: { date: '2021-05-03', merchant_code: 'tim_hortons', amount_cents: 323 },
    T04: { date: '2021-05-04', merchant_code: 'tim_hortons', amount_cents: 1267 },
    T05: { date: '2021-05-05', merchant_code: 'tim_hortons', amount_cents: 2116 },
    T06: { date: '2021-05-06', merchant_code: 'tim_hortons', amount_cents: 2211 },
    T07: { date: '2021-05-07', merchant_code: 'subway', amount_cents: 1853 },
    T08: { date: '2021-05-08', merchant_code: 'subway', amount_cents: 2153 },
    T09: { date: '2021-05-09', merchant_code: 'sportcheck', amount_cents: 7326 },
    T11: { date: '2021-06-10', merchant_code: 'tim_hortons', amount_cents: 1321 },
    T12: { date: '2021-06-11', merchant_code: 'tim_hortons', amount_cents: 1321 },
    T13: { date: '2021-07-11', merchant_code: 'tim_hortons', amount_cents: 1321 },
  };

  const displayExample2 = {
    T01: { date: '2022-05-01', merchant_code: 'sportcheck', amount_cents: 21000 },
    T02: { date: '2022-05-02', merchant_code: 'sportcheck', amount_cents: 8700 },
    T03: { date: '2021-06-03', merchant_code: 'tim_hortons', amount_cents: 323 },
  };

  const displayExample3 = {
    T01: { date: '2021-05-01', merchant_code: 'sportcheck', amount_cents: 21000 },
    T02: { date: '2021-05-02', merchant_code: 'sportcheck', amount_cents: 8700 },
    T03: { date: '2021-05-03', merchant_code: 'tim_hortons', amount_cents: 3000 },
    T04: { date: '2021-05-03', merchant_code: 'home_depot', amount_cents: 3000 },
  };

  const displayDataText = JSON.stringify(displayExample1, null);
  const displayDataText2 = JSON.stringify(displayExample2, null);
  const displayDataText3 = JSON.stringify(displayExample3, null);
  const [data, setData] = useState([{}]);
  const [isLoading, setIsLoading] = useState(true); // Determines if the API is loading
  const [body, setBody] = useState('');

  const fetchData = async () => { // Fetches Data from backend
    const data = await fetch('/members').then(
      (res) => res.json(), // converts response to json
    ).then(
      (data) => {
        setData(data); // sets data to state
        console.log(data);
      },
    );
    setIsLoading(false);
  };

  // api call to insert the transaction
  const insertTransaction = async (query) => {
    const myParams = {
      data: query,
    };

    if (query !== '') {
      await axios.post('http://localhost:5000/add', myParams)
        .then((response) => {
          console.log(response);
          // Perform action based on response
        });
    } else {
      // eslint-disable-next-line no-alert
      alert('The Transaction Input Cannot Be Empty');
    }
  };

  useEffect(() => { // On page load set data
    fetchData();
  }, [data]);

  const postTransaction = () => { // Inserts transaction using the APIService
    insertTransaction(body);
  };

  // Handles Submission of Form by inserting transactions, setting body to '' and fetching data
  const handleSubmit = (event) => {
    event.preventDefault();
    postTransaction();
    setBody('');
    fetchData();
  };

  return (
    <div className="m-w-screen h-screen justify-center items-center bg-slate-300 shadow-md">
      <div className="font-bold text-5xl flex-col justify-center items-center pt-10">
        <p className="font-bold text-5xl justify-center items-center flex">Reward Points Calculator</p>
        <p className="font-bold text-3xl justify-center items-center flex">Created By David Espsoto</p>
      </div>
      <div className="flex justify-center items-center flex-row space-x-4 pt-36">
        {isLoading ? (
          <p className="font-bold">Loading...</p>
        ) : (
          Object.entries(data).map(([key, value]) => (
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <p className="font-bold">
                Month:
                {' '}
                {key}
              </p>
              {Object.entries(value).map(([k, i]) => (
                <div className="flex" key={k}>
                  <p className="">
                    {k}
                    :
                    {'  '}
                  </p>
                  <p className="font-bold">
                    {'  '}
                    {i}
                  </p>
                </div>
              ))}
            </div>
          ))
        )}
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <label htmlFor="body" className="block text-gray-700 text-sm font-bold mb-2" />
          <textarea
            className="form-control"
            placeholder="Enter Transactions in JSON format"
            rows="6"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </form>
        <div>
          <p className="font-bold text-center pb-3">Example Input</p>
          <p className="flex max-w-lg text-xs">
            {displayDataText}
          </p>
          <p className="font-bold text-center py-3">Example Input 2</p>
          <p className="flex max-w-lg text-xs">
            {displayDataText2}
          </p>
          <p className="font-bold text-center py-3">Example Input 3</p>
          <p className="flex max-w-lg text-xs">
            {displayDataText3}
          </p>
        </div>
      </div>
    </div>

  );
}

export default App;
