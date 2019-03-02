// @flow

export type UserDataType = {|
    +login: string,
    +password: string,
    +iFrameUrl: string,
    +urfin: {|
        +maxAttack: number,
    |},
    +site: {|
        +url: string,
        +duel: "/duel",
        +urfin: "/urfin",
        +arena: "/survival",
    |},
|};
