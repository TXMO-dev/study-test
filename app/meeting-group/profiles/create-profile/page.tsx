'use client';
import React from 'react';
import { createProfile } from '@/app/utils/memberProfiles/memberProfilesApis';
import { Formik, FormikProps } from 'formik';
import * as yup from 'yup';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Flex,
  InputGroup,
  InputLeftElement,
  Select,
  useToast,
  Text,
  SimpleGrid,
} from '@chakra-ui/react';
import { BsPerson, BsCalendarDate } from 'react-icons/bs';
import TopNav from '@/app/components/meeting-top-nav';
import { useRouter } from 'next/navigation';
import { MemberProfileRequestBody } from '@/app/utils/memberProfiles/types/MemberProfileRequestBody';
import FormikImageUpload from '@/app/components/img-uploader';

interface ProfileInput {
  label: string;
  value: string;
}

interface ProfileFormValues {
  name: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female';
  occupation: string;
  imageurl: '';
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  profileInputs: ProfileInput[];
}

const genderOptions = ['Male', 'Female'];
const maritalStatusOptions = ['Single', 'Married', 'Divorced', 'Widowed'];

const initialValues: ProfileFormValues = {
  name: '',
  dateOfBirth: '',
  gender: 'Male',
  occupation: '',
  maritalStatus: 'Single',
  imageurl: '',
  profileInputs: Array(5).fill({ label: '', value: '' }),
};

const validationSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  gender: yup.string().required('Gender is required').oneOf(genderOptions),
  maritalStatus: yup
    .string()
    .required('Marital status is required')
    .oneOf(maritalStatusOptions),
  occupation: yup.string(),
  dateOfBirth: yup
    .string()
    .required('Date of Birth is required')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Use YYYY-MM-DD.'),
  
});

const AddProfile: React.FC = () => {
  const router = useRouter();
  const toast = useToast();

  const handleSubmitForm = async (
    values: ProfileFormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      const data = await createProfile(values as any);

      // Display success message
      toast({
        title: data.success ? 'Profile Created': 'Profile Failed',
        description: data.message,
        status: data.success ? 'success':'error',
        duration: 3000,
        isClosable: true,
      });
      router.push('/meeting-group/profiles'); // Redirect to profiles page or another appropriate page
    } catch (error) {
      console.error('Error creating profile:', error);

      // Display error message
      toast({
        title: 'Error',
        description: 'Failed to create profile',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Flex flexDir={'column'}>
      <TopNav />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmitForm}>
        {(props: FormikProps<ProfileFormValues>) => {
          const {
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue,
          } = props;

          return (
            <Flex justify={'center'}>
              <Box as='form' onSubmit={handleSubmit} w={'100%'} maxW={'900px'}>
                <Text
                  align={'center'}
                  fontSize={'35px'}
                  fontWeight={'700'}
                  p={5}
                  textTransform='uppercase'>
                  Create Profile
                </Text>
                <Box
                  bg={['white']}
                  borderRadius='lg'
                  p={8}
                  color={['gray.700']}
                  shadow='base'>
                  <SimpleGrid
                    mt={2}
                    templateColumns={['1fr', 'repeat(2, 1fr)']}
                    columnGap={20}
                    rowGap={6}
                    minChildWidth={'200px'}>
                    <FormControl isRequired>
                      <FormLabel>Name</FormLabel>
                      <InputGroup>
                        <InputLeftElement>
                          <BsPerson />
                        </InputLeftElement>
                        <Input
                          type='text'
                          name='name'
                          placeholder='Your Name'
                          value={values.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </InputGroup>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Date of Birth</FormLabel>
                      <InputGroup>
                        <InputLeftElement>
                          <BsCalendarDate />
                        </InputLeftElement>
                        <Input
                          type='date'
                          name='dateOfBirth'
                          value={values.dateOfBirth}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </InputGroup>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel htmlFor='gender'>Gender</FormLabel>
                      <Select
                        id='gender'
                        name='gender'
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.gender}
                        placeholder='Select'>
                        {genderOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel htmlFor='maritalStatus'>
                        Marital Status
                      </FormLabel>
                      <Select
                        id='maritalStatus'
                        name='maritalStatus'
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.maritalStatus}
                        placeholder='Select'>
                        {maritalStatusOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Occupation</FormLabel>
                      <InputGroup>
                        <Input
                          type='text'
                          name='occupation'
                          placeholder='Your Occupation'
                          value={values.occupation}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </InputGroup>
                    </FormControl>

                    {values.profileInputs.map((input, index) => (
                      <FormControl key={index} mb={4}>
                        <FormLabel htmlFor={`profileInputs.${index}.label`}>
                          Label {index + 1}
                        </FormLabel>
                        <Input
                          id={`profileInputs.${index}.label`}
                          name={`profileInputs.${index}.label`}
                          value={values.profileInputs[index].label}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder={`Label ${index + 1}`}
                        />
                        <Input
                          mt={2}
                          id={`profileInputs.${index}.value`}
                          name={`profileInputs.${index}.value`}
                          value={values.profileInputs[index].value}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder={`Value ${index + 1}`}
                        />
                      </FormControl>
                    ))}
                    <FormControl>
                      <FormikImageUpload
                        initialValue=''
                        name='imageurl'
                        placeholder='Upload Image'
                        uploadPreset='profile-pictures'
                        setFieldValue={setFieldValue}
                      />
                    </FormControl>
                  </SimpleGrid>
                  <Flex
                    maxW={['350px', '400px']}
                    m={'auto'}
                    justify={'space-between'}
                    py={10}>
                    <Button
                      w={'160px'}
                      bg='#202A3B'
                      type='submit'
                      color='white'
                      _hover={{
                        bg: '#202A3B',
                      }}
                      isLoading={isSubmitting}>
                      Save
                    </Button>
                    <Button
                      w={'160px'}
                      bg='red'
                      color='white'
                      _hover={{
                        bg: 'red',
                      }}
                      onClick={() => router.back()}>
                      Cancel
                    </Button>
                  </Flex>
                </Box>
              </Box>
            </Flex>
          );
        }}
      </Formik>
    </Flex>
  );
};

export default AddProfile;
