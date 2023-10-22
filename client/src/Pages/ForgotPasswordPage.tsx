import { useState } from "react"
import MailInput from "../Components/ForgotPassword/MailInput"
import ChangePasswordForm from "../Components/ForgotPassword/ChangePasswordForm"

const ForgotPasswordPage = () => {
  const [proceed , setProceed] = useState<boolean>(false)
  const [email, setEmail] = useState<string>("")
  return (
    <>
        {!proceed && <MailInput setProceed={setProceed} setEmail={setEmail} />}
        {proceed && <ChangePasswordForm email={email} />}
    </>
  )
}

export default ForgotPasswordPage