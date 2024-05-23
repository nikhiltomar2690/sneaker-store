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
      <img src={`${server}/${photo}`} alt={name} />
      <p>{name}</p>
      <span>₹{price}</span>

      <div>
        <button></button>
      </div>
    </div>
  );
};

export default ProductCard;
