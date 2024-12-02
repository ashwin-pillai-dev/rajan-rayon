'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Select from 'react-select';

function toCamelCase(str:string) {
    return str
      .toLowerCase() // Convert the whole string to lowercase
      .split(' ')    // Split the string by spaces
      .map((word, index) =>
        index === 0
          ? word // Keep the first word in lowercase
          : word.charAt(0).toUpperCase() + word.slice(1) // Capitalize the first letter of subsequent words
      )
      .join(''); // Join the words back together
  }

export default function DropDownFilter({ options,field,placeholder }:{options:any,field:string,placeholder:string}) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const [selectedValue,setSelectedValue] = useState<string | null>(searchParams.has(toCamelCase(placeholder))?searchParams.get(toCamelCase(placeholder)):'');
    const defaultOption = selectedValue?options.find((option:any) => option[field] ==selectedValue ):null;

    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        if (selectedValue) {            
            params.set(toCamelCase(placeholder),selectedValue)
            replace(`${pathname}?${params.toString()}`);
        }
        else{
            params.delete(toCamelCase(placeholder));
            replace(`${pathname}?${params.toString()}`);
        }
    }, [selectedValue, replace]);

    return (
        <div className="w-full md:w-1/3 flex items-center bg-red-100">
            <Select
                isClearable={true}
                options={options}
                instanceId={1}
                getOptionLabel={(option: any) => option.name}
                getOptionValue={(option: any) => option.id}
                onChange={(option)=>{option?setSelectedValue(option[field]):setSelectedValue('')}}
                className='w-full'
                placeholder={placeholder}
                defaultValue={defaultOption}
            />
        </div>

    )
}
