// we have to declare the type of the props that we are going to receive in typescript

import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

// so that we can use it in the component
type CartItemProps = {
  // any allows us to pass any type of object
  cartItem: any;
};

const CartItem = ({ cartItem }: CartItemProps) => {
  const { photo, productId, name, price, quantity } = cartItem;

  return (
    <div className="cart-item">
      <img src={photo} alt={name} />
      <article>
        <Link to={`/product/${productId}`}>{name}</Link>
        <span>₹{price}</span>
      </article>
      <div>
        <button>-</button>
        <p>{quantity}</p>
        <button>+</button>
      </div>
      <button>
        <FaTrash />
      </button>
    </div>
  );
};

export default CartItem;
