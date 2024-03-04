import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';

import { UserSchemaType } from '../schemas/user/types.js';
import { ProfileSchemaType } from '../schemas/profile/types.js';
import { PostSchemaType } from '../schemas/post/types.js';
import { MemberSchemaType } from '../schemas/member-type/types.js';

export type DataLoaderType<T> = DataLoader<string, T | undefined, string>;

export type ContextType = {
  prismaClient: PrismaClient;
  dataloaders: {
    userDataLoader: DataLoaderType<UserSchemaType>;
    profileDataLoader: DataLoaderType<ProfileSchemaType>;
    postDataLoader: DataLoaderType<PostSchemaType>;
    memberTypeDataLoader: DataLoaderType<MemberSchemaType>;
  };
};