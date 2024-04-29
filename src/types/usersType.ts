export interface usersType {
    userID?: number;
    email: string;
    userName: string;
    displayName: string;
    status: string | 'Active';
    roleName: string;
    roleID?: number | 1;
    password?: string;
}

// {
//     "userID": 97,
//     "userName": "admin",
//     "email": "triono.putra24@gmail.com",
//     "password": null,
//     "displayName": "Triono",
//     "createdDate": "0001-01-01T00:00:00",
//     "lastLogin": "2024-02-20T13:11:53.319875Z",
//     "status": "Active",
//     "salt": null,
//     "roleID": 1,
//     "roleName": "Administrator"
// },
