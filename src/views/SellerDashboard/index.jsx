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
  
  return (
    <div className='dashboard-main-container'>
    {!products ?
        <Loader />
      : 
      products.map(element => {
        return (
          <div className='user-product-card'>
            <div className="img-container">
            <span className={`activate-or-not-txt ${element.activated ? "active-txt" : 
              "deactive-txt"
            }`}>{element.activated ? "Activated" : "Deactivated"}</span>
            <img src="https://media.licdn.com/dms/image/D4D03AQF7_cbK0JjaPA/profile-displayphoto-shrink_800_800/0/1707840065200?e=2147483647&v=beta&t=jrdRdeKilxOBVcRHCldEN6j1v1sOYO64M19UYWGSJ9I" alt="Product-image" />
            </div>
            <h2>{element.title}</h2>
            <h3>${element.price}</h3>
            <span>{element.description.substring(0, 73)}{element.description.length >= 73 && "..."}</span>
              <button onClick={() => navigate(`/edit/${element.id}`)}>{element.activated ? "Edit product" : "Re active"}</button>
          </div>
        )
      })
      }
    </div>
  );
};

export default SellerDashboard;