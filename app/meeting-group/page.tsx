import React from 'react';
import TopNav from '../components/meeting-top-nav';
import { Flex } from '@chakra-ui/react';
import Groups from './components/group';


const MeetingGroup = () => {
  return (
    <Flex flexDir={'column'}>
      <TopNav />
      <Groups />
    </Flex>
  );
};

export default MeetingGroup;
