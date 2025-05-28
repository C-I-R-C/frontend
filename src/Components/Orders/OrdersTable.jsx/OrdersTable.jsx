import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import styles from './OrdersTable.module.css';

function OrdersTable() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAnalysisModal, setShowAnalysisModal] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [orderData, setOrderData] = useState({
        comment: '',
        isCurrent: true,
        orderCompleteDate: ''
    });
    const [profitAnalysis, setProfitAnalysis] = useState(null);
    const [analysisLoading, setAnalysisLoading] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [orders, filter, searchTerm]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await axios.get('https://localhost:1984/api/Orders');
            setOrders(response.data);
        } catch (err) {
            toast.error(`Ошибка загрузки заказов: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...orders];

        if (filter === 'current') {
            filtered = filtered.filter(order => order.isCurrent);
        } else if (filter === 'completed') {
            filtered = filtered.filter(order => !order.isCurrent);
        }

        if (searchTerm.trim()) {
            filtered = filtered.filter(order =>
                order.id.toString().includes(searchTerm) ||
                order.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.client.id.toString().includes(searchTerm)
            );
        }

        setFilteredOrders(filtered);
    };

    const handleSearch = () => {
        applyFilters();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Не указана';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const showOrderDetails = (order) => {
        setCurrentOrder(order);
        setShowDetailsModal(true);
    };

    const openEditModal = (order) => {
        setCurrentOrder(order);
        setOrderData({
            comment: order.comment || '',
            isCurrent: order.isCurrent,
            orderCompleteDate: order.orderCompleteDate || new Date().toISOString()
        });
        setShowEditModal(true);
    };

    const handleEditOrder = async () => {
        try {
            await axios.put(`https://localhost:1984/api/Orders/${currentOrder.id}`, orderData);
            toast.success('Заказ успешно обновлен');
            setShowEditModal(false);
            await fetchOrders();
        } catch (err) {
            toast.error(`Ошибка обновления заказа: ${err.message}`);
        }
    };

    const completeOrder = async (orderId) => {
        try {
            await axios.patch(`https://localhost:1984/api/Orders/${orderId}/complete`);
            toast.success('Заказ успешно завершен');
            await fetchOrders();
        } catch (err) {
            toast.error(`Ошибка завершения заказа: ${err.message}`);
        }
    };

    const deleteOrder = async (orderId) => {
        try {
            await axios.delete(`https://localhost:1984/api/Orders/${orderId}`);
            toast.success('Заказ успешно удален');
            await fetchOrders();
        } catch (err) {
            toast.error(`Ошибка удаления заказа: ${err.message}`);
        }
    };

    const deleteCompletedOrders = async () => {
        try {
            const completedOrders = orders.filter(order => !order.isCurrent);
            if (completedOrders.length === 0) {
                toast.info('Нет завершенных заказов для удаления');
                return;
            }

            const confirm = window.confirm(`Вы уверены, что хотите удалить все завершенные заказы (${completedOrders.length} шт.)?`);
            if (!confirm) return;

            await Promise.all(completedOrders.map(order => 
                axios.delete(`https://localhost:1984/api/Orders/${order.id}`)
            ));
            toast.success(`Удалено ${completedOrders.length} завершенных заказов`);
            await fetchOrders();
        } catch (err) {
            toast.error(`Ошибка удаления завершенных заказов: ${err.message}`);
        }
    };

    const fetchProfitAnalysis = async (orderId) => {
        try {
            setAnalysisLoading(true);
            const response = await axios.get(`https://localhost:1984/api/Orders/${orderId}/profit`);
            setProfitAnalysis(response.data);
            setShowAnalysisModal(true);
        } catch (err) {
            toast.error(`Ошибка загрузки анализа: ${err.message}`);
        } finally {
            setAnalysisLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setOrderData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    if (loading) {
        return <div className={styles.loading}>Загрузка...</div>;
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Заказы</h2>

            <div className={styles.controls}>
                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Поиск по ID, имени клиента..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className={styles.searchInput}
                    />
                    <button
                        onClick={handleSearch}
                        className={styles.searchButton}
                    >
                        Поиск
                    </button>
                </div>

                <div className={styles.rightControls}>
                    <div className={styles.filterButtons}>
                        <button
                            onClick={() => setFilter('all')}
                            className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
                        >
                            Все
                        </button>
                        <button
                            onClick={() => setFilter('current')}
                            className={`${styles.filterButton} ${filter === 'current' ? styles.active : ''}`}
                        >
                            Текущие
                        </button>
                        <button
                            onClick={() => setFilter('completed')}
                            className={`${styles.filterButton} ${filter === 'completed' ? styles.active : ''}`}
                        >
                            Завершённые
                        </button>
                    </div>

                    <button
                        onClick={deleteCompletedOrders}
                        className={styles.deleteAllButton}
                        disabled={!orders.some(order => !order.isCurrent)}
                    >
                        Удалить все завершённые
                    </button>
                </div>
            </div>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles.header}>ID</th>
                        <th className={styles.header}>Клиент</th>
                        <th className={styles.header}>Дата заказа</th>
                        <th className={styles.header}>Дата завершения</th>
                        <th className={styles.header}>Сумма</th>
                        <th className={styles.header}>Статус</th>
                        <th className={styles.header}>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => (
                            <tr key={order.id} className={styles.row}>
                                <td className={styles.cell}>{order.id}</td>
                                <td className={styles.cell}>{order.client.name} (ID: {order.client.id})</td>
                                <td className={styles.cell}>{formatDate(order.orderDate)}</td>
                                <td className={styles.cell}>{formatDate(order.orderCompleteDate)}</td>
                                <td className={styles.cell}>{order.totalPrice}</td>
                                <td className={styles.cell}>
                                    {order.isCurrent ? (
                                        <span className={styles.current}>Текущий</span>
                                    ) : (
                                        <span className={styles.completed}>Завершён</span>
                                    )}
                                </td>
                                <td className={styles.cell}>
                                    <div className={styles.actionButtons}>
                                        <button
                                            onClick={() => showOrderDetails(order)}
                                            className={styles.detailsButton}
                                        >
                                            Подробнее
                                        </button>
                                        <button
                                            onClick={() => openEditModal(order)}
                                            className={styles.editButton}
                                        >
                                            Изменить
                                        </button>
                                        <button
                                            onClick={() => {
                                                setCurrentOrder(order);
                                                fetchProfitAnalysis(order.id);
                                            }}
                                            className={styles.analysisButton}
                                            disabled={analysisLoading && currentOrder?.id === order.id}
                                        >
                                            {analysisLoading && currentOrder?.id === order.id ? 'Загрузка...' : 'Анализ'}
                                        </button>
                                        <button
                                            onClick={() => completeOrder(order.id)}
                                            className={`${styles.completeButton} ${!order.isCurrent ? styles.disabledButton : ''}`}
                                            disabled={!order.isCurrent}
                                        >
                                            Завершить
                                        </button>
                                        <button
                                            onClick={() => deleteOrder(order.id)}
                                            className={styles.deleteButton}
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr className={styles.row}>
                            <td colSpan="7" className={styles.noResults}>
                                Заказы не найдены
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Модальное окно с деталями заказа */}
            {showDetailsModal && currentOrder && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>Детали заказа #{currentOrder.id}</h3>
                        <button 
                            onClick={() => {
                                setShowDetailsModal(false);
                                setCurrentOrder(null);
                            }}
                            className={styles.closeButton}
                        >
                            ×
                        </button>
                        
                        <div className={styles.detailsContainer}>
                            <p><strong>Клиент:</strong> {currentOrder.client.name} (ID: {currentOrder.client.id})</p>
                            <p><strong>Дата заказа:</strong> {formatDate(currentOrder.orderDate)}</p>
                            <p><strong>Дата завершения:</strong> {formatDate(currentOrder.orderCompleteDate)}</p>
                            <p><strong>Сумма:</strong> {currentOrder.totalPrice}</p>
                            <p><strong>Срочный:</strong> {currentOrder.isUrgent ? 'Да' : 'Нет'}</p>
                            <p><strong>Комментарий:</strong> {currentOrder.comment || 'Нет комментария'}</p>
                            
                            <h4>Состав заказа:</h4>
                            <ul className={styles.itemsList}>
                                {currentOrder.items.map(item => (
                                    <li key={item.id}>
                                        {item.quantity} × {item.item.name} ({item.unitPrice} за шт.)
                                        <ul>
                                            {item.flowers.map(flower => (
                                                <li key={flower.flowerId}>
                                                    {flower.flowerName} ({flower.totalQuantity} шт.)
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Модальное окно редактирования заказа */}
            {showEditModal && currentOrder && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>Редактирование заказа #{currentOrder.id}</h3>
                        <button 
                            onClick={() => {
                                setShowEditModal(false);
                                setCurrentOrder(null);
                            }}
                            className={styles.closeButton}
                        >
                            ×
                        </button>
                        
                        <div className={styles.formGroup}>
                            <label>
                                <input
                                    type="checkbox"
                                    name="isCurrent"
                                    checked={orderData.isCurrent}
                                    onChange={handleChange}
                                />
                                Заказ активен
                            </label>
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label>Дата завершения заказа:</label>
                            <input
                                type="date"
                                name="orderCompleteDate"
                                value={orderData.orderCompleteDate.split('T')[0]}
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
                                rows="3"
                            />
                        </div>
                        
                        <div className={styles.modalButtons}>
                            <button
                                onClick={handleEditOrder}
                                className={styles.saveButton}
                            >
                                Сохранить
                            </button>
                            <button
                                onClick={() => {
                                    setShowEditModal(false);
                                    setCurrentOrder(null);
                                }}
                                className={styles.cancelButton}
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Модальное окно анализа прибыли */}
            {showAnalysisModal && currentOrder && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>Анализ прибыли заказа #{currentOrder.id}</h3>
                        <button 
                            onClick={() => {
                                setShowAnalysisModal(false);
                                setCurrentOrder(null);
                                setProfitAnalysis(null);
                            }}
                            className={styles.closeButton}
                        >
                            ×
                        </button>
                        
                        {analysisLoading ? (
                            <div className={styles.loading}>Загрузка анализа...</div>
                        ) : profitAnalysis ? (
                            <div className={styles.analysisContainer}>
                                <div className={styles.analysisRow}>
                                    <span>Общая цена продажи:</span>
                                    <span>{profitAnalysis.totalSellingPrice}</span>
                                </div>
                                <div className={styles.analysisRow}>
                                    <span>Общая себестоимость:</span>
                                    <span>{profitAnalysis.totalActualCost}</span>
                                </div>
                                <div className={styles.analysisRow}>
                                    <span>Сумма скидки:</span>
                                    <span>{profitAnalysis.discountAmount}</span>
                                </div>
                                <div className={styles.analysisRow}>
                                    <span>Прибыль до скидки:</span>
                                    <span>{profitAnalysis.profitBeforeDiscount}</span>
                                </div>
                                <div className={`${styles.analysisRow} ${profitAnalysis.finalProfit < 0 ? styles.lossRow : styles.profitRow}`}>
                                    <span>Итоговая прибыль:</span>
                                    <span>{profitAnalysis.finalProfit}</span>
                                </div>
                                <div className={styles.analysisRow}>
                                    <span>Маржа прибыли:</span>
                                    <span>{profitAnalysis.profitMargin}%</span>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.noResults}>Данные анализа не загружены</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default OrdersTable;