'use client';
import {
  Flex,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
  Text,
  Input,
  Switch,
  FormControl,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import React from 'react';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingFn,
  SortingState,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
  FilterFn,
} from '@tanstack/react-table';
import { FiArrowDown, FiUser, FiSearch } from 'react-icons/fi';
import { IoFilter } from 'react-icons/io5';

const sortStatusFn: SortingFn<any> = (rowA, rowB, _columnId) => {
  const statusA = rowA.original.status;
  const statusB = rowB.original.status;
  const statusOrder = ['single', 'complicated', 'relationship'];
  return statusOrder.indexOf(statusA) - statusOrder.indexOf(statusB);
};

const DashboardTable = ({ usersData }: any) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = React.useState('');

  const columns = React.useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'username',
        header: ({ column }) => {
          return (
            <Button
              variant='link'
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              color='brand.gray800'
              fontSize='12px'
              fontWeight='700'
              gap='1'
            >
              Users
              <FiArrowDown fontSize='16px' />
            </Button>
          );
        },
        cell: (info): React.ReactNode => (
          <Flex alignItems='center' gap='1'>
            <Flex
              w='40px'
              h='40px'
              borderRadius='30px'
              bg='#F2F4F7'
              alignItems='center'
              justifyContent='center'
            >
              <FiUser />
            </Flex>
            {info.getValue() as string}
          </Flex>
        ),
      },
      {
        accessorKey: 'status',
        header: ({ column }) => {
          return (
            <Button
              variant='link'
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              color='brand.gray800'
              fontSize='12px'
              fontWeight='700'
              gap='1'
            >
              Status
              <FiArrowDown fontSize='16px' />
            </Button>
          );
        },
      },
      {
        accessorKey: 'favourite',
        header: ({ column }) => {
          return (
            <Button
              variant='link'
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              color='brand.gray800'
              fontSize='12px'
              fontWeight='700'
              gap='1'
            >
              Favourited
              <FiArrowDown fontSize='16px' />
            </Button>
          );
        },
      },

      {
        accessorKey: 'reports',
        header: ({ column }) => {
          return (
            <Button
              variant='link'
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              color='brand.gray800'
              fontSize='12px'
              fontWeight='700'
              gap='1'
            >
              Reported
              <FiArrowDown fontSize='16px' />
            </Button>
          );
        },
      },
      {
        accessorKey: 'registerDate',
        header: ({ column }) => {
          return (
            <Button
              variant='link'
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              color='brand.gray800'
              fontSize='12px'
              fontWeight='700'
              gap='1'
            >
              Registered
              <FiArrowDown fontSize='16px' />
            </Button>
          );
        },
      },
      {
        id: 'actions',
        // enableHiding: false, //
        header: () => (
          <Text
            color='brand.gray800'
            fontSize='12px'
            fontWeight='700'
            textTransform='capitalize'
          >
            {' '}
            Activate / Deactivate
          </Text>
        ),
        cell: ({ row }) => {
          const user = row.original;
          return (
            <FormControl
              display='flex'
              alignItems='center'
              justifyContent='center'
            >
              <Switch id='email-alerts' />
            </FormControl>
          );
        },
      },
    ],
    []
  );

  const [data, setData] = React.useState(() => [...usersData]);
//   const refreshData = () => setData(() => usersData(100_000)); //stress test with 100k rows

  const table = useReactTable({
    columns,
    data,
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(), //client-side sorting
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    // globalFilterFn: fuzzyFilter,
    onSortingChange: setSorting, //optionally control sorting state in your own scope for easy access
    state: {
      sorting,
      pagination,
      globalFilter,
    },
  });

  return (
    <Flex bg='white' shadow='sm' borderRadius='12px' flexDir='column'>
      <Flex p='5' flexDir='row' justifyContent='flex-end' gap='3' py='8'>
        <Button
        variant='outlined'
          w='103px'
          h='44px'
          color='#344054'
          borderRadius='8px'
          borderWidth={1}
          borderColor='brand.gray'
          fontSize='14px'
          gap='1'
        >
          <IoFilter />
          Filters
        </Button>
        <InputGroup w='255px'>
          <InputLeftElement pointerEvents='none' mt='1'>
            <FiSearch color='#344054' />
          </InputLeftElement>
          <Input
            w='255px'
            h='44px'
            maxW='100%'
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder='Search'
            color='#344054'
            borderRadius='8px'
            borderWidth={1}
            borderColor='brand.gray'
          />
        </InputGroup>
      </Flex>
      <TableContainer w='100%'>
        <Table>
          <Thead
            bg='#FCFCFD'
            p='5'
            borderBottomWidth={1}
            borderTopWidth={1}
            borderColor='#EAECF0'
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table
              .getRowModel()
              .rows.slice(0, 10)
              .map((row) => (
                <Tr key={row.id} fontSize='12px'>
                  {row.getVisibleCells().map((cell) => (
                    <Td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Td>
                  ))}
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Flex
        flexDir='row'
        alignItems='center'
        justifyContent='space-between'
        p='5'
      >
        <Flex gap='1'>
          <Text fontSize='14px' color='brand.grey500' fontWeight='500'>
            Page
          </Text>
          <Text fontSize='14px' color='brand.grey500' fontWeight='500'>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount().toLocaleString()}
          </Text>
        </Flex>
        {/* <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              table.setPageIndex(page)
            }}
            className="border p-1 rounded w-16"
          />
        </span> */}
        <Flex gap='3'>
          <Button
            borderRadius='8px'
            h='36px'
            borderWidth={1}
            borderColor='brand.gray'
            variant='outlined'
            color='brand.grey500'
            fontSize='14px'
            fontWeight='600'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            borderRadius='8px'
            h='36px'
            borderWidth={1}
            borderColor='brand.gray'
            variant='outlined'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            color='brand.grey500'
            fontSize='14px'
            fontWeight='600'
          >
            Next
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default DashboardTable;