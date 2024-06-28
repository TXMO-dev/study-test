'use client';
import React, { useState } from 'react';
import { Flex, Image, Text, Divider, Avatar, Box } from '@chakra-ui/react';
import SideNavItem from './sideNavitem';
import { HiUserGroup } from 'react-icons/hi2';
import { IoLogOutOutline, IoPricetagsOutline } from 'react-icons/io5';
import { BiSolidDashboard } from 'react-icons/bi';
import { FaUser, FaChartPie } from 'react-icons/fa';
import Link from 'next/link';

const SideNav = () => {
  const [isOpen, setisOpen] = useState(true);

  const handleNavToggle = () => {
    setisOpen(!isOpen);
  };

  return (
    <Flex
      flexDir='column'
      maxW='300px'
      h='100vh'
      p='1rem'
      bgColor={'#202A3B'}
      justifyContent='space-between'>
      <Flex flexDir='column' gap='5' border='push origin '>
        <Flex align='center' justify='space-between' mt='4'>
          <Image src='/assets/Logo_white.png' alt='logo' w='95px' />
        </Flex>
        <Flex flexDir='column'>
        <SideNavItem
            path='/display'
            altText='Display'
            text='Display'
            icon={BiSolidDashboard}
          />
          
          <SideNavItem
            path='/categories'
            altText='Categories'
            text='Categories'
            icon={IoPricetagsOutline}
          />
          <SideNavItem
            path='/groups'
            altText='Groups'
            text='Groups'
            icon={HiUserGroup}
          />
          <SideNavItem
            path='/profile'
            altText='Profiles'
            text='Profiles'
            icon={FaUser}
          />
          <SideNavItem
            path='/dashboard'
            altText='stats'
            text='Stats'
            icon={FaChartPie}
          />
        </Flex>
      </Flex>
      <Flex flexDir='column' justifyContent='flex-end' gap='6'>
        <Divider />
        <Flex alignItems='center' mb='5'>
          <Text color={'#fff'} fontSize={'16px'} fontWeight={'500'} pr={2} >
            Logout
          </Text>
          <Box as={Link} href='/api/auth/logout'>
            <IoLogOutOutline color='#fff' fontSize='20px' />
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default SideNav;
