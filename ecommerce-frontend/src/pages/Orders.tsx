import { Column } from "react-table";
import TableHOC from "../components/admin/TableHOC";
import { ReactElement, useState } from "react";
import { Link } from "react-router-dom";

type DataType = {
  _id: string;
  amount: number;
  quantity: number;
  discount: number;
  status: ReactElement;
  action: ReactElement;
};

const column: Column<DataType>[] = [
  { Header: "ID", accessor: "_id" },
  { Header: "Amount", accessor: "amount" },
  { Header: "Quantity", accessor: "quantity" },
  { Header: "Discount", accessor: "discount" },
  { Header: "Status", accessor: "status" },
  { Header: "Action", accessor: "action" },
];

const Orders = () => {
  const [rows, setRows] = useState<DataType[]>([
    {
      _id: "1jk43b6ikb34j6kb34k6b3",
      amount: 100,
      quantity: 2,
      discount: 10,
      status: <span className="red">Processing</span>,
      action: <Link to={`/order/1`}>View</Link>,
    },
  ]);

  const Table = TableHOC<DataType>(
    column,
    rows,
    "dashboard-product-box",
    "Orders",
    rows.length > 6
  )();

  return (
    <div className="container">
      <h1>My Ordes</h1>
      {Table}
    </div>
  );
};

export default Orders;
