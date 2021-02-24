export class User {
    constructor(
        public _id: string,
        public firstName: string,
        public lastName: string,
        public username: string,
        public email: string,
        public password: string,
        public role: string,
        public image: string
    ) { }
}
