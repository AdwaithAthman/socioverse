import { Button } from "@material-tailwind/react";
import { toast } from "react-toastify";
import { BsFillInfoCircleFill } from "react-icons/bs";

const ConfirmDeleteToast = ({
  onDelete,
  message,
}: {
  onDelete: () => void;
  message: string;
}) => (
  <div className="flex items-start justify-between gap-5">
    <BsFillInfoCircleFill className="text-4xl" />
    <div>
      <p>{message}</p>
      <div className="mt-2 flex items-center gap-2">
        <Button
          variant="outlined"
          size="sm"
          className="rounded-full text-black border-black"
          onClick={() => {
            toast.dismiss();
          }}
        >
          Cancel
        </Button>
        <Button
          className="rounded-full bg-socioverse-500"
          size="sm"
          onClick={() => {
            onDelete();
          }}
        >
          Ok
        </Button>
      </div>
    </div>
  </div>
);

export default ConfirmDeleteToast;
