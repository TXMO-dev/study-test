'use client';
import {
  Menu,
  MenuButton,
  Flex,
  Avatar,
} from '@chakra-ui/react';
import { FaBell } from 'react-icons/fa';

const TopNav = () => {
  const keyCloakSessionLogout = async () => {
    try {
      await fetch(`/api/auth/logout`, { method: 'GET' });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Flex
      align='center'
      p='8px'
      bgColor='#202A3B'
      justify='flex-end'
      shadow={'md'}>
      <Flex align='center'>
        <Menu>
          <MenuButton as={Flex}>
            <Flex align={'Center'} w='130px' justify={'space-between'}>
              <Avatar src='/assets/profile_avatar.png' mr='1rem' />
            </Flex>
          </MenuButton>
        </Menu>
      </Flex>
    </Flex>
  );
};

export default TopNav;
