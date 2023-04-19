import { Route } from 'react-router-dom';

const Customer = () => {
  return (
    <div>
      {/* other routes */}
      <Route path="/customers" component={Customer} />
    </div>
  );
}

export default Customer;
export { Customer };