import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';

import { MemberSchemaType } from '../schemas/member-type/types.js';
import { ProfileSchemaType } from '../schemas/profile/types.js';
import { PostSchemaType } from '../schemas/post/types.js';
import { UserSchemaType } from '../schemas/user/types.js';

export const memberTypeDL = (prismaClient: PrismaClient) => {
  const dl = new DataLoader(async (ids: Readonly<string[]>) => {
    const memberTypes: MemberSchemaType[] = await prismaClient.memberType.findMany({
      where: { id: { in: ids as string[] } },
    });

    const memberTypesByIds = ids.map((id) =>
      memberTypes.find((memberType) => memberType.id === id),
    );

    return memberTypesByIds;
  });

  return dl;
};

export const profileDL = (prismaClient: PrismaClient) => {
  const dl = new DataLoader(async (ids: Readonly<string[]>) => {
    const profiles: ProfileSchemaType[] = await prismaClient.profile.findMany({
      where: { userId: { in: ids as string[] } },
    });

    const profilesByIds = ids.map((id) =>
      profiles.find((profile) => profile.userId === id),
    );

    return profilesByIds;
  });
  return dl;
};

export const postDL = (prismaClient: PrismaClient) => {
  const dl = new DataLoader(async (ids: Readonly<string[]>) => {
    const posts: PostSchemaType[] = await prismaClient.post.findMany({
      where: { authorId: { in: ids as string[] } },
    });

    const postsByIds = ids.map((id) => posts.filter((post) => post.authorId === id));

    return postsByIds;
  });

  return dl;
};

export const userDL = (prismaClient: PrismaClient) => {
  const dl = new DataLoader(async (ids: Readonly<string[]>) => {
    const users: UserSchemaType[] = await prismaClient.user.findMany({
      where: { id: { in: ids as string[] } },
      include: { userSubscribedTo: true, subscribedToUser: true },
    });

    const usersByIds = ids.map((id) => users.find((user) => user.id === id));

    return usersByIds;
  });

  return dl;
};

const getDL = (prismaClient: PrismaClient) => {
  return {
    userDataLoader: userDL(prismaClient),
    memberTypeDataLoader: memberTypeDL(prismaClient),
    profileDataLoader: profileDL(prismaClient),
    postDataLoader: postDL(prismaClient),
  };
};

export default getDL;
