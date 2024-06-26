import React, { useState, useEffect } from "react";
import "./App.css";
import socket from "./utilities/socketConnection";
import Widget from "./Widget";

const App = () => {
  const [performanceData, setPerformanceData] = useState({});
  const [search, setSearch] = useState("");
  const [offline , setOffline] = useState(false)

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };


  useEffect(() => {
    socket.on("data", (data) => {
      // Update state immutably
      setPerformanceData((prevData) => ({
        ...prevData,
        [data.macA]: data,
      }));
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.off("data");
    };
  }, []);



  const widgets = Object.entries(performanceData).map(([key, value]) => {
    // console.log(key, value)
    if(value.osType.toLowerCase().includes(search.toLowerCase())){
      if (!offline || !value.isActive){
        return <Widget key={key} data={value} />;
      }
   }
  });

  return (
    <>
      {/* <input
        type="text"
        className="input-text"
        placeholder="Search by OS Type"
        onChange={handleSearch}
        value={search}
      />

      <input 
      className="input-checkbox"
      type="checkbox"
      value={offline}
      onChange={ (e) =>{
        setOffline(e.target.checked);
      }}
       /> */}


<div className="search-container">
  <input
    type="text"
    className="input-text"
    placeholder="Search by OS Type"
    onChange={handleSearch}
    value={search}
  />
  <div className="checkbox-container">
    <input 
      className="input-checkbox"
      type="checkbox"
      value={offline}
      onChange={(e) => {
        setOffline(e.target.checked);
      }}
    />
    <span className="offline-text">Only offline</span>
  </div>
</div>


      <div className="App">{widgets}</div>
    </>
  );
};

export default App;
