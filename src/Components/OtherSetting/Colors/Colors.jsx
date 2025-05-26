import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Colors.module.css';

function ColorsTable() {
  const [colors, setColors] = useState([]);
  const [filteredColors, setFilteredColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentColor, setCurrentColor] = useState(null);
  const [newColor, setNewColor] = useState({
    name: '',
    isNatural: true
  });

  useEffect(() => {
    fetchColors();
  }, []);

  const fetchColors = async () => {
    try {
      const response = await axios.get('https://localhost:5001/api/Colors');
      setColors(response.data);
      setFilteredColors(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddColor = async () => {
    try {
      await axios.post('https://localhost:5001/api/Colors', newColor);
      setShowAddModal(false);
      setNewColor({ name: '', isNatural: true });
      await fetchColors();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditColor = async () => {
    try {
      await axios.put(`https://localhost:5001/api/Colors/${currentColor.id}`, {
        id: currentColor.id,
        name: currentColor.name,
        isNatural: currentColor.isNatural
      });
      setShowEditModal(false);
      await fetchColors();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://localhost:5001/api/Colors/${id}`);
      await fetchColors();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredColors(colors);
      return;
    }

    const filtered = colors.filter(color =>
      color.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      color.id.toString().includes(searchTerm)
    );

    setFilteredColors(filtered);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const openEditModal = (color) => {
    setCurrentColor({...color});
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
      <h2 className={styles.title}>Красители</h2>
      
      <div className={styles.controls}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Поиск по названию или ID..."
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
          Добавить краситель
        </button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.header}>ID</th>
            <th className={styles.header}>Название</th>
            <th className={styles.header}>Натурально</th>
            <th className={styles.header}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {filteredColors.length > 0 ? (
            filteredColors.map((color) => (
              <tr key={color.id} className={styles.row}>
                <td className={styles.cell}>{color.id}</td>
                <td className={styles.cell}>{color.name}</td>
                <td className={styles.cell}>{color.isNatural ? 'Да' : 'Нет'}</td>
                <td className={styles.cell}>
                  <div className={styles.actionButtons}>
                    <button
                      onClick={() => openEditModal(color)}
                      className={styles.editButton}
                    >
                      Изменить
                    </button>
                    <button
                      onClick={() => handleDelete(color.id)}
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
              <td colSpan="4" className={styles.noResults}>
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
            <h3>Добавить новый краситель</h3>
            
            <div className={styles.modalInputGroup}>
              <label>Название:</label>
              <input
                type="text"
                value={newColor.name}
                onChange={(e) => setNewColor({...newColor, name: e.target.value})}
                className={styles.modalInput}
              />
            </div>
            
            <div className={styles.modalInputGroup}>
              <label>Натуральный:</label>
              <button
                onClick={() => setNewColor({...newColor, isNatural: !newColor.isNatural})}
                className={`${styles.toggleButton} ${newColor.isNatural ? styles.active : ''}`}
              >
                {newColor.isNatural ? 'Да' : 'Нет'}
              </button>
            </div>
            
            <div className={styles.modalButtons}>
              <button
                onClick={handleAddColor}
                className={styles.modalAddButton}
                disabled={!newColor.name.trim()}
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
      {showEditModal && currentColor && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Редактировать краситель</h3>
            
            <div className={styles.modalInputGroup}>
              <label>Название:</label>
              <input
                type="text"
                value={currentColor.name}
                onChange={(e) => setCurrentColor({...currentColor, name: e.target.value})}
                className={styles.modalInput}
              />
            </div>
            
            <div className={styles.modalInputGroup}>
              <label>Натуральный:</label>
              <button
                onClick={() => setCurrentColor({...currentColor, isNatural: !currentColor.isNatural})}
                className={`${styles.toggleButton} ${currentColor.isNatural ? styles.active : ''}`}
              >
                {currentColor.isNatural ? 'Да' : 'Нет'}
              </button>
            </div>
            
            <div className={styles.modalButtons}>
              <button
                onClick={handleEditColor}
                className={styles.modalSaveButton}
                disabled={!currentColor.name.trim()}
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

export default ColorsTable;