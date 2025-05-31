"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import styles from './FlowerTabs.module.css';

export default function FlowersTabs() {
  const [flowers, setFlowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFlower, setSelectedFlower] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [ingredientsLoading, setIngredientsLoading] = useState(false);
  const [colors, setColors] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isIncrement, setIsIncrement] = useState(true);
  const [currentFlower, setCurrentFlower] = useState(null);
  const [newFlower, setNewFlower] = useState({
    name: '',
    inStock: 0,
    costPerUnit: 0,
    colorId: 1
  });

  useEffect(() => {
    fetchFlowers();
    fetchColors();
  }, []);

  const fetchFlowers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://localhost:1984/api/Flowers');
      setFlowers(response.data);
    } catch (err) {
      toast.error('Ошибка загрузки цветков', {
        description: err.message,
        action: {
          label: 'Повторить',
          onClick: () => fetchFlowers(),
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchColors = async () => {
    try {
      const response = await axios.get('https://localhost:1984/api/Colors');
      setColors(response.data);
    } catch (err) {
      toast.error('Ошибка загрузки цветов', {
        description: err.message,
      });
    }
  };

  const fetchIngredients = async (flowerId) => {
    try {
      setIngredientsLoading(true);
      const response = await axios.get(`https://localhost:1984/api/FlowerIngredients?flowerId=${flowerId}`);
      setIngredients(response.data);
    } catch (err) {
      toast.error('Ошибка загрузки состава', {
        description: err.message,
      });
    } finally {
      setIngredientsLoading(false);
    }
  };

  const handleShowDetails = async (flower) => {
    setSelectedFlower(flower);
    await fetchIngredients(flower.id);
  };

  const handleAddFlower = async () => {
    try {
      await axios.post('https://localhost:1984/api/Flowers', newFlower);
      setShowAddModal(false);
      setNewFlower({ name: '', inStock: 0, costPerUnit: 0, colorId: 1 });
      toast.success('Цветок успешно добавлен');
      await fetchFlowers();
    } catch (err) {
      toast.error('Ошибка добавления цветка', {
        description: err.message,
      });
    }
  };

  const handleUpdateQuantity = async (flowerId) => {
    try {
      await axios.patch(`https://localhost:1984/api/Flowers/${flowerId}/quantity`, {
        quantity: parseInt(quantity),
        isIncrement
      });
      toast.success('Количество успешно изменено');
      await fetchFlowers();
      setEditingId(null);
    } catch (err) {
      toast.error('Ошибка изменения количества', {
        description: err.message,
      });
    }
  };

  const handleEditFlower = async () => {
    try {
      await axios.put(`https://localhost:1984/api/Flowers/${currentFlower.id}`, {
        name: currentFlower.name,
        inStock: parseInt(currentFlower.inStock),
        costPerUnit: parseFloat(currentFlower.costPerUnit),
        colorId: parseInt(currentFlower.colorId)
      });
      setShowEditModal(false);
      toast.success('Цветок успешно изменен');
      await fetchFlowers();
    } catch (err) {
      toast.error('Ошибка редактирования цветка', {
        description: err.message,
      });
    }
  };

  const handleDelete = async (flowerId) => {
    try {
      await axios.delete(`https://localhost:1984/api/Flowers/${flowerId}`);
      toast.success('Цветок успешно удален');
      await fetchFlowers();
    } catch (err) {
      toast.error('Ошибка удаления цветка', {
        description: err.message,
      });
    }
  };

  const openEditModal = (flower) => {
    setCurrentFlower({
      ...flower,
      colorId: flower.color.id
    });
    setShowEditModal(true);
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка данных...</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Цветки (Зефиры)</h2>

      <div className={styles.controls}>
        <button
          onClick={() => setShowAddModal(true)}
          className={styles.addButton}
        >
          Добавить цветок
        </button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.header}>ID</th>
            <th className={styles.header}>Название</th>
            <th className={styles.header}>В наличии</th>
            <th className={styles.header}>Цена</th>
            <th className={styles.header}>Цвет</th>
            <th className={styles.header}>Изменить кол-во</th>
            <th className={styles.header}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {flowers.map(flower => (
            <tr key={flower.id} className={styles.row}>
              <td className={styles.cell}>{flower.id}</td>
              <td className={styles.cell}>{flower.name}</td>
              <td className={styles.cell}>{flower.inStock}</td>
              <td className={styles.cell}>{flower.costPerUnit}</td>
              <td className={styles.cell}>{flower.color.name}</td>
              <td className={styles.cell}>
                {editingId === flower.id ? (
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
                      onClick={() => handleUpdateQuantity(flower.id)}
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
                      setEditingId(flower.id);
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
                    onClick={() => handleShowDetails(flower)}
                    className={styles.detailsButton}
                  >
                    Подробнее
                  </button>
                  <button
                    onClick={() => openEditModal(flower)}
                    className={styles.editButton}
                  >
                    Изменить
                  </button>
                  <button
                    onClick={() => handleDelete(flower.id)}
                    className={styles.deleteButton}
                  >
                    Удалить
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedFlower && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Состав цветка: {selectedFlower.name}</h3>
            <button
              onClick={() => setSelectedFlower(null)}
              className={styles.closeButton}
            >
              ×
            </button>

            {selectedFlower && (
              <div className={styles.modalOverlay}>
                <div className={styles.modal}>
                  <h3>Состав цветка: {selectedFlower.name}</h3>
                  <button
                    onClick={() => setSelectedFlower(null)}
                    className={styles.closeButton}
                  >
                    ×
                  </button>

                  {ingredientsLoading ? (
                    <div className={styles.loading}>Загрузка состава...</div>
                  ) : (
                    <table className={styles.ingredientsTable}>
                      <thead>
                        <tr>
                          <th className={styles.header}>Ингредиент</th>
                          <th className={styles.header}>Количество</th>
                          <th className={styles.header}>Действия</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ingredients.map((item, index) => (
                          <tr key={index} className={styles.row}>
                            <td className={styles.cell}>{item.ingredient.name}</td>
                            <td className={styles.cell}>{item.quantityRequired}</td>
                            <td className={styles.cell}>
                              <button
                                onClick={async () => {
                                  try {
                                    await axios.delete(
                                      `https://localhost:1984/api/FlowerIngredients/${selectedFlower.id}/ingredients/${item.ingredient.id}`
                                    );
                                    toast.success('Ингредиент удален из рецепта');
                                    await fetchIngredients(selectedFlower.id);
                                  } catch (err) {
                                    toast.error('Ошибка удаления ингредиента', {
                                      description: err.message,
                                    });
                                  }
                                }}
                                className={styles.deleteButton}
                              >
                                Удалить
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showAddModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Добавить новый цветок</h3>
            <button
              onClick={() => setShowAddModal(false)}
              className={styles.closeButton}
            >
              ×
            </button>

            <div className={styles.modalInputGroup}>
              <label>Название:</label>
              <input
                type="text"
                value={newFlower.name}
                onChange={(e) => setNewFlower({ ...newFlower, name: e.target.value })}
                className={styles.modalInput}
              />
            </div>

            <div className={styles.modalInputGroup}>
              <label>Количество в наличии:</label>
              <input
                type="number"
                min="0"
                value={newFlower.inStock}
                onChange={(e) => setNewFlower({ ...newFlower, inStock: e.target.value })}
                className={styles.modalInput}
              />
            </div>

            <div className={styles.modalInputGroup}>
              <label>Цена:</label>
              <input
                type="number"
                min="0"
                step="1"
                value={newFlower.costPerUnit}
                onChange={(e) => setNewFlower({ ...newFlower, costPerUnit: e.target.value })}
                className={styles.modalInput}
              />
            </div>

            <div className={styles.modalInputGroup}>
              <label>Цвет:</label>
              <select
                value={newFlower.colorId}
                onChange={(e) => setNewFlower({ ...newFlower, colorId: e.target.value })}
                className={styles.modalInput}
              >
                {colors.map(color => (
                  <option key={color.id} value={color.id}>{color.name}</option>
                ))}
              </select>
            </div>

            <div className={styles.modalButtons}>
              <button
                onClick={handleAddFlower}
                className={styles.modalAddButton}
                disabled={!newFlower.name.trim()}
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

      {showEditModal && currentFlower && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Редактировать цветок</h3>
            <button
              onClick={() => setShowEditModal(false)}
              className={styles.closeButton}
            >
              ×
            </button>

            <div className={styles.modalInputGroup}>
              <label>Название:</label>
              <input
                type="text"
                value={currentFlower.name}
                onChange={(e) => setCurrentFlower({ ...currentFlower, name: e.target.value })}
                className={styles.modalInput}
              />
            </div>

            <div className={styles.modalInputGroup}>
              <label>Количество в наличии:</label>
              <input
                type="number"
                min="0"
                value={currentFlower.inStock}
                onChange={(e) => setCurrentFlower({ ...currentFlower, inStock: e.target.value })}
                className={styles.modalInput}
              />
            </div>

            <div className={styles.modalInputGroup}>
              <label>Цена:</label>
              <input
                type="number"
                min="0"
                step="1"
                value={currentFlower.costPerUnit}
                onChange={(e) => setCurrentFlower({ ...currentFlower, costPerUnit: e.target.value })}
                className={styles.modalInput}
              />
            </div>

            <div className={styles.modalInputGroup}>
              <label>Цвет:</label>
              <select
                value={currentFlower.colorId}
                onChange={(e) => setCurrentFlower({ ...currentFlower, colorId: e.target.value })}
                className={styles.modalInput}
              >
                {colors.map(color => (
                  <option key={color.id} value={color.id}>{color.name}</option>
                ))}
              </select>
            </div>

            <div className={styles.modalButtons}>
              <button
                onClick={handleEditFlower}
                className={styles.modalSaveButton}
                disabled={!currentFlower.name.trim()}
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

