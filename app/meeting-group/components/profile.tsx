import React from 'react';
import { Flex,VStack, Heading, Text, Grid, GridItem, Image } from '@chakra-ui/react';
import Link from 'next/link';

interface ProfileCardProps {
  name?: string;
  title?: string;
  imageUrl?: string;
  topbg?: string;
  path?: any;
  onImageUpload?: (imageFile: File) => void;
}


const MeetingProfileCard: React.FC<ProfileCardProps> = ({
  name,
  title,
  imageUrl,
  topbg,
  path,
  onImageUpload
}) => {
  if (name) {

    return (
      <>
        <Flex
          h='330px'
          w='250px'
          border='3px solid #202A3B'
          borderRadius={'8px'}
          flexDir={'column'}
          as={Link}
          href={path}
        >
          <Text
              w='100%'
            fontSize='18px'
            fontWeight='bold'
            textAlign={'center'}
            bgColor={'#202A3B'}
            color={'#fff'}
            p={1}
            textTransform='uppercase'>
            {title}
          </Text>
          <Image
            src={imageUrl}
            alt='profile-image'
            h={title ? '256px' : '281px'}

          />
            <Text
              w='100%'
            fontSize='18px'
            fontWeight='bold'
            textAlign={'center'}
            bgColor={'#202A3B'}
            color={'#fff'}
            p={1}
            textTransform='uppercase'>
            {name}
          </Text>
        </Flex>
      </>
    );
  }
  return (
    <Flex
      h='330px'
      w='250px'
      border='3px solid #044DC3'
      p='10px'
      borderRadius={'8px'}
      align={'center'}>
      <Image src={`/assets/emptyGroup.png`} alt='profile-image' h={'220px'} />
    </Flex>
  );
};

export default MeetingProfileCard;
