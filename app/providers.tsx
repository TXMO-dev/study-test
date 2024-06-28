'use client';

import '@fontsource/manrope'; // Defaults to weight 400
// import '@fontsource/manrope/400.css'; // Specify weight
// import '@fontsource/manrope/400-italic.css';

import theme from '@/config/extendTheme';
import { ChakraProvider } from '@chakra-ui/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
