import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Boxes.module.css';

function BoxesTable() {
  const [boxes, setBoxes] = useState([]);
  const [filteredBoxes, setFilteredBoxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isIncrement, setIsIncrement] = useState(true);
  const [currentBox, setCurrentBox] = useState(null);
  const [newBox, setNewBox] = useState({
    name: '',
    inStock: 0,
    costPerUnit: 0
  });

  useEffect(() => {
    fetchBoxes();
  }, []);

  const fetchBoxes = async () => {
    try {
      const response = await axios.get('https://localhost:1984/api/Boxes');
      setBoxes(response.data);
      setFilteredBoxes(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBox = async () => {
    try {
      await axios.post('https://localhost:1984/api/Boxes', {
        name: newBox.name,
        inStock: parseInt(newBox.inStock),
        costPerUnit: parseFloat(newBox.costPerUnit)
      });
      setShowAddModal(false);
      setNewBox({ name: '', inStock: 0, costPerUnit: 0 });
      await fetchBoxes();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateStock = async (id) => {
    try {
      await axios.patch(`https://localhost:1984/api/Boxes/${id}/stock`, {
        quantity: parseInt(quantity),
        isIncrement
      });
      await fetchBoxes();
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditBox = async () => {
    try {
      await axios.put(`https://localhost:1984/api/Boxes/${currentBox.id}`, {
        id: currentBox.id,
        name: currentBox.name,
        inStock: parseInt(currentBox.inStock),
        costPerUnit: parseFloat(currentBox.costPerUnit)
      });
      setShowEditModal(false);
      await fetchBoxes();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://localhost:1984/api/Boxes/${id}`);
      await fetchBoxes();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredBoxes(boxes);
      return;
    }

    const filtered = boxes.filter(box =>
      box.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      box.id.toString().includes(searchTerm) ||
      box.inStock.toString().includes(searchTerm) ||
      box.costPerUnit.toString().includes(searchTerm)
    );

    setFilteredBoxes(filtered);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const openEditModal = (box) => {
    setCurrentBox({...box});
    setShowEditModal(true);
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (error) {
    return <div className={styles.error}>Ошибка: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Коробки</h2>
      
      <div className={styles.controls}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Поиск по названию, ID или количеству..."
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
          Добавить коробку
        </button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.header}>ID</th>
            <th className={styles.header}>Название</th>
            <th className={styles.header}>В наличии</th>
            <th className={styles.header}>Цена за единицу</th>
            <th className={styles.header}>Изменить количество</th>
            <th className={styles.header}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {filteredBoxes.length > 0 ? (
            filteredBoxes.map((box) => (
              <tr key={box.id} className={styles.row}>
                <td className={styles.cell}>{box.id}</td>
                <td className={styles.cell}>{box.name}</td>
                <td className={styles.cell}>{box.inStock}</td>
                <td className={styles.cell}>{box.costPerUnit}</td>
                <td className={styles.cell}>
                  {editingId === box.id ? (
                    <div className={styles.stockControl}>
                      <select
                        value={isIncrement}
                        onChange={(e) => setIsIncrement(e.target.value === 'true')}
                        className={styles.stockSelect}
                      >
                        <option value="true">+ Добавить</option>
                        <option value="false">- Вычесть</option>
                      </select>
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className={styles.stockInput}
                      />
                      <button
                        onClick={() => handleUpdateStock(box.id)}
                        className={styles.stockButton}
                      >
                        Применить
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className={styles.cancelButton}
                      >
                        Отмена
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingId(box.id);
                        setQuantity(1);
                        setIsIncrement(true);
                      }}
                      className={styles.editStockButton}
                    >
                      Изменить кол-во
                    </button>
                  )}
                </td>
                <td className={styles.cell}>
                  <div className={styles.actionButtons}>
                    <button
                      onClick={() => openEditModal(box)}
                      className={styles.editButton}
                    >
                      Изменить
                    </button>
                    <button
                      onClick={() => handleDelete(box.id)}
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
              <td colSpan="6" className={styles.noResults}>
                Ничего не найдено
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Модальное окно добавления */}
      {showAddModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Добавить новую коробку</h3>
            
            <div className={styles.modalInputGroup}>
              <label>Название:</label>
              <input
                type="text"
                value={newBox.name}
                onChange={(e) => setNewBox({...newBox, name: e.target.value})}
                className={styles.modalInput}
              />
            </div>
            
            <div className={styles.modalInputGroup}>
              <label>Количество в наличии:</label>
              <input
                type="number"
                min="0"
                value={newBox.inStock}
                onChange={(e) => setNewBox({...newBox, inStock: e.target.value})}
                className={styles.modalInput}
              />
            </div>

            <div className={styles.modalInputGroup}>
              <label>Цена за единицу:</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={newBox.costPerUnit}
                onChange={(e) => setNewBox({...newBox, costPerUnit: e.target.value})}
                className={styles.modalInput}
              />
            </div>
            
            <div className={styles.modalButtons}>
              <button
                onClick={handleAddBox}
                className={styles.modalAddButton}
                disabled={!newBox.name.trim()}
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

      {/* Модальное окно редактирования */}
      {showEditModal && currentBox && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Редактировать коробку</h3>
            
            <div className={styles.modalInputGroup}>
              <label>Название:</label>
              <input
                type="text"
                value={currentBox.name}
                onChange={(e) => setCurrentBox({...currentBox, name: e.target.value})}
                className={styles.modalInput}
              />
            </div>
            
            <div className={styles.modalInputGroup}>
              <label>Количество в наличии:</label>
              <input
                type="number"
                min="0"
                value={currentBox.inStock}
                onChange={(e) => setCurrentBox({...currentBox, inStock: e.target.value})}
                className={styles.modalInput}
              />
            </div>

            <div className={styles.modalInputGroup}>
              <label>Цена за единицу:</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={currentBox.costPerUnit}
                onChange={(e) => setCurrentBox({...currentBox, costPerUnit: e.target.value})}
                className={styles.modalInput}
              />
            </div>
            
            <div className={styles.modalButtons}>
              <button
                onClick={handleEditBox}
                className={styles.modalSaveButton}
                disabled={!currentBox.name.trim()}
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

export default BoxesTable;