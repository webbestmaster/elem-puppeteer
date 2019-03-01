// @flow

export type UserDataType = {|
    +login?: string,
    +password?: string,
    +iFrameUrl?: string,
    +urfin: {|
        +maxAttack: number
    |}
|};
