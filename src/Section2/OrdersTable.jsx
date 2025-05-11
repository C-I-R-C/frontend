// import React, { useState } from 'react';
// import './OrderTable.module.css';
// import axios from 'axios';

// export const fethOrders = async () => {
//   var response = await axios.get("http://localhost:5000/api/Orders");
//   console.log(response);
// }

// const OrdersList = ({ ordersData }) => {
//   const [expandedOrderId, setExpandedOrderId] = useState(fethOrders);

//   if (!ordersData || ordersData.length === 0) {
//     return <div className="no-orders">Нет данных о заказах</div>;
//   }

//   const toggleOrderDetails = (orderId) => {
//     setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
//   };

//   return (
//     <div className="orders-container">
//       <h2 className="orders-title">Список заказов</h2>
      
//       <div className="orders-list">
//         {ordersData.map((order, index) => (
//           <div key={order.id} className="order-card">
//             <div className="order-header">
//               <div className="order-main-info">
//                 <span className="order-number">Заказ #{index + 1}</span>
//                 <span className="customer-name">{order.customerName}</span>
//                 <span className={`order-status ${order.status.toLowerCase()}`}>
//                   {order.status}
//                 </span>
//               </div>
              
//               <button
//                 onClick={() => toggleOrderDetails(order.id)}
//                 className="details-button"
//               >
//                 {expandedOrderId === order.id ? 'Скрыть' : 'Подробнее'}
//               </button>
//             </div>
            
//             {expandedOrderId === order.id && (
//               <div className="order-details">
//                 <div className="details-grid">
//                   <div className="detail-row">
//                     <span className="detail-label">ФИО клиента:</span>
//                     <span className="detail-value">{order.customerName}</span>
//                   </div>
//                   <div className="detail-row">
//                     <span className="detail-label">Дата заказа:</span>
//                     <span className="detail-value">{order.orderDate}</span>
//                   </div>
//                   <div className="detail-row">
//                     <span className="detail-label">Статус:</span>
//                     <span className={`detail-value status-badge ${order.status.toLowerCase()}`}>
//                       {order.status}
//                     </span>
//                   </div>
//                   <div className="detail-row">
//                     <span className="detail-label">Позиции:</span>
//                     <div className="detail-value">
//                       <ul className="items-list">
//                         {order.items.map((item, i) => (
//                           <li key={i}>
//                             <span className="item-name">{item.type}</span>
//                             <span className="item-quantity"> - {item.quantity} кол-во.</span>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   </div>
//                   <div className="detail-row">
//                     <span className="detail-label">Сумма:</span>
//                     <span className="detail-value">{order.total?.toLocaleString()} руб.</span>
//                   </div>
//                   <div className="detail-row">
//                     <span className="detail-label">Описание:</span>
//                     <span className="detail-value description-text">{order.description}</span>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default OrdersList;

import React, { useState, useEffect } from 'react';
import './OrderTable.module.css';
import axios from 'axios';

const OrdersList = () => {
  const [ordersData, setOrdersData] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/Orders");
        setOrdersData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  if (loading) {
    return <div className="loading">Загрузка данных...</div>;
  }

  if (error) {
    return <div className="error">Ошибка: {error}</div>;
  }

  if (!ordersData || ordersData.length === 0) {
    return <div className="no-orders">Нет данных о заказах</div>;
  }

  return (
    <div className="orders-container">
      <h2 className="orders-title">Список заказов</h2>
      
      <div className="orders-list">
        {ordersData.map((order, index) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div className="order-main-info">
                <span className="order-number">Заказ #{index + 1}</span>
                <span className="customer-name">{order.client.name}</span>
                <span className="order-status">
                  {order.isCurrent ? 'Текущий' : 'Завершен'}
                </span>
              </div>
              
              <button
                onClick={() => toggleOrderDetails(order.id)}
                className="details-button"
              >
                {expandedOrderId === order.id ? 'Скрыть' : 'Подробнее'}
              </button>
            </div>
            
            {expandedOrderId === order.id && (
              <div className="order-details">
                <div className="details-grid">
                  <div className="detail-row">
                    <span className="detail-label">Клиент:</span>
                    <span className="detail-value">{order.client.name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Дата заказа:</span>
                    <span className="detail-value">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Статус:</span>
                    <span className="detail-value">
                      {order.isCurrent ? 'Текущий' : 'Завершен'}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Комментарий:</span>
                    <span className="detail-value">{order.comment}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Позиции:</span>
                    <div className="detail-value">
                      <ul className="items-list">
                        {order.items.map((item, i) => (
                          <li key={i}>
                            <span className="item-name">{item.item.name}</span>
                            <span className="item-quantity"> - {item.quantity} шт.</span>
                            <span className="item-price"> - {item.unitPrice * item.quantity} руб.</span>
                            {item.flowers.length > 0 && (
                              <div className="flowers-list">
                                <p>Цветы в составе:</p>
                                <ul>
                                  {item.flowers.map(flower => (
                                    <li key={flower.flowerId}>
                                      {flower.flowerName} ({flower.color}) - {flower.totalQuantity} шт.
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Сумма:</span>
                    <span className="detail-value">
                      {order.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0)} руб.
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersList;