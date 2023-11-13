import { User } from "../../Types/loginUser";

const UserCard = ({ user }: { user: User }) => {
  return (
    <div
      className="flex w-full px-4 py-2 mb-5 items-center justify-between transition duration-100 
                                    ease-in-out rounded-lg shadow-md hover:scale-95 hover:rounded-lg cursor-pointer 
                                    bg-[#E8E8E8] hover:bg-blue-gray-600 group"
    >
      <div className="s) => setLimt-3 flex items-center space-x-2">
        <img
          className="inline-block h-12 w-12 rounded-full"
          src={
            user.dp
              ? user.dp
              : "https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png"
          }
          alt="user dp"
        />
        <span className="flex flex-col">
          <span className="text-[14px] font-medium text-gray-900 group-hover:text-white group-hover:font-bold">
            {user.name}
          </span>
          <span className="text-[11px] font-medium text-gray-500 group-hover:text-white group-hover:font-bold">
            @{user.username}
          </span>
        </span>
      </div>
    </div>
  );
};

export default UserCard;
