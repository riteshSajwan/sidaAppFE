import { DEFAULT_TABLE_SIZE } from 'src/common/components/CustomDataTable/CustomDataTableUtil';

interface IRateTierCity {
    id: number;
    cityName: number;
    stateName: number;
    countryName: number;
    regionName: string;
    activeStatus: boolean;
    rateTierAdded:boolean;
    cityId:number;
}


interface IRateTierCityListResponse {
    data: IRateTierCity[];
    page: number;
    size: number;
    total: number;
}

interface IRateTierCityListFilter {
    name: string;
    searchKey: string;
    active: string;
    sortField: string;
    sortOrder: string
}

function generateRateTierCityListData(): IRateTierCityListResponse {
    return {
        data: [],
        page: 0,
        size: DEFAULT_TABLE_SIZE,
        total: 0,
    }
}

export {
    generateRateTierCityListData, IRateTierCity, IRateTierCityListFilter, IRateTierCityListResponse
};

