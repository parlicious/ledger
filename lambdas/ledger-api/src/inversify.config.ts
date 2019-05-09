import { Container } from 'inversify';
import { DI } from './di';
import { AuthHandler } from './handlers/AuthHandler';
import { UserHandler } from './handlers/UserHandler';
import { UserRepo } from './repos/UserRepo';
import { UserService } from './services/UserService';

const container = new Container();

// repos
container.bind<UserRepo>(UserRepo).toSelf();

// services
container.bind<UserService>(UserService).toSelf();

// handlers
container.bind<UserHandler>(UserHandler).toSelf();
container.bind<AuthHandler>(AuthHandler).toSelf();

export { container };
