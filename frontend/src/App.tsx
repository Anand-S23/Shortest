import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  
  const test = async () => {
    const response = await fetch("http://localhost:5000/")
      .catch((err) => console.log(err));
    
    const msg = await response?.json();
    console.log(msg);
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>

        <button onClick={() => test()}>Click Me</button>
      </header>
    </div>
  );
}

export default App;
