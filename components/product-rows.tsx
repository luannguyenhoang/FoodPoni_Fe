import React, {ReactNode, useEffect, useState} from 'react';
import ProductCard from "./product-card";
import {useSelector} from "react-redux";
import {RootState} from "../stores";
import {Page} from "../models/Page";
import {CurrentUser} from "../stores/user.reducer";
import MenuMain from "./menu-main";
import {Carousel} from "antd";

import {CustomArrowProps} from "@ant-design/react-slick";
import Loading from "./loading-product";
import {getProductsCardPage} from "../queries/product.query";

export interface IProductCard {
    index: number,
    id: string;
    name: string;
    thumbnail: string;
    minPrice: number;
    maxPrice: number;
    rate: number;
    retailer: string;
    rateCount: number;
    sales: number;
    createdDate: Date;
}

interface ProductRowProps {
    title?: string | ReactNode,
    hasMenu?: boolean,
    query: Promise<Page<IProductCard[]>>,
}

const ProductRows = ({title, hasMenu, query}: ProductRowProps) => {
    const currentUser: CurrentUser = useSelector((state: RootState) => state.user.currentUser);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [productCards, setProductCards] = useState<IProductCard[]>([]);
    useEffect(() => {
        setLoading(true);
        query.then((res: Page<IProductCard[]>) => setProductCards(res.content))
            .finally(() => setLoading(false));
    }, [])
    const filterProducts = (key: string) => {
        switch (key) {
            case "nearby":
                break;
            case "promotion":
                break;
            case "bestnews":
                setLoading(true);
                getProductsCardPage({page: 0, pageSize: 10, status: true, sort: ["updatedDate,desc"]})
                    .then((res: Page<IProductCard[]>) => setProductCards(res.content))
                    .finally(() => setLoading(false));
                break;
            case "bestsellers":
                setLoading(true);
                getProductsCardPage({page: 0, pageSize: 10, status: true, sort: ["sales,desc"]})
                    .then((res: Page<IProductCard[]>) => setProductCards(res.content))
                    .finally(() => setLoading(false));
                break;
            case "toprates":
                setLoading(true);
                getProductsCardPage({page: 0, pageSize: 10, status: true, sort: ["rate,desc"]})
                    .then((res: Page<IProductCard[]>) => setProductCards(res.content))
                    .finally(() => setLoading(false));
                break;
            default:
                break;
        }
    };

    const productGroups = [];
    for (let i = 0; i < productCards.length; i += 4) {
        productGroups.push(productCards.slice(i, i + 4));
    }
    const CustomPrevArrow: React.FC<CustomArrowProps> = ({onClick}) => {
        return (
            <div onClick={onClick}
                 className="custom-arrow next-arrow mx-2 absolute top-[50%] left-0 text-orange-400 text-xl w-8 h-8 hover:text-orange-500 cursor-pointer shadow-lg shadow-gray-400 bg-white z-50 rounded-full flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd"
                          d="M12.0899 14.5899C11.7645 14.9153 11.2368 14.9153 10.9114 14.5899L5.91139 9.58991C5.58596 9.26447 5.58596 8.73683 5.91139 8.4114L10.9114 3.41139C11.2368 3.08596 11.7645 3.08596 12.0899 3.41139C12.4153 3.73683 12.4153 4.26447 12.0899 4.58991L7.67916 9.00065L12.0899 13.4114C12.4153 13.7368 12.4153 14.2645 12.0899 14.5899Z"
                          fill="#f36f24"></path>
                </svg>
            </div>
        );
    };

    const CustomNextArrow: React.FC<CustomArrowProps> = ({onClick}) => {
        return (
            <div onClick={onClick}
                 className="custom-arrow next-arrow mx-2 absolute top-[50%] right-0 text-orange-400 text-xl w-8 h-8 hover:text-orange-500 cursor-pointer shadow-lg shadow-gray-400 bg-white rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 18 18" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd"
                          d="M5.91107 3.41107C6.23651 3.08563 6.76414 3.08563 7.08958 3.41107L12.0896 8.41107C12.415 8.73651 12.415 9.26415 12.0896 9.58958L7.08958 14.5896C6.76414 14.915 6.23651 14.915 5.91107 14.5896C5.58563 14.2641 5.58563 13.7365 5.91107 13.4111L10.3218 9.00033L5.91107 4.58958C5.58563 4.26414 5.58563 3.73651 5.91107 3.41107Z"
                          fill="#f36f24"></path>
                </svg>
            </div>
        );
    };

    return (
        <div className="p-4 bg-white rounded-lg">
            {hasMenu && <MenuMain filterProducts={filterProducts}/>}
            <div className="mb-2 font-bold">{title}</div>
            <div style={{maxWidth: '59rem', margin: 'auto'}}>
                {isLoading ? (
                    <Loading/>
                ) : (
                    <Carousel
                        onLazyLoad={() => console.log('lazy load')}
                        arrows
                        prevArrow={<CustomPrevArrow/>}
                        nextArrow={<CustomNextArrow/>}
                        infinite={true}
                        dots={false}
                    >
                        {productGroups.map((group, index) => (
                            <div key={index}>
                                <div
                                    className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-2 mt-2'>
                                    {group.map((productCard: IProductCard) => (
                                        <ProductCard key={productCard.id} product={productCard}/>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </Carousel>
                )}
            </div>
        </div>
    );
}
export default ProductRows;