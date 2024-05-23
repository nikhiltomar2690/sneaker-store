import { FaPlus } from "react-icons/fa";

type ProductProps = {
  name: string;
  productId: string;
  photo: string;
  price: number;
  stock: number;
  handler: () => void;
};

const server = "124fdgghas";

const ProductCard = ({
  productId,
  name,
  price,
  stock,
  photo,
  handler,
}: ProductProps) => {
  return (
    <div className="productcard">
      <img
        src="https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1631631361-screenshot-2021-09-14-at-15-55-06-1631631314.png?crop=0.785xw:0.926xh;0.0994xw,0&resize=980:*"
        alt={name}
      />
      <p>{name}</p>
      <span>₹{price}</span>

      <div>
        <button onClick={() => handler()}>
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
