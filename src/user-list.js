// @flow

import type {UserDataType} from './flow-types/user';

const originalGameUrl = 'http://elem.mobi';
const fuckingMailRuGameUrl = 'https://mailru.elem.mobi';

export const userList: Array<UserDataType> = [
    {
        login: 'WebMaster',
        password: '___',
        iFrameUrl: '',
        urfin: {
            maxHandleAttack: -1,
        },
        siteUrl: originalGameUrl,
    },

    {
        login: '',
        password: '',
        iFrameUrl:
            fuckingMailRuGameUrl +
            '/?appid___',
        urfin: {
            maxHandleAttack: 15,
        },
        siteUrl: fuckingMailRuGameUrl,
    },

    {
        login: 'Убийца',
        password: '___',
        iFrameUrl: '',
        urfin: {
            maxHandleAttack: 15,
        },
        siteUrl: originalGameUrl,
    },

    {
        login: 'Legione',
        password: '___',
        iFrameUrl: '',
        urfin: {
            maxHandleAttack: 5,
        },
        siteUrl: originalGameUrl,
    },

    {
        login: 'Thunder Bird',
        password: '___',
        iFrameUrl: '',
        urfin: {
            maxHandleAttack: 2,
        },
        siteUrl: originalGameUrl,
    },
];
