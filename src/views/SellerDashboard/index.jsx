import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUserProducts } from '../../config/firebase';
import Loader from '../Loader';
import { useNavigate } from 'react-router-dom';
import './style.css';

function SellerDashboard() {

  const [products, setProducts] = useState();
  const authInfo = useSelector(res => res.userInfo.auth);
  const navigate = useNavigate();
  
  useEffect(() => {
    getUserProducts(authInfo.uid, setProducts);
  }, []);

  if(!products) return <Loader />;
  
  return (
    <div className='dashboard-main-container'>
    {!products.length ?
        <h1 style={{fontSize: "2.5em", fontWeight: "600", color: "white"}}>No product</h1>
      : 
      products.map(element => {
        return (
          <div className='user-product-card'>
            <div className="img-container">
            <span className={`activate-or-not-txt ${element.activated ? "active-txt" : 
              "deactive-txt"
            }`}>{element.activated ? "Activated" : "Deactivated"}</span>
            <img src={element.thumbnail} />
            </div>
            <h2>{element.title}</h2>
            <h3>${element.price}</h3>
            <span>{element.description.substring(0, 71)}{element.description.length >= 71 && "..."}</span>
              <button onClick={() => navigate(`/edit/${element.id}`)}>{element.activated ? "Edit product" : "Re active"}</button>
          </div>
        )
      })
      }
    </div>
  );
};

export default SellerDashboard;