import React from 'react';
import { Heading, Text, Grid, GridItem, Image, Flex } from '@chakra-ui/react';
import Link from 'next/link';

interface CardProps {
  name: string;
  title: string;
  imageUrl: string;
  topbg?: string;
}

const GroupCard: React.FC<CardProps> = ({
  name,
  title,
  imageUrl,
  topbg,
}) => {

  const group = {
    id: 'fafafadsfasf',
    name: 'Bacenta Management'
  }

  return (
    <Flex
      as={Link}
      href={{
        pathname: `display/${group.name}`,
        query: {
          id: group.id,
          name: group.name,
        }
      }}
    >
      <Flex bg='#898A8C' h='60px' w='60px' borderRadius={'50%'} m={0} align={'center'} justify={'center'} zIndex={5}>
        <Text p='10px' fontSize={'18px'} fontWeight={'700'} color={'#fff'}>150</Text>
      </Flex>
      <Grid
        borderRadius='9px'
        maxW={'170px'}
        templateRows='auto'
        overflow={'none'}
        templateAreas={`"top"
                  "body"
                  "footer"`}
      boxShadow='md'
        m={4}
        ml={-5}
        mt={8}
      >
        <GridItem
          borderTopRadius={'8px'}
          bgColor={topbg ? topbg : '#00695C'}
          alignContent={'center'}
          area={'top'}>
          <Heading
            p={1}
            textTransform={'uppercase'}
            fontSize={'17px'}
            fontWeight={'700'}
            textAlign={'center'}
            color={'#fff'}>
            {title}
          </Heading>
        </GridItem>
        <GridItem area={'body'}>
          <Image
          src={imageUrl}
            alt='profile-image' bgColor={'red'} />
        </GridItem>
        <GridItem
          area={'footer'}
          bgColor={topbg ? topbg : '#00695C'}
          alignContent={'center'}
          borderBottomRadius={'8px'}
        >
          <Text
            fontSize='14px'
            fontWeight='bold'
            textAlign={'center'}
            color={'#fff'}
            p={1}
            textTransform='uppercase'>
            {name}
          </Text>
        </GridItem>
      </Grid>
    </Flex>
  );
};

export default GroupCard;
