import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';

import { MemberSchemaType } from '../schemas/member-type/types.js';
import { UserSchemaType } from '../schemas/user/types.js';
import { ProfileSchemaType } from '../schemas/profile/types.js';
import { PostSchemaType } from '../schemas/post/types.js';

export type DataLoaderType<T> = DataLoader<string, T | undefined, string>;

export type ContextType = {
  prismaClient: PrismaClient;
  dataloaders: {
    memberTypeDL: DataLoaderType<MemberSchemaType>;
    userDL: DataLoaderType<UserSchemaType>;
    profileDL: DataLoaderType<ProfileSchemaType>;
    postDL: DataLoaderType<PostSchemaType>;
  };
};