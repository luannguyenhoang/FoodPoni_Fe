import {NextRouter, useRouter} from "next/router";
import {DefaultLayout} from "./_layout";
import React, {useEffect, useState} from "react";
import {Button, Card, notification, Radio, Rate, Result} from "antd";
import ProductGallery from "../components/product-gallery";
import ProductCart from "../components/product-cart";
import {AxiosResponse} from "axios";
import ProductComment from "../components/product-comment";
import {AddressAPIResponse} from "../models/address/AddressAPIResponse";
import {useSelector} from "react-redux";
import {RootState} from "../stores";
import {ParsedUrlQuery} from "querystring";
import {api} from "../utils/axios-config";
import {server} from "../utils/server";
import {ProductAPIResponse} from "../models/product/ProductAPIResponse";
import {ProductDetailAPIResponse} from "../models/product_detail/ProductDetailAPIResponse";
import {OrderItemAPIResponse} from "../models/order_item/OrderItemResponseAPI";
import {RateAPIResponse} from "../models/rate/RateAPIResponse";

export interface IProduct {
    id: string;
    name: string;
    shortDescription: string;
    productDetails: IProductDetail[];
    retailer: IRetailer;
}

export interface IProductDetail {
    id: string;
    name: string;
    price: number,
    description: string;
    images: string[];
    rate: number;
    rateCount: number;
    quantityCount: number;
}

export interface IRetailer {
    id: string;
    avatar: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    username: string;
}

export async function getServerSideProps(context: { params: ParsedUrlQuery }) {
    const {pid} = context.params;
    try {
        const res: AxiosResponse<ProductAPIResponse> = await api.get('/products/' + pid);
        const product: ProductAPIResponse = res.data;

        const productMapped: IProduct = {
            id: product.id ?? "",
            name: product.name ?? "",
            shortDescription: product.shortDescription ?? "",
            retailer: product.user && {
                id: product.user.id ?? "",
                avatar: product.user.avatar ?? "",
                firstName: product.user.firstName ?? "",
                lastName: product.user.lastName ?? "",
                phoneNumber: product.user.phoneNumber ?? "",
                username: product.user.username ?? "",
            },
            productDetails: product.productDetails && product.productDetails.map((productDetail: ProductDetailAPIResponse): IProductDetail => {
                let rateSum: number = 0;
                let rateCount: number = 0;
                let quantityCount: number = 0;

                productDetail.orderItems?.forEach((orderItem: OrderItemAPIResponse) => {
                    const quantity: number = orderItem.quantity ?? 0;
                    quantityCount += quantity;

                    if (orderItem.rate) {
                        rateSum += orderItem.rate.rate;
                        rateCount++;
                    }
                });

                const averageRate: number = rateCount > 0 ? rateSum / rateCount : 0;
                return {
                    id: productDetail.id ?? "",
                    name: productDetail.name ?? "",
                    price: productDetail.price ?? 0,
                    description: productDetail.description ?? "",
                    images: productDetail.images ?? [],
                    rate: averageRate,
                    rateCount: rateCount,
                    quantityCount: quantityCount,
                }
            })
        };

        return {
            props: {
                product: productMapped,
            },
        };
    } catch (error) {
        console.error('Error fetching product:', error);
    }
}

