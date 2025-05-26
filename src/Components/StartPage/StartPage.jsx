import React from 'react';
import { AppBar, Toolbar, Typography, Button, Card, CardContent, CardMedia, Box } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import styles from './StartPage.module.css';
import logo from './logo.jpg';

function StartPage() {
    return (
        <div className={styles.appContainer}>
            <div className={styles.loginButtonContainer}>
                <a href='/login'>
                    <Button
                        variant="contained"
                        startIcon={<AccountCircle />}
                        className={styles.loginButton}
                    >
                        Войти
                    </Button>
                </a>
            </div>


            <Card className={styles.card}>
                <Box className={styles.cardContent}>
                
                    <CardMedia
                        component="img"
                        className={styles.cardImage}
                        image={logo}
                        alt="Демонстрационное изображение"
                    />

                    <CardContent className={styles.textContent}>
                        <Typography variant="h4" className={styles.cardTitle}>
                            Привет путешественник!!!
                        </Typography>

                        <Typography variant="body1" className={styles.cardText}>
                            Это специальное приложение для сотрудников нашего предприятия.
                             Если вы попали сюда слючайно, то можете более подробно ознакомиться с нашей деятельностью <a href = 'https://vk.com/darizefir'  target="_blank" rel="noopener noreferrer">здесь</a>.
                        </Typography>
                    </CardContent>
                </Box>
            </Card>
        </div>
    );
}

export default StartPage;