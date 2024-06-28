'use client';
import { useState } from 'react';
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  Link,  
  Avatar,
  Text,
  FormControl,
  FormHelperText,
  InputRightElement,
} from '@chakra-ui/react';
import { FaUserAlt, FaLock } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const App = () => {
  const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()

  const handleShowClick = () => setShowPassword(!showPassword);

  return (
    <Flex
      flexDirection='column'
      width='100wh'
      height='100vh'
      backgroundColor='gray.200'
      justifyContent='center'
      alignItems='center'>
      <Stack
        flexDir='column'
        mb='2'
        minH={'300px'}
        justifyContent='center'
        bgColor={'#fff'}
        borderRadius='6px'
        alignItems='center'>
        <Avatar />
        <Text fontSize={'30px'} fontWeight={'500'}>Welcome Admin</Text>
        <Box minW={{ base: '60%', md: '400px' }}>
          <form>
            <Stack spacing={4} p='1.5rem'>
             
              <FormControl mb={3}>
                
              </FormControl>
              <Button
                _hover={{
                  bgColor: 'Black',
                }}
                borderRadius={4}
                as={Link}
                href='/api/auth/login'
                variant='solid'
                color='white'
                bgColor='Black'
                fontSize={'22px'}
                width='full'>
                Login
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
     </Flex>
  );
};

export default App;
