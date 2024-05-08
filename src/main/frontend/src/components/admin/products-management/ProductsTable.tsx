import { TableContainer, Table, Image, TableCaption, Thead, Tr, Th, Tbody, Td, Tag, Flex, Tab, TabList, TabPanels, Tabs } from "@chakra-ui/react";
import useMatchMedia from "../../../hooks/useMatchMedia";
import { useEffect, useState } from "react";
import ResponsivePagination from 'react-responsive-pagination';
import { RiDeleteBinFill as DeleteIcon } from "react-icons/ri";
import { FaRegEdit as EditIcon} from "react-icons/fa";
import classes from "./products-panel.module.css";
import 'react-responsive-pagination/themes/minimal.css';
import { useSingleFetch } from "../../../hooks/useSingleFetch";
import { Link } from "react-router-dom";
import { useFetch } from "../../../hooks/useFetch";
import useColorGenerator from "../../../hooks/useColorGenerator";


type PaginatedProducts={
    products:Array<Product>;
    totalProducts:number
}
type TypeColor={
    type?:string,
    color?:string;
}
type ProductsTableProps = {
    browse: string;
    setActiveButton?: React.Dispatch<React.SetStateAction<string>>
}
const ProductsTable = ({ browse, setActiveButton }: ProductsTableProps) => {
    const isDesktop = useMatchMedia();
    const {data:sectors}=useFetch<Sector>("/api/v1/product-management/sector");
    const {data:types}=useFetch<Type>("/api/v1/product-management/types");
    const [currentPage, setCurrentPage] = useState(1);//only for the pagination gui, not used in the page url
    const pageSize = 4;
    const [url, setUrl] = useState("");
    const { data, error } = useSingleFetch<PaginatedProducts>(url);
    const [paginatedProducts, setPaginatedProducts] = useState<PaginatedProducts>({ products: [], totalProducts: 0 });
    const [tabIndex, setTabIndex] = useState(0);
    const createColor=useColorGenerator();
    const [typeColors,setTypeColors]=useState<TypeColor[]>([{}])
    const handlePageChange = (page: number) => setCurrentPage(page);

    useEffect(() => {/* update the url state to fetch data with a updated url */
        if (browse === "") {
            sectors.forEach((sector, i)=>{
                tabIndex === i && setUrl(`/api/v1/product-management/products/${currentPage}/${pageSize}/sector/${sector.name}`);
            });
        } else {
            setUrl(`/api/v1/product-management/products/${browse}/${currentPage}/${pageSize}`);
        }
        sectors.forEach((sector, i)=>{//allow switch tabs even if the browse tab is currently with values
            tabIndex === i && setUrl(`/api/v1/product-management/products/${currentPage}/${pageSize}/sector/${sector.name}`);
        });
    }, [sectors, browse, currentPage, tabIndex, url]);

    useEffect(() => setCurrentPage(1), [tabIndex]);//reset the value of the current page whenever the tab is changed

    useEffect(() => {//reset the value of the current page and switch tab whenever the browser value is changed
        setCurrentPage(1);
        if(browse !== "")setTabIndex((sectors.length));//sector.lenght = to the last value of the tab which is <Tab>Browse Result:</Tab>
        else setTabIndex(0);
    }, [browse]);

    useEffect(() => { // after fetching the data with the new url, update the table, if there is no data, set an error in the table
        data && setPaginatedProducts(data); 
        error && setPaginatedProducts({products:[{}], totalProducts:0}); 
    }, [data,error]);

    useEffect(() => {// generate random colors but for specific product type to distinct them in the table
        if (types) {
            const newTypeColors: TypeColor[] = types.map(type => ({ 
                            type: type.productType, 
                            color: createColor() 
            }));
            setTypeColors(newTypeColors);
        }
    }, [types]);

    const typeTag = (productType: string) => {
        for(let i=0; i<typeColors.length;i++){
            if(typeColors[i].type===productType){
                return (
                    <Tag key={i} size={'md'} variant='solid' colorScheme={typeColors[i].color}>
                        {productType}
                    </Tag>
                );
            }
        }
    }
    return (
        <div className={classes['table-container']}>
            <ResponsivePagination
                total={Math.ceil(paginatedProducts.totalProducts / pageSize)}
                current={currentPage}
                onPageChange={page => handlePageChange(page)}
            />
            <Tabs index={tabIndex} onChange={(index) => setTabIndex(index)} size={isDesktop ?'md':'sm' }>
                <TabList>
                    {sectors.map((sector,i) => <Tab key={i}>{sector.name}</Tab>)}
                    {browse && <Tab>Browse Result:</Tab>}
                </TabList>

                <TabPanels >
                    <TableContainer pt={1}>
                        <Table variant='simple' size={isDesktop ? 'md' : 'sm'}>
                            <TableCaption>Products</TableCaption>
                            <Thead>
                                <Tr>
                                    <Th pr={isDesktop ? '' : '4px'}>Product</Th>
                                    {isDesktop && <Th>Type</Th>}
                                    {isDesktop && <Th>Category</Th>}
                                    {isDesktop && <Th>Sector</Th>}
                                    <Th pr={isDesktop ? '' : '4px'} >Action</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {paginatedProducts.products?.map((product, i) => (
                                    <Tr key={i}>
                                        <Td pr={isDesktop ? '' : '4px'}>
                                            <Flex direction={'row'} columnGap={1} alignItems={'center'}>
                                                {isDesktop && <Image src={product?.images?.[0]?.url || ''} width={45} />}
                                                {product.name}
                                            </Flex>
                                        </Td>
                                        {isDesktop && <Td>{typeTag(product.productType!)}</Td>}
                                        {isDesktop && <Td>{product.categories?.map((category, z) => <p key={z}>{category.name}</p>)}</Td>}{/* render only if screen is desktop */}
                                        {isDesktop && <Td>{product.sector}</Td>}
                                        <Td pr={isDesktop ? '' : '4px'}>
                                            <Flex columnGap={4}>
                                                <Link to={{pathname:`modify-product/${product.id}`,search:'?action=update'}}>
                                                    <EditIcon color="#59a0d4" className={classes['action-icon']}
                                                            onClick={() => {
                                                                //switch the conditional in MainDashboard.tsx to render the <Outlet/> inside <div className={classes.outlet}>
                                                                setActiveButton && setActiveButton("Modify Product")
                                                            }} />
                                                </Link>

                                                <Link to={{ pathname: `modify-product/${product.id}`, search:'?action=delete' }}>
                                                    <DeleteIcon color="red" className={classes['action-icon']}
                                                            onClick={() => {
                                                                //switch the conditional in MainDashboard.tsx to render the <Outlet/> inside <div className={classes.outlet}>
                                                                setActiveButton && setActiveButton("Modify Product");
                                                            }} />
                                                </Link>
                                            </Flex>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </TabPanels>
            </Tabs>
        </div>
    );
};

export default ProductsTable;