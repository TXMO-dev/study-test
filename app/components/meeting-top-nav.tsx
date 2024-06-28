import React from 'react';
import { Flex } from '@chakra-ui/react';
import { Button } from './button';

interface TopNavProps {
  id?: string;
  groupId?: string;
}

const TopNav: React.FC<TopNavProps> = ({ id, groupId }) => {
  return (
    <Flex
      p='10px'
      flexDir={['column', 'row']}
      px='30px'  
      w='100%'
      align={'center'}
      bgColor='#202A3B'
      shadow={'md'}
      justify={'space-between'}
      position={'sticky'}
      top={0}
    >
      <Flex gap={4} mb={[2, 0]}
      >
        <Button
          mt='0'
          path={groupId === undefined ? '/meeting-group':`/meeting-group/edit-group/${groupId}`}
          text={groupId === undefined ? 'View Groups' : 'Edit Group'}
          bg={'#00695C'}
          border={'none'}
          color='#fff'
          h='40px'
          maxW='120px'
        />
        <Button
          mt='0'
          path={`/meeting-group/profiles`}
          text='View Profiles'
          bg={'#00695C'}
          border={'none'}
          color='#fff'
          maxW='120px'
          h='40px'
        />
      </Flex>

      <Flex gap={4}>
        <Button
          mt='0'
          path='/meeting-group/create-group'
          text='Create Group'
          bg={'#00695C'}
          border={'none'}
          maxW='120px'
          color='#fff'
          h='43px'
        />
        <Button
          mt='0'
          path={(id !== null && id !== undefined) ? `/meeting-group/profiles/update-profile/${id}` : `/meeting-group/profiles/create-profile`}
          text={(id !== null && id !== undefined) ? 'Update Profile' : 'Create Profile'}
          bg={'#00695C'}
          maxW='120px'
          border={'none'}
          color='#fff'
          h='43px'
        />
      </Flex>
    </Flex>
  );
};

export default TopNav;
