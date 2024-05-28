import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getProductsFromDb } from '../../config/firebase';
import Loader from '../Loader';
import './style.css';

function Dashboard() {

  const [products, setProducts] = useState();
  const authInfo = useSelector(res => res.userInfo.auth);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    await getProductsFromDb(setProducts);
  };

  return (
    <div className='dashboard-main-container'>
    {!products ?
        <Loader />
      : 
      products.map(element => {
        return (
          <div className='product-card'>
            <img src="https://media.licdn.com/dms/image/D4D03AQF7_cbK0JjaPA/profile-displayphoto-shrink_800_800/0/1707840065200?e=2147483647&v=beta&t=jrdRdeKilxOBVcRHCldEN6j1v1sOYO64M19UYWGSJ9I" alt="Product-image" />
            <h2>{element.title}</h2>
            <h3>{element.price}</h3>
          </div>
        )
      })
      }
    </div>
  )
};

export default Dashboard;