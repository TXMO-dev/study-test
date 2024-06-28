import React from 'react';
import { Flex, Spinner } from '@chakra-ui/react';
import TopNav from '@/app/components/meeting-top-nav';

const Loading = () => {
  return (
    <>
      <TopNav />
      <Flex flexDir='column' w='100%' align={'center'} justify={'center'}>
        <Spinner
          thickness='4px'
          speed='0.95s'
          emptyColor='gray'
          color='#00695C'
          size='xl'
        />
      </Flex>
    </>
  );
};

export default Loading;
