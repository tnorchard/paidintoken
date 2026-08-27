export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="pit-footer mt-8 w-full px-2 py-3">
      <hr className="mb-1 border-black" />
      <div className="footer-string flex flex-wrap items-center justify-between gap-2 px-2">
        <h4 className="text-sm font-medium">PaidinToken ™ {year}</h4>
        <h4 className="text-sm font-medium">
          <a
            href="mailto:admin@paidintoken.com"
            className="contact-email hover:text-[#0F3460]"
          >
            admin@paidintoken.com
          </a>
        </h4>
      </div>
    </footer>
  );
}
