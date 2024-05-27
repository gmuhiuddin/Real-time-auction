import React, { useRef, useState } from 'react';
import { BsArrowLeft } from 'react-icons/bs';
import CustomAlert from '../../components/CutomAlert';
import { sendResetEmail } from '../../config/firebase.jsx';
import './style.css';
import { useNavigate } from 'react-router-dom';

function PassResetPage() {

    const [errMsg, setErrMsg ] = useState();
    const [successMsg, setSuccessMsg ] = useState();
    const btnRef = useRef(null);
    const navigate = useNavigate();

    const handlePassReset = async (e) => {
        e.preventDefault();
        btnRef.current.disabled = true;
        setErrMsg();

        try {
            await sendResetEmail(e.target[0].value);

            setSuccessMsg("Send password reset email successfully");

        btnRef.current.disabled = false;

        setTimeout(() => {
            navigate('/login');
        }, 1500)

        } catch (err) {
            setErrMsg(err.message);
        btnRef.current.disabled = false;
        }
    };

    return (
        <div className='pass-reset-page-main-container'>
            <span onClick={() => navigate('/login')}><BsArrowLeft size={29} /></span>
            <div className="pass-container">
                <form onSubmit={handlePassReset}>
                    <h1>Password reset page</h1>
                    <br />
                    <input placeholder='Email' required type='email' />
                    <br />
                    <button ref={btnRef} type='submit'>Send reset email</button>
                </form>
            </div>
            {errMsg && <CustomAlert txt={errMsg} isErrMsg={true} />}
            {successMsg && <CustomAlert txt={successMsg} isErrMsg={false} />}
        </div>
    )
}

export default PassResetPage;