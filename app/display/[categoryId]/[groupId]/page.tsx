import React from 'react';
import { Flex, Grid, Text, SimpleGrid } from '@chakra-ui/react';
import ProfileCard from '../../../components/profile-card';
import CategoryCard from '../../../components/category-card';
import GeneralLayout from '@/app/components/generalLayout';

const GroupDisplay = ({ searchParams }: any) => {
  const group = searchParams;
  console.log(group);
  return (
    <GeneralLayout>
      <Flex flexDirection={'column'}>
        <Flex flexDir='column' align={'center'}>
          <Text
            align={'center'}
            fontSize={'20px'}
            fontWeight={'700'}
            pt={3}
            textTransform='uppercase'>
            {group.name}
          </Text>
          <ProfileCard
            title='Leader'
            name='Dag Heward-Mills'
            imageUrl={`/assets/daddy.jpg`}
          />
        </Flex>
        <SimpleGrid mt={2} w={'100%'} minChildWidth={'200px'}>
          <ProfileCard
            topbg='#202A3B'
            title='member'
            name='Dag Heward-Mills'
            imageUrl={`https://picsum.photos/200`}
          />
          <ProfileCard
            topbg='#202A3B'
            title='member'
            name='Dag Heward-Mills'
            imageUrl={`https://picsum.photos/200`}
          /><ProfileCard
          topbg='#202A3B'
          title='member'
          name='Dag Heward-Mills'
          imageUrl={`https://picsum.photos/200`}
        /><ProfileCard
        topbg='#202A3B'
        title='member'
        name='Dag Heward-Mills'
        imageUrl={`https://picsum.photos/200`}
      /><ProfileCard
      topbg='#202A3B'
      title='member'
      name='Dag Heward-Mills'
      imageUrl={`https://picsum.photos/200`}
    /><ProfileCard
    topbg='#202A3B'
    title='member'
    name='Dag Heward-Mills'
    imageUrl={`https://picsum.photos/200`}
  /><ProfileCard
  topbg='#202A3B'
  title='member'
  name='Dag Heward-Mills'
  imageUrl={`https://picsum.photos/200`}
/><ProfileCard
            topbg='#202A3B'
            title='member'
            name='Dag Heward-Mills'
            imageUrl={`https://picsum.photos/200`}
          /><ProfileCard
          topbg='#202A3B'
          title='member'
          name='Dag Heward-Mills'
          imageUrl={`https://picsum.photos/200`}
        />
        </SimpleGrid>
      </Flex>
    </GeneralLayout>
  );
};

export default GroupDisplay;
