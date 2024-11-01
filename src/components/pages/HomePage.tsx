import { ProductRowsFilter } from "@/components/organisms/ProductRowsFilter";
import { fetchProductsAction } from "@/redux/modules/product.ts";
import ProductCategory from "../molecules/ProductCategory";
import { server } from "@/utils/server";
import { SidebarLayout } from "../templates/SidebarLayout";
import { CarouselBanner } from "../molecules/CarouselBanner";

export const HomePage = () => {
  return (
    <SidebarLayout
      sidebarContents={[
        <ProductCategory />,
        <img
          key={1}
          className="rounded-md w-full"
          src={server + "/upload/vertical-banner.png"}
          alt={""}
        />,
      ]}
    >
      <div className="grid gap-4 h-fit">
        <div className="overflow-auto relative">
          <CarouselBanner
            images={[
              "/public/7.webp",
              "/public/Fast-Food-Banner-Background-for-Wall-1.jpg",
            ]}
          />
          {/*<SearchPosition />*/}
        </div>
        <ProductRowsFilter
          action={fetchProductsAction({
            queryParams: {
              page: 0,
              pageSize: 10,
              sort: ["sales,desc"],
              status: true,
            },
          })}
        />
        {/*<div className="bg-white">*/}
        {/*  <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">*/}
        {/*    <h2 className="text-2xl font-bold tracking-tight text-gray-900">*/}
        {/*      Customers also purchased*/}
        {/*    </h2>*/}

        {/*    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">*/}
        {/*      <div className="group relative">*/}
        {/*        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">*/}
        {/*          <img*/}
        {/*            src="https://tailwindui.com/plus/img/ecommerce-images/product-page-01-related-product-01.jpg"*/}
        {/*            alt="Front of men&#039;s Basic Tee in black."*/}
        {/*            className="h-full w-full object-cover object-center lg:h-full lg:w-full"*/}
        {/*          />*/}
        {/*        </div>*/}
        {/*        <div className="mt-4 flex justify-between">*/}
        {/*          <div>*/}
        {/*            <h3 className="text-sm text-gray-700">*/}
        {/*              <a href="#">*/}
        {/*                <span*/}
        {/*                  aria-hidden="true"*/}
        {/*                  className="absolute inset-0"*/}
        {/*                ></span>*/}
        {/*                Basic Tee*/}
        {/*              </a>*/}
        {/*            </h3>*/}
        {/*            <p className="mt-1 text-sm text-gray-500">Black</p>*/}
        {/*          </div>*/}
        {/*          <p className="text-sm font-medium text-gray-900">$35</p>*/}
        {/*        </div>*/}
        {/*      </div>*/}
        {/*        <div className="group relative">*/}
        {/*            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">*/}
        {/*                <img*/}
        {/*                    src="https://tailwindui.com/plus/img/ecommerce-images/product-page-01-related-product-01.jpg"*/}
        {/*                    alt="Front of men&#039;s Basic Tee in black."*/}
        {/*                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"*/}
        {/*                />*/}
        {/*            </div>*/}
        {/*            <div className="mt-4 flex justify-between">*/}
        {/*                <div>*/}
        {/*                    <h3 className="text-sm text-gray-700">*/}
        {/*                        <a href="#">*/}
        {/*                <span*/}
        {/*                    aria-hidden="true"*/}
        {/*                    className="absolute inset-0"*/}
        {/*                ></span>*/}
        {/*                            Basic Tee*/}
        {/*                        </a>*/}
        {/*                    </h3>*/}
        {/*                    <p className="mt-1 text-sm text-gray-500">Black</p>*/}
        {/*                </div>*/}
        {/*                <p className="text-sm font-medium text-gray-900">$35</p>*/}
        {/*            </div>*/}
        {/*        </div>*/}
        {/*        <div className="group relative">*/}
        {/*            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">*/}
        {/*                <img*/}
        {/*                    src="https://tailwindui.com/plus/img/ecommerce-images/product-page-01-related-product-01.jpg"*/}
        {/*                    alt="Front of men&#039;s Basic Tee in black."*/}
        {/*                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"*/}
        {/*                />*/}
        {/*            </div>*/}
        {/*            <div className="mt-4 flex justify-between">*/}
        {/*                <div>*/}
        {/*                    <h3 className="text-sm text-gray-700">*/}
        {/*                        <a href="#">*/}
        {/*                <span*/}
        {/*                    aria-hidden="true"*/}
        {/*                    className="absolute inset-0"*/}
        {/*                ></span>*/}
        {/*                            Basic Tee*/}
        {/*                        </a>*/}
        {/*                    </h3>*/}
        {/*                    <p className="mt-1 text-sm text-gray-500">Black</p>*/}
        {/*                </div>*/}
        {/*                <p className="text-sm font-medium text-gray-900">$35</p>*/}
        {/*            </div>*/}
        {/*        </div>*/}
        {/*        <div className="group relative">*/}
        {/*            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">*/}
        {/*                <img*/}
        {/*                    src="https://tailwindui.com/plus/img/ecommerce-images/product-page-01-related-product-01.jpg"*/}
        {/*                    alt="Front of men&#039;s Basic Tee in black."*/}
        {/*                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"*/}
        {/*                />*/}
        {/*            </div>*/}
        {/*            <div className="mt-4 flex justify-between">*/}
        {/*                <div>*/}
        {/*                    <h3 className="text-sm text-gray-700">*/}
        {/*                        <a href="#">*/}
        {/*                <span*/}
        {/*                    aria-hidden="true"*/}
        {/*                    className="absolute inset-0"*/}
        {/*                ></span>*/}
        {/*                            Basic Tee*/}
        {/*                        </a>*/}
        {/*                    </h3>*/}
        {/*                    <p className="mt-1 text-sm text-gray-500">Black</p>*/}
        {/*                </div>*/}
        {/*                <p className="text-sm font-medium text-gray-900">$35</p>*/}
        {/*            </div>*/}
        {/*        </div>*/}
        {/*        <div className="group relative">*/}
        {/*            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">*/}
        {/*                <img*/}
        {/*                    src="https://tailwindui.com/plus/img/ecommerce-images/product-page-01-related-product-01.jpg"*/}
        {/*                    alt="Front of men&#039;s Basic Tee in black."*/}
        {/*                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"*/}
        {/*                />*/}
        {/*            </div>*/}
        {/*            <div className="mt-4 flex justify-between">*/}
        {/*                <div>*/}
        {/*                    <h3 className="text-sm text-gray-700">*/}
        {/*                        <a href="#">*/}
        {/*                <span*/}
        {/*                    aria-hidden="true"*/}
        {/*                    className="absolute inset-0"*/}
        {/*                ></span>*/}
        {/*                            Basic Tee*/}
        {/*                        </a>*/}
        {/*                    </h3>*/}
        {/*                    <p className="mt-1 text-sm text-gray-500">Black</p>*/}
        {/*                </div>*/}
        {/*                <p className="text-sm font-medium text-gray-900">$35</p>*/}
        {/*            </div>*/}
        {/*        </div>*/}
        {/*        <div className="group relative">*/}
        {/*            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">*/}
        {/*                <img*/}
        {/*                    src="https://tailwindui.com/plus/img/ecommerce-images/product-page-01-related-product-01.jpg"*/}
        {/*                    alt="Front of men&#039;s Basic Tee in black."*/}
        {/*                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"*/}
        {/*                />*/}
        {/*            </div>*/}
        {/*            <div className="mt-4 flex justify-between">*/}
        {/*                <div>*/}
        {/*                    <h3 className="text-sm text-gray-700">*/}
        {/*                        <a href="#">*/}
        {/*                <span*/}
        {/*                    aria-hidden="true"*/}
        {/*                    className="absolute inset-0"*/}
        {/*                ></span>*/}
        {/*                            Basic Tee*/}
        {/*                        </a>*/}
        {/*                    </h3>*/}
        {/*                    <p className="mt-1 text-sm text-gray-500">Black</p>*/}
        {/*                </div>*/}
        {/*                <p className="text-sm font-medium text-gray-900">$35</p>*/}
        {/*            </div>*/}
        {/*        </div>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>
    </SidebarLayout>
  );
};
