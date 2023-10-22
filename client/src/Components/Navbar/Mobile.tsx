//Library
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import classnames from "classnames";

//Icons
import { RiShoppingBag3Line } from "react-icons/ri";
import { IoFastFoodOutline, IoNutritionOutline } from "react-icons/io5";
import { BiDrink } from "react-icons/bi";

const MobileTabs = () => {
  const [allTypes] = useState([
    {
      id: "delivery",
      icon: <RiShoppingBag3Line />,
      name: "Delivery",
    },
    {
      id: "dining",
      icon: <IoFastFoodOutline />,
      name: "Dining Out",
    },
    {
      id: "night",
      icon: <BiDrink />,
      name: "Night Life",
    },
    {
      id: "nutri",
      icon: <IoNutritionOutline />,
      name: "Nutrition",
    },
  ]);

  const { type } = useParams();
  return (
    <div className="lg:hidden bg-white shadow-lg px-3 fixed bottom-0 z-10 w-full flex items-center justify-between md:justify-evenly border ">
      {allTypes.map((item) => (
        <Link to={`/${item.id}`} key={item.id} className="w-1/4">
          <div
            className={
              type === item.id
                ? "flex flex-col items-center text-xl text-zomato-400"
                : "flex flex-col items-center text-xl text-gray-500"
            }
          >
            <div
              className={
                type === item.id
                  ? "flex justify-center items-center flex-col w-full py-3 border-t-2 border-zomato-400"
                  : "flex justify-center items-center flex-col py-3 border-t-2 border-white"
              }
            >
              {item.icon}
              <h5 className="text-sm">{item.name}</h5>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

const LargeTabs = () => {
  const [allTypes] = useState([
    {
      id: "delivery",
      imageDefault:
        "https://b.zmtcdn.com/data/o2_assets/246bbd71fbba420d5996452be3024d351616150055.png",
      imageActive:
        "https://b.zmtcdn.com/data/o2_assets/c0bb85d3a6347b2ec070a8db694588261616149578.png",
      name: "Delivery",
      activeColor: "yellow",
    },
    {
      id: "dining",
      imageDefault:
        "https://b.zmtcdn.com/data/o2_assets/78d25215ff4c1299578ed36eefd5f39d1616149985.png",
      imageActive:
        "https://b.zmtcdn.com/data/o2_assets/30fa0a844f3ba82073e5f78c65c18b371616149662.png",
      activeColor: "blue",
      name: "Dining Out",
    },
    {
      id: `night`,
      imageDefault:
        "https://b.zmtcdn.com/data/o2_assets/01040767e4943c398e38e3592bb1ba8a1616150142.png",
      imageActive:
        "https://b.zmtcdn.com/data/o2_assets/855687dc64a5e06d737dae45b7f6a13b1616149818.png",
      activeColor: "purple",
      name: "Night life",
    },
    {
      id: `nutri`,
      imageDefault:
        "https://b.zmtcdn.com/data/o2_assets/54cad8274d3c3ec7129e0808a13b27c31616582882.png",
      imageActive:
        "https://b.zmtcdn.com/data/o2_assets/0f6dcb1aef93fa03ea3f91f37918f3bc1616649503.png",
      activeColor: "yellow",
      name: "Nutrition",
    },
  ]);

  const { type } = useParams();
  const activeColors = ["bg-yellow-100", "bg-purple-100", "bg-blue-100"]
  return (
    <>
      <div className="hidden lg:flex gap-14 container px-20 my-8 mx-auto">
        {allTypes.map((item) => (
          <Link to={`/${item.id}`} key={item.id}>
            <div
              className={classnames(
                "flex items-center gap-3 pb-2 transition duration-700 ease-in-out",
                { "border-b-2 border-zomato-400": type === item.id }
              )}
            >
              <div
                className={classnames(
                  "w-16 h-16 p-4 rounded-full",
                  { [`bg-${item.activeColor}-100`]: type === item.id },
                  { "bg-gray-100": type !== item.id }
                )}
              >
                <img
                  src={type === item.id ? item.imageActive : item.imageDefault}
                  alt="Food Tab Image"
                  className="w-full h-full"
                />
              </div>
              <h3
                className={
                  type === item.id
                    ? "text-xl text-zomato-400"
                    : "text-xl text-gray-500"
                }
              >
                {item.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

const FoodTabs = () => {
  return (
    <>
      <MobileTabs />
      <LargeTabs />
    </>
  );
};

export default FoodTabs;
