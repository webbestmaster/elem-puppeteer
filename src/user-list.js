// @flow

import type {UserDataType} from './flow-types/user';

export const userList: Array<UserDataType> = [
    {
        login: 'WebMaster',
        password: '',
        iFrameUrl: '',
        urfin: {
            maxAttack: -1,
        },
        site: {
            url: 'http://elem.mobi',
            duel: '/duel',
            urfin: '/urfin',
            arena: '/survival',
        },
    },

    {
        login: '',
        password: '',
        iFrameUrl: 'https://mailru.elem.mobi?foo=bar',
        urfin: {
            maxAttack: 15,
        },
        site: {
            url: 'https://mailru.elem.mobi',
            duel: '/duel',
            urfin: '/urfin',
            arena: '/survival',
        },
    },

    /*
    {
        login: 'Убийца',
        password: '__',
        urfin: {
            maxAttack: 15,
        },
        siteUrl: {
            url: 'http://elem.mobi',
            duel: '/duel',
            urfin: '/urfin',
            arena: '/survival',
        }
    },
    */

    /*
    {
        login: 'Legione',
        password: '__',
        urfin: {
            maxAttack: 10
        }
    },
    */
];
