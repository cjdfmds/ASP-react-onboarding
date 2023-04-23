import React, { Component } from 'react';
//import { Collapse, Navbar, Nav, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import { Menu } from 'semantic-ui-react';

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor(props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true
    };
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  render() {
    return (
      <header>
        <Menu fixed="top" inverted>
          <Menu.Item header>MVP1</Menu.Item>
          <Menu.Menu position="left">
            <Menu.Item as={Link} to="/" name="home" />
            <Menu.Item as={Link} to="/customers" name="customers" />
            <Menu.Item as={Link} to="/products" name="products" />
            <Menu.Item as={Link} to="/sales" name="sales" />
            <Menu.Item as={Link} to="/stores" name="stores" />
            <Menu.Item as={Link} to="/fetch-data" name="fetch-data" />
          </Menu.Menu>
        </Menu>
      </header>
    );
  }
}
