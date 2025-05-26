import styles from './Setting2.module.css';

export default function Setting2() {
    return (
        <div className={styles.container}>
            <div className={styles.buttonsRow}>
                <a href='/itemflowers' className={styles.link}>
                    <button className={styles.button_}>
                        Рецепты цветов
                    </button>
                </a>

                <a href='/items' className={styles.link}>
                    <button className={styles.button_}>
                        Лоты
                    </button>
                </a>
            </div>
        </div>
    );
}