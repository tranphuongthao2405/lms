import React from 'react';
import { Menu } from 'antd';

function LeftMenu(props) {
  return (
    // eslint-disable-next-line react/destructuring-assignment
    <Menu mode={props.mode}>
      <Menu.Item key="home">
        <a href="/">Home</a>
      </Menu.Item>
    </Menu>
  );
}

export default LeftMenu;
