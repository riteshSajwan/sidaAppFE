import { AUTH_BASE_URL } from 'src/constants';
import RestService from 'src/common/service/restService/restService';
import { IBestRider} from 'src/components/DashboardPage/topPerformer/TopPerformerUtils';


const getBestRider = (): Promise<IBestRider[]> => {
    return RestService.generateHeaders().then((headers) =>
      RestService.fetch(
        `${AUTH_BASE_URL}/api/auth/users/best-riders`,
        {
          method: 'GET',
          headers,
        }
      )
    );
  };
  
export { getBestRider }