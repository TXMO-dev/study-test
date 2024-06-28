'use client';
import React, { useState, useEffect } from 'react';
import { Flex, Text, Input, Button, useToast, Box, Skeleton, SimpleGrid, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@chakra-ui/react';
import TopNav from '@/app/components/meeting-top-nav';
import { IMemberProfiles } from '@/app/utils/memberProfiles/types/IMemberProfiles';
import { IMemberGroup, IMemberGroups } from '@/app/utils/memberGroups/types/IMemberGroup';
import mongoose, { ObjectId } from 'mongoose';
import { fetchProfiles } from '@/app/utils/memberProfiles/memberProfilesApis';
import {
    DeleteMembeGroupByGroupId,
  assignMemberProfileToMemberGroup,
  createGroup,
  fetchGroupById,
  fetchGroups,
  fetchMemberProfilesBasedOnGroupId,
  unAssignMemberProfileToMemberGroup,
  updateGroup,
} from '@/app/utils/memberGroups/memberGroupApis'; 
import MeetingProfileCard from '../../components/profile';
import GroupCard from '../../components/group-card';
import { BiTrash } from 'react-icons/bi';
import { useRouter } from 'next/navigation';
import { MinusIcon } from '@chakra-ui/icons';
import ProfileCard from '../../components/profile-card';
import Layout from '../../components/meeting-layout';

interface GroupDetailProps {
  params: {
    groupId: mongoose.Types.ObjectId;
  };
  searchParams: {
    data: string;
  };
}
const EditGroup: React.FC<GroupDetailProps> = ({ params, searchParams }) => {
  const toast = useToast();
  const router = useRouter();
  const { groupId } = params;
  const [isEditingGroup, setIsEditingGroup] = useState(false);
  const [groupName, setGroupName] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<IMemberGroup>(
    {} as IMemberGroup
  );
  const [profiles, setProfiles] = useState<IMemberProfiles>([] as any);
  const [isSelectVisible, setIsSelectVisible] = useState(false);
  const [isAssignSelectVisible, setAssignIsSelectVisible] = useState(false);
  const [groups, setGroups] = useState<IMemberGroups>({} as any);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [filterValue, setFilterValue] = useState('');
  const [assignfilterValue, setAssignFilterValue] = useState('');
  const [selectedProfileId, setSelectedProfileId] =
    useState<mongoose.Types.ObjectId>({} as any);
  const [members, setMembers] = useState<mongoose.Types.ObjectId[]>([]);
  const [groupMemberProfiles, setGroupMemberProfiles] =
    useState<IMemberProfiles>();
  const [modalGroupId, setModalGroupId] = useState<string | null>(null);
  const handleGroupNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsEditingGroup(true);
    setGroupName(event.target.value);
  };

  const toggleSelectVisibility = () => {
    setIsSelectVisible(!isSelectVisible);
  };

  const toggleAssignVisibility = () => {
    setAssignIsSelectVisible(!isAssignSelectVisible);
  };

  const handleEditGroup = () => {
    setIsEditingGroup(true);
  };

  const handleDelete = async (groupId: mongoose.Types.ObjectId) => {
    try {
      const result = await DeleteMembeGroupByGroupId(groupId);
      if (result?.success) {
        toast({
          title: 'Group deleted.',
          description: `${result?.message}`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        setModalGroupId(null);
        router.push('/meeting-group')
        // Close the modal on success and redirect to groups page
        // Optionally, redirect or update the UI after deletion
      } else if (!result?.success) {
        toast({
          title: 'Group deleted.',
          description: `${result?.message}`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
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

  const handleSaveGroup = async () => {
    console.log('Group name Created:', groupName);
    let response: IMemberGroup;
    if (selectedProfileId) {
      console.log('this is the selectedProfileId: ', selectedProfileId);
      response = await updateGroup(
        {
          groupName: groupName,
          members: members, // Include members array in the request
          leader: selectedProfileId, // Set the leader profile id when saving the group
        },
        groupId
      );
      toast({
        title: response.success ? 'Group Updated' : 'Error',
        description: response.message,
        status: response.success ? 'success' : 'error',
        duration: 5000,
        isClosable: true,
      });
    } else {
      response = await updateGroup(
        {
          groupName: groupName,
          members: members, // Include members array in the request
        },
        groupId
      );
      toast({
        title: response.success ? 'Group Updated' : 'Error',
        description: response.message,
        status: response.success ? 'success' : 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    if (response.success) {
      const group_response = await fetchGroupById(response.data._id);
      console.log(
        'this is fetching group after group response: ',
        group_response
      );
      setSelectedGroup(group_response);
      console.log('this is the selected group: ', selectedGroup);
      const profileresponse = await fetchProfiles();
      setProfiles(profileresponse);
      setIsEditingGroup(false);
    } else {
      setIsEditingGroup(true);
    }
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(event.target.value);
  };

  const handleAssignFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAssignFilterValue(event.target.value);
  };

  const handleProfileClick = async (
    profileId: mongoose.Types.ObjectId,
    isLeader?: boolean
  ) => {
    setSelectedProfileId(profileId);
    setMembers((prevMembers) => [...prevMembers, profileId]);

    let response: IMemberGroup;
    if (isLeader) {
      response = await assignMemberProfileToMemberGroup(
        selectedGroup.data._id,
        profileId,
        isLeader
      );
    } else {
      response = await assignMemberProfileToMemberGroup(
        selectedGroup.data._id,
        profileId,
        false
      );
    }

    if (response.success) {
      let new_response: IMemberGroup;
      if (isLeader) {
        const updatedMembers = Array.from(new Set([...members, profileId]));
        new_response = await updateGroup(
          {
            groupName: groupName,
            members: updatedMembers,
            leader: profileId,
          },
          selectedGroup.data._id
        );
      } else {
        const updatedMembers = Array.from(new Set([...members, profileId]));
        new_response = await updateGroup(
          {
            groupName: groupName,
            members: updatedMembers,
          },
          selectedGroup.data._id
        );
      }

      if (isLeader && new_response.success) {
        toast({
          title: new_response.success
            ? 'The Leader has been assigned successfully.'
            : 'Error',
          description: new_response.message,
          status: new_response.success ? 'success' : 'error',
          duration: 5000,
          isClosable: true,
        });
        setSelectedGroup(new_response);
      } else if (!isLeader && new_response.success) {
        toast({
          title: new_response.success
            ? `The member profile has been added as a member to ${selectedGroup.data.groupName} successfully`
            : 'Error',
          description: new_response.message,
          status: new_response.success ? 'success' : 'error',
          duration: 5000,
          isClosable: true,
        });
        // Directly set the new state value
        const updatedGroupMemberProfiles =
          await fetchMemberProfilesBasedOnGroupId(selectedGroup.data._id);
        setGroupMemberProfiles(updatedGroupMemberProfiles || []);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update the group.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: 'Error',
        description: 'Failed to assign the profile to the group.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }

    setIsSelectVisible(false);
    setAssignIsSelectVisible(false);
  };

  const filteredProfiles = profiles?.data?.filter((profile) => {
    return profile.name.toLowerCase().includes(filterValue.toLowerCase());
  });

  const filteredAssignProfiles = profiles?.data?.filter((profile) => {
    return profile.name.toLowerCase().includes(assignfilterValue.toLowerCase());
  });

  const handleSearchLeadersClick = () => {
    setIsSelectVisible(!isSelectVisible); // Open select dropdown when search leaders input is clicked
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoadingProfiles(true);
      const profileresponse = await fetchProfiles();
      const groupresponse = await fetchGroups();
      setSelectedProfileId(
        profileresponse.data.filter((x) => x.memberGroupStatus === true)[0]?._id
      );
      setProfiles(profileresponse);
      setGroups(groupresponse);
      setLoadingProfiles(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      if (groupId) {
        const objectId = new mongoose.Types.ObjectId(`${groupId}`);
        const groupResponse = await fetchGroupById(objectId);
        console.log('this is the group response for EDIT GROUP: ', objectId);
        if (groupResponse.success) {
          setSelectedGroup(groupResponse);
          setGroupName(groupResponse.data.groupName);
          setMembers(
            groupResponse.data.members.map(
              (x) => x._id
            ) as mongoose.Types.ObjectId[]
          );
        }
      }
    };

    fetchGroupDetails();
  }, [groupId]);

  useEffect(() => {
    if (selectedGroup && selectedGroup.data && selectedGroup.data._id) {
      const fetchGroupProfiles = async () => {
        try {
          const updatedGroupMemberProfiles =
            await fetchMemberProfilesBasedOnGroupId(selectedGroup.data._id);
          setGroupMemberProfiles(updatedGroupMemberProfiles || []);
        } catch (error) {
          console.error('Error fetching group profiles:', error);
        }
      };

      fetchGroupProfiles();
    }
  }, [selectedGroup]);

  return (
    <Layout groupId={groupId}>
      <Flex flexDir={'column'}>
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
              <Flex flexDirection={'row'} alignItems={'center'}>
                <Text
                  align={'center'}
                  fontSize={'35px'}
                  fontWeight={'700'}
                  p={5}
                  mr={1}
                  textTransform='uppercase'
                  onClick={handleEditGroup}
                  cursor='pointer'>
                  {groupName ? groupName : 'Add Group Name'}
                </Text>
                {profiles?.data?.length !== 0 ? (
                  <>
                    <IconButton
                      icon={<BiTrash />}
                      aria-label='Delete Group'
                      onClick={() => setModalGroupId(groupId.toString())} // Set the modalGroupId to the current group ID
                    />
                    <Modal
                      isOpen={modalGroupId === groupId.toString()}
                      onClose={() => setModalGroupId(null)}>
                      <ModalOverlay />
                      <ModalContent>
                        <ModalHeader>Delete Group</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                          Are you sure you want to delete the group{' '}
                          <strong>{groupName}</strong>?
                        </ModalBody>
                        <ModalFooter>
                          <Button
                            variant='ghost'
                            onClick={() => setModalGroupId(null)}>
                            Cancel
                          </Button>
                          <Button
                            colorScheme='red'
                            onClick={() => handleDelete(groupId)}
                            ml={3}>
                            Delete
                          </Button>
                        </ModalFooter>
                      </ModalContent>
                    </Modal>
                  </>
                ) : null}
              </Flex>
              <Box>
                {loadingProfiles ? (
                  <Skeleton height='400px' width='100%' />
                ) : selectedGroup.success === true ? (
                  <>
                    <ProfileCard
                      key={`${selectedGroup.data._id}`}
                      // topbg="#202A3B"
                      title='Leader'
                      name={
                        selectedGroup.data.leader
                          ? selectedGroup.data.leader.name
                          : selectedGroup.data.members.find(
                              (member: any) => member.memberGroupStatus === true
                            )?.name || 'Leader Unassigned'
                      }
                      imageUrl={
                        !selectedGroup.data.leader?.imageurl
                          ? selectedGroup.data.members.find(
                              (member: any) => member.memberGroupStatus === true
                            )?.imageurl || 'https://picsum.photos/200'
                          : selectedGroup.data.leader.imageurl
                      }
                      path={``}
                    />
                  </>
                ) : (
                  <>
                    <ProfileCard />
                  </>
                )}
              </Box>
              <Box mt={4}>
                {loadingProfiles ? (
                  <Skeleton height='400px' width='100%' />
                ) : (
                  <Flex mb={4}>
                    <Input
                      placeholder='Search potential leaders...'
                      value={filterValue}
                      onChange={handleFilterChange}
                      w={'300px'}
                      mr={5}
                      onClick={handleSearchLeadersClick} // Call function to open select dropdown
                    />
                    <Flex flexDirection={'column'}>
                      <Input
                        placeholder='Add Members...'
                        value={assignfilterValue}
                        onChange={handleAssignFilterChange}
                        w={'300px'}
                        mb={1}
                        ml={1}
                        onClick={() => toggleAssignVisibility()}
                      />
                      {isAssignSelectVisible && (
                        <Flex
                          flexDir={'column'}
                          w={60}
                          mt={2}
                          backgroundColor='#FFFFFF'
                          boxShadow='0px 4px 8px rgba(0, 0, 0, 0.1)'
                          border='1px solid #e8e8e8'>
                          {filteredAssignProfiles?.map((profile) => (
                            <Text
                              p={2}
                              key={`${profile._id}`}
                              _hover={{
                                backgroundColor: '#e8e8e8',
                                cursor: 'pointer',
                              }}
                              onClick={() =>
                                handleProfileClick(profile._id, false)
                              } // Pass profile id when clicking
                            >
                              {profile.name}
                            </Text>
                          ))}
                        </Flex>
                      )}
                    </Flex>
                  </Flex>
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
                        onClick={() => handleProfileClick(profile._id, true)} // Pass profile id when clicking
                      >
                        {profile.name}
                      </Text>
                    ))}
                  </Flex>
                )}
                {/* This shows the member profiles of the group ID */}
              </Box>
              <SimpleGrid
                gridTemplateColumns='repeat(auto-fit, minmax(120px, 180px))'
                px={8}
                w={'100%'}>
                {groupMemberProfiles?.data
                  ?.filter((x) => x.memberGroupStatus === false)
                  .map((profile) => {
                    const data = JSON.stringify(profile);
                    return (
                      <Box position={'relative'} key={`${profile._id}`}>
                        <IconButton
                          position={'absolute'}
                          top={4}
                          right={4}
                          backgroundColor={'red'}
                          icon={<MinusIcon />}
                          color={'#FFFFFF'}
                          aria-label='Unassign member'
                          onClick={async () => {
                            const response =
                              await unAssignMemberProfileToMemberGroup(
                                groupId,
                                profile._id
                              );
                            toast({
                              title: response.success
                                ? `The member profile has been added as a member to ${selectedGroup.data.groupName} successfully`
                                : 'Error',
                              description: response.message,
                              status: response.success ? 'success' : 'error',
                              duration: 5000,
                              isClosable: true,
                            });
                            const updatedGroupMemberProfiles =
                              await fetchMemberProfilesBasedOnGroupId(
                                selectedGroup.data._id
                              );
                            setGroupMemberProfiles(
                              updatedGroupMemberProfiles || []
                            );
                          }} // Set the modalGroupId to the current group ID
                        />
                        <ProfileCard
                          key={`${profile._id}`}
                          topbg='#202A3B'
                          name={profile.name}
                          imageUrl={
                            profile.imageurl || `https://picsum.photos/200`
                          }
                          path={{
                            pathname: `/meeting-group/profiles/${profile._id}`,
                            query: {
                              member: data,
                            },
                          }}
                        />
                      </Box>
                    );
                  })}
              </SimpleGrid>
            </>
          )}
        </Flex>
      </Flex>
    </Layout>
  );
};
  
export default EditGroup;
