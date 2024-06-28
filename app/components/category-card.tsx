import { Box, Text, Image, Flex } from '@chakra-ui/react';
import Link from 'next/link';

interface CardProps {
  imageUrl: string;
  categoryName: string;
  groups: string;
  categoryColor?: string;
  numberColor?: string;
  path?: string
}

const CategoryCard: React.FC<CardProps> = ({
  imageUrl,
  categoryName,
  groups,
  path
}) => {

  const category = {
    id: 'fafafadsfasf',
    name: 'Bacenta Management'
  }

  return (
    <Flex alignItems='center' m={4} >
      <Image
        src={`/assets/daddy.jpg`}
        alt={categoryName}
        h='150px'
        w='150px'
        borderRadius='full'
        border='5px solid black'
        zIndex={100}
      />
      <Box bg={'#e77e3e'}
        ml='-2.5'
        as={Link}
        href={{
          pathname: `display/${category.name}`,
          query: {
            id: category.id,
            name: category.name,
          }
        }}
      >
        <Text
          color='white'
          fontWeight={'700'}
          fontSize={'18px'}
          p='25px'
          pl='40px'
          textTransform='uppercase'>
          {categoryName}
        </Text>
      </Box>
      <Box bg={'#bb4f0e'}>
        <Text
          color='white'
          fontWeight={'700'}
          fontSize={'18px'}
          p='25px'
          textTransform='uppercase'>
          {groups}
        </Text>
      </Box>
    </Flex>
  );
};

export default CategoryCard;
