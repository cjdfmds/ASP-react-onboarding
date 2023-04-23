import React, { Component } from 'react';
import { Pagination, Button, Modal, Form, Icon, Header } from 'semantic-ui-react';
import axios from 'axios';


export default class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      name: '',
      price: 0,
      products: [],
      isDeleteModalVisible: false,
      isEditModalVisible: false,
      productIdToDelete: null,
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.loadProducts = this.loadProducts.bind(this);


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

    // Load products from backend API on component mount
    this.loadProducts();
  }

  loadProducts() {
    // Make HTTP GET request to backend API to get all products
    axios.get('https://localhost:7236/api/products')
      .then(response => {
        const products = response.data;
        this.setState({ products: products });
      })

      .catch(error => {
        console.log(error);
        // displays error

      });
  }

  handleEdit = (productId) => {
    const product = this.state.products.find(
      (product) => product.id === productId
    );
    this.setState({
      isEditModalVisible: true,
      productId: productId,
      name: product.name,
      price: product.price,
    });
  };

  handleSave = () => {
    const { productId, name, price } = this.state;
    console.log(productId, name, price)
    const updatedProduct = {
      id: productId,
      name: name,
      price: price,
    };
  
    axios.put(`https://localhost:7236/api/products/${productId}`, updatedProduct,{
      headers: {
        'Content-Type': 'application/json'}
      })
      .then((response) => {
        const products = this.state.products.map((product) => {
          if (product.id === productId) {
            console.log('testsuccess')
            return {
              
              ...product,
              name: name,
              price: price,
            }; 
          } else {console.log('testsuccess')
            return product;
          }
        });
        console.log('testsuccess')
        this.setState({
         
          products: products,
          isEditModalVisible: false,
          productId: null,
          name: "",
          price: "",
        });
      })
      .catch((error) => {
        console.log('TEST FAILED')
        console.log(error.response);
      });
  };

  handleDelete(productId) {
    this.handleShowDeleteModal(productId);
  }

  handleShowDeleteModal(productId) {
    this.setState({
      isDeleteModalVisible: true,
      productIdToDelete: productId,
    });
  }

  handleHideDeleteModal() {
    this.setState({
      isDeleteModalVisible: false,
      productIdToDelete: null,
    });
  }
  
  handleHideEditModal() {
    this.setState({
      isEditModalVisible: false,});     
  }

  handleConfirmDelete() {
    const { productIdToDelete } = this.state;
    axios
      .delete(`https://localhost:7236/api/products/${productIdToDelete}`)
      .then((response) => {
        this.handleHideDeleteModal();
        this.loadProducts();
        console.log(`https://localhost:7236/api/products/${productIdToDelete}`.toString())
      })
      .catch((error) => {
        console.log(error);
      });
  }


  handleNameChange(event) {
    this.setState({ name: event.target.value });
  }

  handlePriceChange(event) {
    this.setState({ price: event.target.value });
  }

  handleCreate() {
    const { name, price } = this.state;

    // Make HTTP POST request to backend API to add new product
    axios.post('https://localhost:7236/api/products', {
      Name: name,
      Price: price
    })
      .then(response => {
        // Close modal
        this.setState({ showModal: false });
        // Reload products from backend API
        this.loadProducts();
      })
      .catch(error => {
        console.log(error);
        const errorMessage = error.response && error.response.data && error.response.data.message ?
          error.response.data.message :
          'An error occurred while adding the new product.';
        this.setState({ error: errorMessage });
      });
  }
  handleCancel() {
    this.setState({ showModal: false });
  }



  render() {
    const { showModal, name, price, products, isDeleteModalVisible, isEditModalVisible, currentProductId, productIdToDelete } = this.state;
    const currentProduct = products.find(c => c.id === currentProductId);

    return (
      <div>
        <h1>Product</h1>

        {/* New Product Button */}
        <Button color="blue" onClick={() => this.setState({ showModal: true })}>
          New Product
        </Button>

        {/* Table */}
        <table className="ui celled striped table">
          <thead className="custom-thead bold">
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Actions</th>
              <th>Actions</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td data-label="Name">{product.name}</td>
                <td data-label="Price">{product.price}</td>
                <td>
                  <button className="ui icon yellow button" onClick={() => this.handleEdit(product.id)}>
                    <i className="pencil alternate icon"></i> Edit
                  </button>
                </td>
                <td>
                  <button className="ui icon red button" onClick={() => this.handleDelete(product.id)}>
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
          <Header icon='trash alternate' content='Delete product?' />
          <Modal.Content>
            <p>Are you sure you want to delete this product?</p>
          </Modal.Content>
          <Modal.Actions>
            <Button color='red' onClick={() => this.handleConfirmDelete(productIdToDelete)}>
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
          <Modal.Header>Create a new product</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Field>
                <label>Name</label>
                <input placeholder="Name" value={name} onChange={this.handleNameChange} />
              </Form.Field>
              <Form.Field>
                <label>Price</label>
                <input placeholder="Price" value={price} onChange={this.handlePriceChange} />
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
  <Modal.Header>Edit Product</Modal.Header>
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
        <label>Price</label>
        <input 
          type="text" 
          value={this.state.price} 
          onChange={(event) => this.setState({ price: event.target.value })}
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
