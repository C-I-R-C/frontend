import classes from './Button.module.css'

export default function Button({children, isActive, onClick }){

    return(


        <button isActive = {isActive} onClick={onClick} className= {classes.button}>
        {children}
        </button>

    )

}