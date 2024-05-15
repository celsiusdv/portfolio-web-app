import { Button, Checkbox, Flex, Text, Input, InputGroup, InputRightElement, Stack, useColorModeValue, Divider } from '@chakra-ui/react';
import classes from './catalog.module.css';
import { IoIosSearch as SearchIcon } from "react-icons/io";
import CatalogFilter from './CatalogFilter';
import ProductsGrid from './ProductsGrid';
import { useRef, useState } from 'react';
import { useFetch } from '../../hooks/useFetch';


const Catalog = () => {
    const buttonBrands = useColorModeValue('gray.600','gray.400');
    const {data:sectors}=useFetch<Sector>("/api/v1/product-management/sector");
    const [tabIndex, setTabIndex] = useState(0);
    const [browse, setBrowse] = useState('');
    const [selectedCategories, setSelectedCategories]=useState<string[]>([]);
    const [selectedTypes, setSelectedTypes]=useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const [sector,setSector]=useState<string>("");

    const handleSearch = ()=>{
        const inputValue = inputRef.current!.value;
        if(inputValue !== undefined){
            setBrowse(inputValue);
        }
    }
    const handleChangeSearch=(e: React.ChangeEvent<HTMLInputElement>)=>{
        if(e.target.value === ""){
            setBrowse(e.target.value);
        }
    }
    
    return ( 
        <div className={classes.container}>
            <CatalogFilter sector={sector}
                           selectedCategories={selectedCategories}
                           selectedTypes={selectedTypes}
                           setSelectedCategories={setSelectedCategories}
                           setSelectedTypes={setSelectedTypes}
                           tabIndex={tabIndex}
                           sectors={sectors}/>

            <div className={classes['right-container']}>
                <InputGroup maxWidth={'60%'} mb={5}>
                    <Input type='text' placeholder='Search Product' ref={inputRef}
                        onChange={(e) => handleChangeSearch(e)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
                    <InputRightElement  >
                    <SearchIcon className={classes['search-icon']}
                                        onClick={handleSearch}/>
                    </InputRightElement>
                </InputGroup>

                <section>
                    <ProductsGrid browse={browse}
                                  setSector={setSector}
                                  selectedCategories={selectedCategories}
                                  selectedTypes={selectedTypes}
                                  setSelectedCategories={setSelectedCategories}
                                  setSelectedTypes={setSelectedTypes}
                                  tabIndex={tabIndex}
                                  setTabIndex={setTabIndex}
                                  sectors={sectors}/>
                </section>
            </div>
        </div>
     );
}
 
export default Catalog;