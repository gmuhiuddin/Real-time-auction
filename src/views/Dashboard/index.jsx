import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getProductsFromDb } from '../../config/firebase';
import './style.css';

function Dashboard() {

  const [products, setProducts] = useState([]);
  const authInfo = useSelector(res => res.userInfo.auth);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    await getProductsFromDb(setProducts);
  };

  return (
    <div className='dashboard-main-container'>
      Dashboard
      {products.map(element => {
        return (
          <p>{element.title}</p>
        )
      })}
    </div>
  )
};

export default Dashboard;