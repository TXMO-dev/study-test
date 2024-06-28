'use client';
import React, { useEffect, useState } from 'react';
import { 
  Flex, Text, SimpleGrid, Spinner, Input, IconButton, 
  Modal, ModalOverlay, ModalContent, ModalHeader, 
  ModalCloseButton, ModalBody, ModalFooter, Button, useToast 
} from '@chakra-ui/react';
import MeetingProfileCard from '../components/profile';
import TopNav from '@/app/components/meeting-top-nav';
import { DeleteMembeGroupByGroupId, fetchGroupById, fetchMemberProfilesBasedOnGroupId } from '@/app/utils/memberGroups/memberGroupApis';
import { IMemberProfile, IMemberProfiles } from '@/app/utils/memberProfiles/types/IMemberProfiles';
import mongoose from 'mongoose';
import { IMemberGroup } from '@/app/utils/memberGroups/types/IMemberGroup';
import ProfileCard from '../components/profile-card';
import { BiTrash } from 'react-icons/bi';

interface GroupDetailProps {
  params: {
    groupId: mongoose.Types.ObjectId;
  };
  searchParams: {
    data: string;
  };
}

const GroupDetail: React.FC<GroupDetailProps> = ({ params }) => {
  const { groupId } = params;
  const [profiles, setProfiles] = useState<IMemberProfiles>([] as any);
  const [filteredProfiles, setFilteredProfiles] = useState<IMemberProfiles>([] as any);
  const [leaderProfile, setLeaderProfile] = useState<IMemberGroup | null>(null); // Initialize leaderProfile as null
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGroupLoading, setIsGroupLoading] = useState<boolean>(true);
  const [filterText, setFilterText] = useState<string>('');
  const [modalGroupId, setModalGroupId] = useState<string | null>(null); // State for modal visibility
  const toast = useToast();
  
  useEffect(() => {
    const fetchGroupAndProfiles = async () => {
      try {
        setIsGroupLoading(true);
        const selectedGroup = await fetchGroupById(groupId);
        setLeaderProfile(selectedGroup);
        
        const profilesResponse = await fetchMemberProfilesBasedOnGroupId(groupId);
        if (profilesResponse.success) {
          const profilesData = profilesResponse;
          setProfiles(profilesData);
          setFilteredProfiles(profilesData);
        }
      } catch (error) {
        console.error('Error fetching group or profiles:', error);
      } finally {
        setIsGroupLoading(false);
        setIsLoading(false);
      }
    };

    fetchGroupAndProfiles();
  }, [groupId]);

  useEffect(() => {
    const lowercasedFilter = filterText.toLowerCase();
    const filteredData = {...profiles, data: profiles?.data?.filter(profile =>
      profile?.name?.toLowerCase().includes(lowercasedFilter)
    )};
    setFilteredProfiles(filteredData);
  }, [filterText, profiles]);

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
        setModalGroupId(null); // Close the modal on success
        // Optionally, redirect or update the UI after deletion
      } else if(!result?.success){
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

  if (isLoading || isGroupLoading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Flex flexDirection='column'>
      <TopNav groupId={`${groupId}`} />
      <Flex flexDir='column' align='center' mb={10}>
        <Flex alignItems={'center'}>
          <Text
            align="center"
            fontSize="35px"
            fontWeight="700"
            p={5}
            textTransform="uppercase"
          >
            {leaderProfile?.data.groupName || ''}
          </Text>
        </Flex>
        {leaderProfile ? (
          <ProfileCard
            title='Leader'
            name={
              leaderProfile.data.leader
                ? leaderProfile.data.leader.name
                : leaderProfile.data.members.find((member: any) => member.memberGroupStatus)?.name || 'Leader Unassigned'
            }
            imageUrl={
              leaderProfile.data.leader
                ? leaderProfile.data.leader.imageurl || 'https://picsum.photos/200'
                : leaderProfile.data.members.find((member: any) => member.memberGroupStatus)?.imageurl || 'https://picsum.photos/200'
            }
            path=''
          />
        ) : (
          <Text fontSize='xl' fontWeight='bold' color='red.500'>
            No leader assigned to this group
          </Text>
        )}
      </Flex>
      <Flex justifyContent='center' mb={5}>
        <Input
          placeholder='Filter profiles'
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          width='300px'
        />
      </Flex>
      {filteredProfiles?.data?.length === 0 ? ( // Update condition to check length of filteredProfiles directly
        <Flex justify='center' align='center' height='200px'>
          <Text fontSize='xl'>No profiles available</Text>
        </Flex>
      ) : (
        <SimpleGrid
          gridTemplateColumns='repeat(auto-fit, minmax(120px, 180px))'
          rowGap={8}
          justifyItems='center'>
          {filteredProfiles?.data
            ?.filter((x) => x.memberGroupStatus === false)
            .map((profile) => {
              const data = JSON.stringify(profile);
              return (
                <ProfileCard
                  key={`${profile._id}`} // Use profile._id directly as key
                  name={profile.name}
                  imageUrl={profile.imageurl || 'https://picsum.photos/200'}
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
      )}
      <Modal
        isOpen={modalGroupId === groupId.toString()}
        onClose={() => setModalGroupId(null)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Group</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete the group <strong>{leaderProfile?.data.groupName || ''}</strong>?
          </ModalBody>
          <ModalFooter>
            <Button variant='ghost' onClick={() => setModalGroupId(null)}>
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
    </Flex>
  );
};

export default GroupDetail;
