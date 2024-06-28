import React from 'react';
import { Flex, Grid, Text, SimpleGrid } from '@chakra-ui/react';
import ProfileCard from '../../components/profile-card';
import GeneralLayout from '@/app/components/generalLayout';
import GroupCard from '@/app/components/group-card';

const CategoryDisplay = ({ searchParams }: any) => {
  const category = searchParams
  console.log(category)
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
            {category.name}
          </Text>
          <ProfileCard
            title='Chairman'
            name='Dag Heward-Mills'
            imageUrl={`/assets/daddy.jpg`}
          />
         
        </Flex>
        <SimpleGrid mt={2} w={'100%'} minChildWidth={'200px'}>
        <GroupCard
            title='leader'
            name='Dag Heward-Mills'
            imageUrl={`https://picsum.photos/200`}
          />
          <GroupCard
            title='leader'
            name='Dag Heward-Mills'
            imageUrl={`https://picsum.photos/200`}
          /><GroupCard
          title='leader'
          name='Dag Heward-Mills'
          imageUrl={`https://picsum.photos/200`}
        /><GroupCard
        title='leader'
        name='Dag Heward-Mills'
        imageUrl={`https://picsum.photos/200`}
      /><GroupCard
      title='leader'
      name='Dag Heward-Mills'
      imageUrl={`https://picsum.photos/200`}
    /><GroupCard
    title='leader'
    name='Dag Heward-Mills'
    imageUrl={`https://picsum.photos/200`}
  /><GroupCard
  title='leader'
  name='Dag Heward-Mills'
  imageUrl={`https://picsum.photos/200`}
/><GroupCard
            title='leader'
            name='Dag Heward-Mills'
            imageUrl={`https://picsum.photos/200`}
          /><GroupCard
          title='leader'
          name='Dag Heward-Mills'
          imageUrl={`https://picsum.photos/200`}
        />
        </SimpleGrid>
      </Flex>
    </GeneralLayout>
  );
};

export default CategoryDisplay;
