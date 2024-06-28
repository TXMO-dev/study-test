'use client';
import GeneralLayout from "@/app/components/generalLayout";
import { fetchCategories } from "@/app/utils/categories/categoriesApis";
import { ICategories } from "@/app/utils/categories/types/ICategory";
import { createGroup } from "@/app/utils/memberGroups/memberGroupApis";
import { fetchProfiles } from "@/app/utils/memberProfiles/memberProfilesApis";
import { IMemberProfiles } from "@/app/utils/memberProfiles/types/IMemberProfiles";
import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, Select, Skeleton, VStack, useToast } from "@chakra-ui/react";
import { Formik, FormikHelpers } from "formik";
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, AwaitedReactNode, Key, useState, useEffect } from "react";
import * as yup from 'yup';

// Define shape of form values
interface FormValues {
  groupName: string;
  groupLeader: string;
  category: string;
}

const CreateGroup = () => {
  const toast = useToast();
  const [groupLeaderOptions, setGroupLeaderOptions] = useState<IMemberProfiles>({} as any);
  const [categoryOptions, setCategoryOptions] = useState<ICategories>({} as any);
  const [isLoading, setIsLoading] = useState(true); // Add loading state for both options

  useEffect(() => {
    // Fetch data for dropdown options
    Promise.all([fetchProfiles(), fetchCategories()]).then(([profiles, categories]) => {
      setGroupLeaderOptions(profiles);
      setCategoryOptions(categories);
      setIsLoading(false); // Set loading to false after data is fetched
    });
  }, []);

  // Validation schema and submit handler remain the same
  const validationSchema = yup.object().shape({
    groupName: yup.string().required('Group Name is required'),
    groupLeader: yup.string().required('Group Leader is required'),
    category: yup.string().required('Category is required'),
  });

  const handleSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    // Handle form submission
    console.log('Form submitted:', values);
    try {
      const response = await createGroup(values as any);
      // Display toaster based on response
      toast({
        title: response.success ? 'Group Created' : 'Error',
        description: response.message,
        status: response.success ? 'success' : 'error',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error creating group:', error);
      // Display error toaster if there's an error during group creation
      toast({
        title: 'Error',
        description: 'Failed to create group',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      // Always set form submission state to false
      actions.setSubmitting(false);
    }
  };
  return (
    <GeneralLayout>
      <Flex m={8} flexDir={'column'} maxW='400px'>
        <Heading as='h2' size='lg' mb={8} color={'#202A3B'}>
          New Group
        </Heading>
        <Formik
          initialValues={{
            groupName: '',
            groupLeader: '',
            category: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit}>
              <VStack spacing={4}>
                <FormControl isInvalid={!!props.errors.groupName} mb={4}>
                  <FormLabel htmlFor='groupName'>Group Name</FormLabel>
                  <Input
                    id='groupName'
                    name='groupName'
                    type='text'
                    value={props.values.groupName}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                  />
                  <FormErrorMessage>{props.errors.groupName}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!props.errors.groupLeader} mb={4}>
                  <FormLabel htmlFor='groupLeader'>Group Leader</FormLabel>
                  {isLoading ? ( // Display skeleton if loading
                    <Skeleton height='20px' />
                  ) : (
                    <Select
                      id='groupLeader'
                      name='groupLeader'
                      value={props.values.groupLeader}
                      onChange={(e) => {
                        const selectedLeaderId = e.target.value;
                        console.log('this is the selected ID', selectedLeaderId);
                        props.setFieldValue('groupLeader', selectedLeaderId); // Set the ID as the selected value
                      }}
                      onBlur={props.handleBlur}
                      placeholder='Select Leader'
                    >
                      {groupLeaderOptions?.data?.map((option: { _id: any; name: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; }) => (
                        <option key={`${option._id}`} value={`${option._id}`}>
                          {option.name}
                        </option>
                      ))}
                    </Select>
                  )}
                  <FormErrorMessage>{props.errors.groupLeader}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!props.errors.category} mb={4}>
                  <FormLabel htmlFor='category'>Category</FormLabel>
                  {isLoading ? ( // Display skeleton if loading
                    <Skeleton height='20px' />
                  ) : (
                    <Select
                      id='category'
                      name='category'
                      value={props.values.category}
                      onChange={(e) => {
                        const selectedCategoryId = e.target.value;
                        props.setFieldValue('category', selectedCategoryId); // Set the ID as the selected value
                      }}
                      onBlur={props.handleBlur}
                      placeholder='Select Category'
                    >
                      {categoryOptions?.data?.map((option: { _id: Key | readonly string[] | null | undefined; categoryName: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; }) => (
                        <option key={`${option._id}`} value={`${option._id}`}>
                          {option.categoryName}
                        </option>
                      ))}
                    </Select>
                  )}
                  <FormErrorMessage>{props.errors.category}</FormErrorMessage>
                </FormControl>
                <Flex justify={'space-between'} w='100%'>
                  <Button
                    _hover={{
                      bgColor: '#202A3B',
                    }}
                    type='submit'
                    color='#fff'
                    bgColor={'#202A3B'}
                    isLoading={props.isSubmitting}
                    loadingText="Submitting..."
                    isDisabled={!props.isValid || props.isSubmitting}
                  >
                    Create Group
                  </Button>
                </Flex>
              </VStack>
            </form>
          )}
        </Formik>
      </Flex>
    </GeneralLayout>
  );
};

export default CreateGroup;
