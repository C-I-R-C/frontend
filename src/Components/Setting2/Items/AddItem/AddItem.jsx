import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './AddItem.module.css';

function AddItem() {
  const [showModal, setShowModal] = useState(false);
  const [boxes, setBoxes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [newItem, setNewItem] = useState({
    name: '',
    basePrice: 0,
    boxId: ''
  });

  useEffect(() => {
    if (showModal) {
      fetchBoxes();
    }
  }, [showModal]);

  const fetchBoxes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://localhost:1984/api/Boxes');
      setBoxes(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      await axios.post('https://localhost:1984/api/Items', {
        name: newItem.name,
        basePrice: parseFloat(newItem.basePrice),
        boxId: parseInt(newItem.boxId)
      });
      
      setShowModal(false);
      setNewItem({
        name: '',
        basePrice: 0,
        boxId: ''
      });
      
      
      
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={styles.container}>
      <button 
        onClick={() => setShowModal(true)}
        className={styles.addButton}
      >
        Создать лот
      </button>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Создание нового лота</h2>
            
            {error && <div className={styles.error}>{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Название лота:</label>
                <input
                  type="text"
                  name="name"
                  value={newItem.name}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Базовая цена:</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  name="basePrice"
                  value={newItem.basePrice}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Коробка:</label>
                {loading ? (
                  <div>Загрузка списка коробок...</div>
                ) : (
                  <select
                    name="boxId"
                    value={newItem.boxId}
                    onChange={handleChange}
                    required
                    className={styles.select}
                  >
                    <option value="">Выберите коробку</option>
                    {boxes.map(box => (
                      <option key={box.id} value={box.id}>
                        {box.name} (в наличии: {box.inStock})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className={styles.buttonGroup}>
                <button 
                  type="submit" 
                  className={styles.submitButton}
                  disabled={loading}
                >
                  {loading ? 'Создание...' : 'Создать'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className={styles.cancelButton}
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddItem;