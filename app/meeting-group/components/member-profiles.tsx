'use client';
import React, { useEffect, useState } from 'react';
import { Flex, SimpleGrid, Input } from '@chakra-ui/react';
import MeetingProfileCard from './profile';
import { fetchProfiles } from '@/app/utils/memberProfiles/memberProfilesApis';
import { IMemberProfiles } from '@/app/utils/memberProfiles/types/IMemberProfiles';
import ProfileCard from './profile-card';


const MemberProfiles = () => {
  const [profiles, setProfiles] = useState<IMemberProfiles>({} as IMemberProfiles);
  const [filterValue, setFilterValue] = useState('');

  useEffect(() => {
    (async () => {
      const response = await fetchProfiles();
      if (response.success) {
        setProfiles(response);
      }
    })();
  }, []);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(event.target.value);
  };

  const filteredProfiles = profiles?.data?.filter((profile) =>
    profile?.name?.toLowerCase().includes(filterValue.toLowerCase())
  );

  return (
    <>
      <Flex
        justifyContent={'center'}
        fontWeight={'700'}
        mt={2}
        fontSize={'24px'}
        color={'#202A3B'}
      >
        Profiles
      </Flex>
      <Flex flexDirection={'column'}
        align={['center', 'normal']}
      >
        <Input
          placeholder='Filter by Name'
          value={filterValue}
          onChange={handleFilterChange}
          mx={12}
          mb={5}
          maxW={['300px','400px']}
        />
        {filteredProfiles?.length < 1 ? (
          <Flex align={'center'} justify={'center'} mt={'30px'}>
            <MeetingProfileCard />
          </Flex>
        ) : (
          <SimpleGrid
            // minChildWidth={'280px'}
            gridTemplateColumns='repeat(auto-fit, minmax(120px, 180px))'
              rowGap={8}
              mx={8}
            justifyItems={'center'}>
            {filteredProfiles?.map((profile) => {
              const data = JSON.stringify(profile);
              return (
                <>
                <ProfileCard
                  key={`${profile._id}`}
                  topbg='#202A3B'
                  name={profile.name}
                  imageUrl={profile.imageurl || `https://picsum.photos/200`}
                  path={{
                    pathname: `/meeting-group/profiles/${profile._id}`,
                    query: {
                      member: data,
                    },
                  }}
                  />
                  
                </>
              );
            })}
          </SimpleGrid>
        )}
      </Flex>
    </>
  );
};

export default MemberProfiles;
