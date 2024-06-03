import { Button, Heading, Spacer, useColorMode, Text, IconButton, useColorModeValue, MenuButton, Menu, MenuItem, MenuList, Flex } from "@chakra-ui/react";
import { FaMoon as Moon} from "react-icons/fa6";
import { MdSunny as Sun} from "react-icons/md";
import { FaCartShopping as Cart} from "react-icons/fa6";
import classes from './header.module.css';
import { Link, useNavigate } from "react-router-dom";
import useMatchMedia from "../../hooks/useMatchMedia";
import useLogout from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useContext } from "react";
import CartContext, { CartItemContext } from "../../context/CartProvider";

const Header = () => {
    const {auth:{user}} : UserContext = useAuthContext();
    const cartContext=useContext<CartItemContext | undefined>(CartContext);
    const navigate = useNavigate();
    const logout = useLogout();
    const { colorMode, toggleColorMode } = useColorMode()
    const grayColor = useColorModeValue('gray.600','gray.400');
    const isDesktop=useMatchMedia();

    const closeSession = async () => {
        await logout();
        navigate('/');
    }

    return (
        <div className={classes.header}>

            <div className={classes.container} >
            
                <Heading as='h1' size='lg' whiteSpace={"nowrap"} 
                         fontSize={{ base: "25px", lg: "25px" }}
                         lineHeight={{base:'1.2',lg: "1.2"}}>
                    <Text as='span'
                          bgGradient='linear(to-t, #e53e3e, #941414)'
                          bgClip='text' fontFamily={'abnes'}>IndusTEch</Text>
                    
                </Heading>
            </div>

            <Spacer />

            {isDesktop && <div className={classes.container}>
                <Link to={'/'}>
                    <Button marginRight={2} variant='link' color={grayColor}>Home</Button>
                </Link>
                <Link to={'/catalog'}>
                    <Button marginRight={2} variant='link' color={grayColor}>Catalog</Button>
                </Link>
                <Link to={'/'}>
                    <Button marginRight={2} variant='link' color={grayColor}>Contact</Button>
                </Link>
                <Link to={'/'}>
                    <Button marginRight={2} variant='link' color={grayColor}>About</Button>
                </Link>
            </div>}

            <Spacer flex={0.2}/>

            <div className={classes.container}>
                <Button variant='outline' colorScheme="orange"
                            onClick={() => navigate("/dashboard/products-dashboard")}>
                    Dashboard
                </Button>
                
                
                {user?.isEnabled ?
                        <Button onClick={closeSession}>Logout</Button>
                        :
                        <Link to='/login'><Button variant='outline' colorScheme="red"> Log in</Button></Link>
                }

                <Link to='/signup'><Button> Sign up</Button></Link>
                {isDesktop && <div className={classes['cart-container']}>
                    <Link to={'/cart'}>
                        <Button variant={'outline'} fontSize={'26px'} color={grayColor}>
                            <Cart />
                        </Button>
                    </Link>
                    <Flex className={classes['cart-value']} bgColor={'orange.200'}>
                        <Text as={'span'} fontWeight={'900'} fontSize={'14px'} color={'gray.600'}>{cartContext?.item.length}</Text>
                    </Flex>
                </div>}
                <IconButton isRound={true} variant='ghost' aria-label='Dark Mode'
                    fontSize='20px' onClick={toggleColorMode}
                    color={grayColor}
                    icon={colorMode === 'light' ? <Moon /> : <Sun />} />
            </div>
        </div>
    );
};

export default Header;