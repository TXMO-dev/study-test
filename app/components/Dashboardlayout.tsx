'use client';
import React from 'react';
import { Grid, Flex, GridItem, Divider, Text } from '@chakra-ui/react';
import SideNav from './sidenav';
import { Button } from './button';
import TopNav from './topNav';

type LayoutProps = {
  children: React.ReactNode;
  pageName?: string;
};

const Dashboardlayout = ({ children, pageName }: LayoutProps) => {
  return (
    <Grid
      h='100vh'
      w='100%'
      templateRows='auto 4fr 1fr'
      templateColumns='auto 4fr'
      templateAreas={`
      'sideNav topNav'
      'sideNav main'
      'sideNav main'
    `}>
      <GridItem area={'sideNav'}>
        <SideNav />
      </GridItem>
      <GridItem area={'topNav'}>
        <TopNav />
      </GridItem>
      <GridItem
        area={'main'}
        px='32px'
        py='3'
        overflow='auto'
        bgColor={'#DEE2E6'}>
        <Flex justify={'space-between'} align={'center'}>
          <Text fontSize='16px' fontWeight={500}>
            {pageName}
          </Text>
          <Flex gap={4} justify={'flex-end'}>
            <Button
              mt='0'
              path='/categories/create-category'
              text='Create Category'
              bg={'#202A3B'}
              border={'none'}
              color='#fff'
              h='43px'
            />
            <Button
              mt='0'
              path='/groups/create-group'
              text='Create Group'
              bg={'#202A3B'}
              border={'none'}
              color='#fff'
              h='43px'
            />
            <Button
              mt='0'
              path='/profile/create-profile'
              text='Create Profile'
              bg={'#202A3B'}
              border={'none'}
              color='#fff'
              h='43px'
            />
          </Flex>
        </Flex>
        {children}
      </GridItem>
    </Grid>
  );
};

export default Dashboardlayout;
