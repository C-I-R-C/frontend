import { useState } from 'react';
import styles from './AddClient.module.css';

export default function ClientForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ name, phone });
    // Здесь будет отправка на бэкенд
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>
          <span className={styles.titleIcon}>+</span>
          Добавить клиента
        </h2>
        
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>ФИО клиента</label>
          <input
            id="name"
            type="text"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введите ФИО клиента"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phone" className={styles.label}>Номер телефона</label>
          <input
            id="phone"
            type="tel"
            className={styles.input}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Введите номер телефона"
            required
          />
        </div>

        <button type="submit" className={styles.submitBtn}>
          Добавить клиента
          <span className={styles.submitArrow}>→</span>
        </button>
      </form>
    </div>
  );
}