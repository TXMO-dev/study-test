'use client';
import React, { useState, useEffect } from 'react';
import { Flex, Text, Input, Button, useToast, Box, Skeleton, SimpleGrid } from '@chakra-ui/react';
import TopNav from '@/app/components/meeting-top-nav';
import MeetingProfileCard from '../components/profile';
import { IMemberProfiles } from '@/app/utils/memberProfiles/types/IMemberProfiles';
import { IMemberGroup, IMemberGroups } from '@/app/utils/memberGroups/types/IMemberGroup';
import mongoose from 'mongoose';
import { fetchProfiles } from '@/app/utils/memberProfiles/memberProfilesApis';
import {
  assignMemberProfileToMemberGroup,
  createGroup,
  fetchGroupById,
  fetchGroups,
  fetchMemberProfileBasedOnGroupId,
  fetchMemberProfilesBasedOnGroupId,
  updateGroup,
} from '@/app/utils/memberGroups/memberGroupApis';
import ProfileCard from '../components/profile-card';
import Layout from '../components/meeting-layout';

const CreateGroup = () => {
  const toast = useToast();
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

  const handleSaveGroup = async () => {
    console.log('Group name Created:', groupName);
    const response = await createGroup({
      groupName: groupName,
      members: members, // Include members array in the request
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
      setProfiles(profileresponse);
      setGroups(groupresponse);
      setLoadingProfiles(false);
    };

    fetchData();
  }, []);

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
    <Layout groupId={true}>
    <Flex flexDir={'column'}>
      {/* <TopNav /> */}
      <Flex align={'center'} justify={'center'} mt={'30px'} flexDir={'column'}>
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
              fontSize={'30px'}
              fontWeight={'500'}
              p={5}
              textTransform='uppercase'
              onClick={handleEditGroup}
              cursor='pointer'>
              {groupName ? groupName : 'Add Group Name'}
            </Text>
            <Box>
              {loadingProfiles ? (
                <Skeleton height='400px' width='100%' />
              ) : selectedGroup.success === true ? (
                <>
                  <ProfileCard
                    name={
                      selectedGroup.data.leader
                        ? selectedGroup.data.leader.name
                        : 'Leader Unassigned'
                    }
                    title='Leader'
                    imageUrl={
                      selectedGroup.data.leader
                        ? selectedGroup.data.leader.imageurl
                        : `https://picsum.photos/200`
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
                <Flex align='flex-start' justify='space-between' mb={4}>
                  <Input
                    placeholder='Search potential leaders...'
                    value={filterValue}
                    w={'300px'}
                    mr={5}
                    onChange={handleFilterChange}
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
                      _hover={{ backgroundColor: '#e8e8e8', cursor: 'pointer' }}
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
                    );
                  })}
              </SimpleGrid>
            {/* </Box> */}
          </>
        )}
      </Flex>
    </Flex>
    </Layout>
  );
};
  
export default CreateGroup;
  