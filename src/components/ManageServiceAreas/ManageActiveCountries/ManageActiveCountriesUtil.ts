import { DEFAULT_TABLE_SIZE } from 'src/common/components/CustomDataTable/CustomDataTableUtil';

export const tableHeaders = ['Country Name', 'Currency', 'Status', 'Action'];

interface ICountry {
    id: number;
    countryName: string;
    countryISO: string;
    distanceUnit: string;
    currency: string;
    activeStatus: boolean;
}

interface ICountryListResponse {
    data: ICountry[];
    page: number;
    size: number;
    total: number;
}

function generateInitalCountryListData(): ICountryListResponse {
    return {
        data: [],
        page: 0,
        size: DEFAULT_TABLE_SIZE,
        total: 0,
    }
}
interface ICountryListTempFilter {
    searchKey: string;
}
function generateInitialTempFilterData(): ICountryListTempFilter {
    return {
        searchKey: '',
    }
}





export {ICountry,ICountryListTempFilter, ICountryListResponse, generateInitialTempFilterData,generateInitalCountryListData }