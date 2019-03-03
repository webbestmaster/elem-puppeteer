// @flow

export type UserDataType = {|
    +login: string,
    +password: string,
    +iFrameUrl: string,
    +urfin: {|
        +maxHandleAttack: number,
        +maxAutoAttack: number,
    |},
    +siteUrl: string,
    // +site: {|
    //     +url: string,
    // +duel: "/duel",
    // +urfin: "/urfin",
    // +arena: "/survival",
    // |},
|};
