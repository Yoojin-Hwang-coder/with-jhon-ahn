import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch} from 'react-redux';
import {  registerUser } from '../../../action/user_action';
import { withRouter } from 'react-router-dom'; 

  

function RegisterPage(props) {
    const dispatch = useDispatch();

    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")
    const [Name, setName] = useState("")
    const [ConfirmPasswod, setConfirmPassword] = useState("")

    const onEmailHandler = (e)=>{
            setEmail(e.target.value);
    }
    
    const onNameHandler = (e)=>{
        setName(e.target.value);
    }

    const onPasswordHandler = (e)=>{
        setPassword(e.target.value);
    }

    const onConfirmPasswordHandler = (e)=>{
        setConfirmPassword(e.target.value);
    }

    const onSubmitHandler = (e)=>{
        e.preventDefault();

        if(Password !== ConfirmPasswod){
            return alert('비밀번호 확인이 맞지 않습니다')
        }

        let body = {
            email: Email,
            name : Name,
            password: Password
        }

        dispatch(registerUser(body))
        .then(response=>{
            if(response.payload.success) {
                props.history.push('/login')
            }else{
                alert('failed to sign up')
            }
        })
    }
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh' }}>
            <form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={onSubmitHandler}>
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />
                <label>name</label>
                <input type="text" value={Name} onChange={onNameHandler} />
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />
                <label>Confirm Password</label>
                <input type="password" value={ConfirmPasswod} onChange={onConfirmPasswordHandler} />
                <br />
                <button type='submit'>
                    회원가입
                </button>
            </form>
        </div>
    )
}


export default withRouter(RegisterPage);
