import CarouselBanner from "@/components/carousel-banner.tsx";
import { ProductRowsFilter } from "@/components/organisms/productRowsFilter.tsx";
import { fetchProductsAction } from "@/redux/modules/product.ts";

export default function HomeWrapper() {
  return (
    <div className="grid gap-4 h-fit">
      <div className="overflow-auto relative">
        <CarouselBanner
          images={[
            "https://cdn.magicdecor.in/com/2023/09/29153817/Fast-Food-Banner-Background-for-Wall-1.jpg",
            "https://ik.imagekit.io/awwybhhmo/satellite_images/chinese/beyondmenu/hero/7.jpg?tr=w-3840,q-50",
            "https://cdn.magicdecor.in/com/2023/09/29153817/Fast-Food-Banner-Background-for-Wall-1.jpg",
            "https://ik.imagekit.io/awwybhhmo/satellite_images/chinese/beyondmenu/hero/7.jpg?tr=w-3840,q-50",
          ]}
        />
        {/*<SearchPosition />*/}
      </div>
      <ProductRowsFilter
        action={fetchProductsAction({
          queryParams: {
            page: 0,
            pageSize: 10,
            sort: "sales,desc",
            status: true,
          },
        })}
      />
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Customers also purchased
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            <div className="group relative">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                <img
                  src="https://tailwindui.com/plus/img/ecommerce-images/product-page-01-related-product-01.jpg"
                  alt="Front of men&#039;s Basic Tee in black."
                  className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <a href="#">
                      <span
                        aria-hidden="true"
                        className="absolute inset-0"
                      ></span>
                      Basic Tee
                    </a>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">Black</p>
                </div>
                <p className="text-sm font-medium text-gray-900">$35</p>
              </div>
            </div>
              <div className="group relative">
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                      <img
                          src="https://tailwindui.com/plus/img/ecommerce-images/product-page-01-related-product-01.jpg"
                          alt="Front of men&#039;s Basic Tee in black."
                          className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                      />
                  </div>
                  <div className="mt-4 flex justify-between">
                      <div>
                          <h3 className="text-sm text-gray-700">
                              <a href="#">
                      <span
                          aria-hidden="true"
                          className="absolute inset-0"
                      ></span>
                                  Basic Tee
                              </a>
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">Black</p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">$35</p>
                  </div>
              </div>
              <div className="group relative">
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                      <img
                          src="https://tailwindui.com/plus/img/ecommerce-images/product-page-01-related-product-01.jpg"
                          alt="Front of men&#039;s Basic Tee in black."
                          className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                      />
                  </div>
                  <div className="mt-4 flex justify-between">
                      <div>
                          <h3 className="text-sm text-gray-700">
                              <a href="#">
                      <span
                          aria-hidden="true"
                          className="absolute inset-0"
                      ></span>
                                  Basic Tee
                              </a>
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">Black</p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">$35</p>
                  </div>
              </div>
              <div className="group relative">
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                      <img
                          src="https://tailwindui.com/plus/img/ecommerce-images/product-page-01-related-product-01.jpg"
                          alt="Front of men&#039;s Basic Tee in black."
                          className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                      />
                  </div>
                  <div className="mt-4 flex justify-between">
                      <div>
                          <h3 className="text-sm text-gray-700">
                              <a href="#">
                      <span
                          aria-hidden="true"
                          className="absolute inset-0"
                      ></span>
                                  Basic Tee
                              </a>
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">Black</p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">$35</p>
                  </div>
              </div>
              <div className="group relative">
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                      <img
                          src="https://tailwindui.com/plus/img/ecommerce-images/product-page-01-related-product-01.jpg"
                          alt="Front of men&#039;s Basic Tee in black."
                          className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                      />
                  </div>
                  <div className="mt-4 flex justify-between">
                      <div>
                          <h3 className="text-sm text-gray-700">
                              <a href="#">
                      <span
                          aria-hidden="true"
                          className="absolute inset-0"
                      ></span>
                                  Basic Tee
                              </a>
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">Black</p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">$35</p>
                  </div>
              </div>
              <div className="group relative">
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                      <img
                          src="https://tailwindui.com/plus/img/ecommerce-images/product-page-01-related-product-01.jpg"
                          alt="Front of men&#039;s Basic Tee in black."
                          className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                      />
                  </div>
                  <div className="mt-4 flex justify-between">
                      <div>
                          <h3 className="text-sm text-gray-700">
                              <a href="#">
                      <span
                          aria-hidden="true"
                          className="absolute inset-0"
                      ></span>
                                  Basic Tee
                              </a>
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">Black</p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">$35</p>
                  </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
