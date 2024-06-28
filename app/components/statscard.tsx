'use client'
import React from 'react'
import { Flex, Text, Image} from '@chakra-ui/react'
import Link from 'next/link';

interface CardProps {
  title?: string;
  data?: string;
  path?: string;
}

const StatsCard: React.FC<CardProps> = ({title, data, path}) => {
  return (
    <Flex
      as={Link}
      h='128px'
      borderRadius='10px'
      boxShadow='xl' w='100%'
      bg='#202A3B' p={6}
      justify={'space-between'}
      href={path}
    >
      <Flex flexDir='column'>
       <Text  fontSize='16px' fontWeight='medium' color={'white'}>{title}</Text>
      <Text  fontSize='22px' fontWeight='500' color={'white'} pt={3}>{data}</Text>
      </Flex>
      <Flex align={'center'}>
      <Image src='/assets/iconInCircle.png' alt='logo' h={'50px'} />
      </Flex>
    </Flex>
  )
}

export default StatsCard