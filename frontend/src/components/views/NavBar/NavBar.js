import React, { useState } from 'react';
import { Drawer, Button, Icon } from 'antd';
import LeftMenu from './Sections/LeftMenu';
import RightMenu from './Sections/RightMenu';
import './Navbar.css';
import DSLLogo from './Images/dsl-logo.png';

function NavBar() {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <nav className="menu">
      <div className="menu-logo">
        <a href="/">
          <img src={DSLLogo} alt="dsl logo" style={{ height: 35, width: 80 }} />
        </a>
      </div>
      <div className="menu-container">
        <div className="menu-left">
          <LeftMenu mode="horizontal" />
        </div>
        <div className="menu-right">
          <RightMenu mode="horizontal" />
        </div>
        <Button
          className="menu-mobile-button"
          type="primary"
          onClick={showDrawer}
        >
          <Icon type="align-right" />
        </Button>
        <Drawer
          title="Basic Drawer"
          placement="right"
          className="menu-drawer"
          closable={false}
          onClose={onClose}
          visible={visible}
        >
          <LeftMenu mode="inline" />
          <RightMenu mode="inline" />
        </Drawer>
      </div>
    </nav>
  );
}

export default NavBar;
