import { Flex } from '@chakra-ui/react';
import GroupCard from '../meeting-group/components/group-card';

const DashboardPage = () => {
  return (
    <Flex align={'center'} justify={'Center'} my={4}>
      <GroupCard
        title='Instrumentalist'
        name='Joshua Ababio'
        imageUrl='/assets/daddy.jpg'
        path={''}
        
      />
    </Flex>
  );
}

export default DashboardPage;
