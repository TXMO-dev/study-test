'use client';
import React from 'react';
import { Formik, FormikProps } from 'formik';
import * as yup from 'yup';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Flex,
  Heading,
  IconButton,
  InputGroup,
  InputLeftElement,
  Link,
  Select,
  Text,
  Textarea,
  SimpleGrid,
  useClipboard,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';

import { BsGithub, BsLinkedin, BsPerson, BsCalendarDate } from 'react-icons/bs';
import { MdEmail, MdOutlineEmail } from 'react-icons/md';

interface ProfileInput {
  name: string;
  dateOfBirth: Date;
  gender: 'Male' | 'Female' | 'Other'; // Assuming a select with these options
  occupation: string;
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  label: string;
  value: string;
}

const genderOptions = ['Male', 'Female'];
const marritalStatusOptions = ['Single', 'Married', 'Divorced', 'Widowed'];

const initialValues: ProfileInput[] = Array(5).fill({ label: '', value: '' });

const validationSchema = yup.object().shape({
  // Define validation rules for each input here (optional)
});

const AddMemberProfile: React.FC = () => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(data) => {
        const filteredData = data.filter(
          (item) => item.label.trim() !== '' && item.value.trim() !== ''
        );
        console.log('Profile data:', filteredData);
        // You can handle form submission here (e.g., send to API)
      }}>
      {(props: FormikProps<ProfileInput[]>) => {
        const { values, handleChange, handleSubmit } = props;

        return (
          <Box as='form' onSubmit={handleSubmit} >
            <Box
              bg={['white']}
              borderRadius='lg'
              p={8}
              color={['gray.700']}
              shadow='base'>
              <Text as={'h2'}>New Profile</Text>
              {/* <VStack spacing={5}> */}
        <SimpleGrid mt={2} w={'100%'} minChildWidth={'200px'}>
                <FormControl isRequired maxW='350px'>
                  <FormLabel>Name</FormLabel>
                  <InputGroup>
                    <InputLeftElement>
                      <BsPerson />
                    </InputLeftElement>
                    <Input type='text' name='name' placeholder='Your Name' />
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Date of Birth</FormLabel>
                  <InputGroup >
                    <InputLeftElement>
                      <BsCalendarDate />
                    </InputLeftElement>
                    <Input type='date' name='dob' />
                  </InputGroup>
                </FormControl>
                <FormControl isRequired>

                <FormLabel htmlFor='gender'>Gender</FormLabel>
                <Select
                  id='gender'
                  name='gender'
                  // value={props.values}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  placeholder='Select'>
                  {genderOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
                </FormControl>

                <FormControl isRequired >
                <FormLabel htmlFor='maritalStaus'>Marital Status</FormLabel>
                <Select
                  id='maritalStaus'
                  name='maritalStaus'
                  // value={props.values}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  placeholder='Select'>
                  {marritalStatusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
                </FormControl>
                
                <FormControl isRequired >
                  <FormLabel>Occupation</FormLabel>
                  <InputGroup>
                    <Input type='text' name='occupation' placeholder='Your Occupation' />
                  </InputGroup>
                </FormControl>
                <FormControl isRequired maxW='350px'>
                  <FormLabel>Message</FormLabel>

                  <Textarea
                    name='message'
                    placeholder='Your Message'
                    rows={6}
                    resize='none'
                  />
                </FormControl>

                <Button
                  colorScheme='blue'
                  bg='blue.400'
                  color='white'
                  _hover={{
                    bg: 'blue.500',
                  }}>
                  Create
                </Button>
                </SimpleGrid>
              {/* </VStack> */}
            </Box>
            {/* {values.map((input, index) => (
              <FormControl key={index} mb={4}>
                <FormLabel htmlFor={`input-${index}`}>{input.label}</FormLabel>
                <Input
                  id={`input-${index}`}
                  name={`[${index}].label`}
                  value={values[index].label}
                  onChange={handleChange}
                  placeholder={`Label ${index + 1}`}
                />
                <Input
                  mt={2}
                  id={`value-${index}`}
                  name={`[${index}].value`}
                  value={values[index].value}
                  onChange={handleChange}
                  placeholder={`Value ${index + 1}`}
                />
              </FormControl>
            ))} */}
            <Button type='submit' colorScheme='blue'>
              Create Profile
            </Button>
          </Box>
        );
      }}
    </Formik>
  );
};

export default AddMemberProfile;
