import style from './pokeCard.module.css';

const defaultSprite = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png";

export default function PokeCard({ name, sprites, types }) {
  return (
    <li className={style.item}>
      <p>{name}</p>
      <img src={sprites?.front_default ?? defaultSprite} alt={name} />
      <div className={style.types}>
        {types?.map(({ type }) =>
          <span
            key={type.name}
            className={`${style[type.name]} ${style.type}`}
          >{type.name}</span>)
        }
      </div>
    </li>
  )
}