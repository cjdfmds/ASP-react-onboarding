import { Route } from 'react-router-dom';

const Sales = () => {
  return (
    <div>
      {/* other routes */}
      <Route path="/sales" component={Sales} />
    </div>
  );
}

export default Sales;
export { Sales };