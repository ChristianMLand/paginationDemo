import style from './paginator.module.css';

export default function PokeCard({ name, sprites, types }) {
    return (
        <li className={style.item} key={name}>
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