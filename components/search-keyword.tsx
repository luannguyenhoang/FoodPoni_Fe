import {NextRouter, useRouter} from 'next/router';
import {Button, Input, Space} from 'antd';
import React from 'react';

const SearchKeyword = () => {

    const router: NextRouter = useRouter();

    const search = (value: string): void => {
        router.push('/products?search=' + value);
        console.log('search')
    };

    return (
        <Space.Compact className='w-full hidden md:flex'>
            <Input size='large' placeholder='input keyword here...'/>
            <Button size='large' type='primary' onClick={() => search('') }>Search</Button>
        </Space.Compact>
    );

};

export default SearchKeyword;