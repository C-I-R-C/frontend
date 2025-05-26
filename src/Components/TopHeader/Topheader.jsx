import styles from './Topheader.module.css'


const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.logo}>C-R-M</div>

            <nav className={styles.nav}>

                <a href='/mainpage' >
                    <button
                        className={styles.navButton}
                    >
                        Главное
                    </button>
                </a>

                <a  href='/orders'>
                    <button
                        className={styles.navButton}
                    >
                        Заказы
                    </button>

                </a>


                <a  href='/clients'>
                    <button
                        className={styles.navButton}
                    >
                        Клиенты
                    </button>

                </a>

                <a  href='/inventory'>
                    <button
                        className={styles.navButton}
                    >
                        Склад
                    </button>

                </a>

                <a  href='/other'>
                    <button
                        className={styles.navButton}
                    >
                        Другие настройки
                    </button>
                </a>

                <a  href='/finance'>
                    <button
                        className={styles.navButton}
                    >
                        Финансы
                    </button>

                </a>

                <a  href='/'>
                    <button
                        className={styles.navButton}
                    >
                        Выход
                    </button>

                </a>
            </nav>
        </header>
    );
};

export default Header;