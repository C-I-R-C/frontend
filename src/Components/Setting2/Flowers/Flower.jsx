import FlowerDescription from "./FlowersDescription/FlowersDescription";
import FlowersTabs from "./FlowerTabs/FlowerTabs";
import styles from "./Flower.module.css"

export default function Flower() {

    return (
        <>
        {/* <div className={styles.b1}>
            <AddFlower />
        </div> */}
            
         <div  className={styles.b2}>
            <FlowerDescription />
        </div>

        <FlowersTabs />
            
        </>
    );
}