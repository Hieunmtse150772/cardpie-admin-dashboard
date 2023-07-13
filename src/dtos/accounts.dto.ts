import User from 'src/models/user.model';

import PagingDto from './paging.dto';

interface AccountsDto extends PagingDto {
  data: Array<User>;
}

export default AccountsDto;
