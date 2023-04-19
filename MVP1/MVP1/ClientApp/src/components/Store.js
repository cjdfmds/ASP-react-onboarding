import { Route } from 'react-router-dom';

const Store = () => {
  return (
    <div>
      {/* other routes */}
      <Route path="/stores" component={Store} />
    </div>
  );
}

export default Store;
export { Store };