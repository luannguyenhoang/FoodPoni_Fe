import React from "react";
import {DefaultLayout} from "../components/layout";
import ProductRows from "../components/product-rows";
import CarouselBanner from "../components/carousel-banner";
import ProductCategory from "../components/product-category";
import SearchPosition from "../components/search-position";
import {api} from "../utils/axios-config";
import {AxiosResponse} from "axios";
import {INITIAL_PAGE_API_RESPONSE, Page} from "../models/Page";
import {CategoryResponseDTO} from "../models/category/CategoryResponseAPI";

export async function getServerSideProps() {
    try {
        const res: AxiosResponse<Page<CategoryResponseDTO[]>> = await api.get("/product-categories?onlyParent=true");
        return {
            props: {
                ePage: res.data
            },
        };
    } catch (error) {
        console.error('Error fetching category page:', error);
    }
}

const Home = ({ePage = INITIAL_PAGE_API_RESPONSE}: { ePage: Page<CategoryResponseDTO[]> }) => {

    const sidebarContents: JSX.Element[] = [
        <ProductCategory categoryList={ePage.content}/>,
        <img className='rounded-md w-full'
             src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-GyDWnLZ77IVqwCBJYj3KSEafcAMiGAfJlj1kqG0U_Q&s"/>
    ]

    return (
        <DefaultLayout sidebarContents={sidebarContents}>
            <div className='grid gap-4 h-fit'>
                <div className='overflow-auto relative'>
                    <CarouselBanner/>
                    <SearchPosition/>
                </div>
                <ProductRows/>
            </div>
        </DefaultLayout>
    );

};

export default Home;
