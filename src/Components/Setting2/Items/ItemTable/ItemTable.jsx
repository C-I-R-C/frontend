import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import styles from './ItemTable.module.css';

function ItemTable() {
  const [searchTerm, setSearchTerm] = useState('');

  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [costAnalysis, setCostAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemFlowers, setItemFlowers] = useState([]);
  const [flowersLoading, setFlowersLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentItem, setCurrentItem] = useState({
    id: '',
    name: '',
    basePrice: 0
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://localhost:1984/api/Items');
      setItems(response.data);
      setFilteredItems(response.data);
    } catch (err) {
      toast.error(`Ошибка загрузки лотов: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchItemFlowers = async (itemId) => {
    try {
      setFlowersLoading(true);
      const response = await axios.get(`https://localhost:1984/api/ItemFlowers?itemId=${itemId}`);
      setItemFlowers(response.data);
    } catch (err) {
      toast.error(`Ошибка загрузки содержимого: ${err.message}`);
    } finally {
      setFlowersLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredItems(items);
      return;
    }

    const filtered = items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredItems(filtered);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleShowContents = async (item) => {
    setSelectedItem(item);
    await fetchItemFlowers(item.id);
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await axios.delete(`https://localhost:1984/api/Items/${itemId}`);
      toast.success('Лот успешно удален');
      await fetchItems();
    } catch (err) {
      toast.error(`Ошибка удаления лота: ${err.message}`);
    }
  };

  const handleDeleteFlower = async (flowerId) => {
    try {
      if (!selectedItem) return;

      await axios.delete(
        `https://localhost:1984/api/ItemFlowers/${selectedItem.id}/flowers/${flowerId}`
      );

      toast.success('Цветок удален из лота');
      await fetchItemFlowers(selectedItem.id);

    } catch (err) {
      toast.error(`Ошибка удаления цветка: ${err.message}`);
    }
  };

  const openEditModal = (item) => {
    setCurrentItem({
      id: item.id,
      name: item.name,
      basePrice: item.basePrice
    });
    setShowEditModal(true);
  };

  const handleEditItem = async () => {
    try {
      await axios.put(`https://localhost:1984/api/Items/${currentItem.id}`, {
        id: currentItem.id,
        name: currentItem.name,
        basePrice: parseFloat(currentItem.basePrice)
      });
      toast.success('Лот успешно обновлен');
      setShowEditModal(false);
      await fetchItems();
    } catch (err) {
      toast.error(`Ошибка обновления лота: ${err.message}`);
    }
  };

  const closeModal = () => {
    setSelectedItem(null);
    setItemFlowers([]);
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка данных...</div>;
  }

  const fetchCostAnalysis = async (itemId) => {
    try {
      setAnalysisLoading(true);
      const response = await axios.get(`https://localhost:1984/api/Items/${itemId}/cost-analysis`);
      setCostAnalysis(response.data);
      setShowAnalysisModal(true);
    } catch (err) {
      toast.error(`Ошибка загрузки анализа: ${err.message}`);
    } finally {
      setAnalysisLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Лоты</h2>

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Поиск по названию лота..."
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

      <table className={styles.table}>
        <thead>
          <tr>
            {/* <th className={styles.header}>ID</th> */}
            <th className={styles.header}>Название</th>
            <th className={styles.header}>Цена</th>
            <th className={styles.header}>Коробка</th>
            <th className={styles.header}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <tr key={item.id} className={styles.row}>
                {/* <td className={styles.cell}>{item.id}</td> */}
                <td className={styles.cell}>{item.name}</td>
                <td className={styles.cell}>{item.basePrice}</td>
                <td className={styles.cell}>{item.box.name}</td>
                <td className={styles.cell}>
                  <div className={styles.actionButtons}>
                    <button
                      onClick={() => handleShowContents(item)}
                      className={styles.contentsButton}
                    >
                      Содержимое
                    </button>
                    <button
                      onClick={() => openEditModal(item)}
                      className={styles.editButton}
                    >
                      Изменить
                    </button>
                    <button
                      onClick={() => fetchCostAnalysis(item.id)}
                      className={styles.analysisButton}
                    >
                      Анализ выгоды
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
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
              <td colSpan="5" className={styles.noResults}>
                Лоты не найдены
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {selectedItem && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Содержимое лота: {selectedItem.name}</h3>
            <button
              onClick={closeModal}
              className={styles.closeButton}
            >
              ×
            </button>

            {flowersLoading ? (
              <div className={styles.loading}>Загрузка содержимого...</div>
            ) : (
              <table className={styles.contentsTable}>
                <thead>
                  <tr>
                    <th className={styles.header}>Цветок</th>
                    <th className={styles.header}>Количество</th>
                    <th className={styles.header}>Цена за единицу</th>
                    <th className={styles.header}>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {itemFlowers.length > 0 ? (
                    itemFlowers.map((item, index) => (
                      <tr key={index} className={styles.row}>
                        <td className={styles.cell}>{item.flower.name}</td>
                        <td className={styles.cell}>{item.quantity}</td>
                        <td className={styles.cell}>{item.flower.costPerUnit}</td>
                        <td className={styles.cell}>
                          <button
                            onClick={() => handleDeleteFlower(item.flower.id)}
                            className={styles.deleteButton}
                          >
                            Удалить
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className={styles.row}>
                      <td colSpan="4" className={styles.noResults}>
                        Лот пуст
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {showEditModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Редактировать лот</h3>
            <button
              onClick={() => setShowEditModal(false)}
              className={styles.closeButton}
            >
              ×
            </button>

            <div className={styles.formGroup}>
              <label>Название:</label>
              <input
                type="text"
                value={currentItem.name}
                onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Цена:</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={currentItem.basePrice}
                onChange={(e) => setCurrentItem({ ...currentItem, basePrice: e.target.value })}
                className={styles.input}
              />
            </div>

            <div className={styles.buttonGroup}>
              <button
                onClick={handleEditItem}
                className={styles.submitButton}
                disabled={!currentItem.name.trim()}
              >
                Сохранить
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className={styles.cancelButton}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {showAnalysisModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Анализ выгоды</h3>
            <button
              onClick={() => setShowAnalysisModal(false)}
              className={styles.closeButton}
            >
              ×
            </button>

            {analysisLoading ? (
              <div className={styles.loading}>Загрузка анализа...</div>
            ) : costAnalysis ? (
              <div className={styles.analysisContainer}>
                <div className={styles.analysisRow}>
                  <span>Базовая цена:</span>
                  <span>{costAnalysis.basePrice}</span>
                </div>
                <div className={styles.analysisRow}>
                  <span>Себестоимость:</span>
                  <span>{costAnalysis.totalComponentsCost}</span>
                </div>
                <div className={styles.analysisRow}>
                  <span>Цена всех компонентов:</span>
                  <span>{costAnalysis.ingredientsCost}</span>
                </div>
                <div className={styles.analysisRow}>
                  <span>Цена цветка:</span>
                  <span>{costAnalysis.flowersCost}</span>
                </div>
                <div className={styles.analysisRow}>
                  <span>Цена коробки:</span>
                  <span>{costAnalysis.boxCost}</span>
                </div>
                <div className={styles.analysisRow}>
                  <span>Цена Ингредиентов:</span>
                  <span>{costAnalysis.ingredientsCost}</span>
                </div>
                <div className={styles.analysisRow}>
                  <span>Стоимость рабочей силы:</span>
                  <span>{costAnalysis.laborCost}</span>
                </div>
                <div className={styles.analysisRow}>
                  <span>Маржа:</span>
                  <span>{costAnalysis.profitMargin.toFixed(2)}%</span>
                </div>
                <div className={`${styles.analysisRow} ${styles.profitRow}`}>
                  <span>Выгода:</span>
                  <span>{costAnalysis.profit.toFixed(2)}</span>
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

export default ItemTable;