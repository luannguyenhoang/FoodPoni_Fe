import {useDispatch, useSelector} from "react-redux";
import {Params, useParams} from "react-router-dom";
import {RootState} from "@/redux/store.ts";
import {useEffect} from "react";
import {Col, Pagination, Row} from "antd";
import {ProductLoading} from "@/components/atoms/productLoading.tsx";
import {ProductCard} from "@/components/molecules/productCard.tsx";
import {fetchProductsByProductCategoryRequest} from "@/redux/modules/product.ts";

export default function ProductCategoryWrapper() {

    const {pathVariable} = useParams<Params<string>>();

    const dispatch = useDispatch();

    const {page, isLoading} = useSelector((state: RootState) => state.product);

    useEffect(() => {
        if (pathVariable) {
            dispatch(fetchProductsByProductCategoryRequest(pathVariable));
        }
    }, [pathVariable]);


    if (isLoading) {
        return <ProductLoading/>;
    }

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Sản phẩm trong danh mục</h1>
            <Row gutter={[16, 24]}>
                {page.content.map((product) => (
                    <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                        <ProductCard key={product.id} product={product}/>
                    </Col>
                ))}
            </Row>
            <div className="mt-8 flex justify-center">
                <Pagination
                    current={page.number}
                    total={page.totalElements}
                    pageSize={page.size}
                    onChange={() => {
                    }}
                    showSizeChanger={false}
                />
            </div>
        </div>
    );
}