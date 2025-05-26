import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Login.module.css'

export default function Login() {

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/api/Auth/login', formData);
            console.log('Успешный вход:', response.data);

            // Здесь можно сохранить токен авторизации и перенаправить на защищенную страницу
            navigate('/mainpage');
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка входа');
            alert('Ошибка входа: неверный логин или пароль');
        } finally {
            setIsLoading(false);
        }
    };

    return (

        <div className={styles.mainblock}>
            <div className={styles.headname}>
                <h1>Войти</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <div className={styles.inputblock}>
                    
                    <input
                        className={styles.inputstyle}
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        placeholder="login"
                    />
                </div>

                <div className={styles.inputblock}>
                    
                    <input
                        className={styles.inputstyle}
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="password"
                    />
                </div>

                <button className={styles.but1} type="submit" disabled={isLoading}>
                    {isLoading ? 'Вход...' : 'Войти'}
                </button>
            </form>
        </div>

    );
};