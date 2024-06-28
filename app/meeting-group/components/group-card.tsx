import React from 'react';
import { Heading, Text, Grid, GridItem, Image, Flex } from '@chakra-ui/react';
import Link from 'next/link';

interface CardProps {
  name: string;
  title: string;
  imageUrl: string;
  numberofMenbers?: string;
  path?: any;
}

const GroupCard: React.FC<CardProps> = ({
  name,
  title,
  imageUrl,
  path,
  numberofMenbers,
}) => {

  const group = {
    id: 'fafafadsfasf',
    name: 'Bacenta Management'
  }

  return (
  <>
      {/* <Flex bg='#898A8C' h='60px' w='60px' borderRadius={'50%'} m={0} align={'center'} justify={'center'} zIndex={5}>
        <Text p='10px' fontSize={'18px'} fontWeight={'700'} color={'#fff'}>150</Text>
      </Flex> */}
      <Grid
          background= {`linear-gradient(to right, #02A388, #009FC2)`}
          as={Link}
          href={path}
        borderRadius='9px'
        maxW={'170px'}
        templateRows='auto'
        overflow={'none'}
        templateAreas={`"top"
                  "body"
                  "footer"`}
      boxShadow='md'
      >
        <GridItem
          borderTopRadius={'8px'}
          alignContent={'center'}
          area={'top'}>
          <Heading
            pt={2}
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
            p={2}
            alt='profile-image'  />
        </GridItem>
        <GridItem
          area={'footer'}
          alignContent={'center'}
          borderBottomRadius={'8px'}
        >
          <Text
            fontSize='14px'
            fontWeight='bold'
            textAlign={'center'}
            color={'#fff'}
            pb={3}
            textTransform='uppercase'>
            {name}
          </Text>
        </GridItem>
      </Grid>
      </>
  );
};

export default GroupCard;
