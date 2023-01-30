/*сначала вызываются множественные postsLoader.load(id) - хоть 100 штук

под капотом даталодер "накапливает" эти айдишники и передаёт их массивом в функцию, переданную в конструктор даталодера

там, получив массив userIds мы делаем 1 запрос в БД и формируем мапу со структурой, которую ты описала, и в ответе отдаём массив в такой же очередности, как пришли айдишники в userIds (изменено)
[16:26]
читать тут https://www.npmjs.com/package/dataloader - Batch function*/

import * as DataLoader from 'dataloader';

/*const userLoader = new DataLoader(keys => myBatchGetUsers(keys))

const profileLoader

const postsLoader

const memberTypeLoader*/