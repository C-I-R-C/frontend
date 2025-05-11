import { useState, useEffect } from 'react';
import styles from './Clients.Table.module.css';

export default function ClientsList() {
  const [clients, setClients] = useState([]);
  const [expandedClientId, setExpandedClientId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка клиентов с бэкенда
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:5000/api/Clients');
        
        if (!response.ok) {
          throw new Error('Ошибка при загрузке клиентов');
        }
        
        const data = await response.json();
        setClients(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Загрузка заказов конкретного клиента
  const fetchClientOrders = async (clientId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/Clients/${clientId}/orders`);
      
      if (!response.ok) {
        throw new Error('Ошибка при загрузке заказов');
      }
      
      const orders = await response.json();
      
      // Обновляем клиента с его заказами
      setClients(prevClients => 
        prevClients.map(client => 
          client.id === clientId ? { ...client, orders } : client
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const toggleClientOrders = (clientId) => {
    if (expandedClientId === clientId) {
      setExpandedClientId(null);
    } else {
      setExpandedClientId(clientId);
      // Если у клиента еще не загружены заказы, загружаем их
      const client = clients.find(c => c.id === clientId);
      if (!client.orders) {
        fetchClientOrders(clientId);
      }
    }
  };

  if (isLoading) return <div className={styles.loading}>Загрузка клиентов...</div>;
  if (error) return <div className={styles.error}>Ошибка: {error}</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Список клиентов</h2>
      
      <div className={styles.clientsList}>
        {clients.map(client => (
          <div key={client.id} className={styles.clientCard}>
            <div className={styles.clientInfo}>
              <div>
                <h3 className={styles.clientName}>{client.name}</h3>
                <p className={styles.clientPhone}>{client.phone}</p>
              </div>
              
              <button 
                className={styles.detailsButton}
                onClick={() => toggleClientOrders(client.id)}
              >
                {expandedClientId === client.id ? 'Скрыть' : 'Подробнее'}
              </button>
            </div>
            
            {expandedClientId === client.id && (
              <div className={styles.ordersContainer}>
                {client.orders ? (
                  client.orders.length > 0 ? (
                    <table className={styles.ordersTable}>
                      <thead>
                        <tr>
                          <th>Дата</th>
                          <th>Позиция</th>
                          <th>Количество</th>
                        </tr>
                      </thead>
                      <tbody>
                        {client.orders.map((order, index) => (
                          <tr key={index}>
                            <td>{new Date(order.date).toLocaleDateString()}</td>
                            <td>{order.items.map(item => item.type).join(', ')}</td>
                            <td>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className={styles.noOrders}>У клиента нет заказов</p>
                  )
                ) : (
                  <p className={styles.loadingOrders}>Загрузка заказов...</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
