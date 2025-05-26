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

const UrgentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUrgentOrders = async () => {
      try {
        const response = await axios.get('https://localhost:5001/api/Orders/urgent?count=5');
        setOrders(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUrgentOrders();
  }, []);

  const formatTimeUntilDue = (timeString) => {
    if (!timeString) return '-';

    // Split the time string by '.' to separate days from the rest
    const [daysPart, timePart] = timeString.split('.');

    // Extract days from the days part
    const days = parseInt(daysPart);

    // Split the time part by ':' to extract hours and minutes
    const [hours, minutes] = timePart.split(':');

    // Construct the formatted string
    return `${days} дней ${hours} часов ${minutes} минут`;
  };


  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return dateString.split('T')[0];
  };

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
        Ближайшие заказы:
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Клиент</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Времени до выдачи</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Дата выдачи</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Цена</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.orderId}>
                <TableCell>{order.orderId}</TableCell>
                <TableCell>{order.clientName}</TableCell>
                <TableCell>{formatTimeUntilDue(order.timeUntilDue || '')}</TableCell>
                <TableCell>{formatDate(order.completionDate)}</TableCell>
                <TableCell>{order.totalPrice}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UrgentOrders;

