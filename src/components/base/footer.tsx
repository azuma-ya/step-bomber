export const Footer = () => {
  return (
    <footer className="sticky top-full h-(--footer-height) flex flex-col items-center justify-center gap-2">
      <p className="text-muted-foreground text-center">
        &copy; {new Date().getFullYear()} Azuma-ya
        <span className="hidden md:inline"> | </span>
        <span className="hidden text-sm md:inline md:text-base">
          This site uses Google Analytics.
        </span>
      </p>
      <a
        href="https://www.flaticon.com/free-icons/profile-avatar"
        title="profile avatar icons"
        className="text-muted-foreground text-center text-sm"
        target="_blank"
        rel="noopener noreferrer"
      >
        Profile avatar icons created by Loka Design - Flaticon
      </a>
    </footer>
  );
};
