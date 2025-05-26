import styles from './Items.module.css'

import AddItem from "./AddItem/AddItem";
import ItemDescription from "./ItemDescription/ItemDescription";
import ItemTable from "./ItemTable/ItemTable";

export default function Items(){

    return(
        <>
        <div className={styles.b1} >
            <AddItem />
        </div>
        
        <div className={styles.b2} >
            <ItemDescription />
        </div>
        
        <ItemTable />
        </>
    );
}