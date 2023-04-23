import React, { Component } from 'react';
import { Pagination, Button, Modal, Form, Icon, Header } from 'semantic-ui-react';
import axios from 'axios';


export default class Customer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      name: '',
      address: '',
      customers: [],
      isDeleteModalVisible: false,
      isEditModalVisible: false,
      customerIdToDelete: null,
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.loadCustomers = this.loadCustomers.bind(this);


    //delete
    this.handleDelete = this.handleDelete.bind(this);
    this.handleShowDeleteModal = this.handleShowDeleteModal.bind(this);
    this.handleHideDeleteModal = this.handleHideDeleteModal.bind(this);
    this.handleConfirmDelete = this.handleConfirmDelete.bind(this);

    //put/edit
    this.handleHideEditModal = this.handleHideEditModal.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleSave = this.handleSave.bind(this);
    

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

  handleEdit = (customerId) => {
    const customer = this.state.customers.find(
      (customer) => customer.id === customerId
    );
    this.setState({
      isEditModalVisible: true,
      customerId: customerId,
      name: customer.name,
      address: customer.address,
    });
  };

  handleSave = () => {
    const { customerId, name, address } = this.state;
    console.log(customerId, name, address)
    const updatedCustomer = {
      id: customerId,
      name: name,
      address: address,
    };
  
    axios.put(`https://localhost:7236/api/customers/${customerId}`, updatedCustomer,{
      headers: {
        'Content-Type': 'application/json'}
      })
      .then((response) => {
        const customers = this.state.customers.map((customer) => {
          if (customer.id === customerId) {
            console.log('testsuccess')
            return {
              
              ...customer,
              name: name,
              address: address,
            }; 
          } else {console.log('testsuccess')
            return customer;
          }
        });
        console.log('testsuccess')
        this.setState({
         
          customers: customers,
          isEditModalVisible: false,
          customerId: null,
          name: "",
          address: "",
        });
      })
      .catch((error) => {
        console.log('TEST FAILED')
        console.log(error.response);
      });
  };

  handleDelete(customerId) {
    this.handleShowDeleteModal(customerId);
  }

  handleShowDeleteModal(customerId) {
    this.setState({
      isDeleteModalVisible: true,
      customerIdToDelete: customerId,
    });
  }

  handleHideDeleteModal() {
    this.setState({
      isDeleteModalVisible: false,
      customerIdToDelete: null,
    });
  }
  
  handleHideEditModal() {
    this.setState({
      isEditModalVisible: false,});     
  }

  handleConfirmDelete() {
    const { customerIdToDelete } = this.state;
    axios
      .delete(`https://localhost:7236/api/customers/${customerIdToDelete}`)
      .then((response) => {
        this.handleHideDeleteModal();
        this.loadCustomers();
        console.log(`https://localhost:7236/api/customers/${customerIdToDelete}`.toString())
      })
      .catch((error) => {
        console.log(error);
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
    const { showModal, name, address, customers, isDeleteModalVisible, isEditModalVisible, currentCustomerId, customerIdToDelete } = this.state;
    const currentCustomer = customers.find(c => c.id === currentCustomerId);

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
              <th>Actions</th>
              <th>Actions</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.id}>
                <td data-label="Name">{customer.name}</td>
                <td data-label="Address">{customer.address}</td>
                <td>
                  <button className="ui icon yellow button" onClick={() => this.handleEdit(customer.id)}>
                    <i className="pencil alternate icon"></i> Edit
                  </button>
                </td>
                <td>
                  <button className="ui icon red button" onClick={() => this.handleDelete(customer.id)}>
                    <i className="trash alternate icon"></i> Delete
                  </button>
                </td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {/* Replace totalPages with the actual total number of pages */}
        <Pagination activePage={1} onPageChange={() => { }} totalPages={5} />

        {/* Delete Modal */}
        <Modal open={isDeleteModalVisible} onClose={this.handleHideDeleteModal} size='small' style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', maxWidth: '400px', width: '100%', maxHeight: '200px', height: '100%'
        }}>
          <Header icon='trash alternate' content='Delete customer?' />
          <Modal.Content>
            <p>Are you sure you want to delete this customer?</p>
          </Modal.Content>
          <Modal.Actions>
            <Button color='red' onClick={() => this.handleConfirmDelete(customerIdToDelete)}>
              <Icon name='trash alternate' /> Confirm
            </Button>
            <Button onClick={this.handleHideDeleteModal}>
              <Icon name='remove' /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>


        {/* Create Modal */}
        <Modal
          open={showModal}
          onClose={this.handleCancel}
          style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', maxWidth: '400px', width: '100%', maxHeight: '350px', height: '200%' }}>
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

        {/* Edit Modal */}
        <Modal 
  open={isEditModalVisible} 
  onClose={this.handleHideEditModal} 
  size='small' 
  style={{
    position: 'absolute', 
    top: '50%', 
    left: '50%', 
    transform: 'translate(-50%, -50%)', 
    maxWidth: '400px', 
    width: '100%', 
    maxHeight: '300px', 
    height: '100%'
  }}
>
  <Modal.Header>Edit Customer</Modal.Header>
  <Modal.Content>
    <Form>
      <Form.Field>
        <label>Name</label>
        <input 
          type="text" 
          value={this.state.name} 
          onChange={(event) => this.setState({ name: event.target.value })}
        />
      </Form.Field>
      <Form.Field>
        <label>Address</label>
        <input 
          type="text" 
          value={this.state.address} 
          onChange={(event) => this.setState({ address: event.target.value })}
        />
      </Form.Field>
    </Form>
  </Modal.Content>
  <Modal.Actions>
    <Button color='green' onClick={this.handleSave}>
      <Icon name='save' /> Save
    </Button>
    <Button onClick={this.handleHideEditModal}>
      <Icon name='remove' /> Cancel
    </Button>
  </Modal.Actions>
</Modal>
      </div>
    );
  }
}