const ProductDetails = ({product}: {product: IProduct}) => {

    const router: NextRouter = useRouter();

    const currentShippingAddress: AddressAPIResponse = useSelector((state: RootState) => state.address.shippingAddress);

    const [isError, setIsError] = useState<boolean>(false);

    const [isLoadingRate, setLoadingRate] = useState<boolean>(false);

    const [rates, setRates] = useState<RateAPIResponse[]>([]);

    useEffect(() => {
        if (product && product.productDetails && product.productDetails.length > 0) {
            setProductDetailSelected(product.productDetails[0]);
            getRates(product.productDetails && product.productDetails[0].id);
        }
    }, [product]);

    const getRates = (productDetailId: string | undefined) => {
        setLoadingRate(true);
        api.get(`/products/rate/${productDetailId}`)
            .then(function (res: AxiosResponse<RateAPIResponse[]>) {
                setRates(res.data);
            })
            .catch(function (res) {
                notification.open({
                    type: 'error',
                    message: 'Order message',
                    description: res.message
                });
            }).finally(() => {
            setLoadingRate(false);
        })
    }

    const [productDetailSelected, setProductDetailSelected] = useState<IProductDetail>();

    const changeProductDetailSelected = (productDetail: IProductDetail): void => {
        setProductDetailSelected(productDetail);
        getRates(productDetail.id);
    }

    const {
        id,
        images,
        name: productDetailName,
        price,
        description
    } = productDetailSelected || {};

    return (
        <DefaultLayout>
            {isError ? (<Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={<Button type="primary" onClick={() => router.push('/')}>Back Home</Button>}
            />) : (
                <>
                    {product && (
                        <div className='grid gap-4'>
                            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[2fr_3fr_2fr] gap-4'>
                                <ProductGallery images={images ?? []}/>
                                <div className='grid gap-4'>
                                    <Card size='small'>
                                        <h2 className='text-xl'>{product.name + (productDetailName ? ' - ' + productDetailName : '')}</h2>
                                        <div className="my-2">
                                            <span className="border-r-2 py-1 pr-2">
                                                <span className="m-1 border-b-2 text-lg">{(productDetailSelected?.rate ? productDetailSelected.rate.toFixed(1) : 0) + ""}</span>
                                                <span> </span>
                                                <Rate allowHalf disabled value={productDetailSelected?.rate}
                                                      className="text-xs mr-[8px]"
                                                />
                                            </span>
                                            <span className="border-r-2 py-1 px-4 hidden md:inline">
                                                <span className="text-lg m-1 border-b-2">{productDetailSelected?.rateCount}</span> Đánh giá</span>
                                            <span className="border-r-2 py-1 px-4">
                                                <span className="text-lg m-1 border-b-2">{productDetailSelected?.quantityCount}</span> Lượt bán</span>
                                        </div>
                                        <h3 className='text-2xl font-semibold'>${price}</h3>
                                    </Card>
                                    <Card hidden={product.productDetails?.length == 1} size='small' title='Loại sản phẩm' className="static">
                                        {(product.productDetails && product.productDetails.length > 1) && (
                                            <Radio.Group defaultValue={product.productDetails[0].name || "default"}>
                                                {(product?.productDetails || []).map((productDetail: IProductDetail) => (
                                                    <Radio.Button key={productDetail.id}
                                                                  value={productDetail.name || "default"}
                                                                  onClick={() => changeProductDetailSelected(productDetail)}
                                                                  className="!rounded-lg m-2 static hover:static border-[1px]"
                                                    >
                                                        {productDetail.name || "Default"}
                                                    </Radio.Button>
                                                ))}
                                            </Radio.Group>
                                        )}
                                    </Card>
                                    <Card size='small' title='Thông tin vận chuyển' loading={Object.keys(currentShippingAddress).length === 0}>
                                        <div>{currentShippingAddress.address}</div>
                                    </Card>
                                    <Card size='small' title='Mô tả ngắn'>
                                        <div className="text-black"
                                             dangerouslySetInnerHTML={{__html: product.shortDescription || ''}}></div>
                                    </Card>
                                    <Card size='small' title='Mô tả'>
                                        <div className="text-black"
                                             dangerouslySetInnerHTML={{__html: description || ''}}></div>
                                    </Card>
                                </div>

                                <ProductCart
                                    id={id!}
                                    price={price!}
                                    thumbnail={images && images.length > 0 ? server + images[0] : ""}
                                    name={product.name + (productDetailName ? ' - ' + productDetailName : '')}
                                    retailer={product.retailer!}
                                />
                            </div>
                            <ProductComment data={rates} isLoading={isLoadingRate}/>
                        </div>
                    )}
                </>
            )}
        </DefaultLayout>
    );
};

export default ProductDetails;
