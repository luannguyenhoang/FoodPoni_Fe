import {Skeleton} from 'antd';
import React, {useEffect} from 'react';
import ProductCard from "./product-card";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../stores";
import {setProductList} from "../stores/product.reducer";
import axiosConfig from "../utils/axios-config";
import {AxiosResponse} from "axios";
import {Page} from "../models/Page";
import {ProductResponseDTO} from "../models/product/ProductResponseAPI";
import {ProductDetailResponseDTO} from "../models/product_detail/ProductDetailResponseAPI";
import {CurrentUser} from "../stores/user.reducer";

export interface IProductCard {
    id: string;
    name: string;
    thumbnail: string;
    minPrice: number;
    maxPrice: number;
    rate: number;
}

const ProductRows = () => {

    const dispatch = useDispatch();

    const currentUser: CurrentUser = useSelector((state: RootState) => state.user.currentUser);

    const {products, isLoading} = useSelector((state: RootState) => state.productList);

    useEffect((): void => {
        getProducts();
    }, []);

    const getProducts = (): void => {
        axiosConfig.get("/products?status=true")
            .then((res: AxiosResponse<Page<ProductResponseDTO[]>>): void => {
                const productList: IProductCard[] = [];

                (res.data.content as ProductResponseDTO[]).map((product: ProductResponseDTO): void => {
                    if (currentUser && currentUser.accessToken && currentUser.role === "RETAILER" && currentUser.id == product.user?.id) {
                        return;
                    }

                    const productDetails: ProductDetailResponseDTO[] = product.productDetails ?? [];
                    const prices: number[] = productDetails
                        .map((productDetail: ProductDetailResponseDTO) => productDetail.price)
                        .filter((price: number | undefined): price is number => price !== undefined);
                    const minPrice: number = prices.length > 0 ? Math.min(...prices) : 0;
                    const maxPrice: number = prices.length > 0 ? Math.max(...prices) : 0;

                    const productCard: IProductCard = {
                        id: product.id ?? "",
                        name: product.name ?? "",
                        thumbnail: product.thumbnail ?? "",
                        minPrice: minPrice,
                        maxPrice: maxPrice,
                        rate: product.rate ?? 0,
                        // minPrice: Math.min(...product.productDetails.map((productDetail: ProductDetailResponseDTO) => productDetail.price)),
                        // maxPrice: Math.max(...product.productDetails.map((productDetail: ProductDetailResponseDTO) => productDetail.price)),
                    };

                    productList.push(productCard);
                });

                dispatch(setProductList({products: productList, isLoading: false}));
            })
            .catch(err => {
                console.log(err)
            });
    };

    return (
        <>
            <Skeleton loading={isLoading} active/>
            <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                {products.map((product: IProductCard) => (
                    <ProductCard key={product.id} product={product}/>
                ))}
            </div>
        </>
    );

};

export default ProductRows;