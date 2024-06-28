'use client';
import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { IoHomeSharp } from 'react-icons/io5';

import SideNav from '@/app/components/sidenav';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
SideNav;

type LayoutProps = {
  children: React.ReactNode;
  groupId?: any;
};

const Layout = ({ children, groupId }: LayoutProps) => {
  const router = useRouter();

  return (
    <Flex flexDir={'column'} h='100vh' w='100%'>
      {children}
      <Flex mx={12}>
        <Flex
          as={Link}
          href={'/meeting-group'}
          align={'center'}
          border='1px solid #202A3B'
          borderRadius={5}
          p={'8px'}
          position={'fixed'}
          bottom={'3'}>
          <IoHomeSharp
            size={'20px'}
            style={{
              display: groupId ? 'none' : '',
            }}
          />
          <Text fontSize={'12px'} fontWeight={700} color={'#202A3B'} p={2}>
            {groupId ? 'Done' : 'Home'}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Layout;
