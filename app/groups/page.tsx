'use client';  
import React, { useState, useEffect } from 'react';
import { 
    useReactTable, 
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table'; 
import GeneralLayout from '../components/generalLayout';
import { Flex, Skeleton, Text } from '@chakra-ui/react';
import { Button } from '../components/button';
import { IMemberGroups } from '../utils/memberGroups/types/IMemberGroup';
import { fetchGroups } from '../utils/memberGroups/memberGroupApis';

const MemberGroups = () => {
    const [groups, setGroups] = useState<IMemberGroups | null>(null); // State to store fetched member groups

    useEffect(() => {
        // Fetch member groups from the API endpoint
        const fetchGroupData = async () => {
            try {
                const groupData = await fetchGroups();
                setGroups(groupData); // Update state with fetched member groups
            } catch (error) {
                console.error('Error fetching member groups:', error);
            }
        };

        fetchGroupData(); // Call the function to fetch member groups when the component mounts
    }, []);

    // Define columns for the table
    const columns = [
        { header: 'Group Name', accessorKey: 'groupName' },
        { header: 'Number of Members', accessorKey: 'members.length' },
        { header: 'Category', accessorKey: 'categoryid.categoryName' },
        { header: 'Leader', accessorKey: 'leader.name' },
        { header: 'Created At', accessorKey: 'createdAt' },
        { header: 'Updated At', accessorKey: 'updatedAt' },
    ];

    const data = groups?.data || [];  
    const tableInstance = useReactTable({ 
        columns, 
        data, 
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    }); 

    // Skeleton component while data is loading
    if (!groups) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
                <Skeleton height="20px" my="4" />
                <Skeleton height="20px" my="4" />
                <Skeleton height="20px" my="4" />
            </div>
        );
    }

    // Display error message if member groups fetch failed
    if (!groups.success) {
        return (
            <Text color="red.500" my="4">
                {groups.message || 'Failed to fetch member groups'}
            </Text>
        );
    }

    // Render the table
    return (
        <GeneralLayout>
            <Flex direction={'column'} p={8}>
                <Flex justify={'space-between'} align={'center'} px={5} w='100%' mb={8}>
                    <Text fontSize='18px' fontWeight={500}>
                        Member Groups
                    </Text>
                    <Flex gap={4} justify={'flex-end'}>
                        <Button
                            mt='0'
                            path=''
                            text='Create Group'
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

export default MemberGroups;  
