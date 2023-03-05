import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MONGO_DB_NAME } from './constants';
import { User, UserDoc } from './schemas/user.schema';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  constructor(@InjectModel(User.name, MONGO_DB_NAME) private userModel: Model<UserDoc>) {}

  async createUser(user: Partial<User>): Promise<User> {
    const newUser = new this.userModel(user);
    return await newUser.save();
  }

  async deleteUser(_id: string): Promise<User> {
    return await this.userModel.findOneAndDelete({ _id });
  }

  async findByObjectId(_id: string): Promise<User> {
    try {
      const user = await this.userModel.findById(_id);
      return user;
    } catch (e) {
      this.logger.error(e.message);
      return null;
    }
  }

  async findByUserName(username: string): Promise<User> {
    return await this.userModel.findOne({username});
  }

  async patchUser(_id: string, user: Partial<User>): Promise<User> {
    return await this.userModel.findByIdAndUpdate(_id, user, {new: true});
  }

  async searchUser(user: Partial<User>): Promise<User> {
    return await this.userModel.findOne(user)
  }
}
