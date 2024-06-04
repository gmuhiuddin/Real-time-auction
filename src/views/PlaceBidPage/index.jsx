import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';
import { getBids, getProductFromDb, placeABid } from '../../config/firebase';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import Loader from "../Loader";
import ImageSlider from '../../components/ImageSlider';
import CutomAlert from '../../components/CutomAlert';
import './style.css';

function PlaceBidPage() {

    const { productid: productId } = useParams();
    const [product, setProduct] = useState();
    const [bids, setBids] = useState();
    const [errMsg, setErrMsg] = useState();
    const [successMsg, setSuccessMsg] = useState();
    const authInfo = useSelector(res => res.userInfo.auth);
    const navigate = useNavigate();
    
    useEffect(() => {
            getProductFromDb(productId, setProduct);
        getBids(productId, setBids);
    }, []);

    const handlePlaceBid = async (e) => {
        e.preventDefault();
        setSuccessMsg();
        setErrMsg();

        try {
            await placeABid(e.target[0].value, productId, authInfo?.uid, product.uid);

            setSuccessMsg("Bid placed successfully");
            e.target[0].value = "";
        } catch (err) {
            setErrMsg("Some thing went wrong");
            e.target[0].value = "";
        };
    };

    if(!product) return <Loader />;
    
    if(!Object.keys(product).length) return navigate('/404');

    return (
        <div className='detail-page-main-container'>
            <span onClick={() => navigate('/')} className='back-btn'><BsArrowLeft size={31} /></span>
                <>
                    <div className="product-detail-container">
                        <ImageSlider images={product.images} />
                        <h2>{product.title}</h2>
                        <h3>${product.price}</h3>
                        <span>{product.description}</span>
                    </div>
                    <div className="place-bid-container">
                        <form onSubmit={handlePlaceBid}>
                            <input type='number' placeholder='Please enter bid amount' required min={product.price} />
                            <button disabled={authInfo?.uid ? bids && authInfo?.uid == bids[0]?.uid : true} type='submit'>Bid</button>
                        </form>
                        <div>
                            {bids ?
                                <table>
                                    <tr>
                                        <th>Name</th>
                                        <th>Price</th>
                                        <th>Time</th>
                                        <th>date</th>
                                    </tr>
                                    {bids.map(element => {
                                        return (

                                            <tr>
                                                <td>{element.username}</td>
                                                <td>${element.bidAmount}</td>
                                                <td>
                                                    {dayjs(element.time?.toDate()).format(
                                                        "hh:mm"
                                                    )}
                                                </td>
                                                <td>
                                                    {dayjs(element.time?.toDate()).format(
                                                        "DD-MM"
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </table>
                                :
                                <p>no bids yet</p>
                            }
                        </div>
                    </div>
                </>
            {errMsg && <CutomAlert isErrMsg={true} txt={errMsg} />}
            {successMsg && <CutomAlert isErrMsg={false} txt={successMsg} />}
        </div>
    );
};

export default PlaceBidPage;