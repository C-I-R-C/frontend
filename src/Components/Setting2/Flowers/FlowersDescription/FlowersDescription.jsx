import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import styles from './FlowersDescription.module.css';

function FlowerDescription() {
  const [showModal, setShowModal] = useState(false);
  const [flowers, setFlowers] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState({
    flowers: false,
    ingredients: false,
    submitting: false
  });

  const [selectedFlower, setSelectedFlower] = useState(null);
  const [recipeItems, setRecipeItems] = useState([
    { ingredientId: '', quantityRequired: 0 }
  ]);

  useEffect(() => {
    if (showModal) {
      fetchFlowers();
      fetchIngredients();
    }
  }, [showModal]);

  const fetchFlowers = async () => {
    try {
      setLoading(prev => ({ ...prev, flowers: true }));
      const response = await axios.get('https://localhost:1984/api/Flowers');
      setFlowers(response.data);
    } catch (err) {
      toast.error(`Ошибка загрузки цветов: ${err.message}`);
    } finally {
      setLoading(prev => ({ ...prev, flowers: false }));
    }
  };

  const fetchIngredients = async () => {
    try {
      setLoading(prev => ({ ...prev, ingredients: true }));
      const response = await axios.get('https://localhost:1984/api/Ingredients');
      setIngredients(response.data);
    } catch (err) {
      toast.error(`Ошибка загрузки ингредиентов: ${err.message}`);
    } finally {
      setLoading(prev => ({ ...prev, ingredients: false }));
    }
  };

  const handleAddRecipeItem = () => {
    setRecipeItems([...recipeItems, { ingredientId: '', quantityRequired: 0 }]);
  };

  const handleRemoveRecipeItem = (index) => {
    if (recipeItems.length > 1) {
      const newItems = [...recipeItems];
      newItems.splice(index, 1);
      setRecipeItems(newItems);
    }
  };

  const handleRecipeItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...recipeItems];
    newItems[index] = {
      ...newItems[index],
      [name]: value
    };
    setRecipeItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFlower) {
      toast.error('Выберите цветок');
      return;
    }

    // try {
    //   setLoading(prev => ({...prev, submitting: true}));

    //   // Отправляем все ингредиенты для выбранного цветка
    //   const requests = recipeItems.map(item => 
    //     axios.post(
    //       `https://localhost:5001/api/FlowerIngredients?flowerId=${selectedFlower}`,
    //       {
    //         ingredientId: parseInt(item.ingredientId),
    //         quantityRequired: parseFloat(item.quantityRequired)
    //       }
    //     )
    //   );

    //   await Promise.all(requests);

    //   toast.success('Рецепт успешно сохранен');
    //   setShowModal(false);
    //   setSelectedFlower(null);
    //   setRecipeItems([{ ingredientId: '', quantityRequired: 0 }]);

    // } catch (err) {
    //   toast.error(err.response?.data?.message || err.message);
    // } finally {
    //   setLoading(prev => ({...prev, submitting: false}));
    // }

    try {
      setLoading(prev => ({ ...prev, submitting: true }));

      // Отправляем все ингредиенты для выбранного цветка
      const requests = recipeItems.map(item =>
        axios.post(
          `https://localhost:1984/api/FlowerIngredients?flowerId=${selectedFlower}`,
          {
            ingredientId: parseInt(item.ingredientId),
            quantityRequired: parseFloat(item.quantityRequired)
          }
        )
      );

      // Добавляем задержку 3000 мс перед выполнением запросов
      await new Promise(resolve => setTimeout(resolve, 3000));
      await Promise.all(requests);

      toast.success('Рецепт успешно сохранен');
      setShowModal(false);
      setSelectedFlower(null);
      setRecipeItems([{ ingredientId: '', quantityRequired: 0 }]);

    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(prev => ({ ...prev, submitting: false }));
    }

  };

  return (
    <div className={styles.container}>
      <button
        onClick={() => setShowModal(true)}
        className={styles.addButton}
      >
        Описать рецепт
      </button>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Описание рецепта цветка</h2>

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Цветок:</label>
                {loading.flowers ? (
                  <div>Загрузка списка цветов...</div>
                ) : (
                  <select
                    value={selectedFlower || ''}
                    onChange={(e) => setSelectedFlower(e.target.value)}
                    required
                  >
                    <option value="">Выберите цветок</option>
                    {flowers.map(flower => (
                      <option key={flower.id} value={flower.id}>
                        {flower.name} ({flower.color.name})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className={styles.ingredientsList}>
                <h3>Ингредиенты:</h3>
                {recipeItems.map((item, index) => (
                  <div key={index} className={styles.ingredientItem}>
                    <div className={styles.formGroup}>
                      <label>Ингредиент:</label>
                      {loading.ingredients ? (
                        <div>Загрузка списка ингредиентов...</div>
                      ) : (
                        <select
                          name="ingredientId"
                          value={item.ingredientId}
                          onChange={(e) => handleRecipeItemChange(index, e)}
                          required
                        >
                          <option value="">Выберите ингредиент</option>
                          {ingredients.map(ingredient => (
                            <option key={ingredient.id} value={ingredient.id}>
                              {ingredient.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label>Количество (шт):</label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        name="quantityRequired"
                        value={item.quantityRequired}
                        onChange={(e) => handleRecipeItemChange(index, e)}
                        required
                      />
                    </div>

                    {recipeItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRecipeItem(index)}
                        className={styles.removeButton}
                      >
                        Удалить
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddRecipeItem}
                  className={styles.addIngredientButton}
                >
                  + Добавить еще ингредиент
                </button>
              </div>

              <div className={styles.buttonGroup}>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={loading.submitting}
                >
                  {loading.submitting ? 'Отправка...' : 'Сохранить рецепт'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedFlower(null);
                    setRecipeItems([{ ingredientId: '', quantityRequired: 0 }]);
                  }}
                  className={styles.cancelButton}
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default FlowerDescription;