import React from 'react';
import { Flex, Image, Text, Grid } from '@chakra-ui/react';
import TopNav from '@/app/components/meeting-top-nav';

const ProfileDetail = ({ searchParams }: any) => {
  const profile = searchParams;
  const member = JSON.parse(profile.member)
  console.log(member)
  return (
    <Flex flexDirection={'column'} h='100vh'>
      <TopNav id={member?._id} />
      <Grid h='100%' templateColumns={'4fr 2fr'}>
        <Flex flexDir='column' align={'center'}>
          <Image
            src={member.imageurl}
            alt='profile picture'
            p={5}
            background={`linear-gradient(to right, red, purple)`}
            // border={'3px solid #202A3B'}
            h='420px'
            borderRadius={'40px 40px 40px 0px '}
            m={'auto'}
          />
        </Flex>
        <Flex
          borderLeftRadius={'30px'}
          background={`linear-gradient(to bottom, red, purple)`}>
          <Flex>
            <Image
              src={'/assets/fl-Logo.png'}
              maxH={'150px'}
              ml={'-50%'}
              mt={'40vh'}
              alt='fl-logo'
            />
          </Flex>
          <Flex flexDir={'column'} ml={'-30%'}>
            <Flex m={9} flexDir={'column'}>
              {/* <Text
                fontSize={'26px'}
                color={'#fff'}
                mb={8}
                fontWeight={'700'}
                textAlign={'right'}
                letterSpacing={'1px'}>
                Profile details
              </Text> */}
              <Text
                fontSize={'35px'}
                color={'#fff'}
                fontWeight={'700'}
                textAlign={'center'}
                textTransform={'uppercase'}
                letterSpacing={'1px'}>
                {member.name}
              </Text>
            </Flex>
            <Flex px={'70px'}>
              <Text
                fontSize={'24px'}
                color={'#fff'}
                pr={3}
                textTransform='lowercase'>
                Date of Birth:
              </Text>
              <Text fontSize={'24px'} color={'#fff'} fontWeight={'700'}>
                {member.dateOfBirth}
              </Text>
            </Flex>

            <Flex px={'70px'}>
              <Text
                fontSize={'24px'}
                color={'#fff'}
                pr={3}
                textTransform='lowercase'>
                Marital Status:
              </Text>
              <Text fontSize={'24px'} color={'#fff'} fontWeight={'700'}>
                {member.maritalStatus}
              </Text>
            </Flex>

            <Flex px={'70px'}>
              <Text
                fontSize={'24px'}
                color={'#fff'}
                pr={3}
                textTransform='lowercase'>
                Occupation:
              </Text>
              <Text fontSize={'24px'} color={'#fff'} fontWeight={'700'}>
                {member.occupation}
              </Text>
            </Flex>

            {member.profileInputs.map((data: any) => (
              <Flex key={data.label} px={'70px'}>
                <Text
                  fontSize={'24px'}
                  color={'#fff'}
                  pr={3}
                  textTransform='lowercase'>{`${data.label}: `}</Text>
                <Text fontSize={'24px'} color={'#fff'} fontWeight={'700'}>
                  {data.value}
                </Text>
              </Flex>
            ))}
          </Flex>
        </Flex>
      </Grid>
    </Flex>
  );
};

export default ProfileDetail;


// const fetchMember = async ({id}: any) => {
//   const response = await fetch(`/api/memberProfiles/${id}`)
//   if (!response.ok) {
//     const errorText = await response.json()
//     throw new Error(errorText?.message)
//   }
//   return response.json()
// }