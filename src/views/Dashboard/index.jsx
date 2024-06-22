import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductsFromDb } from '../../config/firebase';
import Loader from '../Loader';
import './style.css';

function Dashboard() {

  const [products, setProducts] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    getProductsFromDb(setProducts);
  }, []);
  
  return (
    <div className='buyer-dashboard-main-container'>
    {!products ?
        <Loader />
      : 
      products.map((element, index) => {
        return (
          <div key={index} className='product-card'>
            <img src={element.thumbnail} alt="Product-image" />
            <h2>{element.title}</h2>
            <h3>${element.price}</h3>
            <span>{element.description.substring(0, 71)}{element.description.length >= 72 && "..."}</span>
            <button onClick={() => navigate(`/detail/${element.id}`)}>Place a bid</button>
          </div>
        )
      })
      }
    </div>
  )
};

export default Dashboard;