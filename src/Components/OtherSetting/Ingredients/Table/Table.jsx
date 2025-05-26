import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Table.module.css';
import styles1 from './Ingredients.module.css';

function IngredientForm({ onIngredientAdded }) {
  const [isOpen, setIsOpen] = useState(false); 

  return (
    <div>
      <button 
        onClick={() => setIsOpen(true)}
        className={styles1.addButton}
      >
        +Добавить
      </button>
      
      {isOpen && (
        <IngredientAddModal 
          onClose={() => setIsOpen(false)} 
          onSuccess={() => {
            setIsOpen(false);
            onIngredientAdded();
          }}
        />
      )}
    </div>
  );
};

const IngredientAddModal = ({ onClose, onSuccess }) => {
  const [ingredient, setIngredient] = useState({
    name: '',
    inStock: '',
    costPerUnit: ''
  });

  const [errors, setErrors] = useState({
    inStock: '',
    costPerUnit: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIngredient(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateFields = () => {
    const newErrors = {};
    let isValid = true;

    if (!ingredient.inStock.trim()) {
      newErrors.inStock = 'Введите количество';
      isValid = false;
    } else if (isNaN(ingredient.inStock) || Number(ingredient.inStock) < 0) {
      newErrors.inStock = 'Введите положительное число';
      isValid = false;
    }

    if (!ingredient.costPerUnit.trim()) {
      newErrors.costPerUnit = 'Введите цену';
      isValid = false;
    } else if (isNaN(ingredient.costPerUnit)) {
      newErrors.costPerUnit = 'Введите число';
      isValid = false;
    } else if (Number(ingredient.costPerUnit) <= 0) {
      newErrors.costPerUnit = 'Цена должна быть больше 0';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateFields()) return;

    setIsLoading(true);

    try {
      const payload = {
        name: ingredient.name,
        inStock: Number(ingredient.inStock),
        costPerUnit: Number(ingredient.costPerUnit)
      };

      await axios.post('http://localhost:5000/api/Ingredients', payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      onSuccess();
    } catch (error) {
      console.error('Ошибка отправки:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles1.modalOverlay}>
      <div className={styles1.modalContent}>
        <button className={styles1.closeButton} onClick={onClose}>×</button>
        
        <h2 className={styles1.formTitle}>Добавить ингредиент</h2>
        <form onSubmit={handleSubmit} className={styles1.ingredientForm}>
          <div className={styles1.formGroup}>
            <label className={styles1.formLabel}>Название ингредиента:</label>
            <input
              type="text"
              name="name"
              value={ingredient.name}
              onChange={handleChange}
              required
              className={styles1.formInput}
            />
          </div>

          <div className={styles1.formGroup}>
            <label className={styles1.formLabel}>Количество:</label>
            <input
              type="text"
              name="inStock"
              value={ingredient.inStock}
              onChange={handleChange}
              placeholder="Введите количество"
              className={styles1.formInput}
            />
            {errors.inStock && <span className={styles1.errorText}>{errors.inStock}</span>}
          </div>

          <div className={styles1.formGroup}>
            <label className={styles1.formLabel}>Цена за единицу:</label>
            <input
              type="text"
              name="costPerUnit"
              value={ingredient.costPerUnit}
              onChange={handleChange}
              placeholder="Введите цену"
              className={styles1.formInput}
            />
            {errors.costPerUnit && <span className={styles1.errorText}>{errors.costPerUnit}</span>}
          </div>

          <div className={styles1.buttonGroup}>
            <button 
              type="button"
              onClick={onClose}
              className={styles1.cancelButton}
            >
              Отмена
            </button>
            <button 
              type="submit" 
              disabled={isLoading}
              className={styles1.submitButton}
            >
              {isLoading ? 'Отправка...' : 'Добавить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

function IngredientsTable() {
  const [ingredients, setIngredients] = useState([]);
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isIncrement, setIsIncrement] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentIngredient, setCurrentIngredient] = useState(null);

  const fetchIngredients = async () => {
    try {
      const response = await axios.get('https://localhost:5001/api/Ingredients');
      setIngredients(response.data);
      setFilteredIngredients(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  const handleUpdateStock = async (id) => {
    try {
      await axios.patch(`https://localhost:5001/api/Ingredients/${id}/stock`, {
        quantity: parseInt(quantity),
        isIncrement
      });
      await fetchIngredients();
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditIngredient = async () => {
    try {
      await axios.put(`https://localhost:5001/api/Ingredients/${currentIngredient.id}`, {
        id: currentIngredient.id,
        name: currentIngredient.name,
        inStock: currentIngredient.inStock,
        costPerUnit: parseFloat(currentIngredient.costPerUnit)
      });
      setShowEditModal(false);
      await fetchIngredients();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://localhost:5001/api/Ingredients/${id}`);
      await fetchIngredients();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredIngredients(ingredients);
      return;
    }

    const filtered = ingredients.filter(ingredient =>
      ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ingredient.id.toString().includes(searchTerm) ||
      ingredient.inStock.toString().includes(searchTerm) ||
      ingredient.costPerUnit.toString().includes(searchTerm)
    );

    setFilteredIngredients(filtered);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const openEditModal = (ingredient) => {
    setCurrentIngredient({...ingredient});
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
      <h2 className={styles.title}>Ингредиенты</h2>

      <div className={styles.controls}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Поиск..."
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

        <IngredientForm onIngredientAdded={fetchIngredients} />
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.header}>ID</th>
            <th className={styles.header}>Название</th>
            <th className={styles.header}>Наличие</th>
            <th className={styles.header}>Цена за единицу</th>
            <th className={styles.header}>Изменить количество</th>
            <th className={styles.header}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {filteredIngredients.length > 0 ? (
            filteredIngredients.map((ingredient) => (
              <tr key={ingredient.id} className={styles.row}>
                <td className={styles.cell}>{ingredient.id}</td>
                <td className={styles.cell}>{ingredient.name}</td>
                <td className={styles.cell}>{ingredient.inStock}</td>
                <td className={styles.cell}>{ingredient.costPerUnit}</td>
                <td className={styles.cell}>
                  {editingId === ingredient.id ? (
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
                        onClick={() => handleUpdateStock(ingredient.id)}
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
                        setEditingId(ingredient.id);
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
                      onClick={() => openEditModal(ingredient)}
                      className={styles.editButton}
                    >
                      Изменить
                    </button>
                    <button
                      onClick={() => handleDelete(ingredient.id)}
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

      {showEditModal && currentIngredient && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Редактировать ингредиент</h3>

            <div className={styles.modalInputGroup}>
              <label>Название:</label>
              <input
                type="text"
                value={currentIngredient.name}
                onChange={(e) => setCurrentIngredient({...currentIngredient, name: e.target.value})}
                className={styles.modalInput}
              />
            </div>

            <div className={styles.modalInputGroup}>
              <label>Цена за единицу:</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={currentIngredient.costPerUnit}
                onChange={(e) => setCurrentIngredient({...currentIngredient, costPerUnit: e.target.value})}
                className={styles.modalInput}
              />
            </div>

            <div className={styles.modalButtons}>
              <button
                onClick={handleEditIngredient}
                className={styles.modalSaveButton}
                disabled={!currentIngredient.name.trim()}
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

export { IngredientsTable, IngredientForm };