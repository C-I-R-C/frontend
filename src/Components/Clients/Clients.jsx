import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import styles from './Clients.module.css';

function ClientsTable() {
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentClient, setCurrentClient] = useState(null);
    const [newClient, setNewClient] = useState({
        name: '',
        phoneNumber: '',
        discountLevel: 10
    });

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            setLoading(true);
            const response = await axios.get('https://localhost:1984/api/Clients');
            setClients(response.data);
            setFilteredClients(response.data);
        } catch (err) {
            toast.error(`Ошибка загрузки клиентов: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleAddClient = async () => {
        try {
            await axios.post('https://localhost:1984/api/Clients', newClient);
            setShowAddModal(false);
            setNewClient({ name: '', phoneNumber: '', discountLevel: 10 });
            toast.success('Клиент успешно добавлен');
            await fetchClients();
        } catch (err) {
            toast.error(`Ошибка добавления клиента: ${err.message}`);
        }
    };

    const handleEditClient = async () => {
        try {
            await axios.put(`https://localhost:1984/api/Clients/${currentClient.id}`, currentClient);
            setShowEditModal(false);
            toast.success('Клиент успешно обновлен');
            await fetchClients();
        } catch (err) {
            toast.error(`Ошибка обновления клиента: ${err.message}`);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://localhost:1984/api/Clients/${id}`);
            toast.success('Клиент успешно удален');
            await fetchClients();
        } catch (err) {
            toast.error(`Ошибка удаления клиента: ${err.message}`);
        }
    };

    const handleSearch = () => {
        if (!searchTerm.trim()) {
            setFilteredClients(clients);
            return;
        }

        const filtered = clients.filter(client =>
            client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.phoneNumber.includes(searchTerm) ||
            client.id.toString().includes(searchTerm) ||
            client.discountLevel.toString().includes(searchTerm)
        );

        setFilteredClients(filtered);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Нет заказов';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const openEditModal = (client) => {
        setCurrentClient({...client});
        setShowEditModal(true);
    };

    if (loading) {
        return <div className={styles.loading}>Загрузка...</div>;
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Клиенты</h2>

            <div className={styles.controls}>
                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Поиск по имени, телефону, ID или скидке..."
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

                <button
                    onClick={() => setShowAddModal(true)}
                    className={styles.addButton}
                >
                    Добавить клиента
                </button>
            </div>

            <table className={styles.table}>
                <thead>
                    <tr>
                        {/* <th className={styles.header}>ID</th> */}
                        <th className={styles.header}>Имя</th>
                        <th className={styles.header}>Телефон</th>
                        <th className={styles.header}>Всего заказов</th>
                        <th className={styles.header}>Скидка (%)</th>
                        <th className={styles.header}>Потрачено</th>
                        <th className={styles.header}>Последний заказ</th>
                        <th className={styles.header}>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredClients.length > 0 ? (
                        filteredClients.map((client) => (
                            <tr key={client.id} className={styles.row}>
                                {/* <td className={styles.cell}>{client.id}</td> */}
                                <td className={styles.cell}>{client.name}</td>
                                <td className={styles.cell}>{client.phoneNumber}</td>
                                <td className={styles.cell}>{client.totalOrdersCount}</td>
                                <td className={styles.cell}>{client.discountLevel}</td>
                                <td className={styles.cell}>{client.totalSpent}</td>
                                <td className={styles.cell}>{formatDate(client.lastOrderDate)}</td>
                                <td className={styles.cell}>
                                    <button
                                        onClick={() => openEditModal(client)}
                                        className={styles.editButton}
                                    >
                                        Изменить
                                    </button>
                                    <button
                                        onClick={() => handleDelete(client.id)}
                                        className={styles.deleteButton}
                                    >
                                        Удалить
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr className={styles.row}>
                            <td colSpan="8" className={styles.noResults}>
                                Клиенты не найдены
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {showAddModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>Добавить нового клиента</h3>

                        <div className={styles.modalInputGroup}>
                            <label>Имя:</label>
                            <input
                                type="text"
                                value={newClient.name}
                                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                                className={styles.modalInput}
                                required
                            />
                        </div>

                        <div className={styles.modalInputGroup}>
                            <label>Телефон:</label>
                            <input
                                type="tel"
                                value={newClient.phoneNumber}
                                onChange={(e) => setNewClient({ ...newClient, phoneNumber: e.target.value })}
                                className={styles.modalInput}
                                required
                            />
                        </div>

                        <div className={styles.modalInputGroup}>
                            <label>Уровень скидки (%):</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={newClient.discountLevel}
                                onChange={(e) => setNewClient({ ...newClient, discountLevel: parseInt(e.target.value) || 0 })}
                                className={styles.modalInput}
                            />
                        </div>

                        <div className={styles.modalButtons}>
                            <button
                                onClick={handleAddClient}
                                className={styles.modalAddButton}
                                disabled={!newClient.name.trim() || !newClient.phoneNumber.trim()}
                            >
                                Добавить
                            </button>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className={styles.modalCancelButton}
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showEditModal && currentClient && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>Редактировать клиента</h3>

                        <div className={styles.modalInputGroup}>
                            <label>Имя:</label>
                            <input
                                type="text"
                                value={currentClient.name}
                                onChange={(e) => setCurrentClient({ ...currentClient, name: e.target.value })}
                                className={styles.modalInput}
                                required
                            />
                        </div>

                        <div className={styles.modalInputGroup}>
                            <label>Телефон:</label>
                            <input
                                type="tel"
                                value={currentClient.phoneNumber}
                                onChange={(e) => setCurrentClient({ ...currentClient, phoneNumber: e.target.value })}
                                className={styles.modalInput}
                                required
                            />
                        </div>

                        <div className={styles.modalInputGroup}>
                            <label>Уровень скидки (%):</label>
                            <input
                                type="number"
                                min="0"
                                max="10"
                                value={currentClient.discountLevel}
                                onChange={(e) => setCurrentClient({ ...currentClient, discountLevel: parseInt(e.target.value) || 0 })}
                                className={styles.modalInput}
                            />
                        </div>

                        <div className={styles.modalButtons}>
                            <button
                                onClick={handleEditClient}
                                className={styles.modalAddButton}
                                disabled={!currentClient.name.trim() || !currentClient.phoneNumber.trim()}
                            >
                                Сохранить
                            </button>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className={styles.modalCancelButton}
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ClientsTable;