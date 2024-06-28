'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateProfile, fetchProfileByID, deleteProfile } from '@/app/utils/memberProfiles/memberProfilesApis';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import {
  Box,
  Flex,
  Button,
  useToast,
  FormControl,
  FormLabel,
  Input,
  InputLeftElement,
  Select,
  InputGroup,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  SimpleGrid
} from '@chakra-ui/react';
import { BsPerson, BsCalendarDate, BsTrash } from 'react-icons/bs';
import FormikImageUpload from '@/app/components/img-uploader';
import { IMemberProfile } from '@/app/utils/memberProfiles/types/IMemberProfiles';
import TopNav from '@/app/components/meeting-top-nav';

const genderOptions = ['Male', 'Female'];
const maritalStatusOptions = ['Single', 'Married', 'Divorced', 'Widowed'];

const UpdateProfile = ({ params }: { params: { id: string } }) => {
  const toast = useToast();
  const router = useRouter();
  const id = params.id;
  const [profile, setProfile] = useState<IMemberProfile['data'] | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const fetchedProfile = await fetchProfileByID(id as string);
        // Ensure profileInputs is always an array of 5 elements
        if (fetchedProfile.data.profileInputs.length < 5) {
          const remainingEmptySlots = 5 - fetchedProfile.data.profileInputs.length;
          for (let i = 0; i < remainingEmptySlots; i++) {
            fetchedProfile.data.profileInputs.push({ label: '', value: '' });
          }
        }
        setProfile(fetchedProfile.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    if (id) {
      fetchProfile();
    }
  }, [id]);

  const validationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    gender: yup.string().required('Gender is required').oneOf(genderOptions),
    maritalStatus: yup.string().required('Marital status is required').oneOf(maritalStatusOptions),
    occupation: yup.string(),
    dateOfBirth: yup.string().required('Date of Birth is required').matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Use YYYY-MM-DD.'),
  }); 

  const handleSubmitForm = async (values: IMemberProfile['data'], { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      const data = await updateProfile(values, id as string);
      toast({
        title: data.success ? 'Profile Updated' : 'Profile Update Failed',
        description: data.message,
        status: data.success ? 'success' : 'error',
        duration: 3000,
        isClosable: true,
      });

      if (data.success) {
        router.push('/meeting-group/profiles');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again later.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProfile = async () => {
    try {
      const data = await deleteProfile(id as string);
      if (data.success) {
        toast({
          title: 'Profile Deleted',
          description: 'Profile successfully deleted.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        router.push('/meeting-group/profiles');
      } else {
        toast({
          title: 'Error Deleting Profile',
          description: 'Failed to delete profile. Please try again later.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
      toast({
        title: 'Error Deleting Profile',
        description: 'An error occurred while deleting profile. Please try again later.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setShowDeleteModal(false); // Close the modal regardless of success or failure
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <Flex flexDir={'column'}>
      <TopNav id={id as string} />
      <Formik
        initialValues={profile}
        validationSchema={validationSchema}
        onSubmit={handleSubmitForm}
        enableReinitialize
      >
        {(props) => {
          const {
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue,
          } = props;

          return (
            <Flex mt={4} justify={'center'}>
              <Box as='form' onSubmit={handleSubmit} maxW={'900px'}>
                <Box bg={['white']} borderRadius='lg' p={8} color={['gray.700']} shadow='base'>
                  <Flex flexDir="column" align="center" justify="center">
                  <Button
                    mt={-8}
                    ml={'auto'}
                    onClick={() => setShowDeleteModal(true)}
                    colorScheme='red'
                    size='sm'
                    leftIcon={<BsTrash />}
                  >
                    Delete Profile
                  </Button>
                  <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>Are you sure?</ModalHeader>
                      <ModalBody>
                        <p>Are you sure you want to delete this profile?</p>
                      </ModalBody>
                      <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={() => setShowDeleteModal(false)}>
                          Cancel
                        </Button>
                        <Button colorScheme="red" onClick={handleDeleteProfile}>
                          Delete
                        </Button>
                      </ModalFooter>
                    </ModalContent>
                    </Modal>
                    <SimpleGrid
                    mt={2}
                    templateColumns={['1fr','repeat(2, 1fr)']}
                    columnGap={20}
                    rowGap={6}
                    minChildWidth={'200px'}>
                    <FormControl className='mb-[2rem]' isRequired>
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

                    <FormControl className='mb-[2rem]' isRequired>
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

                    <FormControl
                      className='mb-[2rem]' isRequired>
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

                      <FormControl className='mb-[2rem]' isRequired>
                      <FormLabel htmlFor='maritalStatus'>Marital Status</FormLabel>
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

                      <FormControl className='mb-[2rem]'>
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
                      <FormControl className='mb-[2rem] last:mb-[0rem]' key={index} mb={4}>
                        <FormLabel htmlFor={`profileInputs.${index}.label`}>
                          Label {index + 1}
                        </FormLabel>
                        <Input
                          id={`profileInputs.${index}.label`}
                          name={`profileInputs.${index}.label`}
                          value={input.label}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder={`Label ${index + 1}`}
                        />
                        <Input
                          mt={2}
                          id={`profileInputs.${index}.value`}
                          name={`profileInputs.${index}.value`}
                          value={input.value}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder={`Value ${index + 1}`}
                        />
                      </FormControl>
                      ))}

                      <FormikImageUpload
                      initialValue={values.imageurl || ''}
                      name='imageurl'
                      placeholder='Upload Image'
                      uploadPreset='profile-pictures'
                      setFieldValue={setFieldValue}
                      />
                      </SimpleGrid>
                      </Flex>
                      <Flex maxW='400px' m={'auto'} justify={'space-between'} py={10}>
                      <Button
                      w={'160px'}
                      bg='#202A3B'
                      type='submit'
                      color='white'
                      _hover={{ bg: '#202A3B' }}
                      isLoading={isSubmitting}
                      >
                      Save
                      </Button>
                      <Button
                      w={'160px'}
                      bg='red'
                      color='white'
                      _hover={{ bg: 'red' }}
                      onClick={() => router.back()}
                      >
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

                      export default UpdateProfile;
