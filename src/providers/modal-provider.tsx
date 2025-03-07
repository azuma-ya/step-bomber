import { AuthModal } from "@/components/modal/auth-modal";
import { ResultModal } from "@/components/modal/result-modal";

export const ModalProvider = () => {
  return (
    <>
      <ResultModal />
      <AuthModal />
    </>
  );
};
