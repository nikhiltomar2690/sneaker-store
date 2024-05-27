import { useState } from "react";
import ProductCard from "../components/ProductCard";

const Search = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const addToCartHandler = () => {};

  const isNextPage = page > 1;
  const isPrevPage = page < 4;

  return (
    <div className="product-search-page">
      <aside>
        <h2>Filters</h2>
        <div>
          <h4>Sort</h4>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">None</option>
            <option value="asc">Price(Low to High)</option>
            <option value="dsc">Price(High to Low)</option>
          </select>
        </div>

        <div>
          <h4>Max Price : {maxPrice || ""}</h4>
          <input
            type="range"
            min={100}
            max={100000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>

        <div>
          <h4>Category</h4>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All</option>
            <option value="asc">Sample1</option>
            <option value="dsc">Sample2</option>
          </select>
        </div>
      </aside>
      <main>
        <h1>Products</h1>
        <input
          type="text"
          placeholder="Search by name...."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="search-product-list">
          <ProductCard
            productId="134673grg"
            name="Sony Camera"
            price={12334}
            stock={2}
            handler={addToCartHandler}
            photo="https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1631631361-screenshot-2021-09-14-at-15-55-06-1631631314.png?crop=0.785xw:0.926xh;0.0994xw,0&resize=980:*"
          ></ProductCard>
        </div>
        <article>
          <button
            onClick={() => setPage((page) => page - 1)}
            disabled={!isPrevPage}
          >
            Prev
          </button>
          <span>{page} of 4</span>
          <button
            onClick={() => setPage((page) => page + 1)}
            disabled={!isNextPage}
          >
            Next
          </button>
        </article>
      </main>
    </div>
  );
};

export default Search;
