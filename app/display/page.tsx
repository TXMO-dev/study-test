'use client';
import { useState, useEffect } from 'react';
import { Flex, Grid, Text, Skeleton, Box } from '@chakra-ui/react';
import ProfileCard from '../components/profile-card';
import CategoryCard from '../components/category-card';
import Dashboardlayout from '../components/Dashboardlayout';
import { IMemberProfile } from '../utils/memberProfiles/types/IMemberProfiles';
import { ICategories } from '../utils/categories/types/ICategory';
import { fetchFounder, fetchLeadPastor } from '../utils/memberProfiles/memberProfilesApis';
import { fetchCategories } from '../utils/categories/categoriesApis';

const Display: React.FC = () => {
  const [founder, setFounder] = useState<IMemberProfile | null>(null);
  const [leadPastor, setLeadPastor] = useState<IMemberProfile | null>(null);
  const [categories, setCategories] = useState<ICategories | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [founderError, setFounderError] = useState<string | null>(null);
  const [leadPastorError, setLeadPastorError] = useState<string | null>(null);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [fetchedFounder, fetchedLeadPastor, fetchedCategories] = await Promise.all([
          fetchFounder(),
          fetchLeadPastor(),
          fetchCategories(),
        ]);

        if (fetchedFounder.success === false) {
          setFounderError(fetchedFounder.message);
        } else {
          setFounder(fetchedFounder);
        }

        if (fetchedLeadPastor.success === false) {
          setLeadPastorError(fetchedLeadPastor.message);
        } else {
          setLeadPastor(fetchedLeadPastor);
        }

        if (fetchedCategories.success === false) {
          setCategoriesError(fetchedCategories.message);
        } else {
          setCategories(fetchedCategories);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const defaultImageUrl = '/assets/avatar.png';

  return (
    <Dashboardlayout>
      <Flex flexDirection={'column'} >
      {loading ? (
          <>
            <Skeleton height="100px" my="4" />
            <Skeleton height="100px" my="4" />
            <Skeleton height="100px" my="4" />
          </>
        ) : (
            <>
        <Flex flexDir='column' m={'auto'}>
              
            {founderError && (
              <Text color="red.500" my="2">
                {founderError}
              </Text>
            )}
            {founder && !founderError && (
              <ProfileCard
                title='Founder'
                name={founder.data.name}
                imageUrl={founder.data.imageurl || defaultImageUrl}
              />
            )}
            {leadPastorError && (
              <Text color="red.500" my="2">
                {leadPastorError}
              </Text>
            )}
            {leadPastor && !leadPastorError && (
              <ProfileCard
                title='Lead Pastor'
                topbg='#8869b3'
                name={leadPastor.data.name}
                imageUrl={leadPastor.data.imageurl || defaultImageUrl}
              />
                )}
                </Flex>
            {categoriesError && (
              <Text color="red.500" my="2">
                {categoriesError}
              </Text>
              )}
        <Grid templateColumns={'repeat(2, 1fr)'} mt={2}  w={'100%'}>
              
            {categories && categories.data.length === 0 && !categoriesError && (
              <Box>
                <Text color="red.500" my="2">No categories available at the moment.</Text>
              </Box>
            )}
            {categories && categories.data.length > 0 && !categoriesError && (
              categories.data.map((category) => (
                <CategoryCard
                  key={category._id.toString()}
                  imageUrl={leadPastor?.data?.imageurl || defaultImageUrl}
                  categoryName={category.categoryName}
                  groups={category.memberGroups.length.toString()}
                />
              ))
                )}
                </Grid>
          </>
        )}
      </Flex>
    </Dashboardlayout>
  );
};

export default Display;