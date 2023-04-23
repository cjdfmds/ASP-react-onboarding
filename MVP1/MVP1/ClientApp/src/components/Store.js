import React, { Component } from 'react';
import { Pagination, Button, Modal, Form, Icon, Header } from 'semantic-ui-react';
import axios from 'axios';


export default class Store extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      name: '',
      address: '',
      stores: [],
      isDeleteModalVisible: false,
      isEditModalVisible: false,
      storeIdToDelete: null,
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.loadStores = this.loadStores.bind(this);


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

    // Load stores from backend API on component mount
    this.loadStores();
  }

  loadStores() {
    // Make HTTP GET request to backend API to get all stores
    axios.get('https://localhost:7236/api/stores')
      .then(response => {
        const stores = response.data;
        this.setState({ stores: stores });
      })

      .catch(error => {
        console.log(error);
        // displays error

      });
  }

  handleEdit = (storeId) => {
    const store = this.state.stores.find(
      (store) => store.id === storeId
    );
    this.setState({
      isEditModalVisible: true,
      storeId: storeId,
      name: store.name,
      address: store.address,
    });
  };

  handleSave = () => {
    const { storeId, name, address } = this.state;
    console.log(storeId, name, address)
    const updatedStore = {
      id: storeId,
      name: name,
      address: address,
    };

    axios.put(`https://localhost:7236/api/stores/${storeId}`, updatedStore, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        const stores = this.state.stores.map((store) => {
          if (store.id === storeId) {
            console.log('testsuccess')
            return {

              ...store,
              name: name,
              address: address,
            };
          } else {
            console.log('testsuccess')
            return store;
          }
        });
        console.log('testsuccess')
        this.setState({

          stores: stores,
          isEditModalVisible: false,
          storeId: null,
          name: "",
          address: "",
        });
      })
      .catch((error) => {
        console.log('TEST FAILED')
        console.log(error.response);
      });
  };

  handleDelete(storeId) {
    this.handleShowDeleteModal(storeId);
  }

  handleShowDeleteModal(storeId) {
    this.setState({
      isDeleteModalVisible: true,
      storeIdToDelete: storeId,
    });
  }

  handleHideDeleteModal() {
    this.setState({
      isDeleteModalVisible: false,
      storeIdToDelete: null,
    });
  }

  handleHideEditModal() {
    this.setState({
      isEditModalVisible: false,
    });
  }

  handleConfirmDelete() {
    const { storeIdToDelete } = this.state;
    axios
      .delete(`https://localhost:7236/api/stores/${storeIdToDelete}`)
      .then((response) => {
        this.handleHideDeleteModal();
        this.loadStores();
        console.log(`https://localhost:7236/api/stores/${storeIdToDelete}`.toString())
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

    // Make HTTP POST request to backend API to add new store
    axios.post('https://localhost:7236/api/stores', {
      Name: name,
      Address: address
    })
      .then(response => {
        // Close modal
        this.setState({ showModal: false });
        // Reload stores from backend API
        this.loadStores();
      })
      .catch(error => {
        console.log(error);
        const errorMessage = error.response && error.response.data && error.response.data.message ?
          error.response.data.message :
          'An error occurred while adding the new store.';
        this.setState({ error: errorMessage });
      });
  }
  handleCancel() {
    this.setState({ showModal: false });
  }



  render() {
    const { showModal, name, address, stores, isDeleteModalVisible, isEditModalVisible, currentStoreId, storeIdToDelete } = this.state;
    const currentStore = stores.find(c => c.id === currentStoreId);

    return (
      <div>
        <h1>Store</h1>

        {/* New Store Button */}
        <Button color="blue" onClick={() => this.setState({ showModal: true })}>
          New Store
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
            {stores.map(store => (
              <tr key={store.id}>
                <td data-label="Name">{store.name}</td>
                <td data-label="Address">{store.address}</td>
                <td>
                  <button className="ui icon yellow button" onClick={() => this.handleEdit(store.id)}>
                    <i className="pencil alternate icon"></i> Edit
                  </button>
                </td>
                <td>
                  <button className="ui icon red button" onClick={() => this.handleDelete(store.id)}>
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
          <Header icon='trash alternate' content='Delete store?' />
          <Modal.Content>
            <p>Are you sure you want to delete this store?</p>
          </Modal.Content>
          <Modal.Actions>
            <Button color='red' onClick={() => this.handleConfirmDelete(storeIdToDelete)}>
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
          <Modal.Header>Create a new store</Modal.Header>
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
          <Modal.Header>Edit Store</Modal.Header>
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
