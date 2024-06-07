import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BsArrowLeft } from 'react-icons/bs';
import { addMultiImagesInDatabase, addImageInDatabase, addProduct } from '../../config/firebase.jsx';
import CustomAlert from '../../components/CutomAlert';
import './style.css';

function AddProduct() {

  const [imageLink, setImageLink] = useState();
  const [imagesLinks, setImagesLinks] = useState([]);
  const [minTime, setMinTime] = useState('');
  const [successTxt, setSuccessTxt] = useState();
  const [errTxt, setErrTxt] = useState();
  const authInfo = useSelector(res => res.userInfo.auth);
  const sbtBtn = useRef(null);
  const navigate = useNavigate();

  const getMinTime = () => {
    const now = new Date();

      let hours = now.getHours();
      let minutes = now.getMinutes();

      hours = hours < 10 ? '0' + hours : hours;
      minutes = minutes < 10 ? '0' + minutes : minutes;

      const currentTime = `${hours}:${minutes}`;
      setMinTime(currentTime);
  };

  useEffect(() => {
    getMinTime();

    const interval = setInterval(() => {
      getMinTime();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setErrTxt();
    setSuccessTxt();
    sbtBtn.current.disabled = true;

    if (!e.target[4].files[0] || !e.target[5].files[0] || !e.target[6].files[0] || !e.target[7].files[0] || !e.target[8].files[0]) {
      setErrTxt('Please enter thumbnail and multiple images');
      sbtBtn.current.disabled = false;
    } else {

      const startingTime = new Date();
      startingTime.setHours(e.target[3].value.slice(0, 2));
      startingTime.setMinutes(e.target[3].value.slice(3));
      startingTime.setSeconds(0);
      const expiryTime = new Date(startingTime);
      expiryTime.setMinutes(startingTime.getMinutes() + 10);

      const addInfo = {
        title: e.target[0].value,
        description: e.target[1].value,
        price: e.target[2].value,
        startingTime: startingTime.getTime(),
        expiryTime: expiryTime.getTime(),
        thumbnail: imageLink,
        images: imagesLinks,
        uid: authInfo.uid,
        activated: false
      };

      try {
        await addProduct(addInfo);
        e.target[0].value = '';
        e.target[1].value = '';
        e.target[2].value = '';
        setImageLink('');
        setSuccessTxt("Product add successfully");
        navigate('/seller-dashboard');

      } catch (e) {
        setErrTxt(e.message)
        sbtBtn.current.disabled = false;
      };
    };
  };

  return (
    <div className='sell-main-container'>
      <span onClick={() => navigate('/login')}><BsArrowLeft size={29} /></span>
      <div className="sell-container">
        <br />
        <div className='sell-form-container'>
          <form onSubmit={handleAddProduct}>
            <div className='main-container'>
              <div className='inputs-container'>

                {/* <label for="category-option">Category<span className='important-txt'>*</span>:</label>

<select required id='category-option'>
  <option>Select category</option>
  <option>Mobiles</option>
  <option>Vehicles</option>
  <option>Property For Sale</option>
  <option>Property For Rent</option>
  <option>Electronics & Home Appliances</option>
  <option>Bikes</option>
  <option>Business Indestrial & Agriculture</option>
  <option>Services</option>
  <option>Jobs</option>
  <option>Animals</option>
  <option>Furniture & Home Decor</option>
  <option>Fashion & Beauty</option>
  <option>Books, Sports & Hobbies</option>
  <option>Kids</option>
</select> */}

                <label htmlFor="titel-txt">Title<span className='important-txt'>*</span>:</label>
                <input required id='titel-txt' placeholder='Title' type='text' />

                <label htmlFor="description-txt">Description<span className='important-txt'>*</span>:</label>
                <textarea maxLength={199} required id='description-txt' type='text' />

                <label htmlFor="price-txt">Starting price<span className='important-txt'>*</span>:</label>
                <input required id='price' placeholder='Starting price' type='number' />

                <label htmlFor="product-launch-time'">Product launching time<span className='important-txt'>*</span>:</label>
                <input required id='product-launch-time' placeholder='Product launching time' type='time' min={minTime} />
              </div>

              <div className='title-image-container image-container'>
                <img src={imageLink} alt='Thumbnail image' />
                <br />
                <br />
                <label htmlFor="thumbnail-image" style={{ textAlign: 'left' }}>Add thumbnail image<span className='important-txt'>*</span>:</label>
                <label className='thumbnail-image-label' for="thumbnail-image">Click here</label>
                <input onChange={async (e) => {
                  const imageUrl = await addImageInDatabase(e.target.files[0]);

                  setImageLink(imageUrl);
                }} id='thumbnail-image' type='file' />
              </div>
            </div>

            <h1 style={{ textAlign: 'center', fontSize: "2.3em", fontWeight: "600" }}>Add Multiple Images</h1>

            <br />

            <div className='add-multiple-images-conatiner'>

              <div className='image-container'>
                <img src={imagesLinks[0]} alt='First image' />
                <br />
                <br />
                <label htmlFor="first-image" style={{ textAlign: 'left' }}>Add first image<span className='important-txt'>*</span>:</label>
                <label className='first-image-label' for="first-image">Click here</label>
                <input
                  onChange={async (e) => {
                    const imageUrl = await addMultiImagesInDatabase(e.target.files[0], 'first');

                    const imagess = [...imagesLinks];
                    imagess[0] = imageUrl;
                    setImagesLinks(imagess);
                  }}
                  id='first-image' type='file' />
              </div>

              <div className='image-container'>
                <img src={imagesLinks[1]} alt='Second image' />
                <br />
                <br />
                <label htmlFor="second-image" style={{ textAlign: 'left' }}>Add second image<span className='important-txt'>*</span>:</label>
                <label className='second-image-label' for="second-image">Click here</label>
                <input
                  onChange={async (e) => {
                    const imageUrl = await addMultiImagesInDatabase(e.target.files[0], 'second');

                    const imagess = [...imagesLinks];

                    imagess[1] = imageUrl;

                    setImagesLinks(imagess);
                  }}
                  id='second-image' type='file' />
              </div>

              <div className='image-container'>
                <img src={imagesLinks[2]} alt='Third image' />
                <br />
                <br />
                <label htmlFor="third-image" style={{ textAlign: 'left' }}>Add third image<span className='important-txt'>*</span>:</label>
                <label className='third-image-label' for="third-image">Click here</label>
                <input
                  onChange={async (e) => {
                    const imageUrl = await addMultiImagesInDatabase(e.target.files[0], 'third');

                    const imagess = [...imagesLinks];

                    imagess[2] = imageUrl;

                    setImagesLinks(imagess);
                  }}
                  id='third-image' type='file' />
              </div>

              <div className='image-container'>
                <img src={imagesLinks[3]} alt='Fourth image' />
                <br />
                <br />
                <label htmlFor="fourth-image" style={{ textAlign: 'left' }}>Add fourth image<span className='important-txt'>*</span>:</label>
                <label className='fourth-image-label' for="fourth-image">Click here</label>
                <input
                  onChange={async (e) => {
                    const imageUrl = await addMultiImagesInDatabase(e.target.files[0], 'fourth');

                    const imagess = [...imagesLinks];

                    imagess[3] = imageUrl;

                    setImagesLinks(imagess);
                  }}
                  id='fourth-image' type='file' />
              </div>

            </div>


            <br />
            <button ref={sbtBtn} type='submit' className='submit-btn'>Add a product</button>
          </form>

        </div>
        <br />
      </div>
      {successTxt && <CustomAlert txt={successTxt} isErrMsg={false} />}
      {errTxt && <CustomAlert txt={errTxt} isErrMsg={true} />}
    </div>
  );
};

export default AddProduct;