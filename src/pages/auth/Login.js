import { Link, useNavigate } from 'react-router-dom';
import React from 'react';
import { useForm } from 'react-hook-form';

import { NotificationManager } from 'react-notifications';

import store from '../../app/store';
import { login, setUser } from './authSlice';

import styles from './Login.module.css';
export function Login() {
  let navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onLogin = async (data) => {
    let result = await store.dispatch(login(data));
    if (result.payload.status === true) {
      store.dispatch(
        setUser({
          user: result.payload.user,
          isLogin: true,
          accessToken: result.payload.accessToken,
        })
      );
      NotificationManager.success(result.payload.message, 'Login Info');
      setTimeout(() => {
        navigate(`/`);
      }, 2000);
    } else {
      NotificationManager.error(result.payload.message, 'Login Info');
    }
    console.log('Log ~ onLogin ~ result', result.payload);
  };

  return (
    <div>
      <main>
        <div className={styles.row}>
          // <div className={styles.colm_logo}>
          //   <img
          //     src='https://static.xx.fbcdn.net/rsrc.php/y8/r/dF5SId3UHWd.svg'
          //     alt='Logo'
          //   />
          //   <h2>
          //     Facebook helps you connect and share with the people in your life.
          //   </h2>
          // </div>
          <div className={styles.colm_form}>
            <form className={styles.form_container}>
              <input
                type='text'
                placeholder='Email address or phone number'
                {...register('email', {
                  required: true,
                  maxLength: 50,
                })}
              />
              {errors?.email?.type === 'required' && (
                <p className='text-red-600/100'>This field is required</p>
              )}
              {errors?.email?.type === 'maxLength' && (
                <p className='text-red-600/100'>
                  First name cannot exceed 50 characters
                </p>
              )}
              <input
                type='password'
                placeholder='Password'
                {...register('password', {
                  required: true,
                  maxLength: 20,
                  minLength: 8,
                })}
              />
              {errors?.password?.type === 'required' && (
                <p className='text-red-600/100'>This field is required</p>
              )}
              {errors?.password?.type === 'minLength' && (
                <p className='text-red-600/100'>at lest 8 characters</p>
              )}
              {errors?.password?.type === 'maxLength' && (
                <p className='text-red-600/100'>
                  Field cannot exceed 20 characters
                </p>
              )}
              <input
                type='submit'
                onClick={handleSubmit(onLogin)}
                className={styles.btn_login}
                value='Login'
              />
              <Link to='/'>Forgotten password?</Link>
              <input
                type='submit'
                onClick={() => {
                  navigate(`/register`);
                }}
                className={styles.btn_new}
                value='Create new Account'
              />
            </form>
            <p>
              <Link to=''>
                <b>Create a Page</b>
              </Link>{' '}
              for a celebrity, brand or business.
            </p>
          </div>
        </div>
      </main>
      <footer>
        <div className={styles.footer_contents}>
          <ol>
            <li>English (UK)</li>
            <li>
              <Link to='/'>മലയാളം</Link>
            </li>
            <li>
              <Link to='/'>தமிழ்</Link>
            </li>
            <li>
              <Link to='/'>తెలుగు</Link>
            </li>
            <li>
              <Link to='/'>বাংলা</Link>
            </li>
            <li>
              <Link to='/'>اردو</Link>
            </li>
            <li>
              <Link to='/'>हिन्दी</Link>
            </li>
            <li>
              <Link to='/'>ಕನ್ನಡ</Link>
            </li>
            <li>
              <Link to='/'>Español</Link>
            </li>
            <li>
              <Link to='/'>Português (Brasil)</Link>
            </li>
            <li>
              <Link to='/'>Français (France)</Link>
            </li>
            {/* <li><button>+</button></li> */}
          </ol>
          <small>Facebook © 2022</small>
        </div>
      </footer>
    </div>
  );
}
