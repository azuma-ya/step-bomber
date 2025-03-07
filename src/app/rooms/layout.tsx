import { Container } from "@/components/layout/container";

const RoomLayout = ({ children }: { children: React.ReactNode }) => {
  return <Container maxWidth="md">{children}</Container>;
};

export default RoomLayout;
