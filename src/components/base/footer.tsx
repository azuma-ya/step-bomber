export const Footer = () => {
  return (
    <footer className="sticky top-full h-(--footer-height) flex flex-col items-center justify-center">
      <p className="text-muted-foreground text-center">
        &copy; {new Date().getFullYear()} Azuma-ya
        <span className="hidden md:inline"> | </span>
        <span className="block text-sm md:inline md:text-base">
          This site uses Google Analytics.
        </span>
      </p>
    </footer>
  );
};
