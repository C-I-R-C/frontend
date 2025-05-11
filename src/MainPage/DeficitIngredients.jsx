import style from'./DeficitIngredients.module.css'

export default function DITable () {
    return(
        <div className={style.alltab} >
            <h2>Ингредиенты которых мало:</h2>

            <table >
                <tr>
                    <th>Продукт</th>
                    <th>Количество</th>
                </tr>

                <tr>
                    <td>Щавель</td>
                    <td>Мало</td>
                </tr>

                <tr>
                    <td>Сливки</td>
                    <td>Тоже немного</td>
                </tr>
            </table>
        </div>
    );
}