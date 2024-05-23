import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const addToCartHandler = () => {};

  return (
    <div className="home">
      <section></section>
      <h1>
        Latest Products
        <Link to="/search" className="findmore">
          More
        </Link>
      </h1>

      <main>
        <ProductCard
          productId="134673grg"
          name="Sony Camera"
          price={12334}
          stock={2}
          handler={addToCartHandler}
          photo="https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1631631361-screenshot-2021-09-14-at-15-55-06-1631631314.png?crop=0.785xw:0.926xh;0.0994xw,0&resize=980:*"
        ></ProductCard>
      </main>
    </div>
  );
};

export default Home;
