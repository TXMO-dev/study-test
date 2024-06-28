import React from 'react';
import { Avatar, Heading, Text, Grid, GridItem, Image } from '@chakra-ui/react';

interface ProfileCardProps {
  name: string;
  title: string;
  imageUrl: string;
  topbg?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  title,
  imageUrl,
  topbg,
}) => {
  return (
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
      >
        <GridItem
          borderTopRadius={'8px'}
          bgColor={topbg ? topbg : '#337ce2'}
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
          bgColor={topbg ? topbg : '#337ce2'}
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
  );
};

export default ProfileCard;
