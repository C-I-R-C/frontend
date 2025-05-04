import Button from '../Button/Button'


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
            <Button isActive = {active === 'section3'} onClick = {() => onChange('section3')}>Ингредиенты</Button>
        </section>

        <section>
            <Button isActive = {active === 'section4'} onClick = {() => onChange('section4')} >Корбки</Button>
        </section>
        
        </>
        

    )
}