import { Route } from 'react-router-dom';

const Product = () => {
  return (
    <div>
      {/* other routes */}
      <Route path="/products" component={Product} />
    </div>
  );
}

export default Product;
export { Product };