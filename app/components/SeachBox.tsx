'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

export default function SeachBox({name = '',placeholder=''}:{name:string,placeholder:string}) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [text, setText] = useState(searchParams.has('name')?searchParams.get('name'):'');
    const [value] = useDebounce(text, 500);
    const { replace } = useRouter();



    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set(name,value)
            replace(`${pathname}?${params.toString()}`);
        }
        else{
            params.delete(name);
            replace(`${pathname}?${params.toString()}`);
        }
    }, [value, replace]);
    
    return (
        <div className="w-full md:w-1/2 flex items-center">
            <label htmlFor="simple-search" className="sr-only">Search</label>
            <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                </div>
                <input
                    type="text"
                    id="simple-search"
                    onChange={(e) => {
                        setText(e.target.value);
                      }}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder={placeholder} />
            </div>
        </div>
    )
}
