import { User } from "../../Types/loginUser";

export const getSender = (loggedUserId: string, usersArray: User[]) => {
    return usersArray[0]._id === loggedUserId ? usersArray[1] : usersArray[0];
}