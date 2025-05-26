import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './AddOrder.module.css';
import { useNavigate } from 'react-router-dom';

function AddOrder() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [clients, setClients] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState({
    clients: false,
    items: false,
    submitting: false
  });
  const [error, setError] = useState(null);
  
  const [orderData, setOrderData] = useState({
    clientId: '',
    orderCompleteDate: '',
    comment: '',
    items: [
      { itemId: '', quantity: 1 }
    ]
  });

  useEffect(() => {
    if (showModal) {
      fetchClients();
      fetchItems();
    }
  }, [showModal]);

  const fetchClients = async () => {
    try {
      setLoading(prev => ({...prev, clients: true}));
      const response = await axios.get('https://localhost:5001/api/Clients');
      setClients(response.data);
    } catch (err) {
      setError(`Ошибка загрузки клиентов: ${err.message}`);
    } finally {
      setLoading(prev => ({...prev, clients: false}));
    }
  };

  const fetchItems = async () => {
    try {
      setLoading(prev => ({...prev, items: true}));
      const response = await axios.get('https://localhost:5001/api/Items');
      setItems(response.data);
    } catch (err) {
      setError(`Ошибка загрузки товаров: ${err.message}`);
    } finally {
      setLoading(prev => ({...prev, items: false}));
    }
  };

  const handleAddItem = () => {
    setOrderData(prev => ({
      ...prev,
      items: [...prev.items, { itemId: '', quantity: 1 }]
    }));
  };

  const handleRemoveItem = (index) => {
    if (orderData.items.length > 1) {
      setOrderData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const handleItemChange = (index, field, value) => {
    setOrderData(prev => {
      const updatedItems = [...prev.items];
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: field === 'quantity' ? parseInt(value) || 0 : value
      };
      return {
        ...prev,
        items: updatedItems
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(prev => ({...prev, submitting: true}));
      setError(null);
      
      const formattedDate = orderData.orderCompleteDate 
        ? `${orderData.orderCompleteDate}T00:00:00.000Z`
        : new Date().toISOString();
      
      const response = await axios.post('https://localhost:5001/api/Orders', {
        clientId: parseInt(orderData.clientId),
        orderCompleteDate: formattedDate,
        comment: orderData.comment,
        items: orderData.items.map(item => ({
          itemId: parseInt(item.itemId),
          quantity: parseInt(item.quantity)
        }))
      });
      
      if (response.status === 200 || response.status === 201) {
        setShowModal(false);
        setOrderData({
          clientId: '',
          orderCompleteDate: '',
          comment: '',
          items: [
            { itemId: '', quantity: 1 }
          ]
        });

        navigate(0);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(prev => ({...prev, submitting: false}));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderData(prev => ({
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
        Создать заказ
      </button>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Создание нового заказа</h2>
            <button 
              onClick={() => setShowModal(false)}
              className={styles.closeButton}
            >
              ×
            </button>
            
            {error && <div className={styles.error}>{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Клиент:</label>
                {loading.clients ? (
                  <div>Загрузка клиентов...</div>
                ) : (
                  <select
                    name="clientId"
                    value={orderData.clientId}
                    onChange={handleChange}
                    required
                    className={styles.select}
                  >
                    <option value="">Выберите клиента</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.name} ({client.phoneNumber})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Дата завершения заказа:</label>
                <input
                  type="date"
                  name="orderCompleteDate"
                  value={orderData.orderCompleteDate}
                  onChange={handleChange}
                  className={styles.input}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Комментарий:</label>
                <textarea
                  name="comment"
                  value={orderData.comment}
                  onChange={handleChange}
                  className={styles.textarea}
                  rows={3}
                />
              </div>

              <div className={styles.itemsSection}>
                <h3>Лоты:</h3>
                
                {orderData.items.map((item, index) => (
                  <div key={index} className={styles.itemRow}>
                    <div className={styles.itemSelect}>
                      <label>Лоты:</label>
                      {loading.items ? (
                        <div>Загрузка лот...</div>
                      ) : (
                        <select
                          value={item.itemId}
                          onChange={(e) => handleItemChange(index, 'itemId', e.target.value)}
                          required
                          className={styles.select}
                        >
                          <option value="">Выберите лот</option>
                          {items.map(item => (
                            <option key={item.id} value={item.id}>
                              {item.name} (цена: {item.basePrice})
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    <div className={styles.quantityInput}>
                      <label>Количество:</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        required
                        className={styles.input}
                      />
                    </div>

                    {orderData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className={styles.removeButton}
                      >
                        Удалить
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddItem}
                  className={styles.addItemButton}
                >
                  + Добавить лот
                </button>
              </div>

              <div className={styles.buttonGroup}>
                <button 
                  type="submit" 
                  className={styles.submitButton}
                  disabled={loading.submitting}
                >
                  {loading.submitting ? 'Создание...' : 'Создать заказ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddOrder;