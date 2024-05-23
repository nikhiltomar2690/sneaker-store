import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import CartItem from "../components/CartItem";
import { Link } from "react-router-dom";

const cartItems = [
  {
    productId: "ewet4wyw",
    photo:
      "https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1631631361-screenshot-2021-09-14-at-15-55-06-1631631314.png?crop=0.785xw:0.926xh;0.0994xw,0&resize=980:*",
    name: "Nike Sneakers",
    price: 3000,
    quantity: 40,
    stock: 10,
  },
];
const subtotal = 4000;
const tax = Math.round(subtotal * 0.18);
const shippingCharges = 200;
const total = subtotal + tax + shippingCharges;
const discount = 400;

const Cart = () => {
  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (Math.random() > 0.5) {
        setIsValidCouponCode(true);
      } else setIsValidCouponCode(false);
    }, 1000);

    // for a given coupon code check it is changed
    // if changed, then clear the existing async timeout call
    // so that a new timer can start and also make the state to false
    // because we are not sure that the new coupon code is valid or not
    return () => {
      clearTimeout(timeoutId);
      setIsValidCouponCode(false);
    };
  }, [couponCode]);

  return (
    <div className="cart">
      <main>
        {cartItems.length > 0 ? (
          cartItems.map((item, idx) => <CartItem key={idx} cartItem={item} />)
        ) : (
          <h1>No Items Added</h1>
        )}
      </main>
      <aside>
        <p>SubTotal: ₹{subtotal}</p>
        <p>Shipping Charges: ₹{shippingCharges}</p>
        <p>Tax: ₹{tax}</p>
        <p>
          Discount: <em className="red"> - ₹{discount}</em>
        </p>
        <p>
          <b>Total : ₹{total}</b>
        </p>
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="Enter Coupon Code"
        ></input>

        {
          // Check if the coupon code is valid
          couponCode &&
            (isValidCouponCode ? (
              <span className="green">
                ₹{discount} off using the <code>{couponCode}</code>
              </span>
            ) : (
              <span className="red">
                Invalid Coupon <VscError />{" "}
              </span>
            ))
        }
        {cartItems.length > 0 && (
          <Link to="/shipping">Proceed to Checkout</Link>
        )}
      </aside>
    </div>
  );
};

export default Cart;
