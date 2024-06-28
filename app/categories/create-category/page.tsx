'use client';
import React, { useState, useEffect } from 'react';
import { Formik, Form, Field} from 'formik';
import * as Yup from 'yup';
import { fetchGroups } from '@/app/utils/memberGroups/memberGroupApis';
import { IMemberGroups } from '@/app/utils/memberGroups/types/IMemberGroup';
import { fetchProfiles } from '@/app/utils/memberProfiles/memberProfilesApis';
import { IMemberProfiles } from '@/app/utils/memberProfiles/types/IMemberProfiles';
import { Button, useToast, FormControl, FormLabel, FormErrorMessage, Input, Select, VStack, Skeleton, Flex, Heading } from '@chakra-ui/react';
import { CategoryRequestBody } from '@/app/utils/categories/types/CategoryRequestBody';
import { createCategories } from '@/app/utils/categories/categoriesApis';
import GeneralLayout from '@/app/components/generalLayout';
import mongoose from 'mongoose';

const CreateCategoryForm = () => {
  const [groups, setGroups] = useState<IMemberGroups | null>(null);
  const [profiles, setProfiles] = useState<IMemberProfiles | null>(null);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const toast = useToast();

  useEffect(() => {
    // Fetch member groups and member profiles when component mounts
    setLoadingGroups(true);
    setLoadingProfiles(true);
    fetchGroups()
      .then(data => setGroups(data))
      .catch(error => console.error('Error fetching groups:', error))
      .finally(() => setLoadingGroups(false));

    fetchProfiles()
      .then(data => setProfiles(data))
      .catch(error => console.error('Error fetching profiles:', error))
      .finally(() => setLoadingProfiles(false));
  }, []);

  const validationSchema = Yup.object().shape({
    categoryName: Yup.string().required('Category name is required'),
    description: Yup.string().required('Description is required'),
  });

  const handleSubmit = async (values: CategoryRequestBody, actions: { resetForm: () => void; }) => {
    try {
      // Handle form submission
      console.log('Form submitted:', values);
      // Call API to create category with values
      const response = await createCategories(values as CategoryRequestBody);
      // Reset form after submission
      actions.resetForm();
      toast({
        title: response.success ? 'Category Created':'Category Creation Failed',
        description: response.message,
        status: response.success ? 'success':'error',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error creating category:', error);
      toast({
        title: 'Error',
        description: 'Failed to create category.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <GeneralLayout>
      <Flex m={8} flexDir={'column'} maxW='400px'>
        <Heading as='h2' size='lg' mb={8} color={'#202A3B'}>
          New Category
        </Heading>
        <Formik
          initialValues={{
            categoryName: '',
            memberGroups: [],
            members: [],
            leader: new mongoose.Types.ObjectId(),
            description: ''
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {(props) => (
            <Form>
              <VStack spacing={4}>
                <Field name="categoryName">
                  {({ field, form }: any) => (
                    <FormControl isInvalid={!!form.errors.categoryName}>
                      <FormLabel htmlFor='categoryName'>Category Name *</FormLabel>
                      <Input {...field} id='categoryName' placeholder='Category Name' />
                      <FormErrorMessage>{form.errors.categoryName}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="description">
                  {({ field, form }: any) => (
                    <FormControl isInvalid={!!form.errors.description}>
                      <FormLabel htmlFor='description'>Description *</FormLabel>
                      <Input {...field} id='description' placeholder='Description' />
                      <FormErrorMessage>{form.errors.description}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="groupLeader">
                  {({ field, form }: any) => (
                    <FormControl isInvalid={!!form.errors.groupLeader}>
                      <FormLabel htmlFor='groupLeader'>Group Leader </FormLabel>
                      {loadingProfiles ? (
                        <Skeleton height='20px' />
                      ) : (
                        <Select {...field} id='groupLeader' placeholder='Select Group Leader'>
                          {groups?.data?.map(group => (
                            <option key={`${group._id}`} value={`${group._id}`}>{group.groupName}</option>
                          ))}
                        </Select>
                      )}
                      <FormErrorMessage>{form.errors.groupLeader}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="category">
                  {({ field, form }: any) => (
                    <FormControl isInvalid={!!form.errors.category}>
                      <FormLabel htmlFor='members'>Members</FormLabel>
                      {loadingGroups ? (
                        <Skeleton height='20px' />
                      ) : (
                        <Select {...field} id='members' placeholder='Select Members' padding={2} multiple>
                          {profiles?.data?.map(profile => (
                            <option key={`${profile._id}`} value={`${profile._id}`}>{profile.name}</option>
                          ))}
                        </Select>
                      )}
                      <FormErrorMessage>{form.errors.category}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Button type='submit' colorScheme='blue' isLoading={props.isSubmitting}>
                  Create Category
                </Button>
              </VStack>
            </Form>
          )}
        </Formik>
      </Flex>
    </GeneralLayout>
  );
};

export default CreateCategoryForm;
