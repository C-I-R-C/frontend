import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';

const LowStockIngredients = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLowStockIngredients = async () => {
      try {
        const response = await axios.get('https://localhost:1984/api/Ingredients/low-stock?count=5');
        setIngredients(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLowStockIngredients();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ margin: '20px' }}>
        Ошибка при загрузке данных: {error}
      </Alert>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h5" gutterBottom sx={{ marginBottom: '20px', fontWeight: 'bold' }}>
        Ингредиенты которых мало:
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              {/* <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell> */}
              <TableCell sx={{ fontWeight: 'bold' }}>Название</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Количество</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ingredients.map((ingredient) => (
              <TableRow key={ingredient.id}>
                {/* <TableCell>{ingredient.id}</TableCell> */}
                <TableCell>{ingredient.name}</TableCell>
                <TableCell sx={{ color: ingredient.inStock < 10 ? 'red' : 'inherit' }}>
                  {ingredient.inStock}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default LowStockIngredients;