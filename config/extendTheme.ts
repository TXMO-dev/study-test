import { extendTheme } from '@chakra-ui/react'
import "@fontsource/manrope";
import localFont from 'next/font/local';
import { Raleway } from 'next/font/google';

const raleway = Raleway({
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
});

const appFont = localFont({
  src: [
    {
      path: './Cambria-Font.ttf',
      weight: '400',
      style: 'Regular',
    },
    {
      path: './Cambria-Font.ttf',
      weight: '700',
      style: 'Bold',
    },
    {
      path: './Cambria-Font.ttf',
      weight: '400',
      style: 'Italic',
    },
    {
      path: './Cambria-Font.ttf',
      weight: '700',
      style: 'Bold Italic',
    },
  ],
  display: 'swap',
});

const theme = extendTheme({
  fonts: {
    heading: raleway.style.fontFamily,
    body: raleway.style.fontFamily,
  },
});

export default theme