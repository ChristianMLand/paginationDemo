import style from './pokeCard.module.css';

export default function PokeCard({ name, sprites, types }) {
    return (
        <li className={style.item}>
            <p>{name}</p>
            <img src={sprites?.front_default} alt={name} />
            <div className={style.types}>
            { types?.map(({ type }) => 
                <span 
                    key={type.name} 
                    className={`${style[type.name]} ${style.type}`}
                >{type.name}</span>)
            }
            </div>
        </li>
    )
}