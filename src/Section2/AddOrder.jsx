import { useState } from 'react';
import styles from './Section2.module.css';

export default function OrderForm() {

  const [orderItems, setOrderItems] = useState([{ type: '', quantity: 1  , description: ''}]);
  const [client, setClient] = useState('');
  const [orderDescription, setOrderDescription] = useState('');


  const handleAddItem = () => {
    setOrderItems([...orderItems, { type: '', quantity: 1 }]);
  };

  const handleRemoveItem = (index) => {
    if (orderItems.length > 1) {
      const newItems = [...orderItems];
      newItems.splice(index, 1);
      setOrderItems(newItems);
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...orderItems];
    newItems[index][field] = field === 'quantity' ? parseInt(value) || 1 : value;
    setOrderItems(newItems);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ client,
     items: orderItems ,
     items: orderDescription});
    // Здесь будет отправка на бэкенд
  };

 

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>
          <span className={styles.titleIcon}>+</span>
          Добавить заказ
        </h2>
        
        <div className={styles.formGroup}>
          <label htmlFor="client" className={styles.label}>Клиент</label>
          <div className={styles.selectWrapper}>
            <select
              id="client"
              className={styles.select}
              value={client}
              onChange={(e) => setClient(e.target.value)}
              required
            >
              <option value="">Выберите клиента...</option>
              {/* Данные с бэкенда появятся здесь */}
            </select>
            <span className={styles.selectArrow}>▼</span>
          </div>
        </div>

        <div>
          <input 
          id = 'description'
          className={styles.inputDescription}
          value = { orderDescription}
          onChange = {(e) => setOrderDescription(e.target.value)}

          placeholder = "Информация о закаез..."
          rows = {3}

          ></input>

        </div>


        <div className={styles.itemsSection}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>🛒</span>
            Позиции заказа
          </h3>
          
          {orderItems.map((item, index) => (
            <div key={index} className={styles.itemCard}>
              <div className={styles.itemControls}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Тип товара</label>
                  <div className={styles.selectWrapper}>
                    <select
                      className={styles.select}
                      value={item.type}
                      onChange={(e) => handleItemChange(index, 'type', e.target.value)}
                      required
                    >
                      <option value="">Выберите тип...</option>
                      {/* Данные с бэкенда появятся здесь */}
                    </select>
                    <span className={styles.selectArrow}>▼</span>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Количество</label>
                  <div className={styles.quantityInput}>
                    <button 
                      type="button" 
                      className={styles.quantityBtn}
                      onClick={() => handleItemChange(index, 'quantity', Math.max(1, item.quantity - 1))}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      className={styles.quantityValue}
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    />
                    <button 
                      type="button" 
                      className={styles.quantityBtn}
                      onClick={() => handleItemChange(index, 'quantity', item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {orderItems.length > 1 && (
                <button
                  type="button"
                  className={styles.removeItemBtn}
                  onClick={() => handleRemoveItem(index)}
                  aria-label="Удалить позицию"
                >
                  <span className={styles.removeIcon}>×</span>
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            className={styles.addItemBtn}
            onClick={handleAddItem}
          >
            <span className={styles.plusIcon}>+</span> Добавить позицию
          </button>
        </div>

        <button type="submit" className={styles.submitBtn}>
          Создать заказ
          <span className={styles.submitArrow}>→</span>
        </button>
      </form>
    </div>
  );
}

