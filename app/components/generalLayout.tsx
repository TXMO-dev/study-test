import { Grid, Flex, GridItem, Divider, Text } from '@chakra-ui/react';
import SideNav from './sidenav';
import TopNav from './topNav';

type LayoutProps = {
  children: React.ReactNode;
  pageName?: string;
};

const GeneralLayout = ({ children, pageName }: LayoutProps) => {
  return (
    <Grid
      h='100vh'
      w='100%'
      templateRows='auto 4fr 1fr'
      templateColumns='auto 4fr'
      templateAreas={`
      'sideNav topNav'
      'sideNav main'
      'sideNav main'
  `}>
      <GridItem area={'sideNav'}>
        <SideNav />
      </GridItem>
      <GridItem area={'topNav'}>
        <TopNav />
      </GridItem>
      <GridItem area={'main'} border={'1px solid #000'} overflow={'auto'}>
        {children}
      </GridItem>
    </Grid>
  );
};

export default GeneralLayout;
