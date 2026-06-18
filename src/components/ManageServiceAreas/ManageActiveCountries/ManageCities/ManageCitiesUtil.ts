import { DEFAULT_TABLE_SIZE } from 'src/common/components/CustomDataTable/CustomDataTableUtil';
import { ITaxInfo } from 'src/components/ManageServiceAreas/ManageActiveCountries/ManageCities/add/AddCityUtil';

interface IActiveCity {
    id: number;
    cityName: string;
    radius: string;
    taxes: ITaxInfo[];
    activeStatus: boolean;
}

interface IActiveCityListResponse {
    data: IActiveCity[];
    page: number;
    size: number;
    total: number;
}
interface ICityListTempFilter {
    searchKey: string;
}

function generateIntialActiveCityData(): IActiveCityListResponse {
    return {
        data: [],
        page: 0,
        size: DEFAULT_TABLE_SIZE,
        total: 0,
    }
}
function generateInitialTempFilterData(): ICityListTempFilter {
    return {
        searchKey: '',
    }
}
const tableHeaders = ['City Name', 'Radius', 'Action'];

export { IActiveCityListResponse,IActiveCity, ICityListTempFilter, generateIntialActiveCityData, generateInitialTempFilterData, tableHeaders, }

