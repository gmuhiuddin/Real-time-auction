import React, { useRef, useState } from 'react';
import { BsArrowLeft } from 'react-icons/bs';
import CustomAlert from '../../components/CutomAlert/index.jsx';
import { sendVerificationEmail } from '../../config/firebase.jsx';
import './style.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function VerifyUser() {

    const [errMsg, setErrMsg ] = useState();
    const [successMsg, setSuccessMsg ] = useState();
    const btnRef = useRef(null);
    const userInfo = useSelector(res => res.userInfo.auth);
    const navigate = useNavigate();

    const handlePassReset = async (e) => {
        e.preventDefault();
        btnRef.current.disabled = true;
        setErrMsg();

        try {
            await sendVerificationEmail();

            setSuccessMsg("Email sent successfully successfully");

        btnRef.current.disabled = false;

        } catch (err) {
            setErrMsg(err.message);
        btnRef.current.disabled = false;
        }
    };

    return (
        <div className='pass-reset-page-main-container'>
            <span onClick={() => navigate('/')}><BsArrowLeft size={29} /></span>
            <div className="pass-container">
                <form onSubmit={handlePassReset}>
                    <h1>Send verification email</h1>
                    <br />
                    <button ref={btnRef} type='submit'>Send verification email</button>
                </form>
            </div>
            {errMsg && <CustomAlert txt={errMsg} isErrMsg={true} />}
            {successMsg && <CustomAlert txt={successMsg} isErrMsg={false} />}
        </div>
    )
}

export default VerifyUser;