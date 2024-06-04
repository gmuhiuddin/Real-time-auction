import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { getProductForEditFromDb, updateProduct, reactiveProduct, addMultiImagesInDatabase, addImageInDatabase, } from '../../config/firebase';
import './style.css';

function EditProduct() {
  const { productid: productId } = useParams();
  const [product, setProduct] = useState();
  const [title, setTitle] = useState();
  const [price, setPrice] = useState();
  const [description, setDescription] = useState();
  const [imageLink, setImageLink] = useState();
  const [imagesLinks, setImagesLinks] = useState([]);
  const authInfo = useSelector(res => res.userInfo.auth);
  const sbtBtn = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setImageLink(product?.thumbnail);
    setTitle(product?.title);
    setPrice(product?.price);
    setDescription(product?.description);
    setImagesLinks(product?.images || []);
  }, [product]);

  useEffect(() => {
    getProductForEditFromDb(authInfo.uid, productId, setProduct)
  }, []);

  const handleEditProduct = async (e) => {
    e.preventDefault();
    sbtBtn.current.disabled = true;

    if (imagesLinks.length != 4 || !imageLink || !price || !title || !description) {
      alert('Please enter thumbnail and multiple images');
      sbtBtn.current.disabled = false;
    } else {

      const date = new Date();

      const addInfo = {
        ...product,
        title: e.target[0].value,
        description: e.target[1].value,
        price: e.target[2].value,
        thumbnail: imageLink,
        images: imagesLinks,
        productUpdateTime: date.getTime(),
        uid: authInfo.uid,
        activated: true
      };

      try {
        await updateProduct(addInfo, productId);
        e.target[0].value = '';
        e.target[1].value = '';
        e.target[2].value = '';
        setImageLink('');
        navigate('/seller-dashboard');

      } catch (e) {
        console.log(e.message)
        sbtBtn.current.disabled = false;
      };
    };
  };

  const handleReactiveProduct = async (e) => {
    e.preventDefault();
    sbtBtn.current.disabled = true;

    if (imagesLinks.length != 4 || !imageLink || !price || !title || !description) {
      alert('Please enter thumbnail and multiple images');
      sbtBtn.current.disabled = false;
    } else {

      const date = new Date();

      const addInfo = {
        ...product,
        title: e.target[0].value,
        description: e.target[1].value,
        price: e.target[2].value,
        thumbnail: imageLink,
        images: imagesLinks,
        date: date.getTime(),
        uid: authInfo.uid,
      };

      try {
        await reactiveProduct(addInfo, productId);
        e.target[0].value = '';
        e.target[1].value = '';
        e.target[2].value = '';
        setImageLink('');
        navigate('/seller-dashboard');

      } catch (e) {
        console.log(e.message)
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
          <form onSubmit={product?.activated ? handleEditProduct : handleReactiveProduct}>
            <div className='main-container'>
              <div className='inputs-container'>

                <label for="titel-txt">Title<span className='important-txt'>*</span>:</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} required id='titel-txt' placeholder='Title' type='text' />

                <label for="description-txt">Description<span className='important-txt'>*</span>:</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={199} required id='description-txt' type='text' />

                <label for="price-txt">Starting price<span className='important-txt'>*</span>:</label>
                <input value={price} onChange={(e) => setPrice(e.target.value)} required id='price' placeholder='Starting price' type='number' />

              </div>

              <div className='title-image-container image-container'>
                <img src={imageLink} alt='Thumbnail image' />
                <br />
                <br />
                <label for="thumbnail-image" style={{ textAlign: 'left' }}>Add thumbnail image<span className='important-txt'>*</span>:</label>
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
                <label for="first-image" style={{ textAlign: 'left' }}>Add first image<span className='important-txt'>*</span>:</label>
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
                <label for="second-image" style={{ textAlign: 'left' }}>Add second image<span className='important-txt'>*</span>:</label>
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
                <label for="third-image" style={{ textAlign: 'left' }}>Add third image<span className='important-txt'>*</span>:</label>
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
                <label for="fourth-image" style={{ textAlign: 'left' }}>Add fourth image<span className='important-txt'>*</span>:</label>
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
            <button ref={sbtBtn} type='submit' className='submit-btn'>{product?.activated ? "Update product" : "Re activate product"}</button>
          </form>

        </div>
        <br />
      </div>
    </div>
  );
};

export default EditProduct;