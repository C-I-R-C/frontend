import LowStockIngredients from "./LowInStockIngredients/Table";
import UrgentOrders from "./UrgentOrder/UrgentOrder";
import { Box } from '@mui/material';

export default function MainPage() {
    return (
        <Box sx={{
            display: 'grid',
            gap: 3, // Отступ между таблицами
            padding: 3,
            maxWidth: '1800px',
            margin: '0 auto'
        }}>
            <Box sx={{
                gridColumn: { xs: '1', md: '1' }
            }}>
                <UrgentOrders />
            </Box>
            <Box sx={{
                gridColumn: { xs: '1', md: '2' }
            }}>
                <LowStockIngredients />
            </Box>
        </Box>
    );
}