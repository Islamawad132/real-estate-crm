import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const ROLES_KEY = 'roles';

/**
 * Marks a route as publicly accessible — bypasses AuthGuard.
 *
 * Usage:
 *   @Public()
 *   @Get('health')
 *   health() { ... }
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

/**
 * Restricts a route to users with the specified roles.
 *
 * Usage:
 *   @Roles('admin', 'agent')
 *   @Get('listings')
 *   getListings() { ... }
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
