import React from 'react';
import {
  Flex,
  Text,
  Image,
} from '@chakra-ui/react';
import Link from 'next/link';

interface ProfileCardProps {
  name?: string;
  title?: string;
  imageUrl?: string;
  topbg?: string;
  path?: any;
  onImageUpload?: (imageFile: File) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  title,
  imageUrl,
  path,
}) => {
  if (name) {
    return (
      <>
        <Flex
          w={'150px'}
          background= {`linear-gradient(to right, red, purple)`}
          borderRadius={'20px 20px 20px 0'}
          flexDir={'column'}
          as={Link}
          href={path}>
          <Text
            w='100%'
            fontSize='16px'
            fontWeight='bold'
            textAlign={'center'}
            color={'#fff'}
            p={1}
            textTransform='uppercase'>
            {title}
          </Text>
          <Image
            src={imageUrl}
          borderRadius={'30px 30px 30px 0px'}
          p={3}
            alt='profile-image'
            maxH={'160px'}
          />
          <Text
            maxW='100%'
            fontSize='15px'
            fontWeight={'700'}
            textAlign={'center'}
            // bgColor={'#202A3B'}
            color={'#fff'}
            p={1}
            textTransform='uppercase'
            whiteSpace={'new line'}
          >
            {name}
          </Text>
        </Flex>
      </>
    );
  }
  return (
    <Flex
      border='3px solid #044DC3'
      p='10px'
      borderRadius={'8px'}
      align={'center'}>
      <Image src={`/assets/emptyGroup.png`} alt='profile-image' h='220px'w='180px'/>
    </Flex>
  );
};

export default ProfileCard;
