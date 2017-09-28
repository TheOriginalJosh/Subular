import { FactoryProvider } from '@angular/core';
import { MD5 } from 'crypto-js';
import { MD5_PROVIDER } from '../../subular-shared/md5.provider';

export const MD5_SERVICE: FactoryProvider = {
	provide: MD5_PROVIDER,
	useFactory: getMD5,
};

export function getMD5() {
	return { MD5 };
}