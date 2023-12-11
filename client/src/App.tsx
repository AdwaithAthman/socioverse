import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

//imports from Components
import ComplexNavbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import AccountVerificationPopup from "./Components/AccountVerificationPopup";

//importing types
import { StoreType } from "./Redux/Store";

const App = () => {
  const user = useSelector((state: StoreType) => state.auth.user);
  const [isAccountVerified, setIsAccountVerified] = useState<boolean>(true);
  const [accountVerifyPopupOpen, setAccountVerifyPopupOpen] =
    useState<boolean>(false);

  useEffect(() => {
    if (user) {
      setIsAccountVerified(user.isAccountVerified);
    }
  }, [user]);

  useEffect(() => {
    if (!isAccountVerified) {
      setAccountVerifyPopupOpen(true);
    } else {
      setAccountVerifyPopupOpen(false);
    }
  }, [isAccountVerified]);

  const handleAccountVerifyPopup = () => {
    setAccountVerifyPopupOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center">
      <ComplexNavbar />
      <div className="my-5 lg:pt-20 pt-16 pb-16 lg:pb-0 max-w-[1480px] w-full mx-auto px-4 no-scollbar">
        <Outlet />
      </div>
      <Footer />                                  
      {/* popup windows */}
      <AccountVerificationPopup
        handleAccountVerifyPopup={handleAccountVerifyPopup}
        accountVerifyPopupOpen={accountVerifyPopupOpen}
        setIsAccountVerified={setIsAccountVerified}
      />
    </div>
  );
};

export default App;
