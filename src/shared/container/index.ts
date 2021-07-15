import { container } from 'tsyringe';

import IHashProvider from '@shared/container/hashProvider/models/IhashProvider';
import BCryptHashProvider from '@shared/container/hashProvider/implementations/BCryptHashProvider';
import '@modules/customer/providers';

container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);
