/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Menu } from 'antd';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { USER_SERVER } from '../../../Config';

const { SubMenu } = Menu;
const MenuItemGroup = Menu.ItemGroup;

function RightMenu(props) {
  const user = useSelector((state) => state.user);
  let isAdmin;
  if (user !== undefined) {
    if (user.userData !== undefined) {
      isAdmin = user.userData.isAdmin;
    }
  }

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then((response) => {
      if (response.status === 200) {
        props.history.push('/login');
      } else {
        alert('Log Out Failed');
      }
    });
  };

  if (user.userData && !user.userData.isAuth) {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="mail">
          <a href="/login">Signin</a>
        </Menu.Item>
        <Menu.Item key="app">
          <a href="/register">Signup</a>
        </Menu.Item>
      </Menu>
    );
  }
  return (
    <>
      {user !== undefined && user.userData !== undefined ? (
        <div>
          <Menu mode={props.mode}>
            {/* only admin can access upload feature */}
            {isAdmin ? (
              <SubMenu title={<span>Upload</span>}>
                <MenuItemGroup>
                  <Menu.Item key="course">
                    <a href="/course/upload">Upload Course</a>
                  </Menu.Item>
                  <Menu.Item key="video">
                    <a href="/video/upload">Upload Video</a>
                  </Menu.Item>
                  <Menu.Item key="quiz">
                    <a href="/quiz/upload">Upload Quiz</a>
                  </Menu.Item>
                </MenuItemGroup>
              </SubMenu>
            ) : (
              <> </>
            )}

            <Menu.Item key="course collection">
              <a href="/courseCollection">My Courses</a>
            </Menu.Item>

            <Menu.Item key="learning path">
              <a href="/learningPath">Learning Path</a>
            </Menu.Item>

            <SubMenu title={(
              <span>
                {' '}
                Hi,
                {' '}
                {' '}
                {user.userData.username}
              </span>
            )}
            >
              <MenuItemGroup>
                <Menu.Item key="user info">
                  <a href={`/user/${user.userData._id}`}>
                    Update information
                  </a>
                </Menu.Item>
                <Menu.Item key="logout">
                  <a onClick={logoutHandler}>Logout</a>
                </Menu.Item>
              </MenuItemGroup>
            </SubMenu>
          </Menu>
        </div>
      ) : (
        <div />
      )}
    </>
  );
}

export default withRouter(RightMenu);
