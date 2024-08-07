import { Flex, Input, InputGroup, InputRightElement, IconButton, useDisclosure, Drawer,
         DrawerBody, DrawerContent, DrawerOverlay, Spacer } from '@chakra-ui/react';
import classes from './catalog.module.css';
import { IoIosSearch as SearchIcon } from "react-icons/io";
import { GiHamburgerMenu as Burger } from "react-icons/gi";
import CatalogFilter from './CatalogFilter';
import ProductsGrid from './ProductsGrid';
import { useEffect, useRef, useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import useMatchMedia from '../../hooks/useMatchMedia';
import { useLocation, useNavigate } from 'react-router-dom';

// check explanation below in very bottm of this file
const Catalog = () => {
    const isDesktop = useMatchMedia();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { data: sectors, isLoading:loadingSectors } = useFetch<Sector>("/api/v1/product-management/sector");
    const [sector, setSector] = useState<string>("");
    const [tabIndex, setTabIndex] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [browse, setBrowse] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const tabQuery:number = parseInt(queryParams.get('tab')!)||0;
    const categoriesQuery:string = queryParams.get('categories')!;
    const categories:string[] = categoriesQuery ? JSON.parse(categoriesQuery) : [];
    const typesQuery:string = queryParams.get('types')!;
    const types:string[]=typesQuery ? JSON.parse(typesQuery) : [];
    const pageQuery:number = parseInt(queryParams.get('page')!)||1;
    const browseQuery=queryParams.get('browse')||'';
    const [previousTab, setPreviousTab]=useState(tabIndex);//used to avoid conflicts when fetching values from query params
    const [previousPage, setPreviousPage]=useState(currentPage);

    useEffect(()=>{//load elements with query values in the first mount
        setSelectedCategories(categories);
        setSelectedTypes(types);
        setTabIndex(tabQuery);
        setPreviousTab(tabQuery);
        setCurrentPage(pageQuery);
        setPreviousPage(pageQuery);
        inputRef.current!.value = browseQuery;
    },[]);

    useEffect(()=>{//update values when the next tab is selected
        if(previousTab !== tabIndex){
            setCurrentPage(1)
            setSelectedCategories([]);
            setSelectedTypes([]);
            setTabIndex(tabIndex);
            setPreviousTab(tabIndex);//store the previous tab index , this is updated when the next tab is selected
            navigate(location.pathname, { replace: true });//clear queries history when a different tab is selected
        }
        if(browseQuery !== '' && previousTab === tabIndex){//get elements from the browse tab without losing page number
            setBrowse(inputRef.current!.value);
            setTabIndex(tabQuery)
            setPreviousTab(tabQuery);
            setCurrentPage(pageQuery);
        };
    },[tabIndex,previousTab]);

    //used as a flow control for the rendering of the previous state 
    useEffect(()=>{if(pageQuery===previousPage) setPreviousPage(0);},[currentPage]);

    //switch page to 1 whenever the filter is used
    useEffect(()=>{if(previousPage !== currentPage)setCurrentPage(1);},[selectedCategories, selectedTypes]);

    const handleSearch = () => {
        const inputValue = inputRef.current!.value;
        if (inputValue !== undefined) {
            setBrowse(inputValue);
        }
    };
    const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === "") {
            setBrowse(e.target.value);
        }
    };

    return (
        <div className={`${classes.container} ${!isDesktop && classes.mobile}`}>
            {isDesktop ?<CatalogFilter sector={sector}
                                selectedCategories={selectedCategories}
                                selectedTypes={selectedTypes}
                                setSelectedCategories={setSelectedCategories}
                                setSelectedTypes={setSelectedTypes}
                                tabIndex={tabIndex}
                                sectors={sectors} />
                            :
                            <>
                                <IconButton isRound={true} variant='ghost' aria-label='Dark Mode'
                                    fontSize='20px' onClick={onOpen}
                                    color={'gray'}
                                    icon={<Burger />} />
                                <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
                                    <DrawerOverlay />
                                    <DrawerContent backgroundColor={'transparent'}>
                                        <DrawerBody>
                                            <CatalogFilter sector={sector}
                                                selectedCategories={selectedCategories}
                                                selectedTypes={selectedTypes}
                                                setSelectedCategories={setSelectedCategories}
                                                setSelectedTypes={setSelectedTypes}
                                                tabIndex={tabIndex}
                                                sectors={sectors} />
                                        </DrawerBody>
                                    </DrawerContent>
                                </Drawer>
                            </>
             }

            <div className={`${classes['right-container']} ${!isDesktop ? classes['no-padding-left']:classes.desktop }`}>
                <Flex direction={'row'} alignItems={'center'} mb={5}>
                    <InputGroup maxWidth={'60%'}>
                        <Input type='text' placeholder='Search product' ref={inputRef}
                            onChange={(e) => handleChangeSearch(e)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
                        <InputRightElement  >
                            <SearchIcon className={classes['search-icon']}
                                onClick={handleSearch} />
                        </InputRightElement>
                    </InputGroup>
                    <Spacer />
                </Flex>
                <section>
                    <ProductsGrid browse={browse}
                        loadingSectors={loadingSectors}
                        setSector={setSector}
                        selectedCategories={selectedCategories}
                        selectedTypes={selectedTypes}
                        tabIndex={tabIndex}
                        setTabIndex={setTabIndex}
                        sectors={sectors}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage} />
                </section>
            </div>
        </div>
    );
};

export default Catalog;
/*
This component renders multiple times because of the dependencies that gets value from query parameters.
In case the client came back from the  ProductDetails to this component, this component will load
the previous values (state from Catalog before the client had selected a product).
The previous values are loaded in ProductDetails through query parameters and used in Catalog.tsx.
A uncontrolled flow of renderings appears because of that and the current page and the tab index are set to 1 after
all the mounting, therefore the purpose of loading the last state of this components doesn't work, 
the following variables and functions are used to fix that problem and control the rendering flow
 -   [previousTab, setPreviousTab] [previousPage, setPreviousPage]
 -   useEffect(()=>,[currentPage]);
 -  useEffect(()=>,[selectedCategories,selecteTypes]);
*/