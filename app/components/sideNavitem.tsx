import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button, Icon } from "@chakra-ui/react"
import {IconType} from "react-icons"

interface SideNavItemProps{
  text?: string
  path:  string
  onClick?: React.MouseEventHandler
  bgColor?: string
  image?: string
  iconColor?: string
  color?: string
  type?: boolean
  altText: string
  icon: IconType;
}

const SideNavItem: React.FC<SideNavItemProps> = (props) => {

  const router = useRouter()
  const { text, path,icon }  = props
  const pathname = usePathname()
  const isActive = pathname === path

  return (
    <Button
      as={Link}
      href={path}
      color={isActive ? '#000' : '#fff'}
      bgColor={isActive ? '#EBFFFD' : 'transparent'}
      fontWeight={400}
      justifyContent='left'
      w='100%'
      mt='10px'
      fontSize='1rem'
      _focus={{
        bgColor: 'none',
        color: '#000',
        fontWeight: 500,
      }}
      _activeLink={{
        bgColor: '#EBFFFD',
        color: '#000',
        fontWeight: 500,
      }}
      _hover={{
        bgColor: 'none',
      }}
      leftIcon={<Icon boxSize='5' as={icon} />}>
      {text}
    </Button>
  );
}

export default SideNavItem