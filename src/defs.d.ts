declare var chrome;

declare const enum MsgType {
    parse,
    show,
    hide,
    color
}

declare const enum OptionEl {
    _c0, _c1, _c2, _c3, _c4, _c5,
    _c6, _c7, _c8, _c9,
    _active, _onlybody,
    _message, count,

    c0 = 1 << _c0,
    c1 = 1 << _c1,
    c2 = 1 << _c2,
    c3 = 1 << _c3,
    c4 = 1 << _c4,
    c5 = 1 << _c5,
    c6 = 1 << _c6,
    c7 = 1 << _c7,
    c8 = 1 << _c8,
    c9 = 1 << _c9,
    active = 1 << _active,
    onlybody = 1 << _onlybody,
    message = 1 << _message,
    all = (1 << count) -1
}