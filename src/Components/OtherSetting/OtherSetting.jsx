import styles from './OtherSetting.module.css';

export default function Setting() {
    return (
        <div className={styles.container}>
            <div className={styles.buttonsRow}>
                <a href='/ingredients' className={styles.link}>
                    <button className={styles.button_}>
                        Ингредиенты
                    </button>
                </a>

                <a href='/colors' className={styles.link}>
                    <button className={styles.button_}>
                        Красители
                    </button>
                </a>

                <a href='/boxes' className={styles.link}>
                    <button className={styles.button_}>
                        Коробки
                    </button>
                </a>
            </div>
        </div>
    );
}