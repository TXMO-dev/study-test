'use client';
import React from 'react'
import GeneralLayout from '../components/generalLayout'
import { Flex, Text } from '@chakra-ui/react';
import { Button } from '../components/button';


const Categories = () => {
  return (
    <GeneralLayout>
      <Flex p={8}>
        <Flex justify={'space-between'} align={'center'} px={5} w='100%'>
          <Text fontSize='18px' fontWeight={500}>
            Categories
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
          </Flex>
        </Flex>
      </Flex>
    </GeneralLayout>
  );
}

export default Categories;