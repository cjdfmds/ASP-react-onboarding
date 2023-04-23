import React, { Component } from 'react';
import { Pagination, Button, Modal, Form, Icon, Header, Dropdown } from 'semantic-ui-react';
import axios from 'axios';


export default class Sale extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      saleToCreate: {
        customerId: '',
        storeId: '',
        productId: '',
        dateSold: '',
      },
      sales: [],
      customers: [],
      stores: [],
      products: [],
      isDeleteModalVisible: false,
      isEditModalVisible: false,
      saleIdToDelete: null,

    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleChange = this.handleChange.bind(this);



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

    this.getSales();
    this.getCustomers();
    this.getStores();
    this.getProducts();
  }

  handleChange(event, { name, value }) {
    if (name === 'dateSold') {
      value = new Date(value).toISOString().slice(0, 10); // format date to yyyy-MM-dd
    }
    if (name === 'storeId' || name === 'productId' || name === 'customerId') {
      value = parseInt(value);
    }

    this.setState(prevState => ({
      saleToCreate: {
        ...prevState.saleToCreate,
        [name]: value,
      },
    }));
  }

  getSales = () => {
    axios.get('https://localhost:7236/api/Sales')
      .then(response => {
        this.setState({ sales: response.data });
      })
      .catch(error => console.log(error));
  }

  getCustomers = () => {
    axios.get('https://localhost:7236/api/Customers')
      .then(response => {
        this.setState({ customers: response.data });
      })
      .catch(error => console.log(error));
  }

  getStores = () => {
    axios.get('https://localhost:7236/api/Stores')
      .then(response => {
        this.setState({ stores: response.data });
      })
      .catch(error => console.log(error));
  }

  getProducts = () => {
    axios.get('https://localhost:7236/api/Products')
      .then(response => {
        this.setState({ products: response.data });
      })
      .catch(error => console.log(error));
  }

  handleEdit = (saleId) => {
    const sale = this.state.sales.find(
      (sale) => sale.id === saleId
    );
    this.setState({
      isEditModalVisible: true,
      saleId: saleId,
      name: sale.name,
      address: sale.address,
    });
  };

  handleSave = () => {
    const { saleId, name, address } = this.state;
    console.log(saleId, name, address)
    const updatedSale = {
      id: saleId,
      name: name,
      address: address,
    };

    axios.put(`https://localhost:7236/api/sales/${saleId}`, updatedSale, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        const sales = this.state.sales.map((sale) => {
          if (sale.id === saleId) {
            console.log('testsuccess')
            return {

              ...sale,
              name: name,
              address: address,
            };
          } else {
            console.log('testsuccess')
            return sale;
          }
        });
        console.log('testsuccess')
        this.setState({

          sales: sales,
          isEditModalVisible: false,
          saleId: null,
          name: "",
          address: "",
        });
      })
      .catch((error) => {
        console.log('TEST FAILED')
        console.log(error.response);
      });
  };



  handleDelete(saleId) {
    this.handleShowDeleteModal(saleId);
  }

  handleShowDeleteModal(saleId) {
    this.setState({
      isDeleteModalVisible: true,
      saleIdToDelete: saleId,
    });
  }

  handleHideDeleteModal() {
    this.setState({
      isDeleteModalVisible: false,
      saleIdToDelete: null,
    });
  }

  handleHideEditModal() {
    this.setState({
      isEditModalVisible: false,
    });
  }

  handleConfirmDelete() {
    const { saleIdToDelete } = this.state;
    axios
      .delete(`https://localhost:7236/api/sales/${saleIdToDelete}`)
      .then((response) => {
        this.handleHideDeleteModal();
        this.loadSales();
        console.log(`https://localhost:7236/api/sales/${saleIdToDelete}`.toString())
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
    console.log(this.state.saleToCreate);
    const { customerId, storeId, productId, dateSold } = this.state.saleToCreate;

    axios.post('https://localhost:7236/api/Sales', { customerId, storeId, productId, dateSold })
      .then(() => {
        this.getSales();
        this.handleCreateModalClose();
        console.log(customerId, storeId, productId, dateSold)
      })
      .catch(error => console.log(error));
  }
  handleCancel() {
    this.setState({ showModal: false });
  }



  render() {
    const { showModal, name, address, sales, isDeleteModalVisible, isEditModalVisible, currentSaleId, saleIdToDelete, customers, stores, products } = this.state;
    const currentSale = sales.find(c => c.id === currentSaleId);
    const customerOptions = customers.map(customer => ({
      key: customer.id,
      text: customer.name,
      value: customer.id,
    }));

    const productOptions = products.map(product => ({
      key: product.id,
      text: product.name,
      value: product.id,
    }));

    const storeOptions = stores.map(store => ({
      key: store.id,
      text: store.name,
      value: store.id,
    }));
    return (
      <div>
        <h1>Sale</h1>

        {/* New Sale Button */}
        <Button color="blue" onClick={() => this.setState({ showModal: true })}>
          New Sale
        </Button>

        {/* Table */}
        <table className="ui celled striped table">
          <thead className="custom-thead bold">
            <tr>
              <th>Customer Name</th>
              <th>Product</th>
              <th>Store</th>
              <th>DateSold</th>
              <th>Actions</th>
              <th>Actions</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sales.map(sale => (
              <tr key={sale.id}>
                <td data-label="Customer Name">
                  {customers.find(c => c.id === sale.customerId)?.name}
                </td>
                <td data-label="Product">
                  {products.find(p => p.id === sale.productId)?.name}
                </td>
                <td data-label="Store">
                  {stores.find(s => s.id === sale.storeId)?.name}
                </td>
                <td data-label="DateSold">
                  {new Date(sale.dateSold).toLocaleDateString()}
                </td>
                <td data-label="Actions">
                  <button className="ui icon yellow button" onClick={() => this.handleEdit(sale.id)}>
                    <i className="pencil alternate icon"></i> Edit
                  </button>
                </td>
                <td data-label="Actions">
                  <button className="ui icon red button" onClick={() => this.handleDelete(sale.id)}>
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
          <Header icon='trash alternate' content='Delete sale?' />
          <Modal.Content>
            <p>Are you sure you want to delete this sale?</p>
          </Modal.Content>
          <Modal.Actions>
            <Button color='red' onClick={() => this.handleConfirmDelete(saleIdToDelete)}>
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
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '400px',
            width: '100%',
            maxHeight: '350px',
            height: '200%'
          }}
        >
          <Modal.Header>Create a new sale</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Field>
                <label>Customer</label>
                <Dropdown
                  placeholder='Select a customer'
                  fluid
                  selection
                  options={customerOptions}
                  value={this.state.saleToCreate.customerId}
                  onChange={(event, data) =>
                    this.handleChange(event, { name: 'customerId', value: data.value })
                  }
                />
              </Form.Field>
              <Form.Field>
                <label>Product</label>
                <Dropdown
                  placeholder='Select a product'
                  fluid
                  selection
                  options={productOptions}
                  value={this.state.saleToCreate.productId}
                  onChange={(event, data) =>
                    this.handleChange(event, { name: 'productId', value: data.value })
                  }
                />
              </Form.Field>
              <Form.Field>
                <label>Store</label>
                <Dropdown
                  placeholder='Select a store'
                  fluid
                  selection
                  options={storeOptions}
                  value={this.state.saleToCreate.storeId}
                  onChange={(event, data) =>
                    this.handleChange(event, { name: 'storeId', value: data.value })
                  }
                />
              </Form.Field>
              <Form.Field>
                <label>Date Sold</label>
                <input
                  type='date'
                  placeholder='Date Sold'
                  value={this.state.saleToCreate.dateSold}
                  onChange={(event) =>
                    this.handleChange(event, { name: 'dateSold', value: event.target.value })
                  }
                />
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
          <Modal.Header>Edit Sale</Modal.Header>
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
