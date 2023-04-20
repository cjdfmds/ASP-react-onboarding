import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import { Home } from "./components/Home";
import Customer from "./components/Customer";
import Product from "./components/Product";
import Sales from "./components/Sales";
import Store from "./components/Store";

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: '/counter',
    element: <Counter />
  },
  {
    path: '/fetch-data',
    element: <FetchData />
  },
  {
    path: '/customers',
    element: <Customer />
  },
  {
    path: '/products',
    element: <Product />
  },
  {
    path: '/sales',
    element: <Sales />
  },
  {
    path: '/stores',
    element: <Store />
  }
];

export default AppRoutes;
