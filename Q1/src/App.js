import React, { useState, useEffect } from 'react';
import './App.css';

const mergeAndSortIntegers = (responses) => {
  const mergedSet = new Set();
  responses.forEach((response) => {
    const integers = response.match(/\d+/g);
    if (integers) {
      integers.forEach((integer) => mergedSet.add(parseInt(integer)));
    }
  });
  return Array.from(mergedSet).sort((a, b) => a - b);
};

const App = () => {
  const [selectedTypes, setSelectedTypes] = useState({
    primes: true,
    fibo: true,
    odd: true,
    random: true,
  });

  const [upperLimit, setUpperLimit] = useState('');
  const [mergedIntegers, setMergedIntegers] = useState([]);

  useEffect(() => {
    const fetchIntegers = async () => {
      const urls = [];
      if (selectedTypes.primes) {
        urls.push('http://20.244.56.144/numbers/primes');
      }
      if (selectedTypes.fibo) {
        urls.push('http://20.244.56.144/numbers/fibo');
      }
      if (selectedTypes.odd) {
        urls.push('http://20.244.56.144/numbers/odd');
      }
      if (selectedTypes.random) {
        urls.push('http://20.244.56.144/numbers/rand');
      }

      const promises = urls.map(async (url) => {
        try {
          const response = await fetch(url, { timeout: 500 });
          const data = await response.text();
          return data;
        } catch (error) {
          console.error(`Error fetching from ${url}: ${error}`);
          return '';
        }
      });

      const responses = await Promise.all(promises);
      const mergedSortedIntegers = mergeAndSortIntegers(responses).filter(
        (integer) => integer <= parseInt(upperLimit)
      );
      setMergedIntegers(mergedSortedIntegers);
    };

    fetchIntegers();
  }, [selectedTypes, upperLimit]);

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSelectedTypes((prevSelectedTypes) => ({
      ...prevSelectedTypes,
      [name]: checked,
    }));
  };

  const handleUpperLimitChange = (event) => {
    setUpperLimit(event.target.value);
  };

  return (
    <div>
      <div className='main'><h1>Develop Number Management HTTP Microservice</h1></div>
      <div>
        <label className='prime'>
          <input 
            type="checkbox"
            name="primes"
            checked={selectedTypes.primes}
            onChange={handleCheckboxChange}
          />
          Primes
        </label>
        <label className='fibo'>
          <input
            type="checkbox"
            name="fibo"
            checked={selectedTypes.fibo}
            onChange={handleCheckboxChange}
          />
          Fibonacci
        </label>
        <label className='odd'>
          <input
            type="checkbox"
            name="odd"
            checked={selectedTypes.odd}
            onChange={handleCheckboxChange}
          />
          Odd Numbers
        </label>
        <label className='random'>
          <input
            type="checkbox"
            name="random"
            checked={selectedTypes.radom}
            onChange={handleCheckboxChange}
          />
          random numbers
        </label>
      </div>
      <div>
        <label className='enter'>
          <h4>Enter Number:</h4>
          <input className='input'
            type="number"
            value={upperLimit}
            onChange={handleUpperLimitChange}
          />
        </label>
      </div>
      <ul className='bartan'>
        {mergedIntegers.map((integer) => (
          <li className='ans' key={integer}>{integer}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
