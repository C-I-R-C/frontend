import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import styles from './ItemDescription.module.css';

function ItemDescription() {
  const [showModal, setShowModal] = useState(false);
  const [items, setItems] = useState([]);
  const [flowers, setFlowers] = useState([]);
  const [loading, setLoading] = useState({
    items: false,
    flowers: false,
    submitting: false
  });
  
  const [selectedItem, setSelectedItem] = useState('');
  const [flowerSelections, setFlowerSelections] = useState([
    { flowerId: '', quantity: 1 }
  ]);

  useEffect(() => {
    if (showModal) {
      fetchItems();
      fetchFlowers();
    }
  }, [showModal]);

  const fetchItems = async () => {
    try {
      setLoading(prev => ({...prev, items: true}));
      const response = await axios.get('https://localhost:1984/api/Items');
      setItems(response.data);
    } catch (err) {
      toast.error(`Ошибка загрузки лотов: ${err.message}`);
    } finally {
      setLoading(prev => ({...prev, items: false}));
    }
  };

  const fetchFlowers = async () => {
    try {
      setLoading(prev => ({...prev, flowers: true}));
      const response = await axios.get('https://localhost:1984/api/Flowers');
      setFlowers(response.data);
    } catch (err) {
      toast.error(`Ошибка загрузки цветов: ${err.message}`);
    } finally {
      setLoading(prev => ({...prev, flowers: false}));
    }
  };

  const addFlowerSelection = () => {
    setFlowerSelections([...flowerSelections, { flowerId: '', quantity: 1 }]);
  };

  const removeFlowerSelection = (index) => {
    if (flowerSelections.length > 1) {
      const newSelections = [...flowerSelections];
      newSelections.splice(index, 1);
      setFlowerSelections(newSelections);
    }
  };

  const handleFlowerChange = (index, e) => {
    const { name, value } = e.target;
    const newSelections = [...flowerSelections];
    newSelections[index] = {
      ...newSelections[index],
      [name]: value
    };
    setFlowerSelections(newSelections);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItem) {
      toast.error('Выберите лот');
      return;
    }

    try {
      setLoading(prev => ({...prev, submitting: true}));
      
      // Отправляем все выбранные цветки для лота
      const requests = flowerSelections
        .filter(selection => selection.flowerId)
        .map(selection => 
          axios.post(
            `https://localhost:1984/api/ItemFlowers?itemId=${selectedItem}`,
            {
              flowerId: parseInt(selection.flowerId),
              quantity: parseInt(selection.quantity)
            }
          )
        );

      await Promise.all(requests);
      
      toast.success('Цветки успешно добавлены в лот');
      setShowModal(false);
      setSelectedItem('');
      setFlowerSelections([{ flowerId: '', quantity: 1 }]);
      
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(prev => ({...prev, submitting: false}));
    }
  };

  return (
    <div className={styles.container}>
      <button 
        onClick={() => setShowModal(true)}
        className={styles.editButton}
      >
        Редактировать лот
      </button>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Добавить цветки в лот</h2>
            <button 
              onClick={() => {
                setShowModal(false);
                setSelectedItem('');
                setFlowerSelections([{ flowerId: '', quantity: 1 }]);
              }}
              className={styles.closeButton}
            >
              ×
            </button>
            
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Лот:</label>
                {loading.items ? (
                  <div>Загрузка списка лотов...</div>
                ) : (
                  <select
                    value={selectedItem}
                    onChange={(e) => setSelectedItem(e.target.value)}
                    required
                    className={styles.select}
                  >
                    <option value="">Выберите лот</option>
                    {items.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.name} (коробка: {item.box.name})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className={styles.flowersList}>
                <h3>Цветки:</h3>
                {flowerSelections.map((selection, index) => (
                  <div key={index} className={styles.flowerSelection}>
                    <div className={styles.formGroup}>
                      <label>Цветок:</label>
                      {loading.flowers ? (
                        <div>Загрузка списка цветов...</div>
                      ) : (
                        <select
                          name="flowerId"
                          value={selection.flowerId}
                          onChange={(e) => handleFlowerChange(index, e)}
                          required
                          className={styles.select}
                        >
                          <option value="">Выберите цветок</option>
                          {flowers.map(flower => (
                            <option key={flower.id} value={flower.id}>
                              {flower.name} ({flower.color.name}, {flower.inStock} шт.)
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label>Количество:</label>
                      <div className={styles.quantityControl}>
                        <input
                          type="number"
                          min="1"
                          name="quantity"
                          value={selection.quantity}
                          onChange={(e) => handleFlowerChange(index, e)}
                          required
                          className={styles.input}
                        />
                        {flowerSelections.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFlowerSelection(index)}
                            className={styles.removeButton}
                          >
                            Удалить
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addFlowerSelection}
                  className={styles.addButton}
                >
                  + Добавить еще цветок
                </button>
              </div>

              <div className={styles.buttonGroup}>
                <button 
                  type="submit" 
                  className={styles.submitButton}
                  disabled={loading.submitting}
                >
                  {loading.submitting ? 'Добавление...' : 'Сохранить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ItemDescription;