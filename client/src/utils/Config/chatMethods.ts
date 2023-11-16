import moment from "moment";
import { MessageInterface } from "../../Types/chat";
import { User } from "../../Types/loginUser";

export const getSender = (loggedUserId: string, usersArray: User[]) => {
    return usersArray[0]._id === loggedUserId ? usersArray[1] : usersArray[0];
}

export const groupByDate  = (messages: MessageInterface[]) => {
    return messages.reduce((groups: { [key: string]: MessageInterface[] }, message) => {
        const date = moment(message.createdAt).format('LL');
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(message);
        return groups;
    }, {});
}

export const truncate = (str: string, num: number) => {
    if (str.length <= num) {
        return str;
      }
      return str.slice(0, num) + '...';
}