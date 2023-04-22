import React, { Component } from 'react';
import { Pagination, Button, Modal, Form } from 'semantic-ui-react';
import axios from 'axios';


export default class Customer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      name: '',
      address: '',
      customers: []
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.loadCustomers = this.loadCustomers.bind(this);

  }

  componentDidMount() {
   
    // Load customers from backend API on component mount
    this.loadCustomers();
  }

  loadCustomers() {
    // Make HTTP GET request to backend API to get all customers
    axios.get('https://localhost:7236/api/customers')
      .then(response => {
        const customers = response.data;
        this.setState({ customers: customers });
      })
      
      .catch(error => {
        console.log(error);
        // displays error
        
      });
  }
  

  handleNameChange(event) {
    this.setState({ name: event.target.value });
  }

  handleAddressChange(event) {
    this.setState({ address: event.target.value });
  }

  handleCreate() {
    const { name, address } = this.state;
  
    // Make HTTP POST request to backend API to add new customer
    axios.post('https://localhost:7236/api/customers', {
      Name: name,
      Address: address
    })
      .then(response => {
        // Close modal
        this.setState({ showModal: false });
        // Reload customers from backend API
        this.loadCustomers();
      })
      .catch(error => {
        console.log(error);
        const errorMessage = error.response && error.response.data && error.response.data.message ?
          error.response.data.message :
          'An error occurred while adding the new customer.';
        this.setState({ error: errorMessage });
      });
  }
  handleCancel() {
    this.setState({ showModal: false });
  }

  render() {
    const { showModal, name, address, customers } = this.state;

    return (
      <div>
        <h1>Customer</h1>

        {/* New Customer Button */}
        <Button color="blue" onClick={() => this.setState({ showModal: true })}>
          New Customer
        </Button>

        {/* Table */}
        <table className="ui celled striped table">
          <thead className="custom-thead bold">
            <tr>
              <th>Name</th>
              <th>Address</th>              
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.id}>
                <td data-label="Name">{customer.name}</td>
                <td data-label="Address">{customer.address}</td>                
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {/* Replace totalPages with the actual total number of pages */}
        <Pagination activePage={1} onPageChange={() => { }} totalPages={5} />

        {/* Modal */}
        <Modal
          open={showModal}
          onClose={this.handleCancel}
          style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', maxWidth: '400px', width: '100%' }}>
          <Modal.Header>Create a new customer</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Field>
                <label>Name</label>
                <input placeholder="Name" value={name} onChange={this.handleNameChange} />
              </Form.Field>
              <Form.Field>
                <label>Address</label>
                <input placeholder="Address" value={address} onChange={this.handleAddressChange} />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color='black' onClick={this.handleCancel}>
              Cancel
            </Button>
            <Button
              content="Create"
              labelPosition='right'
              icon='checkmark'
              onClick={this.handleCreate}
              positive
            />
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}
