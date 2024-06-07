import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUpCommingBid } from '../../config/firebase';
import Loader from '../Loader';
import './style.css';

function UpCommingBidDashboard() {

  const [products, setProducts] = useState();
  const navigate = useNavigate();
  
  useEffect(() => {
    getUpCommingBid(setProducts);
  }, []);

  if(!products) return <Loader />;
  
  return (
    <div className='upcome-dashboard-main-container'>
    {!products.length ?
        <h1>No products</h1>
      : 
      products.map((element, index) => {
        return (
          <div key={index} className='product-card'>
            <img src={element.thumbnail} alt="Product-image" />
            <h2>{element.title}</h2>
            <h3>${element.price}</h3>
            <span>{element.description.substring(0, 71)}{element.description.length >= 70 && "..."}</span>
            <button onClick={() => navigate(`/upcomedetail/${element.id}`)}>Place a bid</button>
          </div>
        )
      })
      }
    </div>
  );
};

export default UpCommingBidDashboard;