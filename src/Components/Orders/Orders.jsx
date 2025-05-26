//import styles from './Orders.module.css'
import AddOrder from './AddOrder/AddOrder';
import OrdersTable from './OrdersTable.jsx/OrdersTable';

export default function Orders(){
    return(
        <>
            <AddOrder />
            <OrdersTable />
        </>
    );
}