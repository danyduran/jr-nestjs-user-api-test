import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGO_DB_NAME, USER_COLLECTION } from './constants';
import { User, UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/soldcom', { connectionName: MONGO_DB_NAME }),
    MongooseModule.forFeature(
      [
        {
          name: User.name,
          collection: USER_COLLECTION,
          schema: UserSchema,
        },
      ],
      MONGO_DB_NAME,
    ),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
