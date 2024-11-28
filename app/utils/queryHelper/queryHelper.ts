import { requestParams, Filter } from "./queryHelper.types";


export const get = async (url: string, params: requestParams) => {
    try {
        console.log('process.env.turso-db-url ', process.env.TURSO_DATABASE_URL);
        
        let proccessedUrl = `${process.env.API_URL + url}?page=${params.page}&limit=${params.limit}&orderBy=${params.orderBy}`
        // let proccessedUrl = `${'http://localhost:3000/api' + url}?page=${params.page}&limit=${params.limit}&orderBy=${params.orderBy}`
        if (params?.filters?.length > 0) {
            const filters: string = getStringFromFilters(params.filters);
            proccessedUrl = `${proccessedUrl}&${filters}`
        }
        console.log('proccessedUrl');
        console.log(proccessedUrl);
        
        const res = await fetch(proccessedUrl,{cache:'no-cache'});
        console.log('response');
        console.log(res);


        return res;
    } catch (error: any) {
        console.log(error.message);

        throw new Error(error.message)

    }
}

const getStringFromFilters = (filters: Filter[]): string => {
    let filterString = '';
    filters.forEach((filter: Filter, index) => {
        if (index != filters.length - 1)
            filterString += `filter${index + 1}=${filter.field}||${filter.cond}||${filter.value}&`
        else
            filterString += `filter${index + 1}=${filter.field}||${filter.cond}||${filter.value} `

    })
    return filterString

}



