import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";

interface StatisticsCardProps {
  IconComponent: React.ElementType;
  iconColor: string;
  colorIntensity: string;
  header: string;
  count: number;
}

const iconColor = ["socioverse", "orange", "yellow", "green", "blue", "indigo", "purple", "pink", "red", "gray", "true-gray", "cool-gray", "blue-gray"]

const StatisticsCard = ({ IconComponent, iconColor, colorIntensity, header, count }: StatisticsCardProps) => {
  return (
    <>
      <Card className="w-60">
        <CardHeader
          variant="gradient"
          className= {`absolute -mt-4 grid h-16 w-16 place-items-center bg-${iconColor}-500 rounded-full shadow-lg}`}
        >
          <IconComponent className="text-white text-xl" />
        </CardHeader>
        <CardBody className="p-4 text-right">
          <Typography
            variant="small"
            className="font-mono font-extrabold text-lg text-blue-gray-600"
          >
            {header}
          </Typography>
          <Typography variant="h4" color="blue-gray">
            {count}
          </Typography>
        </CardBody>
      </Card>
    </>
  );
};

export default StatisticsCard;
