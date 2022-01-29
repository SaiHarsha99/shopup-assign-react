import React, { useState, useEffect, useRef } from 'react';
import { render } from 'react-dom';
import './style.css';

const App = () => {
  const nameRef = useRef();
  const emailRef = useRef();
  const passRef = useRef();
  const [searchValue, setSearchval] = useState('');
  const [results, setResults] = useState([]);
  const [formValue, setformValue] = useState('');

  const handleSubmit = (e) => {
    let formValue = {
      Name: nameRef.current.value,
      Email: emailRef.current.value,
      Password: passRef.current.value,
    };
    console.log(formValue);
    setformValue(JSON.stringify(formValue))
  };

  const handleReset = () => {
    nameRef.current.value = '';
    emailRef.current.value = '';
    passRef.current.value = '';
  };

  // Debounce polyfill
  const debounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(
      () => {
        const handler = setTimeout(() => {
          setDebouncedValue(value);
        }, delay);
        return () => {
          clearTimeout(handler);
        };
      },
      [value, delay]
    );
    return debouncedValue;
  };

  const debouncedSearchValue = debounce(searchValue, 1000);

  // To call api when our search val changes
  useEffect(
    () => {
      if (debouncedSearchValue) {
        searchCharacters(debouncedSearchValue).then((results) => {
          setResults(results);
        });
      } else {
        setResults([]);
      }
    },
    [debouncedSearchValue]
  );

  // API search function
  function searchCharacters(search) {
    const apiKey = 'Yw3YCPqn2gUw0DSpO0SyDNhQaHjx9qtk';
    return fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${search}`,
      {
        method: 'GET',
      }
    ).then((r) => r.json())
      .then((r) => r.data)
      .catch((error) => {
        console.error(error);
        return [];
      });
  }

  return (
    <React.Fragment>
      <div>
        <p>part 1</p>
        <label>
          Name:
          <input
            placeholder="name"
            ref={nameRef}
            onChange={(e) => (nameRef.current.value = e.target.value)}
            type="text"
          />
        </label>
        <label>
          Email:
          <input
            placeholder="email"
            ref={emailRef}
            onChange={(e) => (emailRef.current.value = e.target.value)}
            type="text"
          />
        </label>

        <label>
          Password:
          <input
            placeholder="password"
            ref={passRef}
            onChange={(e) => (passRef.current.value = e.target.value)}
            type="password"
          />
        </label>
        <hr />
        <button onClick={(e) => nameRef.current.focus()}>
          Focus Name Input
        </button>
        <button onClick={(e) => emailRef.current.focus()}>
          Focus Email Input
        </button>
        <button onClick={(e) => passRef.current.focus()}>
          Focus Password Input
        </button>
        <hr />
        <button onClick={handleSubmit}>Submit</button>
        <button onClick={handleReset}>Reset</button>
      </div>
      {formValue}
      <div>
        <hr />
        <p>part 2</p>
        <label>
          Search:
          <input
            placeholder="search with debounce"
            type="text"
            onChange={(e) => setSearchval(e.target.value)}
          />
        </label>
        {results.map((result) => (
          <div className="col-lg-4" key={result.id}>
            <p>{result.title}</p>
            <img src={`${result.images['fixed_height'].url}`} />
          </div>
        ))}
      </div>
    </React.Fragment>
  );
};

render(<App />, document.getElementById('root'));
