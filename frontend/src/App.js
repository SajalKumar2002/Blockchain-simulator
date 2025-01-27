import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";

import arrowDown from './arrowDown.svg';

import axios from 'axios';

const API = "http://localhost:5000/blockchain";

const App = () => {
  const [blockchain, setBlockchain] = useState([]);
  const [data, setData] = useState("");
  const [tamperedBlock, setTamperedBlock] = useState(0);
  const [isChainTampered, setIsChainTampered] = useState(false);

  const fetchBlockchain = async () => {
    try {
      const response = await axios.get(API);
      if (response.data) {
        setBlockchain(response.data);
      }
    } catch (error) {
      console.log(error);
      alert("Error fetching blockchain");
    }
  }

  const addBlock = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API}/add`, {
        data: data
      });

      if (response.data) {
        setData("");
        await fetchBlockchain();
      }
    } catch (error) {
      console.log(error);
      alert("Request Failed");
    }
  }

  const validateChain = async () => {
    try {
      const response = await axios.get(`${API}/validate`);
      if (!response.data.validChain) {
        setIsChainTampered(true);
        setTamperedBlock(response.data.index);
      } else {
        setTamperedBlock("");
      }
    } catch (error) {
      console.log(error);
      alert("Request Failed");
    }
  }

  const tamperBlock = async (index) => {
    try {
      await axios.put(`${API}/tamper/${index}`);
      await fetchBlockchain();
    } catch (error) {
      console.log(error);
      alert("Request Failed");
    }
  }

  useEffect(() => {
    fetchBlockchain();
  }, []);

  useEffect(() => {
    validateChain();
    // console.log(tamperedBlock)
  }, [blockchain])

  return (
    <div className='container' style={{ fontFamily: "sans-serif" }}>
      <div className='container'>
        <div className='row text-center'>
          <h1 className='heading-1'>Blockchain Simulator</h1>
        </div>
      </div>
      <div className='container'>
        {blockchain.map((block) => (
          <div className='row justify-content-center' key={block.index}>
            <div className="card p-2 col-sm-12 col-md-9 col-lg-8 col-xl-6">
              <div className='card-title'>
                <span className='fs-4 mb-0'>{block.index == "0" ? "Genesis Block" : "Block #" + block.index}</span>
                <span className='text-lighter' style={{ fontSize: '12px' }}> on {block.timestamp}</span>
              </div>
              <div className='card-body p-0'>
                <div className="input-group mb-3">
                  <span className="input-group-text">Data</span>
                  <input type="text" className="form-control" readOnly value={block.data} />
                </div>
                <div className='' style={{ fontSize: '12px' }}>
                  <p className={
                    `${isChainTampered ? (block.index < tamperedBlock + 1 ? "alert alert-success" : "alert alert-danger") : "alert alert-success"}`
                  }>Previous Hash: {block.previousHash}</p>
                  <p className={
                    `${isChainTampered ? (block.index < tamperedBlock ? "alert alert-success" : "alert alert-danger") : "alert alert-success"}`
                  }>Hash: {block.hash}</p>
                </div>
              </div>
              <div className='text-center'>
                <button type='button' className='btn' onClick={() => tamperBlock(block.index)}>{isChainTampered ? block.index < tamperedBlock ? "Tamper this block" : "Already Tampered" : "Tamper this block"}</button>
              </div>
            </div>
            {block.index === blockchain.length - 1 ? null :
              <img src={arrowDown} alt='arrowDown' height={30} />
            }
          </div>
        ))}
      </div>
      <div className='container my-3'>
        <div className='row justify-content-center'>
          <form className='form' style={{ width: "20rem" }} onSubmit={addBlock}>
            <div className='card'>
              <div className='card-body'>
                <div className="input-group mb-3">
                  <span className="input-group-text">Data</span>
                  <input type="text" className="form-control" value={data} onChange={(e) => setData(e.target.value)} />
                </div>
                <div className='text-center'>
                  <button type="submit" className="btn btn-primary bg-gradient" >Add Block</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default App;