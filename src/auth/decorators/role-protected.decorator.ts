import { SetMetadata } from '@nestjs/common';
import { Roles } from '../interfaces';

export const ROLE_TAG = 'roles'

export const RoleProtected = (...args: Roles[]) => {
    return SetMetadata(ROLE_TAG, args);
}
