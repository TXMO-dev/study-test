'use client';
import React, { useState, useEffect } from 'react';
import { 
  Flex, Text, SimpleGrid, Input, Button, useToast, Box, Select, 
  Skeleton, IconButton, Menu, MenuList, MenuItem, MenuButton, 
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, 
  ModalBody, ModalFooter 
} from '@chakra-ui/react';
import MeetingProfileCard from './profile';
import { 
  assignMemberProfileToMemberGroup, createGroup, fetchGroupById, 
  fetchGroups, updateGroup 
} from '@/app/utils/memberGroups/memberGroupApis';
import { IMemberGroup, IMemberGroups } from '@/app/utils/memberGroups/types/IMemberGroup';
import { fetchProfiles } from '@/app/utils/memberProfiles/memberProfilesApis';
import { IMemberProfiles } from '@/app/utils/memberProfiles/types/IMemberProfiles';
import mongoose from 'mongoose';
import { FaPlusCircle } from 'react-icons/fa';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/navigation';
import { BiTrash } from 'react-icons/bi';
import GroupCard from './group-card';

const Groups = () => {
  const toast = useToast();
  const [isEditingGroup, setIsEditingGroup] = useState(false);
  const [groupName, setGroupName] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<IMemberGroup>({} as IMemberGroup);
  const [profiles, setProfiles] = useState<IMemberProfiles>([] as any);
  const [isSelectVisible, setIsSelectVisible] = useState(false);
  const [groups, setGroups] = useState<IMemberGroups>({} as any);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [filterValue, setFilterValue] = useState('');
  const [selectedProfileId, setSelectedProfileId] = useState<mongoose.Types.ObjectId>({} as any);
  const [modalGroupId, setModalGroupId] = useState<string | null>(null);
  const toggleSelectVisibility = () => {
    setIsSelectVisible(!isSelectVisible);
  };

  const handleEditGroup = () => {
    setIsEditingGroup(true);
  };

  const handleSaveGroup = async () => {
    console.log('Group name Created:', groupName);

    const response = await createGroup({
      groupName: groupName,
      leader: new mongoose.Types.ObjectId('60d5ec49b63b4b3d1c8b4567'), // Set the leader profile id when saving the group
    });
    toast({
      title: response.success ? 'Group Created' : 'Error',
      description: response.message,
      status: response.success ? 'success' : 'error',
      duration: 5000,
      isClosable: true,
    });
    if (response.success) {
      const group_response = await fetchGroupById(response.data._id);
      setSelectedGroup(group_response);
      console.log('this is the selected group: ', selectedGroup);
      const profileresponse = await fetchProfiles();
      setProfiles(profileresponse);
    }
    setIsEditingGroup(false);
  };

  const handleGroupNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsEditingGroup(true);
    setGroupName(event.target.value);
  };
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoadingProfiles(true);
      const profileresponse = await fetchProfiles();
      const groupresponse = await fetchGroups();
      setProfiles(profileresponse);
      setGroups(groupresponse);
      if(groupresponse.data.length === 0){
        router.push('/meeting-group/create-group');  
      }
      console.log()
      setLoadingProfiles(false);
    };

    fetchData();
  }, []);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(event.target.value);
  };

  const handleProfileClick = async (profileId: mongoose.Types.ObjectId) => {
    setSelectedProfileId(profileId); // Set the selected profile id when clicking on a profile
    const response = await assignMemberProfileToMemberGroup(selectedGroup.data._id, profileId);
    if(response.success === true){
      const updatedGroupPayload = {
        groupName: groupName,
        leader: profileId
      };
      const new_response = await updateGroup(updatedGroupPayload, selectedGroup?.data?._id);
      if(new_response.success === true){
        console.log('this is the profile response: ', response);
        toast({
          title: new_response.success ? 'The Leader has been assigned successfully.' : 'Error',
          description: new_response.message,
          status: new_response.success ? 'success' : 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }

    setIsSelectVisible(false);
  };

  // Filtered groups based on groupName
  const filteredGroups = groups.data?.filter(group => group.groupName.toLowerCase().includes(filterValue.toLowerCase()));

  const filteredProfiles = profiles?.data?.filter((profile) => {
    return profile.name.toLowerCase().includes(filterValue.toLowerCase());
  });

  const handleSearchLeadersClick = () => {
    setIsSelectVisible(true); // Open select dropdown when search leaders input is clicked
  };

  const handleDelete = async (group: IMemberGroup) => {
    try {
      const response = await fetch(`/api/delete-group/${group.data._id}`, { method: 'DELETE' });
      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Group deleted.',
          description: `The group ${group.data.groupName} has been deleted successfully.`,
          status: 'success',  
          duration: 5000,
          isClosable: true,
        });
        setModalGroupId(null); // Close the modal on success
        // Optionally, refresh the group list after deletion
        const groupresponse = await fetchGroups();
        setGroups(groupresponse);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: 'Error deleting group.',
        description: `An error occurred: ${error}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex flexDirection={'column'}
      // p={'20px'}
    >
      {/* Render the input for adding a new group name only if groups data is empty */}
      {groups.data && groups.data.length === 0 && (
        <Flex
          align={'center'}
          justify={'center'}
          mt={'30px'}
          flexDir={'column'}>
          {isEditingGroup ? (
            <>
              <Input
                w={'400px'}
                value={groupName}
                onChange={handleGroupNameChange}
                mb={3}
              />
              <Button onClick={handleSaveGroup}>Save</Button>
            </>
          ) : (
            <>
              <Text
                align={'center'}
                fontSize={'35px'}
                fontWeight={'700'}
                p={5}
                textTransform='uppercase'
                onClick={handleEditGroup}
                cursor='pointer'>
                {groupName ? groupName : 'Add Group Name'}
              </Text>
              <Box>
                {loadingProfiles ? (
                  <Skeleton height='400px' width='100%' />
                ) : // Render the selected group card
                selectedGroup.success === true ? (
                  <MeetingProfileCard
                    name={selectedGroup?.data?.leader?.name}
                    title={selectedGroup.data.groupName}
                    imageUrl={
                      selectedGroup?.data?.leader?.imageurl === undefined ||
                      selectedGroup?.data?.leader?.imageurl === null   
                        ? `https://picsum.photos/200`
                        : selectedGroup?.data?.leader?.imageurl
                    }
                    path={`/meeting-group/${selectedGroup.data._id}`}
                  />
                ) : (
                  // Render an empty card if no selected group
                  <MeetingProfileCard />
                )}
              </Box>
                <Box
                  mt={4}
                >
                {loadingProfiles ? (
                  <Skeleton height='400px' width='100%' />
                ) : (
                  <Input
                    placeholder='Search potential leaders...'
                    maxW={['300px', '400px']}
                    value={filterValue}
                    onChange={handleFilterChange}
                    onClick={handleSearchLeadersClick} // Call function to open select dropdown when input is clicked
                  />
                )}
                {isSelectVisible && (
                  <Flex
                    flexDir={'column'}
                    w={60}
                    mt={2}
                    backgroundColor='#FFFFFF'
                    boxShadow='0px 4px 8px rgba(0, 0, 0, 0.1)'
                    border='1px solid #e8e8e8'>
                    {filteredProfiles?.map((profile) => (
                      <Text
                        p={2}
                        key={`${profile._id}`}
                        _hover={{
                          backgroundColor: '#e8e8e8',
                          cursor: 'pointer',
                        }}
                        onClick={() => handleProfileClick(profile._id)} // Pass profile id when clicking
                      >
                        {profile.name}
                      </Text>
                    ))}
                  </Flex>
                )}
              </Box>
            </>
          )}
        </Flex>
      )}

      {/* Render existing groups */}
      {groups.data && groups.data.length > 0 && (
        <>
          <Text
            align={'center'}
            fontSize={'28px'}
            fontWeight={'700'}
            letterSpacing={'1px'}
            p={5}
            textTransform='uppercase'>
            Groups
          </Text>
          <Input
            placeholder='Filter by Group Name'
            value={filterValue}
            onChange={handleFilterChange}
            ml={12}
            w={'400px'}
            mb={5}
          />
          <SimpleGrid
            gridTemplateColumns='repeat(7, 1fr)'
            px={8} rowGap={2}
            justifyItems={'center'}
          >
            {filteredGroups.map((group: any) => (
              <Box position={'relative'} key={group._id}>
                
                <Box position="relative">
                  
                  <GroupCard
                    key={group._id}
                    title={group.groupName}
                    name={
                      group.leader
                        ? group.leader.name
                        : group.members.find((member: any) => member.memberGroupStatus === true)?.name || 'Leader Unassigned'
                    }
                    imageUrl={
                      !group.leader?.imageurl
                        ? group.members.find((member: any) => member.memberGroupStatus === true)?.imageurl || 'https://picsum.photos/200'
                        : group.leader.imageurl
                    }
                    path={`/meeting-group/${group._id}`} 
                  />
                  <Modal isOpen={modalGroupId === group._id} onClose={() => setModalGroupId(null)}>
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>Delete Group</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody>
                        Are you sure you want to delete the group <strong>{group.groupName}</strong>?
                      </ModalBody>
                      <ModalFooter>
                        <Button variant="ghost" onClick={() => setModalGroupId(null)}>
                          Cancel
                        </Button>
                        <Button colorScheme="red" onClick={() => handleDelete(group)} ml={3}>
                          Delete
                        </Button>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        </>
      )}
    </Flex>
  );
};

export default Groups;
