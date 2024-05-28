import React from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

const divStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundSize: 'cover',
    height: '400px',
    borderRadius: "7px"
};

const ImageSlider = ({ images }) => {
    return (
        <div className="slide-container">
            <Slide>
                {images.map((image, index) => (
                    <div key={index}>
                        <div style={{ ...divStyle, 'backgroundImage': `url(${image})` }}>
                        </div>
                    </div>
                ))}
            </Slide>
        </div>
    );
};

export default ImageSlider;