import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../constants';

export const AllowAnon = () => SetMetadata(IS_PUBLIC_KEY, true);
