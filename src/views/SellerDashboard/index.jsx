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
      <button onClick={() => navigate('/add')} className='product-add-btn'>New</button>
    {!products.length ?
        <h1 style={{fontSize: "2.5em", fontWeight: "600", color: "white"}}>No product</h1>
      : 
      <div className='cart-main-container'>
        {products.map((element, index) => {
        return (
          <div key={index} className='user-product-card'>
            <div className="img-container">
            <span className={`activate-or-not-txt ${element.activated ? "active-txt" : 
              "deactive-txt"
            }`}>{element.startingTime >= new Date().getTime() ? "Pending" : element.activated ? "Activated" : "Deactivated"}</span>
            <img src={element.thumbnail} />
            </div>
            <h2>{element.title}</h2>
            <h3>${element.price}</h3>
            <span>{element.description.substring(0, 71)}{element.description.length >= 70 && "..."}</span>
              <button onClick={(e) => element.startingTime >= new Date().getTime() ? alert("Product status was pending") : navigate(`/edit/${element.id}`)}>{element.startingTime >= new Date().getTime() ? "Pending" : element.activated ? "Edit" : "Re active"}</button>
          </div>
        )
      })}
      </div>
      }
    </div>
  );
};

export default SellerDashboard;