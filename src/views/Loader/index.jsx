import React from 'react';
import { Spinner } from "flowbite-react";
import './style.css';

function Loader() {
  return (
    <div className='loader-main-container'>
       <div className="spinner"></div>
    </div>
  )
}

export default Loader;