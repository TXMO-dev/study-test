import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import TopNav from '@/app/components/meeting-top-nav';
import MeetingProfileCard from '../components/profile';
import MemberProfiles from '../components/member-profiles';
import Layout from '../components/meeting-layout';

const members: any = [];

const Profiles = () => {
  return (
    <Layout>
        <MemberProfiles />
    </Layout>
  );
};

export default Profiles;
