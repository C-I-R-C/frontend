import Button from '../Button/Button'
import style from './text.module.css'

export default function TabSection({active, onChange}){
    return (
        <>
        <section>
            <Button isActive = {active === 'section1'} onClick = {() => onChange('section1')}>Главное</Button>
        </section>

        <section>
            <Button isActive = {active === 'section2'} onClick = {() => onChange('section2')}>Заказы</Button>
        </section>

        <section>
            <Button isActive = {active === 'section3'} onClick = {() => onChange('section3')}>Клиенты</Button>
        </section>
        
        <p className={style.text}>Инвентаризация:</p>

        <section>
            <Button isActive = {active === 'section4'} onClick = {() => onChange('section4')} >Ингредиенты</Button>
        </section>

        <section>
            <Button isActive = {active === 'section5'} onClick = {() => onChange('section5')} >Коробки</Button>
        </section>
        
        </>
    )
}