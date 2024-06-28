'use client';  
import React, { useState, useEffect } from 'react';
import { 
    useReactTable, 
   getCoreRowModel, 
   getPaginationRowModel, 
   getSortedRowModel, 
   flexRender,
   getExpandedRowModel,
   getFacetedMinMaxValues,
   getFacetedRowModel,
   getFacetedUniqueValues,
   getFilteredRowModel,
   getGroupedRowModel
  } from '@tanstack/react-table'; 
import GeneralLayout from '../components/generalLayout';
import { Flex, Skeleton, Text } from '@chakra-ui/react';
import { Button } from '../components/button';
import { IMemberProfiles } from '../utils/memberProfiles/types/IMemberProfiles';
import { fetchProfiles } from '../utils/memberProfiles/memberProfilesApis';


const Profile = () => {
  const [profiles, setProfiles] = useState<IMemberProfiles | null>(null); // State to store fetched profiles

  useEffect(() => {
    // Fetch profiles from the API endpoint
    const fetchProfileData = async () => {
      try {
        const profileData = await fetchProfiles();
        setProfiles(profileData); // Update state with fetched profiles
      } catch (error) {
        console.error('Error fetching profiles:', error);
      }
    };

    fetchProfileData(); // Call the function to fetch profiles when the component mounts
  }, []);

  // Define columns for the table
  const columns = [
    { header: 'Name', accessorKey: 'name' },
    { header: 'Date of Birth', accessorKey: 'dateOfBirth' },
    { header: 'Gender', accessorKey: 'gender' },
    { header: 'Marital Status', accessorKey: 'maritalStatus' },
    { header: 'Occupation', accessorKey: 'occupation' },
    // Add more columns for other fields as needed
  ];

  const data = profiles?.data || [];  
  const tableInstance = useReactTable({ 
     columns, 
     data, 
     getCoreRowModel: getCoreRowModel(),
     getExpandedRowModel: getExpandedRowModel(),
     getFacetedMinMaxValues: getFacetedMinMaxValues(),
     getFacetedRowModel: getFacetedRowModel(),
     getFacetedUniqueValues: getFacetedUniqueValues(),
     getFilteredRowModel: getFilteredRowModel(),
     getGroupedRowModel: getGroupedRowModel(),
     getPaginationRowModel: getPaginationRowModel(),
     getSortedRowModel: getSortedRowModel(),
   }); 


// Inside the Profile component
if (!profiles) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
      <Skeleton height="20px" my="4" />
      <Skeleton height="20px" my="4" />
      <Skeleton height="20px" my="4" />
    </div>
  );
}

// After the table is rendered
{!profiles.success && (
  <Text color="red.500" my="4">
    {profiles.message || 'Failed to fetch profiles'}
  </Text>
)} 

  return (
    <GeneralLayout>
      <Flex direction={'column'} p={8}>
        <Flex justify={'space-between'} align={'center'} px={5} w='100%' mb={8}>
          <Text fontSize='18px' fontWeight={500}>
            Profile
          </Text>
          <Flex gap={4} justify={'flex-end'}>
            <Button
              mt='0'
              path='/profile/create-profile'
              text='Create Profile'
              bg={'#202A3B'}
              border={'none'}
              color='#fff'
              h='43px'
            />
          </Flex>
        </Flex>
        {/* Render the React Table */}
        <table style={{ border: '1px solid #ccc', borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          {tableInstance?.getHeaderGroups().map(headerGroup => {
            return (
              <tr key={headerGroup?.id}>
                {headerGroup?.headers.map(header => ( // map over the headerGroup headers array
                  <th key={header.id} colSpan={header.colSpan}>
                    {/* */}
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            )
          })}
        </thead>
        <tbody>
          {tableInstance?.getRowModel()?.rows.map(row => (
            <tr key={row?.id}>
            {row?.getVisibleCells().map(cell => {
              return <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
            })}
          </tr>
          ))}
        </tbody>
        </table>
      </Flex>
    </GeneralLayout>
  );
};

export default Profile;


