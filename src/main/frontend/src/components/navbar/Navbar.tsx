import { Button, Flex, Text, IconButton, useColorModeValue } from "@chakra-ui/react";
import { FaHome as HomeIcon } from "react-icons/fa";
import { IoLogoWhatsapp as WhatsappIcon } from "react-icons/io";
import { FaCartShopping as CartIcon} from "react-icons/fa6";
import { IoStorefrontSharp as StoreIcon} from "react-icons/io5";
import classes from './navbar.module.css';
import { Link } from "react-router-dom";
import { useContext } from "react";
import CartContext, { CartItemContext } from "../../context/CartProvider";

const Navbar = () => {
    const darkMode = useColorModeValue('gray.600','gray.400');
    const cartContext=useContext<CartItemContext | undefined>(CartContext);
    const greet:string="Whatsapp greet";

    return ( 
        <div className={classes.navbar}>
            <Link to='/'>
                <IconButton isRound={true} variant='ghost' aria-label='Dark Mode'
                    fontSize='20px'
                    color={darkMode}
                    icon={<HomeIcon />} />
            </Link>
            
            <Link to='/catalog'>
                <IconButton isRound={true} variant='ghost' aria-label='Dark Mode'
                    fontSize='20px'
                    color={darkMode}
                    icon={<StoreIcon />} />
            </Link>
            <Link to={'/cart'}>
                <div className={classes['cart-container']}>
                        <IconButton isRound={true} variant='ghost' aria-label='Dark Mode'
                            fontSize='20px'
                            color={darkMode}
                            icon={<CartIcon/>} /> 
                        
                        <Flex className={classes['cart-value']} bgColor={'orange.200'}>
                            <Text as={'span'} fontWeight={'900'} fontSize={'12px'} color={'gray.600'}>{cartContext?.items.length}</Text>
                        </Flex>
                </div>
            </Link>
            <a href={`https://wa.me/456456456?text=${greet}`} target="_blank" rel="noopener noreferrer">
                <IconButton isRound={true} variant='ghost' aria-label='Dark Mode'
                    fontSize='32px'
                    color={'#25d366'}
                    icon={<WhatsappIcon />} />
            </a>
        </div>
    );
}
 
export default Navbar;