'use client'

import { Pagination } from "flowbite-react";
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from "react";


export default function PaginationComp({ total = 10 }: { total: number }) {

  const searchParams = useSearchParams();
  const [currentPage,setCurrentPage] = useState(searchParams.has('page')?Number(searchParams.get('page')):1)
  const [limit,setLimit] = useState(searchParams.has('limit')?Number(searchParams.get('limit')):10)
  const totalPages = Math.ceil(total / limit);
  const { replace } = useRouter();
  const pathname = usePathname();

  function handlePageChange(page:number){
    const params = new URLSearchParams(searchParams);
    params.set('page',page.toString())
    params.set('limit',limit.toString())
    setCurrentPage(page);
    setLimit(limit);
    replace(`${pathname}?${params.toString()}`);

  }

  return (
    <div className="flex overflow-x-auto sm:justify-center py-5">
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page)=>{handlePageChange(page)}} showIcons />
    </div>

  );
}
